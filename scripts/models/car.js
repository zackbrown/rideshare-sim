function Car($scope, initialPosition, maxPassengers){
  var self = this;

  self.ICON_URL = 'img/black-car-front.png';
  self.SELECTED_ICON_URL = 'img/pink-car-front.png';

  self.id = UUID.generate();
  this  .$scope = $scope;
  self.position = initialPosition;
  self.route = null;
  self.routePercentComplete = 0;
  self.maxPassengers = maxPassengers;
  self.passengers = 0;
  self.selected = false;
  self.state = Car.STATE.SEEKING_FARE;

  self.marker = new google.maps.Marker({
    position: initialPosition,
    map: $scope.map,
    icon: self.ICON_URL
  })

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
  }else{
    this.marker.setIcon(this.ICON_URL);
  }
}

Car.prototype.tick = function(){
  //update position along route
  if(this.route){

  }//else just wait (TODO:  move the car toward an area with higher density fares when it has no current fare)
}

Car.prototype.roomForPassengers = function(){
  return this.passengers < this.maxPassengers;
}

Car.prototype.addPassengers = function(amount){
  this.setPassengers(amount + this.passengers);
}

Car.prototype.removePassengers = function(amount){
  this.setPassengers(this.passengers - amount);
}

Car.prototype.setPassengers = function(amount){
  if(amount < 0)
    throw 'cannot carry a negative number of passengers';

  if(amount > this.maxPassengers)
    throw 'cannot carry additional passengers; maximum amount reached';

  this.passengers = amount;
}

Car.prototype.prepareForRemoval = function(){
  this.marker.setMap(null);
  delete this.marker;
  if(this.route){
    this.route.setMap(null);
    delete this.route;
  }
}
