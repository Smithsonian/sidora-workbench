/**
 * This class is fully created by Robert Anderson of Quotient-inc.  
 * This class implements a ajax queueing system with a popup notification when complete
 *
 */
var SidoraQueue = function(){};
SidoraQueue.prototype.completedRequests = [];
SidoraQueue.prototype.completedSuccessfulRequests = [];
SidoraQueue.prototype.completedFailedRequests = [];
SidoraQueue.prototype.requests = [];
SidoraQueue.prototype.requestsbkup = [];  // this array was created to keep a copy of the original requests submitted to the queue since the requests array was being overwritten during the Next() function call
SidoraQueue.prototype.timer = {"startTime":'0',"endTime":'0',"elapsedTime":'0'};
SidoraQueue.prototype.pidsInProcess = [];
SidoraQueue.prototype.requestInProcess = null;
SidoraQueue.prototype.incomingRequestsAreSilent = false;
SidoraQueue.prototype.showWarning = function(warning){
  console.log(warning);
}
SidoraQueue.prototype.showMessage = function(message){
  console.log(message);
}
SidoraQueue.prototype.RequestPost = function(userFriendlyName, ajaxRequestUrl, postData, doneFunction, failFunction, pidsBeingProcessed){
  console.log("Requested post '"+userFriendlyName+"' to post to:"+ajaxRequestUrl+postData);
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
    isSilent: this.incomingRequestsAreSilent
  };
  sr.pullFromConfig(sidoraRequestConfig);
  myself.SidoraRequest(sr);
}
/*
 * Reminder: Request and RequestPost are handled differently
 */
