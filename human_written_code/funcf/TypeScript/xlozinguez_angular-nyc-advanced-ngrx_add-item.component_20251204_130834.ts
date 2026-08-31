```typescript
addItem() {
    if (this.newItem) {
        this.store.dispatch(new itemListActions.AddItemAction(this.newItem));
        this.newItem = null;
    }
}
```