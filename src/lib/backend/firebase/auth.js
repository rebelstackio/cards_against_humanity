/* src/lib/backend/firebase/auth.js */

const GOOGLE_PROVIDER = 'GOOGLE_PROVIDER';

/**
 * SignIn with a target provider
 * @param {object} provider Firebase Auth Provider
 */
const signInWithPopup = function _signInWithPopup (provider) {
	return firebase.auth().signInWithPopup(provider)
};

/**
 * SignOut
 * @returns Promise
 */
const signOut = function _signOut () {
	return firebase.auth().signOut();
}

/**
 * Get a target Auth provider
 * @param {string} providerType Default to GOOGLE_PROVIDER
 */
const getProvider = function _getFirebaseProvider (providerType = GOOGLE_PROVIDER) {
	let provider;
	switch (providerType) {
	case GOOGLE_PROVIDER:
	default:
		provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
	}
	return provider;
};

/**
 * SignIn with Google Provider
 */
const singInWithGoogle = function _singInWithGoogle () {
	return signInWithPopup(getProvider(GOOGLE_PROVIDER));
};

/**
 * Event when the auth state changed
 */
const onAuthStateChanged = function _onAuthStateChanged (next) {
	return firebase.auth().onAuthStateChanged(next);
};

export default {
	signInWithPopup,
	signOut,
	getProvider,
	onAuthStateChanged,
	singInWithGoogle
};
