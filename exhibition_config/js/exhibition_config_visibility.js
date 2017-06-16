
/*
 * Copyright 2015 Smithsonian Institution.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.You may obtain a copy of
 * the License at: http://www.apache.org/licenses/
 *
 * This software and accompanying documentation is supplied without
 * warranty of any kind. The copyright holder and the Smithsonian Institution:
 * (1) expressly disclaim any warranties, express or implied, including but not
 * limited to any implied warranties of merchantability, fitness for a
 * particular purpose, title or non-infringement; (2) do not assume any legal
 * liability or responsibility for the accuracy, completeness, or usefulness of
 * the software; (3) do not represent that use of the software would not
 * infringe privately owned rights; (4) do not warrant that the software
 * is error-free or will be maintained, supported, updated or enhanced;
 * (5) will not be liable for any indirect, incidental, consequential special
 * or punitive damages of any kind or nature, including but not limited to lost
 * profits or loss of data, on any basis arising from contract, tort or
 * otherwise, even if any of the parties has been warned of the possibility of
 * such loss or damage.
 *
 *
 * This distribution includes several third-party libraries, each with their own
 * license terms. For a complete copy of all copyright and license terms, including
 * those of third-party libraries, please see the product release notes.
 */
jQuery(function() {
  jQuery("body").css("padding-top","0px");
    var prev = -1;
    jQuery( "#selectable>ul" ).selectable({
    filter: "ul>li",
    selecting: function(e, ui) {
        var curr = jQuery(ui.selecting.tagName, e.target).index(ui.selecting);
        if(e.shiftKey && prev > -1) {
            jQuery(ui.selecting.tagName, e.target).slice(Math.min(prev, curr), 1 + Math.max(prev, curr)).addClass("ui-selected");
            prev = -1;
        } else {
            prev = curr;
        }
    },
    stop: function(event, ui) {
        var result =[];
        jQuery( "li.ui-selected", this ).each(function() {
          result.push( this.id);
        });
      }
  });
  jQuery( ".accordion >div" ).accordion({header: "h3", collapsible: true});
});
fillInSidebar = function(){
  var totalAdded;

  totalAdded = 0;
  jQuery("#main_shown .fieldset-wrapper").html("");
  jQuery("[id$='show-name']:checked").not("[id$='future-children-show-name']").each(function(){
    jQuery("#main_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
    totalAdded++;
  });
  jQuery("#main_shown .summary").html("("+totalAdded+")");

  totalAdded = 0;
  jQuery("#main_hidden .fieldset-wrapper").html("");
  jQuery("[id$=show-name]").not(":checked").not("[id$='future-children-show-name']").each(function(){
    jQuery("#main_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
    totalAdded++;
  });
  jQuery("#main_hidden .summary").html("("+totalAdded+")");

  totalAdded = 0;
  jQuery("#meta_shown .fieldset-wrapper").html("");
  jQuery("[id$=show-meta]:checked").not("[id$='future-children-show-meta']").each(function(){
    jQuery("#meta_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
    totalAdded++;
  });
  jQuery("#meta_shown .summary").html("("+totalAdded+")");

  totalAdded = 0;
  jQuery("#meta_hidden .fieldset-wrapper").html("");
  jQuery("[id$=show-meta]").not(":checked").not("[id$='future-children-show-meta']").each(function(){
    if (jQuery(jQuery(this).closest("li").children()[3]).find("input:checked").size() > 0){
      jQuery("#meta_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
      totalAdded++;
    }
  });
  jQuery("#meta_hidden .summary").html("("+totalAdded+")");

  totalAdded = 0;
  jQuery("#preview_shown .fieldset-wrapper").html("");
  jQuery("#exhibition-permission-form [id$=show-preview]:checked").not("[id$='future-children-show-preview']").each(function(){
    jQuery("#preview_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
    totalAdded++;
  });
  jQuery("#preview_shown .summary").html("("+totalAdded+")");

  totalAdded = 0;
  jQuery("#preview_hidden .fieldset-wrapper").html("");
  jQuery("exhibition-permission-form [id$=show-preview]").not(":checked").not("[id$='future-children-show-preview']").each(function(){
    if (jQuery(jQuery(this).closest("li").children()[3]).find("input:checked").size() > 0){
      jQuery("#preview_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
      totalAdded++;
    }
  });
  jQuery("#preview_hidden .summary").html("("+totalAdded+")");

  totalAdded = 0;
  jQuery("#downloads_shown .fieldset-wrapper").html("");
  jQuery("[id$=allow-download]:checked").not("[id$='future-children-allow-download']").each(function(){
    jQuery("#downloads_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
    totalAdded++;
  });
  jQuery("#downloads_shown .summary").html("("+totalAdded+")");

  totalAdded = 0;
  jQuery("#downloads_hidden .fieldset-wrapper").html("");
  jQuery("[id$=allow-download]").not(":checked").not("[id$='future-children-allow-download']").each(function(){
    if (jQuery(jQuery(this).closest("li").children()[3]).find("input:checked").size() > 0){
      jQuery("#downloads_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
      totalAdded++;
    }
  });
  jQuery("#downloads_hidden .summary").html("("+totalAdded+")");
}
resizeConceptTreePage = function() {
  jQuery("#concept_tree").parent().height(jQuery(window).innerHeight()-(jQuery("#page").offset().top + 25));
}
jQuery(function(){
  fillInSidebar();
  resizeConceptTreePage();
  jQuery("#concept_tree li:even").addClass("light-background");
  jQuery("#open-advanced").after(jQuery("#edit-save"));
  jQuery(window).resize(resizeConceptTreePage);
  jQuery("input:checkbox").click(function(){
  if (jQuery(this).is(":checked")){
      var invisibleParents = [];
      var message = "";
      message += "<ul>";
      var pidPath = jQuery(this).attr("path");
      var path = pidPath.split("/");
      pid = "";
      for (ctr=0;ctr<path.length;ctr++){
        if (pid == "") {
          message = "In order to display this object and its information, the object and a path through the exhibition needs to be displayed. If you confirm, the following items will be shown."+message;
          pid = path[ctr];
        }else{
          pid = pid+"/"+path[ctr];
        }
        visibilityToCheck = "visibility["+pid+"][show_name]";
        if (!(jQuery("[name=\'"+visibilityToCheck+"\']").is(":checked"))) {      
          invisibleParents.push(visibilityToCheck);
          message += "<li>" + jQuery("[name=\'"+visibilityToCheck+"\']").attr("label")+"</li>";
        }
      }
      message += "</ul>";
      if (invisibleParents.length > 0){
        var resetCheckboxID = jQuery(this).attr("id");
        var selectedCheckbox = this;
        changeParentConfirm("Visibility Settings Change", message, 
          function(){ 
            setToChecked(invisibleParents);
            //store and restore the current settings for this object
            var changeBack = jQuery(selectedCheckbox).closest("li").find("input").filter(
              function(){
                if (jQuery(this) == jQuery(selectedCheckbox)) return false;
                if (jQuery(this).attr("name").indexOf("[show_name]") != -1) return false;
                return true;
              }
            );
            var objSettings = changeBack.map(function(){return jQuery(this).prop("checked");});
            changedShowName(pidPath, true);
            for (ctr=0;ctr<changeBack.length;ctr++) {
              jQuery(changeBack[ctr]).prop("checked",objSettings[ctr]);
            }
          },
          function(){ jQuery("#"+resetCheckboxID).prop("checked",false); }
        ); 
      }
      else {
        if (jQuery(this).attr("name").indexOf("[show_name]") != -1) {
          changedShowName(pidPath, true);
        }
      }
    }
    else {
      if (jQuery(this).attr("name").indexOf("[show_name]") != -1) {
        var pidPath = jQuery(this).attr("path");
        var linesToBeHidden = getUL(pidPath).find("li").filter(
          function(){
            return jQuery(this).find("input:checked").length > 0;
          }
        );
        var message = "When hiding this concept, all children and child trees will be hidden. If you confirm, the concept and the following items will be hidden.";
        message += "<ul>";
        for (ctr=0;ctr<linesToBeHidden.length;ctr++){
          message += "<li>"+ jQuery(linesToBeHidden[ctr]).attr("name") + "</li>";
        }
        message += "</ul>";
        if (linesToBeHidden.length > 0){ //This is a concept with children that will be changed
          var resetCheckboxID = jQuery(this).attr("id");
          var pidPath = jQuery(this).attr("path");
          changeParentConfirm("Visibility Settings Change", message, 
            function(){ changedShowName(pidPath, false); },
            function(){ jQuery("#"+resetCheckboxID).prop("checked",true); }
          ); 
        }
        else {  //This is a resource of concept with no children that change, just hide it
          changedShowName(pidPath, false);
        }
      }
    }
    fillInSidebar();
  }); //Ends jQuery("input:checkbox").click
  jQuery("#change_all").click(changeAllWindow);
  jQuery("#open-advanced").click(openAdvancedWindow);
  jQuery("input[type='submit']").click(function(event) {
    if (jQuery("[name$='\\[allow_download\\]']:not(:checked)").length > 0) {
      event.preventDefault();
      return previewWithoutDownloadCheck();
    }
    else{
      return true;
    }		
  });
}); //Ends openAdvanced click
/*
 * When turning on show name, also show everything about the concept or resource automatically
 * When turning off show name, everything about the item should be hidden
 *
 * For concepts, turning on shows everything under them.
 * For concepts, turning off hides everything under them
 */
changedShowName = function(pidPath, changedTo) {
  jQuery("[path='"+pidPath+"']").prop("checked",changedTo);
  getUL(pidPath).find("li").each(function(){
    var currPath = jQuery(this).attr("depth");
    jQuery("[path='"+currPath+"']").prop("checked",changedTo);
  });
  fillInSidebar();
}
/*
 * Helper to get the UL for any pid path since root is a special case
 */
getUL = function(pidPath){
  docElementForUL = document.getElementById(pidPath);
  if (docElementForUL != null && pidPath.indexOf("/") == -1){
    docElementForUL = jQuery(docElementForUL).closest("ul"); //Special if root since that is not a normal pid path
  }
  return jQuery(docElementForUL);
}

changeSelected = function(visibilitySettings) {
  jQuery("li.ui-selected").each(function() {
    if (visibilitySettings.showName != 'indeterminate')
      jQuery("[name='visibility["+jQuery(this).attr("depth")+"][show_name]']").prop("checked",visibilitySettings.showName=="checked");
    if (visibilitySettings.showMeta != 'indeterminate')
      jQuery("[name='visibility["+jQuery(this).attr("depth")+"][show_meta]']").prop("checked",visibilitySettings.showMeta=="checked");
    if (jQuery(this).children("div")[1].innerHTML == 'Resource') {
      if (visibilitySettings.showPreview != 'indeterminate')
        jQuery("[name='visibility["+jQuery(this).attr("depth")+"][show_preview]']").prop("checked",visibilitySettings.showPreview=="checked");
      if (visibilitySettings.allowDownload != 'indeterminate')
        jQuery("[name='visibility["+jQuery(this).attr("depth")+"][allow_download]']").prop("checked",visibilitySettings.allowDownload=="checked");
      if (visibilitySettings.showDegraded != 'indeterminate'){
	if ((jQuery("[name='visibility["+jQuery(this).attr("depth")+"][show_name]']").attr("model")).toLowerCase().indexOf("image") !== -1)
         jQuery("[name='visibility["+jQuery(this).attr("depth")+"][show_degraded]']").prop("checked",visibilitySettings.showDegraded=="checked");
      }
    }
  });
  fillInSidebar();
}
changeAdvanced = function(visibilitySettings) {
  for (ctr=0;ctr<visibilitySettings.length;ctr++){
    var settingName = 'visibility[' + visibilitySettings[ctr].name + '][future_children_' + visibilitySettings[ctr].setting + ']';
    jQuery("[name='" + settingName + "']").prop("checked",visibilitySettings[ctr].value);
  }
}   
setToChecked = function(namesOfCheckboxes) {
  for (ctr=0;ctr<namesOfCheckboxes.length;ctr++){
    jQuery("[name='" + namesOfCheckboxes[ctr] + "']").prop("checked",true);
  }
}   
changeParentConfirm = function(title, questionText, onConfirmation, onCancel, confirmButtonText, cancelButtonText, onAnyClose){
  if (typeof(onConfirmation) != 'function') onConfirmation = function(){};
  if (typeof(onCancel) != 'function') onCancel = function(){};
  if (typeof(onAnyClose) != 'function') onAnyClose = function(){};
  if (typeof(confirmButtonText) != 'string') confirmButtonText = "Confirm";
  if (typeof(cancelButtonText) != 'string') cancelButtonText = "Cancel";
  jQuery('#userConfirm').remove();
  jQuery("body").append("<div id='userConfirm' style='display:none;' title='"+title+"'><div>"+questionText+"</div></div>");
  var dialogConfig = {
    resizable: true,
    height:305,
    width: 400,
    modal: true,
    buttons: {},
    close: function(){
      onAnyClose(this, arguments);
    }
  };
  dialogConfig.buttons[confirmButtonText] = function() {
    onConfirmation(this, arguments);
    jQuery( this ).dialog( "close" );
  };
  dialogConfig.buttons[cancelButtonText] = function() {
    onCancel(this, arguments);
    jQuery( this ).dialog( "close" );
  }
  jQuery("#userConfirm").dialog(dialogConfig);
}
openAdvancedWindow = function(){
  var conceptsInTree = jQuery("li.visibility-row").filter(function(){return jQuery(this).children("div")[1].innerHTML == 'Concept';})
  if (conceptsInTree.length >0){
    jQuery('#changeAdvanced').remove();
    var visibilitySettings = ['show_name','show_meta','show_preview','show_degraded','allow_download'];
    var checkboxesHtml = "<div class='dialog_concept_tree'>";
    checkboxesHtml += "<ul class='visibility-list-table'>";
    checkboxesHtml += "<li id='dialog-header' class='nomarginnopad'>";
    checkboxesHtml += "<div class='visibility-name nomarginnopad'><br/><br/><br/><br/>Name</div>";
    checkboxesHtml += "<div class='visibility-type nomarginnopad'>&nbsp;</div>";
    checkboxesHtml += "<div class='visibility-path nomarginnopad'><br/><br/><br/><br/>Full Path</div>";
    checkboxesHtml += "<div class='visibility-setting nomarginnopad'><br/>Future Children Show Name</div>";
    checkboxesHtml += "<div class='visibility-setting nomarginnopad'><br/>Future Children Show Metadata</div>";
    checkboxesHtml += "<div class='visibility-setting nomarginnopad'>Future Resource Children Show Preview</div>";
    checkboxesHtml += "<div class='visibility-setting nomarginnopad'>Future Resource Children Show Degraded</div>";
    checkboxesHtml += "<div class='visibility-setting nomarginnopad'>Future Resource Children Allow Download</div>";
    checkboxesHtml += "</li>";
    checkboxesHtml += "</ul>";//<div>Note: Future Concept children cannot have previews or downloads</div>";
    //checkboxesHtml += "<div>Saving will apply visibility changes to the following:</div>";
    checkboxesHtml += "<ul class='visibility-list-table'>";
    for (ctr=0;ctr<conceptsInTree.length;ctr++){
      checkboxesHtml += "<li class='dialog-visibility-row' path='" + jQuery(conceptsInTree[ctr]).attr('depth') +"'><div class='visibility-name'>"+jQuery(conceptsInTree[ctr]).attr('name')+"</div>";
      checkboxesHtml += "<div class='visibility-type'>"+jQuery(conceptsInTree[ctr]).children("div")[1].innerHTML+"</div>";
      checkboxesHtml += "<div class='visibility-path'>"+jQuery(conceptsInTree[ctr]).children("div")[2].innerHTML+"</div>";
      for (var visibilityCtr = 0;visibilityCtr < visibilitySettings.length;visibilityCtr++) {
        var checkboxFilter = jQuery("[name*='future_children_" + visibilitySettings[visibilityCtr] + "']");
	var checkboxSelector = jQuery(conceptsInTree[ctr]).find(checkboxFilter);
	var checked = jQuery(checkboxSelector).is(":checked")?' checked':'';
	checkboxesHtml += "<div class='visibility-setting'><input type='checkbox' name='future[" + jQuery(conceptsInTree[ctr]).attr('depth')+ "][" + visibilitySettings[visibilityCtr] + "]' value='" + jQuery(checkboxSelector).attr("value") + "'" + checked + "></div>";
      }
      checkboxesHtml += "</li>";
    }
    checkboxesHtml += "</ul></div>";  
    jQuery("body").append("<div id='changeAdvanced' style='display:none;' title='Visibility for future children of concepts:'><div>"+checkboxesHtml+"</div></div>");
    var dialogConfig = {
      resizable: true,
      height:600,
      width: 1200,
      modal: true,
      buttons: {},
      close: function(){
        jQuery( this ).dialog( "destroy" );
        jQuery('#changeAdvanced').remove();
      }
    };
    dialogConfig.buttons['Save'] = function() {
      var futureVisibility = [];
      var visibilitySettings = ['show_name','show_meta','show_preview','show_degraded','allow_download'];
      for (var viCtr=0;viCtr < visibilitySettings.length;viCtr++) {
        var futureArray = jQuery("[name^='future'][name$='\\[" + visibilitySettings[viCtr] + "\\]']");
        for (var ctr=0;ctr<futureArray.length;ctr++){
          futureVisibility.push({
	    name:jQuery(futureArray[ctr]).closest("li").attr("path"),
	    setting:visibilitySettings[viCtr],
	    value:futureArray[ctr].checked
	  });
	} 
      }	     
      var futurePreviewEnabled = [],
	previewEnabled = [],
	previewMessage = '';
     // result holds array of concepts which have future_children_allow_download disabled
	var result = jQuery.grep(futureVisibility, function(e){return e.setting === 'allow_download' && e.value === false});
	if (result.length > 0) {
         // filter out the result array from above to concepts that have future_children_show_preview enabled
	  jQuery.map(result, function (downloadSetting, i) { if (jQuery.grep(futureVisibility, function (e) { return e.name === downloadSetting.name && e.setting === 'show_preview' && e.value === true}).length > 0) { futurePreviewEnabled.push(downloadSetting.name); }})
       }
       if (futurePreviewEnabled.length > 0){
	  previewMessage = '<div class="dialog_concept_tree">Future Resource children for:';
          jQuery.map(futurePreviewEnabled, function(obj, i) { 
	    previewMessage += '<div>' + jQuery("li[path='"+obj+"']").children("div")[2].innerHTML + '</div>';
	  });
	  previewMessage += '</div>';
	}	
	// get all resources from the main visibility form where preview is enabled and download disabled
	jQuery("[name$='\\[show_preview\\]']:checked").not("[name^='future[']").map(function() { 
	var fieldName = 'visibility['+jQuery(this).attr('path')+'][allow_download]'; 
	if (!(jQuery("[name=\'"+fieldName+"\']").is(':checked'))) { 
	  previewEnabled.push(jQuery(this).closest("li").children()[2].innerHTML);
	}
	});
	if (previewEnabled.length > 0){
	  previewMessage += '<div style="padding-top:5px;"></div><div class="dialog_concept_tree">';
          for (ctr=0;ctr<previewEnabled.length;ctr++){
            previewMessage += "<div>"+previewEnabled[ctr]+"</div>";
          }
	   previewMessage += '<div>';
	}
	if ((previewEnabled.length > 0) || (futurePreviewEnabled.length > 0)) { 
	  jQuery.ajax({
            url: Drupal.settings.basePath+"exhibition_config/preview_warning",
            success: function(msg){
	    previewMessage = '<div>' + msg + '</div>' + previewMessage;
            jQuery("#changeAdvanced").append("<div id='previewWarning' style='display:none;' title='Preview without download'><div>"+previewMessage+"</div></div>");
            var dialogPreview = {
              resizable: true,
              height:450,
              width: 600,
              modal: true,
              buttons: {},
              close: function(){
	        jQuery( this ).dialog( "destroy" ).remove();
              }
            };
            dialogPreview.buttons['Continue'] = function() {
             changeAdvanced(futureVisibility);
	     jQuery("#exhibition-permission-form").submit();
	     jQuery(this).dialog("destroy").remove();
            };
          dialogPreview.buttons['Cancel'] = function() {
	   jQuery(this).dialog("destroy").remove();
          }
          jQuery("#previewWarning").dialog(dialogPreview);
          jQuery("#previewWarning .dialog_concept_tree div:odd").addClass("light-background");
	}
      });
    }
    else{
      changeAdvanced(futureVisibility);
      jQuery("#exhibition-permission-form").submit();
      jQuery( this ).dialog( "destroy" ).remove();
   }
  }
  dialogConfig.buttons['Cancel'] = function() {
    jQuery( this ).dialog( "destroy" ).remove();
  }
  jQuery("#changeAdvanced").dialog(dialogConfig);
  jQuery("#changeAdvanced .visibility-list-table li:odd").addClass("light-background");
  }
}
changeAllWindow = function(){
  var selectedArray = [];
  jQuery("li.ui-selected").each(function() {
    selectedArray.push({
      path: jQuery(this).attr("depth"), 
      name:  jQuery(this).children("div")[2].innerHTML
    }); 
  });
  if (selectedArray.length >0){
    jQuery('#changeAll').remove();
    var checkboxesHtml = "<ul class='visibility-list-table' width='100'>";
    checkboxesHtml += "<li class='visibility-row'>";
    checkboxesHtml +=   "<div class='visibility-setting'>Show Name</div>";
    checkboxesHtml +=   "<div class='visibility-setting'>Show Meta</div>";
    checkboxesHtml +=   "<div class='visibility-setting' style='width:6%;'>Show Preview</div>";
    checkboxesHtml +=   "<div class='visibility-setting' style='width:10%;'>Show Degraded</div>";
    checkboxesHtml +=   "<div class='visibility-setting'>Allow Download</div>";
    checkboxesHtml += "</li>";
    checkboxesHtml += "<li class='visibility-row'>";
    checkboxesHtml +=   "<div class='visibility-setting'><input type='checkbox' id='future-children-show-name' value='1'></div>";
    checkboxesHtml +=   "<div class='visibility-setting'><input type='checkbox' id='future-children-show-meta' value='1'></div>";
    checkboxesHtml +=   "<div class='visibility-setting'><input type='checkbox' id='future-children-show-preview' value='1'></div>";
    checkboxesHtml +=   "<div class='visibility-setting' style='width:10%;'><input type='checkbox' id='future-children-show-degraded' value='1'></div>";
    checkboxesHtml +=   "<div class='visibility-setting'><input type='checkbox' id='future-children-allow-download' value='1'></div>";
    checkboxesHtml += "</li>";
    checkboxesHtml += "</ul>";
    checkboxesHtml += "<div>&bull; Concepts cannot have previews or downloads.</div>";
    checkboxesHtml += "<div>&bull; If 'Show Meta', 'Show Preview', 'Show Degraded' or 'Allow Download' are selected to be turned on, 'Show Name' will also become checked for the selected objects including concepts.</div>";
    checkboxesHtml += "<div>&bull; Non Image resources cannot have degraded image previews.</div>";
    checkboxesHtml += "<div>&bull; If 'Show Degraded' is selected to be turned on for an image resource, 'Show Preview' must also be checked for the selected object.</div>";
    checkboxesHtml += "<div>&bull; Apply visibility changes to the following:</div>";
    checkboxesHtml += "<div class='dialog_concept_tree'>";
    for (ctr=0;ctr<selectedArray.length;ctr++){
      checkboxesHtml += "<div>"+selectedArray[ctr].name+"</div>";
    }
    checkboxesHtml += "</div>"; 
    jQuery("body").append("<div id='changeAll' style='display:none;' title='Change Visibility for all selected :'><div>"+checkboxesHtml+"</div></div>");
    var dialogConfig = {
      resizable: true,
      height:450,
      width: 600,
      modal: true,
      buttons: {},
      close: function(){
        jQuery( this ).dialog( "close" );
     }
    };
    dialogConfig.buttons['Apply'] = function() {
      var visibilitySettings = [];
      var showNameDirect = jQuery("#future-children-show-name").is(":checked")?"checked":(jQuery("#future-children-show-name").prop("indeterminate")?"indeterminate":"off");
      visibilitySettings = {
        showMeta: jQuery("#future-children-show-meta").is(":checked")?"checked":(jQuery("#future-children-show-meta").prop("indeterminate")?"indeterminate":"off"),
        showPreview: jQuery("#future-children-show-preview").is(":checked")?"checked":(jQuery("#future-children-show-preview").prop("indeterminate")?"indeterminate":"off"),
        showDegraded: jQuery("#future-children-show-degraded").is(":checked")?"checked":(jQuery("#future-children-show-degraded").prop("indeterminate")?"indeterminate":"off"),
        allowDownload: jQuery("#future-children-allow-download").is(":checked")?"checked":(jQuery("#future-children-allow-download").prop("indeterminate")?"indeterminate":"off")
      };
      visibilitySettings.showName = (
        visibilitySettings.showMeta=="checked" ||
        visibilitySettings.showPreview=="checked" ||
	visibilitySettings.allowDownload =="checked" ||
        showNameDirect=="checked") ? "checked" : showNameDirect;
      changeSelected(visibilitySettings);
      jQuery( this ).dialog( "close" );
    };
    dialogConfig.buttons['Cancel'] = function() {
      jQuery( this ).dialog( "close" );
    }
    jQuery("#changeAll").dialog(dialogConfig);
    jQuery("#changeAll .dialog_concept_tree div:odd").addClass("light-background");
    jQuery("#changeAll input").each(function(){this.indeterminate = true});
  }//Ends selectedArray.length>0
}
previewWithoutDownloadCheck = function() {
  var previewEnabled = [];
  jQuery("[name$='\\[show_preview\\]']:checked").map(function() { 
  var fieldName = 'visibility['+jQuery(this).attr('path')+'][allow_download]'; 
  if (!(jQuery("[name=\'"+fieldName+"\']").is(':checked'))) { 
    previewEnabled.push(jQuery(this).closest("li").children()[2].innerHTML);
  }
  });
  if (previewEnabled.length > 0) {
    var previewMessage = '';
    var msg = '';
    jQuery.ajax({
    url: Drupal.settings.basePath+"exhibition_config/preview_warning",
    success: function(msg){
      previewMessage = msg;
      jQuery('#previewWarning').remove();
      var message = '<div>' + previewMessage + '</div>';
      message += "<div class='dialog_concept_tree'>";
      for (ctr=0;ctr<previewEnabled.length;ctr++){
        message += "<div>"+previewEnabled[ctr]+"</div>";
      }
      message += "</div>"; 
      jQuery("body").append("<div id='previewWarning' style='display:none;' title='Preview without download'><div>"+message+"</div></div>");
      var dialogConfig = {
        resizable: true,
        height:450,
        width: 600,
        modal: true,
        buttons: {},
        close: function(){
          jQuery( this ).dialog( "destroy" ).remove();
        }
      };
      dialogConfig.buttons['Continue'] = function() {
       jQuery("#exhibition-permission-form").submit();
       jQuery(this).dialog("destroy").remove();
      };
      dialogConfig.buttons['Cancel'] = function() {
	jQuery(this).dialog("destroy").remove();
      }
      jQuery("#previewWarning").dialog(dialogConfig);
      jQuery("#previewWarning .dialog_concept_tree div:odd").addClass("light-background");
      return false;
     }
    });
  }
  else{
    jQuery("#exhibition-permission-form").submit();
  }	
}
