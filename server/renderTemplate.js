var phantom, sync, _ref;

_ref = require('phantom-sync'), phantom = _ref.phantom, sync = _ref.sync;






function test() {

  sync(function() {
    var page, ph, status, title;
    ph = phantom.create();
    page = ph.createPage();
    status = page.open("http://www.google.com");
    console.log("status=", status);
    title = page.evaluate(function() {
      return document.title;
    });
    console.log("title=", title);
    return ph.exit();
  });


}


module.exports = {
  test: test
};