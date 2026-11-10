var React = require('react');

var withStyles = require('@material-ui/styles').withStyles;
var Grid = require('@material-ui/core').Grid;
var Typography = require('@material-ui/core').Typography;

export interface LineItemProps {
  name: string;
  linebreak?: boolean;
}

const styles = {};

const LineItem: React.FunctionComponent<LineItemProps> = function (props) {
  return (
    <>
      <Grid
        item={true}
        xs={4}
        sm={4}
        md={4}
        style={{ whiteSpace: 'nowrap', width: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        <Typography variant="caption">{props.name}</Typography>
      </Grid>
      <Grid
        item={true}
        xs={8}
        sm={8}
        md={8}
        style={{ whiteSpace: 'nowrap', width: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {props.children}
        {props.linebreak && <div>&nbsp;</div>}
      </Grid>
    </>
  );
};

module.exports = withStyles(styles)(LineItem);
