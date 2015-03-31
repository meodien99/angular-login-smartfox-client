(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('BaseCtrl',['$rootScope','$scope','$state', 'AuthenFactory', '$log',
            function($rootScope, $scope, $state, AuthenFactory, $log){


                $scope.logout = function(){
                    AuthenFactory.logout(function(){
                        $state.go('/signin');
                    })
                };

            }]);
})();

