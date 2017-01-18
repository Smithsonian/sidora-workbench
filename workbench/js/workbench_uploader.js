window.batchRequests = [];
jQuery().ready(function(){
  window.currentInfo = {};
  var myLoc = decodeURIComponent(window.location.pathname);
  if (myLoc.indexOf("edit_metadata")>0){
    window.currentInfo.type = "EditMetadata";
    // need to send this to sidora queue done() to force a refresh after edit metadata is finished
  }else{  // code for create resource
     if (myLoc.indexOf("metabulk") != -1){
      window.currentInfo.type = "batchIngest";
      window.currentInfo.parentPid = myLoc.split("/").splice(-6)[0];
      window.currentInfo.model = myLoc.split("/").splice(-6)[1];
      window.currentInfo.ontologyId = myLoc.split("/").splice(-6)[3];
      window.currentInfo.formname = myLoc.split("/").splice(-6)[2];
     }else{
      window.currentInfo.type = "CreateResource";
      window.currentInfo.parentPid = myLoc.split("/").splice(-4)[0];
      window.currentInfo.model = myLoc.split("/").splice(-4)[1];
      window.currentInfo.ontologyId = myLoc.split("/").splice(-4)[3];
      window.currentInfo.formname = myLoc.split("/").splice(-4)[2];
     }
  }
  jQuery("body").css("padding-top","0px");
  jQuery(".form-submit[value=Ingest]").hide();
  jQuery(".form-submit[value=Submit]").hide();
  jQuery(".form-submit[value=Update]").hide();
  jQuery(".sidora-ingest-form-holder").hide();
  jQuery(".sidora-ingest-form-holder").first().show();
  window.currentlyShownIndex = 0;
  if (jQuery(".sidora-ingest-form-holder").length >1){
    jQuery(".top-panel").append("<input value=\"Prev\" class='form-submit sidora-form-button sidora-form-prev'></input>");
    jQuery(".bottom-panel").append("<input value=\"Prev\" class='form-submit sidora-form-button sidora-form-prev'></input>");
    jQuery(".top-panel").append("<input value=\"Next\" class='form-submit sidora-form-button sidora-form-next'></input>");
    jQuery(".bottom-panel").append("<input value=\"Next\" class='form-submit sidora-form-button sidora-form-next'></input>");
  }   
  jQuery(".sidora-form-prev").first().addClass("form-button-disabled");
  jQuery(".sidora-form-next").last().addClass("form-button-disabled");
  jQuery(".sidora-form-prev:eq(1)").addClass("form-button-disabled");
  jQuery(".sidora-form-next:eq(-2)").addClass("form-button-disabled");
  jQuery(".top-panel").append("<input value=\"Finish\" class='form-submit sidora-form-finish' style='float:right;'></input>");
  jQuery(".bottom-panel").append("<input value=\"Finish\" class='form-submit sidora-form-finish' style='float:right;'></input>");
  jQuery(".sidora-form-prev").not(".form-button-disabled").click(function(e){ 
    window.showPrev();  
    jQuery(".form-submit[value=Update]").hide();
  });
  jQuery(".sidora-form-next").not(".form-button-disabled").click(function(e){ 
    window.showNext();
    jQuery(".form-submit[value=Update]").hide();
  });
  jQuery("#create-new-codebook").click(function(e){ window.createCodebook(); });
  if (window.currentInfo.formname == 'Codebook'){
    jQuery(".sidora-form-button").hide();
    jQuery(".sidora-form-finish").attr('value','Create and use this Codebook').css("width","220px");
    jQuery(".sidora-form-finish").after("<input id='codebook-cancel' value=\"Cancel\" class='form-submit sidora-form-cancel'></input>");
    jQuery("#codebook-cancel").click(function(){
      window.parent.ifhRemove();
    });
    jQuery(".sidora-form-finish").click(function(e){ 
      var toIterate = jQuery(".sidora-ingest-form-holder");
      var toSubmit = true;
	for (var i = 0; i < toIterate.length; i++){
          if ((jQuery(toIterate[i]).find("form").find("[name='form_name']").length > 0) && (jQuery(toIterate[i]).find("form").find("[name='form_name']").val().toLowerCase().indexOf('codebook') != -1)) {
            var needVals = jQuery(".form-required").closest("div").find("input[type=text], textarea").filter(function(){return this.value == "";});
            if (needVals.length >0){
	      toSubmit = false;
	      if (jQuery(".messages.error").length == 0){
	        if (jQuery(".messages.status").length == 0){
		  jQuery("#content").find(".element-invisible").after('<div id = "console" class="clearfix"><div class = "messages error"></div></div>');
		}
		else{
		 jQuery(".messages.status").after('<div class = "messages error"></div>');
		} 	
	      }
       	      for (var x = 0; x < needVals.length; x++){
                var label = jQuery("label[for='"+jQuery(needVals[i]).attr('id')+"']").html();
	        jQuery(".messages").filter(".error").html(label + ' is required');
		jQuery(needVals[i]).addClass('error');
              } 
	    }else{
	       var formId = jQuery(toIterate[i]).find("form").attr('id');
               window.prepIslandoraFormForSubmit(formId, updateCodebookComplete);
	    }	
	  }else{
	    var formId = jQuery(toIterate[i]).find("form").attr('id');
            window.prepIslandoraFormForSubmit(formId, updateCodebookComplete);
          }
      }
      if (toSubmit)
	window.startBatch();
    });
  }else{
    jQuery(".sidora-form-finish").click(function(e){ window.submitAll(); });
  }
  jQuery(".sidora-form-cancel").click(function(e){
    if (window.parent.sidora && window.parent.sidora.CloseIFrame){
      window.parent.sidora.CloseIFrame('');
    }else{
      console.log("This is not in the expected IFrame");
    }
  });
	if (location.href.indexOf('metabulk') != '-1'){
	 jQuery(".sidora-form-prev").addClass("form-button-disabled");
	 jQuery(".sidora-form-next").addClass("form-button-disabled");
	}
});//ends ready

