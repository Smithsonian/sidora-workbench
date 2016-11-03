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
    var rn = jst.get_node("j1_1");
    for (i = 0; i < rn.children.length; i++) {
      var checkText = jst.get_node(rn.children[i]).text;
      if (checkText == '  Shared With Me') {
        // BBB TODO: put in a better indicator to signify that this is the shared with me concept
        sidora.sharedWithMe.CreateShareTreeSection("#"+rn.children[i]);
      }
    }
  });
}
sidora.sharedWithMe.ReopenCurrent = function() {
  var jst = jQuery("#forjstree").jstree();
  var pNodeSelector = jst.get_node(jst.get_selected()[0]).parent;
  // Don't close the "shared with me" folder since it can't be reopened when it is hidden
  if ("#" + pNodeSelector != sidora.sharedWithMe.selector) {
    var pNode = jst.get_node(pNodeSelector);
    jst.close_node(pNode);
    //Give the close_node time to process
    setTimeout(function(){jst.open_node(pNode);}, 200);
  }
}
sidora.sharedWithMe.AddColoring = function(){
  var jst = jQuery("#forjstree").jstree();
  jQuery(sidora.sharedWithMe.selector).addClass("sharedWithMeMain");
  var dataNode = jst.get_node(sidora.sharedWithMe.selector);
  if(dataNode.a_attr.class) {
    if(dataNode.a_attr.class.indexOf('sharedWithMeMain') === -1) {
      dataNode.a_attr.class += ' sharedWithMeMain';
    }
  }
  else {
    dataNode.a_attr.class = 'sharedWithMeMain';
  }   
}
sidora.sharedWithMe.CreateShareTreeSection = function(sharedWithMeSelector){
  // Our shared folder should come out as a child of the tree
  // Open the root, and the share, then make it so we can't close the root (which would close the share)
  // If the divider already exists, don't readd
  if (jQuery("#shared-tree-divider").length > 0) return;
  var jst = jQuery("#forjstree").jstree();
  jst.open_node("j1_1"); //Open root
  jst.open_node(sharedWithMeSelector); //Open Share
  jQuery("#j1_1 > i").css("display","none"); // Hide the collapser
  

  sidora.sharedWithMe.selector = sharedWithMeSelector;
  jQuery("#fjt-holder").append('<div id="shared-tree-divider" style="width: 100%;background: #aaa;height: 20px;cursor: ns-resize;text-align:center">&#x25BC; Shared &#x25BC;</div>');
  var initialHeight = (readCookie('Drupal.sidoraSharedWithMeHeight') == '')?'200':readCookie('Drupal.sidoraSharedWithMeHeight');
  var baseRule = "{position: absolute;left: -10px;background-image: none;height: "+initialHeight+"px;overflow:auto;width: calc(100% + 10px);}";
  var allRules = baseRule;
  sidora.sharedWithMe.AddColoring();
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
    writeCookie('Drupal.sidoraSharedWithMeHeight',jQuery("#fjt-holder").height() - jQuery("#forjstree").height(),30);
  });
  jQuery("#fjt-holder").mouseleave(function(){ sidora.sharedWithMe.dragY = false; });
  jQuery("#shared-tree-divider").mouseup(function(){ sidora.sharedWithMe.dragY = false; });
  sidora.sharedWithMe.Relocate();
  // Reopening will force the current section to load, which it will not do on initial load since Shared With Me is a special case
  // Otherwise, it will not display the "can open" icon next to the concept (since it loads without children)
  sidora.sharedWithMe.ReopenCurrent();
}
sidora.sharedWithMe.Relocate = function(){
  if (sidora.sharedWithMe.selector == null) return;
  if (jQuery("#fjt-holder").height() == jQuery("#forjstree").height()) {
    var initialHeight = (readCookie('Drupal.sidoraSharedWithMeHeight') == '')?'200':readCookie('Drupal.sidoraSharedWithMeHeight');
    swmLocation = (jQuery("#fjt-holder").height()-parseInt(initialHeight));
    jQuery("#forjstree").height(swmLocation-20);
    jQuery(sidora.sharedWithMe.selector).css("top", swmLocation + "px");
  } else {
    swmLocation = (jQuery("#forjstree").height()+jQuery("#shared-tree-divider").height());
    jQuery(sidora.sharedWithMe.selector).css("top", swmLocation + "px");
  }
}
