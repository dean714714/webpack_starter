const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: {
		vendor: ['jquery','lodash'],
	},
	output: {
		filename: './assets/lib/[name].js',
		path: path.resolve(__dirname, 'dist'),
		library: '[name]', //当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
	},
	plugins: [
		new webpack.DllPlugin({
			path: path.resolve(__dirname, './manifest.json'), // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
			name: '[name]',
			context: __dirname,
		}),
	],
}