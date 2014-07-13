var storage = window.localStorage,
device,
deviceinfo;

var BG = chrome.extension.getBackgroundPage();
var mi;

$(function(){
	BG.updateDeviceList();
	for(i in BG.device_list){
		$("#device_list").append('<option value="'+BG.device_list[i].ip+'">'+BG.device_list[i].name+'</option>');
	}
	
   $("#device_list").change(function(){ 
		device=$("#device_list").val();
		mi = new MI($("#device_list").val().toString());
		
		if(!(typeof(storage[device]) === "undefined")){
			deviceinfo = JSON.parse(storage[device]);
			for(i in deviceinfo.history){
				$("#history").append('<tr><td>'+deviceinfo.history[i].name+'</td><td><a href="'+deviceinfo.history[i].url+'">'+deviceinfo.history[i].url+'</a></td><td>'+deviceinfo.history[i].time+'</td></tr>');
				
			}
		};
   })
   
   var keys = ['power', 'menu', 'right', 'left', 'down', 'up', 'enter', 'volumeup', 'volumedown', 'home', 'back'],
			btns = [];
	var keyMap = {
			38 : 'up',
			40 : 'down',
			37 : 'left',
			39 : 'right',
			13 : 'enter',
			27 : 'back',
			32 : 'home',
			189 : 'volumedown',
			187 : 'volumeup'
		};
		
	document.addEventListener('click', function(e){
			var e = e.target;
			if(e.tagName.toLowerCase() === 'button'){
				//$("#device_list").val()
				var mi = new MI(device);
				var key = e.innerHTML;
				mi[key]().then(function(d){
					console.log(key, d);
				});
			}
		});
	window.addEventListener('keyup', function(e){
			var key = keyMap[e.keyCode];
			mi[key] && mi[key]().then(function(d){
				console.log(key, d);
			});
		});
	keys.forEach(function(key){
			btns.push('<li><button type="button" class="btn btn-default">' + key + '</button></li>');
		});
   $("#console").append(btns.join(''));
});