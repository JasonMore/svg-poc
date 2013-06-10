//'use strict';
//
///* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
//
//describe('my app', function() {
//
//  beforeEach(function() {
//    browser().navigateTo('index.html');
//  });
//
//
//  it('redirects to /view1 when location hash/fragment is empty', function() {
//    expect(browser().location().url()).toBe("/view1");
//  });
//
//  describe('view1', function() {
//
//    beforeEach(function() {
//      browser().navigateTo('#/view1');
//    });
//
//
//    it('renders view1 when user navigates to /view1', function() {
//      expect(element('[ng-view] p:first').text()).
//        toMatch(/partial for view 1/);
//    });
//
//  });
//
//
//  describe('view2', function() {
//
//    beforeEach(function() {
//      browser().navigateTo('#/view2');
//    });
//
//    it('renders view2 when user navigates to /view2', function() {
//      expect(element('[ng-view] p:first').text()).
//        toMatch(/partial for view 2/);
//    });
//
//  });
//});
