'use strict';

RideshareSimApp.factory('geo', ['$http', 'config', 'util', function($http, config, util){

  //simple square inside san francisco
  var SIMPLE_NORTHEAST = new google.maps.LatLng(37.80387301496261, -122.40311389923096);
  var SIMPLE_SOUTHWEST = new google.maps.LatLng(37.72451963695821, -122.47094160079956);
  var DIRECTIONS_URL = 'http://maps.googleapis.com/maps/api/directions/json?origin={{ORIGIN}}&waypoints={{WAYPOINTS}}&sensor=false'; //&destination=


  var directionsService = new google.maps.DirectionsService();
  var retryQueue = [];

  var _removeRetryFromQueue = function(retry){
    for(var i = 0; i < retryQueue.length; i++){
      if(retryQueue[i].id == retry.id)
        retryQueue[i] = null;
    }
    retryQueue = _.compact(retryQueue);
  }

  var _getWaypointsAndDestinationFromStartAndPassengers = function(start, passengers){
    //naive, greedy implementation; find next stop based on simple euclidean geo distance
    //until all passenger x (position, destination) are gone, loop:
    //grab the nearest

    var passengerState = {}; //null: not used yet; 1: pickup used; 2: dropoff used
    var getAvailableStops = function(){
      var ret = [];
      for(var i = 0; i < passengers.length; i++){
        var passenger = passengers[i];
        if(!passengerState[passenger.id])
          ret.push({passenger: passenger, position: passenger.position})
        else if (passengerState[passenger.id] == 1)
          ret.push({passenger: passenger, position: passenger.destination})
      }
      return ret;
    };

    var incrementPassengerState = function(passenger){
      if(!passengerState[passenger.id])
        passengerState[passenger.id] = 1;
      else if(passengerState[passenger.id] == 1)
        passengerState[passenger.id] = 2;
      else
        throw "internal error:  should not increment passenger state beyond 2";
    }

    var lastStop = start;
    var stops = []
    var waypoints = [];
    while((stops = getAvailableStops()).length){
      var closestStop = null; // {passenger, position}
      var shortestDistance = null;
      for(var i = 0; i < stops.length; i++){
        var distance = self.euclideanDistance(lastStop, stops[i].position);
        if(!shortestDistance || distance < shortestDistance){
          shortestDistance = distance;
          closestStop = stops[i]
        }
      }
      waypoints.push({location: closestStop.position, stopover: false});
      incrementPassengerState(closestStop.passenger);
    }

    if(!waypoints.length)
      console.log('waypoints null!', car)

    var destination = waypoints[waypoints.length - 1].location;
    waypoints = waypoints.slice(0, waypoints.length - 1);

    return {
      waypoints: waypoints,
      destination: destination
    }
  }

  var self = {
    getDirections: function(car, successCallback, errorCallback){

      var waypointsAndDestination = _getWaypointsAndDestinationFromStartAndPassengers(car.position, car.passengers);

      var request = {
        origin: car.position,
        waypoints: waypointsAndDestination.waypoints,
        destination: waypointsAndDestination.destination,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          successCallback(result);
        }else{
          console.warn('Google Directions Error! ' + status, result);
          if(errorCallback)
            errorCallback(status);
        }
      });
    },

    getPathFromRoute: function(route){
      var polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 3
      });

      var legs = route.legs;

      //First, find the maximum ratio of points:duration
      var maxRatio = 0;
      for (var i=0;i<legs.length;i++) {
        var steps = legs[i].steps;
        for (var j=0;j<steps.length;j++) {
          var nextSegment = steps[j].path;
          maxRatio = Math.max(nextSegment.length / steps[j].duration.value, maxRatio);
        }
      }

      var _interpolate = function(point1, point2, offset){
        //edge-case at end of array
        if(!point2)
          return point1;

        return new google.maps.LatLng(
          point1.lat() + ((point2.lat() - point1.lat()) * offset),
          point1.lng() + ((point2.lng() - point1.lng()) * offset)
        );
      }

      //Ensure that each segment matches that ratio as closely as possible
      var _matchSegmentToNewRatio = function(segment, currentRatio, newRatio){
        var retSegment = [];
        if(isNaN(currentRatio))
          throw 'currentRatio must be a number';
        if(isNaN(newRatio))
          throw 'currentRatio must be a number';
        if(newRatio == 0)
          throw 'currentRatio cannot be zero';
        for(var i = 0; i < segment.length; i += currentRatio / newRatio){
          retSegment.push(_interpolate(segment[Math.floor(i)], segment[Math.ceil(i)], i - Math.floor(i)));
        }
        return retSegment;
      }

      for (var i=0;i<legs.length;i++) {
        var steps = legs[i].steps;
        for (var j=0;j<steps.length;j++) {
          var nextSegment = _matchSegmentToNewRatio(steps[j].path, steps[j].path.length / steps[j].duration.value, maxRatio);
          for (var k=0;k<nextSegment.length;k++) {
            polyline.getPath().push(nextSegment[k]);
          }
        }
      }

      return polyline.getPath();
    },

    retryDirections: function(){
      for(var i = 0; i < retryQueue.length; i++){
        var retry = retryQueue[i];
        directionsService.route(_.extend(retry.request, {origin: retry.car.position}), function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            retry.successCallback(result);
            _removeRetryFromQueue(retry);
          }else if(status == google.maps.DirectionsStatus.ZERO_RESULTS){
            console.warn('Google Directions Error:  No results.  Will not retry.');
            _removeRetryFromQueue(retry);
          }else{
            console.warn('Google Directions Retry Error -- Will continue to retry' + status, result);
          }
        });
      }
    },

    getCarStartingPosition: function(){
      return self.getSimpleRandomPoint();
    },

    getPassengerStartingPosition: function(){
      return self.getSimpleRandomPoint();
    },

    getPassengerDestination: function(){
      return self.getSimpleRandomPoint();
    },

    getSimpleRandomPoint: function(){
      return new google.maps.LatLng(
        (Math.random() * (SIMPLE_NORTHEAST.lat() - SIMPLE_SOUTHWEST.lat())) + SIMPLE_SOUTHWEST.lat(),
        (Math.random() * (SIMPLE_SOUTHWEST.lng() - SIMPLE_NORTHEAST.lng())) + SIMPLE_NORTHEAST.lng()
      );
    },

    euclideanDistance: function(ll1, ll2){
      //naive equirectangular approach; does not consider actual driving distance
      //TODO:  implement street-aware distance (probably from directions API) between points
      var lat1 = ll1.lat();
      var lat2 = ll2.lat();
      var lng1 = ll1.lng();
      var lng2 = ll2.lng();
      var x = (lng2-lng1) * Math.cos((lat1+lat2)/2);
      var y = (lat2-lat1);
      var R = 6371; //km; radius of earth
      var d = Math.sqrt(x*x + y*y) * R;
      return d;
    }
  };

  //setInterval(self.retryDirections, 5000);
  return self;
}]);
