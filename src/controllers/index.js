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
const app = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
firebase.analytics();
let provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const auth = firebase.auth();


function singInWithGoogle() {
	firebase.auth().signInWithPopup(provider).catch(function(error) {
		//TODO: Handle Errors here.
	});
}

firebase.auth().onAuthStateChanged(function (user) {
	let _user = {};
	if(user) {
		//console.log(user);
		const { displayName, email, uid, photoURL } = user;
		_user = { displayName, email, uid, photoURL }
	}
	global.storage.dispatch({ type: 'AUTH_CHANGE', user: _user })
});

global.storage.on('LOBBY_CREATED', () => {
	const { lobby, user } = global.storage.getState();
	const password = document.querySelector('.lobby-new > input');
	db.collection('/rooms/').doc(user.uid).set({
		connection_str: lobby,
		name: user.displayName,
		password: password.value === '' ? false : password.value
	}).then(() => {
		console.log('document added')
	})
	.catch((err) => {
		console.error('fail:', err)
	})
})

let ref = db.collection('/rooms/');
ref.get().then((coll) => {
	let list = {};
	coll.forEach((doc) => {
		list[doc.id] = doc.data();
	});
	console.log(list);
	global.storage.dispatch({ type: 'LOBBY_LIST_LOADED', list })
})
.catch(err => {
	console.error('Error. Lobby list:', err)
})

global.storage.on('LOGOUT', () => {
	firebase.auth().signOut();
});

export { singInWithGoogle }
