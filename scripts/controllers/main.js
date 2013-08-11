'use strict';

RideshareSimApp.controller('MainCtrl', function($scope) {

  var mapOptions = {
          center: new google.maps.LatLng(37.76, -122.435),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
  $scope.map = new google.maps.Map(document.getElementById("google-maps-canvas"),
      mapOptions);

  google.maps.event.addListenerOnce($scope.map, 'idle', function() {
    google.maps.event.trigger($scope.map, 'resize');
  });
});
