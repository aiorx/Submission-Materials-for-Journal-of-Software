Batch.prototype.get = function (seq) {
  if (seq < this._offset) return null
  return this._nodes[seq - this._offset]
}