var app = angular.module("TodoApp.Auth", ['ngRoute']);

app.config([ "$routeProvider", function($routeProvider) {
    $routeProvider
    .when('/signup', {
        templateUrl: './components/auth/signup/signup.html',
        controller: 'SignupController'
    })
    .when('/login', {
        templateUrl: './components/auth/login/login.html',
        controller: 'LoginController'
    })
    .when('/logout', {
        templateUrl: './components/auth/logout/logout.html',
        controller: 'LogoutController'
    })
}]);

app.service("TokenService", [function() {
    var userToken = 'token';

    this.setToken = function(token) {
        localStorage[userToken] = token;
    }

    this.getToken = function() {
        return localStorage[userToken];
    }

    this.removeToken = function() {
        localStorage.removeItem(userToken);
    }
}])

app.service("UserService", ["$http", "$location", "TokenService", function($http, $location, TokenService) {
    var self = this;
    
    
    this.signup = function(userObj) {
        return $http.post('/auth/signup', userObj)
        .then(function(response) {
            return(response.data)
        })
    }

    this.login = function(userObj){
        return $http.post('/auth/login', userObj)
        .then(function(response) {
            TokenService.setToken(response.data.token);
            self.user = response.data.user;
            return (response)
        })
    }

    this.logout = function() {
        TokenService.removeToken();
        $location.path('/logout')
    }

    this.isAuthenticated = function() {
        return !!TokenService.getToken();
    }
}]);

app.factory("AuthInterceptor", ["$q", "$location", "TokenService", function($q, $location, TokenService) {
    return {
        request: function (config) {
            var token = TokenService.getToken();
            if(token) {
                config.headers = config.headers || {};
                config.headers.Authorization = "Bearer " + token; 
            }
            return config;
        },
        responseError: function(response) {
            if(response.status === 401) {
                TokenService.removeToken();
                $location.path('/login');
            }
            return $q.reject(response);
        }
    }
}]);

app.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})