var device_list;
var storage = window.localStorage;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    device_list = new Array();
});

function updateDeviceList() {
	$.ajax({
        url: "http://pds.duokanbox.com/peer/fetchbyipopen/?mac_address=1&callback=boxlist",
        host: "http://pds.duokanbox.com",
        timeout: 500,
        crossDomain: true,
        processData: false,
		async: false,
        dataType: 'html',
        error: function(requstObj, errorType, exceptionObj) {},
        success: function(msg) {
            var re = /^boxlist\((.*?)\)$/;
            str = msg.match(re)[1];
            getdeviceinfo(JSON.parse(str));
        }
    });
}

function getdeviceinfo(str) {
	if(!(typeof(storage.devicelist) === "undefined")){
		device_list = JSON.parse(storage.devicelist);
	}
	for (i in str.data) {
		$.ajax({
            url: "http://"+ str.data[i] +"/request?action=isAlive",
            host: "http://" + str.data[i],
            timeout: 500,
            crossDomain: true,
            processData: false,
			async: false,
            dataType: 'html',
            error: function(requstObj, errorType, exceptionObj) {
				for (var a = 0; a < device_list.length; a++) {
					if(str.data[i] === device_list[a].ip){
						device_list[a].static = 0;
					}
				};
				storage["devicelist"] = JSON.stringify(device_list);
			},
            success: function(msg) {
				var result = JSON.parse(msg);
				var static;
                for (var i = 0; i < device_list.length; i++) {
					if (device_list[i].ip == result.data.ip) {
						device_list[i].name = result.data.devicename;
						device_list[i].static = 1;
						storage["devicelist"] = JSON.stringify(device_list);
						return;
					}
                };
				
                device_list.push({
                    ip: result.data.ip,
                    name: result.data.devicename,
					static:1
                });
				
				storage["devicelist"] = JSON.stringify(device_list);
            }
        });
    }
}
