describe('collectionArraySync.js', function() {
  beforeEach(module('svgAbstraction'));

  describe('init >', function() {
    var collectionArraySync, $rootScope;

    beforeEach(inject(function(_collectionArraySync_, _$rootScope_) {
      collectionArraySync = _collectionArraySync_;
      $rootScope = _$rootScope_;
    }));

    it('loads', function() {
      expect(collectionArraySync.create).toBeDefined();
    });

    describe('creates array from collection >', function() {
      var collection, syncedArray;
      beforeEach(function() {
        collection = {
          'abc123': {
            id: 'abc123',
            foo: 'bar',
            order: 1
          },
          'def456': {
            id: 'def456',
            foo: 'hello world',
            order: 0
          }
        };

        // act
        syncedArray = collectionArraySync.create(collection);
        $rootScope.$digest();
      });

      it('creates the array with two items', function() {
        expect(syncedArray.length).toEqual(2);
      });

      it('def456 is first', function() {
        expect(syncedArray[0].id).toEqual('def456');
      });

      it('abc123 is second', function() {
        expect(syncedArray[1].id).toEqual('abc123');
      });

      it('creates pointers not copies', function() {
        expect(syncedArray[1]).toEqual(collection['abc123']);
      });

      describe('reorders items in array >', function() {
        beforeEach(function() {
          //move item 0 to spot 1
          syncedArray.splice(1,0,syncedArray.splice(0,1)[0]);

          //act
          $rootScope.$digest();
        });

        it('updates abc123 to order spot 0', function() {
          expect(collection['abc123'].order).toEqual(0);
        });

        it('updates def456 to order spot 1', function() {
          expect(collection['def456'].order).toEqual(1);
        });
      });

      describe('remove item from array >', function() {
        beforeEach(function() {
          syncedArray.splice(1,1);

          //act
          $rootScope.$digest();
        });

        it('does nothing because you should be adding/removing from collection not array', function() {
          expect(_.keys(collection).length).toEqual(2);
        });

        it('resets the array back', function() {
          expect(syncedArray.length).toEqual(2);
        });
      });
    });
  });

});