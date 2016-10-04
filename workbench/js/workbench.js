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

window.sidora = {
  util : {},
  manage : {},
  resources : {
    individualPanel: {
      resourceOfInterest : null
    }
  },
  concept: {},
  ontology: {
    tree: {}
  }
};
/*
 * Retrieves the concept pid from the url
 */
sidora.concept.GetPid = function(){
  if (window.location.hash.indexOf('?') > -1){
    return window.location.hash.substring(1,window.location.hash.indexOf('?'));
  }else{
    return window.location.hash.substring(1);
  }
}
sidora.concept.LoadContentHelp ={};
sidora.concept.LoadContentHelp.Resources ={};
/*
 * Calls for the table setup information
 */
sidora.concept.LoadContentHelp.Resources.TableLoad = function(conceptOfInterest){
 // var dtPageLength = parseInt(readCookie('Drupal.pageLength'));
  sidora.resources.dataTable = jQuery('#res_table').dataTable({
     "oLanguage": {
       "sLengthMenu": "Show _MENU_"
     },
     'sPaginationType': "input",
     'lengthMenu':[5,10,50,100],
     'pageLength': (readCookie('Drupal.pageLength') == '')?parseInt('5'):parseInt(readCookie('Drupal.pageLength')),
     'search': {
       'search': ((readCookie('Drupal.dtFilter') == '')?'all':readCookie('Drupal.dtFilter')) + '\n' + '' + '\n' + ((readCookie('Drupal.sortOn') == '')?'':readCookie('Drupal.sortOn')) + '\n' + ((readCookie('Drupal.sortOrder') == '')?'':readCookie('Drupal.sortOrder')),
      },
     'processing': true,
     'serverSide': true,
     'ordering': false,
     'ajax': jQuery.fn.dataTable.pipeline({
       url: Drupal.settings.basePath+'sidora/info/'+conceptOfInterest+'/resources/all/browser/dataTableServerSideProcessing',
       pages: 2
     })
  });
  var table = jQuery('#res_table').DataTable();
  jQuery('#res_table tbody').on( 'click', 'tr', function (e) {
    //If the mousedown is on something that is in the middle of a move process, ignore the mousedown
    if (jQuery(this).hasClass("is-being-moved")){
      console.log("Item is being moved, ignoring click");
      return;
    }
    if ( jQuery(this).hasClass('selected') ) {
      if (this.id == sidora.resources.individualPanel.resourceOfInterest.pid){
        sidora.resources.individualPanel.Remove();
        sidora.resources.individualPanel.resourceOfInterest = null;
      }
      jQuery(this).removeClass('selected');
    } else {
      if (!e.ctrlKey && !e.metaKey){
        table.$('tr.selected').removeClass('selected');
        sidora.resources.individualPanel.resourceOfInterest = null;
      }
      jQuery(this).addClass('selected');
    }
    //if we only have 1 left, make the resource of interest into the one that is left
    var pids = sidora.resources.getHighlighted();
    if (pids.length == 1 && sidora.resources.individualPanel.resourceOfInterest == null && pids[0] != sidora.resources.individualPanel.resourcesOfInterest){
      sidora.resources.individualPanel.resourceOfInterest = {
        'pid': pids[0],
        'name': jQuery(jq(pids[0])).find("td").text()
      };
      sidora.resources.individualPanel.CreateAndInit();
    }
    //Edit metadata and delete are only available per resource (no batch yet) so disable them if not exactly one left
    if (pids.length != 1){
   //   jQuery("#edit-resource-metadata-menu").addClass("ui-state-disabled");
      jQuery("#manage-resource").addClass("ui-state-disabled");
    }else{
      jQuery("#edit-resource-metadata-menu").removeClass("ui-state-disabled");
      jQuery("#manage-resource").removeClass("ui-state-disabled");
    }
  }); //End onclick
    table.on( 'length', function ( e, settings, len ) {
      writeCookie('Drupal.pageLength',parseInt(len),'30')
    } );
}
/*
 * Prepares the resource table to respond to user inputs: dragging, changing filters, entering search parameters
 */
sidora.concept.LoadContentHelp.Resources.TableActionsSetup = function(){
  //Put a more compact pager in place
  jQuery("#res_table_wrapper").before('<div id="sidora-resources-button-row" style=""><div id="sidora-resources-button-first" class="sidora-resources-icon" style="    background-position: -306px -44px;"></div><div id="sidora-resources-button-prev" class="sidora-resources-icon" style="    background-position: -231px -4px;"></div><div id="sidora-resources-pager" style="display:inline-block;vertical-align: top;padding-top: 7px;"><div id="sidora-resources-page-text" style="display:inline-block">Page</div><input id="sidora-resources-page-number" type="text" size="2" class="form-text"/><div id="sidora-resources-page-count" style="display:inline-block">of </div></div><div id="sidora-resources-button-next" class="sidora-resources-icon" style="    background-position: -270px -4px;"></div><div id="sidora-resources-button-last" class="sidora-resources-icon" style="    background-position: -346px -44px;"></div></div>');
  jQuery("#sidora-resources-button-first").click(function(){ jQuery(".paginate_button.first").click();  });
  jQuery("#sidora-resources-button-prev").click(function(){ jQuery(".paginate_button.previous").click();  });
  jQuery("#sidora-resources-button-next").click(function(){ jQuery(".paginate_button.next").click();  });
  jQuery("#sidora-resources-button-last").click(function(){ jQuery(".paginate_button.last").click();  });
  jQuery("#res_table_paginate").hide();
  jQuery("#sidora-resources-page-number").change(function(){
    jQuery(".paginate_input").val(jQuery("#sidora-resources-page-number").val()).change();
  }); 
  jQuery('#res_table').on( 'draw.dt', function () {
  jQuery(".sidora-resources-icon").addClass("disabled");
  var info = jQuery(this).DataTable().page.info();
  if (info.page+1 < info.pages) jQuery("#sidora-resources-button-next").removeClass("disabled");
  if (info.page+1 < info.pages) jQuery("#sidora-resources-button-last").removeClass("disabled");
  if (info.page > 0) jQuery("#sidora-resources-button-first").removeClass("disabled");
  if (info.page > 0) jQuery("#sidora-resources-button-prev").removeClass("disabled");
    jQuery('#sidora-resources-page-number').val((1+info.page));
    jQuery('#sidora-resources-page-count').html(' of '+info.pages );
    if (sidora.resources.individualPanel.resourceOfInterest){
      jQuery(this).find(jq(sidora.resources.individualPanel.resourceOfInterest.pid)).trigger("click");
      if (readCookie('Drupal.selectResource') == '1'){
        writeCookie('Drupal.selectResource','0','30');
        jQuery('#res_table tbody').children('tr:first').trigger('click');
      }    
    }
  } );
  //Drag and drop enabling
  jQuery('#res_table tbody').on('mousedown','tr', function (e) {
    //If the mousedown is on something that is in the middle of a move process, ignore the mousedown
    var isStartOfCopy = (e.ctrlKey || e.metaKey);
    var displayPlusToIndicateCopy = isStartOfCopy ? "display:inline" : "display:none";
    if (jQuery(this).hasClass("is-being-moved")){
      console.log("Item is being moved, ignoring mousedown");
      return;
    }
    //Given the following circumstances, these are the desired results:
    //Highlight none, drag one: no change in highlight, perform operation on dragged item
    //Highlight one, drag it: no change in highlight, perform on dragged / highlighed item
    //Highlight one, drag different: deselect highlight, perform operation on single dragged item
    //Highlight multiple, drag one that is highlighted: no change in highlight, perform operation on all highlighted
    //Highlight multiple, drag one that is not highlighted: deselect all, perform operation on single dragged item
    sidora.util.dragResources = [jQuery(this).attr("id")];
    var highlightedPids = sidora.resources.getHighlighted();
    if (highlightedPids.indexOf(sidora.util.dragResources[0]) == -1){
      //This means we are dragging something that was not highlighted
      console.log("dragging a non-highlighted");
    }else{
      console.log("dragging a highlighted");
      //We are dragging something that is highlighted
      //No matter which one, do the operations on all of them
      //Since it's highlighted, the "dragResources" should point to all of the pids
      sidora.util.dragResources = highlightedPids;
      return jQuery.vakata.dnd.start(e, 
        { 
          'jstree' : true, 
          'obj' : highlightedPids, 
          'nodes' : [{ id : true, text: highlightedPids.length+' resources'}] 
        }, 
        '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + highlightedPids.length+' resources' + '<span class="fakejstree-copy" style="'+displayPlusToIndicateCopy+'">+</span></div>'
      );
       
    }
    return jQuery.vakata.dnd.start(e, 
      { 
        'jstree' : true, 
        'obj' : jQuery(this), 
        'nodes' : [{ id : true, text: jQuery(this).text() }] 
      }, 
      '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + jQuery(this).text() + '<span class="fakejstree-copy" style="'+displayPlusToIndicateCopy+'">+</span></div>'
    );
  });
  jQuery('#res_table_filter').after('<select id=\"sidora-resource-type-dropdown\" class="form-select" name=\"search\"><option value=\"\">All</option><option value=\"images\">Image</option><option value=\"pdf\">Digitized Text</option><option value=\"csv\">Tabular Dataset</option><option value=\"audio\">Audio</option><option value=\"video\">Video</option></select><input type="text" name="titleFilter" id="titleFilter" style="border: solid 1px lightblue;">');
  if (readCookie('Drupal.dtFilter') != ''){
    jQuery("#sidora-resource-type-dropdown").val(readCookie('Drupal.dtFilter'));
  }   
  jQuery('#titleFilter').after(' <div id="sidora-resource-sort">  Sort: '+'<select id=\"sidora-resource-sort-dropdown\" class="form-select" name=\"sort\"><option value=\"title\">Title</option><option value=\"model\">Model</option><option value=\"created\" selected=\"selected\">Created</option></select></div>');
  jQuery('#sidora-resource-sort-dropdown').after('  <select id=\"sidora-resource-sortorder-dropdown\" class="form-select" name=\"sortorder\"><option value=\"ASC\">Ascending</option><option value=\"DESC\" selected=\"selected\">Descending</option></select>');
  if (readCookie('Drupal.sortOn') != ''){
    jQuery('#sidora-resource-sort-dropdown').val(readCookie('Drupal.sortOn'));
  }
  if (readCookie('Drupal.sortOrder') != ''){
    jQuery("#sidora-resource-sortorder-dropdown").val(readCookie('Drupal.sortOrder'));
  }     
  jQuery("#res_table_length select").addClass("form-select");
  sidora.resources.reloadDatatableBasedOnCurrentFilters = function(){
    var changeTo = jQuery('#sidora-resource-type-dropdown').val();
    jQuery('#res_table_filter input').val(changeTo);
    var recentSearchVal = jQuery("#titleFilter").val();
    changeTo += "\n"+recentSearchVal;
    var sortOn = (readCookie('Drupal.sortOn') != '')?readCookie('Drupal.sortOn'):jQuery('#sidora-resource-sort-dropdown').val();
    var sortOrder = (readCookie('Drupal.sortOrder') != '')?readCookie('Drupal.sortOrder'):jQuery('#sidora-resource-sortorder-dropdown').val();
    changeTo += "\n"+sortOn+"\n"+sortOrder;
    window.sidora.resources.dataTable.DataTable().search(changeTo).draw();
    window.sidora.util.resourceSearchLastSearchVal = recentSearchVal;
  }
  jQuery("#titleFilter").keyup(function(){
    sidora.util.resourceSearchCountdown = 'started';
    var recentSearchVal = sidora.util.resourceSearchValue = jQuery("#titleFilter").val();
    setTimeout(function(){
      if (sidora.util.resourceSearchValue != sidora.util.resourceSearchLastSearchVal){
        if (recentSearchVal == jQuery("#titleFilter").val()){
          sidora.resources.reloadDatatableBasedOnCurrentFilters();
        }
      }
    },3000); //Start the search if there is no key press for 3 seconds
  });
  jQuery('#sidora-resource-type-dropdown').change(function(){
    writeCookie('Drupal.dtFilter',jQuery('#sidora-resource-type-dropdown').val(),'30')
    sidora.resources.reloadDatatableBasedOnCurrentFilters();
  });
  jQuery('#sidora-resource-sort-dropdown').change(function(){
   writeCookie('Drupal.sortOn',jQuery('#sidora-resource-sort-dropdown').val(),'30')
   sidora.resources.reloadDatatableBasedOnCurrentFilters();
   });
  jQuery('#sidora-resource-sortorder-dropdown').change(function(){
   writeCookie('Drupal.sortOrder',jQuery('#sidora-resource-sortorder-dropdown').val(),'30')
   sidora.resources.reloadDatatableBasedOnCurrentFilters();
   });
}
/*
 * Sets the visiblility of menu items on the concept menu.  Remember, this is UI only and is not to be used for security
 */
sidora.concept.LoadContentHelp.Permissions = function(conceptOfInterest){
  jQuery.ajax({
    dataType: "json",
    url: Drupal.settings.basePath+'sidora/info/'+conceptOfInterest+'/permission',
    success: function(permissions){
      jQuery("#concept-create").toggle(permissions.create);
      jQuery("#deleteConcept").toggle(permissions.delete);
      jQuery("#editMetadataConcept").toggle(permissions.update); 
      jQuery("#editPermissionsConcept").toggle(permissions.permission); 
      jQuery("#manageConcept").toggle(permissions.manage); 
    }
  });
}
/*
 * Sets the visiblility of exhibition menu item on the concept menu.
 */
sidora.concept.LoadContentHelp.Exhibition_view = function(conceptOfInterest){
  jQuery.ajax({
    dataType: "json",
    url: Drupal.settings.basePath+'sidora/info/'+conceptOfInterest+'/exhibition',
    success: function(exhibitions){
      jQuery("#exhibitConcept").attr('onclick', '');
      jQuery("#exhibitConcept").children('a').attr('onclick',exhibitions.action);
      jQuery("#exhibitConcept").children('a').toggleClass('ui-state-disabled',exhibitions.ui_state_disable);
    }
  });
}
/*
 * Loads the concept relationships screen for the concept
 */
sidora.concept.LoadContentHelp.Relationships = function(conceptOfInterest, placementLocation){
  if (typeof(conceptOfInterest) == 'undefined' || conceptOfInterest == null) conceptOfInterest = sidora.concept.GetPid();
  if (typeof(placementLocation) == 'undefined' || placementLocation == null) placementLocation = '#concept-relationships';
  jQuery.ajax({
    url: Drupal.settings.basePath+'sidora/info/'+conceptOfInterest+"/relationships"
  }).done(function(relationship_html){
    jQuery(placementLocation).html(relationship_html);
  }).fail(function(meta_html){
    var myDiv = sidora.util.getErrorMessageHtml();
    jQuery(placementLocation).children().remove();
    jQuery(placementLocation).append(myDiv);
    sidora.recentAjaxFailure(meta_html);
  });
}
/*
 * Loads the metadata screen for the concept
 */
sidora.concept.LoadContentHelp.Metadata = function(conceptOfInterest){
  jQuery.ajax({
    url: Drupal.settings.basePath+'sidora/info/'+conceptOfInterest+'/meta/sidora_xsl_config_variable/browser/html',
  }).done(function(meta_html){
    //if the data is direct text, put it into a error message
    if (!sidora.util.hasElement(meta_html)){
      meta_html = '<div class="error-message">'+meta_html+'</div>';
    }
    myDiv = jQuery(meta_html);
    jQuery('#concept-meta .metadata-table').remove();
    jQuery('#concept-meta').append(myDiv);
    jQuery('#edit-concept-metadata-menu').click(function(){
      Shadowbox.open({
        content:    Drupal.settings.basePath+"sidora/edit_metadata/"+window.sidora.concept.GetPid()+"",
        player:     "iframe",
        title:      "Edit Metadata",
        options: {
          onFinish:  function(){}
        }
      });
    });
    jQuery("#resource-download").unbind('click');
    jQuery("#resource-download").click(function(){
      sidora.resources.download();
    });
    jQuery("#resource-open-window").unbind('click');
    jQuery("#resource-open-window").click(function(){
      sidora.resources.openInNewWindow();
    });
    sidora.ResizeToBrowser();
  }).fail(function(meta_html){
    var myDiv = sidora.util.getErrorMessageHtml();
    jQuery('#concept-meta .metadata-table').remove();
    jQuery('#concept-meta').append(myDiv);
    sidora.recentAjaxFailure(meta_html);
  });
}
/*
 * Loads the menu for the add resources menu and replaces the existing one.  This is not necessary at the current time since the menu is
 * unchanging, but for the future they envision that types of resources may be excluded from certain concepts.
 */
