const webpack = require('webpack');
const path = require('path');
const config = require('./config.js');

//将常用库打包进dll可以加快开发时的打包时间，且能减小最终的bundle的大小，加快加载速度
//注意的是：
//1、vendor需要在html中优先引入（手动或使用add-asset-html-webpack-plugin）
//2、引入后并不是就可以直接使用的，因为它们还是经过webpack打包后的，会被包含在私有作用域中，未被暴露全局变量
//仍然需要采用require('lodash')引入，但不同于未被dll打包的库的是不会被打包进bundle中
//3、打包进dll中的库，即便在不同页面的js中require过了，也就是重复的代码，也不会被commonChunkPlugin打包进common.bundle.js中
//这样就保证了common.bundle.js中的代码都是应用的公共代码，而不含库代码（如果打包进dll的话）

module.exports = {
	entry: {
		vendor: config.extraLib,
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