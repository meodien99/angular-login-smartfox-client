(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('HomeCtrl',['$rootScope', '$scope', '$state', 'AuthenFactory',
            function($rootScope, $scope, $state, AuthenFactory){
                $scope.logout = function () {
                    AuthenFactory.logout(function () {
                        $state.transitionTo('/signin');
                    })
                }
            }]);
})();

