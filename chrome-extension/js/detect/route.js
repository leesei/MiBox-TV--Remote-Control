/*
 * 读取页面视频原始地址
 * （待开发）
 */
var mediaurls=[];

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	chrome.tabs.executeScript(tabId, {
		file: 'js/jquery-1.7.2.min.js',
		allFrames: true,
		runAt: 'document_start'
	}, function(resultArray){
		console.log(resultArray);
	});
	chrome.tabs.executeScript(tabId, {
		file: 'js/toastr.min.js',
		allFrames: true,
		runAt: 'document_start'
	}, function(resultArray){
		console.log(resultArray);
	});
	if(changeInfo.status=="loading"){
		chrome.pageAction.show(tabId);
	}else{
		MediaFetchRoute(tabId, changeInfo, tab);
	}
});

function getMediaInfo(tabId, cb){
	return mediaurls[tabId];
}

function MediaFetchRoute(tabId, changeInfo, tab){
	chrome.tabs.insertCSS(tabId, {
		file: 'css/toastr.min.css',
		allFrames: false,
		runAt: 'document_start'
	}, function(){
		console.log('The css has been inserted.');
	});
	if (tab.url.match(/.*?v.youku.com\/v_show\/id_([^_]+).*?\.html/i))
	{
		var name = tab.title.split("—")[0];
		getYouKuList(tabId,name,tab.url.match(/.*?v.youku.com\/v_show\/id_([^_]+).*?\.html/i)[1],function(result){
			mediaurls[tabId]=result;
			chrome.pageAction.setIcon({tabId: tabId,path: "img/19_r.png"})
			chrome.tabs.executeScript(tabId, {
				code: 'toastr.options = {"closeButton": true,"debug": false,"positionClass": "toast-top-right","showDuration": "300","hideDuration": "10000","timeOut": "10000","extendedTimeOut": "10000","showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","hideMethod": "fadeOut"};toastr.info("Title:'+result.Title+'</br>Url:'+result.Url+'", "YouKu");',
				allFrames: true,
				runAt: 'document_idle'
			}, function(resultArray){
				console.log(resultArray);
			});
		}); 
	}else if (tab.url.match(/tv.sohu.com.*?\.shtml/i)){
		console.log("sohu");
		getSohuList(tabId,tab.title,tab.url,function(result){
			mediaurls[tabId]=result;
			chrome.pageAction.setIcon({tabId: tabId,path: "img/19_r.png"})
			chrome.tabs.executeScript(tabId, {
				code: 'toastr.options = {"closeButton": true,"debug": false,"positionClass": "toast-top-right","showDuration": "300","hideDuration": "10000","timeOut": "10000","extendedTimeOut": "10000","showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","hideMethod": "fadeOut"};toastr.info("Title:'+result.Title+'</br>Url:'+result.Url+'", "Sohu");',
				allFrames: true,
				runAt: 'document_idle'
			}, function(resultArray){
				console.log(resultArray);
			});
		}); 
		//alert('Soho');
	}else if (tab.url.match(/.*?.ku6.com.*?/i)){
		//alert('Soho');
		getKu6List(tabId,tab.title,tab.url,function(result){
			mediaurls[tabId]=result;
			chrome.pageAction.setIcon({tabId: tabId,path: "img/19_r.png"})
			chrome.tabs.executeScript(tabId, {
				code: 'toastr.options = {"closeButton": true,"debug": false,"positionClass": "toast-top-right","showDuration": "300","hideDuration": "10000","timeOut": "10000","extendedTimeOut": "10000","showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","hideMethod": "fadeOut"};toastr.info("Title:'+result.Title+'</br>Url:'+result.Url+'", "Ku6");',
				allFrames: true,
				runAt: 'document_idle'
			}, function(resultArray){
				console.log(resultArray);
			});
		}); 
	}else{
		//alert('Other');
	}
}

function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

function getYouKuList(tabid,title,id,cb) {
	var url = "http://m.youku.com/wireless_api3/videos/"+id+"/playurl?format=1,2,4,5,6";
	
	httpRequest(url,function(str){
		var result = JSON.parse(str);
		if (result.status!="failed")
		{
			var list;
			if (result.results.m3u8_hd != undefined)
			{
				list=result.results.m3u8_hd;
			}
			else 
			if (result.results.m3u8_mp4 != undefined)
			{
				list=result.results.m3u8_mp4;
			}
			else 
			if (result.results.m3u8_flv != undefined)
			{
				list=result.results.m3u8_flv;
			}
			console.log("JSON=>"+list[0].url);	
			var url = list[0].url;
			var size = list[0].size;
			size=Math.round( 100 * size / 1024 / 1024 ) / 100 +"MB";
			cb({Url:url,Title:title});				
		}
		else
		{
			
			var url = "http://v.youku.com/player/getRealM3U8/vid/"+id+"/type/mp4/v.m3u8"
			cb({Url:url,Title:title});	
			console.log("Get Address fail,try "+url);	
		}
	});
}

function getSohuList(tabid,title,url,cb) {
	var vid;
	$.get(url,function(data){ 
	    console.log("get vid ");
	    var re=data.match(/var vid=\"(\d+)\"/i);
	    if (re)
	    {
		    vid = re[1];
		    console.log("vid is "+vid);
		    url = "http://hot.vrs.sohu.com/ipad"+vid+".m3u8";
		    size = 0;
		    cb({Url:url,Title:title});
			
	    }
	});

}


function getKu6List(tabid,title,url,cb)
{
	var re = url.match(/.*?v.ku6.com\/.*?\/([^\/]+\.\.).html.*?/)
	var re1 = url.match(/.*?topic.ku6.com\/show-\d+-(.*?\.\.).html.*?/)

	if (re)
	{
	    console.log("get ku6 id"+ re[1]);		
		url = "http://v.ku6.com/fetchwebm/"+re[1]+".m3u8";	
		cb({Url:url,Title:title});
	}
	else if (re1)
	{
	    console.log("get ku6 id"+ re1[1]);		
		url = "http://v.ku6.com/fetchwebm/"+re1[1]+".m3u8";
		cb({Url:url,Title:title});	
	}
}