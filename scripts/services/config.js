'use strict';

RideshareSimApp.factory('config', function(){
  return {
    GOOGLE_MAPS_API_KEY: 'AIzaSyAj57wJWzDXWbEARk-wDuQQzwg3BP0Sdp8',
    MAX_PASSENGERS: 4,
    STARTING_CARS: 15,
    STARTING_PASSENGERS: 20,
    TICK_PERIOD: 15, //ms; real-time
    ASSIGN_RIDES_PERIOD: 3000, //ms; real-time
    PASSENGER_REQUEST_PERIOD: 90 //ticks; sim-time
  }
});
