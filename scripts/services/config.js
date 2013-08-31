'use strict';

RideshareSimApp.factory('config', function(){
  return {
    GOOGLE_MAPS_API_KEY: 'AIzaSyAj57wJWzDXWbEARk-wDuQQzwg3BP0Sdp8',
    MAX_PASSENGERS: 4,
    STARTING_CARS: 10,
    STARTING_PASSENGERS: 10,
    TICK_PERIOD: 10, //ms; real-time
    ASSIGN_RIDES_PERIOD: 3000, //ms; real-time
    PASSENGER_REQUEST_PERIOD: 90 //ticks; sim-time
  }
});
