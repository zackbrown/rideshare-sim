'use strict';

RideshareSimApp.directive('options', function() {
  return {
    templateUrl: 'views/options-template.html',
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});
