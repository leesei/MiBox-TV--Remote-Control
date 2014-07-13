var storage = window.localStorage;
var BG = chrome.extension.getBackgroundPage();

$(function(){
	BG.updateDeviceList();
	PopupDeviceList()
});

function PopupDeviceList(){
	var device_list = JSON.parse(storage.devicelist);
	var c;
	for(i in device_list){
		var static = "失联",
			c = "stop";
		
		if(device_list[i].static == 1){
			static = "运行中";
			c = "";
		}
		
		if (device_list[i].name.indexOf('盒子')>=0)
		{
			$("ul").append('<li id="'+device_list[i].ip+'" class="'+c+'"><img src="img/Box.png"><p class="dn">'+device_list[i].name+'<span>('+static+')</span></p><p class="dip">'+device_list[i].ip+'</p></li>');
		}
		else
		{
			$("ul").append('<li id="'+device_list[i].ip+'" class="'+c+'"><img src="img/TV.png"><p class="dn">'+device_list[i].name+'<span>('+static+')</span></p><p class="dip">'+device_list[i].ip+'</p></li>');
		}
	}
}

$(document).on("click", "li", function(e) {
	var li = $(this).parent().parent('#li');
	chrome.windows.getCurrent(function(wnd){
		chrome.tabs.getSelected(wnd.id, function(tab){
			ip = li.context.id;
			var history,
				ipinfo,
				array = new Array();
			
			if(!(typeof(storage[ip]) === "undefined")){
				ipinfo = JSON.parse(storage[ip]);
				array = ipinfo.history;
				history = {"name":tab.title,"url":tab.url,"favIconUrl":tab.favIconUrl,"time":new Date()}
				array.push(history);
				ipinfo.history=array;
			}else{
				ipinfo = {"history":[{"name":tab.title,"url":tab.url,"favIconUrl":tab.favIconUrl,"time":new Date()}]}
			};
			
			var mi = new MI(ip);

			mMediaInfo = BG.getMediaInfo(tab.id);

			mi.play(encodeURI(mMediaInfo.Url),"ku6");
			
			storage.setItem(ip,JSON.stringify(ipinfo));
			var opts = {
				lines: 20, // The number of lines to draw
				length: 11, // The length of each line
				width: 5, // The line thickness
				radius: 17, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				color: '#FFF', // #rgb or #rrggbb
				speed: 1, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: 'auto', // Top position relative to parent in px
				left: 'auto' // Left position relative to parent in px
			};
			var target = document.createElement("div");
			document.body.appendChild(target);
			var spinner = new Spinner(opts).spin(target);
			iosOverlay({
				duration: 2e3,
				spinner: spinner
			});
			return false;
		})
	})
});

/*$(document).on("click", "#checkMark", function(e) {
	iosOverlay({
		duration: 2e3,
		icon: "img/check.png"
	});
	return false;
});

$(document).on("click", "#cross", function(e) {
	iosOverlay({
		duration: 2e3,
		icon: "img/cross.png"
	});
	return false;
});

$(document).on("click", "#loading", function(e) {
	var opts = {
		lines: 20, // The number of lines to draw
		length: 11, // The length of each line
		width: 5, // The line thickness
		radius: 17, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		color: '#FFF', // #rgb or #rrggbb
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	};
	var target = document.createElement("div");
	document.body.appendChild(target);
	var spinner = new Spinner(opts).spin(target);
	iosOverlay({
		duration: 2e3,
		spinner: spinner
	});
	return false;
});*/