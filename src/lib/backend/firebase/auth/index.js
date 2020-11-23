/* src/lib/backend/firebase/auth/index.js */

/**
 * Sign in with google provider
 * @param {object} auth Auth object
 */
const singInWithGoogle = function _singInWithGoogle( auth = firebase.auth() ) {
	const provider = new firebase.auth.GoogleAuthProvider();
	return auth.signInWithPopup(provider);
};

const singInWithFacebook = function _signInWithFacebook( auth = firebase.auth() ) {
	const provider = new firebase.auth.FacebookAuthProvider();
	return auth.signInWithPopup(provider);
}

/**
 * SignOut
 * @param {object} auth Auth object
 */
const signOut = function _signOut( auth = firebase.auth() ) {
	return auth.signOut()
};

/**
 * Event - Runs the next callbacks when the auth changes
 * @param {function} next Event callback
 * @param {object} auth Auth object
 */
const onAuthStateChanged = function _onAuthStateChanged( next,  auth = firebase.auth()) {
	auth.onAuthStateChanged(next);
};

export {
	singInWithGoogle,
	signOut,
	onAuthStateChanged,
	singInWithFacebook
};
