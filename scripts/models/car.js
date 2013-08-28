function Car($scope, geo, initialPosition, maxPassengers){
  var self = this;

  self.ICON_URL = 'img/black-car-front.png';
  self.SELECTED_ICON_URL = 'img/pink-car-front.png';

  self.id = UUID.generate();
  self.$scope = $scope;
  self.geo = geo;
  self.position = initialPosition;
  self.route = null;
  self.routePercentComplete = 0;
  self.maxPassengers = maxPassengers;
  self.passengers = [];
  self.selected = false;
  self.state = Car.STATE.SEEKING_FARE;
  self.markedForDeletion = false;

  self.marker = new google.maps.Marker({
    position: initialPosition,
    map: $scope.map,
    icon: self.ICON_URL
  })

  self.directionsOptions = {
    preserveViewport: true,
    draggable: false,
    suppressMarkers: true,
    suppressInfoWindows: true
  }

  self.directionsDisplay = new google.maps.DirectionsRenderer(self.directionsOptions);

  google.maps.event.addListener(self.marker, 'click', function(){
    self.$scope.selectCar(self);
  });
}

Car.STATE = {
  SEEKING_FARE: 'SEEKING_FARE',
  EN_ROUTE_TO_FARE: 'EN_ROUTE_TO_FARE',
  WITH_FARE: 'WITH_FARE'
};

Car.prototype.setPosition = function(position){
  this.position = position;
  this.marker.setPosition(position);
}

Car.prototype.setSelect = function(selected){
  if(selected){
    this.marker.setIcon(this.SELECTED_ICON_URL);
    if(this.passengers)
      this.$scope.selectPassengers(this.passengers);
    if(this.route){
      this.directionsDisplay.setOptions(_.extend(this.directionsOptions, {map: this.$scope.map, directions: this.route}));
    }
  }else{
    this.marker.setIcon(this.ICON_URL);
    this.directionsDisplay.setOptions(_.extend(this.directionsOptions, {map: null}));
  }
}

Car.prototype.available = function(){
  return this.passengers.length < this.maxPassengers && !this.markedForDeletion
};

Car.prototype.tick = function(){
  //update position along route
  if(this.route){
    //from a route, getPath() returns an array (MVCArray, call .getArray() to get the js array) of LatLng coordinates.  There should be a single function to get the latlng position along a route with a provided float 0.0-1.0
  }//else just wait (TODO:  move the car toward an area with higher density fares when it has no current fare)
}

Car.prototype.addPassenger = function(passenger){
  this.passengers.push(passenger);
  this.calculateRoute();
}

Car.prototype.stops = function(){
  return _.flatten(_.map(this.passengers, function(passenger){
    return [passenger.destination, passenger.position];
  }));
};

Car.prototype.calculateRoute = function(){
  var closureCar = this;
  this.geo.getDirections(this.position, this.stops(), function(data){
    closureCar.setRoute(data);
  });
};

Car.prototype.setRoute = function(route){
  this.route = route;
};

Car.prototype.removePassenger = function(passenger){
  throw 'not implemented: car.removePassenger()';
}

Car.prototype.prepareForRemoval = function(){
  this.marker.setMap(null);
  delete this.marker;
  if(this.route){
    this.route.setMap(null);
    delete this.route;
  }
}
