'use strict';

describe('Directive: options', function() {
  beforeEach(module('appApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<options></options>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the options directive');
  }));
});