sidora.concept.LoadContentHelp.CreateResourceMenu = function(conceptOfInterest){
  var ontologyUrl = Drupal.settings.basePath+"sidora/info/"+conceptOfInterest+"/resource_menu_json";
  jQuery.ajax(
  {
    dataType: "json",
    url: ontologyUrl,
    error: function(){
      console.log("error on create resource menu");
    },
    success: function (json_obj){
    var menu_html = window.sidora.ontology._createSubmenu(json_obj);
    var availableResourcesToCreateForConceptHtml = menu_html;
    jQuery("#resource-create").remove();
    if (menu_html.length > 0){
      jQuery("#resource-files-menu").append('<li id="resource-create"><a id="resource-create-link" href="#" onclick="return false;"><input type="image" src="'+Drupal.settings.basePath+'sites/all/modules/islandora_xml_forms-7.x-1.7/elements/images/add.png" title="Create a new resource as a child of the highlighted concept."> Add&nbsp;resource</a><ul>'+availableResourcesToCreateForConceptHtml+'</ul></li>');
      jQuery("#resource-create a").attr("onclick","return false;");
      jQuery("#resource-create a").click(function(){
        var model = jQuery(this).attr("model");
        var form = jQuery(this).attr("formname");
        var ontologyId = jQuery(this).attr("ontology-id");
        if (typeof(model) != 'undefined' && "" != model){
          var url = Drupal.settings.basePath+"sidora/create_resource/"+window.sidora.concept.GetPid()+"/"+model+"/";
          if (typeof(form) != 'undefined') {
            url += form + "/" + ontologyId + "/fresh";
          }
          Shadowbox.close();
          setTimeout(function(){
          Shadowbox.open({
            content:    url,
            player:     "iframe",
            title:      "Create Resource",
            options: {
              onFinish:  function(){}
            }
          });},1000);
        }
      });
    }
    resetMenu("resource-menu");
    },
    fail: function(failure_obj){
      sidora.recentAjaxFailure(failure_obj);
    }
  });
}
/*
 * Loads the Resource List panel with information from the input concept pid
 */
sidora.concept.LoadContentHelp.FullTableReload = function(conceptOfInterest){
  jQuery.ajax({
    url: Drupal.settings.basePath+'sidora/info/'+conceptOfInterest+'/resources/all/browser/html_placeholder'
  }).done(function(resources_table){
    myDiv = jQuery(resources_table);
    jQuery('#concept-resource-list-internal').children().not('.workbench-nav').remove();
    jQuery('#concept-resource-list-internal').append(myDiv);
    sidora.concept.LoadContentHelp.Resources.TableLoad(conceptOfInterest);
    sidora.concept.LoadContentHelp.Resources.TableActionsSetup();
    sidora.concept.LoadContentHelp.CreateResourceMenu(conceptOfInterest);
    sidora.concept.LoadContentHelp.Relationships();
    sidora.ResizeToBrowser();
  }).fail(function(failure_obj){
    var myDiv = sidora.util.getErrorMessageHtml();
    jQuery('#concept-resource-list-internal').children().not('.workbench-nav').remove();
    jQuery('#concept-resource-list-internal').append(myDiv);
    sidora.recentAjaxFailure(failure_obj);
  });
}
/*
 * Loads the Concept Content Panels, preps menus and actions
 */
sidora.concept.loadedContentPid = null;
sidora.concept.forceRefreshOnNextLoadContent = false;
sidora.concept.LoadContent = function(leaveContentIfAlreadyLoaded){
  if (typeof(leaveContentIfAlreadyLoaded) == 'undefined') leaveContentIfAlreadyLoaded = false;
  if (this.forceRefreshOnNextLoadContent) {
    leaveContentIfAlreadyLoaded = false; 
    this.forceRefreshOnNextLoadContent = false;
  }
  conceptOfInterest = sidora.concept.GetPid();
  //Don't continue if we want to leave the current concept info (e.g. only load a new one)
  console.log("Concept Pid:"+conceptOfInterest+" currently loaded:"+sidora.concept.loadedContentPid+" leaveContentIfAlreadyLoaded:"+leaveContentIfAlreadyLoaded);
  if (conceptOfInterest == this.loadedContentPid && leaveContentIfAlreadyLoaded) return;
  
  if ("" == conceptOfInterest){
		jQuery("#sidora_content_concept_info").hide();
    return;
  }
  jQuery("#sidora_content_concept_info").show();
  jQuery('#concept-meta .error-message').remove();

  sidora.concept.LoadContentHelp.Permissions(conceptOfInterest);
  sidora.concept.LoadContentHelp.Exhibition_view(conceptOfInterest);
  sidora.concept.LoadContentHelp.Metadata(conceptOfInterest);
  sidora.concept.LoadContentHelp.FullTableReload(conceptOfInterest);
  sidora.concept.loadedContentPid = conceptOfInterest;
  sidora.ReformatPage();
}
/*
 * Used to see if there is at least a tag in there someplace
 * so if it's a straight string we know to wrap it in an element before trying to display via jQuery
 */
sidora.util.hasElement = function(data){
  return /<[a-z][\s\S]*>/i.test(data);
}
/*
 * Get what the href would be for the parent of the input href, null if cannot figure it out
 */
sidora.util.getParentHref = function(existingHref) {
  ehParts = existingHref.split("#");
  if (ehParts.length != 2) return null;
  if (ehParts[1].indexOf("path") == -1) return null;
  var ehPath = ehParts[1].substring(ehParts[1].indexOf("path") + 5);
  if (ehPath.indexOf(",") == -1) {
    //One down from root
    return ehParts[0] + "#" + ehPath + "?path=";
  }
  var pathParts = ehPath.split(",");
  var newConcept = pathParts.pop();
  return ehParts[0] + "#" + newConcept + "?path=" + pathParts.join(',');
}
/*
 * Get the node id that has a specified href path (does NOT need to be a DOM object), null if not found
 */
sidora.util.getNodeIdByHref = function(currentUrl) {
  var jstreeIdSelected = null;
  var jst = jQuery("#forjstree").jstree();
  var existingTreeNodes = jst.get_json('#', {flat:true});
  jQuery.each(existingTreeNodes,function(i,obj){
    if (obj.a_attr.href == currentUrl) jstreeIdSelected = obj.id;
  });
  return jstreeIdSelected;
}
/*
 * Opens the tree to the specified path or up through the path that can be opened
 * @param currentUrl - the href of the item to be opened, if not passed in the browser location is used
 */
sidora.util.openToCurrentPathAndSelectItem = function(currentUrl){
  if (typeof(currentUrl) == 'undefined' || currentUrl == null) {
    currentUrl = window.location.pathname + window.location.search + window.location.hash;
  } 
  var jst = jQuery("#forjstree").jstree();
  var jstreeIdSelected = sidora.util.getNodeIdByHref(currentUrl);
  toOpen = [];
  //Figure out the path down the tree to open up
  toOpen.unshift(jstreeIdSelected);
  while(toOpen[0] != false){
    toOpen.unshift(jst.get_parent(toOpen[0]));
  }
  //Close the entire tree
  jst.close_all();
  //Open up the path that was figured out above
  for (i = 0; i < toOpen.length; i++){
    if (toOpen[i]) jst.open_node(toOpen[i]);
  }
  var itemSelectorForCurrentItemInTree = 'a[href=\"'+currentUrl+'\"]';
  var selectThisNode = jst.get_node(itemSelectorForCurrentItemInTree);
  sidora.util.loadTreeSectionsIfNeeded(selectThisNode);
  jst.select_node(selectThisNode); 
}
sidora.util.throbberize = function() {
  //Prep the UI for children incoming
  if (jQuery("#forjstree a").not("[conceptchildren=0]").parent(".jstree-leaf").length > 0){
    jQuery("#forjstree a").not("[conceptchildren=0]").parent(".jstree-leaf").children("i")
      .css("background","url(../../misc/throbber.gif) no-repeat 6px -14px");
    jQuery("#forjstree a").not("[conceptchildren=0]").parent(".jstree-leaf").removeClass("jstree-leaf")
  }
}
/*
 * Given a node, loads its grandchildren if needed and checks the validation status of grandchildren
 * @param data - jstree node or item that has a node attribute containing a jstree node
 */
