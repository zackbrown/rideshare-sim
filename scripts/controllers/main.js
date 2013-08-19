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
  }

  $scope.selectedCar = null;
  $scope.selectCar = function(car){
    if($scope.selectedCar != null)
      $scope.selectedCar.setSelect(false);
    $scope.selectedCar = car;
    car.setSelect(true);
  }

  $scope.selectedPassengers = [];
  $scope.selectPassengers = function(passengers){
    if($scope.selectedPassengers != null)
      for(var i = 0; i < $scope.selectedPassengers.length; i++)
        $scope.selectedPassengers[i].setSelect(false);

    $scope.selectedPassengers = passengers;
    for(var i = 0; i < passengers.length; i++)
      passengers[i].setSelect(true);
  };

  $scope.addCar = function(){
    //create a car object complete with marker
    //give the car an initial position
    //add car to list of cars
    var newCar = new Car($scope, geo, geo.getCarStartingPosition(), config.MAX_PASSENGERS);
    $scope.cars.push(newCar);
  };

  $scope.addPassenger = function(){
    var newPassenger = new Passenger($scope, geo.getPassengerStartingPosition(), geo.getPassengerDestination());
    $scope.passengers.push(newPassenger);

    $scope.assignRideToPassenger(newPassenger);
  };

  $scope.removeCar = function(car){

  };

  $scope.assignRideToPassenger = function(passenger){
    //find nearest waypoint or car position for all cars with available seats
    var availableCars = _.filter($scope.cars, function(car){
      return car.available();
    });

    var waypoints = _.flatten(_.map(availableCars, function(car){
      return _.union([{position: car.position, car: car}], _.map(car.stops, function(stop) { return { position: stop, car: car } }));
    })); //array of (all waypoints | current position) in form {position: latlng, car: pointer}
    console.log('waypoints', waypoints);

    var selectedCar = _.min(waypoints, function(waypoint){
      //TODO:  use something smarter than euclidean distance
      //TODO:  prioritize a car's current position over its waypoints (probably by weighting the distance by some factor)
      return geo.euclideanDistance(passenger.position, waypoint.position);
    }).car;

    console.log('selectedCar', selectedCar);
    window.car = selectedCar;

    //TODO:  Handle case where all cars are full!
    if(!selectedCar)
      throw 'unimplemented:  handle case when no cars are available';

    passenger.setCar(selectedCar);
    selectedCar.addPassenger(passenger);

  };

  $scope.initialize();
});
