(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('ChartCtrl', ['$rootScope', '$scope','MainFactory','Util',
            function($rootScope, $scope, MainFactory, Util){
                $scope.ccuFrom = "2015-03-06";
                $scope.ccuTo = "2015-03-09";
                $scope.ccuSplit = 6;

                $scope.labels = ["2015-03-09", "2015-03-10", "2015-03-11", "2015-03-12", "2015-03-13", "2015-03-14", "2015-03-15"];
                $scope.series = ['Total','Android','iOS','J2ME','WIN PHONE'];
                //$scope.series = ['Total', 'Android'];
                $scope.data = [
                    //[65, 59, 80, 81, 56, 55, 40],
                    //[25, 29, 70, 21, 56, 25, 47],
                    //[75, 49, 20, 11, 56, 65, 45]
                ];

                //user online
                if($rootScope.authenticated) {
                    $scope.pageSize = 10;
                    $scope.currentPage = 1;
                    $scope.ccuLabels = ['Android','iOS','J2ME','WIN PHONE', 'WEB'];
                    $scope.ccuData = [1,1,1,1, 1];

                    $scope.otherPlatformCCU =0;

                    $scope.users = [];

                    $scope.getOnlineUsers = function () {
                        MainFactory.user.allUsers(function (err) {
                            console.log(err);
                        }).then(function (usersData) {
                            if (usersData.type === true) {
                                $scope.androidCCU = 0;
                                $scope.iosCCU = 0;
                                $scope.j2meCCU = 0;
                                $scope.winPhoneCCU = 0;
                                $scope.webCCU = 0;
                                for (var i in usersData.data) {
                                    if (usersData.data[i].current_xclient_type != null) {
                                        usersData.data[i].registeredtime = Math.ceil((new Date() - new Date(usersData.data[i].REGISTERED_DATE)) / (1000 * 3600 * 24));
                                        usersData.data[i].loginedFrom = Math.ceil((new Date() - new Date(usersData.data[i].last_login_time)) / (1000 * 60));
                                        usersData.data[i].client_type = usersData.data[i].current_xclient_type.split(":")[0];
                                        var platform = usersData.data[i].current_xclient_type.split(":")[0];
                                        if (platform === ("Android")) {
                                            $scope.androidCCU++;
                                        }
                                        if (platform === ("IOS version")) {
                                            $scope.iosCCU++;
                                        }
                                        if (platform === ("J2ME")) {
                                            $scope.j2meCCU++;
                                        }
                                        if (platform === ("WINDOWS PHONE")) {
                                            $scope.winPhoneCCU++;
                                        }
                                    }

                                }
                                $scope.webCCU = $scope.userCount - $scope.androidCCU - $scope.iosCCU - $scope.j2meCCU - $scope.winPhoneCCU;
                                $scope.ccuData[0] = $scope.androidCCU;
                                $scope.ccuData[1] = $scope.iosCCU;
                                $scope.ccuData[2] = $scope.j2meCCU;
                                $scope.ccuData[3] = $scope.winPhoneCCU;
                                $scope.ccuData[4] = $scope.webCCU;

                                $scope.users = usersData.data;
                                $scope.userCount = $scope.users.length;
                            }
                        });
                    }

                    var getFeedbackFromServer = function (params) {
                        MainFactory.user.feedback(params, function (err) {
                            console.log(err);
                        }).then(function (res) {
                            if (res.type === true) {
                                $scope.feedbacks = res.data;
                            }
                        })
                    };

                    $scope.feedbackFrom = "2015-01-01";
                    $scope.feedbackTo = "2015-04-01";
                    $scope.feedbackPageSize = 10;
                    $scope.currentFeebackPage = 1;

                    $scope.getFeedbackByTime = function () {
                        var params = {
                            from: $scope.feedbackFrom,
                            to: $scope.feedbackTo
                        };
                        getFeedbackFromServer(params);
                    };
                    $scope.getFeedbackToday = function () {
                        var params = Util.timeUtil.today();
                        getFeedbackFromServer(params);
                    };

                    $scope.getFeedbackThisMonth = function () {
                        var params = Util.timeUtil.thisMonth();
                        getFeedbackFromServer(params);
                    };
                    $scope.getFeedbackThisYear = function () {
                        var params = Util.timeUtil.thisYear();
                        getFeedbackFromServer(params);
                    };
                    $scope.getOnlineUsers();
                    $scope.getFeedbackThisMonth();
                }

                var parseDate = function(dateString){
                    var reggie = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
                    var dateArray = reggie.exec(dateString);
                    var dateObject = new Date(
                        (+dateArray[1]),
                        (+dateArray[2])-1, // Careful, month starts at 0!
                        (+dateArray[3]),
                        (+dateArray[4]),
                        (+dateArray[5]),
                        (+dateArray[6])
                    );
                    dateObject = new Date(dateObject.getTime() + 1000*3600*7);
                    return (dateObject.getMonth()+1)+"/"+dateObject.getDate()+" "+dateObject.getHours()+"h:" +dateObject.getMinutes() +"'";
                }

                var splitData = function(res, platform){
                    var total = [];
                    var j =0;

                    for(var i in res.data){
                        if(res.data[i].platform === platform){
                            total[j] = res.data[i];
                            j++;
                        }
                    }
                    return total;
                }


                var getCCUDataFromServer = function(params){
                    MainFactory.user.ccu(params, function(err){
                        console.log(err);
                    }).then(function(res) {
                        if (res.type === true) {
                            $scope.res = res;
                            caculateCCUChart();
                        }
                    })
                };

                $scope.changeCCUSplit = function(ccusplit){
                    $scope.ccuSplit = ccusplit;
                    caculateCCUChart();
                }

                var caculateCCUChart = function(){
                    var res = $scope.res;
                    $scope.labels =[];
                    $scope.data =[];

                    $scope.total =[];
                    $scope.android =[];
                    $scope.ios =[];
                    $scope.winphone =[];
                    $scope.j2me =[];


                    var total =splitData(res, "Total");
                    var android =splitData(res, "Android");
                    var ios =splitData(res, "IOS version");
                    var j2me =splitData(res, "J2ME");
                    var winPhone =splitData(res, "WINDOWS PHONE");

                    var sample =$scope.ccuSplit;
                    var j = 0;

                    //Total:
                    $scope.data[0] =[];
                    for(var i in total){
                        if (i%sample==0){
                            $scope.labels[j] = total[i].date.substring(0, 19);
                            $scope.labels[j] = parseDate($scope.labels[j]);

                            $scope.data[0][j] = total[i].ccu;
                            j++;
                        }
                    }
                    //Android
                    var dataIndex = 1;
                    $scope.data[dataIndex] =[];
                    j =0;
                    for(var i in android){
                        if (i%sample==0){
                            $scope.data[dataIndex][j] = android[i].ccu;
                            j++;
                        }
                    }

                    //IOS
                    var dataIndex = 2;
                    $scope.data[dataIndex] =[];
                    j =0;
                    for(var i in ios){
                        if (i%sample==0){
                            $scope.data[dataIndex][j] = ios[i].ccu;
                            j++;
                        }
                    }

                    //j2me
                    var dataIndex = 3;
                    $scope.data[dataIndex] =[];
                    j =0;
                    for(var i in j2me){
                        if (i%sample==0){
                            $scope.data[dataIndex][j] = j2me[i].ccu;
                            j++;
                        }
                    }

                    //WinPhone
                    var dataIndex = 4;
                    $scope.data[dataIndex] =[];
                    j =0;
                    for(var i in winPhone){
                        if (i%sample==0){
                            $scope.data[dataIndex][j] = winPhone[i].ccu;
                            j++;
                        }
                    }
                };

                $scope.getCCUByTime = function() {
                    var params = {
                        from: $scope.ccuFrom,
                        to: $scope.ccuTo
                    };
                    getCCUDataFromServer(params);
                };

                $scope.getCCUToday = function(){
                    var params = Util.timeUtil.today();
                    getCCUDataFromServer(params);
                };

                $scope.getCCU24hAgo = function(){
                    var params = Util.timeUtil.thisMonth();
                    var fromTime = new Date(new Date().getTime() - 24*3600*1000);

                    var dd = fromTime.getDate();
                    var mm = fromTime.getMonth()+1; //January is 0!
                    var yyyy = fromTime.getFullYear();
                    var hh = fromTime.getHours();
                    var minutes = fromTime.getMinutes();
                    if( hh< 10) hh = "0"+hh;
                    if( minutes< 10) minutes = "0"+minutes;

                    var from= yyyy+"-"+mm+"-"+ dd+ " " + hh + ":" +minutes +":00" ;

                    var to = "2099-03-03";

                    var params = {
                        from : from,
                        to : to
                    };

                    getCCUDataFromServer(params);
                };
                $scope.getCCU48hAgo = function(){
                    var params = Util.timeUtil.thisMonth();
                    var fromTime = new Date(new Date().getTime() - 48*3600*1000);

                    var dd = fromTime.getDate();
                    var mm = fromTime.getMonth()+1; //January is 0!
                    var yyyy = fromTime.getFullYear();
                    var hh = fromTime.getHours();
                    var minutes = fromTime.getMinutes();
                    if( hh< 10) hh = "0"+hh;
                    if( minutes< 10) minutes = "0"+minutes;

                    var from= yyyy+"-"+mm+"-"+ dd+ " " + hh + ":" +minutes +":00" ;

                    var to = "2099-03-03";

                    var params = {
                        from : from,
                        to : to
                    };
                    getCCUDataFromServer(params);
                };


                $scope.getCCU72hAgo = function(){
                    var params = Util.timeUtil.thisMonth();
                    var fromTime = new Date(new Date().getTime() - 72*3600*1000);

                    var dd = fromTime.getDate();
                    var mm = fromTime.getMonth()+1; //January is 0!
                    var yyyy = fromTime.getFullYear();
                    var hh = fromTime.getHours();
                    var minutes = fromTime.getMinutes();
                    if( hh< 10) hh = "0"+hh;
                    if( minutes< 10) minutes = "0"+minutes;

                    var from= yyyy+"-"+mm+"-"+ dd+ " " + hh + ":" +minutes +":00" ;

                    var to = "2099-03-03";

                    var params = {
                        from : from,
                        to : to
                    };
                    getCCUDataFromServer(params);
                };

                $scope.getCCU48hAgo();

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
