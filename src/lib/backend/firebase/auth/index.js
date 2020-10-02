/* src/lib/backend/firebase/auth/index.js */

/**
 *
 * @param {*} auth
 */
const singInWithGoogle = function _singInWithGoogle( auth = firebase.auth() ) {
	return auth.singInWithGoogle;
};

/**
 *
 * @param {*} auth
 */
const signOut = function _signOut( auth = firebase.auth() ) {
	return auth.signOut()
};

/**
 *
 * @param {*} auth
 * @param {*} next
 */
const onAuthStateChanged = function _onAuthStateChanged( next,  auth = firebase.auth()) {
	auth.onAuthStateChanged(next);
};

export {
	singInWithGoogle,
	signOut,
	onAuthStateChanged
};
