//插件需要引入而loader安装即可不用手动require
const path = require('path');
const glob = require('glob');//获取匹配文件路径
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');//提取dundle中的内容单独生成一个文件
const HtmlWebpackPlugin = require('html-webpack-plugin');//用于创建html文件
const CleanWebpackPlugin = require('clean-webpack-plugin');//用于清理文件
const UglifyJSPlugin  = require('uglifyjs-webpack-plugin');//用于tree shaking清理未使用的模块

function getEntry(globPath, pathDir) {//获取入口文件
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;
    for (var i = 0; i < files.length; i++) {
        entry = files[i].replace('.html', '.js');
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.join(dirname, basename);
        pathname = pathDir ? pathname.replace(pathDir, '') : pathname;
        //console.log(2, pathname, entry);
        entries[basename] = './' + entry;
    }
    return entries;
}


const extractSass = new ExtractTextPlugin({//提取css至单独文件
    filename: "[name].css",//"[name].[contenthash].css",//包含contenthash 哈希值
    disable: process.env.NODE_ENV === "development"//开发环境不用打包成单独css文件
});

const clearDir = new CleanWebpackPlugin(['dist']);//清空dist文件夹

const options = {
	entry: getEntry('src/**/*.html','src'),
//	{//入口
//		index: './src/pages/index/index.js',
//		about: './src/pages/about/about.js',
//		intro: './src/pages/intro/intro.js'
//	},
	output: {//出口
		filename: '[name].bundle.js',//多个入口就多个出口文件，文件名是入口属性名（而不是入口文件名）。[name]表示占位符，还有[id],[hash]之类的
		path: path.resolve(__dirname,'dist'),
		publicPath: '',
		//libraryTarget: "umd"
	},
	module: {//loader（对文件内容的解析）
		rules: [
			{
				test: /\.scss$/,
				use: extractSass.extract({//提取
					use: [
						{// 将 CSS 转化成 CommonJS 模块
							loader: 'css-loader',
							options: {
								sourceMap: true
							}
						},		
						{// 将 Sass 编译成 CSS
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						},	
					],
					fallback: "style-loader" // 将 JS 字符串生成为 style节点(开发环境使用而不是提取成一个单独文件)
				})
			},
			{
				test:	/\.(png|svg|jpg|gif)$/,
				use: [//图片打包
//					'file-loader',
//					{//图片压缩
//				    	loader: 'image-webpack-loader',
//				    	options: {
//				    		bypassOnDebug: true,
//				    	}
//				    }
					{
						loader: 'url-loader',
			            options: {
			            	limit: 8192//低于8KB，用base64展示
			            }
					}
				]
			},
			{
				test:	/\.(woff|woff2|eot|ttf|otf)$/,
				use: [//字体打包
					'file-loader'
				]
			},
//			{
////				test:	(function(){//排除入口js,不然会把入口js也作为一个单独文件打包到dist中
////					const htmls = getEntry('src/**/*.html','src');
////					let str = "";
////					for(var key in htmls){
////						str = str+key+'|';
////					}
////					str = str.replace(/\|$/,'');//删除最后一个|
////					//console.log(str)
////					return new RegExp('[^'+str+']\.js$');
////				})(),
//				test: /ajax\.js/,
//				use: [//直接引入的js打包
//					{
//						loader: 'file-loader',
//						options: {
//							name: '[name].[ext]'//默认文件名为hash值
//						}
//					}
//				]
//			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',//针对html文件中的链接地址如图片
						//query: 'interpolate',
						options: {
					    	minimize: false,//html文件是否进行压缩
					    	removeComments: false,//移除注释
        					collapseWhitespace: false,//去除空格
					    	attrs: [//指定哪些标签：属性组合需要被处理，默认attrs=img:src，禁用可设为false
					    		'img:src',
					    		'script:src',
					    		'link:href'
					    	],
					    }
					}
				]
			}
		]
	},
	plugins: [// 插件（对整个文件本身的操作，这点区别loader）
//		new webpack.DefinePlugin({//定义全局变量
//		    'process.env': {
//		        NODE_ENV: '"development"',//或写成JSON.stringify('development')
//		    }
//		}),
		clearDir,
		extractSass,
//		new webpack.optimize.CommonsChunkPlugin({//分离重复代码到公用bundle
//	       	name: 'common' // 指定公共 bundle 的名称。
//	    }),
		//new UglifyJSPlugin(),//tree shaking
		new webpack.NamedModulesPlugin(),//模块热替换中使用，以便更容易查看要修补(patch)的依赖
		new webpack.HotModuleReplacementPlugin()//模块热替换
	],
	externals: {
		//ajax: "getData",
		//jquery: "jQuery"
	},
	devtool: 'inline-source-map',
	devServer: {//我们在这里对webpack-dev-server进行配置
		contentBase: path.join(__dirname, "/dist/"),
		historyApiFallback:true,
		inline: true,
		//hot: true,//加上这个发现webpack-dev-server将不起作用
		//noInfo: false,
		port:8080
	}
}

;(function(){//获取每个src中的html的路径并将其作为模板初始化各自的HtmlWebpackPlugin实例
	const htmls = getEntry('src/**/*.html','src');
	let HtmlPlugin = options.plugins;
	for (let key in htmls) {
		htmls[key] = htmls[key].replace('.js', '.html');
		HtmlPlugin.push(new HtmlWebpackPlugin({
			filename:  __dirname+'/dist/'+key + '.html',//文件名称
			template: htmls[key],//创建使用的模板（原html文件）
			inject: true,
			chunks: [key]
		}));
	};
	options.plugins = HtmlPlugin;
})();

module.exports = options;