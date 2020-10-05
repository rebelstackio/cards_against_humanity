/* src/lib/backend/index.js */

import { init, auth, messaging } from './firebase';

const FIREBASE_BACKEND = 'FIREBASE';

let _backendRef = null;

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

/**
 * Get the backend reference for future use
 * @param {string} _type Backend type. Default to FIREBASE
 */
const getBackend = function _getBackend (_type = FIREBASE_BACKEND) {
	// TODO: Add more backend if required
	if (!_backendRef) {
		_backendRef = init(CONFIG);
	}

	return { auth, messaging };
};

export {
	getBackend
};
