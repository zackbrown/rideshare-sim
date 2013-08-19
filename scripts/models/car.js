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

  this.directionsDisplay = new google.maps.DirectionsRenderer();

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
    if(this.route){
      this.directionsDisplay.setMap(this.$scope.map);
      this.directionsDisplay.setDirections(this.route);
    }
  }else{
    this.marker.setIcon(this.ICON_URL);
    this.directionsDisplay.setMap(null);
  }
}

Car.prototype.available = function(){
  return this.passengers.length < this.maxPassengers && !this.markedForDeletion
};

Car.prototype.tick = function(){
  //update position along route
  if(this.route){

  }//else just wait (TODO:  move the car toward an area with higher density fares when it has no current fare)
}

Car.prototype.addPassenger = function(passenger){
  this.passengers.push(passenger);
  this.calculateRoute();
}

Car.prototype.stops = function(){
  return _.map(this.passengers, function(passenger){
    return passenger.destination;
  });
};

Car.prototype.calculateRoute = function(){
  console.log('current position:', this.position);
  console.log('stops', this.stops());
  var closureCar = this;
  this.geo.getDirections(this.position, this.stops(), function(data){
    closureCar.setRoute(data);
  });
};

Car.prototype.setRoute = function(route){
  this.route = route;
  console.log('route', route);
  console.log('car for that route', this);
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