SidoraQueue.prototype.Request = function(userFriendlyName, ajaxRequestUrl, doneFunction, failFunction, pidsBeingProcessed){
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
  var sr = (new SidoraRequest(userFriendlyName, ajaxRequestUrl, srDoneFunction, srFailFunction, pidsBeingProcessed));
  sr.isSilent = this.incomingRequestsAreSilent;
  myself.SidoraRequest(sr);
}
SidoraQueue.prototype.SidoraRequest = function(sidoraRequest){
  var myself = this;
  sidoraRequest.pidsBeingProcessed.forEach(function(v){myself.pidsInProcess.push(v);});
  myself.requests.push(sidoraRequest);
	myself.requestsbkup.push(sidoraRequest);
	console.log("in sidorarequest function : "+myself.requestsbkup);
}
SidoraQueue.prototype.Fail = function(completedItem, ajaxReturn){
  completedItem.ajaxReturn = ajaxReturn;
  this.completedRequests.push(completedItem);
  this.completedFailedRequests.push(completedItem);
  this.NotificationWindow.Show("FAILED: " + completedItem.userFriendlyName);
  console.log("fail:"+completedItem);
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
  try{ jsonData = jQuery.parseJSON(jsonString); } catch (e){}
  if (jsonData != null && jsonData.error){
    var toShow = "Did not perform action:"+completedItem.userFriendlyName;
    if (typeof(jsonData.error) == 'string') toShow += " - "+jsonData.error;
    if (typeof(jsonData.description) == 'string') toShow += " - "+jsonData.description;
    for (var i = 0; i < completedItem.pidsBeingProcessed.length; i++){
      var currPid = completedItem.pidsBeingProcessed[i];
      jQuery(jq(currPid)).removeClass("is-being-moved");
    }
    this.NotificationWindow.Show(toShow, true);
  }else{
    if (!completedItem.isSilent) this.NotificationWindow.Show(completedItem.userFriendlyName);
    for (var i = 0; i < completedItem.pidsBeingProcessed.length; i++){
      if (sidora.concept.GetPid() == completedItem.pidsBeingProcessed[i]){
        sidora.concept.LoadContent();
      }
    }
  }
  console.log("done:"+completedItem);
}
SidoraQueue.prototype.NotificationWindow = {"showingError":false};
SidoraQueue.prototype.NotificationWindow.MouseIsInside = false;
SidoraQueue.prototype.NotificationWindow.SecondsOnScreen = 4;
SidoraQueue.prototype.NotificationWindow.UpdateTime = Date.now();
SidoraQueue.prototype.NotificationWindow.Show = function(message, isError){
  var nw = this;
  if (jQuery('#queueMessage').length == 0){
    var notificationWindowHtml = '<div id="queueMessage" style="display:none; position: fixed; bottom: 26px; right: 30px; min-height: 50px; width: 400px;"><div id="" role="tooltip" class="queue-message-block ui-tooltip ui-widget ui-corner-all ui-widget-content" style=" display: block;width: 100%;height: 100%;max-width: 1000px;"><div class="notification-window-message"></div><div class="queue-mb-close" style="background: url(/sites/all/modules/islandora_xml_forms-7.x/elements/css/images/ui-icons_222222_256x240.png) no-repeat -30px -191px;width: 20px;height: 20px;z-index: 100;position: absolute;right: 0;top: 0;"></div></div></div>';
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
  jQuery(".notification-window-message").append("<div>"+message+"</div>");
  jQuery("#queueMessage").height(jQuery("#queueMessage").css("min-height"));
  if (jQuery("#queueMessage")[0].scrollHeight > jQuery("#queueMessage").height()){
    jQuery("#queueMessage").height(jQuery("#queueMessage")[0].scrollHeight);
  }
  jQuery("#queueMessage").fadeIn();
  this.UpdateTime = Date.now();
  if (isError || nw.showingError){
    nw.showingError = true;
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
SidoraQueue.prototype.createQueueMessageBox = function(){
    var messageBoxforFooter = "<div id ='showUploadprogress' style='width:60%;'><div id='toolbar' style='position:relative;background: #FEFEFE;height: 15px;width: 100%;margin:0;padding:0;'><div class='togglesizebutton' style='border:solid 1px;width: 20px;height: 12px;float:right;cursor:pointer;vertical-align:middle;text-align:center;font-weight:bold;color:black;'>"+"-"+"</div></div><div id='progress-window-message' style='padding-top:15px;background:#DFDFDF;width:100%'><div></div></div></div>";
    jQuery("footer").html(messageBoxforFooter);
		jQuery(".togglesizebutton").click(function(){
	  jQuery('#progress-window-message').css({
      'width': jQuery('#progress-window-message').width(),
      'height': jQuery('#progress-window-message').height()
   });
      if(jQuery(".togglesizebutton").html() == "-"){
         jQuery('#progress-window-message').animate({'width': 'toggle'});
         jQuery(".togglesizebutton").html("+");
         var windowHeight = jQuery("#showUploadprogress").height();
         var lineHeight = jQuery('#showUploadprogress #toolbar').height();
         var desiredBottom = jQuery('#progress-window-message').height();
         var newPosition = Math.abs(windowHeight);
				 //    jQuery('#showUploadprogress').animate({ "top": "-=30px" }, 900);
        jQuery('#showUploadprogress #toolbar').animate({top:newPosition},1000,function () {
        jQuery('#showUploadprogress #toolbar').css({
            bottom: 'auto',
            top: newPosition
        });
    });        
		  }
      else{
         jQuery(".togglesizebutton").html("-");
 jQuery('#showUploadprogress #toolbar').animate({top:'auto'},1000,function () {
        jQuery('#showUploadprogress #toolbar').css({
            bottom: 'auto',
            top: 'auto'
        });
    });        
   jQuery('#progress-window-message').animate({'width': 'toggle'});
      }		
 //  jQuery('#showUploadprogress #toolbar').slideDown();
//   jQuery('#showUploadprogress #toolbar').animate({'height': 'toggle'});
	//jQuery("#progress-window-message").slideToggle();
			 });
}  
SidoraQueue.prototype.updateFooterWithRequestInProcess = function(){
		console.log("requestbkup : "+this.requestsbkup);
  if (this.requestInProcess != null && !this.requestInProcess.isSilent){
  if (jQuery("#showUploadprogress").length == 0) this.createQueueMessageBox();
     if (!jQuery("footer").is(":visible")){
		 console.log("footer not visible");
		 jQuery("footer").fadeIn();
		 }
		 var uploadProgress = 1+this.requests.length;
			//	var message = "<span id='uploadProgress'>In Queue: <span class='items-left'>"+uploadProgress+"</span> Currently working on:"+this.requestInProcess.userFriendlyName+" time elapsed "+elapsedTime+"</span>";
			var requestAction = '';
			var requestuserFriendlyname = this.requestInProcess.userFriendlyName.toLowerCase();
			if (requestuserFriendlyname.indexOf("create") >= 0){
			  requestAction = "Uploading";
			}else{
			  if (requestuserFriendlyname.indexOf("remove") >= 0){
			   requestAction = "Deleting";	
				}else{
				 requestAction = "Working on";
				} 
			}	
			if (this.timer.elapsedTime > 0){
			  	var timeLeft = parseInt((uploadProgress*this.timer.elapsedTime)/1000) ;
					if (timeLeft < 60){
					  var message = "<span id='uploadProgress'>"+requestAction+" <span class='items-left'>"+(this.requestsbkup.length - this.requests.length)+"</span> of "+this.requestsbkup.length+" "+Math.ceil(timeLeft)+" seconds to completion</span>";
					}else{
					  var message = "<span id='uploadProgress'>"+requestAction+" <span class='items-left'>"+(this.requestsbkup.length - this.requests.length)+"</span> of "+this.requestsbkup.length+" "+Math.ceil(timeLeft/60)+" "+((Math.ceil(timeLeft/60) > 1)?"minutes":"minute")+" to completion</span>";
          }
       }else{
			 		var message = "<span id='uploadProgress'>"+requestAction+" <span class='items-left'>"+(this.requestsbkup.length - this.requests.length)+"</span> of "+this.requestsbkup.length+"</span>";
       }
	       jQuery("#progress-window-message").html(message);
			console.log("in update footer the request being currently processed is "+this.requestInProcess.userFriendlyName);

  }else{
   if (jQuery("footer").is(":visible"))jQuery("footer").html("").fadeOut();
			if (this.requests.length == '0'){
		   this.requestsbkup = [];
			 this.timer.startTime ='0';
		   this.timer.endTime = '0';
			 this.timer.elapsedTime = '0';
			 console.log("just reset the timer and requestsbkup in updatefooter method");
		 }
  }
}
/*SidoraQueue.prototype.Next = function(){
  if (jQuery("footer").length == 0) jQuery("body").parent().append("<footer></footer");
  if (this.requestInProcess == null){
    var nextItem = this.requests.shift();
    if (nextItem instanceof SidoraRequest){
      nextItem.performAjax();
    }
    this.requestInProcess = nextItem;
  }
  this.updateFooterWithRequestInProcess();
}*/
SidoraQueue.prototype.Next = function(){
  if (jQuery("footer").length == 0) jQuery("body").parent().append("<footer></footer");
  console.log("in queue next currently processing "+this.requestInProcess);
  if (this.requestInProcess == null){
    var nextItem = this.requests.shift();
    if (nextItem instanceof SidoraRequest){
	if (this.timer.elapsedTime == '0'){
		if (this.timer.startTime == '0'){
	   this.timer.startTime = jQuery.now();
		 console.log("start time is :"+this.timer.startTime);
		 console.log(this.requestsbkup.indexOf(nextItem));
		}else{
		if (this.timer.endTime == '0'){
			this.timer.endTime = jQuery.now();
		 console.log("end time is :"+this.timer.endTime);
		 console.log(this.requestsbkup.indexOf(nextItem));
		  this.timer.elapsedTime = this.timer.endTime - this.timer.startTime;
			console.log("elapsed time is : "+this.timer.elapsedTime);
		}else{
		  this.timer.elapsedTime = this.timer.endTime - this.timer.startTime;
		}
		}
	}		
			   nextItem.performAjax();
    }
		this.requestInProcess = nextItem;
  }
	this.updateFooterWithRequestInProcess();
}
