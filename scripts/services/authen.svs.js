(function(){
    'use strict';

    angular.module('xMonitorApp')
        .factory('AuthenFactory', ['$q', '$http', '$localStorage', '$timeout', 'BASE_URL', function($q, $http, $localStorage, $timeout, BASE_URL){
            var baseUrl = BASE_URL;

            var currentUser = getUserFromToken();

            var _authenticated = false;
            function urlBase64Decoded(str) {
                var output = str.replace('-', '+').replace('_', '/');
                switch (output.length % 4) {
                    case 0:
                        break;
                    case 2:
                        output += '==';
                        break;
                    case 3:
                        output += '=';
                        break;
                    default:
                        throw 'Illegal base64url string!';
                }
                return window.atob(output);
            }

            function changeUser(user){
                angular.extend(currentUser, user);
            }

            function getUserFromToken () {
                var userStorage = $localStorage.user;
                var user = {};
                if(typeof userStorage !== 'undefined'){
                    var encoded = userStorage.token.split('.')[1];
                    user = JSON.parse(urlBase64Decoded(encoded));
                    user.roles =  userStorage.roles;
                }
                currentUser = user;
                return user;
            }

            return {
                sigin : function(data, success, error) {
                    _authenticated = true;
                    $http.post(baseUrl + '/login', data).success(success).error(error);
                },
                logout : function(success) {
                    changeUser({});
                    delete $localStorage.user;
                    success();
                },
                authenticate : function() {
                    var user = getUserFromToken();

                    return Object.keys(user).length !== 0;
                },
                isInRole : function(role){
                    if(!_authenticated || !currentUser.roles)
                        return false;
                    return currentUser.roles.indexOf(role) != -1;

                },
                isInAnyRoles : function(roles) {
                    if(!_authenticated || !currentUser.roles)
                        return false;

                    for (var i = 0; i < roles.length; i++){
                        if(this.isInRole(roles[i]))
                            return true;
                    }

                    return false;
                },
                identity : function() {
                    var deferred = $q.defer();

                    if(this.authenticate()){
                        $timeout(function(){
                            deferred.resolve(currentUser);
                            _authenticated = true;
                            return deferred.promise;
                        },1000);
                    } else {
                        deferred.resolve({});
                    }
                    return deferred.promise;
                }
            };
        }])
        .factory('authorization', ['$rootScope', '$state', 'AuthenFactory', function($rootScope, $state, AuthenFactory){
            return {
                authorize : function() {
                    return AuthenFactory.identity().then(function(){
                        var isAuthenticated = AuthenFactory.authenticate();
                        if($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && AuthenFactory.isInAnyRoles($rootScope.toState.data.roles) === false){
                            if(isAuthenticated){
                                //console.log($rootScope.toState.data.roles.length);
                                $state.transitionTo('/denied');
                            }
                            else {
                                console.log(AuthenFactory.isInAnyRoles($rootScope.toState.data.roles));

                                $rootScope.returnToState = $rootScope.toState;
                                $rootScope.returnToStateParams = $rootScope.toStateParams;
                                $state.go('/signin');
                            }
                        }
                    });
                }
            };
        }]);
})();
