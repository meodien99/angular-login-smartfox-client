'use strict';

angular.module('xMonitorApp')
    .controller('BaseCtrl',['$rootScope','$scope','$state', 'AuthenFactory',
        function($rootScope, $scope, $state, AuthenFactory){

            $scope.logout = function(){
                AuthenFactory.logout(function(){
                    $state.go('/signin');
                })
            }
        }]);