sidora.util.loadTreeSectionsIfNeeded = function(data){
  if (data == false) return;
  var jst = jQuery("#forjstree").jstree();
  var node = data;
  if (typeof(data.node) != 'undefined') {
    node = data.node;
  }
  var jst = jQuery("#forjstree").jstree(true);
  var openingPid = node.a_attr.pid;
  var currentChildrenPids = sidora.util.childrenPidsListedInUIByNode(node);
  var childPidsCsv = currentChildrenPids.join();
  if (childPidsCsv.length > 0) {
    sidora.util.checkUIForInvalidPids(openingPid, childPidsCsv);
    sidora.util.throbberize();
    //load the next section of the tree
    if (currentChildrenPids.length > 0){
      //Only load information if the currentChildren have children that are not listed
      var doRetrieval = false;
      for (var ccc = 0; ccc < currentChildrenPids.length; ccc++ ){
        var numberOfChildrenThisShouldHave = parseInt(jst.get_node(node.children[ccc]).a_attr.conceptchildren);
        var numberOfChildrenThisDoesHave = jst.get_node(node.children[ccc]).children.length;
        if (numberOfChildrenThisShouldHave > numberOfChildrenThisDoesHave) {
          doRetrieval = true;
        }
      }
      if (doRetrieval) {
        sidora.util.loadTreeSection(openingPid);
      }
    }
  }
}
sidora.queue = new SidoraQueue();
sidora.InitiateJSTree = function(){
  //loaded.jstree will also be called whenever a node is added to the tree programmatically
  jQuery('#forjstree').bind('loaded.jstree', function(e,data){setTimeout(function(){
    //Figure out what's supposed to be selected, given the information in the hash
    var currentUrl = window.location.pathname + window.location.search + window.location.hash;
    var jst = jQuery("#forjstree").jstree();
    jstreeIdSelected = sidora.util.getNodeIdByHref(currentUrl);

    //If the item is not available, walk down the path until it is
    if (jstreeIdSelected == null){
      var walkerItems = window.location.hash.substr(window.location.hash.indexOf("?path=")+6);
      var walkerItemArray = walkerItems.split(",");
      var newMainItem = '';
      var openingPid = null;
      while(walkerItemArray.length > 0 && walkerItemArray[0] != "" && jstreeIdSelected == null){ 
        var rearrangedHash = '#'+walkerItemArray.pop()+"?path="+walkerItemArray.join(",");
        var checkUrl = window.location.pathname + window.location.search + rearrangedHash;
        jstreeIdSelected = sidora.util.getNodeIdByHref(checkUrl);
      }
      if (jstreeIdSelected != null) {
        //Is not loaded yet if we think children should be there but not there
        var treeNode = jst.get_node(jstreeIdSelected);
        if (treeNode.a_attr.conceptchildren > treeNode.children.length) {
          var parentNode = jst.get_node(treeNode.parent);
          var openingPid = parentNode.a_attr.pid;
          sidora.util.loadTreeSection(openingPid, function(){
            jQuery("#forjstree").trigger("loaded.jstree");
          });
          return;
        }
      }
    }
    sidora.util.openToCurrentPathAndSelectItem(currentUrl);
    //When you select a node, update the url in the browser, change the page title (not browser title) and load the concept content into the main window
    jQuery("#forjstree").unbind('select_node.jstree');
    jQuery('#forjstree').bind('select_node.jstree', function(e,data) {
      var jst = jQuery("#forjstree").jstree();
      window.location = jQuery('#'+data.selected[0]).children('a').attr('href');
      sidora.UpdateTitleBasedOnNameInTree(jQuery(jQuery('#'+data.selected[0]).find("a")[0]).text());
      sidora.concept.LoadContent();
      sidora.util.loadTreeSectionsIfNeeded(data);
    });
    jQuery("#forjstree").unbind('copy_node.jstree');
    jQuery('#forjstree').bind('copy_node.jstree', function (e, data) {
      //Copy node
      var toMovePid = data.node.a_attr.pid;
      var moveToPid = jQuery("#"+data.parent+" a").attr('pid');
      var actionUrl = Drupal.settings.basePath+'sidora/ajax_parts/copy/'+moveToPid+'/'+toMovePid
      if (typeof(toMovePid) == 'undefined'){
        //Both types of resource drags are interpreted as "copy_node"
        //regardless of whether control is held down
        //console.log("resource copy/move");
        jQuery("#forjstree").jstree("delete_node",data.node);
        return; //resource actions are handled by the 'dnd_stop.vakata' event
      }
      var jst = jQuery("#forjstree").jstree(true);
      var newParentExistingChildConceptsNumber = parseInt(jQuery("#"+data.parent).children("a").attr("conceptchildren"));
      var npReplacer = newParentExistingChildConceptsNumber+1;
      jQuery("#"+data.parent).children("a").attr("conceptchildren",""+npReplacer);
      jst.get_node(data.parent).a_attr.conceptchildren = ""+npReplacer;
      sidora.queue.incomingRequestsAreSilent = true;
      sidora.queue.Request('Copy Concept', actionUrl, function(){
        sidora.concept.LoadContentHelp.Relationships();
      }, 
      sidora.util.createFunctionRefreshTree(moveToPid)
      , [moveToPid,toMovePid],'copyConcept');
      sidora.queue.incomingRequestsAreSilent = false;
      sidora.queue.Next();
    });
    jQuery("#forjstree").unbind('open_node.jstree');
    jQuery('#forjstree').bind('open_node.jstree', function (e, data) {
      sidora.util.loadTreeSectionsIfNeeded(data);
    });

    jQuery("#forjstree").unbind('delete_node.jstree');
    jQuery('#forjstree').bind('delete_node.jstree',function(event,data){
      var jst = jQuery("#forjstree").jstree(true);
      if (typeof(jst.pureUIChange) != 'undefined' && jst.pureUIChange) return; //don't want a Fedora change
      var toMovePid = data.node.a_attr.pid;
      var moveFromPid = jQuery("#"+data.parent+" a").attr('pid');
      var actionUrl = Drupal.settings.basePath+'sidora/ajax_parts/unassociate/'+moveFromPid+'/'+toMovePid;
      var poi = data.parent;
      //Old Parent renumber
      var oldParentExistingChildConceptsNumber = parseInt(jQuery("#"+poi).children("a").attr("conceptchildren"));
      var opReplacer = oldParentExistingChildConceptsNumber-1;
      jQuery("#"+poi).children("a").attr("conceptchildren",""+opReplacer);
      jst.get_node(poi).a_attr.conceptchildren = ""+opReplacer;
      //next requests are silent
      sidora.queue.incomingRequestsAreSilent = true;
      sidora.queue.Request('Remove concept association', actionUrl, function(){
        sidora.concept.LoadContentHelp.Relationships();
      },
      sidora.util.createFunctionRefreshTree(moveFromPid)
      , [toMovePid,moveFromPid],'unassociate');
      sidora.queue.incomingRequestsAreSilent = false;
      sidora.queue.Next();
    });

    jQuery("#forjstree").unbind('move_node.jstree');
    jQuery('#forjstree').bind('move_node.jstree',function(event,data){
      var jst = jQuery("#forjstree").jstree(true);
      if (typeof(jst.pureUIChange) != 'undefined' && jst.pureUIChange) return; //don't want a Fedora change
      var toMovePid = data.node.a_attr.pid;
      var moveToPid = jQuery("#"+data.parent+" a").attr('pid');
      var moveFromPid = jQuery("#"+data.old_parent+" a").attr('pid');
      console.log("Move:"+toMovePid+" from:"+moveFromPid+" to:"+moveToPid);
      if (moveFromPid == moveToPid){ console.log('move to itself, ignoring...'); return; }
      var actionUrl = Drupal.settings.basePath+'sidora/ajax_parts/move/'+moveFromPid+'/'+moveToPid+'/'+toMovePid;

      //New Parent renumber
      var newParentExistingChildConceptsNumber = parseInt(jQuery("#"+data.parent).children("a").attr("conceptchildren"));
      var npReplacer = newParentExistingChildConceptsNumber+1;
      jQuery("#"+data.parent).children("a").attr("conceptchildren",""+npReplacer);
      jst.get_node(data.parent).a_attr.conceptchildren = ""+npReplacer;
      //Old Parent renumber
      var oldParentExistingChildConceptsNumber = parseInt(jQuery("#"+data.old_parent).children("a").attr("conceptchildren"));
      var opReplacer = oldParentExistingChildConceptsNumber-1;
      jQuery("#"+data.old_parent).children("a").attr("conceptchildren",""+opReplacer);
      jst.get_node(data.old_parent).a_attr.conceptchildren = ""+opReplacer;
      //next requests are silent
      sidora.queue.incomingRequestsAreSilent = true;
      sidora.queue.Request('Concept move', actionUrl, function(){
        sidora.concept.LoadContentHelp.Relationships();
      },
      sidora.util.createFunctionRefreshTree([moveToPid,moveFromPid])
      , [moveToPid,toMovePid,moveFromPid],'moveConcept');
      sidora.queue.incomingRequestsAreSilent = false;
      sidora.queue.Next();
    });
    jQuery("#forjstree").bind("before.jstree", function(e, data){
      console.log("bjt");
    });


    jQuery('#forjstree').show();
    var updateLocationWith = jQuery('#'+jstreeIdSelected).children('a').attr('href');
    if (typeof(updateLocationWith) != 'undefined') window.location = updateLocationWith;
    //if the content is already based on the highlighted concept, do nothing
    sidora.UpdateTitleBasedOnNameInTree();
    sidora.concept.LoadContent(true);
  },200)});
  jQuery('#forjstree').hide();
  jQuery('#forjstree').jstree({
    "core" : {
      "check_callback": function(callbackType,draggedObjects,mouseOverObject,someNum,dragStatus){
        if (callbackType == "copy_node"){
          //Note that all resource moves are also considered "copy_node"
          if (typeof(draggedObjects.instance) == 'undefined'){ 
            //instance only exists if it is being dragged from a tree, resources do not exist in a jstree
            if (dragStatus.core){
              //Resource
              if ((jQuery('.jstree-copy:visible').length > 0) || (jQuery('.fakejstree-copy:visible').length > 0)){
                //is a copy
                var showText = "Copy the following resources to "+jQuery("#"+mouseOverObject.id).children("a").attr("fullname");
                showText += " ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):";
                showText += "<ul>";
                jQuery.ajax({
                  url: Drupal.settings.basePath+"sidora/ajax_parts/generate_resource_list/"+jQuery("#"+mouseOverObject.id).children("a").attr("pid"),
                  success: function(resourceList){
                    var currentChildrenPids = JSON.parse(resourceList);;
                    var resourcesToCopyOver = [];
                    for (var i = 0; i < sidora.util.dragResources.length; i++){
                       showText += "<li>"+jQuery(jq(sidora.util.dragResources[i])).find(".resource-list-label").text();
                       showText += " ("+sidora.util.dragResources[i]+")";
                      if (jQuery.inArray(sidora.util.dragResources[i], currentChildrenPids) > -1){ 
                         showText += " - Already exists on target, will not copy</li>";
                      }else{
                         showText += "</li>";
                         resourcesToCopyOver.push(sidora.util.dragResources[i]);
                      }  
                    }
                    showText += "</ul>";
                    if (resourcesToCopyOver.length > 0){
                       sidora.util.Confirm("Copy resource",showText,
                         function(){
                           sidora.resources.performCopyOrMove("copy",mouseOverObject.id, resourcesToCopyOver);
                         }
                      );
                    }else{
                      sidora.util.Confirm("Copy item","All items selected for copy already exist on the target.");
                   }
                  } 
                });  
              }else{
                //is a move
                var showText = "Move the following resources to "+jQuery("#"+mouseOverObject.id).children("a").attr("fullname")+" ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):";
                showText += "<ul>";
                var showTextForUnassociate = "The resources listed below existed on the target already and will not be overwritten. They will be removed from the concepts that they were dragged from:<ul>";
                jQuery.ajax({
                  url: Drupal.settings.basePath+"sidora/ajax_parts/generate_resource_list/"+jQuery("#"+mouseOverObject.id).children("a").attr("pid"),
                  dataType: "json",
                  error: function(){}, //OCIO error page will not parse as JSON, will be error. TBD, retry this command?
                  success: function(currentChildrenPids){
                    var resourcesToMoveOver = [];
                    var resourcesToUnassociate = [];
                    for (var i = 0; i < sidora.util.dragResources.length; i++){
                      if (jQuery.inArray(sidora.util.dragResources[i], currentChildrenPids) > -1){ 
                        showTextForUnassociate += "<li>"+jQuery(jq(sidora.util.dragResources[i])).find(".resource-list-label").text();
                        showTextForUnassociate += " ("+sidora.util.dragResources[i]+")</li>";
                        resourcesToUnassociate.push(sidora.util.dragResources[i]);
                      }else{
                        showText += "<li>"+jQuery(jq(sidora.util.dragResources[i])).find(".resource-list-label").text();
                        showText += " ("+sidora.util.dragResources[i]+")";
                        resourcesToMoveOver.push(sidora.util.dragResources[i]);
                      }  
                    }
                    showText += "</ul>";
                    showTextForUnassociate += "</ul>";
                    if (resourcesToMoveOver.length > 0){
                      if (!sidora.util.isConfirmShowing()){
                        if (resourcesToUnassociate.length > 0) showText += showTextForUnassociate;
                        sidora.util.Confirm("Move resource",showText,
                          function(){
                           sidora.resources.performCopyOrMove("move",mouseOverObject.id, resourcesToMoveOver);
                           for (rtui = 0; rtui < resourcesToUnassociate.length; rtui++){
                             sidora.util.deletePid(resourcesToUnassociate[rtui]);
                           }
                          }
                        );
                      }     
                    }else{
                      if (!sidora.util.isConfirmShowing()){
                        sidora.util.Confirm(
                          "Move Resources",
                          "<h4>All items selected for move already exist on the target.</h4>"+showTextForUnassociate,
                          function(){
                            sidora.resources.performCopyOrMove("move",mouseOverObject.id, resourcesToUnassociate);
                          }
                        );
                      }
                    }
                  } 
                });  
              } 
              return false; //Dont immediately perform the copy
            }
          }else{
            if (sidora.util.userConfirmedCopy){
              return true;
            }
            //Concept
            if (dragStatus.core){
              var parentPid = jQuery("#"+mouseOverObject.id).children("a").attr("pid");
              sidora_util.lock.Obtain(parentPid,function(){
                var lockAttempt = jQuery.parseJSON(arguments[0][0]);
                if (lockAttempt.error){
                  sidora.util.Confirm("Copy item","The target is locked by another user.");
                  return;
                }
                sidora_util.lock.KeepAlive();
                var jst = jQuery("#forjstree").jstree(true);
                var parentNode = jst.get_node(mouseOverObject.id);
                var currentChildren = parentNode.children;
                var currentChildrenPids = [];
                for(var i=0; i<currentChildren.length; i++){
                  currentChildrenPids.push(jst.get_node(currentChildren[i]).a_attr.pid);
                  //console.log("ccp:"+i+":"+currentChildrenPids[i]);
                }
                 
                var showText = "Copy the following concepts to ";
                showText += jQuery("#"+mouseOverObject.id).children("a").attr("fullname");
                showText += " ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):<ul>";
                var selected = jQuery("#forjstree").jstree(true).get_selected();
                //If they dragged something that is not selected only copy that item (next 2 lines)
                var indexInArray = jQuery.inArray(draggedObjects.id,selected);
                if (indexInArray == -1) selected = [draggedObjects.id];
                var objectsToCopyOver = [];
                for(var i=0; i<selected.length; i++){
                  var currSel = jQuery(jq(selected[i])).children("a");
                  if (jQuery.inArray(currSel.attr("pid"),currentChildrenPids) > -1){
                    showText += "<li>"+currSel.attr("fullname")+" ("+currSel.attr("pid")+") - Already exists on target, will not copy</li>";
                  }else{
                    showText += "<li>"+currSel.attr("fullname")+" ("+currSel.attr("pid")+")</li>";
                    objectsToCopyOver.push(selected[i]);
                  }
                }
                showText += "</ul>";
                if (objectsToCopyOver.length > 0){
                  if (!sidora.util.isConfirmShowing()){
                    sidora.util.Confirm("Copy item",showText,
                      function(){
                        sidora.util.userConfirmedCopy = true;
                        for(var objIndex = 0; objIndex < objectsToCopyOver.length; objIndex++){
                          var currToCopyId = objectsToCopyOver[objIndex];
                          var currToCopyNode = jst.get_node(currToCopyId);
                          jQuery("#forjstree").jstree(true).copy_node(currToCopyNode,mouseOverObject); 
                        }
                        sidora.util.userConfirmedCopy = false;
                      },null,null,null,function(){
                        sidora_util.lock.Release(parentPid);
                      }
                    );
                  }
                }else{
                  sidora.util.Confirm("Copy item","All items selected for copy already exist on the target.",
                    null,null,null,null,function(){
                      sidora_util.lock.Release(parentPid);
                    }
                  );
                }
              });
              return false; //Dont immediately perform the copy
            }
          }
          if (dragStatus.pos == "b") return false; //no inbetweens so take out "before"
          if (dragStatus.pos == "a") return false; //no inbetweens so take out "after"
        }
        if (callbackType == "move_node"){
          var jst = jQuery("#forjstree").jstree(true);
          if (typeof(jst.pureUIChange) != 'undefined' && jst.pureUIChange) return true; //don't want a Fedora change
          if (sidora.util.userConfirmedMove){
            return true;
          }
          if (dragStatus.core){
            var parentPid = jQuery("#"+mouseOverObject.id).children("a").attr("pid");
            sidora_util.lock.Obtain(parentPid,function(){
              var lockAttempt = jQuery.parseJSON(arguments[0][0]);
              if (lockAttempt.error){
                sidora.util.Confirm("Move concept","The target is locked by another user.");
                return;
              }
              sidora_util.lock.KeepAlive();
              var parentNode = jst.get_node(mouseOverObject.id);
              var currentChildren = parentNode.children;
              var currentChildrenPids = [];
              for(var i=0; i<currentChildren.length; i++){
                currentChildrenPids.push(jst.get_node(currentChildren[i]).a_attr.pid);
                //console.log("ccp:"+i+":"+currentChildrenPids[i]);
              }
               
              var showText = "Move the following concepts to ";
              showText += jQuery("#"+mouseOverObject.id).children("a").attr("fullname");
              showText += " ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):<ul>";
              var showTextForUnassociate = "The concepts listed below existed on the target already and will not be overwritten. They will be removed from the concepts that they were dragged from:<ul>";
              var selected = jQuery("#forjstree").jstree(true).get_selected();
              //If they dragged something that is not selected only copy that item (next 2 lines)
              var indexInArray = jQuery.inArray(draggedObjects.id,selected);
              if (indexInArray == -1) selected = [draggedObjects.id];
              var objectsToCopyOver = [];
              var objectsToUnassociate = [];
              for(var i=0; i<selected.length; i++){
                var currSel = jQuery(jq(selected[i])).children("a");
                if (jQuery.inArray(currSel.attr("pid"),currentChildrenPids) > -1){
                  showTextForUnassociate += "<li>"+currSel.attr("fullname")+" ("+currSel.attr("pid")+")</li>";
                  objectsToUnassociate.push(selected[i]);
                }else{
                  showText += "<li>"+currSel.attr("fullname")+" ("+currSel.attr("pid")+")</li>";
                  objectsToCopyOver.push(selected[i]);
                }
              }
              showText += "</ul>";
              showTextForUnassociate += "</ul>";
              if (objectsToCopyOver.length > 0){
                if (!sidora.util.isConfirmShowing()){
                  if (objectsToUnassociate.length > 0) showText += showTextForUnassociate;
                  sidora.util.Confirm("Move Concept",showText,
                    function(){
                      sidora.util.userConfirmedMove = true;
                      for(var objIndex = 0; objIndex < objectsToCopyOver.length; objIndex++){
                        var currToCopyId = objectsToCopyOver[objIndex];
                        var currToCopyNode = jst.get_node(currToCopyId);
                        jQuery("#forjstree").jstree(true).move_node(currToCopyNode,mouseOverObject); 
                      }
                      for(var objIndex = 0; objIndex < objectsToUnassociate.length; objIndex++){
                        var currToUnassociateId = objectsToUnassociate[objIndex];
                        var currToUnassociateNode = jst.get_node(currToUnassociateId);
                        jQuery("#forjstree").jstree(true).delete_node(currToUnassociateNode);
                      }
                      sidora.util.userConfirmedMove = false;
                    },null,null,null,function(){
                      sidora_util.lock.Release(parentPid);
                    }
                  );
                }
              }else{
                if (!sidora.util.isConfirmShowing()){
                  sidora.util.Confirm("Move Concept","<h4>All items selected for move already exist on the target.</h4>"+showTextForUnassociate,
                    function(){
                      for(var objIndex = 0; objIndex < objectsToUnassociate.length; objIndex++){
                        var currToUnassociateId = objectsToUnassociate[objIndex];
                        var currToUnassociateNode = jst.get_node(currToUnassociateId);
                        jQuery("#forjstree").jstree(true).delete_node(currToUnassociateNode);
                      }
                    },null,null,null,function(){
                      sidora_util.lock.Release(parentPid);
                    }
                  );
                }
              }
            });
            return false; //Dont immediately perform the move
          } 
          if (dragStatus.pos == "b") return false; //no inbetweens so take out "before"
          if (dragStatus.pos == "a") return false; //no inbetweens so take out "after"
        }
      }
    },
    "plugins" : [
      "dnd"
      //,"state"
    ]
  });
  jQuery("#forjstree").mouseleave(function(){
    //sidora.util.lastMouseoverForDND = null;
  });
  if (typeof(window.sidora.treeAlreadyBound) == 'undefined'){
    console.log("BINDING TREE");
    jQuery("body").mousedown(function(e){
      jQuery(".fakejstree-copy").toggle(e.ctrlKey || e.metaKey);
    });
    jQuery("body").keydown(function(e){
      jQuery(".fakejstree-copy").toggle(e.ctrlKey || e.metaKey);
    });
    jQuery("body").keyup(function(e){
      jQuery(".fakejstree-copy").toggle(e.ctrlKey || e.metaKey);
    });
    jQuery(document).on('dnd_start.vakata',function(event,data){
      ///console.log("saving tree");
      //jQuery('#forjstree').jstree().save_state();
    });
    jQuery(document).on('dnd_stop.vakata', function(e,data){
      //only needed for resource moves, the others are taken care of in the normal calls
      window.sidora.treeAlreadyBound = true;
    });
  }
  jQuery('#forjstree').jstree('open_all');
}
sidora.ReformatPage = function(){
  jQuery(".breadcrumb").hide();
  jQuery("#page").css("padding","0");
  jQuery("#concept_tabs").css("position","fixed");
  jQuery("#concept-resource-list").css("padding","0");
  jQuery("#concept-resource-list").css("height","100%");
}
sidora.RelocateTreeOnPage = function(){
  jQuery("#branding").css("margin-left","300px");
  jQuery("body").append("<div id='fjt-holder'></div>");
  jQuery("#fjt-holder").append(jQuery("#forjstree"));
	jQuery("#fjt-holder").css("width","280px");
	jQuery("#fjt-holder").css("min-width","200px");
	jQuery("#fjt-holder").css("height","100%");
	jQuery("#fjt-holder").css("position","fixed");
	jQuery("#fjt-holder").css("top",parseInt(jQuery("body").css("padding-top"))+10+"px");
	jQuery("#fjt-holder")
      .wrap('<div/>')
          .parent()
            .attr('id','conceptResizable')
						.css({'display':'inline-block',
                  'overflow':'hidden',
									'position':'fixed',
                  'height':function(){return jQuery('#fjt-holder').height();},
                  'width':  function(){return parseInt(jQuery('#fjt-holder').width())+'px';},
                  'paddingBottom':'12px',
									'margin-right' : '2px',
									'top':parseInt(jQuery('body').css('padding-top'))+10+'px',
									'min-width':function(){return parseInt(jQuery('#fjt-holder').css('min-width'))+20+'px';}
                 })
                .resizable({handles:'e',resize:sidora.ResizeTree,stop:sidora.stopResizeTree})
                    .find('#fjt-holder')
                      .css({'overflow':'auto',
											      'position':'absolute',
														'width': function(){return parseInt(jQuery('#conceptResizable').outerWidth())-10+'px';},
														'top':'0px',
                            'height':'100%'});
	jQuery('#conceptResizable')
	  .wrap('<div/>')
		  .parent()
			.attr('id','conceptTreeParent')
			.append('<div id="iframeTreeOverlay" style="position:absolute;width:100%;height:100%;"></div>');
	jQuery('#branding').css('margin-left',parseInt(jQuery('#fjt-holder').parent().outerWidth())+'px');												
 jQuery("#conceptResizable").find(".ui-resizable-e").css("background-color","#aaa").css("width","10px").css("right","0");
 sidora.ResizeToBrowser();
 sidora.ResizeTree(null,{element:jQuery("#conceptResizable")});
 sidora.stopResizeTree();
}
sidora.ResizeTree = function (e, ui)
{
  //Protect the cursor input from being taken into the iframe by making the overlay displayable
  jQuery("#iframeTreeOverlay").show();
  if (jQuery('#resourceInformationPane').is(':visible')) {
	  // if a resource is currently selected, get the width ratio for the resourcepanel
    var resourceDivWidth = parseInt(jQuery('#resourceInformationPane').outerWidth()) / parseInt(jQuery('#resourceInformationPane').parent().width()) * 100;
	}	
  var treeWidth = parseInt(ui.element.outerWidth())+6+"px";
	var parent = jQuery('body');
  var remainingSpace = parent.width() - ui.element.outerWidth() - 6;
  var minRequiredSpace = parseInt(jQuery('#sidora_content_concept_info').css('min-width'));
	if (remainingSpace < minRequiredSpace) {
	  var maxWidth = parent.width() - parseInt(jQuery("#sidora_content_concept_info").css('min-width'));
		jQuery(ui.element).resizable('option', 'maxWidth', maxWidth);
	}	
		var divTree = ui.element.children('#fjt-holder');
	  divTree.css('width',parseInt(ui.element.outerWidth())-10+'px');
    divTwo = jQuery("#sidora_content_concept_info");
    divTwoWidthPixels = (remainingSpace - (divTwo.outerWidth() - divTwo.width()));
  if (parseInt(divTwo.css("min-width")) > divTwoWidthPixels){
    divTwoWidthPixels = parseInt(divTwo.css("min-width"));
  }
  divTwoWidth = (divTwoWidthPixels) / parent.width() * 100 + '%';
  divTwo.width(divTwoWidthPixels + 'px');
	jQuery('#concept_tabs').css('width',divTwoWidthPixels-8+'px');
  treeWidth = parseInt(ui.element.outerWidth())+6+"px";
  divTwo.css("left",treeWidth);
	var divTop = jQuery("#branding");
	divTop.css("margin-left",treeWidth);
	if (jQuery('#resourceInformationPane').is(':visible')) {
		if ((resourceDivWidth * parseInt(jQuery('#concept_tabs').width()) / 100) < (parseInt(jQuery('#resourceInformationPane').css('min-width')) + 25)) {
			resourceDivWidth = (parseInt(jQuery('#resourceInformationPane').css('min-width'))+25) / parseInt(jQuery('#concept_tabs').width()) * 100;
		}	
		resourceDivWidth = resourceDivWidth * parseInt(jQuery('#concept_tabs').width()) / 100;
		jQuery('#resourceInformationPane').outerWidth(resourceDivWidth+'px');
		jQuery('#res_table_wrapper').outerWidth(parseInt(jQuery('#concept_tabs').width()) - parseInt(jQuery('#resourceInformationPane').outerWidth()) - 15 + 'px');
	}		
  //Move items around to fit the menu in the best place
  if (jQuery("#res_table_wrapper").width() < 470){
    jQuery("#res_table_wrapper").css("margin-top","83px");
    jQuery("#sidora-resources-button-row").css("top","90px").css("left","20px");
  }else{
    jQuery("#res_table_wrapper").css("margin-top","50px");
    jQuery("#sidora-resources-button-row").css("top","").css("left","");
  }
};
/*
 * Resizes items on the resources pane once the user (or program) is done with dragging the splitter bar between the table and viewer
 */
