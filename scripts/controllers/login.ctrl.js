(function(){
    'use strict';

    angular.module('xMonitorApp')
        .controller('LoginCtrl', ['$rootScope', '$scope', '$state', '$localStorage', 'AuthenFactory', 'Util', '$log',
            function($rootScope, $scope, $state, $localStorage, AuthenFactory, Util, $log){
                $scope.alerts = [];

                $scope.signin = function(){
                    var formData = {
                        username : $scope.username,
                        password : $scope.password
                    };

                    AuthenFactory.sigin(formData, function(res) {
                        if(res.code !== 200) {
                            $scope.alerts = Util.alert.show(res.message);
                        } else {
                            $rootScope.authenticated = true;
                            $localStorage.user = res.data;
                            $state.go('home');
                        }
                    }, function(err){
                        $scope.alerts = Util.alert.show("Failed to sign in");
                    })
                };

                //close alert
                $scope.closeAlert = function(){
                    $scope.alerts = [];
                };

                /*$scope.signin = function(){
                 //$rootScope.authenticated = true;
                 $localStorage.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInBhc3N3b3JkIjoiYWRtaW4hQCMiLCJlbWFpbCI6ImFkbWluIiwiX2lkIjoiNTRlYzQzZWIwMDMyMDA3NDNjNDViYWQ4In0.7BkD7X-yekTCrTHAEZ5RRJuZ-d6sJlw42WS-gqGGxLI';
                 $state.go('home');
                 };*/

            }]);
})();
