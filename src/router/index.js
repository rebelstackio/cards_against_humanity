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
 * @description Simple router
 */
function Router () {

	this.getUrl = getUrl.bind( this );
	this.getParams = getParams.bind( this );
	this.on = onUrlChange.bind( this );

}

export default Router;