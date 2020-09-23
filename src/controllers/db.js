class DBController {
	constructor(db, store) {
		this.db = db;
		this.store = store;
	}
	init() {
		this._handleStoreEvents();
	}

	_handleStoreEvents() {
		this.store.on('CREATE_NEW_GAME', (action) => {
			const { data } = action;
			const { user } = this.store.getState().Main;
			console.log(data);
			db.collection('/rooms/').doc(user.uid).set({
				isActive: true,
				name: data.name,
				owner: user.displayName,
				password: data.password,
				winningScore: data.winningScore
			}).then(() => {
				console.log('document added')
				this.store.dispatch({ type: 'LOADING_OFF' });
				this.store.dispatch({ type: 'JOIN_GAME', matchId: user.uid })
			})
			.catch((err) => {
				console.error('fail:', err)
			})
		});
	}

	getRooms () {
		let ref = this.db.collection('/rooms/');
		ref.get().then((coll) => {
			let list = {};
			coll.forEach((doc) => {
				list[doc.id] = doc.data();
			});
			this.store.dispatch({ type: 'ROOMS_LIST', list })
		})
		.catch(err => {
			console.error('Error. Lobby list:', err)
		})
	}

}

export { DBController }
