angular.module('newReceipts.controllers', [])

  .controller('NewReceiptsCtrl', function ($scope, $window, $state, $cordovaImagePicker, $cordovaToast, $ionicLoading, $cordovaDialogs, PhotosAndFilesService, DatabaseService, $cordovaSQLite) {
    $scope.secretMS = $window.sessionStorage.token;

    $scope.receiptsImagesList = [];

    $scope.takePicture = function () {

      try {
        document.addEventListener("deviceready", function () {

          PhotosAndFilesService.getPicture().then(function (selectedImage) {
            console.log(selectedImage);
            $scope.receiptsImagesList.push("data:image/jpeg;base64," + selectedImage);
          }, function (err) {
            messagesMaker('Problem with taking picture. Try again');
          });
        }, messagesMaker("Cannot take photo on this device"));
      } catch (ex) {
        messagesMaker("Cannot take photo on this device");
      }
    };

    $scope.getPicturesFromGallery = function () {

      try {
        PhotosAndFilesService.getPicturesFromGallery().then(function (selectedImages) {
          show();
          for (var i = 0; i < selectedImages.length; i++) {
            $scope.receiptsImagesList.push(selectedImages[i]);
          }
          hide();
        }, function (err) {
          messagesMaker('Error!!');
          hide();
        });

      } catch (ex) {
        messagesMaker("Cannot open Gallery on this device");
        hide();
      }
    };


    $scope.getFiles = function (files) {
      show();
      if (files) {
        [].forEach.call(files, getFilesHelper);
      } else {
        hide();
      }


    };

    $scope.deleteImage = function (imageId) {

      $cordovaDialogs.confirm('Are you sure you want to delete this receipt?', 'Delete receipt', ['Ok', 'Cancel'])
        .then(function (buttonIndex) {
          // no button = 0, 'OK' = 1, 'Cancel' = 2
          if (buttonIndex == 1) {
            $scope.receiptsImagesList.splice(imageId, 1);
          }
        });
    };


    $scope.deleteAllImages = function () {

      $scope.receiptsImagesList = [];
    };

    $scope.addReceipts = function () {
      if($scope.receiptsImagesList.length) {
        show();
        try {
          var receiptsList = $scope.receiptsImagesList;
          DatabaseService.insert(receiptsList).then(function () {

            hide();
            messagesMaker("Receipts saved");
            saveToServer("Do you want to save receipts in our server?");

          }, function (err) {
            hide();
            messagesMaker('Error!!');

          });
        } catch (ex) {
          hide();
          saveToServer("Unfortunately some browsers or devices do not support saving receipts :(\n\nDo you want to save receipts in our server?");
        }
      } else {
        messagesMaker("No selected receipts");
      }
    };


    var saveToServer= function(message){
      $cordovaDialogs.confirm(message, 'Safely store your Receipts', ['Send to server', 'Use locally'])
        .then(function (buttonIndex) {
          // no button = 0, 'OK' = 1, 'Cancel' = 2
          if (buttonIndex == 1) {



            $scope.receiptsImagesList = [];
          } else if(buttonIndex == 2){
            $scope.receiptsImagesList = [];
          }
        });
    }


    var getFilesHelper = function (file) {
      show();
      PhotosAndFilesService.readFiles(file, $scope).then(function (selectedImages) {

        $scope.receiptsImagesList.push(selectedImages);
        hide();
      }, function (err) {
        hide();
        messagesMaker('Error!!');

      });
    };


    var resizeImages = function (image) {
      var resizedImage = new Image();
      resizedImage.src = image;
      //var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      //return { width: srcWidth*ratio, height: srcHeight*ratio };

      resizedImage.width = 6;
      resizedImage.height = 6;
      messagesMaker(resizedImage.height);
      messagesMaker(resizedImage.width);
      return resizedImage.src;
    };


    var show = function () {
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-energized"></ion-spinner>'


      });
    };
    var hide = function () {
      $ionicLoading.hide();
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
  });
