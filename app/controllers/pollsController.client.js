'use strict';

(function () {	  
   	var pollsDiv = document.querySelector('.polls');
   	var apiUrl = appUrl + '/api/polls';
  	

   	function updatePollsList (data) {
    	var pollsObject = JSON.parse(data);
      for (var i=0; i<pollsObject.length; i++) {
        var aPoll = document.createElement('a');
        aPoll.setAttribute('href', appUrl + '/poll/' + pollsObject[i]['id']);
        var poll = document.createElement('div');
        poll.className = 'pollTitle';
        poll.setAttribute('id', pollsObject[i]['id']);
        poll.innerHTML = pollsObject[i]['title'];
        aPoll.appendChild(poll);        
        pollsDiv.appendChild(aPoll);
      }       
   	}

   	ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePollsList));
})();