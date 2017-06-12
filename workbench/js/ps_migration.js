var startRow = 1;
var numPerCall = 10;
var stopAdding = false;
incomingLinksAddAppropriate = function() {
  jQuery('body').append("<div class=\"full-screen-overlay\"></div>");
  jQuery(".full-screen-overlay").fadeOut();
  startRow = 1;
  numPerCall = parseInt(jQuery("#batch-size").val());
  if (isNaN(numPerCall)) {
    numPerCall = 10;
  }
  jQuery("#stop-button")[0].disabled = false;
  jQuery("#start-button")[0].disabled = true;
  jQuery("#stop-button").removeClass("form-button-disabled");
  jQuery("#start-button").addClass("form-button-disabled");
  makeAddAppropriateCall();
}
makeAddAppropriateCall = function() {
  var pidCsv = jQuery("#incoming-links-table tr").slice(startRow,startRow+numPerCall).find("td:first").map(
    function(){ 
      jQuery(".before-"+jQuery(this).text().replace(":","-")+" td:last").css("background","url(../../misc/throbber.gif) no-repeat 6px -14px");
      return jQuery(this).text(); 
    }
  ).toArray().join(",");
  jQuery.ajax({
    "url" : "",
    "data" : "auto_add=" + pidCsv,
    "method" : "POST"
  }).done(function(attemptReturn){
    jQuery.each(attemptReturn, function(key, val) {
      jQuery(".before-"+key.replace(":","-")+" td:last").text(val).css("background","");
      if (val.indexOf(":") == 2 && /^\+?(0|[1-9]\d*)$/.test(val.substring(3))){
        jQuery(".before-"+key.replace(":","-")+" td").css("background-color","rgba(111,222,150,0.5)");
      }
      else {
        jQuery(".before-"+key.replace(":","-")+" td").css("background-color","rgba(255,111,111,0.5)");
      }
    });
    startRow += numPerCall;
    if (startRow >= jQuery("#incoming-links-table tr").length) {
      stopAdding = true;
    }
    if (!stopAdding) {
      makeAddAppropriateCall();
    }
    else {
      jQuery("#stop-button").val("Stopped");
    } 
  });
}
stopAddCalls = function(){
  if (!stopAdding) {
    stopAdding = true; 
    jQuery("#stop-button")[0].disabled = true;
    jQuery("#stop-button").val("Stopping...");
    jQuery("#stop-button").addClass("form-button-disabled");
  }
}

