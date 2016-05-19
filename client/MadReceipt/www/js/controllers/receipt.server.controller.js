angular.module('receipt.server.controllers', [])
  .controller('ReceiptServerCtrl', function ($scope, $state, $window, $stateParams, $cordovaToast, $ionicLoading, ReceiptsServer) {

    $scope.$on('$ionicView.enter', function () {
      $scope.receipt = [];
      show();

      ReceiptsServer.selectReceipt($stateParams.receiptId).then(function (receipt) {

        hide();
        console.log(receipt.data);
        $scope.receipt = receipt.data;

      }, function (err) {
        hide();
        messagesMaker('Error!!');

      });

    });


    $scope.removeReceipt = function (receiptId) {
      ReceiptsServer.deleteReceipt(receiptId).then(function (message) {
        console.log(message);
        $state.go('tab.serverReceiptsList');

      }, function (err) {
        if (err == "Unauthorized") {
          messagesMaker(err);
        }
        messagesMaker('Error!!');

      });
    };


    $scope.updateReceipt = function (receipt) {
      ReceiptsServer.updateReceipt(receipt).then(function () {
        messagesMaker("Receipt updated");
        $state.go("tab.serverReceiptsList");
        //TODO: redirect do listy paragonów

      }, function (err) {
        messagesMaker('Error!!');

      });
    };


    $scope.getBase64Image = function (imageData) {

      var image = "data:image/png;base64," + imageData;
      return image;
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

    var show = function () {
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-energized"></ion-spinner>'


      });
    };
    var hide = function () {
      $ionicLoading.hide();
    };

  });
