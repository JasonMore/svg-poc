describe('liveResource.js >', function () {
  // setup require

  var racerModel = {
      on: function () {
      },
      add: function (path, newModel) {
        return {};
      }
    },
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
      sinon.spy(racer, 'ready');
      sinon.spy(racer, 'init');

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/racerInit').respond({});
    }));

    afterEach(function () {
      racer.ready.restore();
      racer.init.restore();
    });

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
      var doneFn, successSpy, errorSpy, liveResource;

      beforeEach(function () {
        doneFn = function (returnService) {
          liveResource = returnService('mypath');
        };

        successSpy = sinon.spy(doneFn);
        errorSpy = sinon.spy();

        liveResourceProvider.createLiveResource.then(successSpy, errorSpy);

        $timeout.flush();
      });

      it('resolves the promise', function () {
        expect(successSpy).toHaveBeenCalledOnce();
      });

      it('does not call error function', function () {
        expect(errorSpy.called).toBeFalsy();
      });

      it('sets liveResource', function () {
        expect(liveResource).toBeDefined();
      });

      describe('liveResource >', function () {
        it('sets _racerModel', function () {
          expect(liveResource._racerModel).toBe(racerModel);
        });

        describe('add', function () {
          var newModel, result;

          beforeEach(function () {
            sinon.spy(racerModel, 'add');

            newModel = {
              foo: 'bar',
              '$$hashKey': 'a01'
            };

            //act
            result = liveResource.add(newModel);
          });

          it('creates a copy of the model', function () {
            expect(racerModel.add.firstCall.args[1]).not.toBe(newModel);
          });

//          it('excludes $$hashKey', function () {
//            expect(racerModel.add.firstCall.args[1]).toEqual({foo: 'bar'});
//          });

//          it('calls racer.add');
//
//          it('result has??');
        });
      });
    });

//    it('resolves the promise', function() {
//      var spy = sinon.spy(),
//        errorSpy = sinon.spy();
//
//      liveResourceProvider.createLiveResource.then(spy, errorSpy);
//      $timeout.flush();
//
//      expect(spy).toHaveBeenCalledOnce();
//      expect(errorSpy.called).toBeFalsy();
//    });
//
//    it('returns liveResource on create', function () {
//      liveResourceProvider.createLiveResource.then(function(value){
//        expect(value).toBeDefined();
//      });
//      $timeout.flush();
//    });
  })

});