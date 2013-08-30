function Passenger($scope, initialPosition, destination){
  var self = this;

  self.ICON_URL = 'img/passenger-black.png';
  self.SELECTED_ICON_URL = 'img/passenger-pink.png';
  self.TICKS_TO_LIVE_AFTER_DROPPED_OFF = 100;
  self.TICKS_TO_LIVE_WHILE_AWAITING_ASSIGNMENT = 1000;

  self.$scope = $scope;
  self.id = UUID.generate();
  self.position = initialPosition;
  self.destination = destination;
  self.car = null;

  self.marker = new google.maps.Marker({
    position: initialPosition,
    map: $scope.map,
    icon: self.ICON_URL
  })

  self.destinationMarker = new google.maps.Marker({
    position: destination,
  })

  google.maps.event.addListener(self.marker, 'click', function(){
    //click behavior here
    self.$scope.selectPassenger(self);
  });

  self.state = Passenger.STATE.UNASSIGNED;
}

Passenger.STATE = {
  UNASSIGNED: 'UNASSIGNED',
  AWAITING_RIDE: 'AWAITING_RIDE',
  IN_CAR: 'IN_CAR',
  DROPPED_OFF: 'DROPPED_OFF',
  DELETED: 'DELETED'
};

Passenger.prototype.setPosition = function(position){
  this.position = position;
  this.marker.setPosition(position);
}

Passenger.prototype.pickUp = function(){
  this.state = Passenger.STATE.IN_CAR;
};

Passenger.prototype.dropOff = function(){
  this.state = Passenger.STATE.DROPPED_OFF;
};

Passenger.prototype.setCar = function(car){
  this.state = Passenger.STATE.AWAITING_RIDE;
  this.car = car;
};

//Will remove all nulls from array
//Assumes array contains only Passenger objects
Passenger.prototype.removeFromArray = function(array){
  for(var i = 0; i < array.length; i++){
    if(array[i].id == this.id)
      array[i] = null;
  }
  return _.compact(array);
};

Passenger.prototype.setSelect = function(selected){
  if(this.state != Passenger.STATE.IN_CAR){
    if(selected){
      this.marker.setIcon(this.SELECTED_ICON_URL);
      this.destinationMarker.setMap(this.$scope.map);
    }else{
      this.marker.setIcon(this.ICON_URL);
      this.destinationMarker.setMap(null);
    }
  }
};

Passenger.prototype.cleanUp = function(){
  this.marker.setMap(null);
  this.destinationMarker.setMap(null);
  this.state == Passenger.STATE.DELETED;
}

Passenger.prototype.tick = function(){
  //update position along route
  if(this.state == Passenger.STATE.IN_CAR){
    this.marker.setMap(null);
  }else if(this.state == Passenger.STATE.DROPPED_OFF){
    if(this.position.lat() != this.destination.lat() && this.position.lng() != this.destination.lng()){
      this.deathTicks = 0;
      this.setPosition(this.destination);
      this.destinationMarker.setMap(this.$scope.map);
    }
    this.deathTicks++;
    if(this.deathTicks > this.TICKS_TO_LIVE_AFTER_DROPPED_OFF)
      this.$scope.removePassenger(this);
  }else if(this.state == Passenger.STATE.UNASSIGNED){
    this.deathTicks ++;
    if(this.deathTicks > this.TICKS_TO_LIVE_WHILE_AWAITING_ASSIGNMENT)
      $scope.removePassenger(this);
  }
};

