/* src/lib/backend/firebase/deck/index.spec.js */
'use strict';

import Deck from './index';

describe('Decks', () => {
	test('getDecks resolve a promise with a firebase collection if the are not problems with the request', (done) => {
		const dbMock = {
			collection: () => {
				return {
					get: () => Promise.resolve([ { _id: 'base '}])
				}
			}
		};
		Deck.getDecks(dbMock).then((decks) => {
			expect(decks).not.toBe(null);
			expect(decks).toBeArrayOfSize(1),
			done()
		});
	});

	test('getDecks rejects a promise if the are problems with the request', (done) => {
		const dbMock = {
			collection: () => {
				return {
					get: () => Promise.reject(new Error('cannot get the decks!'))
				}
			}
		};
		Deck.getDecks(dbMock).catch((err) => {
			expect(err).toBeInstanceOf(Error);
			done()
		});
	});
});
