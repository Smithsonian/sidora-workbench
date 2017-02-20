/**
 * This class is fully created by Quotient-inc: Robert Anderson and Rashmi Amlani.  
 * This class implements a ajax queueing system with a popup notification when complete
 *
 */
var SidoraQueue = function(){};
SidoraQueue.prototype.completedRequests = [];
SidoraQueue.prototype.completedSuccessfulRequests = [];
SidoraQueue.prototype.completedFailedRequests = [];
SidoraQueue.prototype.requests = [];
SidoraQueue.prototype.pidsInProcess = [];
SidoraQueue.prototype.requestInProcess = null;
SidoraQueue.prototype.incomingRequestsAreSilent = false;
SidoraQueue.prototype.showWarning = function(warning){
  console.log(warning);
}
SidoraQueue.prototype.showMessage = function(message){
  console.log(message);
}
/* The action property in Sidora queue request object is used to track the actual 
 * action being performed in the request, instead of deriving it from the 
 * userFriendlyName. The requestStat property is used to track the item count in 
 * the current queue, e.g., if there are 3 requests being queued for deleting 
 * 3 resources, the requestStat will contain 0 of 3, 1 of 3,etc.
 * Use cases for action and requestStat: When multiple resources are added, the 
 * last resource added needs to be highlighted and opened in the preview pane.
 * Prior to requestStat, this was done by geting the item count from userFriendlyName.
 * RequestStat is a more precise way of figuring out if we are processing 
 * the last resource in the queue.
 * Also, when a concept is deleted, the window url needs to change to the parent 
 * pid so Sidora.Concept.LoadContent loads the metadata for the parent pid. The 
 * done funtion of Sidora queue checks the action property to accomplish this functionality.
*/ 
SidoraQueue.prototype.RequestPost = function(userFriendlyName, ajaxRequestUrl, postData, doneFunction, failFunction, pidsBeingProcessed, action, requestStat){
  action = typeof action !== 'undefined' ? action : '';
	requestStat = typeof requestStat !== 'undefined' ? requestStat : '';
	console.log("in RequestPost of queue : Requested post '"+userFriendlyName+"' to post to:"+ajaxRequestUrl);
  if (typeof(pidsBeingProcessed) == 'string') pidsBeingProcessed = [pidsBeingProcessed];
  if (typeof(doneFunction) == 'undefined' || !jQuery.isFunction(doneFunction)) doneFunction = function(){};
  if (typeof(failFunction) == 'undefined' || !jQuery.isFunction(failFunction)) failFunction = function(){};
  if (!jQuery.isArray(pidsBeingProcessed)) pidsBeingProcessed = [];
  var sr = new SidoraRequest();
  var myself = this;
  srDoneFunction = function(){ 
    doneFunction.apply(this,arguments); myself.Done(sr, arguments); myself.requestInProcess = null; myself.Next();
  };
  srFailFunction = function(){ 
    failFunction.apply(this,arguments); myself.Fail(sr, arguments); myself.requestInProcess = null; myself.Next(); 
  };
  var ajaxObj = {
    type: "POST",
    url: ajaxRequestUrl,
    data: postData,
    success: srDoneFunction,
    error: srFailFunction,
    dataType: "text"
  };
  var sidoraRequestConfig = {
    ajaxRequest: ajaxObj,
    userFriendlyName: userFriendlyName,
    pidsBeingProcessed: pidsBeingProcessed,
    isSilent: this.incomingRequestsAreSilent,
    action: action,
    requestStat: requestStat
  };
  sr.pullFromConfig(sidoraRequestConfig);
  myself.SidoraRequest(sr);
}
/*
 * Reminder: Request and RequestPost are handled differently
 */
