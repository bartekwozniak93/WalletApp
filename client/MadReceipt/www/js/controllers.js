angular.module('starter.controllers', ['ngCordova'])



  .controller('ChatsCtrl', function ($scope, Chats, $window,$state, $http) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    }

    $scope.getReceiptsFromServer = function () {

      console.log("in get rep");


      var token = $window.sessionStorage.token;

      console.log(token);

      if (token == undefined) {
        $window.alert("You're not logged in");
      } else {

          var req = {
            method: 'GET',
            url: 'http://localhost:5000/api/receipts',

            headers: {'Authorization': token}
          }

          $http(req).then(function successCallback(response) {

            if (response.data != "Unauthorized") {

              $scope.receipts = response.data;

            } else {
              $window.alert("Problem with connection to server");
            }
          }, function errorCallback(response) {
            $window.alert("Problem with connection to server");
          });


      }
    };
    $scope.signInOut = function () {
      if($window.sessionStorage.token != null) {
        delete $window.sessionStorage.token;

        $state.go('start');
      } else {
        $state.go('signin');
      }
    };


  })


  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope, $window, $state) {
    $scope.settings = {
      enableFriends: true
    };
    $scope.signInOut = function () {
      if($window.sessionStorage.token != null) {
        delete $window.sessionStorage.token;

        $state.go('start');
      } else {
        $state.go('signin');
      }
    };
  })

/*  .controller('SignInCtrl', function ($scope, $state, $window) {

    $scope.signIn = function (email, password) {

      $window.sessionStorage.token = 'Basic bWFnZGEyOnRlc3Q=';

      $state.go('tab.newReceipt');
    };

  })*/


  .controller('StartPageCtrl', function ($scope, $state, $window, $http, $location, $stateParams, ReceiptsServer) {


    $scope.$on('$ionicView.enter', function () {
      console.log($location.search().token);
      if ($location.search().token != undefined) {
        $window.sessionStorage.token = $location.search().token;


        ReceiptsServer.loginUserWithFacebook().then(function (response) {

          if (response.data != '"Login or password is incorrect."') {


            $state.go('tab.newReceipt');

          } else {
            alert(response.data);
          }
        }, function (error) {

          alert($location.search().token);
        });


      }
    });



    $scope.goTo = function (destinationPage) {

      $state.go(destinationPage);
    };

    $scope.loginWithFacebook = function ($location) {
     /* $window.alert("in login with fb");



      $http({method: 'GET', url: 'http://localhost:5000/api/facebook/login', headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE"}}).
      success(function() {
        alert("success");
      }).
      error(function() {
        alert("error");
      });*/

      var url = $location.absUrl().split('?')[0];
      alert($location.absUrl().split('?')[0]);
    };

  })

;


