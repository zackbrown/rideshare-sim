'use strict';

//TODO:
// Tick cars along routes
// Assign cars simple (1-passenger) routes
// Support compound (multi-passenger) routes
// Create controls for numbers of cars, frequency of passenger requests, tick speed
// Parameterize max passengers to compare
// Track passenger wait times

RideshareSimApp.controller('MainCtrl', function($scope, $timeout, config, geo, util) {

  //$scope.googleMapsAPIKey = config.googleMapsAPIKey;

  $scope.initialize = function(){
    var mapOptions = {
      center: new google.maps.LatLng(37.76, -122.435),
      zoom: 13,
      minZoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("google-maps-canvas"), mapOptions);
    google.maps.visualRefresh=true;

    $scope.counter = 0;

    //util.enableMapDebugMode($scope.map);

    $scope.cars = [];
    $scope.passengers = [];

    for(var i = 0; i < config.STARTING_CARS; i++)
      $scope.addCar();

    for(var i = 0; i < config.STARTING_PASSENGERS; i++)
      $scope.addPassenger();

    setInterval($scope.tick, 10);
  }

  $scope.selectedCar = null;
  $scope.selectCar = function(car){
    $scope.deselectAll();
    $scope.selectedCar = car;
    car.setSelect(true);
  }

  $scope.selectPassenger = function(passenger){
    $scope.deselectAll();
    $scope.selectedPassengers = [passenger];
    passenger.setSelect(true);
    //if(passenger.car)
      //$scope.selectCar(passenger.car);
  };

  $scope.selectedPassengers = [];
  $scope.selectPassengers = function(passengers){
    $scope.deselectPassengers();

    $scope.selectedPassengers = passengers;
    for(var i = 0; i < passengers.length; i++)
      passengers[i].setSelect(true);
  };

  $scope.deselectPassengers = function(){
    if($scope.selectedPassengers != null)
      for(var i = 0; i < $scope.selectedPassengers.length; i++)
        $scope.selectedPassengers[i].setSelect(false);
  };

  $scope.deselectAll = function(){
    if($scope.selectedCar){
      $scope.selectedCar.setSelect(false);
      $scope.selectedCar = null;
    }

    $scope.deselectPassengers();
  };

  $scope.addCar = function(){
    var newCar = new Car($scope, geo, geo.getCarStartingPosition(), config.MAX_PASSENGERS);
    $scope.cars.push(newCar);
  };

  $scope.addPassenger = function(){
    var newPassenger = new Passenger($scope, geo.getPassengerStartingPosition(), geo.getPassengerDestination());
    $scope.passengers.push(newPassenger);

    $scope.assignRideToPassenger(newPassenger);
  };

  $scope.removeCar = function(car){
    throw 'unimplemented';
  };

  $scope.assignRideToPassenger = function(passenger){
    //find nearest waypoint or car position for all cars with available seats
    var availableCars = _.filter($scope.cars, function(car){
      return car.available();
    });

    var waypoints = _.flatten(_.map(availableCars, function(car){
      return _.union([{position: car.position, car: car}], _.map(car.stops, function(stop) { return { position: stop, car: car } }));
    })); //array of (all waypoints | current position) in form {position: latlng, car: pointer}

    var selectedCar = _.min(waypoints, function(waypoint){
      //TODO:  use something smarter than euclidean distance
      //TODO:  prioritize a car's current position over its waypoints (probably by weighting the distance by some factor)
      return geo.euclideanDistance(passenger.position, waypoint.position);
    }).car;

    window.car = selectedCar;

    //TODO:  Handle case where all cars are full!
    if(!selectedCar)
      throw 'unimplemented:  handle case when no cars are available';

    passenger.setCar(selectedCar);
    selectedCar.addPassenger(passenger);
  };

  $scope.tick = function(){
    //TODO:  add new passengers on occasion

    for(var i = 0; i < $scope.cars.length; i++)
      $scope.cars[i].tick();
    for(var i = 0; i < $scope.passengers.length; i++)
      $scope.passengers[i].tick();
  };

  $scope.initialize();
});
