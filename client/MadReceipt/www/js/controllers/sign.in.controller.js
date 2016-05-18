angular.module('sign.in.controllers', [])
  .controller('SignInCtrl', function ($scope, $state, $window, $http, $cordovaToast, ReceiptsServer) {

    $scope.signIn = function (email, password) {

      ReceiptsServer.loginUser(email, password).then(function (response) {

        if (response.data != '"Login or password is incorrect."') {


          $window.sessionStorage.token = response.data.token;
          $state.go('tab.newReceipt');

        } else {
          messagesMaker(response.data);
        }
      }, function (error) {

        messagesMaker("Error!!!");
      });
    };

    var messagesMaker = function (message) {
      try {
        $cordovaToast
          .show(message, 'long', 'bottom')
          .then(function (success) {
            // success
          }, function (error) {

          });
      } catch (ex) {
        $window.alert(message);
      }
    };


  });
