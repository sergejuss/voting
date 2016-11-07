'use strict';

(function () {
	  var userName = document.querySelector('#userName');
    var provider = document.querySelector('#provider');
   	var pollsDiv = document.querySelector('.polls');
   	var apiUrl = appUrl + '/api/my_polls';  	

   	function updatePollsList (data) {
    	var dataObject = JSON.parse(data);       
      var userDoc = dataObject[0];
      pollsDiv.innerHTML = '';
      for (var i=0; i<userDoc.polls.length; i++) {
        var aPoll = document.createElement('a');
        aPoll.setAttribute('href', appUrl + '/poll/' + userDoc.polls[i]['_id']);
        var poll = document.createElement('div');
        poll.className = 'pollTitle';
        poll.setAttribute('id', userDoc.polls[i]['_id']);
        poll.innerHTML = userDoc.polls[i]['title'];
        aPoll.appendChild(poll);        
        pollsDiv.appendChild(aPoll);

        var deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'btn btn-delete');        
        deleteButton.setAttribute('id', userDoc.polls[i]['_id']);
        deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener('click', function () {
          if (confirm("You are about to delete the poll") === true) {
            ajaxFunctions.ajaxRequest('DELETE', appUrl + '/api/poll/' + this.getAttribute('id'), updatePollsList);
          }    
        }, false);
        pollsDiv.appendChild(deleteButton);
      }

      userName.innerHTML = userDoc.profile.displayName;
      provider.innerHTML = userDoc.profile.provider;      
   	}

   	ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePollsList));
})();