sidora.stopResizeTree = function (e, ui)
{
  jQuery("#iframeTreeOverlay").hide(); //Allow the cursor into the iframe
};
sidora.ResizeToBrowser = function(){
  //jQuery("#sidora_content_concept_info").css("min-width",0);
  //jQuery("#concept_tabs").css("min-width",0);
  var newHeight = jQuery(window).height();
  newHeight -= (parseInt(jQuery("body").css("padding-top"))+10);
  if (jQuery("footer").is(":visible")){
    newHeight -= jQuery("footer").height();
  }
  jQuery("#fjt-holder").css("height",newHeight+"px");
  jQuery("#conceptResizable").css("height",jQuery('#fjt-holder').height());
	var tabsHeight = newHeight-50;
  jQuery("#concept_tabs").css("height",tabsHeight+"px");
  jQuery("#concept_tabs").css("width",parseInt(jQuery(window).width()-jQuery('#conceptResizable').outerWidth()-8)+"px");
  var tabContentHeight = tabsHeight - jQuery(".ui-tabs-nav").height();
  jQuery("#concept-resource-list").css("height",tabContentHeight);
  jQuery("#resourceResizable").css("height",'99%');
  jQuery("#resourceInformationPane").css("height",tabContentHeight+'px')
  jQuery("#resourceInformationPane").css("padding-right",'15px');
  jQuery("#concept-resource-list-internal").css("height",'100%');
  var conceptMetaHeight = tabContentHeight - (56);
  jQuery("#concept-meta div.metadata-table").height(conceptMetaHeight+"px");
  jQuery("#concept-meta div.metadata-table").css("overflow","auto");
  var resourceTabContentHeight = tabContentHeight - jQuery(".ui-tabs-nav").height() - 5; //5 for padding and border
  jQuery("#resourceIframeHolder").css("width",'99%');
  jQuery("#resourceIframeHolder").css("height",resourceTabContentHeight+'px');
  jQuery("#resource-relationships").css("height",resourceTabContentHeight+'px');
  jQuery("#resource-relationships").css("overflow",'auto');
  jQuery("#resource-relationships").css("border",'0');
  jQuery("#resource-relationships").css("padding",'0');
  jQuery("#resource-relationships").css("margin",'0');
  jQuery("#resource-meta").css("height",resourceTabContentHeight+'px');
  jQuery("#resource-meta").css("overflow",'auto');
  jQuery("#resource-meta").css("border",'0');
  jQuery("#resource-meta").css("padding",'0');
  jQuery("#resource-meta").css("margin",'0');
  if (jQuery("#rt").length == 0) jQuery("#res_table").before("<div id='rt'></div>"); 
  jQuery("#rt").append(jQuery("#res_table"));
  if (jQuery("input[name='titleFilter']").length > 0){
    var additionalPushDown = jQuery("input[name='titleFilter']").offset().top - jQuery("#concept-resource-list").offset().top + jQuery("input[name='titleFilter']").height();
    var tableHeight = resourceTabContentHeight - additionalPushDown;
  }
  jQuery("#rt").css("height",tableHeight+'px');
  jQuery("#rt").css("overflow",'auto');

  
}
/*
 * Checks to see if a user can communicate with the backend and redirects to user page if problem
 */
sidora.InitiateConfirmAccess = function(){
  jQuery.ajax({
    "dataType":"json",
    "url":Drupal.settings.basePath+"sidora/info/si:root/permission",
    "success":function(data){
      if (typeof(data.create) == 'undefined'){
        console.log("Bad permissions data, likely a user setup issue, redirecting to user profile");
        window.location = Drupal.settings.basePath+"user";
      }
    },
    "error":function(){
       console.log("Problem getting basic data, redirecting to the user profile");
       //OCIO message will also end up here since not json
       //This can also happen if the .htaccess file is incorrect
       window.location = Drupal.settings.basePath+"user";
    }
  });
}
/*
 * Checks to see if a user has already been set up and can get that information from the backend
 * Calls input functions based on that information, or redirect to user profile if communication
 * is cut to backend
 * @param callOnCorrectSetup - what function to call if the user is set up
 * @param callOnIncorrectSetup - what function to call if not set up
 *
 */
sidora.IsUserSetUp = function(callOnCorrectSetup, callOnIncorrectSetup){
  jQuery.ajax(
    {
      "dataType":"json",
      "url":Drupal.settings.basePath+"sidora/ajax_parts/check_user_setup",
      "success":function(data){
        if (typeof(data.root_is_valid) != 'undefined'){
          if (data.root_is_valid){
            if (typeof(callOnCorrectSetup) == "function"){
              callOnCorrectSetup(data, this);
            }
          }else{
            if (typeof(callOnIncorrectSetup) == "function"){
              callOnIncorrectSetup(data, this);
            }
          }
        }else{
          console.log("Bad user data, redirecting to user profile");
          window.location = Drupal.settings.basePath+"user";
        }
      },
      "error":function(){
         console.log("Problem getting basic user info, redirecting to the user profile");
         //OCIO message will also end up here since not json
         //This can also happen if the .htaccess file is incorrect
         window.location = Drupal.settings.basePath+"user";
      }
    }
  );
}
/*
 * Wait 5 seconds and check user account set up. Used to double-check after a user set up failure occurred.
 */
sidora.doubleCheckUser = function(){
  jQuery("#page").before("<div id='remove-me' style='width:100%'><div style='margin:auto;width:400px;'>Validating your user...</div></div>");
  setTimeout(function(){
    sidora.IsUserSetUp(
      function(){
        jQuery("#remove-me").remove(); 
        sidora.continueInit(); 
      }, function(){
        jQuery("#remove-me").remove();
        recreateUser(); 
      }
    );
  },5000);
}
sidora.InitiatePage = function(){
  jQuery("#page").hide();
  sidora.InitiateConfirmAccess();
  sidora.continueInit = function(){
    sidora.InitiateJSTree();
    sidora.RelocateTreeOnPage();
    sidora.ReformatPage();
    jQuery('#concept_tabs').tabs();
    sidora.concept.LoadContent();
    jQuery("#page-title").after(jQuery("#workbench-menu"));
    jQuery("#concept-meta").prepend(jQuery("#concept-meta-menu"));
    jQuery('#concept-menu ul li').children(':contains("Permissions")').addClass("ui-state-disabled").css("margin",0).css("padding-left","5px").css("border",0);
    sidora.ontology.CreateConceptMenu();
    sidora.ResizeOnWindowResize();
    jQuery(document).tooltip(
      { position: { my: "left-7 bottom", at: "right center" } }
    );
    jQuery("#branding").append("<div class='branding-user-info' style='float:right'> <a href='"+Drupal.settings.basePath+"user' class='button'>Profile</a> <a href='"+Drupal.settings.basePath+"user/logout' class='button'>Logout</a></div>");
    jQuery("#page").show();
  }
  recreateUser = function() {
    jQuery("#page").after('<div id="recreateUser" class="" style="max-width: 300px;margin: 0 auto;"><p>It looks like your user hasn\'t been set up yet. To automatically set up your user now, click \'Set Up Now\'. The process will take about 30 seconds and will reload the page when it\'s complete.</p> <div style="margin: 0 20px;"><input id="setupnow" class="form-submit" value="Set Up Now"><p></p><input id="logout" class="form-submit" value="Log Out"></div></div>');
    jQuery("#setupnow").click(function(){
      var overlay = jQuery('<div class="full-screen-overlay"><div id="countdown" style="color:white;margin:30px auto;width:200px;">20s estimated remaining</div></div>');
      overlay.appendTo(document.body);
      
      jQuery("#countdown").countdown(function(){
        jQuery("#countdown").css("width","500px");
        jQuery("#countdown").html("This is taking a little longer than normal but we're still working on it");
        setTimeout(function(){window.location.reload();},5000);
      }, 30, "s estimated remaining");

      jQuery.ajax(
        {
          "dataType":"json",
          "url":Drupal.settings.basePath+"sidora/ajax_parts/create_and_set_new_user_object",
          "success":function(data){
            console.log(data);
            window.location.reload();
          },
          "error":function(){
            //OCIO message will also end up here since not json
            console.log("Problem getting basic user info, redirecting to the user profile");
          }
        }
      );
    });
    jQuery("#logout").click(function(){
      window.location = Drupal.settings.basePath+"user/logout";
    });
  }
  sidora.IsUserSetUp(sidora.continueInit, sidora.doubleCheckUser);
};
/*
 * Return thumbnail if resource has a unique thumbnail that is showing, otherwise return false
 */
sidora.resources.checkForThumbnailShownInResourceList = function(currPid){
  var me = jQuery(jq(currPid));
  if (typeof(me.children("td").children("div").children("img").attr("src")) == 'string'){
    var imgChild = me.children("td").children("div").children("img");
    var currentSrc = imgChild.attr("src");
    if (currentSrc.indexOf(currPid) != -1) return currentSrc;
  }
  return false;
}
/*
 * Attempt to update any thumbnails
 */
sidora.resources.updateThumbnails = function(){
  jQuery("#res_table tr").map(function(){
    var currPid = this.id;
    var me = jQuery(this);
    if (typeof(me.children("td").children("div").children("img").attr("src")) == 'string'){
      var imgChild = me.children("td").children("div").children("img");
      var currentSrc = imgChild.attr("src");
      if (currentSrc.indexOf(currPid) == -1){  //If the current thumbnail is not unique to this item
        var pidThumbnail = Drupal.settings.basePath+"sidora/info/"+currPid+"/meta/TN/browser";
        jQuery.ajax(pidThumbnail,{
          complete:function(res){
            var currType = res.getResponseHeader("content-type");
            if (currType.indexOf("image") != -1){
              imgChild.attr("src",pidThumbnail).attr("height","").attr("width","").addClass("resource-list-tn");
            }
          }
        });
      }
    }
  })
}
/*
 * Get the pids of the highlighed resources
 */
sidora.resources.getHighlighted = function(){
  var toReturn = [];
  var selected = sidora.resources.dataTable.find("tr.selected");
  for(var i = 0; i < selected.length; i++){
    toReturn.push(jQuery(selected[i]).attr("id"));
  }
  return toReturn;
}
/*
 * Open in a new viewer window
 */
sidora.resources.openInNewWindow = function(){
  var pids = sidora.resources.getHighlighted();
  for(var i = 0; i < pids.length; i++){
   window.open(sidora.resources.createViewerUrl(pids[i]));
  }
}
/*
 * Direct download of the resource.  ASSUMES OBJ AS DSID
 */
