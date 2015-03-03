'use strict';

angular.module('xMonitorApp')
    .factory('MainFactory', ['$http', '$q', function($http, $q){
        var baseUrl = "http://localhost:3333";

        var messages = {
            allMessage : function(success, error){
                var deferred = $q.defer();
                $http.get(baseUrl + '/messages',{cache: true}).success(function(res){
                    deferred.resolve(res);
                }).error(error);

                return deferred.promise;
            },
            oneMessage : function(id, success, error){
                var deferred = $q.defer();
                $http.get(baseUrl + '/messages/' + id).success(function(res){
                    deferred.resolve(res);
                }).error(error);

                return deferred.promise;
            },
            createMessage : function(data, success, error){
                $http.post(baseUrl + '/messages', data).success(success).error(error);
            },
            editMessage : function(id, data, success, error) {
                $http.put(baseUrl +'/messages/' + id, data).success(success).error(error);
            },
            deleteMessage : function(id, success, error){
                $http.delete(baseUrl + '/messages/' + id).success(success).error(error);
            }
        };

        var statistic = {
            user : {
                newUserByTime: function (params, error) {
                    var deferred = $q.defer();
                    $http.get(baseUrl +'/nubt', {params: params}).success(function(res){
                        deferred.resolve(res)
                    }).error(error);

                    return deferred.promise;
                },
                newUserByRange: function (params, error) {
                    var deferred = $q.defer();
                    $http.get(baseUrl +'/nubr', {params: params}).success(function(res){
                        deferred.resolve(res)
                    }).error(error);

                    return deferred.promise;
                },
                userPlayedByTime: function (params, error) {
                    var deferred = $q.defer();
                    $http.get(baseUrl +'/upbt', {params: params}).success(function(res){
                        deferred.resolve(res)
                    }).error(error);

                    return deferred.promise;
                },
                userPlayedByRange: function (params, error) {
                    var deferred = $q.defer();
                    $http.get(baseUrl +'/upbr', {params: params}).success(function(res){
                        deferred.resolve(res)
                    }).error(error);

                    return deferred.promise;
                }
            },
            game : {
                gameByTime : function(params, error) {
                    var deferred = $q.defer();
                    $http.get(baseUrl +'/gbt', {params: params}).success(function(res){
                        deferred.resolve(res)
                    }).error(error);

                    return deferred.promise;
                },
                gameByRange : function(params, error) {
                    var deferred = $q.defer();
                    $http.get(baseUrl +'/gbr', {params: params}).success(function(res){
                        deferred.resolve(res)
                    }).error(error);

                    return deferred.promise;
                }
            },
            task : {
                taskByTime : function(params, error){
                    var deferred = $q.defer();
                    $http.get(baseUrl +'/gtbt', {params: params}).success(function(res){
                        deferred.resolve(res)
                    }).error(error);
                    return deferred.promise;
                }
            }
        };

        var pci = {
            all : function(params, error){
                var deferred = $q.defer();
                $http.get(baseUrl + '/',{cache: true}).success(function(res){
                    deferred.resolve(res);
                }).error(error);

                return deferred.promise;
            },
            one : function(params, error){
                var deferred = $q.defer();
                $http.get(baseUrl + '/messages',{cache: true}).success(function(res){
                    deferred.resolve(res);
                }).error(error);

                return deferred.promise;
            },
            create : function(params, error){

            },
            update : function(params, error){

            },
            delete : function(params, error){

            }
        };

        var users = {
            allUsers : function(error){
                var deferred = $q.defer();
                $http.get(baseUrl + '/users',{cache: true}).success(function(res){
                    deferred.resolve(res);
                }).error(error);

                return deferred.promise;
            }
        };
        return {
            message : messages,
            statistic : statistic,
            user : users
        };
    }]);