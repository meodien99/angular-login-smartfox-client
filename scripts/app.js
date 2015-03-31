'use strict';

angular.module('xMonitorApp',[
    'ngStorage',
    'angular-loading-bar',
    'ui.router',
    'xMonitorApp.dirPagination',
    'angularFileUpload',
    'chart.js',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker'
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
                    'body@home': {
                        templateUrl : 'partials/charts.tpl.html',
                        controller : 'ChartCtrl'
                    }
                }
            })
            .state('home.message', {
                url :'/message',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'body@home' : {
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
            .state('home.payments', {
                url :'/payments',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'body@home' : {
                        templateUrl : 'partials/payments.tpl.html',
                        resolve : {
                            /*usersData : ['MainFactory', function(MainFactory){
                                return MainFactory.user.allUsers(function(error){
                                    console.log(error);
                                });
                            }]*/
                        },
                        controller : 'PayCtrl'
                    }
                }
            })
            .state('home.events', {
                url :'/events',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'body@home' : {
                        templateUrl : 'partials/events.tpl.html',
                        controller : 'EventCtrl'
                    }
                }
            })
            .state('home.statistics', {
                url :'/statistics',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'body@home' : {
                        templateUrl : 'partials/statistics/statistics.tpl.html',
                        controller : 'StatCtrl'
                    }
                }
            })
            .state('home.pci', {
                url :'/pci',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'body@home' : {
                        templateUrl : 'partials/pci/index.tpl.html',
                        controller : 'PCICtrl'
                    }
                }
            })
            .state('home.users', {
                url :'/users',
                data : {
                    roles: ['Admin', 'User']
                },
                views : {
                    'body@home' : {
                        templateUrl : 'partials/users/index.tpl.html',
                        controller : 'UserCtrl'
                    }
                }
            })
            .state('home.admin', {
                url : '/admin',
                data : {
                    roles : ['Admin']
                },
                views : {
                    'body@home' : {
                        templateUrl : 'partials/admin/index.tpl.html',
                        controller : 'AdminCtrl'
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
        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage){
            return {
                'request' : function(config){
                    config.headers = config.headers || {};

                    if($localStorage.user){
                        config.headers.Authorization = 'Bearer ' + $localStorage.user.token;
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
    /*//clear cache view
    .run(['$rootScope', '$templateCache', function($rootScope, $templateCache){
        $rootScope.$on('$viewContentLoaded', function(){
            $templateCache.removeAll();
        })
    }])*/;
