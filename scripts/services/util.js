'use strict';

RideshareSimApp.factory('util', function(){
  var debug = {
    counter: 0,
    northeast: null,
    southwest: null
  }
  return {
    geoDistance: function(ll1, ll2){
      //naive equirectangular approach; does not consider actual driving distance
      //TODO:  replace with street-aware distance (probably from directions API) between points
      var lat1 = ll1.lat();
      var lat2 = ll2.lat();
      var lng1 = ll1.lng();
      var lng2 = ll2.lng();
      var x = (lng2-lng1) * Math.cos((lat1+lat2)/2);
      var y = (lat2-lat1);
      var d = Math.sqrt(x*x + y*y) * R;
      return d;
    },

    generateUUID: function(){
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
      });
    },

    latLngString: function(latlng){
      return latlng.lat() + ',' + latlng.lng();
    },

    enableMapDebugMode: function(map){
      google.maps.event.addListener(map, 'bounds_changed', function() {
        debug.northeast = map.getBounds().getNorthEast();
        debug.southwest = map.getBounds().getSouthWest();
        debug.counter++;
      });
      window.onmouseup = function(){
        console.log(debug.counter + ' northeast', debug.northeast);
        console.log(debug.counter + ' southwest', debug.southwest);
      };
    }
  }
});
