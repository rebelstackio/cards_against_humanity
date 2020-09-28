/* src/lib/backend/firebase/index.js */

import Auth from './auth';
import Room from './room/index';

/**
 * Get firebase reference
 */
export const init = function _init (CONFIG, next = null) {
	// Do more stuff related if required and call callback if init is async
	return firebase.initializeApp(CONFIG);
};

// Modules
export const auth = Auth;
export const room = Room;