window.ifhRemove = function(){
  jQuery("#ifh").remove();
}
/**
 * Called by the codebook creation iframe to update the form with the new codebook that was just created or edited
 */
window.updateCodebookComplete = function(formName, ajaxCall, data){
  if (window != window.parent && window.parent.updateCodebookComplete){
    window.parent.updateCodebookComplete(formName, ajaxCall, data);
  }else{
    newPid = window.successfulCreationPid(data);
    if (newPid == "") newPid = window.editedMetadataPid(data);
    jQuery("#user_supplied_codebook_pid").val(newPid);
    jQuery("#edit-continue").click();
  }
}
/*
 * When user has uploaded multiple files this shows the previous entry
 */
window.showPrev=function(){
  window.currentlyShownIndex--
  jQuery(".sidora-ingest-form-holder").hide();
  jQuery(jQuery(".sidora-ingest-form-holder")[currentlyShownIndex]).show();
}
/*
 * When user has uploaded multiple files this shows the next entry
 */
window.showNext=function(){
  window.currentlyShownIndex++;
  jQuery(".sidora-ingest-form-holder").hide();
  jQuery(jQuery(".sidora-ingest-form-holder")[currentlyShownIndex]).show();
}
/*
 * Gathers the information to submit all of the forms, then calls the startBatch function to do the submissions
 */