sidora.resources.download = function(){
  var pids = sidora.resources.getHighlighted();
  for(var i = 0; i < pids.length; i++){
    window.open(Drupal.settings.basePath+"sidora/info/"+pids[i]+"/meta/OBJ/download");
  }
}
sidora.resources.performCopyOrMove = function(copyOrMove, toLocationId, resourcesOfInterest){
  
  var pids = [];
  if (Array.isArray(resourcesOfInterest)){
    pids = resourcesOfInterest;
  } else {
    pids = sidora.util.dragResources;
  }
  var fromParent = window.sidora.concept.GetPid();
  var droppedOn = jQuery("#"+toLocationId).find("a").attr("pid");
  var droppingThese = pids.join(",");
  //do nothing if move/copy to existing place
  if (droppedOn == fromParent) {
    console.log("dropped on existing parent, ignoring request");
    return;
  }
  //by default this is a move
  var action = 'move/'+fromParent;
  if (copyOrMove == 'copy'){ action = 'copy'; }
  console.log("FCR "+action+" pids:"+pids.join(",")+" dropped on:"+jQuery("#"+toLocationId).find("a").attr("pid"));
  var jst = jQuery("#forjstree").jstree(true);
  var newParentExistingChildResourcesCount = parseInt(jst.get_node(toLocationId).a_attr.resourcechildren);
  var onSuccessfulCopy = function(ajaxRequest,ajaxReturn){
    var newParentExistingChildResourceNumber = parseInt(jst.get_node(toLocationId).a_attr.resourcechildren);
    var newParentNewChildResourceNumber = newParentExistingChildResourceNumber+1;
    sidora.util.refreshConceptChildrenNumberDirectByTreeId(toLocationId, newParentNewChildResourceNumber);
  }   
  var onSuccessfulMove = function(ajaxRequest,ajaxReturn){
    var newParentExistingChildResourceNumber = parseInt(jst.get_node(toLocationId).a_attr.resourcechildren);
    var newParentNewChildResourceNumber = newParentExistingChildResourceNumber+1;
    sidora.util.refreshConceptChildrenNumberDirectByTreeId(toLocationId, newParentNewChildResourceNumber);
    var fromSource = jq(fromParent).substring(1);
    var oldParentNode = jst.get_node(jQuery("[pid='" + fromSource + "']").closest("li").attr("id"));
    var oldParentExistingChildResourceNumber = parseInt(oldParentNode.a_attr.resourcechildren);
    var oldParentNewChildResourceNumber = oldParentExistingChildResourceNumber - 1;
    sidora.util.refreshConceptChildrenNumberDirect(fromParent, oldParentNewChildResourceNumber);
  }  
  for(var i=0;i<pids.length;i++){
    droppedPid = pids[i];
    var userFriendlyName = 'Unknown action';
    var pidList = null;
    var onSuccess = null;
    if (action != 'copy'){
      pidListForRequest = [fromParent,droppedOn,droppedPid];
      jQuery(jq(pids[i])).addClass("is-being-moved");
      userFriendlyName = "Moving ";
      onSuccess = onSuccessfulMove;
      queueAction = 'moveResource';
    }else{
      pidListForRequest = [droppedOn,droppedPid];
      userFriendlyName = "Copying ";
      onSuccess = onSuccessfulCopy;
      queueAction = 'copyResource';
    }
    userFriendlyName += "<em>"+sidora.util.FriendlyNameDirect(droppedPid)+"</em>";
    userFriendlyName += " from <em>"+sidora.util.FriendlyNameDirect(fromParent)+"</em>";
    userFriendlyName += " to <em>"+sidora.util.FriendlyNameDirect(droppedOn)+"</em>";
    var requestUrl = Drupal.settings.basePath+'sidora/ajax_parts/'+action+'/'+droppedOn+'/'+droppedPid;
    sidora.queue.Request(userFriendlyName, requestUrl, onSuccess, null, pidListForRequest,queueAction,i+' of '+pids.length);
    console.log(userFriendlyName);
  }
  sidora.queue.Next();
}
/*
 * Gets the current concept json object and creates a menu from it
 */
sidora.ontology.CreateConceptMenu = function(){
  var ontologyUrl = Drupal.settings.basePath+"sidora/ajax_parts/ontology";
  jQuery.ajax(
  {
    dataType: "json",
    url: ontologyUrl,
    error: function(){
      console.log("error on create menu"); //OCIO message will also end up here since not json
    },
    success: function (json_obj){
      window.sidora.ontology.tree = json_obj;
      jQuery("#concept-file-menu").append("<li id='concept-create'><a href='#' onclick='return false;'><input type='image' src='"+Drupal.settings.basePath+"sites/all/modules/islandora_xml_forms-7.x-1.7/elements/images/add.png' title='Create a new concept as a child of the highlighted concept.'>&nbsp;Add&nbsp;a&nbsp;new&nbsp;concept</a><ul>"+window.sidora.ontology._createSubmenu(window.sidora.ontology.tree)+"</ul></li>");
      resetMenu("concept-menu");
      jQuery("#concept-create").find("a").not(".ui-state-disabled").bind("click.createConcept",function(){
        var model = jQuery(this).attr("model");
        var form = jQuery(this).attr("formname");
        var ontologyId = jQuery(this).attr("ontology-id");
        if (typeof(model) != 'undefined'){
          var url = Drupal.settings.basePath+"sidora/create_concept/"+window.sidora.concept.GetPid()+"/"+model+"/";
          if (typeof(form) != 'undefined') url += form;
          url += "/"+ontologyId;
          Shadowbox.close();
          setTimeout(function(){
          Shadowbox.open({
            content:    url,
            player:     "iframe",
            title:      "Create Concept",
            options: {
              onFinish:  function(){}
            }
          });},100);
        }
        console.log(this);
      }).attr("onclick","return false;");
    }
  });
};
/*
 The recursive part of the submenu creation
*/
sidora.ontology._createSubmenu = function(ontologyChildren){
  var toReturn = "";
  if (typeof(ontologyChildren) == 'undefined'){ return toReturn; }
  for (var key in ontologyChildren) {
    var obj = ontologyChildren[key];
    if (typeof(obj.description) != 'undefined'){
      childrenHtml = this._createSubmenu(obj.children);
      if (childrenHtml.length > 0) childrenHtml = "\n<ul>"+childrenHtml+"</ul>\n";
      var model = "";
      var formName = "";
      var classDisabled = "";//" disabled";
      var ontologyId = "";
      var classIcon = " ";
      if (typeof(obj.model) != 'undefined') model = ' model="'+obj.model+'"';
      if (typeof(obj.form) != 'undefined') formName = ' formname="'+obj.form+'"';
      if (typeof(obj['ontology-id']) != 'undefined') ontologyId = ' ontology-id="'+obj['ontology-id']+'"';
      if (typeof(obj.disabled) != 'undefined' && obj.disabled) classDisabled = " ui-state-disabled";
      if (childrenHtml.length > 0) {
       classIcon = ' <input type="image" style="position:absolute; right:0px; padding-right:2px;" src="'+Drupal.settings.pathToTheme+'/images/list-item.png" />';
      }
      else {
       classIcon = '&nbsp;&nbsp;';
      }  
      toReturn += ("<li title='"+obj.description+"' class=''><a onclick='return false;' href='#'"+model+formName+ontologyId+" class="+classDisabled+">"+key.replace(/ /g, '&nbsp;')+classIcon+"</a>"+childrenHtml+"</li>\n");
    }
  }
  return toReturn;
}
/*
 *  Got tired of CSS fiddling, resizing the main div programmatically based on assumed navigation size
 */
sidora.ResizeOnWindowResize = function(){
  var bodywidth = jQuery(window).width();
  // Cannot use a fixed width for the tree on the left since its resizable now.
	//var menuwidth = 360;
	var menuwidth = jQuery("#fjt-holder").width() + 10;
  var newwidth = bodywidth-menuwidth;
  jQuery("#sidora_content_concept_info").width(newwidth);
  var newMaxWidth = bodywidth - parseInt(jQuery('#sidora_content_concept_info').css('min-width'));
	jQuery('#conceptResizable').resizable('option', 'maxWidth', newMaxWidth);
  //Resize the resource information pane for the resource page 
  sidora.resources.individualPanel.ResizeAndStop();
}
/*
 * Attempts to pull the number of child resources from the tree
 */
sidora.concept.GetResourceChildrenLength = function(){
  var itemSelectorForCurrentItemInTree = 'a[href=\"'+window.location.pathname + window.location.search + window.location.hash +'\"]';
  var directPull = jQuery(itemSelectorForCurrentItemInTree).attr("resourcechildren");
  if (typeof(directPull) != 'undefined'){
    return parseInt(directPull);
  }
  return null; 
}
/*
/*
 * Attempts to pull the number of child concepts from the tree
 */
sidora.concept.GetConceptChildrenLength = function(){
  var itemSelectorForCurrentItemInTree = 'a[href=\"'+window.location.pathname + window.location.search + window.location.hash +'\"]';
  var directPull = jQuery(itemSelectorForCurrentItemInTree).attr("conceptchildren");
  if (typeof(directPull) != 'undefined'){
    return parseInt(directPull);
  }
  return null; 
}
/*
 * Attempts to pull a concept name from the tree or just returns whatever is passed in
 */
sidora.concept.GetName = function(suggestedName){
  //If didn't send in concept name, try to get it from tree
  if (typeof(suggestedName) == 'undefined' || suggestedName == null){
    var selectorForCurrentItemInTree = 'a[href=\"'+window.location.pathname + window.location.search + window.location.hash +'\"]';
    var directPull = jQuery(selectorForCurrentItemInTree).attr("fullname");
    if (typeof(directPull) != 'undefined') return directPull;
  }
  return suggestedName;
}
/*
 * Rename the in-page name to reflect the new conceptName passed in
 */
sidora.UpdateTitleBasedOnNameInTree = function(conceptName){
  var newTitle = sidora.concept.GetName();
  if (newTitle == "") return; //If there's no concept selected leave it as "Sidora Workbench" (the default)
  jQuery(".page-title").text(newTitle);
}
/*
 * Generally used as a callback from iframes to close the shadowbox they are contained in
 */
sidora.CloseIFrame = function(newlyCreatedConceptId, typeOfClosure){
  //if it's the shadowbox, close it
  Shadowbox.close();
  if (typeOfClosure == 'simple close'){
    return;
  }
  console.log("new pid:"+newlyCreatedConceptId);
  if (typeOfClosure == 'concept create'){
  }
  if (typeOfClosure == 'edit metadata'){
    //Nothing?  do users need a confirmation? the reloaded page should be good enough
  }
  //Reload the current concept's tree
  var jst = jQuery("#forjstree").jstree();
  var itemsSelected = jst.get_selected();
  for (isi = 0; isi < itemsSelected.length; isi++) {
    var node = jst.get_node(itemsSelected[isi]);
    if (node.a_attr.pid == sidora.concept.GetPid()) {
      var parentPid = jst.get_node(node.parent).a_attr.pid;
      sidora.util.RefreshTree(null, parentPid); 
    }
  }
}
/*
 * Keep checking for 100 minutes.  
 *
 * Admins have no log out period.  The "left a window open over the weekend" problem that could
 * affect those users, making it look like there is website activity and using up lots of the user's
 * memory if they have a development console open that stores the XHR requests.
 *
 * Todo: Only check server if there has been mouse movement in the past minute
 */
sidora.util.constantCheck = function(){
  var d = new Date();
  if (typeof(sidora.util.init_time) == 'undefined') {
    sidora.util.init_time = {};
    sidora.util.init_time.local = Math.floor(d.getTime() / 60000);
    jQuery.ajax({
      url: Drupal.settings.basePath+'sidora/ajax_parts/server_minute'
    }).done(function(server_minute){
      sidora.util.init_time.server = parseInt(server_minute);
    }).fail(function(failure_obj){
      sidora.util.init_time.server = 0;
      sidora.recentAjaxFailure(failure_obj);
    });
  }

  var current_local_minute = Math.floor(d.getTime() / 60000);
  if (current_local_minute < sidora.util.init_time.local + 100) {
    setTimeout(sidora.util.constantCheck, 30000);
  }

  sidora.resources.updateThumbnails();
  sidora.util.checkRecentChanges();
}
/*
 * Gets the pids for recent concept changes. Currently used to update resource numbers on concepts
 * if multiple users are changing the number of resources
 */
sidora.util.checkRecentChanges = function(){
	  if (typeof(sidora.util.init_time.server) != 'undefined') {
      if (typeof(sidora.util.lastUpdateTime) == 'undefined') sidora.util.lastUpdateTime = 0;
      jQuery.ajax({
        url: Drupal.settings.basePath+'sidora/ajax_parts/recent_changes/'+sidora.util.lastUpdateTime,
      }).done(function(pids_csv){
        var d = new Date();
        var offsetBetweenLocalAndServer = sidora.util.init_time.server - sidora.util.init_time.local;
        var current_local_minute = Math.floor(d.getTime() / 60000);
        sidora.util.lastUpdateTime = current_local_minute + offsetBetweenLocalAndServer;
        var pids = pids_csv.split(", ");
        for (var pindex = 0; pindex < pids.length; pindex++) {
          sidora.util.refreshConceptChildrenNumber(pids[pindex]); 
        }
      }).fail(function(failure_obj){
        sidora.recentAjaxFailure(failure_obj);
    });
  }
}
/*
 * Returns only nodes that are currently viewable in the tree based on pid
 */
sidora.util.getViewableJstreeNodesByPid = function(pid) {
  var jst = jQuery("#forjstree").jstree(true);
  var toReturn = [];
  jQuery("[pid='" + pid + "']").closest("li").each(function(){
    toReturn.push(jst.get_node(this.id));
  });
  return toReturn; 
}
/*
 * Returns children from the tree's data structure
 */
