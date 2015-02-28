'use strict';

angular.module('xMonitorApp')
    .controller('UserCtrl', ['$rootScope', '$scope', '$state', 'usersData', 'MainFactory',
        function($rootScope, $scope, $state, usersData, MainFactory){
            $scope.pageSize = 10;
            $scope.currentPage = 1;

            if(usersData.type === true) {
                $scope.users = usersData.data;
            }

            $scope.userCount = $scope.users.length;
        }]);