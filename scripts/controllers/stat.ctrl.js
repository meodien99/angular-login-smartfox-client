(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('StatCtrl',['$rootScope', '$scope', 'MainFactory', 'Util', function($rootScope, $scope, MainFactory,Util){
            /* ------- new user --------- */
            //$scope.newUserCount = 0;
            //
            //$scope.newUser = {
            //    from : '2015-02-08',
            //    to : '2015-02-09',
            //    amount : 1,
            //    type : "day"
            //};

            //$scope.newUserUpdate = function(){
            //    var params = {
            //        amount : $scope.newUser.amount,
            //        type : $scope.newUser.type
            //    };
            //    MainFactory.statistic.user.newUserByTime(params, function(error){
            //        console.log(error);
            //    }).then(function(res){
            //        if(res.type === true) {
            //            $scope.newUserCount = res.data[0].amount ;
            //        }
            //    });
            //};

            //init new user count
            //$scope.newUserUpdate();

            //$scope.newUserFilter = function(){
            //    var params = {
            //        from : $scope.newUser.from,
            //        to : $scope.newUser.to
            //    };
            //    MainFactory.statistic.user.newUserByRange(params, function(error){
            //        console.log(error);
            //    }).then(function(res){
            //        if(res.type === true) {
            //            $scope.newUserCount = res.data[0].amount ;
            //        }
            //    });
            //};

            /* ------- Active user --------- */
            //$scope.userPlayedCount = 0;
            //
            //$scope.playedUser = {
            //    from : '2015-02-08',
            //    to : '2015-02-09',
            //    amount : 1,
            //    type : "day"
            //};
            //
            //$scope.playedUserUpdate = function(){
            //    var params = {
            //        amount : $scope.playedUser.amount,
            //        type : $scope.playedUser.type
            //    };
            //    MainFactory.statistic.user.userPlayedByTime(params, function(error){
            //        console.log(error);
            //    }).then(function(res){
            //        if(res.type === true) {
            //            $scope.userPlayedCount = res.data[0].amount ;
            //        }
            //    });
            //};
            //$scope.playedUserFilter = function(){
            //    var params = {
            //        from : $scope.playedUser.from,
            //        to : $scope.playedUser.to
            //    };
            //    MainFactory.statistic.user.userPlayedByRange(params, function(error){
            //        console.log(error);
            //    }).then(function(res){
            //        if(res.type === true) {
            //            $scope.userPlayedCount = res.data[0].amount ;
            //        }
            //    });
            //};

            $scope.activeUser = {
                from : '2015-02-08',
                to : '2015-02-09',
                pageSize : 10,
                currentPage : 1,
                totalItems : 0
            };

            var getActiveUserFromServer = function(params){
                MainFactory.statistic.user.activeUserByTime(params, function(err){
                    console.log(err);
                }).then(function(res) {
                    if (res.type === true) {
                        $scope.totalActiveUserAndroid = 0;
                        $scope.totalActiveUserIOS = 0;
                        $scope.totalActiveUserJ2ME = 0;
                        $scope.totalActiveUserWINPHONE = 0;
                        $scope.totalActiveUserWEB = 0;
                        $scope.totalActiveUserPlayOneTime =0;

                        for (var i in res.data) {

                            res.data[i].playOneTime = false;
                            if(res.data[i].REGISTERED_DATE === res.data[i].last_login_time){
                                $scope.totalActiveUserPlayOneTime ++;
                                res.data[i].playOneTime = true;
                            }

                            if(res.data[i].current_xclient_type!=null) {
                                res.data[i].current_xclient_type = res.data[i].current_xclient_type.split(":")[0];

                                var platform = res.data[i].current_xclient_type;

                                if (platform === ("Android")) {
                                    $scope.totalActiveUserAndroid++;
                                }
                                if (platform === ("IOS version")) {
                                    $scope.totalActiveUserIOS++;
                                }
                                if (platform === ("J2ME")) {
                                    $scope.totalActiveUserJ2ME++;
                                }
                                if (platform === ("WINDOWS PHONE")) {
                                    $scope.totalActiveUserWINPHONE++
                                }
                            }
                        }
                        $scope.activeUsers = res.data;

                        $scope.activeUser.totalItems = $scope.activeUsers.length;
                        $scope.$watch('activeUser.currentPage + activeUser.pageSize', function() {
                            var begin = (($scope.activeUser.currentPage - 1) * $scope.activeUser.pageSize),
                                end = begin + $scope.activeUser.pageSize;

                            $scope.filteredActiveUsers = $scope.activeUsers.slice(begin, end);
                        });
                    }
                })
            };

            $scope.activeUserByTime = function(){
                var params = {
                    from : $scope.activeUser.from,
                    to : $scope.activeUser.to
                };
                getActiveUserFromServer(params);
            };

            $scope.activeUserToday = function(){
                var params = Util.timeUtil.today();
                getActiveUserFromServer(params);
            };

            $scope.activeUserThisMonth = function(){
                var params = Util.timeUtil.thisMonth();
                getActiveUserFromServer(params);
            };
            $scope.activeUserThisYear = function(){
                var params = Util.timeUtil.thisYear();
                getActiveUserFromServer(params);
            };

            //--================================= NEW USER ===================================
            $scope.newUser = {
                from : '2015-02-08',
                to : '2015-02-09',
                pageSize : 10,
                currentPage : 1,
                totalItems : 0
            };

            var getNewUserFromServer = function(params){
                MainFactory.statistic.user.newUserByTime(params, function(err){
                    console.log(err);
                }).then(function(res) {
                    if (res.type === true) {
                        $scope.totalNewUserAndroid = 0;
                        $scope.totalNewUserIOS = 0;
                        $scope.totalNewUserJ2ME = 0;
                        $scope.totalNewUserWINPHONE = 0;
                        $scope.totalNewUserWEB = 0;
                        $scope.totalNewUserPlayOneTime = 0;

                        for (var i in res.data) {
                            res.data[i].totalPlayed = res.data[i].TOTAL_NUM_WON + res.data[i].TOTAL_NUM_DRAW + res.data[i].TOTAL_NUM_LOSS + res.data[i].TOTAL_NUM_QUIT;
                            res.data[i].playOneTime = false;

                            if(res.data[i].REGISTERED_DATE === res.data[i].last_login_time){
                                $scope.totalNewUserPlayOneTime ++;
                                res.data[i].playOneTime = true;
                            }

                            if(res.data[i].current_xclient_type!=null) {
                                res.data[i].current_xclient_type = res.data[i].current_xclient_type.split(":")[0];
                                var platform = res.data[i].current_xclient_type;

                                if (platform === ("Android")) {
                                    $scope.totalNewUserAndroid++;
                                }
                                if (platform === ("IOS version")) {
                                    $scope.totalNewUserIOS++;
                                }
                                if (platform === ("J2ME")) {
                                    $scope.totalNewUserJ2ME++;
                                }
                                if (platform === ("WINDOWS PHONE")) {
                                    $scope.totalNewUserWINPHONE++
                                }
                            }
                        }

                        $scope.newUsers = res.data;

                        $scope.newUser.totalItems = $scope.newUsers.length;
                        $scope.$watch('newUser.currentPage + newUser.pageSize', function() {
                            var begin = (($scope.newUser.currentPage - 1) * $scope.newUser.pageSize),
                                end = begin + $scope.newUser.pageSize;

                            $scope.filteredNewUsers = $scope.newUsers.slice(begin, end);
                        });

                    }
                })
            };

            $scope.newUserByTime = function(){
                var params = {
                    from : $scope.activeUser.from,
                    to : $scope.activeUser.to
                };
                getNewUserFromServer(params);
            };

            $scope.newUserToday = function(){
                var params = Util.timeUtil.today();
                getNewUserFromServer(params);
            };

            $scope.newUserThisMonth = function(){
                var params = Util.timeUtil.thisMonth();
                getNewUserFromServer(params);
            };
            $scope.newUserThisYear = function(){
                var params = Util.timeUtil.thisYear();
                getNewUserFromServer(params);
            };

            //init played user count
            //$scope.playedUserUpdate();

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
            //$scope.gameUpdate();

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
            };
            $scope.taskFilter();

            //date picker
            $scope.open = function($event,opened) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[opened] = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','yyyy/MM/dd hh:mm:ss'];
            $scope.format = $scope.formats[1];
        }]);
})();
