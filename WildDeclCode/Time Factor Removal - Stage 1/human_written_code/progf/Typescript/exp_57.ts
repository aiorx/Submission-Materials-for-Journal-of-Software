export interface IAssertionHelper {
    (fn: function (req, res) { return void; }): void;
    toBoolean(fn: Function): any;
}
declare const _default: IAssertionHelper;
module.exports = _default;
