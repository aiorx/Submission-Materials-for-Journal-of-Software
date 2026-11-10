var React = require('react');
export declare type IProps = {
    captchaDomain: string;
    onReceiveToken: function (captchaToken: string) { return void; };
    siteKey: string;
    action: string;
};
export declare type IState = {};
declare class ReCaptchaV3 extends React.PureComponent<IProps, IState> {
    private _captchaRef;
    refreshToken: function () { return void; };
    render(): JSX.Element;
}
module.exports = ReCaptchaV3;
