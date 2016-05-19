angular.module('serverReceiptsList.controllers', [])
  .controller('ServerReceiptsListCtrl', function ($scope, $window, $state, $http, $cordovaToast, $ionicLoading, ReceiptsServer) {

    $scope.receiptsNo;

    $scope.$on('$ionicView.enter', function () {
      $scope.receipts = [];
      $scope.getReceiptsFromServer();
    });



    $scope.getReceiptsFromServer = function () {
      $scope.connectionMessage ='';
      $scope.receipts = [];


      if (window.navigator.onLine) {
        if ($window.sessionStorage.token == undefined) {
          $scope.connectionMessage = "You're not logged in";
        } else {

          var token = 'JWT ' + $window.sessionStorage.token;

          console.log(token);

          ReceiptsServer.selectAllReceipts().then(function (receiptsList) {

            hide();
            $scope.receipts = receiptsList.data;
            $scope.receiptsNo = receiptsList.data.length;

            console.log(receiptsList);

          }, function (err) {
            hide();
            messagesMaker('Error!!');

          });
        }
      } else {
        $scope.connectionMessage = "You are offline";
      }


    };

    $scope.getBase64Image = function (imageData) {

      var image = "data:image/png;base64," + imageData;
      return image;
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

    var show = function () {
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-energized"></ion-spinner>'


      });
    };
    var hide = function () {
      $ionicLoading.hide();
    };


  });
