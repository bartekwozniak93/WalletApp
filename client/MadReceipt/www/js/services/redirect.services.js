angular.module('redirect.services', ['ionic', 'ngCordova'])

  .factory('redirectInterceptor', ['$location', '$q', function($location, $q) {
    return function(promise) {
      promise.then(
        function(response) {
          alert("in 1");
          if (typeof response.data === 'string') {
            if (response.data.indexOf instanceof Function &&
              response.data.indexOf('<!DOCTYPE html>') != -1) {

              alert("in 2");

              $location.path("http://localhost:5000/api/facebook/login");
              window.location = url + "logout"; // just in case
            }
          }
          return response;
        },
        function(response) {
          alert("in reject");
          return $q.reject(response);
        }
      );
      return promise;
    };
  }]);
