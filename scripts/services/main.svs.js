(function(){
    'use strict';

    angular.module('xMonitorApp')
        .factory('MainFactory', ['$http', '$q', '$upload', 'BASE_URL', function($http, $q, $upload, BASE_URL){
            var baseUrl = BASE_URL;

            var messages = {
                allMessage : function(success, error){
                    var deferred = $q.defer();
                    $http.get(baseUrl + '/messages').success(function(res){
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
                        $http.get(baseUrl +'/newUserbt', {params: params}).success(function(res){
                            deferred.resolve(res)
                        }).error(error);

                        return deferred.promise;
                    },

                    activeUserByTime: function (params, error) {
                        var deferred = $q.defer();
                        $http.get(baseUrl +'/activeUserbt', {params: params}).success(function(res){
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
            var payment = {
                url : baseUrl +'/payment',
                card : {
                    cardsByTime: function (params, error) {
                        var deferred = $q.defer();
                        $http.get(this.url +'/cardbt', {params: params}).success(function(res){
                            deferred.resolve(res)
                        }).error(error);

                        return deferred.promise;
                    }
                },
                sms : {
                    smsByTime : function(params, error) {
                        var deferred = $q.defer();
                        $http.get(this.url +'/smsbt', {params: params}).success(function(res){
                            deferred.resolve(res)
                        }).error(error);

                        return deferred.promise;
                    }

                },
                bankTransfer : {
                    bankTransferByTime : function(params, error) {
                        var deferred = $q.defer();
                        $http.get(this.url +'/banktransferbt', {params: params}).success(function(res){
                            deferred.resolve(res)
                        }).error(error);

                        return deferred.promise;
                    }
                }
            };

            var pci = {
                url : baseUrl + '/pcis',

                all : function(error){
                    var deferred = $q.defer();
                    $http.get(this.url).success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                },
                one : function(id, error){
                    var deferred = $q.defer();
                    $http.get(this.url + '/' + id).success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                },
                createApp : function(data, file, success, error){
                    //$http.post(baseUrl + '/pcis', data).success(success).error(error);
                    $upload.upload({
                        url : this.url,
                        fields : data,
                        file : file
                    }).progress(function(evt){
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ');
                    }).success(success);
                },
                updateApp : function(id, file, data, success, error){
                    if(file !== null) {
                        $upload.upload({
                            method : 'PUT',
                            url: this.url + '/' + id,
                            fields: data,
                            file: file
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ');
                        }).success(success);
                    } else {
                        $http.put(this.url + '/'+id, data).success(success).error(error);
                    }
                },
                deleteApp : function(id, success, error){
                    $http.delete(this.url + '/' + id).success(success).error(error);
                }
            };

            var users = {
                url : baseUrl + "/users",

                allUsers : function(error){
                    var deferred = $q.defer();
                    $http.get(this.url ,{cache: true}).success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                },
                ccu : function(params, error){
                    var deferred = $q.defer();
                    $http.get(this.url + '/ccu',{params: params}).success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                },
                feedback : function(params, error){
                    var deferred = $q.defer();
                    $http.get(this.url + '/feedback',{params: params}).success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                },
                findUser : function(data, success, error){
                    $http.post(this.url + '/find', data).success(success).error(error);
                },
                changePassword : function(username, data, success, error){
                    $http.post(this.url + '/' + username + '/change', data).success(success).error(error);
                },
                logs : function(userID, error){
                    var deferred = $q.defer();
                    $http.get(this.url + '/' + userID + '/logs' ).success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                },
                changeStatus : function(username, data, success, error){
                    $http.post(this.url + '/' + username + '/status', data).success(success).error(error);
                }
            };

            var admin = {
                url : baseUrl + '/users/admin',
                allAdmin : function(error){
                    var deferred = $q.defer();
                    $http.get(this.url).success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                },
                oneAdmin : function(username, error){
                    var deferred = $q.defer();
                    $http.get(this.url + '/'+ username).success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                },
                addAdmin : function(data, success, error){
                    $http.post(this.url, data).success(success).error(error);
                },
                changePermission : function(adminUser, data, success, error){
                    $http.put(this.url + '/' + adminUser + '/changePermission', data).success(success).error(error);
                },
                changePassword : function(adminUser, data, success, error){
                    $http.post(this.url + '/' + adminUser + '/changePassword', data).success(success).error(error);
                },
                deleteAdmin : function(adminUser, success, error){
                    $http.delete(this.url + '/' + adminUser).success(success).error(error);
                },
                logs : function(error){
                    var deferred = $q.defer();
                    $http.get(this.url + '/logs').success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                }
            };

            var event = {
                url : baseUrl + '/event',
                allEvents : function(error){
                    var deferred = $q.defer();
                    $http.get(this.url + '/getEvents',{cache: true}).success(function(res){
                        deferred.resolve(res);
                    }).error(error);

                    return deferred.promise;
                },
                createEvent : function(data, file, success, error){
                    $upload.upload({
                        url : this.url,
                        fields : data,
                        file : file
                    }).progress(function(evt){
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ');
                    }).success(success);
                },
                updateEvent : function(id, file, data, success, error){
                    if(file !== null) {
                        $upload.upload({
                            method : 'PUT',
                            url: this.url + '/' + id,
                            fields: data,
                            file: file
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ');
                        }).success(success);
                    } else {
                        $http.put(this.url + '/' + id, data).success(success).error(error);
                    }
                },
                deleteEvent : function(id, success, error){
                    $http.delete(this.url + '/' + id).success(success).error(error);
                }
            };
            return {
                message : messages,
                statistic : statistic,
                user : users,
                payment: payment,
                pci : pci,
                event: event,
                admin : admin
            };
        }]);
})();
