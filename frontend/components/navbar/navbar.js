angular.module("TodoApp")
.directive('navbar', ["UserService", function(UserService) {
    return {
        templateUrl: 'components/navbar/navbar.html',
        link: function(scope, elem, attrs) {
            scope.userService = UserService;
        }
    }
}]);