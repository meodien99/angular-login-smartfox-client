(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('UserCtrl', ['$rootScope', '$scope', '$state', 'MainFactory', '$log', '$modal', 'Util',
            function($rootScope, $scope, $state, MainFactory, $log, $modal, Util){
                $scope.result = false;
                $scope.alerts = [];

                $scope.historyCp = false;

                $scope.user = [];

                $scope.findUser = function(){
                    var data = {
                        username : $scope.username
                    };
                    $scope.alerts = [];

                    MainFactory.user.findUser(data, function(res){
                        if(res.type === true){
                            $scope.user = res.data[0];
                            $scope.user.stt = true;
                            if($scope.user.BANNED[0] === 0){
                                $scope.user.stt = false;
                            }
                                
                            $scope.result = true;
                        } else {
                            $scope.alerts = Util.alert.show(res.message);

                            $scope.result = false;
                        }
                        $scope.historyCp = false;
                    }, function(err){
                        $scope.alerts = Util.alert.show(err);

                        $scope.result = false;
                    });
                };

                //close alert
                $scope.closeAlert = function(){
                    $scope.alerts = [];
                };

                $scope.openResetModal = function(){
                    var username = $scope.username;
                    var modalInstance = $modal.open({
                        templateUrl : "partials/users/reset.tpl.html",
                        size : 'sm',
                        scope : $scope,
                        controller : ['$rootScope', '$scope', '$modalInstance', function($rootScope, $scope, $modalInstance){
                            $scope.changePassword = function(){
                                var req = {
                                    nPassword : $scope.nPassword
                                };
                                $scope.alerts = [];

                                MainFactory.user.changePassword(username, req, function(res){
                                    if(res.type === true){
                                        $modalInstance.close();
                                    } else {
                                        $scope.alerts = Util.alert.show(res.message)
                                    }
                                }, function(err){
                                    $scope.alerts = Util.alert.show(err);
                                })
                            };
                        }]
                    });

                    modalInstance.result.then(function(){
                        $scope.alerts = Util.alert.show("Reset user password successfully !", Util.alert.SUCCESS);
                    })
                };

                //user history
                $scope.currentLogPage = 1;
                $scope.pageLogSize = 10;
                $scope.userHistory = function(ID){
                    $scope.logs = [];
                    MainFactory.user.logs(ID, function(err){
                        $scope.alerts = Util.alert.show(err);
                    }).then(function(res){
                        $scope.historyCp = true;

                        $scope.logs = res.data;
                        $scope.logs.forEach(function(log, index){
                            switch (log.result) {
                                case 0 :
                                case 2 :
                                    log.result = "Win";
                                    break;
                                case 1 :
                                    log.result = "Lose";
                                    break;
                                case 4 :
                                    log.result = "Quit";
                                    break;
                                default :
                                    log.result = "Draw";
                            }
                        });
                    });
                };

                //change status
                $scope.userStatus = function(username, status){
                    var data = {
                        status : status
                    };

                    MainFactory.user.changeStatus(username, data, function(res) {
                        if(res.type === true){
                            if(status === 0){
                                $scope.user.stt = false;
                                $scope.alerts = Util.alert.show("User banned !", Util.alert.SUCCESS);
                            } else {
                                $scope.user.stt = true;
                                $scope.alerts = Util.alert.show("User unbanned !", Util.alert.SUCCESS);
                            }
                        } else {
                            $scope.alerts = Util.alert.show(res.message)
                        }
                    }, function(err){
                        $scope.alerts = Util.alert.show(err);
                    });
                }
            }])
})();