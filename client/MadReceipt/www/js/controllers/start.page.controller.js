angular.module('start.page.controllers', [])

  .controller('StartPageCtrl', function ($scope, $state, $window, $http) {

    $scope.goTo = function (destinationPage) {

      $state.go(destinationPage);
    };






    $scope.loginWithFacebook = function () {
      $window.alert("in login with fb");

      $window.location.href = 'http://localhost:5000/api/facebook/login';
      /*
      var req = {
        method: 'POST',
        url: 'http://localhost:5000/api/facebook/login'
      };

      $http(req).then(function() {

        alert("success");

      }, function() {
        alert("Problem with connection to server");
      });


      resp = $http(req);
      redirect = false;
      if(res.getStatusCode() >=300 && res.getStatusCode() <= 307 && res.getStatusCode() != 306) {
        do {
          alert("in 1");
          redirect = false; // reset the value each time
          loc = res.getHeader('Location'); // get location of the redirect
          if(loc == null) {
            alert("in 2");
            redirect = false;
            continue;
          }
          alert("in 3");
          req = new HttpRequest();
          req.setEndpoint(loc);
          req.setMethod('GET');
          res = http.send(req);
          if(res.getStatusCode() != 500) { // 500 = fail
            if(res.getStatusCode() >=300 && res.getStatusCode() <= 307 && res.getStatusCode() != 306) {
              redirect= true;
            }
            // I do special handling here with cookies
            // if you need to bring a session cookie over to the
            // redirected page, this is the place to grab that info
          }
        } while (redirect && Limits.getCallouts() != Limits.getLimitCallouts());
      }
*/

    };


      $scope.submitForm = function() {
        alert("in submit");
        console.log("posting data....");

        $http.post('http://localhost:5000/api/facebook/login').success(function(){alert("success");});
      };



  })

;