SidoraQueue.prototype.Request = function(userFriendlyName, ajaxRequestUrl, doneFunction, failFunction, pidsBeingProcessed, action, requestStat){
  action = typeof action !== 'undefined' ? action : '';
	requestStat = typeof requestStat !== 'undefined' ? requestStat : '';
  var myself = this;
  if (typeof(pidsBeingProcessed) == 'string') pidsBeingProcessed = [pidsBeingProcessed];
  if (typeof(doneFunction) == 'undefined' || !jQuery.isFunction(doneFunction)) doneFunction = function(){};
  if (typeof(failFunction) == 'undefined' || !jQuery.isFunction(failFunction)) failFunction = function(){};
  if (!jQuery.isArray(pidsBeingProcessed)) pidsBeingProcessed = [];
  srDoneFunction = function(){ 
    doneFunction.apply(this,arguments); myself.Done(this, arguments); myself.requestInProcess = null; myself.Next();
  };
  srFailFunction = function(){ 
    failFunction.apply(this,arguments); myself.Fail(this, arguments); myself.requestInProcess = null; myself.Next(); 
  };
  var sr = (new SidoraRequest(userFriendlyName, ajaxRequestUrl, srDoneFunction, srFailFunction, pidsBeingProcessed,action,requestStat));
  sr.isSilent = this.incomingRequestsAreSilent;
  myself.SidoraRequest(sr);
}
SidoraQueue.prototype.SidoraRequest = function(sidoraRequest){
  var myself = this;
  sidoraRequest.pidsBeingProcessed.forEach(function(v){myself.pidsInProcess.push(v);});
  myself.requests.push(sidoraRequest);
  console.log("In SidoraRequest of the Queue : added a request to the requests array of the queue.");
}
SidoraQueue.prototype.ListenerForCreateRetry = function(completedItem, formBuildIdToUse) {
  var formBuildIdIndex = -1;
  if (completedItem != null) {
    formBuildIdIndex = completedItem.fullObject.ajaxRequest.data.indexOf("form_build_id");
  }
  var fbi = '';
  if (formBuildIdIndex > -1) {
    var fbi_partial = completedItem.fullObject.ajaxRequest.data.substr(formBuildIdIndex+14);
    var fbi = fbi_partial.substring(0,fbi_partial.indexOf("&"));
  }
  if (typeof(formBuildIdToUse) != 'undefined') {
    fbi = formBuildIdToUse;
  }
  if (fbi != '') {
    var rcid = 'retryCreate'+fbi;
    var myQ = this;
    var originalItem = completedItem;
    jQuery("#"+rcid).click(function(){
      var tryNumber = "2";
      if (typeof(jQuery("#"+rcid).attr("try")) !== 'undefined'){
        tryNumber = jQuery("#"+rcid).attr("try");
      }
      jQuery("#"+rcid).attr("try", 1+parseInt(tryNumber));
      onSuccess = function(){
        jQuery("#"+rcid).text("Success!");
      }
      onFailure = function(){
        jQuery("#"+rcid).text("Retry "+jQuery("#"+rcid).attr("try"));
        jQuery("#"+rcid).unbind('click');
        jQuery("#"+rcid+"-ignore").parent().show();
        myQ.ListenerForCreateRetry(originalItem);
      }
      myQ.RequestPost("Try #"+tryNumber+"-"+completedItem.userFriendlyName, Drupal.settings.basePath+"sidora/ajax_parts/reprocess_incomplete_object_creation_forms/"+fbi, '', onSuccess, onFailure, completedItem.pidsBeingProcessed, "retryIngest" );
      myQ.Next();
      jQuery("#"+rcid).text("Retrying...").unbind('click');
      jQuery("#"+rcid+"-ignore").parent().hide();
    });
    jQuery("#"+rcid+"-ignore").click(function(){
      jQuery("#"+rcid+"-ignore").parent().parent().hide();
    });
  }
}
SidoraQueue.prototype.HtmlForCreateRetry = function(completedItem, formBuildIdToUse) {
  var formBuildIdIndex = completedItem.fullObject.ajaxRequest.data.indexOf("form_build_id");
  var toReturn = '';
  var fbi = '';
  if (formBuildIdIndex > -1) {
    var fbi_partial = completedItem.fullObject.ajaxRequest.data.substr(formBuildIdIndex+14);
    var fbi = fbi_partial.substring(0,fbi_partial.indexOf("&"));
  }
  if (typeof(formBuildIdToUse) != 'undefined') {
    fbi = formBuildIdToUse;
  }
  if (fbi != '') {
    var rcid = 'retryCreate'+fbi;
    toReturn = '<div>';
    toReturn += '<button class="sidora-button" style="width:100px">';
    toReturn += '<span class="sidora-button-text retryCreate" id="'+rcid+'" fbi="'+fbi+'">Retry</span>'
    toReturn += '</button>';
    toReturn += '<button class="sidora-button" style="width:100px">';
    toReturn += '<span class="sidora-button-text" id="'+rcid+'-ignore">Ignore</span>';
    toReturn += '</button>';
    toReturn += '</div>';
  }
  return toReturn;
}
SidoraQueue.prototype.Fail = function(completedItem, ajaxReturn){
  completedItem.ajaxReturn = ajaxReturn;
  this.completedRequests.push(completedItem);
  this.completedFailedRequests.push({pid:completedItem.pidsBeingProcessed[0],form:completedItem});
  var creation
  this.NotificationWindow.Show("FAILED: " + completedItem.userFriendlyName, true);
  console.log("fail:"+ajaxReturn[0].status);
  if (ajaxReturn[0].status == '500'){
    var site_admin = '';
    if (Drupal.settings.site_admin_email != "") site_admin = " at " + Drupal.settings.site_admin_email;
    this.NotificationWindow.Show("Error code 500 returned. Contact site administrator" + site_admin,true);
  /*  jQuery("body").append("<div id='ajaxErrors' style='display:none;' title='"+completedItem.userFriendlyName+"'><p>The Server has returned an error code of 500.</p><p>"+completedItem.userFriendlyName+" has failed</p><p>Please contact the Site Administrator</p></div>");
    jQuery("#ajaxErrors").dialog({
       height: 300,
       width: 350,
       modal: true,
       resizable: false,
       dialogClass: "no-close",
      buttons: {
         "OK": function() {
            self.parent.Shadowbox.close();
            jQuery( this ).dialog( "close" );
      }
     }
    });*/
  } 
}
SidoraQueue.prototype.Retry = function(pid) {
  jQuery('#edit_form').remove();
  jQuery("body").append("<div id='edit_form' style='visibility:hidden;'></div>");
  var failedForm = sidora.queue.completedFailedRequests.filter(function (obj){ return obj.pid === pid;})[0];
  jQuery("#edit_form").text(failedForm.form)
  Shadowbox.close();
  Shadowbox.open({
    content: Drupal.settings.basePath+"sidora/edit_metadata/"+pid+"&retry",
    player:     "iframe",
    title:      "Edit Metadata",
    options: {
      onFinish: function(){
        //Allow the frame to go fullscreen if needed
        jQuery("#sb-player").attr("allowfullscreen","true");
        jQuery("#sb-player").attr("webkitallowfullscreen","true");
        jQuery("#sb-player").attr("mozallowfullscreen","true");
        jQuery("#sb-player").attr("msallowfullscreen","true");
        jQuery("#sb-player").attr("oallowfullscreen","true");
      }
    }
  });
}           
SidoraQueue.prototype.Done = function(completedItem, ajaxReturn){
  completedItem.ajaxReturn = ajaxReturn;
  this.completedRequests.push(completedItem);
  this.completedSuccessfulRequests.push(completedItem);
  //if the item can be turned into a JSON object do so, and check to see if it has .error == true
  var jsonData = null;
  var jsonString = "";
  if (ajaxReturn && typeof(ajaxReturn) != 'string' && ajaxReturn.length > 0){
    jsonString = ajaxReturn[0];
  }else if (typeof(ajaxReturn) == 'string'){
    jsonString = ajaxReturn;
  }
  try{ jsonData = jQuery.parseJSON(jsonString); } catch (e){
    if (jsonString.indexOf("<h2 class=\"element-invisible\">Error message</h2")>0){
      var toShow = "Did not perform action:"+completedItem.userFriendlyName;
      this.completedFailedRequests.push({pid:completedItem.pidsBeingProcessed[0],form:jsonString});
      if (completedItem.fullObject.userFriendlyName.indexOf("Edit MetaData")>0){
        toShow += '<div class="messages error"><a rel="shadowbox; width=500; height=600; player=iframe" href="javascript:void(0)" id="retry_edit_metadata" class="' + completedItem.pidsBeingProcessed[0] + '" onClick = window.sidora.queue.Retry("'+completedItem.pidsBeingProcessed[0]+'");>Click here to view the errors and retry</a></div>';
      }
      if (completedItem.fullObject.action == 'createResource') {
        toShow += this.HtmlForCreateRetry(completedItem);
      }
      this.NotificationWindow.Show(toShow, true);
      if (completedItem.fullObject.action == 'createResource') {
        toShow += this.ListenerForCreateRetry(completedItem);
      }
      
      return;
    }  
  }
  if (jsonData != null && jsonData.error){
    var toShow = "Did not perform action:"+completedItem.userFriendlyName;
    this.completedFailedRequests.push({pid:completedItem.pidsBeingProcessed[0],form:jsonString});
    if (typeof(jsonData.error) == 'string') toShow += " - "+jsonData.error;
    if (typeof(jsonData.description) == 'string') toShow += " - "+jsonData.description;
    for (var i = 0; i < completedItem.pidsBeingProcessed.length; i++){
      var currPid = completedItem.pidsBeingProcessed[i];
      jQuery(jq(currPid)).removeClass("is-being-moved");
    }
    this.NotificationWindow.Show(toShow, true);
  }else{
    if (completedItem.action == 'batchIngest'){
      if (jsonData.status.toLowerCase().indexOf("batch ingest successfully received") > -1){ 
        console.log("Batch successfully submitted");
        var requestID = jsonData.request_id;
        var batch_id = jsonData.batch_id;
        var timestamp = jsonData.timestamp;
        console.log("Request id:"+requestID);
        this.NotificationWindow.Show('Batch Ingest request started at ' + timestamp + ' to ingest ' + jsonData.message + ' is now submitted for processing',true);
      // extract the request id and batch_id and set an interval based function 
      (function poll(requestID,batch_id,timestamp) {
       setTimeout(function(){
	jQuery.ajax({
        url: Drupal.settings.basePath+"sidora/ajax_parts/check_batch_status/"+requestID+"/"+batch_id+"/",
        type: "GET",
        success: function(batchStatus) {
          if (batchStatus && typeof(batchStatus) != 'string'){
	    if (batchStatus.status.toLowerCase().indexOf('complete') > -1){
	      parentPid = batchStatus.parent;
	      sidora.queue.NotificationWindow.Hide();
	      console.log('parent pid to refresh is ' + parentPid);
              jQuery('#batchMessage').remove();
              jQuery("body").append("<div id='batchMessage' style='display:none;' title='Batch Metadata request status'><div>The batch request started at " + timestamp + " is completed.\n" + batchStatus.message + "</div></div>");
              jQuery("#batchMessage").dialog({
                modal: true,
	        height:250,
                width: 400,
                buttons: {
                 Ok: function(){
		    jQuery( this ).dialog( "close" );
		 }
		}
	      });	 
	      if (sidora.concept.GetPid() == parentPid){
		setTimeout(function(){
	 	sidora.concept.LoadContent();
		sidora.util.refreshConceptChildrenNumber(parentPid);
                },5000);
	      }
	    }else{
	      if (batchStatus.status.toLowerCase().indexOf('error') == -1) {
	        sidora.queue.NotificationWindow.Show("Status for batch request started at " + timestamp + " : " + "<br>" + batchStatus.message,true);
	        setTimeout(function() {poll(requestID,batch_id,timestamp)}, 2000);
	      }else{
	        sidora.queue.NotificationWindow.Show("Status for batch request started at " + timestamp + " returned an error : " + "<br>" + batchStatus.message,true);
	        console.log(batchStatus.message);
	      }	 
	    }
	  }			
        },
       dataType: "json",
       //timeout: 5000
      });
     },2000);
   })(requestID,batch_id,timestamp);
    }else{
      if (Drupal.settings.site_admin_email != "") site_admin = " at " + Drupal.settings.site_admin_email;
        this.NotificationWindow.Show('The batch ingest request could not be submitted to backend for processing. Contact site administrator' + site_admin,true);
	console.log(jsonData.status+jsonData.message);
    }				
  }else{  
    if (!completedItem.isSilent) this.NotificationWindow.Show(completedItem.userFriendlyName);
    var processedItemCount = completedItem.requestStat;
    var executeOnceOnly = false;
    for (var i = 0; i < completedItem.pidsBeingProcessed.length; i++){
      if (sidora.resources.individualPanel.resourceOfInterest != null && sidora.resources.individualPanel.resourceOfInterest.pid == completedItem.pidsBeingProcessed[i]){
        sidora.resources.individualPanel.LoadRelationships();
      }
      //Update the tree counts if needed, only valid pids
      if (completedItem.pidsBeingProcessed.indexOf(":") != -1) {
        sidora.util.refreshConceptChildrenNumber(completedItem.pidsBeingProcessed[i]);
      }
      if (completedItem.pidsBeingProcessed.length == '2') sidora.util.refreshNodeByID(completedItem.pidsBeingProcessed);
      //If there was an update to the Pid user is currently looking at then anything may have changed.  Reload it.
      if (sidora.concept.GetPid() == completedItem.pidsBeingProcessed[i]){
        if ((completedItem.action == 'deleteConcept') && !(executeOnceOnly)){
          parentLocation = sidora.util.getParentHref(window.location.href);
          var jst = jQuery("#forjstree").jstree();
          var parentLocationFromBasePath = parentLocation.substring(parentLocation.indexOf(Drupal.settings.basePath));
          var itemSelectorForCurrentItemInTree = 'a[href=\"'+parentLocationFromBasePath+'\"]';
          var selectThisNode = jst.get_node(itemSelectorForCurrentItemInTree);
          jst.deselect_all();
          jst.select_node(selectThisNode);
          executeOnceOnly = true;
        }    
        sidora.concept.LoadContent();
        sidora.util.refreshPidInTree();
        if (processedItemCount != ''){
          var processedResourceCountArray = processedItemCount.split(' of ');
          if ((processedResourceCountArray.length > 1) && (processedResourceCountArray[0] == processedResourceCountArray[1]-1)){
            // trying to get the last item of the current queue
            sidora_util.writeCookie('Drupal.selectResource','1','30');
            if (sidora_util.readCookie('Drupal.dtFilter') != ''){
              if ((completedItem.fullObject.ajaxRequest.data.indexOf('islandora_ingest_form') > -1) && (completedItem.fullObject.ajaxRequest.data.indexOf('resource_model') > -1)){
                var rmPattern = new RegExp('&resource_model=(.*)&');
                var rmArray = rmPattern.exec(completedItem.fullObject.ajaxRequest.data);
                if ((Array.isArray(rmArray))&& (rmArray.length >= 2) && (rmArray[1] != sidora_util.readCookie('Drupal.dtFilter'))){
                  if (!sidora.util.isConfirmShowing()){
                    sidora.util.Confirm(
                      "Resources Filter Warning",
                      "The resources you just added aren't visible right now because they are filtered out by the current resource filter. Click 'Reset' to if you want to view all resources, or close this window to leave the current filter.",
                      function(){
                        sidora_util.writeCookie('Drupal.dtFilter','','30');
                        jQuery('#sidora-resource-type-dropdown').val('');
                        sidora.resources.reloadDatatableBasedOnCurrentFilters();
                      },
                      function(){},
                      'Reset'
                    );
                  }
                }
              }    
            }
          }
        } //Ends processedItemCount != ''
      }else if (sidora.resources.IsOnScreen(completedItem.pidsBeingProcessed[i])){
        sidora.concept.LoadContent();
      } 
		}	
    }
  }
  console.log("done function of queue:"+completedItem.userFriendlyName);
}
SidoraQueue.prototype.NotificationWindow = {"showingError":false};
SidoraQueue.prototype.NotificationWindow.MouseIsInside = false;
SidoraQueue.prototype.NotificationWindow.SecondsOnScreen = 4;
SidoraQueue.prototype.NotificationWindow.UpdateTime = Date.now();
SidoraQueue.prototype.NotificationWindow.Show = function(message, isError){
  var nw = this;
  if (jQuery('#queueMessage').length == 0){
    var notificationWindowHtml = '<div id="queueMessage" style="display:none; position: fixed; bottom: 26px; right: 30px; min-height: 50px; width: 400px;"><div id="" role="tooltip" class="queue-message-block ui-tooltip ui-widget ui-corner-all ui-widget-content" style=" display: block;width: 100%;height: 100%;max-width: 1000px;"><div class="notification-window-message"></div><div class="queue-mb-close" style="background: url(' + Drupal.settings.islandora_xml_forms.basepath + 'elements/css/images/ui-icons_222222_256x240.png) no-repeat -30px -191px;width: 20px;height: 20px;z-index: 100;position: absolute;right: 0;top: 0; cursor: pointer; cursor: hand;"></div></div></div>';
    jQuery("body").append(notificationWindowHtml);
      jQuery("#queueMessage").mouseenter(function(){
        nw.MouseIsInside = true;
        nw.UpdateTime = Date.now();
        //User placed their mouse in the div, reset the timer - maybe the user wants it to stay on screen
        //The timer is reset for the "overshot" where the user tried to get the mouse in on time, but left it prematurely
        //for example they get the mouse in at 3.5 seconds but slips out at 3.7 because the cursor shot thru
        //so, now at 4 sec the mouse is out, but we don't want to hide it
      }).mouseleave(function(){
        nw.MouseIsInside = false;
        setTimeout(function(){nw.CheckHide();}, nw.SecondsOnScreen * 1000);
        //User removed mouse from the div, start the countdown to hiding it
      });
    jQuery(".queue-mb-close").click(function(){nw.showingError = false; nw.Hide();});
  }
  jQuery(".notification-window-message div:hidden").remove();
  var checkErrorClass = "";
  if (isError) {
    checkErrorClass = "notification-window-error-message";
  }
  jQuery(".notification-window-message").append("<div class="+checkErrorClass+">"+message+"</div>");
  jQuery("#queueMessage").height(jQuery("#queueMessage").css("min-height"));
  jQuery("#queueMessage").fadeIn();
  if (jQuery("#queueMessage")[0].scrollHeight > jQuery("#queueMessage").height()){
    jQuery("#queueMessage").height(jQuery("#queueMessage")[0].scrollHeight);
  }
  this.UpdateTime = Date.now();
  if (isError || nw.showingError){
    nw.showingError = true;
    jQuery("#queueMessage").unbind('mouseenter');
    jQuery("#queueMessage").unbind('mouseleave');
  }else{
    setTimeout(function(){nw.CheckHide();}, this.SecondsOnScreen * 1000);
  }

}
SidoraQueue.prototype.NotificationWindow.CheckHide = function(){
  var nw = this;
  //See if this item should remain on screen
  if (!nw.MouseIsInside  && Date.now() >= nw.UpdateTime + nw.SecondsOnScreen*1000){
    //Indicates there hasn't been a more recent update (e.g. a "new" popup has not arrived in the interval that the first one was showing up)
    nw.Hide();
  }
}
SidoraQueue.prototype.NotificationWindow.Hide = function(){
  this.MouseIsInside = false;
  jQuery("#queueMessage").fadeOut('fast');
  jQuery(".notification-window-message").children().fadeOut('fast');
}
SidoraQueue.prototype.NotificationWindow.ResetError = function(queuedErrors){
  var nw = this;
  nw.showingError = queuedErrors;
}  
SidoraQueue.prototype.updateFooterWithRequestInProcess = function(){
  if (this.requestInProcess != null && !this.requestInProcess.isSilent){
    if (!jQuery("footer").is(":visible")) jQuery("footer").fadeIn();
    jQuery("footer").html("In Queue: <span class='items-left'>"+(1+this.requests.length)+"</span> Currently working on:"+this.requestInProcess.userFriendlyName);
  }else{
    if (jQuery("footer").is(":visible")) jQuery("footer").html("").fadeOut();
  }
  setTimeout(sidora.ResizeTreeToBrowser,1000);
}
SidoraQueue.prototype.Next = function(){
  if (jQuery("footer").length == 0) jQuery("body").parent().append("<footer></footer");
  if (this.requestInProcess == null){
    var nextItem = this.requests.shift();
    if (nextItem instanceof SidoraRequest){
      nextItem.performAjax();
    }
    this.requestInProcess = nextItem;
  }
  this.updateFooterWithRequestInProcess();
}

