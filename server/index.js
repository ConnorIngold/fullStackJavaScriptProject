const express = require("express");
const volleyball = require("volleyball");


const app = express();

const auth = require("./auth/index");

app.use(volleyball);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!"
  });
});

app.use("/auth", auth);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error("Not found - " + req.originalUrl);
  next(error);
}

function errorHandler(err, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

// function ensureAdmin(res, req, next){
//   if(req.body.admin){
//     next()
//   } else {
//     Error('You do not have permission ')
//   }
// }

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port", port);
});