sidora.util.childrenPidsListedInUIByNode = function(node) {
  var jst = jQuery("#forjstree").jstree(true);
  var currentChildren = node.children;
  var currentChildrenPids = [];
  for(var i=0; i<currentChildren.length; i++){
    currentChildrenPids.push(jst.get_node(currentChildren[i]).a_attr.pid);
  }
  return currentChildrenPids;
}
sidora.util.createFunctionRefreshTree = function(pids) {
  if (typeof(pids) == "string") pids = [pids];
  return function() {
    pids.forEach(function(pid,index,arr){
      sidora.util.RefreshTree(null,pid);
    });
  }
}
sidora.util.createFunctionTreeAddition = function(openingPid, onLoadComplete, overwriteType) {
  return function(htmlTree) {
    sidora.util.loadTreeSectionCurrent[openingPid] = false;
    sidora.util.treeAddition(htmlTree, onLoadComplete, overwriteType);
  }
}
sidora.util.reorderTreeChildrenAlphabetical = function(node) {
  var jst = jQuery("#forjstree").jstree();
  var childIds = node.children;
  var children = [];
  childIds.forEach(function(value,index,arr){
    children.push(jst.get_node(value));
  });
  children.sort(function(a,b){
    if (a.text < b.text) return -1;
    return 1;
  });

  jst.pureUIChange = true;
  children.forEach(function(value,index,arr){
    jst.move_node(value,node,"last");
  });
  jst.pureUIChange = false;
}
sidora.util.treeAdditionSingleItem = function(mainItem, htmlTree, onLoadComplete, overwriteType, jst, documentFragment, currChild){
  var ccp = currChild.a_attr.pid;
  var dfAnchor = jQuery(documentFragment).children().find("[pid='"+ccp+"']");
  //If the document fragment does not include the child then that concept was removed
  if (dfAnchor.length == 0) {
    //TBD remove this
  } else {
    //Find the current child representation in the document fragment
    var currRep = dfAnchor.parent();
    //Replace the name if the name of the item changed
    if (currChild.text != dfAnchor.text()) {
      jst.rename_node(currChild, dfAnchor.text());
    var a_attr_obj = {};
		jQuery(jQuery(currRep).children("a").first()[0].attributes).each(function() {
       a_attr_obj[this.nodeName] = this.nodeValue;
    });   
     a_attr_obj["href"] = currChild.a_attr.href;
		 jQuery.each(a_attr_obj,function(nodeName,nodeValue){
		  jQuery("[pid='" + ccp + "']").attr(nodeName,nodeValue);
			jst.get_node(currChild).a_attr[nodeName] = nodeValue;
    });
    }
		//Do not add children to items that are already filled in
    if (currChild.children.length == 0 || overwriteType == "changes") {
      //Go through the children of the representative DOM object from document fragment
      var repChildren = currRep.children("ul").children("li");
      //Set up the functions so that the onLoadComplete will be called after all of the nodes are added
      var myCounter = { numReturned: 0, numNeeded: repChildren.length};
      var olcCheck = function(mc,olc){
         return function(){
           mc.numReturned++;
           if (mc.numReturned == mc.numNeeded) { olc(); }
         };
      };
      var individualReturnFunction = olcCheck(myCounter, onLoadComplete);
      //If want to do changes, remove any existing children that were not in the document fragment
      //console.log("gci start:"+ new Date(new Date().getTime()) + " len:"+currChild.children.length);
      for (var grandchildIndex = 0; grandchildIndex < currChild.children.length; grandchildIndex++){
        var currTreeGrandchild = jst.get_node(currChild.children[grandchildIndex]);
        var isFound = false;
        for (var repChildIndex = 0; repChildIndex < repChildren.length; repChildIndex++){
          var currRepChild = repChildren[repChildIndex];
          if (jQuery(currRepChild).children("a").attr("pid") == currTreeGrandchild.a_attr.pid) {
            isFound = true;
          }
        }
        if (!isFound) {
          jst.pureUIChange = true;
          jst.delete_node(currTreeGrandchild.id);
          jst.pureUIChange = false;
        }
      }
      //console.log("rci start:"+ new Date(new Date().getTime()) + " len:"+repChildren.length);
      var ctgMap = [];
      for (var grandchildIndex = 0; grandchildIndex < currChild.children.length; grandchildIndex++){
        var currTreeGrandchild = jst.get_node(currChild.children[grandchildIndex]);
        ctgMap[currTreeGrandchild.a_attr.pid] = currTreeGrandchild.id;
      }
      for (var repChildIndex = 0; repChildIndex < repChildren.length; repChildIndex++) {
        //Create node in the current child to copy the elements found in the document fragment
        var currRepChild = repChildren[repChildIndex];

        //Dont add a child that's already there
        var crcPid = jQuery(currRepChild).children("a").attr("pid");
        var isFound = ctgMap[crcPid];
       
        var a_attr_obj = {};
        jQuery(jQuery(currRepChild).children("a").first()[0].attributes).each(function() {
          a_attr_obj[this.nodeName] = this.nodeValue;
        });
        //The information coming back from the ajax call will not have the path through the tree
        //and since the concept listed can be in multiple places, the path to the concepts
        //must pull information from the existing tree for the current path we've used
        var prependHrefPath = "?path=" + currChild.a_attr.href.split("?path=")[1] + ',';
        var currRepHrefPathParts = jQuery(currRepChild).children("a").attr("href").split("?path=");
        newHrefPath = currRepHrefPathParts[0] + prependHrefPath + currRepHrefPathParts[1];
        a_attr_obj['href'] = newHrefPath;
        if (!isFound) {
          var newNodeId = jQuery("#forjstree").jstree(
                          "create_node", 
                          currChild,
                          { "text" : jQuery(currRepChild).children("a").first()[0].text, "a_attr":a_attr_obj }, 
                          0,
                          individualReturnFunction,
                          true
                        );
        }else{
          jst.rename_node(isFound, jQuery(currRepChild).children("a").first()[0].text);
          jQuery(a_attr_obj).each(function(){
            jst.get_node(isFound).a_attr[this.nodeName] = this.nodeValue;
          });
        }
      }//Ends repChildIndex
      //console.log("complete :"+ new Date(new Date().getTime()));
    }//Ends (currChild.children.length == 0 || overwriteType == "changes")
    sidora.util.reorderTreeChildrenAlphabetical(currChild);
  }//Ends dfAnchor.length not zero
}
sidora.util.treeAddition = function(htmlTree, onLoadComplete, overwriteType){
  if (typeof(onLoadComplete) != 'function') {
    onLoadComplete = function(){}
  }
  if (typeof(overwriteType) != 'string') {
    overwriteType = "changes";
  }
  var jst = jQuery("#forjstree").jstree();
  var documentFragment = jQuery(document.createDocumentFragment());
  documentFragment.append(htmlTree);
  //Find the items in the existing tree that match with what is loaded.
  //Keep in mind there may be copies of the item in different parts of the tree
  var clickedOnPid = jQuery(documentFragment).children().find("a").first().attr("pid");
  //Note: Do not use jQuery to get information out of an existing jstree
  mainItems = sidora.util.GetTreeNodesByPid(clickedOnPid);
  //mainItems now holds all the nodes which have a pid matching the root pid from the returned html
  jQuery.each(mainItems, function( mii, mainItem) {
    var miChildrenIds = mainItem.children;
    //Go through the children
    for (var micIndex = 0; micIndex < miChildrenIds.length; micIndex++) {
      var currChild = jst.get_node(miChildrenIds[micIndex]);
      setTimeout(sidora.util.treeAdditionSingleItem.bind(null, mainItem,htmlTree, onLoadComplete, overwriteType, jst, documentFragment, currChild ),
        10 * (micIndex)
      );
    }//Ends micIndex
  });//Ends mainItems each
}//Ends treeAddition function
/*
 * Ajax load of a section of a tree. Given the openingPid, load thru its grandchildren
 * @param openingPid - pid to check it's grandchildren
 * @param onLoadComplete - function to call when the grandchildren are loaded into the tree
 * @param overwriteType - undefined / null for no overwrites if already attempted this pid, only add children if doesn't already have any
 *                      - "changes" - remove items that are gone from the return and add items from return that don't exist
 * @return true if call will be made, false if call was already made and will not be made again
 */
sidora.util.loadTreeSection = function(openingPid, onLoadComplete, overwriteType) {

  if (typeof(sidora.util.loadTreeSectionCurrent) == 'undefined') {
    sidora.util.loadTreeSectionCurrent = [];
  }
  if (
       sidora.util.loadTreeSectionCurrent[openingPid] == true && 
       (typeof(overwriteType) == "undefined" || overwriteType == null)
     ) {
    //Already checking on this set, don't do it again
    return false;
  }
  //Inform the utility that we are checking on this already so don't check again
  sidora.util.loadTreeSectionCurrent[openingPid] = true;

  var jst = jQuery("#forjstree").jstree(true);
  jQuery.ajax({
    "dataType":"html",
    "method":"GET",
    "url": Drupal.settings.basePath+"sidora/ajax_parts/tree/"+openingPid+"/2",
    "success": sidora.util.createFunctionTreeAddition(openingPid, onLoadComplete, overwriteType)
  });
  return true;
}
/*
 * Make ajax call to see if the pids are still valid objects, removes any invalid pids from the UI
 * @return true if call will be made, false if call was already made and will not be made again
 */
sidora.util.checkUIForInvalidPids = function(openingPid, childPidsCsv) {
  if (typeof(sidora.util.checkUIForInvalidPidsCurrent) == 'undefined') {
    sidora.util.checkUIForInvalidPidsCurrent = [];
  }
  if (sidora.util.checkUIForInvalidPidsCurrent[openingPid] == childPidsCsv) {
    //Already checking on this set, don't do it again
    return false;
  }
  //Inform the utility that we are checking on this already so don't check again
  sidora.util.checkUIForInvalidPidsCurrent[openingPid] = childPidsCsv;
  var jst = jQuery("#forjstree").jstree(true);
  var pidRemoval = function(pidsValidationInfo){
    if (pidsValidationInfo.invalid.length > 0) {
      for (var pii = 0; pii < pidsValidationInfo.invalid.length; pii++) {
        var currInvalidPid = pidsValidationInfo.invalid[pii];
        console.log("Removal from UI of invalid or malformed object with pid: "+currInvalidPid);
        //Get all the node ids for this pid
        var nodeIds = [];
        jQuery("[pid='" + currInvalidPid + "']").closest("li").each(function(){ nodeIds.push(this.id); });
        for (var nii = 0; nii < nodeIds.length; nii++) {
          var currToUnassociateId = nodeIds[nii];
          var currToUnassociateNode = jst.get_node(currToUnassociateId);
          jst.pureUIChange = true;
          jst.delete_node(currToUnassociateNode);
          delete jst.pureUIChange;
        }
      }
    }
  }
  if (childPidsCsv.length > 200) {
    jQuery.ajax({
      "dataType":"json",
      "method":"POST",
      "url": Drupal.settings.basePath+"sidora/ajax_parts/check_valid_pids/"+openingPid,
      "data": {"csv_pids":childPidsCsv},
      "success": pidRemoval
    });
  } 
  else {
    jQuery.ajax({
      "dataType":"json",
      "url": Drupal.settings.basePath+"sidora/ajax_parts/check_valid_pids/"+openingPid+"/"+childPidsCsv,
      "success": pidRemoval
    });
  }
  return true;
}
/*
 * Checks the backend to see what the number of resource children is currently so that the UI can be updated
 */
sidora.util.refreshConceptChildrenNumber = function(pid){
	if (pid == "") return;
  jQuery.ajax({
    url: Drupal.settings.basePath+'sidora/ajax_parts/get_num_resource_children/'+pid,
  }).done(function(num_children){
    sidora.util.refreshConceptChildrenNumberDirect(pid, num_children);
  }).fail(function(failure_obj){
    sidora.recentAjaxFailure(failure_obj);
  });
}
/*
 * Directly changes the number in parenthesis on the UI of the tree by the input Pid
 */
sidora.util.refreshConceptChildrenNumberDirect = function(pid, number_of_children){
  var treeIdsToUpdate = jQuery("a").filter(
    function(){ return jQuery(this).attr("pid") == pid; }
  ).closest("li").map(
    function(){ return this.id; }
  ).get();
  var jst = jQuery("#forjstree").jstree(true);
  for(var tii = 0; tii < treeIdsToUpdate.length; tii++){
    var toUpdateId = treeIdsToUpdate[tii];
    var existingChildResourceNumber = parseInt(jst.get_node(toUpdateId).a_attr.resourcechildren);
    var parentName = jQuery("#"+toUpdateId+" a").attr("fullname");
    var newFullName =  parentName + " (" + number_of_children + ")";
    if (number_of_children == 0) newFullName = parentName;
    jst.rename_node("#"+toUpdateId, newFullName);
    jst.get_node(toUpdateId).a_attr.resourcechildren = ""+number_of_children;
  }
	jQuery("[pid='" + pid +"']").attr('resourcechildren',""+number_of_children)
}
/*
 * Directly changes the number in parenthesis on the UI of the tree by the input DOM id
 * This REQUIRES that the item is currently visible
 */
sidora.util.refreshConceptChildrenNumberDirectByTreeId = function(treeId, number_of_children){
  var pid = jQuery("#"+treeId+" a").attr("pid");
  sidora.util.refreshConceptChildrenNumberDirect(pid, number_of_children);
}

sidora.util.refreshTreeFailuresInARow = 0;
/*
 * Returns the existing tree nodes by a pid
 */
sidora.util.GetTreeNodesByPid = function(pid) {
  var jst = jQuery("#forjstree").jstree();
  var existingTreeNodes = jst.get_json('#', {flat:true});
  var mainItems = [];
  for (var etni = 0; etni < existingTreeNodes.length; etni++) {
    var currEtn = jst.get_node(existingTreeNodes[etni].id);
    if (currEtn.a_attr.pid == pid) {
      mainItems.push(currEtn);
    }
  }
  return mainItems;
}
/*
 * Goes to get the tree from the server and replaces exsiting tree
 * @param secondsOfWait - number of seconds to wait for other refreshTree requests to come in
 *      - so that only one refresh tree request goes out no matter how many times its called during that time period
 * @param pid - pid of item that we expect the children to change, or for the name to change
 */
sidora.util.RefreshTreeHelper = function(secondsOfWait, pid, onlyRefreshIfNew) {
  
  if (typeof(secondsOfWait) == 'undefined' || secondsOfWait == null) secondsOfWait = .01;
  //Since we are concerned about the children of this and our treeAddition function expects to get the grandparent
  //of newly changed items, find an appropriate parent 
  var nodeIds = sidora.util.GetTreeNodesByPid(pid);
  var jst = jQuery("#forjstree").jstree();
  nodeIds.forEach(function(node, index, arr) {
    var parentNode = jst.get_node(node.parent);
    if (parentNode.id == '#') {
      //window.location.reload(); //TBD give proper refresh when adding a concept to their root
    }
    var parentPid = parentNode.a_attr.pid;
    setTimeout(function(myPid){
      jQuery.ajax({
        url: Drupal.settings.basePath+'sidora/ajax_parts/tree/'+myPid+"/2",
      }).done(function(tree_html){
        var suggestedAction = sidora.util.RefreshTreeSuggestAction(tree_html, true);
        if (suggestedAction.suggestRedirect) { window.location = Drupal.settings.basePath+'user';  }
        if (suggestedAction.suggestRetry){
          sidora.util.refreshTreeFailuresInARow++;
          if (sidora.util.refreshTreeFailuresInARow > 10) {
            console.log("Too many tree failures without a success. Stopping retries.");
            return;
          } else {
            console.log("Initiated retry:"+sidora.util.refreshTreeFailuresInARow);
            sidora.util.RefreshTreeHelper(3, myPid, onlyRefreshIfNew);
            return;
          }
        }
        if (suggestedAction.suggestIgnore) { return; }
        if (!suggestedAction.valid) { console.log("Unknown tree issue. Error code:surt1"); return; }
        /*
        */
        sidora.util.treeAddition(tree_html);//, null, "changes");
        sidora.util.refreshTreeFailuresInARow = 0;
      }).fail(function(failure_obj){
        sidora.recentAjaxFailure(failure_obj);
      }).always(function(){
      });
    },secondsOfWait*1000,parentPid);
  }); //ends nodeIds.forEach
}
/*
 * These two are the functions that get called in practice
 */
sidora.util.RefreshTreeIfNew = function(secondsOfWait, pid){ sidora.util.RefreshTreeHelper(secondsOfWait, pid, true); }
sidora.util.RefreshTree      = function(secondsOfWait, pid){ sidora.util.RefreshTreeHelper(secondsOfWait, pid, false); }

/*
 * Does NOT return a true / false
 * Returns an explanation of the problem and suggested method to deal with it
 * Returns an object of the form:
{
  "valid": true / false,
  "description":"Reason it failed or empty string",
  "suggestRedirect": true / false,
  "suggestRetry": true / false,
  "suggestIgnore": true / false
}
 */
sidora.util.RefreshTreeSuggestAction = function(tree_html, outputProblemToConsole){
  var toReturn = {
    "valid":false,
    "description":"Never attempted validity check",
    "suggestRedirect":false,
    "suggestRetry":false,
    "suggestIgnore":true
  };
  var failures = 0;
  if (tree_html == '') {
    toReturn.description = "No tree indicates a user problem";
    toReturn.suggestRetry = false;
    toReturn.suggestRedirect = true;
    toReturn.suggestIgnore = false;
    failures++;
  }
  if (typeof(tree_html) != "string"){
    tree_html = ""
    toReturn.description = "Tree html was not a string";
    toReturn.suggestRetry = false;
    toReturn.suggestRedirect = true;
    toReturn.suggestIgnore = false;
    failures++;
  }
  //Various ways to check if valid, but we'll use the following:
  //Should NOT say "contact the OCIO Help Desk"
  //Should have at least one <ul> and one <li>
  var tree_html_lowercase = tree_html.toLowerCase();
  if (tree_html_lowercase.indexOf("contact the ocio help desk") > -1){
    toReturn.description = "OCIO intercepted tree html issue.";
    toReturn.suggestRetry = true;
    toReturn.suggestRedirect = false;
    toReturn.suggestIgnore = false;
    failures++;
  }
  if (tree_html_lowercase.indexOf("<ul>") == -1 || tree_html_lowercase.indexOf("<li>") == -1){
    toReturn.description = "Did not receive tree in proper tree format.";
    toReturn.suggestRetry = false;
    toReturn.suggestRedirect = false;
    toReturn.suggestIgnore = true;
    failures++;
  }
  if (failures == 0) {
    toReturn.description = "";
    toReturn.suggestRetry = false;
    toReturn.suggestRedirect = false;
    toReturn.suggestIgnore = false;
    toReturn.valid = true;
  }
  if (toReturn.description != "" && outputProblemToConsole) {
    console.log(toReturn.description);
  }
  return toReturn;
}
/*
 * Replaces exsiting tree with passed in html, and initializes new tree
 */
sidora.RefreshTreeHtml = function(tree_html){
  //The tree should be a SINGLE element, pull the first one
  myDiv = jQuery("<div>"+tree_html+"</div>").children().first();
  jQuery('#forjstree').after("<div id='toReplaceForjstree' style='display:none;'></div>").attr("id","oldjstree");
  jQuery('#toReplaceForjstree').append(myDiv).attr("id","forjstree");
  sidora.InitiateJSTree();
  jQuery("#oldjstree").remove();
}


