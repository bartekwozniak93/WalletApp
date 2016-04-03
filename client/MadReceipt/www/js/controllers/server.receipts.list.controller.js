angular.module('serverReceiptsList.controllers', [])
  .controller('ServerReceiptsListCtrl', function ($scope, $window, $state, $http, $cordovaToast) {

    $scope.$on('$ionicView.enter', function() {
      $scope.receipts = [];
      $scope.getReceiptsFromServer();
    });


    $scope.getReceiptsFromServer = function () {
      $scope.connectionMessage ='';

      if (window.navigator.onLine) {
        var token = $window.sessionStorage.token;

        if (token == '') {
          $scope.connectionMessage = "You're not logged in";
        } else {

          var req = {
            method: 'GET',
            url: 'http://localhost:5000/api/receipts',

            headers: {'Authorization': token}
          };

          $http(req).then(function successCallback(response) {

            if (response.data != "Unauthorized") {

              $scope.receipts = response.data;

            } else {
              $scope.connectionMessage = "Problem with connection to server";
            }
          }, function errorCallback(response) {
            $scope.connectionMessage = "Problem with connection to server";
          });
        }
      } else {
        $scope.connectionMessage = "You are offline";
      }


    };
    $scope.signInOut = function () {
      if($window.sessionStorage.token != null) {
        delete $window.sessionStorage.token;

        $state.go('start');
      } else {
        $state.go('signin');
      }
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

    var connectionMessageBuilder = function(message){
      var messageText = '<div style="align-content: center"><i class="icon ion-chatbubble-working"></i><h2>'+ message +'</h2></div>';
      $scope.connectionMessage = messageText;
    }


  });
