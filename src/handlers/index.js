import { Store } from '@rebelstack-io/metaflux';
import main from './MainHandler';

const { MainDefaultState, MainHandler, MatchDefaultState } = main;

global.storage = new Store(
	{
		Main: MainDefaultState,
		Match: MatchDefaultState
	},
	MainHandler
);
