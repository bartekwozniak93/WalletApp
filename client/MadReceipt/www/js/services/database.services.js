angular.module('database.services', ['ionic', 'ngCordova'])

  .factory('DatabaseService', ['$q', '$cordovaSQLite', function ($q, $cordovaSQLite) {


    function createOrOpenDB() {
      var receiptsDB;

      if (window.cordova && window.SQLitePlugin) { // because Cordova is platform specific and doesn't work when you run ionic serve
        receiptsDB = window.sqlitePlugin.openDatabase({"name": "MadReceipts.db", iosDatabaseLocation: 'default'}); //device - SQLite
          // alert("device db (SQLite) loaded");
      } else {

        receiptsDB = window.openDatabase("APSNetMobileDb", "1.0", "MadReceipts.db", 100 * 1024 * 1024); // browser webSql, a fall-back for debugging
        //alert("browser db (WebSQL) loaded");
      }

      receiptsDB.transaction(createReceiptsTable, errorCB, successCB);

      return receiptsDB;
    }


    function createReceiptsTable(tx) {

      //tx.executeSql("DROP TABLE IF EXISTS receipts");

      tx.executeSql('CREATE TABLE IF NOT EXISTS receipts (id integer primary key unique, image blob unique, category varchar DEFAULT "Undefined", vendor varchar DEFAULT "Undefined", _date date, stuff varchar DEFAULT "Undefined", currency varchar DEFAULT "-", total real, description varchar DEFAULT "-")');

    }


    function errorCB() {
      alert("DB access FAILED");
    }

    function successCB() {
     //alert("DB access SUCCEEDED");
    }

    var databaseServices = {};

    databaseServices.open = function () {

      return createOrOpenDB();

    };

/*    databaseServices.insert = function (receiptsList) {
      var q = $q.defer();
      var receiptsDB = createOrOpenDB();
      receiptsDB.transaction(function (tx) {

        alert(receiptsList);
        for (var i = 0; i < receiptsList.length; i++) {
          tx.executeSql("INSERT INTO receipts (image) VALUES (?)", [receiptsList[i]]);
          alert("image added: " + i);
        }


      }, errorCB, successCB);

      return true;

    };


    //return databaseServices;*/

    return {
      insert: function (receiptsList) {


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {
          for (var i = 0; i < receiptsList.length; i++) {
            tx.executeSql("INSERT INTO receipts (image) VALUES (?)", [receiptsList[i]]);
          }


        }, deferred.reject, deferred.resolve);
        return deferred.promise;


      },
      select: function(receiptId){


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {

          tx.executeSql("SELECT * FROM receipts where id=(?)", [receiptId], function (tx, results) {
            var len = results.rows.length, i;


            for (i = 0; i < len; i++){

              var receipt = {
                "_id": results.rows.item(i).id,
                "image": results.rows.item(i).image,
                "category": results.rows.item(i).category,
                "vendor": results.rows.item(i).vendor,
                "_date": results.rows.item(i)._date,
                "stuff": results.rows.item(i).stuff,
                "currency": results.rows.item(i).currency,
                "total": results.rows.item(i).total,
                "description": results.rows.item(i).description
              };

            }

            deferred.resolve(receipt);


          }, null);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },

      selectAll: function(){
        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {

            tx.executeSql("SELECT * FROM receipts", [], function (tx, results) {
              var len = results.rows.length, i;

              var receiptsList = [];


              for (i = 0; i < len; i++){

                var receipt = {
                  "_id": results.rows.item(i).id,
                  "image": results.rows.item(i).image,
                  "category": results.rows.item(i).category,
                  "vendor": results.rows.item(i).vendor,
                  "_date": results.rows.item(i)._date,
                  "stuff": results.rows.item(i).stuff,
                  "currency": results.rows.item(i).currency,
                  "total": results.rows.item(i).total,
                  "description": results.rows.item(i).description
                };
                receiptsList.push(receipt);
              }

              deferred.resolve(receiptsList);


            }, null);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },

      update: function(receipt){


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {
          tx.executeSql("UPDATE receipts SET category=(?), vendor=(?), _date=(?), stuff=(?), currency=(?), total=(?), description=(?) WHERE id= (?)", [receipt.category, receipt.vendor, receipt._date, receipt.stuff, receipt.currency, receipt.total, receipt.description, receipt._id]);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      },


      remove: function(receiptId){


        var deferred = $q.defer();
        var receiptsDB = createOrOpenDB();

        receiptsDB.transaction(function (tx) {
            tx.executeSql("DELETE FROM receipts WHERE id= (?)", [receiptId]);

        }, deferred.reject, deferred.resolve);
        return deferred.promise;
      }

    }
  }]);
