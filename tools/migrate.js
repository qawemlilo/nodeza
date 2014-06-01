
var migrate = require('../lib/migrate');

migrate.reset()
.then(function () {
  migrate.init()
  .then(function () {
    process.exit(0);
  })
  .otherwise(function (err) {
    console.log(err);
    process.exit(1);
  });
});