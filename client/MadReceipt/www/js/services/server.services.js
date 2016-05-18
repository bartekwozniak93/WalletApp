angular.module('server.services', [])

  .factory('ReceiptsServer', function ($http, $window) {


    var serverServices = {};

    serverServices.insertUser = function (email, password) {

      var dataToPost = 'email=' + email + '&password=' + password;


      var req = {
        method: 'POST',
        url: 'http://localhost:5000/api/local/users',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
          "Access-Control-Max-Age": "3600",
          "Access-Control-Allow-Headers": "x-requested-with"},
        data: dataToPost
      };

      return $http(req);

    };




    serverServices.loginUser = function (email, password) {

      var dataToPost = 'email=' + email + '&password=' + password;

      var req = {
        method: 'POST',
        url: 'http://localhost:5000/api/local/login',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
          "Access-Control-Max-Age": "3600",
          "Access-Control-Allow-Headers": "x-requested-with"},
        data: dataToPost
      };

      return $http(req);

    };

    serverServices.useOCR = function (receiptImage) {

      var dataToPost = 'att=' + receiptImage;
      var auth = 'JWT ' + $window.sessionStorage.token;

      alert(auth);

      var req = {
        method: 'POST',
        url: 'http://localhost:5000/api/receipts/att',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
          "Authorization": auth,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
          "Access-Control-Max-Age": "3600",
          "Access-Control-Allow-Headers": "x-requested-with"},
        data: dataToPost
      };

      return $http(req);

    };


      serverServices.getAllReceipts = function () {

        var auth = 'JWT ' + $window.sessionStorage.token;

        var req = {
          method: 'GET',
          url: 'http://localhost:5000/api/receipts',
          headers: {'Authorization': auth}
        };

        return $http(req);

      };



    return serverServices;
  });
