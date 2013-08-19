'use strict';

RideshareSimApp.factory('geo', ['$http', 'config', 'util', function($http, config, util){

  //simple square inside san francisco
  var SIMPLE_NORTHEAST = new google.maps.LatLng(37.80387301496261, -122.40311389923096);
  var SIMPLE_SOUTHWEST = new google.maps.LatLng(37.72451963695821, -122.47094160079956);
  var DIRECTIONS_URL = 'http://maps.googleapis.com/maps/api/directions/json?origin={{ORIGIN}}&waypoints={{WAYPOINTS}}&sensor=false'; //&destination=


  var directionsService = new google.maps.DirectionsService();
  var self = {
    getDirections: function(start, destinations, successCallback, errorCallback){
      /*var url = DIRECTIONS_URL.replace('{{ORIGIN}}', util.latLngString(start));
      var waypointString = ''
      for(var i = 0; i < destinations.length; i++)
        waypointString += util.latLngString(destinations[i]) + '|'

      url = url.replace('{{WAYPOINTS}}', waypointString);

      $http({method: 'GET', url: url})
        .success(successCallback)
        .error(errorCallback || function(data){
          alert('Google Directions error: ' + data);
        })

    */
    var request = {
      origin:start,
      waypoints: destinations,
      destination: destinations[0],
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        successCallback(result);
      }else{
        console.warn('Google Directions Error! ' + status, result);
      }
    });

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
  return self;
}]);