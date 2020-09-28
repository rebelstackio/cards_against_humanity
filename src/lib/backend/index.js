/* src/lib/firebaseFacade/index.js */

const FIREBASE_CONFIG = {
	apiKey: process.env.APIKEY,
	authDomain: process.env.AUTHDOMAIN,
	databaseURL: process.env.DATABASEURL,
	projectId: process.env.PROJECTID,
	storageBucket: process.env.STORAGEBUCKET,
	messagingSenderId: process.env.MESSAGINGSENDERID,
	appId: process.env.APPID,
	measurementId: process.env.MEASUREMENTID
};

/**
 * Get firebase reference
 */
const initFirebase = function _initFirebase(){
	firebase.initFirebaseializeApp(FIREBASE_CONFIG);
	return firebase;
};


module.exports = {
	initFirebase
};
