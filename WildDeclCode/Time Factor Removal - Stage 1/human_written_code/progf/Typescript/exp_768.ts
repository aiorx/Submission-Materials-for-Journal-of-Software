var CardShape = require('./shapes').CardShape;

var Shapes = require('./shapes');
var CardMove = require('./moves').CardMove;
var GetMove = require('./moves').GetMove;

type CardProps = {
  value: number;
  shape: CardShape;
  move?: CardMove;
  image?: string;
  iNeed?: CardShape;
};

/**
 * Generate a new Card, which may be of any shape and value
 */
class Card {
  value: number;
  shape: CardShape;
  move: CardMove;
  image?: string;
  iNeed?: CardShape;

  constructor(props: CardProps) {
    this.value = props.value;
    this.shape = props.shape;
    this.move = props.move || GetMove(props.value);
    this.image = props.image;
    this.iNeed = props.iNeed;
  }

  matches = function (card: Card) {
    return (
      card.shape === this.shape ||
      card.value === this.value ||
      (this.shape === Shapes.Whot && this.iNeed && this.iNeed === card.shape) ||
      card.shape === Shapes.Whot
    );
  };

  render = function () { return "" + (this.shape) + " (" + (this.value) + ")"; };

  reset = function () {
    this.iNeed = undefined;
  };

  get score() {
    if (this.shape === Shapes.Star) return this.value * 2;
    else return this.value;
  }
}
module.exports = Card;

const GetTriangle = function (props: Omit<CardProps, "shape">) { return new Card({
    ...props,
    shape: Shapes.Triangle,
  }); };
const GetCircle = function (props: Omit<CardProps, "shape">) { return new Card({
    ...props,
    shape: Shapes.Circle,
  }); };
const GetSquare = function (props: Omit<CardProps, "shape">) { return new Card({
    ...props,
    shape: Shapes.Square,
  }); };
const GetStar = function (props: Omit<CardProps, "shape">) { return new Card({
    ...props,
    shape: Shapes.Star,
  }); };
const GetCross = function (props: Omit<CardProps, "shape">) { return new Card({
    ...props,
    shape: Shapes.Cross,
  }); };
const GetWhot = function (props: Omit<CardProps, "shape">) { return new Card({
    ...props,
    shape: Shapes.Whot,
  }); };
