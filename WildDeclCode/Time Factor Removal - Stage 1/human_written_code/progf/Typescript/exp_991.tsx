import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core"
var createStyles = require('@material-ui/core/styles').createStyles;
var makeStyles = require('@material-ui/core/styles').makeStyles;
var Theme = require('@material-ui/core/styles').Theme;
var Link = require('next/link');
var React = require('react');

const useStyles = makeStyles(function (theme: Theme) { return createStyles({
    root: {},
    anchorLink: {
      width: "100%",
      textDecoration: "none",
    },
    listItemPrimary: {
      color: theme.palette.primary.contrastText,
      fontWeight: "bold",
      fontSize: "20px",
    },
    listItemSecondary: {
      color: theme.palette.primary.contrastText,
    },
  }); })

type Props = {
  /**
   * <Link href="/">
   */
  href: string
  /**
   * <ListItemText primary="redux"/>
   */
  primary: React.ReactNode
  /**
   * <ListItemText secondary="description"/>
   */
  secondary?: React.ReactNode
  /**
   * List item icon
   */
  icon: JSX.Element
  /**
   * class
   */
  className?: string
  /**
   * onClick event
   */
  onClick?: function (event: React.MouseEvent<HTMLElement>) { return void; }}

/**
 * Next.js optimized <ListItem>
 * @param props Props
 */
const NextListItem = function (props: Props) {
  var className = props.className;
var href = props.href;
var icon = props.icon;
var primary = props.primary;
var secondary = props.secondary;
var onClick = props.onClick;const classes = useStyles(props)
  const AvatorIcon = function () { return icon
  return (
    <Link href={href}>
      <a className={classes.anchorLink} onClick={onClick}>
        <ListItem alignItems="center" divider={true} className={className}>
          <ListItemAvatar>
            <Avatar>
              <AvatorIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<span className={classes.listItemPrimary}>{primary}</span>}
            secondary={
              <span className={classes.listItemSecondary}>{secondary}</span>
            }
          />
        </ListItem>
      </a>
    </Link>
  ); }}
