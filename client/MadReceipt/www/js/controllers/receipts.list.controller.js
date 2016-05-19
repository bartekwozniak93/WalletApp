angular.module('receiptsList.controllers', [])
  .controller('ReceiptsListCtrl', function ($scope, $window, $state, $http, $cordovaToast, $ionicLoading, DatabaseService) {

    $scope.$on('$ionicView.enter', function () {
      $scope.receipts = [];
      $scope.getReceipts();
    });

    $scope.filterBySelectedValue= function(selectedFilter) {

      switch(selectedFilter) {
        case "None":
          alert("none");
          $scope.filter = "";
          break;
        case "Category":
          alert("category");
          $scope.filter = $scope.receipt.category;
          break;
        default:
          $scope.filter = "";
      }
    };

    $scope.getReceipts = function () {
      $scope.receiptsNo = 0;
      show();
      try {
        DatabaseService.selectAll().then(function (receiptsList) {

          hide();
          $scope.receipts = receiptsList;
          $scope.receiptsNo = receiptsList.length;

        }, function (err) {
          hide();
          messagesMaker('Error!!');

        });
      } catch (ex) {
        hide();
        $scope.errorMessage ="Unfortunately some browsers or devices do not support saving receipts locally:(";
      }

    };


    $scope.uploadReceipts = function () {
      if ($window.sessionStorage.token != undefined) {
        $scope.goTo('tab.receipt-upload');
      } else {
        messagesMaker("You must be logged in to send receipts");
        $scope.goTo('signin');
        //TODO: Okno z wybraniem metody logowania
      }

    };



    $scope.removeReceipt = function(receiptId){
      DatabaseService.remove(receiptId).then(function () {

        $scope.getReceipts();

      }, function (err) {
        messagesMaker('Error!!');

      });
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
