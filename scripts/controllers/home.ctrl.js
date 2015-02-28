'use strict';

angular.module('xMonitorApp')
    .controller('HomeCtrl',['$rootScope','$scope','$state','$localStorage','AuthenFactory',
        function($rootScope, $scope, $state, $localStorage, AuthenFactory){
            $scope.logout = function(){
                AuthenFactory.logout(function(){
                    $state.go('/signin');
                })
            }
        }]);