window.submitAll=function(){
  var toIterate = jQuery(".sidora-ingest-form-holder");
  var toSubmit = true;
  for (var i = 0; i < toIterate.length; i++){
    if ((jQuery(toIterate[i]).find("form").find("[name='form_name']").length > 0) && (jQuery(toIterate[i]).find("form").find("[name='form_name']").val().toLowerCase().indexOf('codebook') != -1)) {
      var needVals = jQuery(".form-required").closest("div").find("input[type=text], textarea").filter(function(){return this.value == "";});
      if (needVals.length >0){
        toSubmit = false;	
	if (jQuery(".messages.error").length == 0){
	  if (jQuery(".messages.status").length == 0){
	    jQuery("#content").find(".element-invisible").after('<div id = "console" class="clearfix"><div class = "messages error"></div></div>');
	  }
	  else{
	    jQuery(".messages.status").after('<div class = "messages error"></div>');
	  } 	
	}
	for (var x = 0; x < needVals.length; x++){
          var label = jQuery("label[for='"+jQuery(needVals[i]).attr('id')+"']").html();
	  jQuery(".messages").filter(".error").html(label + ' is required');
	  jQuery(needVals[i]).addClass('error');
        } 
      }else{
        var formId = jQuery(toIterate[i]).find("form").attr('id');
        window.prepIslandoraFormForSubmit(formId, updateCodebookComplete);
      }	
    }else{
      var formId = jQuery(toIterate[i]).find("form").attr('id');
      if (formId.search('islandora-ingest-form') != '-1'){
				var toConsole = function(){console.log('finished');};  // create resource success function
        window.prepIslandoraFormForSubmit(formId, toConsole );
      }else{
	var toConsole = function(){sidora.concept.forceRefreshOnNextLoadContent = true;sidora.concept.LoadContent();sidora.util.refreshPidInTree();};
        var onFailure = function(){jQuery("#edit-update").click();};
	var sidora = window.parent.sidora;
	if (typeof(sidora.queue) != "undefined"){
	  sidora.queue.completedFailedRequests = sidora.queue.completedFailedRequests.filter(function( obj ) {
          return obj.pid !== jQuery("[name='Pid']").val();
          });
          window.parent.jQuery('#queueMessage').find('.notification-window-message').find('a[class="' + jQuery("[name='Pid']").val() + '"]').parent().remove();
	  if (sidora.queue.completedFailedRequests.length == 0){
	    window.parent.jQuery('#queueMessage').fadeOut('fast');
	    sidora.queue.NotificationWindow.ResetError(false);
	  }	
	}	
      window.prepIslandoraFormForSubmit(formId, toConsole, onFailure);
    } 
  }
 }
 if (toSubmit)
   window.startBatch();
}

/**
 * Uses the sidora queue system to submit the forms.  
 *
 * If the sidora queue is not available: (NOT TYPICAL)
 *   overlays the screen 
 *   takes a submission from the stack, performs it 
 *   performs a call on itself (to do next in batch)
 *   if nothing left in batch, end
 */
window.startBatch = function(){
  var sidora = window.parent.sidora;
  if (typeof(sidora) != "undefined"){
    console.log("Total requests in this batch :"+window.batchRequests.length);
    for (var i = 0; i < window.batchRequests.length; i++){
      var ajaxSettings = window.batchRequests[i];
      var postData = ajaxSettings.data;
      var ccSuccess = oldSuccess;
     // var onSuccess = function(){console.log("FINISH! "+friendlyName);};
      var onSuccess = ajaxSettings.success;
			if (currentInfo.type == 'EditMetadata'){
        var type = "Resource";
        //Check to see if edit metadata of current concept
        if (window.location.href.substring(window.location.href.lastIndexOf("/")+1) == window.parent.sidora.concept.GetPid()) {
          type = "Concept";
        }
        var friendlyName = " Edit MetaData of "+type+":"+(i+1)+" of "+window.batchRequests.length;
        sidora.queue.RequestPost(friendlyName,ajaxSettings.url,postData, onSuccess, function(){}, ajaxSettings.pidsOfInterest,'editMeta',i+' of '+window.batchRequests.length);
      }else{
			  if (currentInfo.type == 'batchIngest'){
          var friendlyName = " Submiting a batch ingest for "+currentInfo.formname;
          sidora.queue.RequestPost(friendlyName,ajaxSettings.url,postData, onSuccess, function(){}, currentInfo.parentPid,'batchIngest');
			  }else{	
          var friendlyName = " Create "+currentInfo.formname+" Resource:"+(i+1)+" of "+window.batchRequests.length;
          sidora.queue.RequestPost(friendlyName,window.location.href,postData, onSuccess, function(){}, currentInfo.parentPid,'createResource',i+' of '+window.batchRequests.length);
        } 
			}	
    }
    sidora.queue.Next();
    window.closeMyself();
    return;
  }
  if (jQuery(".overlay").length == 0){
    var overlay = jQuery('<div class="overlay" style=""> </div>');
    overlay.appendTo(document.body);
    var overlay2 = jQuery('<div class="overlay-top" style=""><h1><span class="num-complete">0</span></h1> of '+window.batchRequests.length+' Completed</div>');
    overlay2.appendTo(document.body);
    window.numComplete = 0;
  }

  var ajaxSettings = window.batchRequests.shift();
  if (typeof(ajaxSettings) == 'undefined'){
    //The entire batch has completed
    console.log('completed batch');
    window.closeMyself();
    return;
  }
  var oldSuccess = ajaxSettings.success;
  ajaxSettings.success = function(data){
    oldSuccess(data);
    if (window != null && typeof(window.numComplete) != 'undefined') jQuery(".num-complete").html(++window.numComplete);
    if (typeof(window.parent.updateCodebookComplete) == 'function'){
      window.parent.updateCodebookComplete('','',data);
    }
    window.startBatch();  //Performs next in batch
  }
  //This is the normal submit of the codebook
  jQuery.ajax(ajaxSettings);
}
/*
 * Pulls the newly created pid from the Islandora success page
 */
