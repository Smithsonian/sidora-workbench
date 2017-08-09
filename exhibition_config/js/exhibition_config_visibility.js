
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
    filter: "li.visibility-row",
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
  var rootPid = getRootPid();
  jQuery.ajax({
    dataType: "json",
    method:"get",
    url: Drupal.settings.basePath+'exhibition_config/ajax_parts/clear_session/'+rootPid
  });
});
getRootPid = function(){
  var rootPid = window.location.href.substring(window.location.href.indexOf("/visibility/")+12);
  return rootPid;
}
// tells if a sidebar information retrieval is ongoing. We don't want to send out multiple
window.sidebarRetrieveOngoing = false;
// Indication that things have changed since the last sidebar retrieval started. Set to true
// to indicate we need to go out and get new information once the current retrieval is complete
window.queueSidebarRetrieve = false;

fillInSidebarSection = function(infoArray, selector, selectorSummary) {
  var max_shown = 1000;
  var totalAdded;

  totalAdded = 0;
  jQuery(selector).html("");
  jQuery(infoArray).each(function(index, value){
    if (totalAdded < max_shown) {
      jQuery(selector).append("<div>"+value+"</div>");
    }
    if (totalAdded == max_shown) {
      jQuery(selector).append("<div>(Truncated at "+max_shown+" items)</div>");
    }
    totalAdded++;
  });
  jQuery(selectorSummary).html("("+totalAdded+")");

}
// Go get the information summary for the full exhibition
fillInSidebar = function(){
  if (window.sidebarRetrieveOngoing) {
    window.queueSidebarRetrieve = true;
    return;
  }
  window.sidebarRetrieveOngoing = true;
  setTimeout(function(){
    var rootPid = getRootPid();
    jQuery.ajax({
      dataType:'json',
      url: Drupal.settings.basePath+'exhibition_config/ajax_parts/sidebar/' + rootPid,
      success: function(data){
        window.sidebarRetrieveOngoing = false;
        if (window.queueSidebarRetrieve) {
          window.queueSidebarRetrieve = false;
          window.fillInSidebar();
        }
        fillInSidebarSection(data['shown'],            '#main_shown .fieldset-wrapper',      '#main_shown .summary');
        fillInSidebarSection(data['hidden'],          '#main_hidden .fieldset-wrapper',     '#main_hidden .summary');
        fillInSidebarSection(data['meta_shown'],       '#meta_shown .fieldset-wrapper',      '#meta_shown .summary');
        fillInSidebarSection(data['meta_hidden'],     '#meta_hidden .fieldset-wrapper',     '#meta_hidden .summary');
        fillInSidebarSection(data['preview'],       '#preview_shown .fieldset-wrapper',   '#preview_shown .summary');
        fillInSidebarSection(data['no_preview'],   '#preview_hidden .fieldset-wrapper',  '#preview_hidden .summary');
        fillInSidebarSection(data['download'],    '#downloads_shown .fieldset-wrapper', '#downloads_shown .summary');
        fillInSidebarSection(data['no_download'],'#downloads_hidden .fieldset-wrapper','#downloads_hidden .summary');
      }
    });
  },5000);
}
resizeConceptTreePage = function() {
  jQuery("#concept_tree").parent().height(jQuery(window).innerHeight()-(jQuery("#page").offset().top + 50));
}
basicPagingSuccess = function(data){
  if (jQuery.trim(data)){
    jQuery('.visibility-row').detach();
    jQuery('.visibility-list-table>#header').after(data);
    fillInSidebar();
    resizeConceptTreePage();
    jQuery('#concept_tree li:even').addClass('light-background');
    jQuery('#open-advanced').after(jQuery('#edit-save'));
    jQuery(window).resize(resizeConceptTreePage);
    jQuery('#sidora-resources-page-number').val(parseInt(jQuery('#sidora-resources-page-number').val()));
    jQuery('body').css("cursor", "default");
    hideOverlay();
  }   
}
refreshCurrentPage = function(){
  var rootPid = getRootPid();
  jQuery.ajax({
    dataType:'html',
    url: Drupal.settings.basePath+'exhibition_config/ajax_parts/paging/' + rootPid + '/' + parseInt(jQuery("[name='objectsPerPage']").val()) + '/' + parseInt(jQuery('#sidora-resources-page-number').val()),
    success: function(data){
      basicPagingSuccess(data);
    }
  });
}
setChildVisibilityIfNeeded = function(rootPid, pidPath, resetCheckboxID){
  if (jQuery("#"+resetCheckboxID).closest("li").children("div .visibility-type").html().toLowerCase() == 'concept') {
    visibilitySettings = {};
    visibilitySettings['all'] = '1';
    setChildVisibility(rootPid, pidPath, visibilitySettings);
  }
  else {
    refreshCurrentPage();
  }
}
/**
 * Set the visibility of the child to 
 */
