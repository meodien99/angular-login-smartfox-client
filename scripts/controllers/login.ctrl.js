'use strict';

angular.module('xMonitorApp')
    .controller('LoginCtrl', ['$rootScope', '$scope', '$state', '$localStorage', 'AuthenFactory',
        function($rootScope, $scope, $state, $localStorage, AuthenFactory){
            $scope.test = 123;
            /*$scope.signin = function(){
                var formData = {
                    username : $scope.username,
                    password : $scope.password
                };

                AuthenFactory.sigin(formData, function(res) {
                    if(res.code !== 200) {
                        $scope.message = res.message;
                    } else {
                        $localStorage.token = res.data.token;
                        window.location = "http://" + $location.host();
                    }
                }, function(){
                    $rootScope.error = "Failed to sign in";
                })
            };*/

            $scope.signin = function(){
                //$rootScope.authenticated = true;
                $localStorage.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInBhc3N3b3JkIjoiYWRtaW4hQCMiLCJlbWFpbCI6ImFkbWluIiwiX2lkIjoiNTRlYzQzZWIwMDMyMDA3NDNjNDViYWQ4In0.7BkD7X-yekTCrTHAEZ5RRJuZ-d6sJlw42WS-gqGGxLI';
                $state.go('home');
            };


        }]);