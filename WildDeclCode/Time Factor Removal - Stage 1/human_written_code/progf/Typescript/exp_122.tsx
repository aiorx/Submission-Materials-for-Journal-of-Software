var React = require('react');

var BreakpointEdge = require('./utils/index').BreakpointEdge;
var useBreakpoint = require('./utils/index').useBreakpoint;

interface HideAtProps {
  breakpoint: BreakpointEdge
  children?: React.ReactNode
}

// @ts-ignore
const HideAt: React.FunctionComponent<HideAtProps> = function ({ breakpoint, children }) {
  const shouldRender = useBreakpoint(breakpoint)

  if (shouldRender) {
    return children
  }
  return null
}

HideAt.displayName = 'HideAt'

HideAt.defaultProps = {
  breakpoint: '' as BreakpointEdge,
  children: null
}

module.exports = HideAt;
