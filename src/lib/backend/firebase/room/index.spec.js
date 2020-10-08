/* src/lib/backend/firebase/deck/index.spec.js */
'use strict';

import Room from './index';

let dbMock = {
	collection: () => {
		return {
			get: () => Promise.resolve([ { _id: 'base '}]),
			doc: (  ) => {
				return  {
					set: (docRef) => Promise.resolve(docRef),
					delete: () => Promise.resolve()
				}
			}
		}
	}
};

let timeMock = {
	now: () =>  +new Date()
};

describe('Room', () => {

	describe('createRoom', () => {
		test('createRoom must reject the promise if there is not a name property in the room props', ( done ) => {
			Room.createRoom({}, dbMock, timeMock).catch((err) => {
				expect(err).toBeInstanceOf(TypeError);
				done();
			});
		});

		test('createRoom must reject the promise if there is not a deck property in the room props', ( done ) => {
			Room.createRoom({ name: 'testroom'}, dbMock, timeMock).catch((err) => {
				expect(err).toBeInstanceOf(TypeError);
				done();
			});
		});

		test('createRoom must reject the promise if there is not a createdBy property in the room props', ( done ) => {
			Room.createRoom({ name: 'testroom', deck: '123456'}, dbMock, timeMock).catch((err) => {
				expect(err).toBeInstanceOf(TypeError);
				done();
			});
		});

		test('createRoom must set password as null by default( public room )', ( done ) => {
			Room.createRoom({ name: 'testroom', deck: '123456', createdBy: 'jegj' }, dbMock, timeMock).then((docRef) => {
				expect(docRef).toHaveProperty('password', null);
				done();
			});
		});

		test('createRoom must set size as 10 by default( 10 players )', ( done ) => {
			Room.createRoom({ name: 'testroom', deck: '123456', createdBy: 'jegj' }, dbMock, timeMock).then((docRef) => {
				expect(docRef).toHaveProperty('size', 10);
				done();
			});
		});

		test('createRoom must set status as W by default( waiting for other players )', ( done ) => {
			Room.createRoom({ name: 'testroom', deck: '123456', createdBy: 'jegj' }, dbMock, timeMock).then((docRef) => {
				expect(docRef).toHaveProperty('status', Room.STATUS.WAITING);
				done();
			});
		});

		test('createRoom must set nplayers as 0 by default( waiting for other players )', ( done ) => {
			Room.createRoom({ name: 'testroom', deck: '123456', createdBy: 'jegj' }, dbMock, timeMock).then((docRef) => {
				expect(docRef).toHaveProperty('nplayers', 0);
				done();
			});
		});

		test('createRoom must set created as a timestamp based on firebase backend', ( done ) => {
			Room.createRoom({ name: 'testroom', deck: '123456', createdBy: 'jegj' }, dbMock, timeMock).then((docRef) => {
				expect(docRef).toHaveProperty('created', );
				done();
			});
		});

		test('createRoom must reject the promise if there was a problem with firebase', ( done ) => {
			let dbMock = {
				collection: () => {
					return {
						doc: (  ) => {
							return  {
								set: (docRef) => Promise.reject(new Error('firebase down!'))
							}
						}
					}
				}
			};
			Room.createRoom({ name: 'testroom', deck: '123456', createdBy: 'jegj' }, dbMock, timeMock).catch((err) => {
				expect(err).toBeInstanceOf(Error);
				done();
			});
		});
	});

	describe('deleteRoom', () => {
		test('deleteRoom must reject the promise if there is not a roomId parameter', ( done ) => {
			Room.deleteRoom( null , dbMock).catch((err) => {
				expect(err).toBeInstanceOf(TypeError);
				done();
			});
		});

		test('deleteRoom must resolve the promise if the document was deleted correctly', ( done ) => {
			Room.deleteRoom( 1234 , dbMock).then(() => {
				done();
			});
		});
	});

});
