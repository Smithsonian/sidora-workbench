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

sidora.sharedWithMe = {
  selector: null,
  dragY: false
};
sidora.sharedWithMe.CreateDefaultShareSection = function(){
  performWhenDisplayedOnScreen("#j1_1",function(){
    var jst = jQuery("#forjstree").jstree();
    var checkText = jst.get_node("j1_2").text;
    if (checkText == '  Shared With Me') {
      sidora.sharedWithMe.CreateShareTreeSection("#j1_2");
    }
  });
}
sidora.sharedWithMe.CreateShareTreeSection = function(sharedWithMeSelector){
  // Our shared folder should come out as a child of the tree
  // Open the root, and the share, then make it so we can't close the root (which would close the share)
  var jst = jQuery("#forjstree").jstree();
  jst.open_node("j1_1"); //Open root
  jst.open_node(sharedWithMeSelector); //Open Share
  jQuery("#j1_1 > i").css("display","none"); // Hide the collapser
  

  sidora.sharedWithMe.selector = sharedWithMeSelector;
  jQuery("#fjt-holder").append('<div id="shared-tree-divider" style="width: 100%;background: #aaa;height: 20px;cursor: ns-resize;text-align:center">&#x25BC; Shared &#x25BC;</div>');
  var baseRule = "{position: absolute;left: -10px;background-image: none;height: 200px;overflow:auto;width: calc(100% + 10px);}";
  var allRules = baseRule;
  jQuery(sharedWithMeSelector).addClass("sharedWithMeMain");
  styleInject(sharedWithMeSelector+allRules,"SharedWithMe");
  var hideRule = "{display:none}";
  styleInject(sharedWithMeSelector+" > i, "+sharedWithMeSelector+" > a "+hideRule, "SharedWithMeRoot");
  jQuery("#shared-tree-divider").mousedown(function(e){
    sidora.sharedWithMe.dragY =  e.screenY;
  });
  jQuery("#fjt-holder").mousemove(function(e){
    if (sidora.sharedWithMe.dragY){
      var jsth = jQuery("#forjstree").height();
      var njsth = jsth + (e.screenY - sidora.sharedWithMe.dragY);
      var sharedSpaceAvailable = jQuery("#fjt-holder").height() - (njsth + jQuery("#shared-tree-divider").height());
      if (
        njsth >= parseInt(jQuery("#forjstree").css("min-height")) &&
        sharedSpaceAvailable >= parseInt(jQuery("#forjstree").css("min-height"))
        ) {
        sidora.sharedWithMe.dragY = e.screenY;
        jQuery("#forjstree").height(njsth);
        jQuery(sidora.sharedWithMe.selector).height(sharedSpaceAvailable-10);
      }
      
    }
    sidora.sharedWithMe.Relocate();
    clearSelection();
  });
  jQuery("#fjt-holder").mouseleave(function(){ sidora.sharedWithMe.dragY = false; });
  jQuery("#shared-tree-divider").mouseup(function(){ sidora.sharedWithMe.dragY = false; });
  sidora.sharedWithMe.Relocate();
}
sidora.sharedWithMe.Relocate = function(){
  if (sidora.sharedWithMe.selector == null) return;
  if (jQuery("#fjt-holder").height() == jQuery("#forjstree").height()) {
    swmLocation = (jQuery("#fjt-holder").height()-200);
    jQuery("#forjstree").height(swmLocation-20);
    jQuery(sidora.sharedWithMe.selector).css("top", swmLocation + "px");
  } else {
    swmLocation = (jQuery("#forjstree").height()+jQuery("#shared-tree-divider").height());
    jQuery(sidora.sharedWithMe.selector).css("top", swmLocation + "px");
  }
}
sidora.sharedWithMe.CreateSharedButton = function(){
  jQuery('#conceptResizable').append('<input id="sharedWithMeButton" value="Shared With Me" class="form-submit sidora-form-finish" style="position: absolute;bottom: 10px;left: 30px;">');
 
  var showSharedWithMe = function(sharedItems){ 

    var title = "Shared With Me";
    
    var questionText = "Select one of the following workspaces.<br/>";
    questionText += "<select class='form-select' id='project-pid-select'>";
    questionText += "<option value=''>My Own Projects</option>";
    var keys = Object.keys(sharedItems);
    for(var i = 0; i < keys.length; i++) {
      questionText += "<option value='"+keys[i]+"'>"+sharedItems[keys[i]]+"</option>";
    }
    questionText += "<select>";
    var onConfirmation = function(){
      var sp = new URLSearchParams(location.search);
      var currentRoot = sp.get("nr");
      if (currentRoot == null) currentRoot = '';
      var selectedRootPid = jQuery("#project-pid-select").val();
      if (currentRoot != selectedRootPid){
        var newRoot = "?nr=" + selectedRootPid + "#";
        if (selectedRootPid == '') {
          newRoot = '';
        }
        var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + newRoot;
        window.location = newURL;
      }
    };
    var onCancel = function(){};
    var confirmButtonText = "Switch...";
    sidora.util.Confirm(title, questionText, onConfirmation, onCancel, confirmButtonText);
  }

  jQuery("#sharedWithMeButton").click(function(){
    jQuery("#sharedWithMeButton").blur(); //Get rid of the text cursor if there
    jQuery.ajax({
      "dataType":"json",
      "url":Drupal.settings.basePath+"sidora/ajax_parts/shared_with_me",
      "success":function(data){
        showSharedWithMe(data);
      },
      "error":function(){
         console.log("Problem getting shared info");
      }
    });

  });

}
