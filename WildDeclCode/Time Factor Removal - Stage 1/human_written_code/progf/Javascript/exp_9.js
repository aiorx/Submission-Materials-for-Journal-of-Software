const svgs = require("../src/svg");

module.exports = function (req, res) {
  var type = req.query.type;
var text1 = req.query.text1;
var text2 = req.query.text2;
var height = req.query.height;
var width = req.query.width;

  res.setHeader("Content-Type", "image/svg+xml");

  const error_svg = "origin";

  let svg;

  if (type in svgs) {
    svg = svgs[type];
  } else {
    svg = svgs[error_svg];
    console.log(svg("Type not valid", "refer readme for details !!"));
    return res.send(svg("Type not valid", "refer readme for details !!"));
  }

  res.send(svg({ text1, text2, height, width }));
};
