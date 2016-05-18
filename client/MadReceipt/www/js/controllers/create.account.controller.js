angular.module('account.controllers', [])
  .controller('CreateAccountCtrl', function ($scope, $state, $window, $http, $cordovaToast, ReceiptsServer) {

    $scope.signUp = function (email, password, password_confirmed) {

      var invalidPasswordMessage = checkPasswordStrength(password);
      if (invalidPasswordMessage != '') {


        messagesMaker(invalidPasswordMessage);
      } else {
        if (password != password_confirmed) {

          messagesMaker("Passwords are not the same");

        } else {

          ReceiptsServer.insertUser(email, password).then(function (response) {

            if (response.data != '"That email is already taken."') {

              messagesMaker('Account is created');
              $window.sessionStorage.token = response.data.token;
              $state.go('tab.newReceipt');

            } else {
              messagesMaker(response.data);
            }
          }, function (error) {

            messagesMaker("Error!!!");
          });


        }
      }
    };

    var checkPasswordStrength = function (password) {
      var hasNumber = password.match(/\d+/g);
      var hasUppercase = password.match(/[A-Z]/);
      var hasLength = password.length;

      var invalidPasswordMessage = '';

      if (hasLength < 6) {
        invalidPasswordMessage += 'The password must be at least 6 characters long.\n';
      }
      if (hasNumber == null) {
        invalidPasswordMessage += 'The password must contain at least one number.\n';
      }
      if (hasUppercase == null) {
        invalidPasswordMessage += 'The password must contain at least one uppercase letter.\n';
      }

      return invalidPasswordMessage;

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
    }


  })
;
