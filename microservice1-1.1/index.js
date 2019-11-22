var restify = require("restify");
var server = restify.createServer();
var errors = require("restify-errors");

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.authorizationParser());

server.use(function(req, res, next) {
  users = {
    ibm_test_robot_1: { password: "ibm_test_1.123#" },
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

server.post("/ibmchallengemic1/element_sorter1_1", sendV110);
server.use(function(err, req, res, next) {
  //console.error(err);
  const error_result = { status: "error", message: JSON.stringify(err) };
  res.send(404, error_result);
});

function sendV110(req, res, next) {
  var { elements } = req.body;
  var numbers = elements
    .filter(element => typeof element === "number")
    .sort((a, b) => a - b);
  var others = elements
    .filter(element => typeof element !== "number" && element !== "")
    .sort();
  const success_response = {
    status: "success",
    message: "ok",
    data: { numbers, others }
  };
  res.send(200, success_response);
  return next();
}

server.listen(8080, function() {
  console.log(server.name + " listening at " + server.url);
});
