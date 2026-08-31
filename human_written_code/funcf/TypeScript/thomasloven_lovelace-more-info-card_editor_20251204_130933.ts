```javascript
_valueChanged(ev) {
  if (!this._config) return;
  this._config = { ...this._config, entity: ev.target.value };
  this.dispatchEvent(
    new CustomEvent("config-changed", { detail: { config: this._config } })
  );
}
```