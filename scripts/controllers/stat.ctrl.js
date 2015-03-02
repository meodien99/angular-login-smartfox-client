'use strict';

angular.module('xMonitorApp')
    .controller('StatCtrl',['$rootScope', '$scope', 'MainFactory', function($rootScope, $scope, MainFactory){
        /* ------- new user --------- */
        $scope.newUserCount = 0;

        $scope.newUser = {
            from : '2015-02-08',
            to : '2015-02-09',
            amount : 1,
            type : "day"
        };

        $scope.newUserUpdate = function(){
            var params = {
                amount : $scope.newUser.amount,
                type : $scope.newUser.type
            };
            MainFactory.statistic.user.newUserByTime(params, function(error){
                console.log(error);
            }).then(function(res){
                if(res.type === true) {
                    $scope.newUserCount = res.data[0].amount ;
                }
            });
        };

        //init new user count
        $scope.newUserUpdate();

        $scope.newUserFilter = function(){
            var params = {
                from : $scope.newUser.from,
                to : $scope.newUser.to
            };
            MainFactory.statistic.user.newUserByRange(params, function(error){
                console.log(error);
            }).then(function(res){
                if(res.type === true) {
                    $scope.newUserCount = res.data[0].amount ;
                }
            });
        };

        /* ------- played user --------- */
        $scope.userPlayedCount = 0;

        $scope.playedUser = {
            from : '2015-02-08',
            to : '2015-02-09',
            amount : 1,
            type : "day"
        };

        $scope.playedUserUpdate = function(){
            var params = {
                amount : $scope.playedUser.amount,
                type : $scope.playedUser.type
            };
            MainFactory.statistic.user.userPlayedByTime(params, function(error){
                console.log(error);
            }).then(function(res){
                if(res.type === true) {
                    $scope.userPlayedCount = res.data[0].amount ;
                }
            });
        };
        $scope.playedUserFilter = function(){
            var params = {
                from : $scope.playedUser.from,
                to : $scope.playedUser.to
            };
            MainFactory.statistic.user.userPlayedByRange(params, function(error){
                console.log(error);
            }).then(function(res){
                if(res.type === true) {
                    $scope.userPlayedCount = res.data[0].amount ;
                }
            });
        };

        //init played user count
        $scope.playedUserUpdate();

        /* ------- game statistics--------- */
        $scope.games = [];

        $scope.gameData = {
            from : '2015-02-08',
            to : '2015-02-09',
            amount : 1,
            type : "day"
        };

        $scope.gameUpdate = function(){
            var params = {
                amount : $scope.gameData.amount,
                type : $scope.gameData.type
            };
            MainFactory.statistic.game.gameByTime(params, function(error){
                console.log(error);
            }).then(function(res){
                if(res.type === true) {
                    $scope.games = res.data;
                }
            });
        };
        $scope.gameFilter = function(){
            var params = {
                from : $scope.gameData.from,
                to : $scope.gameData.to
            };
            MainFactory.statistic.game.gameByRange(params, function(error){
                console.log(error);
            }).then(function(res){
                if(res.type === true) {
                    $scope.games = res.data;
                }
            });
        };

        //init played user count
        $scope.gameUpdate();

        /* ------- task statistics--------- */
        $scope.taskCount = 0;
        $scope.task = {
            from : '2015-02-08',
            to : '2015-02-09',
            amount : 3,
            type : "week"
        };
        $scope.tasks = [];
        $scope.pageSize = 10;

        $scope.taskFilter = function(){
            var params = {
                from : $scope.task.from,
                to : $scope.task.to
            };
            $scope.taskCount = 0;
            MainFactory.statistic.task.taskByTime(params, function(err){
                console.log(err);
            }).then(function(res){
               if(res.type === true){

                   $scope.tasks = res.data;
                   for(var i in res.data) {
                       $scope.taskCount = $scope.taskCount + res.data[i].amount;
                   }
               }
            });
        }
        $scope.taskFilter();



        /*DATETIME PICKER-----------------------------------*/
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            alert($event);
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.format = 'dd-MM-yyyy';
    }]);