'use strict';

//TODO:
// Use distinct routes per passenger [stopOver: true]
// Create controls for numbers of cars, frequency of passenger requests, tick speed
// Expand passenger creation bounds
// Make passengers ditch if their ride doesn't show up after a threshold
// Track passenger distance (actual distance traveled, not just the distance of their original route.  This especially needs to consider cases where routes change mid-transit
// Track car transit times per route; aggregate interesting stats
// Export stats as .json; make downloadable
// Show infowindow on car click for car-specific details
// Make better markers for passengers (Lyft-esque pins?)
// Reshuffle optimize passengers that are not part of a car's immediate route
// Add wait times for when passengers are picked up
// Create separate routing models?  Modular functions for ticking, etc.  Pass functions around

RideshareSimApp.controller('MainCtrl', function($scope, $timeout, config, geo, util, app) {

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

    setInterval($scope.tick, config.TICK_PERIOD);
    setInterval($scope.assignRidesAndCalculateRoutes, config.ASSIGN_RIDES_PERIOD);
  }

  $scope.selectedCar = null;
  $scope.selectCar = function(car){
    $scope.deselectAll();
    $scope.selectedCar = car;
    car.setSelect(true);
  }

  $scope.selectPassenger = function(passenger){
    if(passenger.car){
      console.log('pass car', passenger.car);
      $scope.selectCar(passenger.car);
    }else{
      $scope.deselectAll();
      $scope.selectedPassengers = [passenger];
      passenger.setSelect(true);
    }
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

  $scope.removePassenger = function(passenger){
    $scope.passengers = passenger.removeFromArray($scope.passengers);
    $scope.selectedPassengers = passenger.removeFromArray($scope.selectedPassengers);
    if(passenger.car)
      passenger.car.passengers = passenger.removeFromArray(passenger.car.passengers)

    passenger.cleanUp();
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

    if(selectedCar){
      passenger.setCar(selectedCar);
      selectedCar.addPassenger(passenger);
    }else{
      //no car is available
    }
  };

  $scope.assignRidesAndCalculateRoutes = function(){
    if(!app.paused()){
      var unassignedPassengers = _.filter($scope.passengers, function(p){
        return p.state == Passenger.STATE.UNASSIGNED;
      })
      for(var i = 0; i < unassignedPassengers.length; i++)
        $scope.assignRideToPassenger(unassignedPassengers[i]);

      var routelessCars = _.filter($scope.cars,
        function(c){
          return !c.calculatingRoute && !c.route;
        }
      );

      for(var i = 0; i < routelessCars.length; i++)
        routelessCars[i].calculateRoute();
    }
  };

  $scope.tickCounter = 0;
  $scope.tick = function(){
    if(!app.paused()){
      $scope.tickCounter++;

      if($scope.tickCounter % config.PASSENGER_REQUEST_PERIOD == 0)
        $scope.addPassenger();

      for(var i = 0; i < $scope.cars.length; i++)
        $scope.cars[i].tick();
      for(var i = 0; i < $scope.passengers.length; i++)
        $scope.passengers[i].tick();
    }
  };

  $scope.initialize();
});
