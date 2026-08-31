```javascript
const calculatePositions = (element, description, placement) => {
  let elemBoundaries = element.getBoundingClientRect();
  let descBoundaries = description.getBoundingClientRect();
  let position = { x: 0, y: 0 };
  let factor = descBoundaries.width > elemBoundaries.width ? -1 : 1;
  const verticalX = Math.round(elemBoundaries.x + (factor * Math.abs(elemBoundaries.width - descBoundaries.width) / 2));
  switch(placement) {
    case 'top': {
      position.x = verticalX;
      position.y = Math.round(elemBoundaries.y - descBoundaries.height - offset);
      break;
    }
    case 'right': {
      position.x = Math.round(elemBoundaries.x + elemBoundaries.width + offset);
      position.y = Math.round(elemBoundaries.y + elemBoundaries.height / 2 - descBoundaries.height / 2);
      break;
    }
    case 'bottom': {
      position.x = verticalX;
      position.y = Math.round(elemBoundaries.y + elemBoundaries.height + offset);
      break;
    }
    case 'left': {
      position.x = Math.round(elemBoundaries.x - descBoundaries.width - offset);
      position.y = Math.round(elemBoundaries.y + elemBoundaries.height / 2 - descBoundaries.height / 2);
      break;
    }
    default: {
      position.x = verticalX;
      position.y = Math.round(elemBoundaries.y - descBoundaries.height - offset);
      break;
    }
  }
  return position;
};
```