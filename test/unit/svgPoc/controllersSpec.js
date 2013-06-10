'use strict';

describe('Controller: mainCtrl', function () {

  // load the controller's module
  beforeEach(module('svgPoc'));

  var mainCtrl,
    $scope,
    _box = {};

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    mainCtrl = $controller('mainCtrl', {
      $scope: $scope
    });
  }));

  it('should be able to make controller', function () {
    expect(mainCtrl).not.toBe(null);
  });

  it('attached boxes', function() {
    expect($scope.boxes.length).toBe(2);
  });

  describe('when clicking box', function() {
    beforeEach(function () {
      $scope.setActive(_box);
    });

    it('active box is _box', function() {
      expect($scope.activeBox).toBe(_box);
    });

    
  });

  describe('when adding box', function(){
    beforeEach(function () {
      $scope.addBox();
    });

    it('sets new active box', function(){
      expect($scope.activeBox).toEqual({x: 50, y: 50, color: "orange"});
    });

    it('adds new box to list of all boxes', function(){
      expect($scope.boxes.length).toEqual(3);
    });
  });

  describe('when deleting current box', function() {
    beforeEach(function() {
      var boxToDelete = {x:123, y:123, color:"blue"};
      $scope.boxes.push(boxToDelete);
      $scope.activeBox = boxToDelete;
      $scope.deleteCurrentBox();
    });

    it('removed box', function() {
      expect($scope.boxes.length).toEqual(2);
    });

    it('set activeBox to null', function() {
      expect($scope.activeBox).toBeNull();
    });
  });

});
