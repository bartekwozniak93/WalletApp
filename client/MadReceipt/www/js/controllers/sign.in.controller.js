angular.module('sign.in.controllers', [])
  .controller('SignInCtrl', function ($scope, $window, ReceiptsServer, DefService) {

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
