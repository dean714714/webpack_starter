
import css from './index.scss';
//var ajax = require('ajax');
//import $ from 'jquery'
//require("expose-loader?getData!../../assets/lib/ajax.js");
import {getData} from '../../assets/lib/ajax.js';
//import helloJs from './hello.js';

const hello = "hello world!";

console.log("this is a page named index");

//可以在webpack.dev.js和webpack.prod.js中设定全局环境变量，在pages下的任何文件中都能获取到process.env.NODE_ENV
//以此进行相关操作
if (process.env.NODE_ENV !== 'production') {
	console.log('Looks like we are in development mode!');
}else{
	console.log("执行环境是："+process.env.NODE_ENV);
}

//window.onload = function(){
	console.log(getData);
//}
//
//if (module.hot) {
//module.hot.accept()
//}
