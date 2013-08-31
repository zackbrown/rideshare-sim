'use strict';

//TODO:
// Use distinct routes per passenger [stopOver: true]
// Create controls for numbers of cars, frequency of passenger requests, tick speed, pause
// Track passenger wait times
// Track car transit times per route; aggregate interesting stats
// Export stats as .json; make downloadable
// Show infowindow on car click for car-specific details
// Animate marker events
// Reshuffle optimize passengers that are not part of a car's immediate route

RideshareSimApp.controller('OptionsCtrl', function($scope, app) {
  $scope.togglePause = function(){
    app.togglePause();
  }
  $scope.paused = function(){
    return app.paused();
  }
  $scope.togglePauseText = function(){
    return ($scope.paused() ? 'Resume' : 'Pause');
  }


});
