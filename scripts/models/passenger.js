function Passenger($scope, initialPosition, destination){
  var self = this;

  self.ICON_URL = 'img/passenger-black.png';
  self.SELECTED_ICON_URL = 'img/passenger-pink.png';

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

  self.state = Passenger.STATE.AWAITING_RIDE;
}

Passenger.STATE = {
  AWAITING_RIDE: 'AWAITING_RIDE',
  IN_CAR: 'IN_CAR',
  DROPPED_OFF: 'DROPPED_OFF'
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
  this.car = car;
};

Passenger.prototype.setSelect = function(selected){
  if(this.state == Passenger.STATE.AWAITING_RIDE || this.state == Passenger.STATE.DROPPED_OFF){
    if(selected){
      this.marker.setIcon(this.SELECTED_ICON_URL);
      this.destinationMarker.setMap(this.$scope.map);
    }else{
      this.marker.setIcon(this.ICON_URL);
      this.destinationMarker.setMap(null);
    }
  }
};

Passenger.prototype.tick = function(){
  //update position along route
  if(this.state == Passenger.STATE.IN_CAR){
    this.marker.setMap(null);
  }else if(this.state == Passenger.STATE.DROPPED_OFF){
    this.setPosition(this.destination);
    this.marker.setMap(this.$scope.map);
    this.marker.setIcon(this.SELECTED_ICON_URL);
  }
};

