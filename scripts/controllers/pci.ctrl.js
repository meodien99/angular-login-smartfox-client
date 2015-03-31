(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('PCICtrl', ['$rootScope', '$scope', '$state', 'MainFactory', '$http', '$window', 'BASE_URL', '$modal', '$log', 'Util',
            function($rootScope, $scope, $state, MainFactory, $http, $window, BASE_URL, $modal, $log, Util){
                $scope.base = BASE_URL;
                $scope.PageSize = 10;
                $scope.currentPage = 1;
                $scope.app = {
                    platform : 'IOS'
                };

                //alert
                $scope.alerts = [];

                $scope.closeAlert = function(){
                    $scope.alerts = [];
                };

                var allApps = function(){
                    $scope.apps = [];

                    MainFactory.pci.all(function(err){
                        console.log(err);
                    }).then(function(data){
                        if(data.type === true) {
                            var apps = data.data;

                            for(var i in apps){
                                if(apps[i].icon.indexOf("http://") > -1  || apps[i].icon.indexOf("https://") > -1 ){
                                    apps[i].link = true;
                                } else {
                                    apps[i].link = false;
                                }

                                $scope.apps.push(apps[i]);
                            }
                        }
                    });
                };

                //init apps;
                allApps();


                //editing modal
                $scope.updateAppModal = function (id) {
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/pci/edit.tpl.html',
                        controller: ['$scope', '$modalInstance', 'detailApp','$log', 'BASE_URL',
                            function ($scope, $modalInstance, detailApp, $log, BASE_URL) {
                                if(detailApp.type === true){
                                    $scope.base = BASE_URL;

                                    $scope.alerts = [];

                                    $scope.isOpen = false;
                                    $scope.openCalendar = function(e) {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        $scope.isOpen = true;
                                    };
                                    $scope.showMeridian = false;
                                    $scope.dateOptions = {
                                        startingDay: 1,
                                        showWeeks: false
                                    };
                                    $scope.hourStep = 1;
                                    $scope.minuteStep = 15;

                                    $scope.timeOptions = {
                                        hourStep: [1, 2, 3],
                                        minuteStep: [1, 5, 10, 15, 25, 30]
                                    };

                                    $scope.app = detailApp.data[0];
                                    //$scope.app.sDate =  $scope.app.sDate.slice(0, 19).replace('T', ' ');
                                    //$scope.app.eDate =  $scope.app.sDate.slice(0, 19).replace('T', ' ');

                                    if($scope.app.icon.indexOf("http://") > -1  || $scope.app.icon.indexOf("https://") > -1 ){
                                        $scope.app.link = true;
                                    } else {
                                        $scope.app.link = false;
                                    }
                                    $scope.update = function(){
                                        var data = $scope.app;
                                        var file = (typeof $scope.files === 'undefined') ? null : $scope.files[0];
                                        MainFactory.pci.updateApp(id, file, data, function(res) {
                                            if(res.type === true) {
                                                $modalInstance.close(Util.alert.show("App has been updated successfully !", Util.alert.SUCCESS));
                                            } else {
                                                $scope.alerts = Util.alert.show(res.message);
                                            }

                                        }, function(err){
                                            $scope.alerts = Util.alert.show("Dafuq");
                                        })
                                    };
                                    $scope.cancel = function(){
                                        $modalInstance.dismiss('Dafuq');
                                    }
                                } else {
                                    $scope.alerts = Util.alert.show(detailApp.message);
                                }
                            }],
                        size: 'lg',
                        resolve: {
                            detailApp: [function () {
                                return MainFactory.pci.one(id , null,function(){
                                    $log.info("....");
                                })
                            }]
                        }
                    });

                    modalInstance.result.then(function (data) {
                        $scope.alerts = data;
                        allApps();
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                //creating modal
                $scope.createAppModal = function(){
                    var modalInstance = $modal.open({
                        templateUrl :'partials/pci/create.tpl.html',
                        size: 'lg',
                        controller : ['$scope', '$modalInstance', '$log', '$upload',
                            function($scope, $modalInstance, $log, $upload){
                                $scope.alerts = [];

                                //calendar
                                $scope.isOpen = false;
                                $scope.openCalendar = function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    $scope.isOpen = true;
                                };
                                $scope.showMeridian = false;
                                $scope.dateOptions = {
                                    startingDay: 1,
                                    showWeeks: false
                                };
                                $scope.hourStep = 1;
                                $scope.minuteStep = 15;

                                $scope.timeOptions = {
                                    hourStep: [1, 2, 3],
                                    minuteStep: [1, 5, 10, 15, 25, 30]
                                };

                                $scope.app= {};
                                $scope.app.sDate = new Date();
                                $scope.app.eDate = new Date();

                                $scope.create = function(){
                                    if(typeof $scope.files === 'undefined'){
                                        $scope.alerts = Util.alert.show("Image need to choice !")
                                    } else {
                                        MainFactory.pci.createApp($scope.app, $scope.files[0], function (data) {
                                            if (data.type === true) {
                                                $modalInstance.close(Util.alert.show("App has been created successfully !", Util.alert.SUCCESS));
                                            } else {
                                                $scope.alerts = Util.alert.show(data.message);
                                            }
                                        }, function (err) {
                                            $scope.alerts = Util.alert.show(err);
                                        });
                                    }
                                };
                            }]
                    });

                    modalInstance.result.then(function (data) {
                        $scope.alerts = data;
                        allApps();
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                $scope.delete = function(id){
                    MainFactory.pci.deleteApp(id, function(res){
                        if(res.type === true){
                            $scope.alerts = Util.alert.show("App has been deleted successfully !", Util.alert.SUCCESS);
                        } else {
                            $scope.alerts = Util.alert.show(res.message);
                        }
                    }, function(err){
                        console.log(err);
                    })
                }
            }
        ]);
})();
