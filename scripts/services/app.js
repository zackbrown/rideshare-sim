'use strict';

RideshareSimApp.factory('app', [function(){

  var _paused = false;
  var self = {
    togglePause: function(){
      console.log('toggling pause', _paused);
      _paused = !_paused;
    },
    paused: function(){
      return _paused;
    }
  };

  return self;
}]);
