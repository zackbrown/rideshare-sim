'use strict';

RideshareSimApp.directive('options', function() {
  return {
    templateUrl: 'views/options-template.html',
    restrict: 'EA',
    controller: 'OptionsCtrl',
    link: function postLink(scope, element, attrs) {
    }
  };
});
