'use strict';

RideshareSimApp.factory('util', function(){
  var debug = {
    counter: 0,
    northeast: null,
    southwest: null
  }
  return {
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
