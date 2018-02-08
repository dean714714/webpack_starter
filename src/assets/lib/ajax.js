
function getData(url,rqType,para,ifLoading,callback){//获取数据
	
	var _url = url,_rqType = rqType,_para = para,_ifLoading = ifLoading,_callback = callback;
	var $load = document.createElement('div');
	$load.innerHTML = "加载中，请稍后...";
	$load.style.cssText = "width:160px;line-height:60px;text-align:center;color:#fff;background:#000;position: fixed;left: 50%;top: 50%;margin: -40px 0 0 -80px;z-index:100;border-radius: 10px;"
	if(ifLoading){
		//加载提示
		document.body.appendChild($load);
	}
	jQuery.support.cors=true;//ie8,9不支持服务器端设置CORS,加这句就行
	$.ajax({
		type:rqType,
		url:url+"?"+new Date().getTime(),//加上时间挫解决单页应用返回因为请求同一链接而不重新请求只调用缓存出现status:0，readStatus：0的错误
		async:true,
		dataType:'json',
		//contentType: "application/json; charset=utf-8",
		data:para,
		success:function(data){
			callback(data);
			if(ifLoading){
				$load.parentNode.removeChild($load);//关闭加载提示
			}
		},
		error:function(a){
			console.log(a)
			if(a.status===0){
				if(_ifLoading){
					$load.parentNode.removeChild($load);//关闭加载提示
				}
				getData(_url,_rqType,_para,_ifLoading,_callback);
				return;
			}
			var $div = document.createElement('div');
			$div.innerHTML = "请求失败了，请刷新或稍后重试~";
			$div.style.cssText = "font-size: 24px;font-weight: bold;letter-spacing: 4px;color: #ccc;font-style: italic;display: block;text-align: center;margin: 100px auto;"
			document.body.innerHTML = "";
			document.body.appendChild($div)
		}
	});
	
}

function helloDean(){
	console.log("hello dean")
}
export {
	getData,helloDean
}
