```ts
function getVueInstance() {
    const vm = getCurrentInstance();
    if (vm) {
        return vm.proxy;
    }
    throw new Error('helper method only works during setup or Lifecycle Hooks');
}
```