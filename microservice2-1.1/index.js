var restify = require("restify");
var errors = require("restify-errors");
var server = restify.createServer();
const { mode, min, max, mean, std, median } = require("mathjs");

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.authorizationParser());

server.use(function(req, res, next) {
  users = {
    //ibm_test_robot_1: { password: "ibm_test_1.123#" },
    ibm_test_robot_2: { password: "ibm_test_2.123#" },
    ibm_test_robot_3: { password: "ibm_test_3.123#" }
  };
  if (
    users[req.username] &&
    req.authorization.basic.password == users[req.username].password
  ) {
    //console.log("passed");
    return next();
  } else {
    //console.log("not passed");
    return next(new errors.NotAuthorizedError());
  }
});

server.use(function(err, req, res, next) {
  //console.error(err);
  const error_result = { status: "error", message: JSON.stringify(err) };
  res.send(400, error_result);
});

server.post("/statistics1_1", statistics);

function statistics(req, res, next) {
  var { elements } = req.body;
  var discardedElements = elements.filter(
    element => typeof element !== "number"
  );
  var numbers = elements.filter(element => typeof element === "number");
  var mode_r = mode(numbers);
  const success_response = {
    status: "success",
    message: "ok",
    data: {
      mode: mode_r[0],
      average: mean(numbers),
      min: min(numbers),
      max: max(numbers),
      median: median(numbers),
      count: numbers.length,
      stdev: std(numbers),
      discardedElements
    }
  };
  res.send(200, success_response);
  return next();
}

server.listen(8081, function() {
  console.log(server.name + " listening at " + server.url);
});
