'use strict';

//TODO:
// Tick cars along routes
// Assign cars simple (1-passenger) routes
// Support compound (multi-passenger) routes
//   Perhaps:  when a new passenger requests a ride, select from all cars that have room for additional passengers the car that has (an unvisited waypoint or its current location) nearest the passenger.  If all existing points are beyond some acceptable threshold, dispatch a new car.
// Determine which car is best suited to pick up new passengers
// Create controls for numbers of cars, frequency of passenger requests, tick speed
// Parameterize max passengers to compare
// Track passenger wait times

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
