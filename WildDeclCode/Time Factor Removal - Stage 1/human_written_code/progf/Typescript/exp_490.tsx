var React = require('react');
var createStyles = require('@material-ui/core/styles').createStyles;
var Theme = require('@material-ui/core/styles').Theme;
var makeStyles = require('@material-ui/core/styles').makeStyles;
var green = require('@material-ui/core/colors').green;
var grey = require('@material-ui/core/colors').grey;
var red = require('@material-ui/core/colors').red;
var yellow = require('@material-ui/core/colors').yellow;
var classNames = require('classnames');

const useStyles = makeStyles(function (theme: Theme) { return createStyles({
        icon: {
            width: '1em',
            height: '1em',
            display: 'inline-block',
            marginBottom: -2,
            borderRadius: '50%',
        },
        vacancy: {
            backgroundColor: green[500]
        },
        occupied: {
            backgroundColor: red[500]
        },
        short: {
            backgroundColor: yellow[500]
        },
        disabled: {
            backgroundColor: grey[500]
        }
    }); },
)

type Props = {
    seats: number
    occupied: number
    disabled?: boolean
}

const AvailabilityIcon: React.FC<Props> = function ({ seats, occupied, disabled = false }) {
    const classes = useStyles();
    const percentage = occupied / seats;

    return (
       <span className={classNames(classes.icon, {
           [classes.disabled]: disabled,
           [classes.vacancy]: percentage <= 0.8 && !disabled,
           [classes.short]: percentage > 0.8 && percentage < 1 && !disabled,
           [classes.occupied]: percentage === 1 && !disabled,
       })}></span>
    )
}

module.exports = AvailabilityIcon;
