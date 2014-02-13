describe('dotNotationService.js >', function() {
  var dotNotation, model;

  beforeEach(module('main'));

  beforeEach(inject(function(_dotNotation_) {
    dotNotation = _dotNotation_;

    model = {
      id: "abc123",
      image: {
        height: 100,
        width: 100,
        url: 'http://google.com'
      },
      tags: ['foo', 'bar']
    };
  }));

  describe('getting values >', function() {
    it('gets id', function() {
      expect(dotNotation.getSet(model, 'id')).toEqual('abc123');
    });

    it('gets image', function() {
      var imageExpectation = {
        height: 100,
        width: 100,
        url: 'http://google.com'
      };

      expect(dotNotation.getSet(model, 'image')).toEqual(imageExpectation);
    });

    it('gets image height', function() {
      expect(dotNotation.getSet(model, 'image.height')).toEqual(100);
    });

    it('gets image url', function() {
      expect(dotNotation.getSet(model, 'image.url')).toEqual('http://google.com');
    });

    it('gets tag array', function() {
      expect(dotNotation.getSet(model, 'tags')).toEqual(['foo', 'bar']);
    });

    it('gets tag array index 0', function() {
      expect(dotNotation.getSet(model, 'tags.0')).toEqual('foo');
    });

    it('gets tag array index 1', function() {
      expect(dotNotation.getSet(model, 'tags.1')).toEqual('bar');
    });

    it('undefined for index out of range', function() {
      expect(dotNotation.getSet(model, 'tags.2')).toBeUndefined();
    });

    it('returns object when property is undefined', function() {
      expect(dotNotation.getSet(model)).toBe(model);
    });
  });

  describe('does not change any values when getting >', function() {
    var modelCopy;

    beforeEach(function() {
      modelCopy = {
        id: "abc123",
        image: {
          height: 100,
          width: 100,
          url: 'http://google.com'
        },
        tags: ['foo', 'bar']
      };

      // act
      dotNotation.getSet(model, 'id');
      dotNotation.getSet(model, 'image.height');
      dotNotation.getSet(model, 'tags.0');
      dotNotation.getSet(model, 'tags.2');
    });

    it('does not change any values when getting', function() {
      expect(model).toEqual(modelCopy);
    });
  });

  describe('setting values >', function() {
    it('sets string properties', function() {
      dotNotation.getSet(model, 'id', 'def456');
      expect(model.id).toEqual('def456');
    });

    it('sets object properties', function() {
      dotNotation.getSet(model, 'image', {foo:'bar'});
      expect(model.image).toEqual({foo:'bar'});
    });

    it('sets object child properties', function() {
      dotNotation.getSet(model, 'image.height', 9999);
      expect(model.image.height).toEqual(9999);
    });

    it('adds object child properties', function() {
      dotNotation.getSet(model, 'image.newThing', 12345);
      expect(model.image.newThing).toEqual(12345);
    });

    it('updates array value', function() {
      dotNotation.getSet(model, 'tags.0', 'hello world');
      expect(model.tags[0]).toEqual('hello world');
    });

    it('adds array value', function() {
      dotNotation.getSet(model, 'tags.2', 'hello world');
      expect(model.tags[2]).toEqual('hello world');
    });

    it('adds null array values when index is greater than length', function() {
      dotNotation.getSet(model, 'tags.3', 'hello world');
      expect(model.tags).toEqual(['foo', 'bar', undefined, 'hello world']);
    });
  });
});