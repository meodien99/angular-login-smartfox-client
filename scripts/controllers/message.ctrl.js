(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('MessageCtrl',['$rootScope','$scope','$state', 'MainFactory', 'messagesData', '$modal', '$log',
            function($rootScope, $scope, $state,  MainFactory, messagesData, $modal, $log) {
                $scope.pageSizeEvent = 10;
                $scope.currentPageEvent = 1;

                if(messagesData.type === true) {
                    $scope.events = messagesData.data;
                }

                $scope.delete = function(id){
                    MainFactory.message.deleteMessage(id, function(res){
                        if(res.type === true){
                            $state.transitionTo('home.message',{}, {reload:true});
                        }
                    }, function(err){
                        $log.error(err);
                    })
                };

                //creating modal
                $scope.createMessageModal = function(){
                    var modalInstance = $modal.open({
                        templateUrl : 'partials/message/create.tpl.html',
                        size :'lg',
                        controller : ['$scope', '$modalInstance', function($scope, $modalInstance){
                            $scope.create = function(){
                                var data = $scope.event;
                                MainFactory.message.createMessage(data, function(data){
                                    if(data.type === true){
                                        $modalInstance.close();
                                    } else {
                                        $log.error(data);
                                    }
                                }, function(err){
                                    $log.error(err);
                                })
                            };
                        }]
                    });

                    modalInstance.result.then(function () {
                        $state.transitionTo($state.current, {}, {reload: true});
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };
                //updating modal
                $scope.updateMessageModal = function(id){
                    var modalInstance = $modal.open({
                        templateUrl : 'partials/message/edit.tpl.html',
                        size :'lg',
                        resolve : {
                            detailMessage : ['MainFactory', function(MainFactory) {
                                return MainFactory.message.oneMessage(id , null,function(){
                                    $log.info("....");
                                });
                            }]
                        },
                        controller : ['$scope', '$modalInstance', 'detailMessage', function($scope, $modalInstance, detailMessage){
                            if(detailMessage.type === true){
                                $scope.event = detailMessage.data[0];
                            } else {
                                $scope.error("shit happened !");
                            }

                            $scope.update = function(){
                                var data = {
                                    title : $scope.event.title,
                                    content : $scope.event.content,
                                    is_active : $scope.event.active
                                };

                                MainFactory.message.editMessage(id, data, function(data){
                                    if(data.type === true){
                                        $modalInstance.close();
                                    } else {
                                        $log.error(data);
                                    }
                                }, function(err){
                                    $log.error(err);
                                })
                            };
                        }]
                    });

                    modalInstance.result.then(function () {
                        $state.transitionTo($state.current, {}, {reload: true});
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                //viewing modal
                $scope.viewMessageModal = function(id){
                    var modalInstance = $modal.open({
                        templateUrl : 'partials/message/detail.tpl.html',
                        resolve : {
                            detailMessage : [function() {
                                return MainFactory.message.oneMessage(id , null,function(){
                                    $log.info("....");
                                });
                            }]
                        },
                        controller : ['$scope', 'detailMessage',
                            function($scope, detailMessage){
                                if(detailMessage.type === true){
                                    $scope.event = detailMessage.data[0];
                                } else {
                                    $log.error("Shit happen !!");
                                }
                            }]
                    });

                    modalInstance.result.then(function () {
                        $log.info("Dafuq ?");
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }
            }]);
})();
