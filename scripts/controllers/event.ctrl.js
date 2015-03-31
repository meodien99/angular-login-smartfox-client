(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('EventCtrl', ['$rootScope', '$scope', '$state', 'MainFactory', 'Util', '$log', '$modal',
            function($rootScope, $scope, $state, MainFactory, Util, $log, $modal){
                $scope.pageSizeEvent = 10;
                $scope.currentPageEvent = 1;

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

                var getEventDataFromServer = function(params){
                    MainFactory.event.allEvents(params, function(err){
                        console.log(err);
                    }).then(function(res) {
                        if (res.type === true) {
                            $scope.events = res.data;
                        }
                    })
                };

                var getAllEvents = function() {
                    var params = {
                        from: $scope.pageSize,
                        to: $scope.currentPage
                    };
                    getEventDataFromServer(params);
                };

                getAllEvents();

                //creating modal
                $scope.createEventModal = function(){
                    var modalInstance = $modal.open({
                        templateUrl : 'partials/events/create.tpl.html',
                        size : 'lg',
                        controller : ['$scope', '$upload', '$modalInstance', '$window',
                            function($scope, $upload, $modalInstance, $window){
                                $scope.event= {};
                                $scope.event.createdDate = new Date();
                                $scope.event.endDate = new Date();

                                $scope.create = function(){
                                    if(typeof $scope.files === 'undefined'){
                                        $window.alert("Image need to choice");
                                    } else {
                                        var input = $scope.event;
                                        MainFactory.event.createApp(input, $scope.files[0], function (data) {
                                            if (data.type === true) {
                                                $modalInstance.close();
                                            } else {
                                                $log.error(data.type);
                                            }
                                        }, function (err) {
                                            $log.error(err);
                                        });
                                    }
                                };
                            }]
                    });

                    modalInstance.result.then(function () {
                        getAllEvents();
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                //updating modal

            }]);
})();
