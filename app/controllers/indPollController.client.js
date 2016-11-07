'use strict';

(function () {	  
   	var title = document.querySelector('h1');    
    var dropDown = document.querySelector('select');
    var form = document.querySelector('form');
    var rightDiv = document.querySelector('#right');
   	var apiUrl = window.location.origin + '/api' + window.location.pathname; 

    var facebookButton = document.querySelector('.fb-share-button');
    facebookButton.setAttribute('data-href', window.location.origin + window.location.pathname);
    facebookButton.setAttribute('href', encodeURIComponent(window.location.origin + window.location.pathname));

    var submitButton = document.querySelector('#btn-submit');
    var isEventListenerSet = false;    

    var bodyWidth = d3.select("body")[0][0]['clientWidth'];    
    var w = bodyWidth * .35 * .9;
    var h = w;
    var offset = 0;
    var padding={
        top: 0,
        right: 0,
        bottom: 300,
        left: 0
      };
    
    var radius = Math.min(w, h) / 2;
    var color = d3.scale.category20c();
    var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 120);

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.votes; });

    /*
    var tooltip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0); */

   	function updatePoll (data) {
    	var pollObject = JSON.parse(data);       
      title.innerHTML = pollObject.title;
      dropDown.innerHTML = '';
      var disabledOption = document.createElement('option');
      disabledOption.setAttribute('value', '');
      disabledOption.setAttribute('disabled', true);
      disabledOption.setAttribute('selected', true);
      disabledOption.innerHTML = 'Choose an option';
      dropDown.appendChild(disabledOption);
      rightDiv.innerHTML = '';
      for (var i=0; i<pollObject.options.length; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.innerHTML = pollObject.options[i]['title'];
        dropDown.appendChild(option); 
      }       
      
      if (!isEventListenerSet) {
        submitButton.addEventListener('click', function () {
          var postData = {pollId: pollObject['_id'], option: dropDown.options.selectedIndex-1}; 
          ajaxFunctions.ajaxPostRequest(window.location.origin + '/poll/vote', postData, function (response) {
              updatePoll(response);
            });
        }, false);
        isEventListenerSet = true;
      }
      
      var pieData = pollObject.options;     
      padding.bottom = 10 + pieData.length * 18;

      var canvas = d3.select("#right")
        .append("div")
          .attr("id", "canvas")
          .style("width", padding.left+w+padding.right+0+"px")     

      var svg = d3.select("#canvas")
          .append("svg")
            .attr("width", w+padding.left+padding.right)
            .attr("height", h+padding.top+padding.bottom)
          .append("g")
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

      var g = svg.selectAll(".arc")
        .data(pie(pieData))
      .enter().append("g")
        .attr("class", "arc")
    /*    .on("mouseover", function(d,i) {          
          tooltip.transition()        
              .duration(100)      
              .style("opacity", .9);      
          tooltip.html(d.data.title + ": " + d.data.votes)  
              .style("left", (d3.event.pageX) + "px")     
              .style("top", (d3.event.pageY - 30) + "px");                     
        })
        .on("mouseout", function(){
          tooltip.transition()        
              .duration(50)      
              .style("opacity", 0);  
        }) */;

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(i); });

      var legRectW = 36, legRectH = 18;      
      svg.selectAll("rect")
          .data(pieData)
        .enter().append("rect")
          .attr("x", function(d){
            return (padding.left+10-w/2);
          })
          .attr("y", function(d, i){
            return (padding.top+h/2+10+legRectH*i);
          })
          .attr("width", legRectW)
          .attr("height", legRectH)
          .style("fill", function(d, i){ return color(i); });

      svg.selectAll("text")
          .data(pieData)
        .enter().append("text")
          .text(function(d){ return d.title + ": " + d.votes + " vote(s)"; })
          .attr("x", function(d){
            return (padding.left-w/2+legRectW+20);
          })
          .attr("y", function(d, i){
            return (padding.top+h/2+10+legRectH*i+legRectH*3/4);
          });

      if (pollObject.message) {
        setTimeout(function() { alert(pollObject.message); }, 1);
        //window.alert(pollObject.message);
      }    
    
    }      

   	ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePoll));
})();