sidora.util.refreshNodeByID = function(pidsProcessed){
	if (pidsProcessed.length != 2) return;
	jQuery.ajax({
    url: Drupal.settings.basePath+'sidora/ajax_parts/check_concept_tree/'+pidsProcessed[0]+'/'+pidsProcessed[1],
  }).done(function(refresh_concept){
	  if (refresh_concept == "refreshNode"){
			var jst = jQuery("#forjstree").jstree(true);
			jst.pureUIChange = true;
			jQuery('[pid="'+pidsProcessed[0]+'"]').closest("li").filter(
			function(){ return jQuery(this).parent().parent().children("a").attr("pid") == pidsProcessed[1]; }
			).map(
			function(){ jst.delete_node(this.id); }
			);
		delete jst.pureUIChange;
		}		
  }).fail(function(failure_obj){
    sidora.recentAjaxFailure(failure_obj);
  });
}
sidora.util.refreshConceptTreeUIDirect = function(pid, tree_html){
  var treeIdsToUpdate = jQuery("a").filter(
    function(){ return jQuery(this).attr("pid") == pid; }
  ).closest("li").map(
    function(){ return this.id; }
  ).get();
  var jst = jQuery("#forjstree").jstree(true);
  for(var tii = 0; tii < treeIdsToUpdate.length; tii++){
    var toUpdateId = treeIdsToUpdate[tii];
    var existingChildResourceNumber = parseInt(jst.get_node(toUpdateId).a_attr.resourcechildren);
    var parentName = jQuery("#"+toUpdateId+" a").attr("fullname");
    var newFullName =  parentName + " (" + number_of_children + ")";
    if (number_of_children == 0) newFullName = parentName;
    jst.rename_node("#"+toUpdateId, newFullName);
    jst.get_node(toUpdateId).a_attr.resourcechildren = ""+number_of_children;
  }
}
/*
 * Opens the Manage panel
 */
sidora.concept.Manage = function(){
  var conceptPid = this.GetPid();
  var conceptName = this.GetName();
  sidora.manage.Open(conceptPid, conceptName, "Manage Concept", "Update Concept Information");
}
/*
 * Generic confirming something from user.
 */
sidora.util.isConfirmShowing = function(){return jQuery("#userConfirm").is(":visible");}
sidora.util.Confirm = function(title, questionText, onConfirmation, onCancel, confirmButtonText, cancelButtonText, onAnyClose){
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
    console.log("cancelled");
    onCancel(this, arguments);
    jQuery( this ).dialog( "close" );
  }
  jQuery("#userConfirm").dialog(dialogConfig);
}
/*
 * Check to see if the concept can be deleted and if so, asks for confirmation from user before unassociate / delete
 */
sidora.concept.DeleteConcept = function(){
  jQuery('#deleteConceptDialog').remove();
  if ((sidora.concept.GetConceptChildrenLength() == null) || (sidora.concept.GetResourceChildrenLength() == null)){
    jQuery("body").append("<div id='deleteConceptDialog' style='display:none;' title='Delete Concept'><p>Error getting the child concepts or resources for this concept. Cannot delete this concept</p><p>"+sidora.concept.GetName()+" ("+sidora.concept.GetPid()+")</p></div>");
    jQuery("#deleteConceptDialog").dialog({
      resizable: false,
      height:250,
      width: 400,
      modal: true,
      buttons: {
        "Close": function() {
          jQuery( this ).dialog( "close" );
        }
      }
    });
    return;
  }
  if (sidora.concept.GetConceptChildrenLength() + sidora.concept.GetResourceChildrenLength() > 0){
    jQuery("body").append("<div id='deleteConceptDialog' style='display:none;' title='Delete Concept'><p>This concept has "+sidora.concept.GetConceptChildrenLength()+" concept(s) and has "+sidora.concept.GetResourceChildrenLength()+" resource(s) as children. It cannot be deleted while it has children.</p><p>"+sidora.concept.GetName()+" ("+sidora.concept.GetPid()+")</p></div>");
    jQuery("#deleteConceptDialog").dialog({
      resizable: false,
      height:250,
      width: 400,
      modal: true,
      buttons: {
        "Close": function() {
          jQuery( this ).dialog( "close" );
        }
      }
    });
    return;
  }
  jQuery("body").append("<div id='deleteConceptDialog' style='display:none;' title='Delete Concept'><p>Are you sure you want to delete this concept?</p><p>"+sidora.concept.GetName()+" ("+sidora.concept.GetPid()+")</p></div>");
  jQuery("#deleteConceptDialog").dialog({
  resizable: false,
      height:205,
      width: 400,
      modal: true,
      buttons: {
        "Delete concept": function() {
          var toClose = this;
          var onDeleteWorked = sidora.util.createFunctionRefreshTree(sidora.concept.GetPid());
          var onDeleteFailed = function(data){
            jQuery("#deleteConceptConfirm").remove();
            if (typeof(data) != 'undefined' && typeof(data.description) != 'undefined'){
              jQuery("body").append("<div title='Concept Not Deleted' id='deleteConceptConfirm'><p>Concept Not Deleted</p><p>"+data.description+"</p><div>");
            }else{
              jQuery("body").append("<div title='Concept Not Deleted' id='deleteConceptConfirm'><p>Concept Not Deleted</p><p>Unknown error.  Please indicate steps taken to recreate this error, including Fedora PIDS used if possible.</p><div>");
            }
            jQuery("#deleteConceptConfirm").dialog({
              resizable:false, modal:true
            });
          };
          sidora.concept.DeleteConceptBusinessLogic(onDeleteWorked,onDeleteFailed);
          jQuery( toClose ).dialog( "close" );
        },
        Cancel: function() {
          jQuery( this ).dialog( "close" );
        }
      }
    });
}
/*
 * NON-FUNCTIONAL placeholder to give a visual representation of what the permissions panel will look like
 */
sidora.concept.ShowPermissions = function(){
  jQuery('#showPermissions').remove();
  jQuery("body").append("<div id='showPermissions' style='display:none;' title='Permissions'>"+sidora.GetPermissionsHtml()+"</div>");
  jQuery("#showPermissions").dialog({
    resizable: false,
    width: 650,
    modal: true,
    buttons: {
      Save: function() {
        jQuery( this ).dialog( "close" );
      },
      Cancel: function() {
        jQuery( this ).dialog( "close" );
      }
    }
  });
}
/*
 * NON-FUNCTIONAL placeholder to give a visual representation of what the permissions panel will look like
 */
sidora.GetPermissionsHtml = function(){
  var toReturn = "";
  toReturn += '<table class="permissions-table">';
  toReturn += '<tbody><tr>';
  toReturn += '<th>Remove</th>';
  toReturn += '<th>Group / User</th>';
  toReturn += '<th>View</th>';
  toReturn += '<th>Edit</th>';
  toReturn += '<th>Delete</th>';
  toReturn += '<th>Create Children</th>';
  toReturn += '  </tr>';
  toReturn += '';
  toReturn += '<tr class="odd">';
  toReturn += '<td></td>';
  toReturn += '<td>Logged In Users</td>';
  toReturn += '<td><input type="checkbox" checked="checked"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '</tr>';
  toReturn += '<tr class="odd">';
  toReturn += '<td><input type="image" src="'+Drupal.settings.basePath+'sites/all/modules/islandora_xml_forms-7.x/elements/images/minus_small.png" title="Remove special permissions."></td>';
  toReturn += '<td>Camera Trap Members</td>';
  toReturn += '<td><input type="checkbox" checked="checked"></td>';
  toReturn += '<td><input type="checkbox" checked="checked"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '<td><input type="checkbox" checked="checked"></td>';
  toReturn += '</tr>';
  toReturn += '<tr class="odd">';
  toReturn += '<td><input type="image" src="'+Drupal.settings.basePath+'sites/all/modules/islandora_xml_forms-7.x/elements/images/minus_small.png" title="Remove special permissions."></td>';
  toReturn += '<td>Smithsonian Employees</td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '</tr>';
  toReturn += '<tr class="odd">';
  toReturn += '<td></td>';
  toReturn += '<td>Everyone</td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '<td><input type="checkbox"></td>';
  toReturn += '</tr>';
  toReturn += '</tbody></table>';
  toReturn += '<span>Add Login / Group: </span>';
  toReturn += '<input type="text" size="45"/>';
  toReturn += ' <input type="image" src="'+Drupal.settings.basePath+'sites/all/modules/islandora_xml_forms-7.x-1.7/elements/images/add.png" title="Add the login / group to the list">';
  toReturn += '';
  toReturn += '';
  toReturn += '';
  toReturn += '';
  toReturn += '';
  return toReturn;
}
/*
 * Confirm with the user that they want the resource unassociated / deleted and performs the unassociate/delete
 */
sidora.resources.DeleteResource = function(){
  var pids = sidora.resources.getHighlighted();
  var userFriendlyListing = '<ul>';
  for (var i = 0; i < pids.length; i++){
    userFriendlyListing += '<li>';
    userFriendlyListing += jQuery(jq(pids[i])).find(".resource-list-label").html() + " (";
    userFriendlyListing += pids[i] + ")";
    userFriendlyListing += '</li>';
  }
  userFriendlyListing += '</ul>';

  jQuery('#deleteResourceDialog').remove();
  jQuery("body").append("<div id='deleteResourceDialog' style='display:none;' title='Delete Resource'><p>The following will be removed from "+sidora.concept.GetName()+" ("+sidora.concept.GetPid()+")</p>"+userFriendlyListing+"<p>If there are no other parents for a resource, the resource will also be deleted.</div>");
  jQuery("#deleteResourceDialog").dialog({
    resizable: false,
    height:445,
    width: 400,
    modal: true,
    buttons: {
      "Delete resource": function() {
        var onDeleteWorked = sidora.util.createFunctionRefreshTree(sidora.concept.GetPid());
        var onDeleteFailed = function(data){};
        sidora.resources.DeleteResourceBusinessLogic(onDeleteWorked,onDeleteFailed);
        jQuery( this ).dialog( "close" );
      },
      Cancel: function() {
        jQuery( this ).dialog( "close" );
      }
    }
  });
}
/*
 * Return if the input pid is currently on the Resource List current page's datatable
 */
sidora.resources.IsOnScreen = function(checkForPid){
  var onScreen = sidora.resources.GetOnScreenPids();
  return onScreen.indexOf(checkForPid) > -1;
}
/*
 * Return the pids of resources that are currently on the Resource List current page's datatable
 */
sidora.resources.GetOnScreenPids = function(){
  return jQuery.map(jQuery(window.sidora.resources.dataTable).find("tr[role='row']"), function(n,i){if (n.id != "") return n.id;});
}
/*
 * Return the total number of resources that are children of the highlighted concept.  Relys on the resource table to be loaded.
 */
sidora.resources.GetLength = function(){
  return jQuery(sidora.resources.dataTable).dataTable().api().page.info().recordsTotal;
}
/*
 * Remove the individualized panel for a resource (like if the user unselected it)
 */
sidora.resources.individualPanel.Remove = function() {
  jQuery('#resourceInformationPane').remove();
  jQuery('#res_table_wrapper').css('width', '');
}
/*
 * Create the panel that holds the viewer and meta tabs, and update the resources menu according to the selected object
 */
sidora.resources.individualPanel.Create = function() {
  jQuery('#resourceInformationPane').remove();
  jQuery('#res_table_wrapper').css('width', '50%');
  var forAfterWrapper =   '<div id=\'resourceInformationPane\'><div id="resourceResizable"><div id="resource-meta"></div><div id="resource-relationships"></div><div id="resourceIframeHolder">';
  forAfterWrapper += '</div></div><div id="iframeOverlay" style="position:absolute;width:100%;height:100%;"></div></div></div>';
  jQuery('#res_table_wrapper').after(forAfterWrapper);
  jQuery("#resourceResizable").prepend("<ul><li><a href='#resource-meta'>Resource Overview</a></li><li><a href='#resource-relationships'>Relationships</a></li><li><a href='#resourceIframeHolder'>Viewer</a></li></ul>");
  jQuery('#resourceResizable').tabs();
  jQuery('#delete-resource').unbind('click');
  jQuery('#delete-resource').click(function(){
    var pids = sidora.resources.getHighlighted();
    sidora.resources.DeleteResource();
  });
  jQuery('#manage-resource').unbind('click');
  jQuery('#manage-resource').click(function(){
    var pids = sidora.resources.getHighlighted();
    if (pids.length != 1) return;
    var resourcePid = sidora.resources.individualPanel.resourceOfInterest.pid;
    var resourceName = sidora.resources.individualPanel.resourceOfInterest.name;
    sidora.manage.Open(resourcePid, resourceName, "Manage Resource", "Update resource information");
  });
  jQuery('#edit-resource-metadata-menu').unbind('click');
  jQuery('#edit-resource-metadata-menu').click(function(){
  var pids = sidora.resources.getHighlighted();
  var pids_array = sidora.resources.getHighlighted();
  pids = pids_array.join("&");
    Shadowbox.open({
      content:    Drupal.settings.basePath+"sidora/edit_metadata/"+pids+"",
      player:     "iframe",
      title:      "Edit Metadata",
      options: {
        onFinish:  function(){
          //Allow the frame to go fullscreen if needed
          jQuery("#sb-player").attr("allowfullscreen","true");
          jQuery("#sb-player").attr("webkitallowfullscreen","true");
          jQuery("#sb-player").attr("mozallowfullscreen","true");
          jQuery("#sb-player").attr("msallowfullscreen","true");
          jQuery("#sb-player").attr("oallowfullscreen","true");
        }
      }
    });
  });

  //The overlay is needed to protect the cursor from being lost to the iframe
  //For example, here's what would happen during a drag toward the iframe:
  //Drag looks like it is going fine, once cursor jumps "inside" the iframe, the drag ends.  Mouse up is not captured by the dragged element, so
  //when coming back out of the iframe, the dragged element is "stuck" to the cursor, requiring a click to "drop" it
  jQuery('#resourceInformationPane').resizable({
    autoHide: true,
    handles: 'w',
    resize: this.ResizeIt,
    stop: this.StopIt
  });
}
/*
 * Store information about this ajax object so that we can use the console to determine more information about why the error occurred
 */
sidora.recentAjaxFailure = function(failure_object){
  window.ajaxer = new Object();
  window.ajaxer.ajaxDone = this;
  window.ajaxer.failure_object = failure_object;
  window.ajaxer.fail = true;
  console.log("Ajax failure logged to window.ajaxer");
  if (window.ajaxer.failure_object.status == 403) {
    console.log("Ajax failure was due to a 403 'Forbidden' so the user likely has been logged out somehow. Reloading page in 3 seconds");
    setTimeout(function(){
      window.location.reload();
    }, 3000);

  }
}
sidora.resources.individualPanel.LoadRelationships = function(){
  if (sidora.resources.individualPanel.resourceOfInterest != null){
    var roipid = sidora.resources.individualPanel.resourceOfInterest.pid;
    sidora.concept.LoadContentHelp.Relationships(roipid,"#resource-relationships");
  }
}
/*
 * Generates a url for the object viewer
 */
sidora.resources.createViewerUrl = function(pid){
  return Drupal.settings.basePath+'sidora/resource_viewer/'+pid;
}
/*
 * Loads the viewer once an item has been clicked on
 */
sidora.resources.individualPanel.LoadContent = function(suppressResourceViewerReload){
  if (typeof(suppressResourceViewerReload) == 'undefined'){ suppressResourceViewerReload = false; }
  roipid = sidora.resources.individualPanel.resourceOfInterest.pid;
  if (!suppressResourceViewerReload){
    var viewerUrl = sidora.resources.createViewerUrl(sidora.resources.individualPanel.resourceOfInterest.pid);
    var resourceViewerHtml = '<iframe id="iFrame" frameborder="0" height="100%" width="100%" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" oallowfullscreen="true" msallowfullscreen="true" src="'+viewerUrl+'"></iframe> ';
    //console.log("in individual panel : "+resourceViewerHtml);
    jQuery('#resourceIframeHolder').children().remove();
    jQuery('#resourceIframeHolder').append(resourceViewerHtml);
  }
  jQuery('#resource-meta .error-message').remove();
  var toPerformOnFail = function(meta_html){
    var myDiv = sidora.util.getErrorMessageHtml();
    jQuery('#resource-meta .metadata-table').remove();
    jQuery('#resource-meta').append(myDiv);
    sidora.resources.individualPanel.ResizeAndStop(); //Gives it proper height
    sidora.recentAjaxFailure(meta_html);
  };
  jQuery.ajax({
    url: Drupal.settings.basePath+'sidora/info/'+roipid+'/meta/sidora_xsl_config_variable/browser/html',
  }).done(function(meta_html){
    if (meta_html.toLowerCase().indexOf("contact the ocio help desk") == -1){
      myDiv = jQuery(meta_html);
      jQuery('#resource-meta .metadata-table').remove();
      jQuery('#resource-meta').append(myDiv);
      sidora.resources.individualPanel.ResizeAndStop(); //Gives it proper height
    }else{
      toPerformOnFail(meta_html);
    }
  }).fail(function(meta_html){
    toPerformOnFail(meta_html);
  });
  sidora.resources.individualPanel.LoadRelationships();
  sidora.ResizeToBrowser();
}
/*
 * Information to give to user if we get a bad response from an ajax query
 */
