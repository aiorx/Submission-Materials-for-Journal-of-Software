var _import = require('react');
var PropTypes = require('prop-types');
var L = require('leaflet');
var Pixel = require('../../util/PropTypes').Pixel;

interface PartialProps {
  layer: L.Marker
  children: React.ReactNode
}

export type Props = Readonly<Partial<PartialProps>>

module.exports = abstract class BaseIcon<T extends L.Icon | L.DivIcon, P extends L.BaseIconOptions> extends PureComponent<Props & P, { instance: T }> {;
  public static propTypes = {
    pane: PropTypes.string,
    attribution: PropTypes.string,
    iconUrl: PropTypes.string,
    iconRetinaUrl: PropTypes.string,
    iconSize: Pixel,
    iconAnchor: Pixel,
    popupAnchor: Pixel,
    tooltipAnchor: Pixel,
    shadowUrl: PropTypes.string,
    shadowRetinaUrl: PropTypes.string,
    shadowSize: Pixel,
    shadowAnchor: Pixel,
    className: PropTypes.string,
    layer: PropTypes.instanceOf(L.Marker),
    children: PropTypes.node
  }

  public readonly state: { instance: T } = {
    instance: undefined
  }

  public render (): React.ReactNode {
    var children = this.props.children;const { instance: icon } = this.state

    return icon && children ? Children.map(children, function child { return (isValidElement(child) ? cloneElement<{ icon: T }>(child as React.ReactElement, { icon }) : child); }) : null
  }
}
