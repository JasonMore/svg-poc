describe('liveResource.js', function () {
  // setup require

  var racerMock,
    racer = {
      init: function () {
      },
      ready: function () {
      }
    };

  beforeEach(function () {
    racerMock = sinon.mock(racer);

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

  var liveResourceProvider;

  beforeEach(inject(function (_liveResourceProvider_) {
    liveResourceProvider = _liveResourceProvider_;
  }));

  it('loads liveResource', function () {
    expect(liveResourceProvider).toBeDefined();
    expect(liveResourceProvider.add).toBeDefined();
  })
});