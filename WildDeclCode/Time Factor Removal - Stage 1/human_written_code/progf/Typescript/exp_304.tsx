var React = require('react');
var Typography = require('@material-ui/core').Typography;
var IconButton = require('@material-ui/core').IconButton;
var Grid = require('@material-ui/core').Grid;
var useTranslation = require('react-i18next').useTranslation;
var TxList = require('../TxList');
var ArrowBackIos = require('@material-ui/icons').ArrowBackIos;
var ArrowForwardIos = require('@material-ui/icons').ArrowForwardIos;
var Transaction = require('@etclabscore/ethereum-json-rpc').Transaction;

export interface IProps {
  transactions: Transaction[];
  from: number;
  to: number;
  disableNext?: boolean;
  disablePrev?: boolean;
  onNext?: function () { return void; };
  onPrev?: function () { return void; };
  style?: any;
}

const AddressTransactions: React.FC<IProps> = function (props) {
  var t = useTranslation.t;();
  return (
    <div style={props.style}>
      <Grid container justify="flex-end">
        <IconButton onClick={props.onPrev} disabled={props.disablePrev}>
          <ArrowBackIos />
        </IconButton>
        <IconButton onClick={props.onNext} disabled={props.disableNext}>
          <ArrowForwardIos />
        </IconButton>
      </Grid>
      <Grid container justify="flex-end">
        <Typography>Showing block range: {props.to} - {props.from}</Typography>
      </Grid>
      <TxList transactions={props.transactions || []} showBlockNumber={true}></TxList>
      {(!props.transactions || props.transactions.length === 0) &&
        <Grid container style={{ padding: "15px" }}>
          <Typography>{t("No Transactions for this block range.")}</Typography>
        </Grid>
      }
    </div>
  );
};

module.exports = AddressTransactions;
