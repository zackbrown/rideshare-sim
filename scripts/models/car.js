function Car($scope, initialPosition, maxPassengers){
  var self = this;

  self.ICON_URL = 'img/black-car-front.png';

  self.id = UUID.generate();
  self.$scope = $scope;
  self.position = initialPosition;
  self.route = null;
  self.maxPassengers = maxPassengers;
  self.passengers = 0;

  self.marker = new google.maps.Marker({
    position: initialPosition,
    map: $scope.map,
    icon: self.ICON_URL
  })
}

Car.prototype.setPosition = function(position){
  this.position = position;
  this.marker.setPosition(position);
}

Car.prototype.tick = function(){
  //update position along route
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
}
