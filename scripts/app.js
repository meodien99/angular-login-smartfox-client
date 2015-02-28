'use strict';

angular.module('xMonitorApp',[
    'ngStorage',
    'angular-loading-bar',
    'ui.router',
    'xMonitorApp.dirPagination'
])
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider){
        $urlRouterProvider
            .when('','/')
            ;

        $stateProvider.
            state('home',{
                url :'/',
                data: {
                    roles : ['Admin']
                },
                views: {
                    '' : {
                        templateUrl : 'partials/home.html',
                        controller: 'HomeCtrl'
                    },
                    'test@home': {
                        templateUrl: 'partials/statistics/user.sts.tpl.html',
                        controller : 'StatCtrl'
                    },
                    'bang@home' : {
                        templateUrl : 'partials/charts.tpl.html',
                        controller : 'HomeCtrl'
                    }
                }
            })
            .state('home.message', {
                url :'/message',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'bang@home' : {
                        templateUrl : 'partials/message/index.tpl.html',
                        resolve : {
                            messagesData : ['$timeout', 'MainFactory', function($timeout, MainFactory){
                                return MainFactory.message.allMessage(null, function(error){
                                    console.log(error);
                                });
                            }]
                        },
                        controller : 'MessageCtrl'
                    }
                }
            })
            .state('home.message.create', {
                url :'/create',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'bang@home' : {
                        templateUrl : 'partials/message/create.tpl.html',
                        controller : ['$scope', '$state', 'MainFactory', function($scope, $state, MainFactory){
                            //create
                            $scope.create = function(){
                                var data = $scope.event;
                                console.log($scope.event.type);
                                MainFactory.message.createMessage(data, function(res){
                                    if(res.type == true){

                                    }

                                    $state.transitionTo('home.message', {}, {reload:true});
                                }, function(err){
                                    console.log(err);
                                })
                            }
                        }]
                    }
                }
            })
            .state('home.message.update', {
                url :'/{id:[0-9]{1,8}}/edit',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'bang@home' : {
                        templateUrl : 'partials/message/edit.tpl.html',
                        resolve : {
                            detailMessage : ['$stateParams', 'MainFactory', function($stateParams, MainFactory) {
                                var id = $stateParams.id;
                                return MainFactory.message.oneMessage(id , null,function(){
                                    console.log("....");
                                });
                            }]
                        },
                        controller : ['$rootScope', '$scope', '$state', '$stateParams','detailMessage', 'Flash', 'MainFactory',
                            function($rootScope, $scope, $state, $stateParams, detailMessage, Flash, MainFactory){
                            if(detailMessage.type === true){
                                $scope.event = detailMessage.data[0];
                            };

                            $scope.update = function(){
                                var data = {
                                    title : $scope.event.title,
                                    content : $scope.event.content,
                                    type : $scope.event.type,
                                    is_active : $scope.event.is_active
                                };
                                MainFactory.message.editMessage($stateParams.id, data, function(res) {
                                    if(res.type === true) {
                                    }
                                    $state.transitionTo('home.message', {}, {reload: true});
                                }, function(err){
                                    console.log("POST : " + err);
                                })
                            };
                        }]
                    }
                }
            })
            .state('home.message.detail', {
                url :'/{id:[0-9]{1,8}}',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'bang@home' : {
                        templateUrl : 'partials/message/detail.tpl.html',
                        resolve : {
                            detailMessage : ['$stateParams', 'MainFactory', function($stateParams, MainFactory) {
                                var id = $stateParams.id;
                                return MainFactory.message.oneMessage(id , null,function(){
                                    console.log("....");
                                });
                            }]
                        },
                        controller : ['$rootScope', '$scope', '$state', '$stateParams','detailMessage',
                            function($rootScope, $scope, $state, $stateParams, detailMessage){
                                if(detailMessage.type === true){
                                    $scope.event = detailMessage.data[0];
                                };
                            }]
                    }
                }
            })
            .state('home.users', {
                url :'/users',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'bang@home' : {
                        templateUrl : 'partials/users.tpl.html',
                        resolve : {
                            usersData : ['MainFactory', function(MainFactory){
                                return MainFactory.user.allUsers(function(error){
                                    console.log(error);
                                });
                            }]
                        },
                        controller : 'UserCtrl'
                    }
                }
            })
            .state('/signin', {
                url : '/signin',
                templateUrl: 'partials/signin.html',
                data: {
                    roles: []
                },
                controller : 'LoginCtrl'
            })
            .state('/404', {
                url : '/404',
                data : {
                    roles:[]
                },
                templateUrl : 'partials/_404.static.html'
            })
            .state('/denied',{
                url : '/403',
                data : {
                    roles : []
                },
                templateUrl: 'partials/_denied.html'
            });
        $httpProvider.interceptors.push(['$q','$location','$localStorage', function($q, $location, $localStorage){
            return {
                'request' : function(config){
                    config.headers = config.headers || {};

                    if($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response){
                    if(response.status === 401 || response.status === 403){
                        $location.path('/signin');
                    }

                    return $q.reject(response);
                }
            }
        }])
    }])
    .run(['$rootScope', '$state', '$stateParams', 'authorization', 'AuthenFactory', '$localStorage',
        function($rootScope, $state, $stateParams, authorization, AuthenFactory, $localStorage){
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            $rootScope.authenticated = AuthenFactory.authenticate();

            //delete $localStorage.token;
            authorization.authorize();
        });
    }])
    //clear cache view
    .run(['$rootScope', '$templateCache', function($rootScope, $templateCache){
        $rootScope.$on('$viewContentLoaded', function(){
            $templateCache.removeAll();
        })
    }]);
