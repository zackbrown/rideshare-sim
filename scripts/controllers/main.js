'use strict';

RideshareSimApp.controller('MainCtrl', function($scope) {

  var mapOptions = {
          center: new google.maps.LatLng(37.66, -122.5),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
  $scope.map = new google.maps.Map(document.getElementById("google-maps-canvas"),
      mapOptions);

  google.maps.event.addListenerOnce($scope.map, 'idle', function() {
    google.maps.event.trigger($scope.map, 'resize');
  });
});
