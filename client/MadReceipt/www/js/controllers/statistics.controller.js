angular.module('statistics.controllers', [])
  .controller('StatisticsCtrl', function ($scope, $window, $state, $cordovaToast, $ionicLoading, DatabaseService) {

    $scope.$on('$ionicView.enter', function () {

      $scope.series = ['Series A'];
      /*$scope.data = [
        [65, 59, 80, 81, 56, 55, 40]
      ];*/
      createDataForCategoryChart();
    });


    var createDataForCategoryChart = function(){
      show();
      try {
        DatabaseService.selectAll().then(function (receiptsList) {

          var categoriesList  = [];
          var dateList = [];
          var receiptsNoByCategory = [];
          var receiptsTotalByDate = [];
          var totalSum = 0;

          $scope.receiptsNo = receiptsList.length;
          for(var i=0; i<receiptsList.length;i++){

            dateList.push(receiptsList[i]._date);
            receiptsTotalByDate.push(receiptsList[i].total);

            totalSum = totalSum + receiptsList[i].total;

            if(categoriesList.indexOf(receiptsList[i].category) == -1) {
              categoriesList.push(receiptsList[i].category);
            }
          }


          for(var i=0; i<categoriesList.length;i++){
            receiptsNoByCategory[i] = (parseInt(countReceiptsInCategory(categoriesList[i],receiptsList)));
          }

          var receiptsNoWrapper = [];

          $scope.categories = categoriesList;
          receiptsNoWrapper.push(receiptsNoByCategory);
          $scope.receiptsByCategory = receiptsNoWrapper;

          $scope.dates = dateList;
          var receiptsTotalByDateWrapper = [];
          receiptsTotalByDateWrapper.push(receiptsTotalByDate);
          $scope.receiptsTotalByDate = receiptsTotalByDateWrapper;

          $scope.totalSum = totalSum;

          hide();

        }, function (err) {
          hide();
          messagesMaker('Error!!');

        });
      } catch (ex) {
        hide();
        $scope.errorMessage ="Unfortunately some browsers or devices do not support saving receipts locally:(";
      }
    };

    var countReceiptsInCategory= function(category, receiptsList){
      var numberOfReceipts = 0;
      for(var i=0; i<receiptsList.length;i++){
        if(receiptsList[i].category == category){
          numberOfReceipts++;
        }
      }
      return numberOfReceipts;
    };



    /*
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

     */


    var show = function () {
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-energized"></ion-spinner>'


      });
    };
    var hide = function () {
      $ionicLoading.hide();
    };


    $scope.signInOut = function () {
      if ($window.sessionStorage.token != null) {
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


  });
