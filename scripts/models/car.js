function Car($scope, geo, initialPosition, maxPassengers){
  var self = this;

  self.ICON_URL = 'img/black-car-front.png';
  self.SELECTED_ICON_URL = 'img/pink-car-front.png';

  self.id = UUID.generate();
  self.$scope = $scope;
  self.geo = geo;
  self.position = initialPosition;
  self.route = null;
  self.calculatingRoute = false;
  self.points = null;
  self.routeDuration = 0;
  self.positionAlongRoute = 0;
  self.pointsForPassengers = {};
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
    suppressInfoWindows: true,
    optimizeWaypoints: true
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
  console.log('setting car selected: ' + selected);
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
    var percent = this.positionAlongRoute / this.routeDuration

    var pointIndex = Math.floor(percent * (this.points.length - 1));
    if(this.points)
      this.setPosition(this.points[pointIndex]);
    if(!this.position){
      console.log('null position!', this.points)
      console.log('null position! index', pointIndex)
      console.log('null position! percent', percent)
    }

    if(this.pointsForPassengers[this.position.lat() + '|' + this.position.lng()]){
      var point = this.pointsForPassengers[this.position.lat() + '|' + this.position.lng()]
      if(point.type == 'PICK_UP' && point.passenger.state == Passenger.STATE.AWAITING_RIDE)
        point.passenger.pickUp();
      else if(point.type == 'DROP_OFF' && point.passenger.state == Passenger.STATE.IN_CAR)
        point.passenger.dropOff();
    }

    if(this.positionAlongRoute >= this.routeDuration)
      this.setRoute(null);

    this.positionAlongRoute ++;
    //from a route, getPath() returns an array (MVCArray, call .getArray() to get the js array) of LatLng coordinates.  There should be a single function to get the latlng position along a route with a provided float 0.0-1.0

    //if at (or as near as possible?) drop-off point for a passenger,
    //drop off that passenger

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
  if(this.passengers && this.passengers.length){
    var closureCar = this;
    this.calculatingRoute = true;
    this.geo.getDirections(this,
      function(data){
        closureCar.calculatingRoute = false;
        closureCar.setRoute(data);
      },
      function(status){
        closureCar.calculatingRoute = false;
      });
  }
};

Car.prototype.setRoute = function(route){
  this.route = route;
  this.positionAlongRoute = 0;
  this.pointsForPassengers = {};
  if(route){
    this.routeDuration = route.routes[0].legs[0].duration.value;
    this.points = this.geo.getPathFromRoute(route.routes[0]).getArray();

    //find points along route nearest to each passenger; designate those the drop-off points for that passenger
    for(var i = 0; i < this.passengers.length; i++){
      var shortestDistance = null;
      var closestPoint = null;
      for(var j = 0; j < this.points.length; j++){
        var distance = this.geo.euclideanDistance(this.passengers[i].position, this.points[j]);
        if(!shortestDistance || distance < shortestDistance){
          shortestDistance = distance;
          closestPoint = this.points[j]
        }
      }
      this.pointsForPassengers[closestPoint.lat() + '|' + closestPoint.lng()] = {type: 'PICK_UP', passenger: this.passengers[i]};

      shortestDistance = null;
      closestPoint = null;
      for(var j = 0; j < this.points.length; j++){
        var distance = this.geo.euclideanDistance(this.passengers[i].destination, this.points[j]);
        if(!shortestDistance || distance < shortestDistance){
          shortestDistance = distance;
          closestPoint = this.points[j];
        }
      }
      this.pointsForPassengers[closestPoint.lat() + '|' + closestPoint.lng()] = {type: 'DROP_OFF', passenger: this.passengers[i]};
    }
  }else{
    this.routeDuration = 0;
    this.points = null;
  }
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
