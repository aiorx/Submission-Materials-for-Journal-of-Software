```js
function processDelegations(callback) {
  var delegations = [];

  // Go through the delegation transactions from oldest to newest to find the final delegated amount from each account
  delegation_transactions.reverse();

  for(var i = 0; i < delegation_transactions.length; i++) {
    var trans = delegation_transactions[i];

    // Check if this is a new delegation or an update to an existing delegation from this account
    var delegation = delegations.find(d => d.delegator == trans.data.delegator);

    if(delegation) {
      delegation.vesting_shares = trans.data.vesting_shares;
    } else {
      delegations.push({ delegator: trans.data.delegator, vesting_shares: trans.data.vesting_shares });
    }
  }

  delegation_transactions = [];

  // Return a list of all delegations (and filter out any that are 0)
  if(callback)
    callback(delegations.filter(function(d) { return parseFloat(d.vesting_shares) > 0; }));
}
```