/**
 * Created by thuylb on 04/03/2015.
 */
(function(){
    'use strict';

    angular.module('xMonitorApp')
        .factory('Util', [function(){
            var ALTER_DANGER = 1;
            var ALTER_SUCCESS = 2;
            var ALTER_WARNING =3;

            var o = {
                timeUtil: {
                    today : function(){
                        var today = new Date();
                        var mm = today.getMonth()+1; //January is 0!
                        var dd = today.getDate();
                        var yyyy = today.getFullYear();
                        var from= yyyy+"-"+mm+"-"+dd ;

                        var to = "2099-03-03";

                        var params = {
                            from : from,
                            to : to
                        };
                        return params;
                    },
                    thisWeek : function(){
                        var today = new Date();
                        var mm = today.getMonth()+1; //January is 0!
                        var yyyy = today.getFullYear();
                        var from= yyyy+"-"+mm+"-01" ;

                        var to = "2099-03-03";

                        var params = {
                            from : from,
                            to : to
                        };
                        return params;
                    },
                    thisMonth : function(){
                        var today = new Date();
                        var mm = today.getMonth()+1; //January is 0!
                        var yyyy = today.getFullYear();
                        var from= yyyy+"-"+mm+"-01" ;

                        var to = "2099-03-03";

                        var params = {
                            from : from,
                            to : to
                        };
                        return params;
                    },
                    thisYear : function(){
                        var today = new Date();
                        var yyyy = today.getFullYear();
                        var from= yyyy+"-01-01";
                        var to = "2099-03-03";

                        var params = {
                            from : from,
                            to : to
                        };
                        return params;
                    }
                },
                /**
                 * @param message
                 * @param type
                 */
                alert : {
                    DANGER : new (function(){
                        return ALTER_DANGER;
                    })(),
                    WARNING : new (function(){
                        return ALTER_WARNING;
                    })(),
                    SUCCESS : new (function(){
                        return ALTER_DANGER
                    })(),
                    show : function(message, type){
                        switch (type){
                            case this.SUCCESS:
                                type = 'success'; break;
                            case this.WARNING:
                                type = 'warning'; break;
                            default :
                                type = "danger"; break;
                        }

                        var alerts = [];
                        alerts.push({type : type, msg : message});

                        return alerts;
                    }
                }
            };

            return o;
        }]);
})();
