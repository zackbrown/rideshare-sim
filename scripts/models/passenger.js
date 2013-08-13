function Passenger($scope, initialPosition, destination){
  var self = this;

  //self.ICON_URL = 'img/yellow-car-top.png';

  self.$scope = $scope;
  self.id = UUID.generate();
  self.position = initialPosition;
  self.destination = destination;
  self.carId = null;

  self.marker = new google.maps.Marker({
    position: initialPosition,
    map: $scope.map
    //icon: self.ICON_URL
  })

  self.state = Passenger.STATE.SEEKING_RIDE;
}

Passenger.STATE = {
  SEEKING_RIDE: 'SEEKING_RIDE',
  IN_CAR: 'IN_CAR',
  DROPPED_OFF: 'DROPPED_OFF'
};

Passenger.prototype.tick = function(){
  //update position along route
}

