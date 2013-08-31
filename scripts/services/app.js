'use strict';

RideshareSimApp.factory('app', [function(){

  var _paused = false;
  var self = {
    togglePause: function(){
      _paused = !_paused;
    },
    paused: function(){
      return _paused;
    }
  };

  return self;
}]);
