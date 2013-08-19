'use strict';

RideshareSimApp.factory('geo', ['$http', function($http, config, util){

  //simple square inside san francisco
  var SIMPLE_NORTHEAST = new google.maps.LatLng(37.80387301496261, -122.40311389923096);
  var SIMPLE_SOUTHWEST = new google.maps.LatLng(37.72451963695821, -122.47094160079956);
  var DIRECTIONS_URL = 'http://maps.googleapis.com/maps/api/directions/json?origin={{ORIGIN}}&waypoints={{WAYPOINTS}}&sensor=false'; //&destination=


  var self = {
    getDirections: function(start, destinations, successCallback, errorCallback){
      var url = DIRECTIONS_URL.replace('{{ORIGIN}}', util.latLngString(start));
      var waypointString = ''
      for(var i = 0; i <= destinations.length; i++)
        waypointString += util.latLngString(destinations[i]) + '|'

      url = url.replace('{{WAYPOINTS}}', waypointString);

      $http({method: 'GET', url: url})
        .success(successCallback)
        .error(errorCallback || function(data){
          alert('Google Directions error: ' + data);
        })
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
    }
  };
  return self;
}]);
