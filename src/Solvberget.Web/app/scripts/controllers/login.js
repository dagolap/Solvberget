'use strict';

angular.module('Solvberget.WebApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $routeParams, $location, $http, $cookies) {

        $rootScope.breadcrumb.clear();
        $rootScope.breadcrumb.push('Logg inn');

        $scope.logout = function(){

            delete $$config.username;
            delete $$config.password;
            delete $cookies.username;
            delete $cookies.password;

            $scope.isLoggedIn = false;
        }

        $scope.isLoggedIn = $$config.username && $$config.password;

        $scope.login = function(){

            $http({
                method: 'POST',
                url: $$config.apiPrefix + '/login',
                data : $.param({username : $scope.username, password: $scope.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                .success(function(data, status, headers, config) {

                    console.log(status);

                    if(status != 200) return;

                    $$config.username = $cookies.username = $scope.username;
                    $$config.password = $cookies.password = $scope.password;

                    if($routeParams.redirect) {
                        $location.search('redirect', null);
                        $location.path($routeParams.redirect);
                    }
                    else $location.path('/');
                }).error(function(data, status, headers, config) {

            });
        };

  });
