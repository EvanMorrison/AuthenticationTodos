angular.module("TodoApp.Auth")
.controller("LogoutController", ["$scope", "$location", "UserService", function($scope, $location, UserService) {
    $scope.user = UserService.user  || { name: 'no user info', username: 'no info'}
    
    $scope.logout = function () {
        console.log('UserService.user');
 console.log( UserService.user);
        UserService.logout();
     };

     $scope.logout(); 


}])