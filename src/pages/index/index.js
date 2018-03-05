
import css from './index.scss';
//var ajax = require('ajax');
var $ = require('jquery');
//require("expose-loader?getData!../../assets/js/ajax.js");
import {getData} from '../../assets/js/ajax.js';
//var getData = require('../../assets/js/ajax.js');
//import helloJs from './hello.js';

var _ = require('lodash');//lodash是通过npm安装的且打包进了dll，仍要require
//require("../../assets/lib/jquery-1.8.3.js");//webpack的引入方式，不需要支持模块话规则，都可以，下诉方式需要模块支持原生模块规则
//import $ from "../../assets/lib/jquery-1.8.3.js"

console.log(_)

const hello = "hello world!";

console.log("this is a page named index");
//window.onload = function(){
	console.log($('body'))
//}

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
