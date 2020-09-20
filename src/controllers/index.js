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
		_getRooms();
	}
	_store.dispatch({ type: 'AUTH_CHANGE', user: _user })
});

_store.on('CREATE_NEW_GAME', (action) => {
	const { data } = action;
	const { user } = _store.getState();
	db.collection('/rooms/').doc(user.uid).set({
		isActive: true,
		name: data.name,
		owner: user.displayName,
		password: data.password,
		winnigScore: data.winnigScore
	}).then(() => {
		console.log('document added')
		_store.dispatch({ type: 'LOADING_OFF' });
		_store.dispatch({ type: 'JOIN_GAME', matchId: user.uid })
	})
	.catch((err) => {
		console.error('fail:', err)
	})
})

function _getRooms () {
	let ref = db.collection('/rooms/');
	ref.get().then((coll) => {
		let list = {};
		coll.forEach((doc) => {
			list[doc.id] = doc.data();
		});
		_store.dispatch({ type: 'ROOMS_LIST', list })
	})
	.catch(err => {
		console.error('Error. Lobby list:', err)
	})
}

_store.on('LOGOUT', () => {
	firebase.auth().signOut();
});

export { singInWithGoogle }
