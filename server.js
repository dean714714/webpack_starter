const merge = require('webpack-merge');
const path = require('path');

const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
let config = require('./webpack.dev.js');
config = merge(config,{
	plugins: [
		new webpack.NamedModulesPlugin(),//模块热替换中使用，以便更容易查看要修补(patch)的依赖
		new webpack.HotModuleReplacementPlugin()//模块热替换
	],
//	devServer: {//我们在这里对webpack-dev-server进行配置
//		contentBase: path.join(__dirname, "/dist/"),
//		historyApiFallback:true,
//		inline: true,
//		hot: true,
//		noInfo: true,
//		port:8080
//	}
})
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler,{
	publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.get("*", (req, res, next) =>{
    const filename = path.join('path.join(__dirname, "/dist/")', 'index.html');

    compiler.outputFileSystem.readFile(filename, (err, result) =>{
        if(err){
            return(next(err))
        }
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
    })
})

app.listen(9000,function(){
	console.log("App listening on port 9000");
})
