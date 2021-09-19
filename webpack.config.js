const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const bundlePath = __dirname + "/assets/";

module.exports = {
	entry: {
		main: "./src/js/index.js",
	},
	output: {
		path: bundlePath,
		filename: "js/[name]-[contenthash:3].js",
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				}
			},
			{
				test: /\.(sa|sc|c)ss$/,

				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "sass-loader",
						options: {
							implementation: require("sass")
						}
					}
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							emitFile: false,
							publicPath: (url, resourcePath, context) => {
								console.log(`------ ${url}`);
								const cssBundleDir = bundlePath + 'css/';
								const fileBundleDir = path.dirname(resourcePath);
								const relativeFileDir = path.relative(cssBundleDir, fileBundleDir);

								// resolves file relative path
								// return the new relative file path (works for images and files)
								return path.join(relativeFileDir, path.basename(resourcePath));
							}
						},
					},
				],
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [],
			cleanAfterEveryBuildPatterns: [
				'**/main-*',
			]
		}),
		new BundleTracker({
			indent: '\t',
			filename: './webpack-stats.json'
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name]-[contenthash:3].css"
		})
	],
};