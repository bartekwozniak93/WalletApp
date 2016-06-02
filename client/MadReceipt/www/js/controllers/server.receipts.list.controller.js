angular.module('serverReceiptsList.controllers', [])
  .controller('ServerReceiptsListCtrl', function ($timeout, $scope, $window, $ionicLoading, ReceiptsServer, DefService) {

    $scope.receiptsNo;

    $scope.$on('$ionicView.enter', function () {
      $scope.receipts = [];
      $scope.getReceiptsFromServer();


    });
    $scope.$on("$ionicView.destroy", function (event) {
      $timeout.cancel(timer);
    });

    var timer = $timeout(function () {
      console.log("Timeout executed", Date.now());
    }, 2000);



    $scope.getReceiptsFromServer = function () {
      $scope.connectionMessage = '';
      $scope.receipts = [];


      if (window.navigator.onLine) {
        if ($window.sessionStorage.token == undefined) {
          $scope.connectionMessage = "You're not logged in";
        } else {

          var token = 'JWT ' + $window.sessionStorage.token;

          console.log(token);

          ReceiptsServer.selectAllReceipts().then(function (receiptsList) {

            DefService.hide();
            $scope.receipts = receiptsList.data;
            $scope.receiptsNo = receiptsList.data.length;

            console.log(receiptsList);

          }, function (error) {
            DefService.hide();
            console.log(error);

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
      DefService.signInOut();
    };

    $scope.goHome = function () {
      DefService.goTo('start');
    };


    var connectionMessageBuilder = function (message) {
      var messageText = '<div style="align-content: center"><i class="icon ion-chatbubble-working"></i><h2>' + message + '</h2></div>';
      $scope.connectionMessage = messageText;
    };


  });
