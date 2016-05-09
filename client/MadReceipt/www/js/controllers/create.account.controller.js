angular.module('account.controllers', [])
  .controller('CreateAccountCtrl', function ($scope, $state, $window, $http, $cordovaToast, ReceiptsServer) {

    $scope.signUp = function (email, username, password, password_confirmed) {

      var invalidPasswordMessage = checkPasswordStrength(password);
      if (invalidPasswordMessage != '') {


        messagesMaker(invalidPasswordMessage);
      } else {
        if (password != password_confirmed) {

          messagesMaker("Passwords are not the same");

        } else {

          ReceiptsServer.insertUser(email, username, password).then(function (response) {
            if (response.data.message == "New user added to the best app ever!") {

              messagesMaker(response.data.message);
              //$window.sessionStorage.token = data.token;
              $window.sessionStorage.token = '56ee6add41f6912a1931ebe6';
              $state.go('tab.newReceipt');

            } else {
              messagesMaker("Username already exists!!!");
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
