angular.module('sign.in.controllers', [])
  .controller('SignInCtrl', function ($timeout, $scope, $window, ReceiptsServer, DefService) {

    $scope.$on("$ionicView.destroy", function (event) {
      $timeout.cancel(timer);
    });

    var timer = $timeout(function () {
      console.log("Timeout executed", Date.now());
    }, 2000);


    $scope.signIn = function (email, password) {

      ReceiptsServer.loginUser(email, password).then(function (response) {

        if (response.data != '"Login or password is incorrect."') {

          $window.sessionStorage.token = response.data.token;
          DefService.goTo('tab.newReceipt');

        } else {
          DefService.messagesMaker(response.data);
        }
      }, function (error) {

        console.log(error);
      });
    };

  });
