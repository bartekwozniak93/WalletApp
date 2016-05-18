angular.module('receipt.controllers', [])
  .controller('ReceiptCtrl', function ($scope, $state, $window, $stateParams, $cordovaToast, $ionicLoading, DatabaseService, ReceiptsServer) {
    //$scope.chat = Chats.get($stateParams.chatId);
    $scope.$on('$ionicView.enter', function () {
      $scope.receipt=[];
      show();

      try {
        DatabaseService.select($stateParams.receiptId).then(function (receipt) {

          hide();
          $scope.receipt = receipt;

        }, function (err) {
          hide();
          messagesMaker('Error!!');

        });
      } catch (ex) {
        hide();
        $scope.errorMessage ="Unfortunately some browsers or devices do not support saving receipts locally:(";
      }
    });



    $scope.removeReceipt = function(receiptId){
      DatabaseService.remove(receiptId).then(function () {
        $state.go('tab.receiptsList');

      }, function (err) {
        messagesMaker('Error!!');

      });
    };

    $scope.readReceipt = function(receiptId, receiptImage){
      console.log(receiptImage);
      alert(receiptImage);
      ReceiptsServer.useOCR(receiptImage).then(function (response) {
        messagesMaker(response.data.message);

       /* if (response.data != '"Login or password is incorrect."') {

          alert(response.data.token);
          $window.sessionStorage.token = response.data.token;
          $state.go('tab.newReceipt');

        } else {
          messagesMaker(response.data);
        }*/
      }, function (error) {

        messagesMaker("Error!!!");
      });
    };

    $scope.updateReceipt = function(receipt){
      DatabaseService.update(receipt).then(function () {
        messagesMaker("Receipt updated");

      }, function (err) {
        messagesMaker('Error!!');

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

    var show = function () {
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-energized"></ion-spinner>'


      });
    };
    var hide = function () {
      $ionicLoading.hide();
    };

  });