window.successfulCreationPid = function(data){
  return data.substring(0,data.indexOf(")"+" has been ingested")).substring(data.substring(0,data.indexOf(")"+" has been ingested")).lastIndexOf("si:"))
}
/*
 * Pulls the pid from a metadata edit Islandora success page
 */
window.editedMetadataPid = function(data){
  var re = new RegExp('<dt property="dcterms:identifier" content="(.*)" class="dc-identifier">');
  var foundInfo = re.exec(data);
  if (!Array.isArray(foundInfo)) return "";
  if (foundInfo.length < 2) return "";
  return foundInfo[1];
}
/*
 * Attempts to close the window if it's in a child frame
 */
window.closeMyself = function(newPid){
  if (window.parent.sidora && window.parent.sidora.CloseIFrame){
    window.parent.sidora.CloseIFrame(newPid, 'simple close');
  }else{
    //Codebook creation process has no parent.sidora, put any necessary processing for it here.
  }
}
/*
 * SI wants to put items into the Fedora Repository without filling in any information
 * But they want to say that certain fields should be filled in
 * In the end the ones where not all of their information was entered ends up with the RED X in the resource list
 * and ones where information was filled in has a green check mark
 *
 * So, the legacy system that was brought across is to use the Islandora XML Forms editor
 * and mark fields as "required"
 *
 * So, how the 0.4 workbench system deals with that:
 * The Islandora XML Form Editor code when creating the form marks these as "required" in Drupal (0.4 does not alter any Islandora code)
 * The Sidora code uses Drupal form alter to unmark them as required (so the form can be submitted)
 * The Sidora code adds HTML with the class "form-required" to the title field of these inputs
 * This javascript looks at the code to figure out if all of the information that was marked was actually filled in
 * It is then sent along with the data to set the flag that is used for the check mark or RED X
 */
window.setWhetherMetaEntered = function(){
  jQuery("[name=all_meta_entered]").val('TRUE');
  var needVals = jQuery(".form-required").closest("div").find("input[type=text], textarea").filter(function(){return this.value == "";});
  for (var i = 0; i < needVals.length; i++){
    jQuery(needVals[i]).closest("form").find("[name=all_meta_entered]").val('FALSE');
  }
}
/*
 * Adds the information from the specified form name and puts it on the end of the batch of current requests
 * Does not start a form submittal
 *   formName - the form id name
 *   onSuccessfulFormSubmit - function called when success, if invalid param sent then calls successfulCreationPid and closeMyself
 *   onFailureOfFormSubmit - function called when failure, if invalid param sent then clicks "next"
 *        "edit-next" performs the Islandora submit default so the error can be shown to the user
 */
