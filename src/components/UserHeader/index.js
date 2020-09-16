import { Div, H3, Img } from '@rebelstack-io/metaflux'

const UserHeader = () => (
	Div({ className: 'user-header' }, [
		H3({}, 'Osmar Reyes'),
		Img({src: 'https://lh3.googleusercontent.com/ogw/ADGmqu-jQuI-EP_xGtN4ITW-GX3qePYsSYfusfO3y9dw=s32-c-mo'})
	])
);

export { UserHeader }
