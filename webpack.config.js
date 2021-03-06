const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');


module.exports = () => {
	// Call dotenv and it will return an Object with a parsed key
	const env = dotenv.config({
		path: path.resolve(process.cwd(),'.env')
	}).parsed;
	// Reduce it to a nice object, the same as before
	const envKeys = Object.keys(env).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(env[next]);
		return prev;
	}, {});
	const config = {
		entry: './src/main/index.js',
		output: {
			path: path.resolve(__dirname, 'build'),
			filename: 'cahbundle.js'
		},
		devServer: {
			contentBase: path.resolve(__dirname, 'public')
		},
		module: {
			rules: [
				{
					test: /\.(js)$/,
					exclude: /node_modules/,
					use: ['babel-loader'],
					include: [
						/\/node_modules\/@rebelstack-io\/metaflux/
					]
				},
				{
					test: /\.css$/,
					use: [ 'style-loader', 'css-loader' ]
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						// Creates `style` nodes from JS strings
						'style-loader',
						// Translates CSS into CommonJS
						'css-loader',
						// Compiles Sass to CSS
						'sass-loader',
					]
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					use: [
						'file-loader',
					]
				},
				{
					test: /\.(png|jp(e*)g|svg)$/,
					use: [{
						loader: 'url-loader',
						options: {
							limit: 8000, // Convert images < 8kb to base64 strings
							name: 'images/[hash]-[name].[ext]'
						}
					}]
				},
				{
					test: /\.(ogg|mp3|wav|mpe?g)$/i,
					use: ['file-loader']
				}
			]
		},
		resolve: {
			extensions: ['*', '.js'],
			modules: ['node_modules', 'src']
		},
		node: {
			fs: 'empty'
		},
		plugins: [
			new webpack.DefinePlugin(envKeys),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, 'public/index.html'),
				hash: false,
				filename: 'index.html',
				inject: false
			}),
			//, new CopyWebpackPlugin([
			// 	{ from: 'public/css', to: 'css' },
			// 	{ from: 'public/fonts', to: 'fonts' },
			// 	{ from: 'public/js', to: 'js' },
			// 	{ from: 'public/images', to: 'images' },
			// 	{ from: 'public/manifest.json', to: '.' },
			// ])
		],
		devtool: 'source-map'
	}
	return config;
};
