
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin  = require('uglifyjs-webpack-plugin');//用于tree shaking清理未使用的模块
const CleanWebpackPlugin = require('clean-webpack-plugin');//用于清理文件

const clearDir = new CleanWebpackPlugin(['dist']);//清空dist文件夹

module.exports = merge(common,{
	entry: {
		//ventor: ["jquery"]
	},
	devtool: 'source-map',
	plugins: [// 插件（对整个文件本身的操作，这点区别loader）
		//new UglifyJSPlugin(),//tree shaking敲出未使用模块，压缩代码
		clearDir,
	    new webpack.optimize.CommonsChunkPlugin({
	    	name: 'common', // 指定公共 bundle的名称。
	    	minChunks:2,//最小引用2次的公共代码进行打包到common中（2起）
	    }),
	    /*new webpack.optimize.CommonsChunkPlugin({
	    	name: 'ventor', 
	    	minChunks:Infinity,
	    }),*/
		new webpack.DefinePlugin({//定义全局变量
		    'process.env': {
		        NODE_ENV: '"production"',//或写成JSON.stringify('production')
		    }
		})
	],
});