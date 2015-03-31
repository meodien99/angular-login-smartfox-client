(function(){
    angular.module('xMonitorApp')
        .controller('AdminCtrl',['$rootScope', '$scope', '$modal', '$log', 'MainFactory', 'Util',
            function($rootScope, $scope, $modal, $log, MainFactory, Util){

                $scope.alerts = [];

                $scope.closeAlert = function(){
                    $scope.alerts = [];
                };

                /*=================================== ADMIN ===========================================*/
                $scope.users = [];
                var loadAll = function(){
                    //$scope.users = [];

                    MainFactory.admin.allAdmin(function(err){
                        $log.error(err);
                    }).then(function(res){
                        if(res.type === true){
                            $scope.adminPG = {
                                currentPage : 1,
                                pageSize : 1,
                                totalItems : 0
                            };

                            $scope.users = res.data;

                            $scope.adminPG.totalItems = $scope.users.length;
                            $scope.$watch('adminPG.currentPage + adminPG.pageSize', function() {
                                var begin = (($scope.adminPG.currentPage - 1) * $scope.adminPG.pageSize),
                                    end = begin + $scope.adminPG.pageSize;

                                $scope.filteredusers = $scope.users.slice(begin, end);

                            });
                        } else {
                            $log.error(res);
                        }
                    });
                };

                //init admin
                loadAll();


                //delete admin
                $scope.delete = function(username, index){
                    MainFactory.admin.deleteAdmin(username, function(res){
                        if(res.type === true){
                            $scope.alerts = Util.alert.show("Admin has been deleted successfully !", Util.alert.SUCCESS);
                            $scope.users.splice(index, 1);
                            //loadAll();
                        } else {
                            $log.error(res);
                        }
                    }, function(err){
                        $log.error(res);
                    });
                };


                $scope.resetPasswordModal = function(username){
                    var modalInstance = $modal.open({
                        templateUrl : 'partials/admin/reset.tpl.html',
                        controller : ['$rootScope', '$scope', '$modalInstance', function($rootScope, $scope, $modalInstance){
                            $scope.changePassword = function(){
                                var req = {
                                    nPassword : $scope.nPassword
                                };

                                MainFactory.admin.changePassword(username, req, function(res){
                                    if(res.type === true){
                                        $modalInstance.close(Util.alert.show("Admin's password reset successfully !", Util.alert.SUCCESS));
                                    } else {
                                        $modalInstance.close(Util.alert.show(res.message));
                                    }
                                }, function(err){
                                    $log.error(err);
                                });
                            }
                        }]
                    });

                    modalInstance.result.then(function(data){
                        $scope.alerts = data;
                    }, function(error){
                        $scope.alerts = error;
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                $scope.changePermissionModal = function(user){
                    var modalInstance = $modal.open({
                        templateUrl : 'partials/admin/permission.tpl.html',
                        resolve : {
                            adminData : [function(){
                                return MainFactory.admin.oneAdmin(user.username, function(error){
                                    $log.error(error);
                                });
                            }]
                        },
                        controller : ['$rootScope', '$scope', '$modalInstance', 'adminData', function($rootScope, $scope, $modalInstance, adminData){
                            if(adminData.type === true){
                                $scope.user = adminData.data[0];
                            }
                            $scope.changePermission = function(){
                                var req = {
                                    role_id : $scope.user.role_id
                                };

                                MainFactory.admin.changePermission($scope.user.username, req, function(res){
                                    if(res.type === true){
                                        $modalInstance.close(Util.alert.show("Admin's permission changed successfully !", Util.alert.SUCCESS));
                                    } else {
                                        $modalInstance.close(Util.alert.show(res.message));
                                    }
                                }, function(err){
                                    $log.error(err);
                                });
                            }
                        }]
                    });

                    modalInstance.result.then(function(data){
                        $scope.alerts = data;
                    }, function(reason){
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                $scope.createAdminModal = function(){
                    var modalInstance = $modal.open({
                        templateUrl : 'partials/admin/create.tpl.html',
                        controller : ['$rootScope', '$scope', '$modalInstance', function($rootScope, $scope, $modalInstance){

                            $scope.addAdmin = function(){
                                var data = $scope.admin;

                                MainFactory.admin.addAdmin(data, function(res){
                                    if(res.type === true){
                                        $modalInstance.close(Util.alert.show("Admin has been created successfully !", Util.alert.SUCCESS));
                                    } else {
                                        $modalInstance.close(Util.alert.show(res.message));
                                    }
                                }, function(error){
                                    $log.error(error);
                                });
                            };
                        }]
                    });

                    modalInstance.result.then(function(data){
                        $scope.alerts = data;
                        loadAll();
                    }, function(err){
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                /*====================================== LOG ===========================================*/

                $scope.logPG = {
                    currentPage : 1,
                    pageSize : 10,
                    totalItems : 0
                };

                //init Logs
                MainFactory.admin.logs(function(error){
                    $log.error(error);
                }).then(function(res){
                    $scope.logs = [];
                    if(res.type === true){
                        $scope.logs = res.data;

                        $scope.logPG.totalItems = $scope.logs.length;

                        $scope.$watch('logPG.currentPage + logPG.pageSize', function() {
                            var begin = (($scope.logPG.currentPage - 1) * $scope.logPG.pageSize),
                                end = begin + $scope.logPG.pageSize;

                            $scope.filteredlogs = $scope.logs.slice(begin, end);

                        });

                        //console.log($scope.filteredlogs)
                    }
                });
            }]);
})();