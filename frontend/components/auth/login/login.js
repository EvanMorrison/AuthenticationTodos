angular.module("TodoApp.Auth")
.controller("LoginController", ["$scope", "$location", "UserService", function($scope, $location, UserService) {
    $scope.user = UserService.user || {};
    $scope.login = function(user) {
    $scope.passwordError = false;
    $scope.usernameError = false;
        UserService.login(user)
        .then(function(response) {
            $location.path('/todo');
        }, function(error){
            console.log('There was a problem logging in: ');
            $scope.errorMsg = error.data.message;
            if (error.data.cause === 'password') $scope.passwordError = true;
            if (error.data.cause === 'username') $scope.usernameError = true;    

            
            console.log(error)
        })
    }
}])
