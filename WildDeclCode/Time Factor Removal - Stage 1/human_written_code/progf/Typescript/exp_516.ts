var React = require('react');
var styled = require('styled-components');
import {
  bigCardStyle,
  cardBottomInfoStyle,
  cardBottomNumberStyle,
  cardBottomStyle,
  CardMiddleStyle,
  CardStyle,
  cardTextStyle,
  cardTopStyle,
  smallCardStyle,
  smallChipStyle,
} from '../../css/card'

const Card = styled.div<{
  bgColor?: string
  ableToModalOpen?: boolean
  size: 'small' | 'big'
}>"
  " + (({ size }) => (size === 'big' ? bigCardStyle : smallCardStyle)) + "
  " + (CardStyle) + "
  " + (({ bgColor }) => bgColor && { backgroundColor: bgColor }) + "
  " + (({ ableToModalOpen }) => ableToModalOpen && { cursor: 'pointer' }) + "
"

const CardTop = styled.div"
  " + (cardTopStyle) + "
"

const CardMiddle = React.memo(
  styled.div"
    " + (CardMiddleStyle) + "
  "
)

const CardBottom = styled.div"
  " + (cardBottomStyle) + "
"

const CardBottomNumber = styled.div"
  " + (cardBottomNumberStyle) + "
"

const CardBottomInfo = styled.div"
  " + (cardBottomInfoStyle) + "
"

const CardText = styled.span"
  " + (cardTextStyle) + "
"

const CardSmallChip = styled.div"
  " + (smallChipStyle) + "
"

module.exports = {;
  Card,
  CardTop,
  CardMiddle,
  CardBottom,
  CardBottomInfo,
  CardText,
  CardSmallChip,
  CardBottomNumber,
}
