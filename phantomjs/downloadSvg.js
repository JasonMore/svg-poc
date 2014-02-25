//console.log(system.args);
//phantom.exit(1);
//return;

//if (system.args.length === 1) {
//  console.log('Usage: downloadSvg.js <templateId> <dataSetId>');
//  phantom.exit(1);
//  return;
//}

//var templateId = system.args[1],
//  dataSet = system.args[2];

// load page
var url = 'http://localhost:3000/#/renderTemplate/8cadc1aa-9cea-400a-9348-3090b16b66c1?dataSet=3ff12b9f-6620-4450-84fd-7cfe86905975';
//var url = 'http://localhost:3000/#/renderTemplate/' + templateId + '?dataSet=' + dataSet;
var page = require('webpage').create();
page.open(url, function(status) {
  console.log(page.url);

  page.onCallback = function(message) {
    page.render('output.png');
    var callbackMessage = 'Rendering Failed!';

    if (message && message.emit === 'doneRendering'){
      callbackMessage = 'Done Rendering';
      console.log(callbackMessage);
    }

    setTimeout(function() {
          phantom.exit();
    });

    return callbackMessage;
  };

//  page.onAlert = function(msg) {
//    console.log('ALERT: ' + msg);
//  };
//
//  page.onConsoleMessage = function(msg, lineNum, sourceId) {
//    console.log('CONSOLE: ' + msg);
//  };
});