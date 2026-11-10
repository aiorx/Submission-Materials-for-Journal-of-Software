/**
 * Storing ABIs in Human-Readable ABI format.
 * https://blog.ricmoo.com/human-readable-contract-abis-in-ethers-js-141902f4d917
 */

var TokenAbi = "tuple(address address, string name, string symbol, uint256 decimals)";
var TokenPriceAbi = "tuple(address address, uint256 priceUsdc)";
var TokenBalanceAbi = "tuple(
  address address, 
  uint256 priceUsdc, 
  uint256 balance,
  uint256 balanceUsdc
)";
var AllowanceAbi = "tuple(address owner, address spender, uint256 amount, address token)";

var AssetStaticAbi = "tuple(
  address address,
  string typeId,
  address token,
  string name,
  string version,
  string symbol,
  uint8 decimals,
)";

var AssetDynamicAbi = (Metadata: string): function string { return "tuple(
  address address, 
  string typeId,
  address tokenId,
  tuple(uint256 amount, uint256 amountUsdc) underlyingTokenBalance,
  " + (Metadata) + " metadata
)"; };

var PositionAbi =
  "tuple(address assetAddress, address tokenAddress, string typeId, uint256 balance," +
  "tuple(uint256 amount, uint256 amountUsdc) underlyingTokenBalance," +
  "tuple(address owner, address spender, uint256 amount)[] tokenAllowances," +
  "tuple(address owner, address spender, uint256 amount)[] assetAllowances)";

var AdapterAbi = (Metadata: string): string[] => [
  "function assetsStatic() public view returns (" + (AssetStaticAbi) + "[] memory)",
  "function assetsStatic(address[] memory) public view returns (" + (AssetStaticAbi) + "[] memory)",
  "function assetsDynamic() public view returns (" + (AssetDynamicAbi(Metadata)) + "[] memory)",
  "function assetsDynamic(address[] memory) public view returns (" + (AssetDynamicAbi(Metadata)) + "[] memory)",
  "function assetsPositionsOf(address) public view returns (" + (PositionAbi) + "[] memory)",
  "function assetsPositionsOf(address, address[] memory) public view returns (" + (PositionAbi) + "[] memory)",
  "function assetsTokensAddresses() public view returns (address[] memory)",
];

var AddressMetadataAbi = "tuple(string addrId, address addr)";