setChildVisibility = function(rootPid, pidPath, visibilitySettings){
  jQuery.ajax({
    dataType: "json",
    method:"post",
    url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_children_visibility/' + rootPid,
    data: {"parent_pid_path":pidPath,
           "visibility":JSON.stringify(visibilitySettings)},
    success: function(visibility){
      refreshCurrentPage();
    }
  });
}

jQuery(function(){
  fillInSidebar();
  resizeConceptTreePage();
  jQuery("#concept_tree li:even").addClass("light-background");
  jQuery("#open-advanced").after(jQuery("#edit-save"));
  jQuery(window).resize(resizeConceptTreePage);
  jQuery("#selectable").on("click","input:checkbox",function(){
    if (jQuery(this).is(":checked")){
      showOverlay("Processing...");
      var parentsToCheck = [];
      var invisibleParents = [];
      var message = "";
      message += "<ul>";
      var pidPath = jQuery(this).attr("path");
      var path = pidPath.split("/");
      var rootPid = jQuery("[name='pid']").val();
      pid = "";
      var resetCheckboxID = jQuery(this).attr("id");
      var selectedCheckbox = this;
      jQuery('body').css("cursor", "progress"); 
      visibilitySettings = {};
      visibilitySettings['show_name'] = '';
      for (ctr=0;ctr<path.length;ctr++){
        if (pid == "") {
          message = "In order to display this object and its information, the object and a path through the exhibition needs to be displayed. If you confirm, the following items will be shown."+message;
          pid = path[ctr];
        }else{
          pid = pid+"/"+path[ctr];
        }
          parentsToCheck.push(pid);
      }
      parentsToCheck.pop();
      jQuery.ajax({
        dataType: "json",
        method:"post",
        url: Drupal.settings.basePath+'exhibition_config/ajax_parts/check_visibility/'+rootPid,
        data: {"csv_pids":parentsToCheck.join(),
               "visibility":JSON.stringify(visibilitySettings),
               "condition":""},
        success: function(visibility){
          hideOverlay();
          console.log(visibility);
          for (ctr=0;ctr<visibility.length;ctr++){
            if (visibility[ctr].status == "true") {
            invisibleParents.push(visibility[ctr].pid);
            message += "<li>" + visibility[ctr].label+"</li>";
            }
          }  
          message += "</ul>";
          if (invisibleParents.length > 0) {
            changeParentConfirm(
              "Visibility Settings Change",
              message,
              function(){
                showOverlay("Processing...");
                visibilitySettings = {};
                visibilitySettings['show_name'] = '1';
                jQuery.ajax({
                  dataType: "json",
                  method:"post",
                  url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility/'+rootPid,
                  data: {"csv_pids":invisibleParents.join(),
                         "visibility":JSON.stringify(visibilitySettings)},
                  success: function(visibility){
                    if (jQuery("#"+resetCheckboxID).attr("name").indexOf("[show_name]") == -1) {
                      var parsedName = jQuery("#"+resetCheckboxID).attr("name").split("[");
                      var settingName = parsedName[parsedName.length-1].slice(0,-1);
                      visibilitySettings = {};
                      visibilitySettings[settingName] = '1';
                      visibilitySettings['show_name'] = '1';
                      jQuery.ajax({
                        dataType: "json",
                        method:"post",
                        url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility/'+rootPid,
                        data: {"csv_pids":pidPath,
                               "visibility":JSON.stringify(visibilitySettings)},
                        success: function(data){
                          setChildVisibilityIfNeeded(rootPid, pidPath, resetCheckboxID);
                        }
                      });
                    }
                    else {
                      setChildVisibilityIfNeeded(rootPid, pidPath, resetCheckboxID);
                    }
                  }
                });
              },
              function(){ jQuery("#"+resetCheckboxID).prop("checked",false); }
            ); 
          }
          else {
            jQuery('body').css("cursor", "progress");
            if (jQuery("#"+resetCheckboxID).attr("name").indexOf("[show_name]") != -1) {
              // set_visibility for all/true for this pid
              visibilitySettings = {};
              visibilitySettings['all'] = '1';
              jQuery.ajax({
                dataType: "json",
                method:"post",
                url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility/'+rootPid,
                data: {"csv_pids":pidPath,
                "visibility":JSON.stringify(visibilitySettings)},
                success: function(visibility){
                  setChildVisibilityIfNeeded(rootPid, pidPath, resetCheckboxID);
                }
              });
            }
            else{
              var parsedName = jQuery("#"+resetCheckboxID).attr("name").split("[");
              var settingName = parsedName[parsedName.length-1].slice(0,-1);
              visibilitySettings = {};
              visibilitySettings[settingName] = '1';
              visibilitySettings['show_name'] = '1';
              jQuery('body').css("cursor", "progress");
              jQuery.ajax({
                dataType: "json",
                method:"post",
                url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility/'+rootPid,
                data: {"csv_pids":pidPath,
                "visibility":JSON.stringify(visibilitySettings)},
                success: function(data){
                  refreshCurrentPage();
                }
              });
            } 
          }
          jQuery('body').css("cursor", "default");
        }
      });
    }
    else {
      showOverlay("Processing...");
      jQuery('body').css("cursor", "progress"); 
      var pidPath = jQuery(this).attr("path");
      var rootPid = jQuery("[name='pid']").val();
      var resetCheckboxID = jQuery(this).attr("id");
      var selectedCheckbox = this;
      if (jQuery(this).attr("name").indexOf("[show_name]") != -1) {
        var linesToBeHidden = [];
        if (jQuery("#"+resetCheckboxID).closest("li").children("div .visibility-type").html().toLowerCase() == 'concept') {
          visibilitySettings = {};
          visibilitySettings['all'] = '1';
          jQuery.ajax({
            dataType: "json",
            method:"post",
            url: Drupal.settings.basePath+'exhibition_config/ajax_parts/get_children_visibility/' + rootPid,
            data: {"parent_pid_path":pidPath,
                 "visibility":JSON.stringify(visibilitySettings),
                 "condition":"or"},
            success: function(visibility){
              for (ctr=0;ctr<visibility.length;ctr++){
                linesToBeHidden.push(visibility[ctr]);
              }  
              var message = "When hiding this concept, all children and child trees will be hidden. If you confirm, the concept and the following items will be hidden.";
              message += "<ul>";
              for (ctr=0;ctr<linesToBeHidden.length;ctr++){
                message += "<li>"+ linesToBeHidden[ctr].label + "</li>";
              }
              message += "</ul>";
              if (linesToBeHidden.length > 0){ //This is a concept with children that will be changed
                hideOverlay();
                changeParentConfirm("Visibility Settings Change", message, 
                  function(){
                    showOverlay("Processing");
                    visibilitySettings = {};
                    visibilitySettings['all'] = '';
                    jQuery.ajax({
                      dataType: "json",
                      method:"post",
                      url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility/'+rootPid,
                      data: {"csv_pids":pidPath,
                             "visibility":JSON.stringify(visibilitySettings)},
                      success: function(visibility){
                        visibilitySettings = {};
                        visibilitySettings['all'] = '';
                        setChildVisibility(rootPid, pidPath, visibilitySettings);
                      }
                    });
                  },
                  function(){ jQuery("#"+resetCheckboxID).prop("checked",true); }
                ); 
              }
              else {  //This is a resource of concept with no children that change, just hide it
                visibilitySettings = {};
                visibilitySettings['all'] = '';
                jQuery.ajax({
                  dataType: "json",
                  method:"post",
                  url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility/'+rootPid,
                  data: {"csv_pids":pidPath,
                 "visibility":JSON.stringify(visibilitySettings)},
                  success: function(visibility){
                    refreshCurrentPage();
                  }
                });
              } // endif linestobehidden
            }
          });
        }
        else {
          visibilitySettings = {};
          visibilitySettings['all'] = '';
          jQuery.ajax({
            dataType: "json",
            method:"post",
            url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility/'+rootPid,
            data: {"csv_pids":pidPath,
                 "visibility":JSON.stringify(visibilitySettings)},
            success: function(visibility){
              refreshCurrentPage();
            }
          });
        }
      }
      else {
        var parsedName = jQuery("#"+resetCheckboxID).attr("name").split("[");
        var settingName = parsedName[parsedName.length-1].slice(0,-1);
        visibilitySettings = {};
        visibilitySettings[settingName] = '';
        jQuery.ajax({
          dataType: "json",
          method:"post",
          url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility/'+rootPid,
          data: {"csv_pids":pidPath,
                 "visibility":JSON.stringify(visibilitySettings)},
          success: function(data){
            refreshCurrentPage();
          }
        });
      } 
    }
    fillInSidebar();
    jQuery('body').css("cursor", "default"); 
  }); //Ends jQuery("input:checkbox").click
  jQuery("#change_all").click(changeAllWindow);
  jQuery("#open-advanced").click(openAdvancedWindow);
  jQuery("input[type='submit']").click(function(event) {
    event.preventDefault();
    previewWithoutDownloadCheck();
  });
}); //Ends openAdvanced click
/**
 * Generally show an overlay when you need it
 */
