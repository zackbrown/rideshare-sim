'use strict';

RideshareSimApp.factory('app', [function(){

  var _paused = false;
  var _passengerStats = {}
  for(var key in Passenger.STATE)
    _passengerStats[key] = [];

  var self = {
    togglePause: function(){
      _paused = !_paused;
    },
    paused: function(){
      return _paused;
    },
    addPassengerStats: function(passengerStats){
      for(var key in Passenger.STATE){
        _passengerStats[key].push(passengerStats[key]);
      }
    },
    getPassengerStats: function(){
      return _passengerStats;
    }
  };

  return self;
}]);
