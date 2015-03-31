'use strict';

angular.module('xMonitorApp')
    .factory('SFS',['$q', '$timeout', function($q, $timeout){
        var sfs = null;
        var config = {
            host : "52.10.41.39",
            port : 7471,
            zone : "XGame",
            debug : true
        };

        var isConnected = false;

        function trace(txt, showAlert)
        {
            console.log(txt);

            if (showAlert)
                alert(txt);
        }
        var e = {
            onConnection : function(event) {
                isConnected = true;
                if (event.success) {
                    trace("Connected to SmartFoxServer 2X!");
                    trace("Session id: " + sfs.sessionToken);
                }
                else {
                    trace("Connection failed: " + (event.errorMessage ? event.errorMessage + " (" + event.errorCode + ")" : "Is the server running at all?"), true);
                }
            },
            onConnectionLost : function(event) {
                var reason = event.reason;

                isConnected = false;
                if(reason != SFS2X.Utils.ClientDisconnectionReason.MANUAL){
                    if(reason == SFS2X.Utils.ClientDisconnectionReason.IDLE)
                        trace("A disconnection occurred due to inactivity");
                    else if (reason == SFS2X.Utils.ClientDisconnectionReason.KICK)
                        trace("A disconnection occurred due to kick");
                    else if (reason == SFS2X.Utils.ClientDisconnectionReason.BAN)
                        trace("You have been banned by the moderator");
                    else
                        trace("A disconnection occurred due to unknown reason; please check the server log");
                } else {
                    trace("I was disconnected; reason is: " + event.reason);
                }
            },
            onPingPong : function(event){
                var avgLag = Math.round(event.lagValue * 100) / 100;
                trace("Average lag: " + avgLag + "ms");
            },
            onExtensionResponse : function(evtParams){
                console.log(123123123);
                if (evtParams.cmd == "ad_msg")
                {
                    var responseParams = evtParams.params;

                    // We expect a number called "sum"
                    console.log("The sum is: " + responseParams.sum);
                    console.log(123);
                }
            },
            onLogin : function(event){
                trace("Login");
            },
            onLoginError : function(event){
                trace("error login : " + event.errorMessage);
            },
        };
        sfs = new SmartFox(config);

        // Set client details
        var platform = navigator.appName;
        var version = navigator.appVersion;

        sfs.setClientDetails(platform, version);

        //add Event Listeners
        sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, e.onConnection, this);
        sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, e.onConnectionLost, this);
        sfs.addEventListener(SFS2X.SFSEvent.PING_PONG, e.onPingPong, this);
        sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, e.onExtensionResponse, this);
        sfs.addEventListener(SFS2X.SFSEvent.LOGIN, e.onLogin, this);
        sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, e.onLoginError, this);

        return {
            init : function() {
                if(!isConnected){
                    this.connect();
                }
                return this;
            },
            connect : function(){
                isConnected = true;
                sfs.connect();
            },
            sendNotify : function(msgs){
                this.init();
                $timeout(function(){
                    sfs.send(new SFS2X.Requests.System.ExtensionRequest('ad_msg', {cl : msgs}));
                },1000);
            },
            test : function(){

                var exp = new SFS2X.Entities.Match.MatchExpression("username", SFS2X.Entities.Match.StringMatch.EQUALS, "garun21");

                sfs.send(new SFS2X.Requests.System.FindUsersRequest(exp));
            }
        }
    }]);