var racerStore = require('../setup/racer').store;

function create(req, res) {
  var racerModel = racerStore.createModel({fetchOnly: true}, req);

  if(!req.body.templateType) {
    res.send();
    return;
  }

  var foo = racerModel.add('templateType', req.body.templateType);
  console.log(foo);
  res.send(foo);
}

function get() {

}

function del() {

}

module.exports = {
  create: create,
  get: get,
  del: del
};