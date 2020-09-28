/* src/lib/backend/firebase/index.js */

import Auth from './auth';

/**
 * Get firebase reference
 */
export const init = function _init (CONFIG) {
	return firebase.initializeApp(CONFIG);
};

// Modules
export const auth = Auth;
