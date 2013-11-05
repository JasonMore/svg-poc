// Convenient way to load a mock object into a test
// eg:
//   // load 'myServiceMock' in place of myService
//   useMock('service', 'myService')
// or:
//  // can specify what to replace with instead of infering mock object name
//   useMock('value', 'someValue', someOtherValue)

window.useMock = function (type, name, mockReplacement) {
  // autoguess mock name if not provided
  if (!mockReplacement) {
    mockReplacement = window[name + 'Mock'];
  }
  return module(function ($provide) {
    debugger;
    $provide[type](name, mockReplacement);
  });
};
