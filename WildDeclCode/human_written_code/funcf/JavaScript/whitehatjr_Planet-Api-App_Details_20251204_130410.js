```javascript
setDetails = planetDetails => {
  const planetType = planetDetails.planet_type;
  let imagePath = "";
  switch (planetType) {
    case "Gas Giant":
      imagePath = require("../assets/planet_type/gas_giant.png");
      break;
    case "Terrestrial":
      imagePath = require("../assets/planet_type/terrestrial.png");
      break;
    case "Super Earth":
      imagePath = require("../assets/planet_type/super_earth.png");
      break;
    case "Neptune Like":
      imagePath = require("../assets/planet_type/neptune_like.png");
      break;
    default:
      imagePath = require("../assets/planet_type/gas_giant.png");
  }

  this.setState({
    details: planetDetails,
    imagePath: imagePath
  });
};
```