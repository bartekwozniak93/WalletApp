angular.module('server.services', [])

  .factory('ReceiptsServer', function ($http, $window) {


    var serverServices = {};

    serverServices.insertUser = function (email, username, password) {


      var dataToPost = 'username=' + username + '&password=' + password;

      var req = {
        method: 'POST',
        url: 'http://localhost:5000/api/users',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: dataToPost
      }

      return $http(req);

    };


    return serverServices;
  });
