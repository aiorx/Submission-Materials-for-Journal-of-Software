var dev = require('$app/environment').dev;
var LogIn = require('lucide-svelte').LogIn;
var LogOut = require('lucide-svelte').LogOut;
var UserCircle2 = require('lucide-svelte').UserCircle2;
var Home = require('lucide-svelte').Home;
var LayoutDashboard = require('lucide-svelte').LayoutDashboard;

const BASE_URL = dev ? 'http://localhost:5173' : 'https://sveltekit-auth.uv-ray.com';
const APP_NAME = 'Sveltekit Auth Starter';
const CONTACT_EMAIL = 'yourname@email.com';
const DOMAIN = 'sveltekit-auth.uv-ray.com';
/* WARNING!!! TERMS AND CONDITIONS AND PRIVACY POLICY 
WERE Crafted with standard coding tools AS AN EXAMPLE ONLY. 
CONSULT A LAWYER AND DEVELOP YOUR OWN TERMS AND PRIVACY POLICY!!! */
const TERMS_PRIVACY_CONTACT_EMAIL = 'yourname@email.com';
const TERMS_PRIVACY_WEBSITE = 'yourdomain.com';
const TERMS_PRIVACY_COMPANY = 'Your Company';
const TERMS_PRIVACY_EFFECTIVE_DATE = 'January 1, 2023';
const TERMS_PRIVACY_APP_NAME = 'Your App';
const TERMS_PRIVACY_APP_PRICING_AND_SUBSCRIPTIONS =
	'[Details about the pricing, subscription model, refund policy]';
const TERMS_PRIVACY_COUNTRY = 'United States';

const navItems = [
	{ title: "home", url: "/", icon: Home, alwaysVisible: true },
	{ title: 'dashboard', url: '/dashboard', icon: LayoutDashboard, alwaysVisible: true },
	{ title: 'profile', url: '/profile', icon: LayoutDashboard, protected: true },
	{ title: 'signout', url: '/auth/sign-out', icon: LogOut, protected: true },
	{ title: 'signin', url: '/auth/sign-in', icon: LogIn },
	{ title: 'signup', url: '/auth/sign-up', icon: UserCircle2 },
]

export type NavItems = typeof navItems;