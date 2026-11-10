/// <reference types="react" />
var React = require('react');
var firebase = require('firebase');
export interface QueryMap {
    [key: string]: firebase.firestore.Query;
}
export declare function createContainer(WrappedComponent: any, queryMapFn: function (db: any) { return QueryMap; }): {
    new (props: any): {
        results: any;
        componentWillMount(): void;
        componentWillUnmount(): void;
        render(): any;
        setState<K extends string>(f: function (prevState: any, props: any) { return Pick<any; }, K>, callback?: (function () { return any; }) | undefined): void;
        setState<K extends string>(state: Pick<any, K>, callback?: (function () { return any; }) | undefined): void;
        forceUpdate(callBack?: (function () { return any; }) | undefined): void;
        props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<any>;
        state: Readonly<any>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
module.exports = createContainer;
