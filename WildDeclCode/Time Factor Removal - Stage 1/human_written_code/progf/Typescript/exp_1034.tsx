var React = require('react');
var styled = require('styled-components');
var Dropdown = require('../components/Dropdown');
var IChainData = require('../helpers/types').IChainData;
var ellipseAddress = require('../helpers/utilities').ellipseAddress;
var getViewportDimensions = require('../helpers/utilities').getViewportDimensions;
var responsive = require('../styles').responsive;
var Blockie = require('./Blockie');

const SSection = styled.div"
  width: 100%;
";

const SBlockie = styled(Blockie)"
  margin-right: 5px;
  @media screen and (" + (responsive.xs.max) + ") {
    margin-right: 1vw;
  }
";

const SAddressDropdownWrapper = styled.div"
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
";

interface IAccountDetailsProps {
  chains: IChainData[];
  updateAddress?: any;
  updateChain?: any;
  accounts: string[];
  activeIndex: number;
  address: string;
  chainId: number;
}

const AccountDetails = function (props: IAccountDetailsProps) {
  var chains = props.chains;
var chainId = props.chainId;
var address = props.address;
var activeIndex = props.activeIndex;
var accounts = props.accounts;
var updateAddress = props.updateAddress;
var updateChain = props.updateChain;
  const windowWidth = getViewportDimensions().x;
  const maxWidth = 468;
  const maxChar = 12;
  const ellipseLength =
    windowWidth > maxWidth ? maxChar : Math.floor(windowWidth * (maxChar / maxWidth));
  const accountsMap = accounts.map((addr: string, index: number) => ({
    index,
    display_address: ellipseAddress(addr, ellipseLength),
  }));
  return (
    <React.Fragment>
      <SSection>
        <h6>{"Account"}</h6>
        <SAddressDropdownWrapper>
          <SBlockie size={40} address={address} />
          <Dropdown
            monospace
            selected={activeIndex}
            options={accountsMap}
            displayKey={"display_address"}
            targetKey={"index"}
            onChange={updateAddress}
          />
        </SAddressDropdownWrapper>
      </SSection>
      <SSection>
        <h6>{"Network"}</h6>
        <Dropdown
          selected={chainId}
          options={chains}
          displayKey={"name"}
          targetKey={"chain_id"}
          onChange={updateChain}
        />
      </SSection>
    </React.Fragment>
  );
};
module.exports = AccountDetails;
