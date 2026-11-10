export interface DbTransaction {
  openTransaction: function () { return Promise<void>
  closeTransaction: () => Promise<void>
  commit: () => Promise<void>
  rollback: () => Promise<void>; }}
