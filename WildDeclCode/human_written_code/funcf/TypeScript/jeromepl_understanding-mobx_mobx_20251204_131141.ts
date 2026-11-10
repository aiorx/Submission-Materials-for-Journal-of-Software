```typescript
function triggerDerivations(derivations: Set<Derivation>) {
    if (inTransaction) {
        for (let derivation of derivations) derivationsDuringTransaction.add(derivation);
        return;
    }

    // Mark any accessed derivation as stale
    for (let derivation of derivations) derivation.markStale();
    // Then send 'ready' notifications to all derivations once a depencency has finished evaluating
    // A derivation is always re-evaluated when it is triggered in order to update its Observable dependencies
    for (let derivation of derivations) derivation.sendReady(true);
}
```