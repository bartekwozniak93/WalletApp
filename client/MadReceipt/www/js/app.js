angular.module('starter', ['ionic', 'ngCordova', 'ionic.ion.autoListDivider', 'chart.js', 'starter.controllers', 'sign.in.controllers', 'account.controllers', 'newReceipts.controllers', 'receipt.controllers', 'receipt.server.controllers', 'serverReceiptsList.controllers', 'serverUpload.controllers', 'receiptsList.controllers', 'statistics.controllers', 'server.services', 'photos.and.files.services', 'database.services', 'redirect.services'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });
  })

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('start', {
        url: '/start-page',
        templateUrl: 'templates/start-page.html',
        controller: 'StartPageCtrl'
      })

      .state('signin', {
        url: '/sign-in',
        templateUrl: 'templates/sign-in.html',
        controller: 'SignInCtrl'
      })

      .state('createAccount', {
        url: '/create-account',
        templateUrl: 'templates/create-account.html',
        controller: 'CreateAccountCtrl'
      })


      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.newReceipt', {
        url: '/newReceipt',
        views: {
          'tab-new-receipts': {
            templateUrl: 'templates/tab-new-receipts.html',
            controller: 'NewReceiptsCtrl'
          }
        }
      })

      .state('tab.serverReceiptsList', {
        url: '/serverReceiptsList',
        views: {
          'tab-server-receipts-list': {
            templateUrl: 'templates/tab-server-receipts-list.html',
            controller: 'ServerReceiptsListCtrl'
          }
        }
      })
      .state('tab.server-receipt-detail', {
        url: '/sreceipts/:receiptId',
        views: {
          'tab-server-receipts-list': {
            templateUrl: 'templates/receipt-server-detail.html',
            controller: 'ReceiptServerCtrl'
          }
        }
      })


      .state('tab.receiptsList', {
        url: '/receiptsList',
        views: {
          'tab-receipts-list': {
            templateUrl: 'templates/tab-receipts-list.html',
            controller: 'ReceiptsListCtrl'
          }
        }
      })

      .state('tab.receipt-detail', {
        url: '/receipts/:receiptId',
        views: {
          'tab-receipts-list': {
            templateUrl: 'templates/receipt-detail.html',
            controller: 'ReceiptCtrl'
          }
        }
      })

      .state('tab.receipt-upload', {
        url: '/upload',
        views: {
          'tab-receipts-list': {
            templateUrl: 'templates/receipts-server-upload.html',
            controller: 'ServerUploadCtrl'
          }
        }
      })

      .state('tab.statistics', {
        url: '/statistics',
        views: {
          'tab-statistics': {
            templateUrl: 'templates/tab-statistics.html',
            controller: 'StatisticsCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/start-page');
    //$urlRouterProvider.otherwise('/sign-in');

    //$httpProvider.responseInterceptors.push('redirectInterceptor');
  })





;
