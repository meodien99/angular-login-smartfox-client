'use strict';

angular.module('xMonitorApp')
    .controller('UserCtrl', ['$rootScope', '$scope', '$state', 'usersData', 'MainFactory',
        function($rootScope, $scope, $state, usersData, MainFactory){
            $scope.pageSize = 10;
            $scope.currentPage = 1;
            $scope.androidCCU =0;
            $scope.iosCCU =0;
            $scope.j2meCCU =0;
            $scope.winPhoneCCU =0;
            $scope.webCCU =0;
            $scope.otherPlatformCCU =0;

            if(usersData.type === true) {
                for(var i in usersData.data){
                    usersData.data[i].registeredtime =  Math.ceil((new Date() - new Date(usersData.data[i].REGISTERED_DATE)) / (1000 * 3600 * 24));
                    usersData.data[i].loginedFrom =  Math.ceil((new Date() - new Date(usersData.data[i].last_login_time)) / (1000 * 60));
                    usersData.data[i].client_type = usersData.data[i].current_xclient_type.split(":")[0];
                    var platform = usersData.data[i].current_xclient_type.split(":")[0];
                    if(platform===("Android")){
                        $scope.androidCCU++;
                    }
                    if(platform===("IOS version")){
                        $scope.iosCCU++;
                    }
                    if(platform===("J2ME")){
                        $scope.j2meCCU++;
                    }
                    if(platform===("WINDOWS PHONE")){
                        $scope.winPhoneCCU++;
                    }

                }
                $scope.users = usersData.data;
            }

            $scope.userCount = $scope.users.length;
        }]);