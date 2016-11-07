var appUrl = window.location.origin;
var ajaxFunctions = {
	ready: function ready (fn) {
    	if (typeof fn !== 'function') {
        	return;
    	}

      	if (document.readyState === 'complete') {
        	return fn();
      	}

    	document.addEventListener('DOMContentLoaded', fn, false);
	},
   	ajaxRequest: function ajaxRequest (method, url, callback) {
    	var xmlhttp = new XMLHttpRequest();

    	xmlhttp.onreadystatechange = function () {
      	if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          callback(xmlhttp.response);
       	}
    	};

    	xmlhttp.open(method, url, true);
    	xmlhttp.send();
   	},
    ajaxPostRequest: function ajaxPostRequest (url, data, callback) { //for application/x-www-form-urlencoded
      var params = typeof data == 'string' ? data : Object.keys(data).map(
        function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
      ).join('&');

      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          callback(xmlhttp.response);
        }
      };

      xmlhttp.open('POST', url, true);
      xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');      
      xmlhttp.send(params);
    }  
};