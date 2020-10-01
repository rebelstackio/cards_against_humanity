/* src/lib/backend/firebase/room/index.spec.js */
'use strict';

import Room from './index';

describe('room', () => {
	test('createRoom reject the promise if createdBy is invalid', (done) => {
		Room.createRoom({}, null).catch((error) => {
			expect(error).toBeInstanceOf(TypeError);
			done();
		});
	});
});
