angular.module('serverUpload.controllers', [])
  .controller('ServerUploadCtrl', function ($scope, $window, $state, $http, $cordovaToast, $ionicLoading, DatabaseService, ReceiptsServer) {

    $scope.selectedReceipts = {};

    $scope.$on('$ionicView.enter', function () {
      $scope.receipts = [];
      $scope.getOfflineReceipts();
    });


    $scope.checkAll = function () {
      angular.forEach($scope.receipts, function (receipt) {
        $scope.selectedReceipts[receipt._id] = true;
      });
    };

    $scope.getOfflineReceipts = function () {
      console.log("in get offline");
      $scope.receiptsNo = 0;
      show();
      try {
        DatabaseService.selectAllOffline().then(function (receiptsList) {

          angular.forEach(receiptsList, function (receipt) {
            $scope.selectedReceipts[receipt._id] = false;
          });


          $scope.receipts = receiptsList;
          $scope.receiptsNo = receiptsList.length;


          hide();

        }, function (err) {
          hide();
          messagesMaker('Error!!');

        });
      } catch (ex) {
        hide();
        $scope.errorMessage = "Unfortunately some browsers or devices do not support saving receipts locally:(";
      }

    };

    $scope.sendToServer = function () {


      $scope.goTo('tab.serverReceiptsList');

      var selectedReceiptsNo = 0;
      var proceedReceipts = 0;


      angular.forEach($scope.receipts, function (receipt) {
        show();
        if ($scope.selectedReceipts[receipt._id] == true) {
          try {
            ReceiptsServer.insertReceipt(receipt).then(function () {
              console.log("send success");
              selectedReceiptsNo = selectedReceiptsNo + 1;

              DatabaseService.updateOnlineStatus(receipt._id);


            }, function (err) {
              hide();
              proceedReceipts += 1;
              console.log('Error occured while sending receipt');

            });
          } catch (ex) {
            hide();
            proceedReceipts += 1;
            $scope.errorMessage = "Unfortunately some browsers or devices do not support saving receipts locally:(";
          }
        } else {
          proceedReceipts += 1;
        }


      });
      hide();


    };

    $scope.cancelSending = function () {
      $scope.goTo('tab.receiptsList');

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

    $scope.goTo = function (destinationPage) {

      $state.go(destinationPage);
    };


  });
