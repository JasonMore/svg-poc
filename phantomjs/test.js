


// load page
var url = 'http://localhost:3000/#/renderTemplate/8cadc1aa-9cea-400a-9348-3090b16b66c1?dataSet=3ff12b9f-6620-4450-84fd-7cfe86905975';
var page = require('webpage').create();
page.open(url, function(status) {
  console.log(page.url);

  page.onCallback = function(message) {
    var callbackMessage = 'DENIED!';

    if (message && message.emit === 'doneRendering'){
      callbackMessage = 'Accepted.';
      console.log(message.svg);
    }

    setTimeout(function() {
          phantom.exit();
    });

    return callbackMessage;
  };

  page.onAlert = function(msg) {
    console.log('ALERT: ' + msg);
  };

  page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg);
  };
});