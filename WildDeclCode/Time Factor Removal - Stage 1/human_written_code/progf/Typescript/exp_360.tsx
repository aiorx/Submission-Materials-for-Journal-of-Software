var _import = require('react');
var Button = require('@material-ui/core/Button');
var Typography = require('@material-ui/core/Typography');
var makeStyles = require('@material-ui/styles').makeStyles;

const useStyles = makeStyles(function () { return ({
  root: {
    background: 'linear-gradient(20deg, #FF4E00 30%, #EC9F05 90%)',
    borderRadius: '4.0rem',
    border: 0,
    color: 'white',
    height: '8.0rem',
    width: '25.0rem',
    padding: '0 30px',
    boxShadow: 'none',
    maring: '2.0rem',
  },
  label: {
    textTransform: 'capitalize',
  }
}); })

type GradientButtonProps = {
  label: string
  onClick?: function () { return void; }}

const GradientButton: FunctionComponent<GradientButtonProps> = function ({ label, onClick, children }) {
  const styles = useStyles()
  return (
    <Button 
      variant="contained"
      classes={{
        root: styles.root,
        label:styles.label
      }}
      onClick={onClick}
    >
      <Typography variant="h3">
        {label}
      </Typography>
    </Button>
  )
}
  
module.exports = GradientButton;


