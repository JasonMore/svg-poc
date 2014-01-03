describe('liveResource.js >', function () {
  // setup require

  var racerModel = jasmine.createSpyObj('racerModel', ['unload', 'on', 'add', 'at', 'query', 'del', 'get', 'subscribe', 'scope', 'setDiff']),
    racer = {
      init: function () {
      },
      ready: function (fn) {
        fn(racerModel);
      }
    };

  beforeEach(function () {
    window.require = function (module) {
      // assuming racer.js
      return racer;
    };
  });

  beforeEach(module('liveResource'));

  var testData = {
    string: 'foobar123',
    bool: true,
    number: 123,
    object: {
      objectString: 'hello world',
      childObject: {
        childObjectString: 'mr fancy pants'
      }
    },
    array: [
      {id: 'arrayItem1'},
      'arrayItem2',
      ['arrayItem3']
    ]
  };

  var liveResourceProvider, httpBackend;


  describe('loading liveResourceProvider >', function () {
    var $httpBackend, $timeout;

    beforeEach(inject(function (_$httpBackend_) {
      spyOn(racer, 'ready').andCallThrough();
      spyOn(racer, 'init');

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/racerInit').respond({});
    }));

    // act
    beforeEach(inject(function (_liveResourceProvider_, _$timeout_) {
      liveResourceProvider = _liveResourceProvider_;
      $timeout = _$timeout_;
      $httpBackend.flush();
    }));

    it('calls ready', function () {
      expect(racer.ready).toHaveBeenCalled();
    });

    it('calls init', function () {
      expect(racer.init).toHaveBeenCalled();
    });

    describe('create live resource >', function () {
      var successFn, errorFn, liveResource;

      beforeEach(function () {
        successFn = jasmine.createSpy('successFn');
        successFn.andCallFake(function (returnService) {
          liveResource = returnService('objectModelPathToSave');
        });

        errorFn = jasmine.createSpy('errorFn');

        liveResourceProvider.createLiveResource.then(successFn, errorFn);

        $timeout.flush();
      });

      it('resolves the promise', function () {
        expect(successFn).toHaveBeenCalled();
      });

      it('does not call error function', function () {
        expect(errorFn).not.toHaveBeenCalled();
      });

      it('sets liveResource', function () {
        expect(liveResource).toBeDefined();
      });

      describe('liveResource >', function () {
        it('sets _racerModel', function () {
          expect(liveResource._racerModel).toBe(racerModel);
        });

        describe('add >', function () {
          var newModel, result, addCall;

          beforeEach(function () {
            racerModel.add.andCallFake(function () {
              return 'objectModelPathToSave.abc123'
            });

            newModel = {
              foo: 'bar',
              '$$hashKey': 'a01'
            };

            //act
            result = liveResource.add(newModel);

            // spy result
            addCall = racerModel.add.mostRecentCall;
          });

          it('calls racerModel.add', function () {
            expect(racerModel.add).toHaveBeenCalled();
          });

          it('calls add on objectModelPathToSave', function () {
            expect(addCall.args[0]).toEqual('objectModelPathToSave');
          });

          it('creates a copy of the model', function () {
            expect(addCall.args[1]).not.toBe(newModel);
          });

          it('excludes $$hashKey', function () {
            expect(addCall.args[1]).toEqual({foo: 'bar'});
          });

          // not sure if this is right
          it('returns result of id', function () {
            expect(result).toEqual('objectModelPathToSave.abc123');
          });
        });

        describe('at >', function () {
          var result, atReturnValue;

          beforeEach(function () {
            atReturnValue = {foo: 'bar'};

            racerModel.at.andCallFake(function () {
              return atReturnValue;
            });

            // act
            result = racerModel.at();
          });

          it('returns atReturnValue', function () {
            expect(result).toBe(atReturnValue);
          })
        });
      });
    });
  })

});