showOverlay = function(textToShow) {
  showOverlay(textToShow, "width:170px;margin:200px auto;height:100px;font-size:48px;");
}
showOverlay = function(textToShow, extraStyle) {
  jQuery('#fsOverlay').detach();
  jQuery('body').append('<div id="fsOverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:#ddd;z-index:10000;"><div style="'+extraStyle+'">'+textToShow+'</div>');
}
hideOverlay = function(){
  jQuery('#fsOverlay').detach();
}
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
 // ajax request to set_visibility with list of pid paths and visibility settings
  var rootPid = jQuery("[name='pid']").val();
  jQuery.ajax({
    dataType: "json",
    method:"post",
    url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility_multiple/'+rootPid,
    data: {"visibility":JSON.stringify(visibilitySettings)},
    success: function(visibility){
      jQuery("#exhibition-permission-form").submit();
    }
  });
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
  var rootPid = jQuery("[name='pid']").val();
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
    conceptPidsInTree = [];
    for (ctr=0;ctr<conceptsInTree.length;ctr++){
      checkboxesHtml += "<li class='dialog-visibility-row' path='" + jQuery(conceptsInTree[ctr]).attr('depth') +"'><div class='visibility-name'>"+jQuery(conceptsInTree[ctr]).attr('name')+"</div>";
      checkboxesHtml += "<div class='visibility-type'>"+jQuery(conceptsInTree[ctr]).children("div")[1].innerHTML+"</div>";
      checkboxesHtml += "<div class='visibility-path'>"+jQuery(conceptsInTree[ctr]).children("div")[2].innerHTML+"</div>";
      conceptPidsInTree.push(jQuery(conceptsInTree[ctr]).attr('depth'));
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
      var advancedVisibility = {};
      var visibilitySettings = ['show_name','show_meta','show_preview','show_degraded','allow_download'];
      for (var viCtr=0;viCtr < visibilitySettings.length;viCtr++) {
        var futureArray = jQuery("[name^='future'][name$='\\[" + visibilitySettings[viCtr] + "\\]']");
        for (var ctr=0;ctr<futureArray.length;ctr++){
          futureVisibility.push({
            name:jQuery(futureArray[ctr]).closest("li").attr("path"),
            setting:visibilitySettings[viCtr],
            value:futureArray[ctr].checked
          });
          var pidPath = jQuery(futureArray[ctr]).closest("li").attr("path");
          var settingName = 'future_children_' + visibilitySettings[viCtr];
          var settingValue = futureArray[ctr].checked ? '1':'';
          if (advancedVisibility[pidPath] === undefined) {
            advancedVisibility[pidPath] = {};
            advancedVisibility[pidPath][settingName] = settingValue;
          } 
          else {
            advancedVisibility[pidPath][settingName] = settingValue;
          }   
        } 
      }      
      var futurePreviewEnabled = [],
      previewEnabled = [],
      previewMessage = '';
      // result holds array of concepts which have future_children_allow_download disabled
      var result = jQuery.grep(futureVisibility, function(e){return e.setting === 'allow_download' && e.value === false});
      if (result.length > 0) {
        // filter out the result array from above to concepts that have future_children_show_preview enabled
        jQuery.map(result, function (downloadSetting, i) { 
          if (jQuery.grep(futureVisibility, function (e) {
            return e.name === downloadSetting.name && e.setting === 'show_preview' && e.value === true
          }).length > 0) {
            futurePreviewEnabled.push(downloadSetting.name);
          }
        })
      }
      if (futurePreviewEnabled.length > 0){
        previewMessage = '<div class="dialog_concept_tree">Future Resource children for:';
        jQuery.map(futurePreviewEnabled, function(obj, i) { 
          previewMessage += '<div>' + jQuery("li[path='"+obj+"']").children("div")[2].innerHTML + '</div>';
        });
        previewMessage += '</div>';
      } 
      // get all resources from the main visibility form where preview is enabled and download disabled
      // make an ajax request to get all resources from the current root visibility where show preview is enabled and download is disabled
      // return an array of resource visibility paths
      visibilitySettings = {};
      visibilitySettings['show_preview'] = '1';
      visibilitySettings['allow_download'] = '';
      jQuery('body').css("cursor", "progress"); 
      jQuery.ajax({
        dataType: "json",
        method:"post",
        url: Drupal.settings.basePath+'exhibition_config/ajax_parts/get_children_visibility/' + rootPid,
        data: {"parent_pid_path":conceptPidsInTree.join(),
             "visibility":JSON.stringify(visibilitySettings),
             "condition":"and"},
        success: function(visibility){
          for (ctr=0;ctr<visibility.length;ctr++){
            if (visibility[ctr].status == 'true') previewEnabled.push(visibility[ctr].label);
          }  
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
                jQuery('body').css("cursor", "default"); 
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
                  changeAdvanced(advancedVisibility);
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
            changeAdvanced(advancedVisibility);
            jQuery( this ).dialog( "destroy" ).remove();
          }
        }
      });
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
  var pidsToUpdate = [];
  var rootPid = jQuery("[name='pid']").val();
  jQuery("li.ui-selected").each(function() {
    selectedArray.push({
      path: jQuery(this).attr("depth"), 
      name:  jQuery(this).children("div")[2].innerHTML
    }); 
    pidsToUpdate.push(jQuery(this).attr("depth"));
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
      var visibilitySettings = {};
      var showNameDirect = "";
      if (!jQuery("#future-children-show-name").prop("indeterminate")) showNameDirect = jQuery("#future-children-show-name").is(":checked")?"1":"";
      if (!jQuery("#future-children-show-meta").prop("indeterminate")) visibilitySettings['show_meta'] = jQuery("#future-children-show-meta").is(":checked")?"1":"";
      if (!jQuery("#future-children-show-preview").prop("indeterminate")) visibilitySettings['show_preview'] = jQuery("#future-children-show-preview").is(":checked")?"1":"";
      if (!jQuery("#future-children-show-degraded").prop("indeterminate")) visibilitySettings['show_degraded'] = jQuery("#future-children-show-degraded").is(":checked")?"1":"";
      if (!jQuery("#future-children-allow-download").prop("indeterminate")) visibilitySettings['allow_download'] = jQuery("#future-children-allow-download").is(":checked")?"1":"";
      visibilitySettings['show_name'] = (visibilitySettings["showMeta"]=="1" || visibilitySettings["showPreview"]=="1" || visibilitySettings["allowDownload"] =="1" || showNameDirect=="checked") ? "1" : showNameDirect;
      jQuery('body').css("cursor", "progress"); 
      jQuery.ajax({
        dataType: "json",
        method:"post",
        url: Drupal.settings.basePath+'exhibition_config/ajax_parts/set_visibility/'+rootPid,
        data: {"csv_pids":pidsToUpdate.join(),
              "visibility":JSON.stringify(visibilitySettings)},
        success: function(visibility){
          refreshCurrentPage();
        }
      });      
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
  var rootPid = jQuery("[name='pid']").val();
  var previewEnabled = [];
  visibilitySettings = {};
  visibilitySettings['show_preview'] = '1';
  visibilitySettings['allow_download'] = '';
  jQuery('body').css("cursor", "progress"); 
  jQuery.ajax({
    dataType: "json",
    method:"post",
    url: Drupal.settings.basePath+'exhibition_config/ajax_parts/check_visibility/'+rootPid,
    data: {"csv_pids":"all",
           "visibility":JSON.stringify(visibilitySettings),
           "condition":"and"},
    success: function(visibility){
      console.log(visibility);
      for (ctr=0;ctr<visibility.length;ctr++){
        if (visibility[ctr].status == "true") {
          previewEnabled.push(visibility[ctr].label);
        }
      }   
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
            jQuery('body').css("cursor", "default"); 
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
              showProcessingSaveTime();
              submitFormViaAjax();
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
        showProcessingSaveTime();
        submitFormViaAjax();
      } 
    }
  });
}
submitFormViaAjax = function() {
  unpublish();
  jQuery.ajax({
    type: 'POST',
    url: window.location.href,
    data: jQuery("#exhibition-permission-form").serialize(),
    success: function(){
      jQuery(".save-information").html("Visibility Processing Complete");
    }
  });
}
showProcessingSaveTime = function() {
      var numPages = parseInt(jQuery("#sidora-resources-page-count").text());
      // Estimating 2 seconds per page
      var estimatedSecondsPerPage = 1.5;
      var estimatedFinish = new Date(Date.now()+numPages*estimatedSecondsPerPage*1000);
      var hour = estimatedFinish.getHours();
      var am_pm = (hour > 11) ? "PM" : "AM";
      var hourText  = (hour > 12) ? ""+(hour - 12): ""+hour;
      var minuteText = (estimatedFinish.getMinutes() > 9) ? ""+estimatedFinish.getMinutes() : "0"+estimatedFinish.getMinutes();
      showOverlay(
        "<div><div class='save-information'>Processing...<br>Estimated completion time:<br>"+hourText+":"+minuteText+" "+am_pm+"<hr></div></div><div style='font-size:15px'><br>On saving the visibility, the exhibition becomes unpublished.<br> Resave the exhibition to publish it.</div>",
        "width: 650px;margin:200px auto;height: 400px;font-size:48px;line-height: 1em;text-align: center;"
      );
      
}

unpublish = function() {
  var rootPid = jQuery("[name='pid']").val();
  jQuery.ajax({
    dataType: "text",
    method:"get",
    url: Drupal.settings.basePath+'exhibition_config/unpublish/'+rootPid
  });
  jQuery(".exhibition-link-available", window.parent.document).hide();
  jQuery(".exhibition-link-unavailable", window.parent.document).show();
};

closeVisibility = function() {
  if (window.parent != window) {
    window.parent.Shadowbox.close();
  }
}
