'use strict';

angular.module('xMonitorApp')
    .controller('MessageCtrl',['$rootScope','$scope','$state', 'MainFactory', 'messagesData',
        function($rootScope, $scope, $state,  MainFactory, messagesData) {
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
                    console.log(err);
                })
            };
        }]);