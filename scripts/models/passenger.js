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

  google.maps.event.addListener(self.marker, 'click', function(){
    //click behavior here
  });

  self.state = Passenger.STATE.AWAITING_RIDE;
}

Passenger.STATE = {
  AWAITING_RIDE: 'AWAITING_RIDE',
  IN_CAR: 'IN_CAR',
  DROPPED_OFF: 'DROPPED_OFF'
};

Passenger.prototype.setCar = function(car){
  this.car = car;
};

Passenger.prototype.setSelect = function(selected){
  if(selected){
    this.marker.setIcon(this.SELECTED_ICON_URL);
  }else{
    this.marker.setIcon(this.ICON_URL);
  }
};

Passenger.prototype.tick = function(){
  //update position along route
};