window.prepIslandoraFormForSubmit = function(formName, onSuccessfulFormSubmit, onFailureOfFormSubmit){
  //if (jQuery("#create-resource-form").length){
  window.setWhetherMetaEntered();
  if (onSuccessfulFormSubmit == null || typeof(onSuccessfulFormSubmit) != "function"){
    onSuccessfulFormSubmit = function(ajaxCall, data){
        //If successful, kill itself.
			  newPid = window.successfulCreationPid(data);
        window.closeMyself(newPid);
    }
  }
  if (onFailureOfFormSubmit == null || typeof(onFailureOfFormSubmit) != "function"){
    onFailureOfFormSubmit = function(formName, ajaxCall, data){
        //If not successful, reload the page so that the user can see why
        jQuery("#edit-next").click();
    }
  }
  if (jQuery("#create-resource-form").length){
    if (window.location.pathname.indexOf('metabulk') != -1){
		  // ajax request will be different for batch request since we're only getting a co-relation id on successful execution not a new object
			ajaxUrl = window.location.pathname.substring(0,window.location.pathname.indexOf('//metabulk'));
		ajaxSettings = ({
      type: "POST",
      url: ajaxUrl,
      data: jQuery("#"+formName).serialize()+"&ingest=Ingest",
      success: function(xhr,data ) {
					console.log(onSuccessfulFormSubmit.toString())
					onSuccessfulFormSubmit.apply(formName,this, data);
      },
      dataType: "text"
    });//ends ajax settings
		}
				else{
		  ajaxUrl = window.location;
			ajaxSettings = ({
      type: "POST",
      url: window.location,
      //url: Drupal.settings.basePath+"/pure",
      //url: window.location.origin+Drupal.settings.basePath+'sidora/test/edit_metadata',
      data: jQuery("#"+formName).serialize()+"&ingest=Ingest",
      success: function(xhr,data ) {
	if (data[0].indexOf(")"+" has been ingested") > 0){ //it would trigger success off of reading this inline JS, so break it up
	  onSuccessfulFormSubmit.apply(formName, this, data);
        }else{
          onFailureOfFormSubmit(formName, this, data);
        }
      },
      dataType: "text"
    });//ends ajax settings
		}		

  }else{
    if (window.location.href.search('&') != '-1'){
      var ajaxUrl = sidora_util.ajaxUrl(jQuery("#"+formName).attr("count"));
    }else{
      if (window.location.href.indexOf('retry') > 0) {
        var ajaxUrl = sidora_util.ajaxUrl(0);
      }else{  
        var ajaxUrl = window.location.href;
      } 
    }
    ajaxSettings = ({
      type: "POST",
      url: ajaxUrl,
      data: jQuery("#"+formName).serialize()+"&op=Submit&update=Update",
      success: function( data ) {
         if (data.indexOf("<h2 class=\"element-invisible\">Error message</h2") != -1){
           //If not successful, reload the page so that the user can see why
           // store this error/failure in a queue message area with the proper SID to process after end of the current queue
           
           jQuery("#edit-update").click();
           jQuery(".theoverlay").remove();
         }
      },
      dataType: "text",
      pidsOfInterest: jQuery("#"+formName).attr("name")
    });//ends ajax settings
  }
  window.batchRequests.push(ajaxSettings);
}//ends function prepIslandoraFormForSubmit

/**
 * Creates an iframe to handle the codebook creation
 */
window.createCodebook = function(){
  
  jQuery("html").css("height","100%");
  jQuery("body").css("height","100%");
  var iframeUrl = Drupal.settings.basePath+"sidora/edit_metadata/"+jQuery("#codebook-pid").val();
  jQuery("body").append("<div id='ifh' style='width:100%;height:100%;position:absolute;top:0;left:0;opacity:0.5;background:black;'><iframe width='100%' height='99%' id='myiframe' src='"+iframeUrl+"'iframe></div>");
  setTimeout(function(){
    jQuery("#ifh").css("opacity","");
  },1000);
}
window.reference_createCodebook = function(){
  jQuery("html").css("height","100%");
  jQuery("body").css("height","100%");
  var iframeUrl = Drupal.settings.basePath+"sidora/create_resource/"+window.currentInfo.parentPid+"/si%3AcodebookCModel/Codebook/";
  jQuery("body").append("<div id='ifh' style='width:100%;height:100%;position:absolute;top:0;left:0;opacity:0.5;background:black;'><iframe width='100%' height='99%' id='myiframe' src='"+iframeUrl+"'iframe></div>");
  setTimeout(function(){
    jQuery("#ifh").css("opacity","");
  },1000);
}
