
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common,{
	plugins: [
		new webpack.DefinePlugin({//定义全局变量
		    'process.env': {
		        NODE_ENV: '"development"',//或写成JSON.stringify('development')
		    }
		})
	],
	devtool: 'inline-source-map',
	devServer: {//我们在这里对webpack-dev-server进行配置
		contentBase: path.join(__dirname, "/dist/"),
		historyApiFallback:true,
		inline: true,
		//hot: true,//加上这个发现webpack-dev-server将不起作用
		//noInfo: false,
		port:8080
	}
});