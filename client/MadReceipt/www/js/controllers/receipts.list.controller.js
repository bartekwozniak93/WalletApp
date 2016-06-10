angular.module('receiptsList.controllers', [])
  .controller('ReceiptsListCtrl', function ($timeout, $scope, $window, $state, $http, $cordovaToast, $ionicLoading, DatabaseService, ReceiptsServer, DefService) {

    $scope.$on('$ionicView.enter', function () {
      $scope.receipts = [];
      $scope.getReceipts();
    });

    $scope.$on("$ionicView.destroy", function (event) {
      $timeout.cancel(timer);
    });

    var timer = $timeout(function () {
      console.log("Timeout executed", Date.now());
    }, 2000);


    $scope.getReceipts = function () {
      $scope.receiptsNo = 0;
      DefService.show();
      try {
        DatabaseService.selectAll().then(function (receiptsList) {

          DefService.hide();
          $scope.receipts = receiptsList;
          $scope.receiptsNo = receiptsList.length;

        }, function (error) {
          DefService.hide();
          console.log(error);

        });
      } catch (ex) {
        DefService.hide();
        $scope.errorMessage ="Unfortunately some browsers or devices do not support saving receipts locally:(";
      }

    };


    $scope.uploadReceipts = function () {
      if ($window.sessionStorage.token != undefined) {
        DefService.goTo('tab.receipt-upload');
      } else {
        DefService.messagesMaker("You must be logged in to send receipts");
        DefService.goTo('signin');
      }

    };

    /*    $scope.downloadReceipts = function () {
     if ($window.sessionStorage.token != undefined) {


     DefService.goTo('tab.receipt-upload');
     } else {
     DefService.messagesMaker("You must be logged in to download receipts");
     DefService.goTo('signin');
     }

     };*/

    $scope.downloadReceipts = function () {

      $scope.receipts = [];


      if ($window.sessionStorage.token == undefined) {
        DefService.messagesMaker("You're not logged in");
      } else {

        var token = 'JWT ' + $window.sessionStorage.token;

        DatabaseService.removeOnline();

        ReceiptsServer.selectAllReceipts().then(function (receiptsList) {
          console.log(receiptsList);

          DatabaseService.insertFromServer(receiptsList);
          $scope.getReceipts();

        }, function (error) {
          DefService.hide();
          console.log(error);

        });
      }

    };

    $scope.removeReceipt = function(receiptId){
      DatabaseService.remove(receiptId).then(function () {

        $scope.getReceipts();

      }, function (error) {
        console.log(error);

      });
    };

    $scope.signInOut = function () {
      DefService.signInOut();
    };

    $scope.goHome = function () {
      DefService.goTo('start');
    };

  });
