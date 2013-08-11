'use strict';

function onGoogleReady() {
  alert('ready!');
}

RideshareSimApp.controller('MainCtrl', function($scope, $timeout) {

  var mapOptions = {
          center: new google.maps.LatLng(37.76, -122.435),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
  $scope.map = new google.maps.Map(document.getElementById("google-maps-canvas"), mapOptions);
  var image = {
    url: 'img/yellow-car-top.png'
  }
  var myLatLng = new google.maps.LatLng(37.76, -122.435);
  var beachMarker = new google.maps.Marker({
    position: myLatLng,
    map: $scope.map,
    icon: image
  })

});
