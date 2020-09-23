import { DBController } from './db';

var firebaseConfig = {
	apiKey: process.env.APIKEY,
	authDomain: process.env.AUTHDOMAIN,
	databaseURL: process.env.DATABASEURL,
	projectId: process.env.PROJECTID,
	storageBucket: process.env.STORAGEBUCKET,
	messagingSenderId: process.env.MESSAGINGSENDERID,
	appId: process.env.APPID,
	measurementId: process.env.MEASUREMENTID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
firebase.analytics();
let provider = new firebase.auth.GoogleAuthProvider();
//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const _store = global.storage;

const auth = firebase.auth();


/** ------------------DATABASE-------------------  */
const DB = new DBController(db, _store);
DB.init();


function singInWithGoogle() {
	firebase.auth().signInWithPopup(provider).catch(function(error) {
		//TODO: Handle Errors here.
	});
}

firebase.auth().onAuthStateChanged(function (user) {
	let _user = {};
	if(user) {
		const { displayName, email, uid, photoURL } = user;
		_user = { displayName, email, uid, photoURL }
		DB.getRooms();
	}
	_store.dispatch({ type: 'AUTH_CHANGE', user: _user })
});

_store.on('LOGOUT', () => {
	firebase.auth().signOut();
});

export { singInWithGoogle }
