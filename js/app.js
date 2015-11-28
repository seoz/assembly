'use strict';

var app = angular.module('myApp', ['chart.js', 'cgBusy',
  'angucomplete-alt'
]);

app.controller('customersCtrl',
  function($scope, $http, $location) {
    // API Host
    var $rhost = "http://api.kassembly.xyz/q.php";

    // show all
    $scope.showCircle = true;

    // http error flag
    $scope.errorFlag = false;

    // Chart Data
    $scope.series = ['발의 법안수'];
    $scope.labels = [];
    $scope.data = [
      [],
    ];

    // For now, but need to change it
    $scope.id;

    // stat and sale array
    $scope.statArr = [];
    $scope.listArr = [];
    $scope.coArr = [];

    // all actors for search auto complete
    $scope.actors = [];

    // check box options
    $scope.opt = {
      result: "done",
      by: "rep"
    };

    $scope.optQuery = '';
    $scope.optString = '';
    $scope.setOptQuery = function() {
      $scope.optQuery = "&result=" + $scope.opt.result + "&by=" + $scope.opt.by;
    };

    $scope.setOptString = function() {
      $scope.optString = '';

      switch($scope.opt.by) {
        case 'rep':
          $scope.optString += "대표발의 의안중 ";
          break;
        case 'co':
          $scope.optString += "공동발의 의안중 ";
          break;
      }

      switch($scope.opt.result) {
        case 'pass':
          $scope.optString += "가결된 ";
          break;
        case 'done':
          $scope.optString += "처리된 ";
          break;
        case 'ongoing':
          $scope.optString += "계류중인 ";
          break;
      }
    };

    // Toggle cell so show more info
    $scope.toggleList = function($index) {
      if ($scope.listArr.length < $index) {
        return;
      }

      // Toggle it
      $scope.listArr[$index].open = !$scope.listArr[$index].open;

      // If it is open, get data
      if ($scope.listArr[$index].open) {
        // Load only it is not loaded
        if ($scope.listArr[$index].summary === undefined) {
          $scope.getSummary($index);
        }

        // Load only it is not loaded
        if ($scope.listArr[$index].ActArr === undefined) {
          $scope.getBillAct($index);
        }
      }
    }

    $scope.amIActive = function(name) {
      if (name == $scope.appType) {
        return 'active';
      }

      return '';
    }


    // recovering from network error
    $scope.reconnect = function() {
      $scope.errorFlag = false; //reset the flag and let's hope

      // no statdate? reload!
      if ($scope.statArr.length == 0) {
        $scope.getStat();
      }

      // no sale array? reload!
      if ($scope.saleArr.length == 0) {
        $scope.getList();
      }
    };

    // local function for KR URL encodning
    var koEncode = function($s) {
      if ($s == null || $s == "") {
        return $s;
      }
      return encodeURI(encodeURIComponent($s));
    };

    // update the graph (based on watch statArr)
    $scope.updateGraph = function() {
      // reset graph array
      $scope.labels = [];
      $scope.data = [];
      $scope.data[0] = [];

      var statLen = $scope.statArr.length;

      if (statLen==0) {
        $scope.series = ['발의 법안이 없습니다.'];
        $scope.label = [0];
        $scope.data[0] = [0];
      } else {
        $scope.series = [ $scope.optString + ' 법안수'];
      }

      for (var i = 0; i < statLen; i++) {
        $scope.labels[i] = $scope.statArr[i].y + "/" +
          $scope.statArr[i].m;
        $scope.data[0][i] = $scope.statArr[i].c;
      }
    };


    // greaph on click. TODO: what should we do?
    $scope.onClick = function(points, evt) {
      //console.log(points, evt);
    };


    $scope.upAll = function() {
      $scope.setOptQuery();
      $scope.setOptString();

      $scope.getList();
      $scope.getStat();
      $scope.getCoAct();
    };


    $scope.getStat = function() {
      $scope.statArr = [];

      $scope.errorFlag = false;

      $scope.statPromise = $http.get($rhost +
          '/stat?id=' + $scope.id + $scope.optQuery)
        .success(function(response) {
          $scope.statArr = response;
          $scope.updateGraph();
        })
        .error(function(response) {
          $scope.errorFlag = true;
        });
    };

    $scope.getList = function() {
      $scope.listArr = [];
      $scope.errorFlag = false;
      $scope.listPromise = $http.get($rhost +
          "/list?id=" + $scope.id + $scope.optQuery)
        .success(function(response) {
          $scope.listArr = response;
        })
        .error(function(response) {
          $scope.errorFlag = true;
        });
    };

    $scope.getAllActors = function() {
      $scope.errorFlag = false;
      $scope.getAllActorsPromise = $http.get($rhost +
          "/actor")
        .success(function(response) {
          $scope.actors = response;
        })
        .error(function(response) {
          $scope.errorFlag = true;
        });
    };

    $scope.getCoAct = function() {
      $scope.coActArr = [];
      $scope.errorFlag = false;
      $scope.coActPromise = $http.get($rhost +
          "/coact?id=" + $scope.id + $scope.optQuery)
        .success(function(response) {
          $scope.coArr = response;
        })
        .error(function(response) {
          $scope.errorFlag = true;
        });
    };

    $scope.getBillAct = function($index) {
      if ($scope.listArr.length < $index) {
        return;
      }

      console.log($index + ":" + $scope.listArr[$index]);
      var $bid = $scope.listArr[$index].id;
      if (!$bid) {
        return;
      }

      $scope.errorFlag = false;
      $scope.billActPromise = $http.get($rhost +
          "/billactors?bid=" + $bid)
        .success(function(response) {
          $scope.listArr[$index].ActArr = response;
        })
        .error(function(response) {
          $scope.errorFlag = true;
        });
    };

    // Show summary
    $scope.printSummary = function($summary) {
      if ($summary === undefined || $summary[0] === undefined ||
        $summary[
          0]
        .summary === undefined ||
        $summary[0].summary === "") {
        return "요약정보 없슴.";
      }

      return "요약정보: " + $summary[0].summary;
    }

    $scope.getSummary = function($index) {
      if ($scope.listArr.length < $index) {
        return;
      }

      var $bid = $scope.listArr[$index].id;
      if (!$bid) {
        return;
      }

      $scope.errorFlag = false;
      $scope.summaryPromise = $http.get($rhost +
          "/summary?bid=" + $bid)
        .success(function(response) {
          $scope.listArr[$index].summary = response;
        })
        .error(function(response) {
          $scope.errorFlag = true;
        });
    };

    // get all actors
    $scope.getAllActors();

    // Set id and refresh
    $scope.setId = function($id) {
      if ($id === "") {
        return;
      }

      $scope.id = $id;
      $location.url("/" + $id);
      $scope.upAll();
    }

    // move to the current selected
    var $id = $location.path().substring(1);
    $scope.setId($id);
    console.log("Move: " + $scope.id);

    $scope.setActor = function(selected) {
      if (selected == undefined || selected.originalObject == undefined) {
        return;
      }

      $scope.setId(selected.originalObject.id);
    };


  }
);