sidora.util.getErrorMessageHtml = function(){
  return '<div class="error-message">Fedora Commons returned unexpected information.  The Fedora Commons connection may not be available</div>';
}
sidora.resources.DeleteResourceBusinessLogic = function(onSuccess, onFailure){
  var pids = sidora.resources.getHighlighted();
  for (var i = 0; i < pids.length; i++){
    sidora.util.deletePid(pids[i], onSuccess, onFailure);
  }
}
sidora.concept.DeleteConceptBusinessLogic = function(onSuccess, onFailure){
  return sidora.util.deletePid(this.GetPid(), onSuccess, onFailure,'deleteConcept');
}
/*
 * Unassociate and delete orphan of the Pid
 */
sidora.util.deletePid = function(pidOfInterest, onSuccess, onFailure,action=''){
  var unassociateFrom = sidora.concept.GetPid();
  if (unassociateFrom == pidOfInterest){
	//This was "delete concept", find the current concept's parent
    var jst = jQuery("#forjstree").jstree(true);
    var checkSelectedArr = jst.get_selected();
    for (var i = 0; i < checkSelectedArr.length; i++){
      var currSelected = checkSelectedArr[i];
      var csPid = jQuery("#"+currSelected+" a").attr("pid");
      if (csPid == pidOfInterest){
        unassociateFrom = jQuery("#"+currSelected).parent().parent().children().filter("a").attr("pid");
      }
    }
  }
  var url = Drupal.settings.basePath+'sidora/ajax_parts/unassociate_delete_orphan/'+unassociateFrom+'/'+pidOfInterest;
  var userFriendlyToastName = "Remove <em>"+sidora.util.FriendlyNameDirect(pidOfInterest);
  userFriendlyToastName += "</em> from <em>"+sidora.util.FriendlyNameDirect(unassociateFrom)+"</em>";
  sidora.queue.RequestPost(userFriendlyToastName,url,"",onSuccess,onFailure,[pidOfInterest,unassociateFrom],action);
  sidora.queue.Next();
}
/*
 * Get a friendly name for the pid if it's currently available as a concept or resource (most pids UI deals with are)
 */
sidora.util.FriendlyNameDirect = function(pid){
  var pidName = null;
  var resourceName = jQuery(jq(pid)).find(".resource-list-label").html();
  if (typeof(resourceName) == 'string') pidName = resourceName;
  var concept =  jQuery("a").filter(function(index){ return jQuery(this).attr("pid") == pid; });
  var conceptName = concept.attr("fullname");
  if (typeof(conceptName) == 'string') pidName = conceptName;
  return pidName;
}
/*
 * Get a friendly name for the pids any way we can.  Use this in the following way:
 * 
 * sidora.util.FriendlyNames("si:root,si:123,si:389025").then(function(data){
 *   console.log(data); //Whatever processing here
 * })
 *
 * The data is in an associative array that will look like this:
 * ===
 * data["si:root"] = "Smithsonian Root"
 * data["si:289025"] = "Whatever the label is for this"
 * ===
 * Since si:123 label couldn't be determined, it is not in the output
 */
sidora.util.FriendlyNamesPromise = function(pidsInput){
  if (typeof(pidsInput) == 'string'){
    //If a comma separated string, pull them out
    if (pidsInput.indexOf(",") > -1){
      pids = pidsInput.split(",");
    }else{
      //Else assume it's just a single pid
      pids = [pidsInput];
    }
  }else{
    //If not a string, then it should be an array of pids as strings
    pids = pidsInput;
  }
  var toReturn = [];
  var deferredAllPidsComplete = jQuery.Deferred();
  var ajaxTasks = [];
  for (var pidIndex = 0; pidIndex < pids.length; pidIndex++){
    var pid = pids[pidIndex];
    var pidName = null;
    var resourceName = jQuery(jq(pid)).find(".resource-list-label").html();
    if (typeof(resourceName) == 'string') pidName = resourceName;
    var concept =  jQuery("a").filter(function(index){ return jQuery(this).attr("pid") == pid; });
    var conceptName = concept.attr("fullname");
    if (typeof(conceptName) == 'string') pidName = conceptName;
    if (pidName == null){
      //So this pid isn't in our tree or our current list of resources.  Go and get it from the server
      var updateArray = function(arrayToUpdate,pid){
        return function(data,textStatus,jqXHR){ 
          if (typeof(data) == 'string'){
            console.log("FriendlyPid Error 2: Problem getting name for pid:"+pid);
            //object not found
          }else{
            var possibleLabels = data.getElementsByTagName("label");
            if (possibleLabels.length > 0){
              arrayToUpdate[pid] = possibleLabels[0].innerHTML;
            }else{
              //Unknown error
              console.log("FriendlyPid Error 2: Problem getting name for pid:"+pid);
            }
          }
        }
      };
      ajaxTasks.push(
        jQuery.ajax({ url: Drupal.settings.basePath+'sidora/info/'+pid+'/meta/all' }).done(updateArray(toReturn,pid))
      );
    }else{
      toReturn[pid] = pidName;
    }
  }
  jQuery.when.apply(null, ajaxTasks).then(function(data){
    deferredAllPidsComplete.resolve(toReturn);
  });
  return deferredAllPidsComplete.promise();
}
/*
 * Handle loading of the metadata and resource viewer when a resource from the table is clicked on
 */
sidora.resources.individualPanel.CreateAndInit = function () {
  //Don't recreate the panel if it's already there
  if ( jQuery('#resourceInformationPane').length == 0 ){
    this.Create();
    this.ResizeAndStop(); //Makes it the right SIZE
    this.ResizeAndStop(); //Puts it in the right PLACE
    //If this is panel is created while the table is loading, the table could be set to a specific size instead of being correctly set to 100%
    jQuery("#res_table").css("width","100%");
  }
  sidora.resources.individualPanel.LoadContent();
}
/*
 * Basic resizing for when there are major changes to the resource list tab
 */
sidora.resources.individualPanel.ResizeAndStop = function () {
  this.ResizeIt(null, { element: jQuery('#resourceInformationPane')  });
  this.StopIt(null, { element: jQuery('#resourceInformationPane')  });
};
/*
 * Resizes the viewer and table containers so they can use the slider
 */
sidora.resources.individualPanel.ResizeIt = function (e, ui)
{
  var parent = ui.element.parent();
  // when calculating the remainingSpace, factor in the 15px offset for the resourceInformationPane 
	var remainingSpace = parent.width() - ui.element.outerWidth() -15,
  divTwo = ui.element.prev(),
  divTwoWidthPixels = (remainingSpace - (divTwo.outerWidth() - divTwo.width()));
  //if they were attempted to be set at smaller than their min size, resize everything
  if (parseInt(divTwo.css("min-width")) > divTwoWidthPixels){
    divTwoWidthPixels = parseInt(divTwo.css("min-width"));
  }
  divTwoWidth = (divTwoWidthPixels) / parent.width() * 100 + '%';
  
  divTwo.width(divTwoWidth);
  jQuery(ui.element).css('left', 15);

  //Give the max width of the resizable element to be the entire parent minus what the left element has declared as its min-width
  var maxWidth = parent.width() - parseInt(jQuery(parent.children()[1]).css('min-width'));
  jQuery(ui.element).resizable('option', 'maxWidth', maxWidth); 

  var newMinHeight = Math.max(600,jQuery("#resourceResizable").height(),jQuery("#res_table_wrapper").height(), jQuery("#resource-meta").height()+jQuery("#resourceResizable ul").height()+10);
  //Protect the cursor input from being taken into the iframe by making the overlay displayable
  jQuery("#iframeOverlay").show();
  
  //Move items around to fit the menu in the best place
  if (jQuery("#res_table_wrapper").width() < 470){
    jQuery("#res_table_wrapper").css("margin-top","83px");
    jQuery("#sidora-resources-button-row").css("top","90px").css("left","20px");
  }else{
    jQuery("#res_table_wrapper").css("margin-top","50px");
    jQuery("#sidora-resources-button-row").css("top","").css("left","");
  }
};
/*
 * Resizes items on the resources pane once the user (or program) is done with dragging the splitter bar between the table and viewer
 */
sidora.resources.individualPanel.StopIt = function (e, ui)
{
  var parent = ui.element.parent();
  var maxWidth = parent.width() - (50 + parseInt(ui.element.prev().css('min-width')));
  ui.element.css({
    width: ui.element.width() / parent.width() * 100 + '%',
  });
  var currWidth = parseInt(ui.element.width());
  var isNumber = !isNaN(currWidth);
  if (isNumber){
    var isTooBig = currWidth > maxWidth;
    if (isTooBig){
        ui.element.css("width",maxWidth);
    }
  }
  jQuery("#iframeOverlay").hide(); //Allow the cursor into the iframe
};
/*
 * Initializes and then opens the shadowbox based management panel
 */
sidora.manage.Open = function(pid, name, title, userFriendlyToastName){
  this.recent = {};
  this.recent.pid = pid;
  this.recent.name = name;
  this.recent.title = title;
  this.recent.uftn = userFriendlyToastName;
  sidora.manage.OpenCurrentConfig();
}
/*
 * Opens the shadowbox based management panel
 */
sidora.manage.OpenCurrentConfig = function(){
  var pid = this.recent.pid;
  var name = this.recent.name;
  var title = this.recent.title;
  var userFriendlyToastName = this.recent.uftn;
  Shadowbox.close();
  jQuery.ajax(Drupal.settings.basePath+"sidora/manage/"+pid).done(function(html){
    Shadowbox.open({
        content:    html,
        player:     "html",
        title:      title,
        height: Math.max(600,jQuery("body").height()-100),
        width: jQuery("body").width()-100,
        options: {
          enableKeys: false,
          onFinish:  function(){
            jQuery("#submitObjProperties").click(function(){
              sidora.queue.RequestPost(userFriendlyToastName+":<em>"+name+"</em> ("+pid+")",Drupal.settings.basePath+"sidora/manage/"+pid+"/save","label="+jQuery("#objPropLabel").val()+"&owner="+jQuery("#objPropOwner").val(),function(){},function(){},pid,'manage');
              sidora.queue.Next();
            });
            jQuery("#addDatastream").click(function(){
              jQuery('#addDatastreamDialog').remove();
              jQuery("body").append("<div id='addDatastreamDialog' style='display:none;' title='Add Datastream'><iframe height='1000%' width='100%' style='height:100%;width:100%' src='"+Drupal.settings.basePath+"sidora/manage/"+pid+"/upload' frameborder='0' marginwidth='0' marginheight='0' allowfullscreen></iframe></div>");
              jQuery("#addDatastreamDialog").dialog({
                resizable: true,
                height:600,
                width: 600,
                modal: true,
              });
              jQuery("#addDatastreamDialog").css("overflow", "hidden");
              jQuery("#addDatastreamDialog").closest(".ui-dialog").css("z-index", 1000); //shadowbox is 998
            });
            jQuery(".versionHistory").click(function(){
              var pid = jQuery(this).attr('pid');
              var datastreamTitle = jQuery(this).attr('datastream');
              jQuery('#versionHistoryDialog').remove();
              jQuery("body").append("<div id='versionHistoryDialog' style='display:none;' title='"+datastreamTitle+" Version History'><iframe height='1000%' width='100%' style='height:100%;width:100%' src='"+Drupal.settings.basePath+"sidora/version_history/"+pid+"/"+datastreamTitle+"' frameborder='0' marginwidth='0' marginheight='0' allowfullscreen></iframe></div>");
              jQuery("#versionHistoryDialog").dialog({
                resizable: true,
                height: jQuery("#objectManagement").height()+50,
                width: jQuery("#objectManagement").width()+50,
                modal: true,
              });
              jQuery("#versionHistoryDialog").css("overflow", "hidden");
              jQuery("#versionHistoryDialog").closest(".ui-dialog").css("z-index", 1000); //shadowbox is 998
            }); 
           }
          }
    });
  })
}
/*
 * Reopens the frame to show an update to the user
 */
sidora.manage.resetFrame = function(){
  this.OpenCurrentConfig();
}
/*
 * Removes a datastream from the object, confirms with user first
 */
sidora.manage.removeDatastream = function(pid,dsid){
  jQuery('#removeDatastreamDialog').remove();
  jQuery("body").append("<div id='removeDatastreamDialog' style='display:none;' title='Remove Datastream'>Removing DSID:"+dsid+" from:"+pid+". This action cannot be undone.  Continue?</div>");
  jQuery("#removeDatastreamDialog").dialog({
    resizable: true,
    height:300,
    width: 600,
    modal: true,
    buttons: {
      "Yes, remove": function() {
        sidora.queue.RequestPost("Removed Datastream "+dsid+" from "+pid+" <em>"+sidora.util.FriendlyNameDirect(pid)+"</em>",Drupal.settings.basePath+"sidora/manage/"+pid+"/remove/"+dsid+"/confirm","",
          function(){
            sidora.manage.resetFrame();
          },
          function(){},pid,'deleteDatastream');
        sidora.queue.Next();
        jQuery( this ).dialog( "close" );
      },
      "No, Do not remove": function() {
        jQuery( this ).dialog( "close" );
      }
    }
  });
  jQuery("#removeDatastreamDialog").css("overflow", "hidden");
  jQuery("#removeDatastreamDialog").closest(".ui-dialog").css("z-index", 1000); //shadowbox is 998
}
jQuery(function () {
  //Check to see that the page has a hash or ends with a '/' so that we will not have to reload the page on first click
  if (
       window.location.hash == "" && 
       (!window.location.pathname.startsWith(Drupal.settings.basePath) || !window.location.pathname.endsWith("/sidora/workbench/")) 
     ){
    window.location = Drupal.settings.basePath + "sidora/workbench/#";
  }
  else {
    window.sidora.InitiatePage();
  }
});

jQuery(window).resize(function() {
  sidora.ResizeOnWindowResize();
  sidora.ResizeToBrowser();
});

/*
 * If the browser doesn't have a console, give it something so we're not creating JS errors
 */
if (typeof(window.console) == 'undefined'||typeof(window.console.log)=='undefined'){window.console = {log:function(){}};}
//setTimeout(sidora.util.constantCheck,4000); //All polling links in to this function, give 4 seconds for Drupal javascripts to set up


/**
Because jQuery uses CSS syntax for selecting elements, some characters are interpreted as CSS notation. For example, ID attributes, after an initial letter (a-z or A-Z), may also use periods and colons, in addition to letters, numbers, hyphens, and underscores (see W3C Basic HTML Data Types). The colon (":") and period (".") are problematic within the context of a jQuery selector because they indicate a pseudo-class and class, respectively.

In order to tell jQuery to treat these characters literally rather than as CSS notation, they must be "escaped" by placing two backslashes in front of them.

The following function takes care of escaping these characters and places a "#" at the beginning of the ID string

from:
http://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
*/
function jq( myid ) {
  return "#" + myid.replace( /(:|\.|\[|\])/g, "\\$1" );
}
function getNewPid( jsonString ) {
  var pidString = jsonString.slice(jsonString.indexOf("New Pid:"),jsonString.indexOf(":End New Pid"));
  var pidArray = pidString.split(":");
  return (pidArray[1]+":"+pidArray[2]);
} 
function writeCookie(name,value,days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + value + expires;
}
function readCookie(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}
sidora.reloadPage = function(){
  window.location.reload();
}
