```typescript
async function main() {
  const owner = process.env.MULTISIG_ADDRESS;
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  const chainId = await ethers.provider.getNetwork().then(n => n.chainId);
  const factory = await ethers.getContractFactory('Greeter');
  const instance = await upgrades.deployProxy(factory, ['Hello world', owner], { kind: 'uups' }).then(d => d.deployed());
  const implementation = await upgrades.erc1967.getImplementationAddress(instance.address);
  
  console.error(`Deployed Greeter at ${instance.address} with implementation ${implementation}`);
  writeDeploy(chainId, 'Greeter', { address: instance.address, implementation });

  if (summaryPath) {
    appendFileSync(summaryPath, `## Contract deployed\n\n- Greeter at \`${instance.address}\` with implementation \`${implementation}\``);
  }
}
```