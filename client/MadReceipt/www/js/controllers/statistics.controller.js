angular.module('statistics.controllers', [])
  .controller('StatisticsCtrl', function ($scope, $window, DatabaseService, DefService) {

    $scope.$on('$ionicView.enter', function () {

      $scope.series = ['Series A'];
      /*$scope.data = [
        [65, 59, 80, 81, 56, 55, 40]
      ];*/
      createDataForCategoryChart();
    });


    var createDataForCategoryChart = function(){
      DefService.show();
      try {
        DatabaseService.selectAll().then(function (receiptsList) {

          var categoriesList  = [];
          var dateList = [];
          var receiptsNoByCategory = [];
          var receiptsTotalByDate = [];
          var receiptsTotalByCompany = [];
          var totalSum = 0;
          var companyList = [];

          $scope.receiptsNo = receiptsList.length;

          for(var i=0; i<receiptsList.length;i++){

            /*if(dateList[receiptsList[i].dateReceipt] != undefined) {
             dateList[receiptsList[i].dateReceipt] = dateList[receiptsList[i].dateReceipt] + receiptsList[i].price;
             } else{
             dateList[receiptsList[i].dateReceipt] = receiptsList[i].price;
             }*/
            dateList.push(receiptsList[i].dateReceipt);

            companyList.push(receiptsList[i].companyName);


            totalSum = totalSum + receiptsList[i].price;

            if(categoriesList.indexOf(receiptsList[i].category) == -1) {
              categoriesList.push(receiptsList[i].category);
            }
          }

          dateList = unique(dateList);
          companyList = unique(companyList);

          for (var i = 0; i < dateList.length; i++) {
            receiptsTotalByDate[i] = (parseFloat(countPriceInDate(dateList[i], receiptsList)));
          }

          for (var i = 0; i < companyList.length; i++) {
            receiptsTotalByCompany[i] = (parseFloat(countPriceInCompany(companyList[i], receiptsList)));
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

          $scope.companies = companyList;
          var receiptsTotalByCompanyWrapper = [];
          receiptsTotalByCompanyWrapper.push(receiptsTotalByCompany);
          $scope.receiptsTotalByCompany = receiptsTotalByCompanyWrapper;


          console.log($scope.categories);
          console.log(receiptsTotalByDate);
          console.log(dateList);
          console.log($scope.receiptsTotalByDate);

          $scope.totalSum = totalSum;

          DefService.hide();

        }, function (err) {
          DefService.hide();
          console.log(error);

        });
      } catch (ex) {
        DefService.hide();
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

    var countPriceInDate = function (dateReceipt, receiptsList) {
      var sum = 0;
      for (var i = 0; i < receiptsList.length; i++) {
        if (receiptsList[i].dateReceipt == dateReceipt) {
          sum = sum + receiptsList[i].price;
        }
      }
      return sum;
    };

    var countPriceInCompany = function (companyName, receiptsList) {
      var sum = 0;
      for (var i = 0; i < receiptsList.length; i++) {
        if (receiptsList[i].companyName == companyName) {
          sum = sum + receiptsList[i].price;
        }
      }
      return sum;
    };

    var unique = function (origArr) {
      var newArr = [],
        origLen = origArr.length,
        found, x, y;

      for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
          if (origArr[x] === newArr[y]) {
            found = true;
            break;
          }
        }
        if (!found) {
          newArr.push(origArr[x]);
        }
      }
      return newArr;
    };


    $scope.signInOut = function () {
      DefService.signInOut();
    };

    $scope.goHome = function () {
      DefService.goTo('start');
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



  });
