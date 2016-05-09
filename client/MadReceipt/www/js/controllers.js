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

      var token = $window.sessionStorage.token;

      if ( token  == '') {
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

  .controller('SignInCtrl', function ($scope, $state, $window) {

    $scope.signIn = function (user, password) {

      $window.sessionStorage.token = 'Basic bWFnZGEyOnRlc3Q=';

      $state.go('tab.newReceipt');
    };

  })



  .controller('StartPageCtrl', function ($scope, $state) {

    $scope.goTo = function (destinationPage) {

      $state.go(destinationPage);
    };

  })

;
