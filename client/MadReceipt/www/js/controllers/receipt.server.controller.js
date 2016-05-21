angular.module('receipt.server.controllers', [])
  .controller('ReceiptServerCtrl', function ($scope, $stateParams, ReceiptsServer, DefService) {

    $scope.$on('$ionicView.enter', function () {
      $scope.receipt = [];
      DefService.show();

      ReceiptsServer.selectReceipt($stateParams.receiptId).then(function (receipt) {

        DefService.hide();
        $scope.receipt = receipt.data;

      }, function (error) {
        DefService.hide();
        console.log(error);

      });

    });


    $scope.removeReceipt = function (receiptId) {
      ReceiptsServer.deleteReceipt(receiptId).then(function (message) {
        console.log(message);
        DefService.goTo('tab.serverReceiptsList');

      }, function (error) {
        if (error == "Unauthorized") {
          DefService.messagesMaker(error);
        }
        console.log(error);

      });
    };


    $scope.updateReceipt = function (receipt) {
      ReceiptsServer.updateReceipt(receipt).then(function () {
        DefService.messagesMaker("Receipt updated");
        DefService.goTo("tab.serverReceiptsList");


      }, function (error) {
        console.log(error);

      });
    };


    $scope.getBase64Image = function (imageData) {

      var image = "data:image/png;base64," + imageData;
      return image;
    };


  });
