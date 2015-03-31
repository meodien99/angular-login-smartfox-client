(function(){
    'use strict';

    angular.module('xMonitorApp')
        .constant('BASE_URL', 'http://localhost:3769')
        .constant('angularMomentConfig', {
            preprocess: 'utc', // optional
            timezone: 'Asia/Saigon' // optional
        });
})();
