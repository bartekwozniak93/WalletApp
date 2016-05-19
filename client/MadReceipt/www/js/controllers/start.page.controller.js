angular.module('start.page.controllers', [])

  .controller('StartPageCtrl', function ($scope, $state, $window, $http) {

    $scope.goTo = function (destinationPage) {

      $state.go(destinationPage);
    };

    $scope.submitForm = function () {
        alert("in submit");
        console.log("posting data....");

        $http.post('http://localhost:5000/api/facebook/login').success(function(){alert("success");});
      };



  })

;
