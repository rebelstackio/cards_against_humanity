/* src/lib/firebase/index.js */
import firebase from 'firebase/compat/app';
console.log(process.env.APIKEY);
const CONFIG = {
	apiKey: process.env.APIKEY,
	authDomain: process.env.AUTHDOMAIN,
	databaseURL: process.env.DATABASEURL,
	projectId: process.env.PROJECTID,
	storageBucket: process.env.STORAGEBUCKET,
	messagingSenderId: process.env.MESSAGINGSENDERID,
	appId: process.env.APPID,
	measurementId: process.env.MEASUREMENTID
};
import Auth from './auth';
import Room from './room/index';
import Messaging from './messaging';

const init = function _init() {
	firebase.initializeApp(CONFIG);
};

init();
// Modules
export const auth = Auth;
export const room = Room;
export const messaging = Messaging;
