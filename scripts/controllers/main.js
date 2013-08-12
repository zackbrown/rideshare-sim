'use strict';



RideshareSimApp.controller('MainCtrl', function($scope, $timeout) {

  $scope.initialize = function(){
    var mapOptions = {
            center: new google.maps.LatLng(37.76, -122.435),
            zoom: 13,
            minZoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("google-maps-canvas"), mapOptions);

    google.maps.visualRefresh=true;

    $scope.cars = [new Car($scope, new google.maps.LatLng(37.76, -122.435), 3)];

    $scope.passengers = [new Passenger($scope, new google.maps.LatLng(37.765, -122.44), null)];
  }

  $scope.addCar = function(){
    //create a car object complete with marker
    //give the car an initial position
    //add car to list of cars
  };

  $scope.removeCar = function(car){

  };

  $scope.initialize();
});
