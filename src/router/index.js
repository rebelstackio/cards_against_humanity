/**
 * @description Run callback on url change
 * @param {object} match - string or regex
 * @param {*} callback - callback to be run when url matches "match" param
 */
function onUrlChange ( match, callback ) {

	const currentUrl = this.getUrl();
	const currentParams = this.getParams();

	const isRegexp = ( typeof match === 'object' );
	const isString = ( typeof match === 'string' );

	if (
		( isRegexp && match.test( currentUrl ) ) ||
		( isString && match.match( currentUrl ) )
	) {

		callback( currentParams );

	}

	return this;

}

/**
 * @description Returns url after hash
 */
function getUrl () {
	return (window.location.hash).substr(1)
}

/**
 * @description returns url parametters in object
 */
function getParams () {
	const paramArray = this.getUrl().match(/(\w+)=?(\w+)/g);

	if ( !paramArray ) {
		return null
	}

	return paramArray.map(chunk => {
		let mappedParam = {};
		const param = chunk.split('=');

		mappedParam[param[0]] = param.length === 2 ? param[1] : null

		return mappedParam;
	});
}

/**
 * @description Change url after hash
 * @param {string} url
 */
function goToUrl ( url ) {
	window.location.hash = `#${url}`;
}

function addCallback ( match, callback ) {

	const that = this;

	this.callStack.push({
		id: match,
		callback: () => {
			that.onUrlChange( match, callback );
		}
	});

}

/**
 * @description Simple router
 */
function Router () {

	this.callStack = [];

	this.getUrl = getUrl.bind( this );
	this.getParams = getParams.bind( this );
	this.onUrlChange = onUrlChange.bind( this );
	this.addCallback = addCallback.bind ( this );

	this.on = function ( match, callback ) {
		this.addCallback( match, callback );
		this.onUrlChange( match, callback );
		return this;
	}
	this.on = this.on.bind( this );

	this.go = goToUrl.bind( this );

	window.onhashchange = function () {
		this.callStack.forEach( item => item.callback() );
	}
	window.onhashchange = window.onhashchange.bind( this );

}

export default Router;