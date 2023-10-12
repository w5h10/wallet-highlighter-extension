const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		contentScript: './src/lib/content/index.ts',
		background: './src/lib/background.ts'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'build'),
		sourceMapFilename: '[file].map[query]'
	},
	target: 'web',
	resolve: {
		extensions: ['.js', '.ts'],
		alias: {
			$lib: path.resolve(__dirname, 'src/lib')
		}
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-typescript']
					}
				}
			},
			{
				// look for .css or .scss files
				test: /\.(css|scss)$/,
				// in the `src` directory
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					}
				]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			process: 'process/browser',
			Buffer: ['buffer', 'Buffer']
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'src/lib/content/content.styles.css',
					to: path.join(__dirname, 'build'),
					force: true
				},
				{
					from: 'src/lib/assets/**/*',
					to: path.join(__dirname, 'build', '[name][ext]'),
					force: true
				}
			]
		})
	]
};
