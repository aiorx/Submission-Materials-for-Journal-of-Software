var Observable = require('@nativescript/core').Observable;
var getSignInWithAppleState = require('nativescript-apple-sign-in').getSignInWithAppleState;
var isSignInWithAppleSupported = require('nativescript-apple-sign-in').isSignInWithAppleSupported;
var signInWithApple = require('nativescript-apple-sign-in').signInWithApple;
var SignInWithAppleAuthorization = require('nativescript-apple-sign-in').SignInWithAppleAuthorization;

class HomeViewModel extends Observable {

    private user: string;

    isSupported(): void {
        console.log(isSignInWithAppleSupported() ? "YES" : "NO");
    }

    getSignInState(): void {
        getSignInWithAppleState(this.user)
            .then(function state { return console.log("Sign in state: " + state); })
            .catch(function err { return console.log("Error getting sign in state: " + err); });
    }

    signIn(): void {
        signInWithApple(
            {
                scopes: ["EMAIL", "FULLNAME"]
            })
            .then(function (result: SignInWithAppleAuthorization) {
                console.log("Signed in, credential: " + JSON.stringify(result.credential));
                console.log("Signed in, familyName: " + result.credential.fullName.familyName);
                console.log("Signed in, user (id): " + result.credential.user);
                console.log("Signed in, provider: " + result.provider);
                this.user = result.credential.user;
            })
            .catch(function err { return console.log("Error signing in: " + err); });
    }
}
