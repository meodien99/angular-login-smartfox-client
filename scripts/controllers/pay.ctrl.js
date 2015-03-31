(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('PayCtrl', ['$rootScope', '$scope', '$state', 'MainFactory', 'Util',
            function($rootScope, $scope, $state, MainFactory, Util){
                $scope.cardPageSize = 10;
                $scope.cardCurrentPage = 1;
                $scope.cardFrom = '2015-02-03';
                $scope.cardTo = '2015-03-03';
                $scope.totalCard = 0;
                $scope.totalAndroid = 0;
                $scope.totalIOS = 0;
                $scope.totalJ2ME = 0;
                $scope.totalWINPHONE = 0;
                $scope.totalWEB = 0;


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

                var getCardDataFromServer = function(params){
                    MainFactory.payment.card.cardsByTime(params, function(err){
                        console.log(err);
                    }).then(function(res) {
                        if (res.type === true) {
                            $scope.cards = res.data;
                            $scope.totalCard = 0;
                            $scope.totalAndroid = 0;
                            $scope.totalIOS = 0;
                            $scope.totalJ2ME = 0;
                            $scope.totalWINPHONE = 0;
                            $scope.totalWEB = 0;
                            $scope.totalViettel = 0;
                            $scope.totalMobi = 0;
                            $scope.totalVina = 0;
                            for (var i in res.data) {

                                if(res.data[i].TELCO_ID == 1){
                                    res.data[i].TELCO = "Viettel";
                                    $scope.totalViettel = $scope.totalViettel+ res.data[i].MONEY;
                                }
                                if(res.data[i].TELCO_ID == 2){
                                    res.data[i].TELCO = "Mobifone";
                                    $scope.totalMobi = $scope.totalMobi+ res.data[i].MONEY;
                                }
                                if(res.data[i].TELCO_ID == 3){
                                    res.data[i].TELCO = "Vinaphone";
                                    $scope.totalVina = $scope.totalVina+ res.data[i].MONEY;
                                }
                                if(res.data[i].TELCO_ID == 4){
                                    res.data[i].TELCO = "FPT Gate";
                                }
                                if(res.data[i].TELCO_ID == 5){
                                    res.data[i].TELCO = "VCoin";
                                }
                                res.data[i].current_xclient_type = res.data[i].current_xclient_type.split(":")[0];
                                var platform = res.data[i].current_xclient_type;
                                if (platform === ("Android")) {
                                    $scope.totalAndroid = $scope.totalAndroid+ res.data[i].MONEY;
                                }
                                if (platform === ("IOS version")) {
                                    $scope.totalIOS +=res.data[i].MONEY;
                                }
                                if (platform === ("J2ME")) {
                                    $scope.totalJ2ME +=res.data[i].MONEY;
                                }
                                if (platform === ("WINDOWS PHONE")) {
                                    $scope.totalWINPHONE +=res.data[i].MONEY;
                                }

                                $scope.totalCard += res.data[i].MONEY;

                            }

                        }
                    })
                };

                $scope.cardByTime = function() {
                    var params = {
                        from: $scope.cardFrom,
                        to: $scope.cardTo
                    };
                    getCardDataFromServer(params);
                };

                $scope.cardToday = function(){
                    var params = Util.timeUtil.today();
                    getCardDataFromServer(params);
                };

                $scope.cardThisMonth = function(){
                    var params = Util.timeUtil.thisMonth();
                    getCardDataFromServer(params);
                };

                $scope.cardThisYear = function(){
                    var params = Util.timeUtil.thisYear();
                    getCardDataFromServer(params);
                };

                var getSMSDataFromServer = function(params){
                    MainFactory.payment.sms.smsByTime(params, function(err){
                        console.log(err);
                    }).then(function(res){
                        if(res.type === true){
                            $scope.smses = res.data;
                            $scope.totalSms = 0;
                            for(var i in res.data){
                                $scope.totalSms += res.data[i].money;
                            }
                        }
                    });
                }

                $scope.smsFrom = '2015-02-03';
                $scope.smsTo = '2015-03-03';
                $scope.smsPageSize = 10;
                $scope.smsCurrentPage = 1;
                $scope.totalSms = 0;

                $scope.smsByTime = function(){
                    var params = {
                        from : $scope.smsFrom,
                        to : $scope.smsTo
                    };
                    getSMSDataFromServer(params);
                };

                $scope.smsToday = function(){
                    var params = Util.timeUtil.today();
                    getSMSDataFromServer(params);
                };

                $scope.smsThisMonth = function(){
                    var params = Util.timeUtil.thisMonth();
                    getSMSDataFromServer(params);
                };
                $scope.smsThisYear = function(){
                    var params = Util.timeUtil.thisYear();
                    getSMSDataFromServer(params);
                };

                //============================== BANK TRANSFER =====================================

                $scope.bankTransferFrom = '2015-02-03';
                $scope.bankTransferTo = '2015-03-03';
                $scope.bankTransferPageSize = 10;
                $scope.bankTransferCurrentPage = 1;
                $scope.totalBankTransferCoin = 0;
                $scope.totalBankTransferGold = 0;

                var getBankTransferDataFromServer = function(params){

                    MainFactory.payment.bankTransfer.bankTransferByTime(params, function(err){
                        console.log(err);
                    }).then(function(res){
                        if(res.type === true){
                            $scope.bankTransfers = res.data;
                            $scope.totalBankTransferCoin = 0;
                            $scope.totalBankTransferGold = 0;
                            for(var i in res.data){
                                $scope.totalBankTransferCoin += res.data[i].xcoin;
                                $scope.totalBankTransferGold += res.data[i].xgold;
                            }
                        }
                    });
                };

                $scope.bankTransferByTime = function(){
                    var params = {
                        from : $scope.bankTransferFrom,
                        to : $scope.bankTransferTo
                    };
                    getBankTransferDataFromServer(params);
                };

                $scope.bankTransferToday = function(){
                    var params = Util.timeUtil.today();
                    getBankTransferDataFromServer(params);
                };
                $scope.bankTransferThisMonth = function(){
                    var params = Util.timeUtil.thisMonth();
                    getBankTransferDataFromServer(params);
                };
                $scope.bankTransferThisYear = function(){
                    var params = Util.timeUtil.thisYear();
                    getBankTransferDataFromServer(params);
                };

                $scope.cardThisMonth();
                $scope.smsThisMonth();
                $scope.bankTransferThisMonth();

            }]);
})();
