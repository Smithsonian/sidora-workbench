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
  },
  ProjectSpaces: {}
};
window.sidora.display = {
  //Resource specific
  "LINK_TO_RESOURCE_TITLE" : Drupal.t("Create links to resource"),
  "RESOURCES_EXISTED_AT_TARGET_WILL_REMOVE_FROM_SOURCE" : Drupal.t("The resources listed below existed on the target already and will not be overwritten. They will be removed from the concepts that they were dragged from:"),
  "CREATE_LINKS_OF_RESOURCES_TO_DESTINATION" : Drupal.t("Create links of following resources inside of the concept "),
  "MOVE_RESOURCES_TO_DESTINATION" : Drupal.t("Move the following resources to "),
  "MOVE_RESOURCES_TITLE": Drupal.t("Move Resources"),
  "RESOURCES" : Drupal.t(' resources'),
  "RESOURCES_DD_ALL" : Drupal.t('All'),
  "RESOURCES_DD_IMAGE" : Drupal.t("Image"),
  "RESOURCES_DD_DIGITIZED_TEXT" : Drupal.t("Digitized Text"),
  "RESOURCES_DD_TABULAR_DATASET" : Drupal.t('Tabular Dataset'),
  "RESOURCES_DD_AUDIO" : Drupal.t('Audio'),
  "RESOURCES_DD_VIDEO" : Drupal.t('Video'),
  "RESOURCES_DD_SORT_TITLE" : Drupal.t('  Sort: '),
  "RESOURCES_DD_TITLE" : Drupal.t('Title'),
  "RESOURCES_DD_MODEL" : Drupal.t('Model'),
  "RESOURCES_DD_CREATED" : Drupal.t('Created'),
  "CREATE_NEW_RESOURCE_TOOLTIP" : Drupal.t("Create a new resource as a child of the highlighted concept."),
  "CREATE_RESOURCE_TITLE" : Drupal.t("Create Resource"),

  //Concept specific
  "CREATE_LINKS_OF_FOLLOWING_TO" : Drupal.t("Create links of the following concepts inside of the concept "),
  "MOVE_CONCEPT_TITLE": Drupal.t("Move concept"),
  "MOVE_FOLLOWING_CONCEPTS_TO" : Drupal.t("Move the following concepts to "),
  "CONCEPTS_EXISTED_AT_TARGET_WILL_REMOVE_FROM_SOURCE" : Drupal.t("The concepts listed below existed on the target already and will not be overwritten. They will be removed from the concepts that they were dragged from:"),
  "CREATE_A_CONCEPT_AS_CHILD_OF_HIGHLIGHT" : Drupal.t("Create a new concept as a child of the highlighted concept."),
  "CREATE_CONCEPT_TITLE" : Drupal.t("Create Concept"),
  "MANAGE_CONCEPT_TITLE" : Drupal.t("Manage Concept"), 
  "UPDATE_CONCEPT_INFORMATION" : Drupal.t("Update Concept Information"),
  "CREATE_LINK_TO_CONCEPT" : Drupal.t('Create Link To Concept'),
  "DELETE_CONCEPT_TITLE" : Drupal.t("Delete Concept"),

  //Button HTML
  "BUTTON_HTML_ADD_A_NEW_CONCEPT" : Drupal.t("&nbsp;Add&nbsp;a&nbsp;new&nbsp;concept"),
  "BUTTON_HTML_CONFIRM" : Drupal.t("Confirm"),
  "BUTTON_HTML_CANCEL" : Drupal.t("Cancel"),
  

  //Generic
  "EDIT_METADATA_TITLE" : Drupal.t("Edit Metadata"),
  "ASCENDING" : Drupal.t('Ascending'),
  "DESCENDING" : Drupal.t('Descending'),
  "TARGET_IS_LOCKED_GENERIC" : Drupal.t("The target is locked by another user."),
  "LINK_ITEM_GENERIC_TITLE" : Drupal.t("Link item"),
  "ALREADY_EXISTS_ON_TARGET_WILL_NOT_CREATE_LINK" : Drupal.t("Already exists on target, will not create link"),
  "ALREADY_EXISTS_ON_TARGET_WILL_NOT_CREATE_LINK_ANY" : Drupal.t("All items selected for creating links already exist on the target."),
  "ALREADY_EXISTS_ON_TARGET_WILL_NOT_MOVE" : Drupal.t("Already exists on target, will not move"),
  "ALREADY_EXISTS_ON_TARGET_WILL_NOT_MOVE_ANY" : Drupal.t("All items selected for move already exist on the target."),
  "REASSURE_WORKING_NOT_HUNG_DO_NOT_RELOAD" : Drupal.t("This is taking a little longer than normal but we're still working on it"),
  "REQUIRE_FEDORA_USER_SETUP" : Drupal.t('It looks like your user hasn\'t been set up yet. To automatically set up your user now, click \'Set Up Now\'. The process will take about 30 seconds and will reload the page when it\'s complete.'),
  "SECONDS_ESTIMATED_REMAINING" : Drupal.t("s estimated remaining"),
  "UNKNOWN_ACTION" : Drupal.t('Unknown action'),
  "MOVING" : Drupal.t("Moving "),
  "COPYING" : Drupal.t("Copying "),
  "FROM" : Drupal.t(" from "),
  "TO" : Drupal.t(" to "),
  "EDIT_SHARING_PERMISSIONS_TITLE" : Drupal.t("Edit Sharing Permissions"),
  "GENERIC_X_OF_Y" : Drupal.t(' of '),
  "VALIDATING_YOUR_USER_WAITING" : Drupal.t("Validating your user..."),

  //Tree refresh issues
  "TREE_ISSUE_NEVER_CHECKED": Drupal.t("Never attempted validity check"),
  "TREE_ISSUE_NO_TREE_EXIST": Drupal.t("No tree indicates a user problem"),
  "TREE_ISSUE_IS_NOT_STRING": Drupal.t("Tree html was not a string"),
  "TREE_ISSUE_OCIO_INTERCEPT": Drupal.t("OCIO intercepted tree html issue."),
  "TREE_ISSUE_BAD_FORMAT": Drupal.t("Did not receive tree in proper tree format."),


  // Permissions
  "PROJECT_SPACE_PERMISSION_TITLE" : Drupal.t("Research Space Permission"),
  "PROJECT_SPACE_CHOICE_CHANGE_PERMISSIONS" : Drupal.t("Change permissions of the current research space"),
  "PROJECT_SPACE_CHOICE_TRANSFER_PS_TO_NEW_OWNER" : Drupal.t("Transfer this research space to a new owner"),
  "PROJECT_SPACE_CHOICE_DUPLICATE_CONCEPT" : Drupal.t("Copy the selected concept and its children"),
  "PROJECT_SPACE_CHOICE_TRANSFER_CONCEPT" : Drupal.t("Move the selected concept"),
  "PROJECT_SPACE_CHOICE_DUPLICATE_RESOURCE" : Drupal.t("Copy the selected resources"),
  "PROJECT_SPACE_CHOICE_TRANSFER_RESOURCE" : Drupal.t("Move the selected resources"),


  // Only ever put to console, doesn't actually display on browser screen
  "CONSOLE_OUTPUT_BAD_PERMISSIONS_DATA_REDIRECT" : Drupal.t("Bad permissions data, likely a user setup issue, redirecting to user profile"),
  "CONSOLE_OUTPUT_BASIC_DATA_REDIRECT" : Drupal.t("Problem getting basic data, redirecting to the user profile"),
  "CONSOLE_OUTPUT_BAD_USER_DATA_REDIRECT" : Drupal.t("Bad user data, redirecting to user profile"),
  "CONSOLE_OUTPUT_BAD_BASIC_USER_REDIRECT" : Drupal.t("Problem getting basic user info, redirecting to the user profile"),
  "CONSOLE_OUTPUT_DROPPED_ON_EXISTING_PARENT" : Drupal.t("dropped on existing parent, ignoring request"),
  "CONSOLE_OUTPUT_ERROR_ON_CREATE_MENU" : Drupal.t("error on create menu"),
  "CONSOLE_OUTPUT_NEW_PID" : Drupal.t("new pid:"),
  "CONSOLE_OUTPUT_REMOVE_BAD_OBJECT" : Drupal.t("Removal from UI of invalid or malformed object with pid: "),
  "CONSOLE_OUTPUT_TOO_MANY_TREE_FAILURES_SO_QUITTING" : Drupal.t("Too many tree failures without a success. Stopping retries."),
  "CONSOLE_OUTPUT_UNKNOWN_TREE_ISSUE" : Drupal.t("Unknown tree issue. Error code:surt1"),

  "SIDORA_VERSION" : "0.5.4"
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
  sidora.resources.dataTable = jQuery('#res_table').dataTable({
     "oLanguage": {
       "sLengthMenu": "Show _MENU_"
     },
     'sPaginationType': "input",
     'lengthMenu':[5,10,50,100],
     'pageLength': (sidora_util.readCookie('Drupal.pageLength') == '')?parseInt('5'):parseInt(sidora_util.readCookie('Drupal.pageLength')),
     'search': {
       'search': ((sidora_util.readCookie('Drupal.dtFilter') == '')?'all':sidora_util.readCookie('Drupal.dtFilter')) + '\n' + '' + '\n' + ((sidora_util.readCookie('Drupal.sortOn') == '')?'':sidora_util.readCookie('Drupal.sortOn')) + '\n' + ((sidora_util.readCookie('Drupal.sortOrder') == '')?'':sidora_util.readCookie('Drupal.sortOrder')),
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
  jQuery('#res_table').DataTable().clearPipeline().draw();
  // Check and uncheck the checkboxes on the left side
  jQuery("table th.sidora-bulk-action-check").on( 'click', function (e) {
    if (jQuery("tr.selected").length == 0) {
      jQuery("#res_table tbody tr").addClass("selected");
      jQuery("#res_table tbody tr .sidora-bulk-action-check i").text("check");
    } else {
      jQuery("#res_table tbody tr").removeClass("selected");
      jQuery("#res_table tbody tr .sidora-bulk-action-check i").text("");
    }
    sidora.resources.bulkActionSelectAction();
    document.getSelection().removeAllRanges();
  });
  setTimeout(function(){
    jQuery("#res_table td:nth-child(1), #res_table td:nth-child(3), #res_table td:nth-child(4), #res_table td:nth-child(5), #res_table td:nth-child(6)").click(
      function (e) {
        var row = jQuery(this).parent();
        // Use these columns only for the selections
        //If the mousedown is on something that is in the middle of a move process, ignore the mousedown
        if (jQuery(row).hasClass("is-being-moved")){
          console.log("Item is being moved, ignoring click");
          return;
        }
        if ( jQuery(row).hasClass('selected') ) {
          jQuery(row).removeClass('selected');
          jQuery(row).find(".sidora-bulk-action-check i").text("");
        } else {
          jQuery(row).addClass('selected');
          jQuery(row).find(".sidora-bulk-action-check i").text("check");
        }
        sidora.resources.bulkActionSelectAction();
      }
    ); //End onclick
    // Add the overlay for the resource viewer
    jQuery("#res_table td:nth-child(2)").click(function(){
      var pid = jQuery(this).parent().attr("id");
      var url = Drupal.settings.basePath+"sidora/resource_viewer/"+pid;
      Shadowbox.close();
      setTimeout(function(){
        Shadowbox.open({
          content:    url,
          player:     "iframe",
          title:      Drupal.t('Resource Viewer'),
          options: {
            onFinish:  function(){}
          }
        });
      },100);
    });
  },4000);
}
sidora.resources.bulkActionSelectAction = function(){
  if (jQuery("tr.selected").length == 0) {
    jQuery("th>i").html("&nbsp;");
    jQuery("th>i").removeAttr("title","");
  }
  if (jQuery("tr.selected").length > 0) {
    jQuery("th>i").text("indeterminate_check_box");
    jQuery("th>i").attr("title","Unselect All");
  }
  if (jQuery("tr.selected").length == jQuery("#res_table tbody tr").length) {
    jQuery("th>i").text("check");
    jQuery("th>i").removeAttr("title","");
  }
}
sidora.AddConcept = function() {
  if (!sidora.concept.permissions.create) return;
  Shadowbox.open({
    content:    Drupal.settings.basePath+"sidora/ajax_parts/create_concept/"+window.sidora.concept.GetPid()+"",
    player:     "iframe",
    width: 800,
    title:      sidora.display.CREATE_CONCEPT_TITLE,
    options: {
      onClose: function(){
        sidora_util.cacheClear();
      },
      onFinish:  function(){}
    }
  });
}
sidora.AddResource = function() {
  if (!sidora.concept.permissions.create) return;
  Shadowbox.open({
    content:    Drupal.settings.basePath+"sidora/ajax_parts/create_resource/"+window.sidora.concept.GetPid()+"",
    player:     "iframe",
    title:      sidora.display.CREATE_RESOURCE_TITLE,
    options: {
      onClose: function(){
        sidora_util.cacheClear();
      },
      onFinish:  function(){}
    }
  });
}
/*
 * Prepares the resource table to respond to user inputs: dragging, changing filters, entering search parameters
 */
sidora.concept.LoadContentHelp.Resources.TableActionsSetup = function(){
  //Put a more compact pager in place
  var buttonList = '<div id="sidora-resources-button-row" style="">';
  buttonList +=   '<div id="sidora-resources-button-first" class="sidora-resources-icon" style=""><i class="material-icons">fast_rewind</i></div>';
  buttonList +=   '<div id="sidora-resources-button-prev" class="sidora-resources-icon" style=""><i class="material-icons">play_arrow</i></div>';
  buttonList +=   '<div id="sidora-resources-pager" style="display:inline-block;vertical-align: top;padding-top: 7px;">';
  buttonList +=     '<div id="sidora-resources-page-text" style="display:inline-block">Page</div>';
  buttonList +=     '<input id="sidora-resources-page-number" type="text" size="2" class="form-text"/>';
  buttonList +=     '<div id="sidora-resources-page-count" style="display:inline-block"></div>';
  buttonList +=   '</div>';
  buttonList +=   '<div id="sidora-resources-button-next" class="sidora-resources-icon" style=""><i class="material-icons">play_arrow</i></div>';
  buttonList +=   '<div id="sidora-resources-button-last" class="sidora-resources-icon" style=""><i class="material-icons">fast_forward</i></div>';
  buttonList += '</div>';
  jQuery("#res_table_wrapper").append(buttonList);
  jQuery("#sidora-resources-button-first").click(function(){ jQuery(".paginate_button.first").click();  });
  jQuery("#sidora-resources-button-prev").click(function(){ jQuery(".paginate_button.previous").click();  });
  jQuery("#sidora-resources-button-next").click(function(){ jQuery(".paginate_button.next").click();  });
  jQuery("#sidora-resources-button-last").click(function(){ jQuery(".paginate_button.last").click();  });
  jQuery("#res_table_paginate").hide();
  jQuery("#res_table_wrapper").append('<input type="text" name="titleFilter" id="titleFilter" placeholder="Search Resources" style="border: solid 1px lightblue;">');
  jQuery("#res_table_wrapper").append('<a id="add-resource-button" href="#" onclick="sidora.AddResource(); return false;" class="sidora-thin-button"><span>+</span>Add New Resources</a>');
  jQuery("#res_table_wrapper").append('<select id="sidora-resource-bulk-actions" class="form-select"><option value="">Bulk Actions</option><option value="duplicate">Copy</option><option value="move">Move</option><option value="delete">Delete</option></select>');
  jQuery("#sidora-resource-bulk-actions").change(function(){
    if (jQuery("#sidora-resource-bulk-actions").val() != "") {
      if (sidora.resources.getHighlighted().length == 0) {
        sidora.util.Confirm("Bulk Action", "Before selecting an action, select resources with the checkboxes on the left of each resource.", null, null, 'Close', 'Close');
      }
      else {
        sidora.resources.performBulkActions();
      }
      jQuery("#sidora-resource-bulk-actions").val("");
    }
  });
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
    jQuery('#sidora-resources-page-count').html(htmlEntities(sidora.display.GENERIC_X_OF_Y) + info.pages );
    if (sidora.resources.individualPanel.resourceOfInterest){
      jQuery(this).find(jq(sidora.resources.individualPanel.resourceOfInterest.pid)).trigger("click");
      if (sidora_util.readCookie('Drupal.selectResource') == '1'){
        sidora_util.writeCookie('Drupal.selectResource','0','30');
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
        '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + highlightedPids.length + htmlEntities(sidora.display.RESOURCES) + '<span class="fakejstree-copy" style="'+displayPlusToIndicateCopy+'">+</span></div>'
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
  var dlHtml = ' of type <select id=\"sidora-resource-type-dropdown\" class="form-select" name=\"search\">';
  dlHtml += '<option value=\"\">'+htmlEntities(sidora.display.RESOURCES_DD_ALL)+'</option>';
  dlHtml += '<option value=\"images\">'+htmlEntities(sidora.display.RESOURCES_DD_IMAGE) + '</option>';
  dlHtml += '<option value=\"pdf\">'+htmlEntities(sidora.display.RESOURCES_DD_DIGITIZED_TEXT) +'</option>';
  dlHtml += '<option value=\"csv\">'+htmlEntities(sidora.display.RESOURCES_DD_TABULAR_DATASET)+'</option>';
  dlHtml += '<option value=\"audio\">'+htmlEntities(sidora.display.RESOURCES_DD_AUDIO)+'</option>';
  dlHtml += '<option value=\"video\">'+htmlEntities(sidora.display.RESOURCES_DD_VIDEO)+'</option>';
  dlHtml += '</select>';
  jQuery('.dataTables_length').append(dlHtml);
  if (sidora_util.readCookie('Drupal.dtFilter') != ''){
    jQuery("#sidora-resource-type-dropdown").val(sidora_util.readCookie('Drupal.dtFilter'));
  }
  var rtpHtml = '<div id="sidora-resource-sort">';
  rtpHtml += htmlEntities(sidora.display.RESOURCES_DD_SORT_TITLE);
  rtpHtml += '<select id=\"sidora-resource-sort-dropdown\" class="form-select" name=\"sort\"><option value=\"title\">';
  rtpHtml += htmlEntities(sidora.display.RESOURCES_DD_TITLE);
  rtpHtml += '</option><option value=\"model\">';
  rtpHtml += htmlEntities(sidora.display.RESOURCES_DD_MODEL);
  rtpHtml += '</option><option value=\"created\" selected=\"selected\">';
  rtpHtml += htmlEntities(sidora.display.RESOURCES_DD_CREATED);
  rtpHtml += '</option></select></div>';
  jQuery('#res_table_processing').before(rtpHtml);
  jQuery('#sidora-resource-sort-dropdown').after('  <select id=\"sidora-resource-sortorder-dropdown\" class="form-select" name=\"sortorder\"><option value=\"ASC\">'+htmlEntities(sidora.display.ASCENDING) + '</option><option value=\"DESC\" selected=\"selected\">'+htmlEntities(sidora.display.DESCENDING) + '</option></select>');
  if (sidora_util.readCookie('Drupal.sortOn') != ''){
    jQuery('#sidora-resource-sort-dropdown').val(sidora_util.readCookie('Drupal.sortOn'));
  }
  if (sidora_util.readCookie('Drupal.sortOrder') != ''){
    jQuery("#sidora-resource-sortorder-dropdown").val(sidora_util.readCookie('Drupal.sortOrder'));
  }     
  jQuery("#res_table_length select").addClass("form-select");
  sidora.resources.reloadDatatableBasedOnCurrentFilters = function(){
    var changeTo = jQuery('#sidora-resource-type-dropdown').val();
    jQuery('#res_table_filter input').val(changeTo);
    var recentSearchVal = jQuery("#titleFilter").val();
    changeTo += "\n"+recentSearchVal;
    var sortOn = (sidora_util.readCookie('Drupal.sortOn') != '')?sidora_util.readCookie('Drupal.sortOn'):jQuery('#sidora-resource-sort-dropdown').val();
    var sortOrder = (sidora_util.readCookie('Drupal.sortOrder') != '')?sidora_util.readCookie('Drupal.sortOrder'):jQuery('#sidora-resource-sortorder-dropdown').val();
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
    sidora_util.writeCookie('Drupal.dtFilter',jQuery('#sidora-resource-type-dropdown').val(),'30')
    sidora.resources.reloadDatatableBasedOnCurrentFilters();
  });
  jQuery('#sidora-resource-sort-dropdown').change(function(){
   sidora_util.writeCookie('Drupal.sortOn',jQuery('#sidora-resource-sort-dropdown').val(),'30')
   sidora.resources.reloadDatatableBasedOnCurrentFilters();
   });
  jQuery('#sidora-resource-sortorder-dropdown').change(function(){
   sidora_util.writeCookie('Drupal.sortOrder',jQuery('#sidora-resource-sortorder-dropdown').val(),'30')
   sidora.resources.reloadDatatableBasedOnCurrentFilters();
   });
}
/*
 * Sets the visiblility of menu items on the concept menu.  Remember, this is UI only and is not to be used for security
 */
sidora.concept.LoadContentHelp.Permissions = function(conceptOfInterest){
  jQuery("#sharing-permissions").toggle(false);
  jQuery("#concept-create").toggle(false);
  jQuery("#deleteConcept").toggle(false);
  jQuery("#editMetadataConcept").toggle(false);
  jQuery("#editPermissionsConcept").toggle(false);
  jQuery("#manageConcept").toggle(false);
  jQuery.ajax({
    dataType: "json",
    url: Drupal.settings.basePath+'sidora/info/'+conceptOfInterest+'/permission',
    success: function(permissions){
      sidora.concept.permissions = permissions;
      var addButtons = jQuery("#add-concept-button, #add-resource-button");
      if (permissions.create) {
        addButtons.css("opacity","1").removeAttr("title");
      }
      else {
        addButtons.css("opacity","0.4").attr("title",Drupal.t("Create permissions haven't been granted to your user."));
      }
      jQuery("#add-resources").toggle(permissions.create);
       
      //jQuery("#sharing-permissions").toggle(jQuery("#j1_1 >a").attr("pid") == sidora.concept.loadedContentPid);
      //jQuery("#concept-create").toggle(permissions.create);
      jQuery("#deleteConcept").toggle(permissions.delete);
      jQuery("#editMetadataConcept").toggle(permissions.update); 
      //jQuery("#editPermissionsConcept").toggle(permissions.permission); 
      jQuery("#manageConcept").toggle(permissions.manage);
      // Resource permissions currently tied to concept permissions
      //jQuery("#delete-resource").toggle(permissions.delete);
      //jQuery("#edit-resource-metadata-menu").toggle(permissions.update);
      // The "view metadata" is the view-equivalent of edit, don't show both
      //jQuery("#view-resource-metadata").toggle(!permissions.update);
        
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
sidora.concept.IsResearchSpace = function() {
  var isSpace = jQuery('#' + sidora.util.getNodeIdByHref() + " > a.is-project-space").length; 
  return isSpace > 0;
}
/*
 * Loads the metadata screen for the concept
 */
sidora.concept.LoadContentHelp.Metadata = function(conceptOfInterest){
  var detailsUrl = Drupal.settings.basePath+'sidora/info/'+conceptOfInterest+'/meta/sidora_xsl_config_variable/browser/html';
  if (sidora.concept.IsResearchSpace()) detailsUrl = Drupal.settings.basePath+'sidora/info/'+conceptOfInterest+'/ps_detail';
  jQuery.ajax({
    url: detailsUrl,
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
        title:      sidora.display.EDIT_METADATA_TITLE,
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
  var newName = sidora.concept.GetName();
  if (typeof(newName) == 'undefined') {
    var phref = sidora.util.getParentHref();
    window.location.href = phref;
    var nodeId = sidora.util.getNodeIdByHref(window.location.pathname + window.location.search + window.location.hash);
    jQuery("#" + nodeId + " > a").click();
    return;
  }
  jQuery("#concept-name-holder").html("<h1 class='page-title'>"+sidora.concept.GetName()+"</h1>");
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

  // Show the correct menu for space vs normal concept
  var irs = sidora.concept.IsResearchSpace();
  jQuery("#concept-menu-edit-concept").toggle(!irs);
  jQuery("#concept-menu-edit-space").toggle(irs && sidora.ProjectSpaces.isOwned());

  sidora.concept.LoadContentHelp.Permissions(conceptOfInterest);
  sidora.concept.LoadContentHelp.Exhibition_view(conceptOfInterest);
  sidora.concept.LoadContentHelp.Metadata(conceptOfInterest);
  jQuery("a[href='#concept-resource-list']").parent().toggle(!irs);
  jQuery("#concept_tabs").children("ul").toggle(!irs);
  if (!irs) {
    sidora.concept.LoadContentHelp.FullTableReload(conceptOfInterest);
  }
  else {
    jQuery("#concept-resource-list").toggle(false);
    jQuery("#concept-meta-link").click();
  }
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
  if (typeof(existingHref) == 'undefined' || existingHref == null) {
   existingHref = window.location.pathname + window.location.search + window.location.hash;
  }
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
  if (typeof(currentUrl) == 'undefined' || currentUrl == null) {
   currentUrl = window.location.pathname + window.location.search + window.location.hash;
  }
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
  sidora.util.loadTreeSectionsIfNeeded(selectThisNode, true);
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
sidora.util.loadTreeSectionsIfNeeded = function(data, doFast){
  if (data == false) return;
  var jst = jQuery("#forjstree").jstree();
  var node = data;
  if (typeof(data.node) != 'undefined') {
    node = data.node;
  }
  var jst = jQuery("#forjstree").jstree(true);
  var openingPid = node.a_attr.pid;
  if (typeof openingPid == 'undefined') return;
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
        var nodeOfInterest = jst.get_node(node.children[ccc]);
        var numberOfChildrenThisDoesHave = nodeOfInterest.children.length;
        if (numberOfChildrenThisShouldHave > numberOfChildrenThisDoesHave) {
          doRetrieval = true;
        }
      }
      if (doRetrieval) {
        sidora.util.loadTreeSection(openingPid, null, null, doFast);
      }
    }
  }
}
sidora.ProjectSpaces.currentPid = function() {
  return jQuery("#" + jQuery("#psdd-select").val()).children("a").attr("pid");
}
sidora.ProjectSpaces.writableProjectSpaces = function() {
  var toReturn = [];
  var domIdsOfProjectSpaces = jQuery("#psdd-select option").map(function(){return jQuery(this).val()});
  for (var dii = 0; dii < domIdsOfProjectSpaces.length; dii++){
    var permissions = jQuery("#" + domIdsOfProjectSpaces[dii]).children("a").attr("permissions");
    if (typeof(permissions) != 'undefined' && permissions.indexOf("c") > -1) {
      toReturn.push(jQuery("#" + domIdsOfProjectSpaces[dii]).children("a").attr("pid"));
    }
  }
  return toReturn;
}
sidora.ProjectSpaces.isAbleToTransfer = function() {
  var projectSpaceRep = sidora.util.GetTreeNodesByPid(sidora.ProjectSpaces.currentPid())[0];
  if (typeof(projectSpaceRep) == 'undefined') {
    return false;
  }
  if (Drupal.settings.username == projectSpaceRep.a_attr.owner) {
    return true;
  }
  if (Drupal.settings.is_admin == "1") {
    return true;
  }
  return false;
}
sidora.ProjectSpaces.ChangeProjectSpace = function(selectedValue, suppressClick) {
  if (jQuery("#"+selectedValue).length == 0) {
    return false;
  }
  var projectSelectorCss = jQuery("#"+selectedValue).siblings().map(function(){return "#" + this.id;}).get().join(", ");
  if (projectSelectorCss.length > 0) {
    projectSelectorCss += " , ";
  }
  projectSelectorCss += "#j1_1 > i, #j1_1 > a { display:none } ";
  projectSelectorCss += " #" + selectedValue + " { position: absolute; top: 0; left: 0; } ";
  jQuery("#project-selector-css").remove();
  jQuery("<style>").prop("type","text/css").prop("id","project-selector-css").html(projectSelectorCss).appendTo("head");
  if (!suppressClick) {
    jQuery("#"+selectedValue).children("a").click();
  }
  var owned = !jQuery("#"+selectedValue).children("a").hasClass("not-owned");
  return true;
}
sidora.ProjectSpaces.DuplicateOrTransferIntro = function(type, pids) {
  var intro = "<p>";
  if (type == "duplicate") {
    intro = "Copy will create entirely new objects.<br> New objects will be duplicates and changes made to them will not affect the original objects.<br>You selected the following to be copied:";
  }
  if (type == "transfer") {
    intro = "You selected the following to be moved:";
  }
  if (type == "link") {
    intro = "Links will not create a new object.<br> Any changes to made while using the link directly affect the original.<br> You selected for links to be created to the following:";
  }
  intro += "</p><ul>";
  for(var pidIndex = 0; pidIndex < pids.length; pidIndex++) {
    intro += '<li>';
    intro += sidora.util.FriendlyNameDirect(pids[pidIndex]);
    intro += '</li>';
  }
  intro += '</ul>';
  return intro;
}
sidora.util.FirstVisibleNodeWithPid = function(pid) {
  return jQuery.map(sidora.util.GetTreeNodesByPid(pid),function(a){
    if (jQuery("#"+a.id).length > 0) return a; else return null;
  })[0];
}
sidora.ProjectSpaces.DuplicateOrTransfer = function(type, conceptsOrResources, specificPids, myTitle) {
  if (typeof(myTitle) == 'undefined' || myTitle == null) {
    myTitle = sidora.display.PROJECT_SPACE_PERMISSION_TITLE;
  }
  var pids = [];
  var parentPid = null;
  if (conceptsOrResources == 'resources') {
    pids = sidora.resources.getHighlighted();
    parentPid = sidora.concept.GetPid();
  }
  else {
    pids.push(sidora.concept.GetPid());
    var jst = jQuery("#forjstree").jstree();
    parentPid = jst.get_node(jst.get_node(jst.get_selected()[0]).parent).a_attr.pid;
    // parent SHOULD BE VISIBLE in order to see the current concept
    // project spaces have no parent pids, but they should not be transferrable or duplicatable
  }
  // overwrite
  if (typeof(specificPids) == 'string') {
    pids = [specificPids]; 
  }
  if (typeof(specificPids) == 'object') {
    pids = specificPids;
  }
  var ignoredDestination = '';
  // transfer is now move, and we can move within the project space
  //if (type == 'transfer') {
    // Only allow things to get transferred outside of the current research space
    //ignoredDestination = sidora.ProjectSpaces.currentPid();
  //}
  var specificDestination = '';
  var specifiedDepth = null;
  if (type == 'link') {
    // Only allow links within the current research space
    specificDestination = sidora.ProjectSpaces.currentPid();
    ignoredDestination = '';
    specifiedDepth = 10;
  }

  var intro = sidora.ProjectSpaces.DuplicateOrTransferIntro(type, pids);
  intro += "<p>Choose a destination below:</p>";
  var onSubmit = function(){};
  if (type == 'duplicate') {
    onSubmit = function(destPid){
      sidora.util.Confirm(
        Drupal.t("Copy Creation"),
        Drupal.t("Confirm to create a copy of the objects to %friendlyname", {"%friendlyname":sidora.util.FriendlyNameDirect(destPid)}),
        function(){
          sidora.performDuplicate(destPid, pids, function(){ setTimeout( function(){sidora.util.loadTreeSection(destPid, null, null, false)}, 20000)});
          sidora_util.cacheClear();
          Shadowbox.close();
        }
      );
    }
  }
  var title = '';
  var description = '';
  var operation = '';
  if (type == 'transfer') {
    title = ("Move Object");
    description = "move";
    operation = 'move';
  }
  if (type == 'link') {
    title = ("Link Object");
    description = "link"
    operation = 'copy';
  }
  if (type == 'transfer' || type == 'link') {
    onSubmit = function(destPid){
      sidora.util.Confirm(
        Drupal.t(title),
        Drupal.t("Confirm to " + description + " objects to %friendlyname", {"%friendlyname":sidora.util.FriendlyNameDirect(destPid)}),
        function(){
          var nodeMoveFrom = sidora.util.FirstVisibleNodeWithPid(parentPid);
          var nodeMoveTo = sidora.util.FirstVisibleNodeWithPid(destPid);
          if (nodeMoveTo == undefined) {
            nodeMoveTo = sidora.util.GetTreeNodesByPid(destPid)[0];
          }
          var nodeThatIsMoving = sidora.util.FirstVisibleNodeWithPid(pids[0]);
          if (nodeThatIsMoving == undefined) {
            if (typeof(nodeMoveTo) == 'undefined') {
              // The place we're creating a link does not exist in the left tree, just do the actions: no tree update
              sidora.resources.performCopyOrMoveFedoraActions('copy', parentPid, destPid, pids, function(){});
            }
            else {
              sidora.resources.performCopyOrMove(operation, nodeMoveTo.id, pids);
            }
          }
          else if (type == 'transfer') {
            var data = {};
            data.node = nodeThatIsMoving;
            data.parent = nodeMoveTo.id;
            data.old_parent = nodeMoveFrom.id;
            data.moveFromPid = parentPid;
            data.moveToPid = destPid;
            sidora.concept.MoveNode(data);
          }
          else if (type == 'link') {
            var data = {};
            data.node = nodeThatIsMoving;
            data.parent = nodeMoveTo.id;
            data.old_parent = nodeMoveFrom.id;
            data.moveFromPid = parentPid;
            data.moveToPid = destPid;
            sidora.concept.CopyNode(data);
          }
          sidora_util.cacheClear();
          Shadowbox.close();
        }
      );
    }
  }
  sidora.ProjectSpaces.ShowWhereToForm(intro, pids, ignoredDestination, specificDestination, onSubmit, specifiedDepth, myTitle);
}
sidora.ProjectSpaces.DuplicateOrTransferHtml = function(selectionIntroHtml){
  var toReturn = "<div style='height:100%'>";
  toReturn += selectionIntroHtml;
  var height = 110 + selectionIntroHtml.split("<br").length * 20;
  toReturn += "<div id='destination-tree' style='width:100%;overflow:auto;height:calc(100% - "+height+"px);'>Loading destination trees...</div>";
  toReturn += '<input id="destination-chosen" class="form-submit" style="float:right; width:100px;" value="Submit" />';
  return toReturn;
}
sidora.ProjectSpaces.ShowWhereToForm = function(selectionIntro, pids, ignorePid, specifyPids, onSubmit, specifiedDepth, myTitle){
  var params = {
  };
  if (typeof(ignorePid) == 'string' && ignorePid != '') {
    params['ignore_pid'] = ignorePid;
  }
  if (typeof(specifyPids) == 'string' && specifyPids != '') {
    params['specify_pids'] = specifyPids;
  }
  params['doFast'] = 'true';
  var query = jQuery.param(params);
  if (query != '') {
    query = '?' + query;
  }
  // Specifically for links, allow the user to go down through a large amount of the tree
  // Could also be expanded for non-link use in the future
  var appendToUrl = '';
  if (typeof(specifiedDepth) === 'number' || (typeof(specifiedDepth) == 'string' && specifiedDepth != '')) {
    appendToUrl = '/' + specifiedDepth;
  }
  setTimeout(function(){
    Shadowbox.open({
      content:    "<div style='height:100%;background:floralwhite;'><div style='padding:10px;height:calc(100% - 20px);'>"+sidora.ProjectSpaces.DuplicateOrTransferHtml(selectionIntro, onSubmit)+"</div></div>",
      player:     "html",
      title:      myTitle,
      width: 800,
      height: Math.max(600,jQuery("body").height()-100),
      options: {
        onFinish:  function(){
          var url = Drupal.settings.basePath+"sidora/ajax_parts/research_spaces_tree" + appendToUrl + query;
          var onDataComplete = function(data) {
              jQuery("#destination-tree").html(data);
              jQuery("#destination-tree").jstree({
                "core": {
                  "multiple" : false,
                  "initially_open" : ["proj_spaces_tree_root"]
                }
              });
              jQuery("#destination-chosen").click(function(){
                var destree = jQuery("#destination-tree").jstree();
                var destPid = jQuery("#"+destree.get_selected()).children("a").attr("pid");
                if (typeof(destPid) == 'undefined') {
                  alert('need to pick something'); 
                }
                else {
                  onSubmit(destPid);
                }
              });
          };
          var cachedData = sidora_util.cache(url);
          if (typeof(cachedData) == 'undefined') { 
            jQuery.ajax({
              // Do not include the current project space as a place to duplicate the tree
              "url":url,
              "success":function(data){
                // For the next 20 min, use this info (assume we aren't changing much)
                sidora_util.cache(url, data, 1200);
                onDataComplete(data);
              },
              "error":function(){
                console.log("pst error");
              }
            });
          }
          else {
            onDataComplete(cachedData);
          }
        }
      }
      });
  },100 + (Shadowbox.isOpen() * 800));
  Shadowbox.close();
}
sidora.ProjectSpaces.ShowPermissionsForm = function(pid){
  if (typeof(pid) == 'undefined') {
    pid = sidora.ProjectSpaces.currentPid();
  }
  setTimeout(function(){
    Shadowbox.open({
      content:    Drupal.settings.basePath+"sidora/sharing_permissions/"+pid,
      player:     "iframe",
      title:      sidora.display.PROJECT_SPACE_PERMISSION_TITLE,
      options: {
        onFinish:  function(){}
      }
      });
  },100 + (Shadowbox.isOpen() * 800));
  Shadowbox.close();
}
sidora.ProjectSpaces.ShowProjectSpaceTransferForm = function(pid){
  if (typeof(pid) == 'undefined') {
    pid = sidora.ProjectSpaces.currentPid();
  }
  setTimeout(function(){
    Shadowbox.open({
      content:    Drupal.settings.basePath+"sidora/project_space_transfer/"+pid,
      player:     "iframe",
      title:      Drupal.t("Research Space Transfer"),
      options: {
        onFinish:  function(){}
      }
      });
  },100 + (Shadowbox.isOpen() * 800));
  Shadowbox.close();
}

sidora.queue = new SidoraQueue();
sidora.contextMenu = {};
sidora.contextMenu.SetUp = function(){
  $ = jQuery;
  var cmips = function(key, opt){
    if (key == 'editConcept' && !sidora.concept.permissions.update) {
      return true;
    }
    if (key == 'addResources' && !sidora.concept.permissions.create) {
      return true;
    }
    if (key == 'moveConcept' && !sidora.concept.permissions.delete) {
      return true;
    }
    return jQuery(opt.$trigger).hasClass("is-project-space");
  };
  var cmnps = function(key, opt){
    if (key == 'addConcept' && !sidora.concept.permissions.create) {
      return true;
    }
    if (key == 'changePermissions' && !sidora.ProjectSpaces.isOwned()) {
      return true;
    }
    if (key == 'changeOwner' && !sidora.ProjectSpaces.isOwned()) {
      return true;
    }
    if (key == 'editResearchSpace' && !sidora.ProjectSpaces.isOwned()) {
      return true;
    }
    return !jQuery(opt.$trigger).hasClass("is-project-space");
  };
  $(function() {
        $.contextMenu({
            selector: '#fjt-holder .jstree-anchor',  // Everything that will be on the tree
            zIndex: 91, //The resizable toolbar is at 90
            events: {
                show: function (options) {
                  sidora.contextMenu.ClickItem = this;
                }
            }, 
            callback: function(key, options) {
                // Allow function to be changed on the fly
                sidora.contextMenu.Chooser(key, options);
            },
            items: {
                "editConcept": {name: "Edit Concept", icon: "edit", disabled: cmips},
                "addResources": {name: "Add Resource(s)", icon: "paste", disabled: cmips},
                "copyConceptAndChildren": {name: "Copy Concept ...", icon: "copy", disabled: cmips},
                "moveConcept": {name: "Move Concept ...", icon: "arrow-right", disabled: cmips},
                "linkConcept": {name: "Link Concept ...", icon: "external-link", disabled: cmips},
                "deleteConcept": {name: "Delete Concept", icon: "delete", disabled: cmips},
                "sep1": "---------",
                "addConcept": {name: "Add New Concept", icon: "paste"},
                "sep2": "---------",
                "editResearchSpace": {name: "Edit Research Space", icon: "edit", disabled: cmnps},
                "changePermissions": {name: "Change Space Permissions ...", disabled: cmnps},
                "changeOwner": {name: "Move Space to New Owner ...", icon: "arrow-right", disabled: cmnps},
            }
        });
    });
}
sidora.contextMenu.Chooser = function(key, options) {
  var pid = jQuery(sidora.contextMenu.ClickItem).attr("pid");
  var treeId = jQuery(sidora.contextMenu.ClickItem).parent().attr("id");
  sidora.menuChoice(key,pid,treeId);
}
sidora.menuChoice = function(key, pid, treeId){
  var myUrl = null;
  var myTitle = null;
  switch(key) {
    case "copyConceptAndChildren":
      myTitle = Drupal.t("Copy Concept");
      sidora.ProjectSpaces.DuplicateOrTransfer('duplicate', 'concept', pid, myTitle);
      break;
    case "moveConcept":
      myTitle = Drupal.t("Move Concept");
      sidora.ProjectSpaces.DuplicateOrTransfer('transfer', 'concept', pid, myTitle);
      break;
    case "linkConcept":
      myTitle = Drupal.t("Create New Link");
      sidora.ProjectSpaces.DuplicateOrTransfer('link', 'concept', pid, myTitle);
      break;
    case "editConcept":
      myUrl = Drupal.settings.basePath+"sidora/edit_metadata/"+pid;
      myTitle = sidora.display.EDIT_METADATA_TITLE;
      break;
    case "addResources":
      myUrl = Drupal.settings.basePath+"sidora/ajax_parts/create_resource/"+pid;
      myTitle = sidora.display.CREATE_RESOURCE_TITLE;
      break;
    case "editResearchSpace":
      myUrl = Drupal.settings.basePath+"sidora/research_space_create/"+pid;
      myTitle = Drupal.t("Research Space Edit");
      break;
    case "addConcept":
      myUrl = Drupal.settings.basePath+"sidora/ajax_parts/create_concept/"+pid;
      myTitle = sidora.display.CREATE_CONCEPT_TITLE;
      break;
    case "changePermissions":
      myUrl = Drupal.settings.basePath+"sidora/sharing_permissions/"+pid;
      myTitle = Drupal.t("Research Space Permissions");
      break;
    case "changeOwner":
      myUrl = Drupal.settings.basePath+"sidora/research_space_transfer/"+pid;
      myTitle = Drupal.t("Research Space Transfer");
      break;
    case "deleteConcept":
      sidora.concept.DeleteConceptByTreeId(treeId);
      return;
      break;
  }
  if (myUrl != null) {
      Shadowbox.open({
        content:    myUrl,
        player:     "iframe",
        title:      myTitle,
        options: {
          onFinish:  function(){}
        }
      });

  }
}
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
          sidora.util.loadTreeSection(
            openingPid, 
            function(){
              jQuery("#forjstree").trigger("loaded.jstree");
            },
            null, // overwriteType (defaults to changes)
            true  // doFast
          );
          return;
        }
      }
    }

    jQuery("#forjstree").unbind('open_node.jstree');
    jQuery('#forjstree').bind('open_node.jstree', function (e, data) {
      sidora.util.loadTreeSectionsIfNeeded(data, true);
    });
    sidora.util.openToCurrentPathAndSelectItem(currentUrl);
    //When you select a node, update the url in the browser, change the page title (not browser title) and load the concept content into the main window
    jQuery("#forjstree").unbind('select_node.jstree');
    jQuery('#forjstree').bind('select_node.jstree', function(e,data) {
      var jst = jQuery("#forjstree").jstree();
      window.location = jQuery('#'+data.selected[0]).children('a').attr('href');
      sidora.UpdateTitleBasedOnNameInTree(jQuery(jQuery('#'+data.selected[0]).find("a")[0]).text());
      sidora.concept.LoadContent();
      sidora.util.loadTreeSectionsIfNeeded(data, true);
    });
    jQuery("#forjstree").unbind('copy_node.jstree');
    jQuery('#forjstree').bind('copy_node.jstree', function (e, data) {
      var jst = jQuery("#forjstree").jstree(true);
      if (typeof(jst.pureUIChange) != 'undefined' && jst.pureUIChange) return true; //don't want a Fedora change
      sidora.concept.CopyNode(data);
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
      sidora.queue.Request(
        'Remove concept association',
        actionUrl,
        function(){
          sidora.concept.LoadContentHelp.Relationships();
          sidora.util.createFunctionRefreshTree(moveFromPid);
        },
        sidora.util.createFunctionRefreshTree(moveFromPid)
        , [toMovePid,moveFromPid],'unassociate'
      );
      sidora.queue.incomingRequestsAreSilent = false;
      sidora.queue.Next();
    });

    jQuery("#forjstree").unbind('move_node.jstree');
    jQuery('#forjstree').bind('move_node.jstree',function(event,data){
      var jst = jQuery("#forjstree").jstree(true);
      if (typeof(jst.pureUIChange) != 'undefined' && jst.pureUIChange) return; //don't want a Fedora change
      sidora.concept.MoveNode(data);
    });
    jQuery("#forjstree").bind("before.jstree", function(e, data){
      console.log("bjt");
    });

    jQuery('#forjstree').show();
    window.sidora.contextMenu.SetUp();

    jst.open_node(jst.get_node("j1_1"));
    setTimeout(function(){
      var mainTreeChildren = jQuery("#j1_1").children("ul").children();
      jQuery("#conceptResizable").prepend("<div class='project-space-drop-down'><select id='psdd-select'></select></div>");
      var selectedIndex = 0;
      for(var mtci = 0; mtci < mainTreeChildren.length; mtci++){
        var optionVal = mainTreeChildren[mtci].id;
        var optionText = jQuery(mainTreeChildren[mtci]).children("a").attr("fullname");
        var selected = "";
        if (jQuery(mainTreeChildren[mtci]).children("a").hasClass('default-project-space')) {
          selectedIndex = mtci;
          selected = "selected";
        }
        var optionToAdd = jQuery("<option value='"+optionVal+"'"+selected+">"+htmlEntities(optionText)+"</option>");
        jQuery("#psdd-select").append(optionToAdd); 
      }
      // value of sep1 is used as a marker for where to dynamically add newly created project spaces
      jQuery("#psdd-select").append("<option value='sep1'>-----</option>");
      jQuery("#psdd-select").append("<option value='link_viewAll'>View all Research Spaces...</option>");
      jQuery("#psdd-select").append("<option value='link_createNew'>Create a Research Space...</option>");
      if (window.location.hash == "") {
        var selectedValue = mainTreeChildren[selectedIndex].id;
        sidora.ProjectSpaces.ChangeProjectSpace(selectedValue);
      }
      else {
        // Perform the basic setup but don't change the dropdown
        sidora.ProjectSpaces.ChangeProjectSpace();
        // Set the dropdown to the space that the hash says
        var hashInfo = window.location.hash.split(/#|\?path=|,/);
        var setToPid = "";
        if (hashInfo.length > 1) setToPid = hashInfo[1];
        if (hashInfo.length > 2 && hashInfo[2] != "") setToPid = hashInfo[2];
        if (setToPid.length > 0) {
          var possibilities = jQuery.map(sidora.util.GetTreeNodesByPid(setToPid),function(a){ return a.id; })
          var dropDownOptions = jQuery("#psdd-select option").map(function(){return jQuery(this).val()}).toArray();
          var validChoices = possibilities.filter(function(n){return dropDownOptions.indexOf(n) !== -1;});
          // SHOULD only have maximum 1 valid choice due to dropdown, so let's assume so
          // Then set to the option obtained from the hash
          if (validChoices.length > 0) {
            jQuery("#psdd-select").val(validChoices[0]);
          }
          else {
            // Set to the admin section that has no valid choice
            // or somebody typed something wrong and we don't know what to do
            jQuery("#psdd-select").val("j1_2");
          }
        }
      }
      // save the url path so we can go to that item
      
      // set the change handler and immediately call it
      jQuery("#psdd-select").change(function(){ 
        if (!sidora.ProjectSpaces.ChangeProjectSpace(this.value)) {
          // Don't let the drop down change if it went to a menu item
          if (this.value == 'link_viewAll') {
            sidora.ProjectSpaces.viewAll();
          }
          if (this.value == 'link_createNew') {
            sidora.ProjectSpaces.showCreate();
          }
          jQuery(this).val(jQuery.data(this, 'current'));
        }
        else {
          jQuery.data(this, 'current', jQuery(this).val());
        }
      });
      sidora.ProjectSpaces.ChangeProjectSpace( jQuery("#psdd-select").val(), true );
      // initialize the current setting so we can change it back if needed
      jQuery.data(document.getElementById("psdd-select"), 'current', jQuery("#psdd-select").val());
      
    }, 200);
    jQuery("#page").show();


    var updateLocationWith = jQuery('#'+jstreeIdSelected).children('a').attr('href');
    if (typeof(updateLocationWith) != 'undefined') window.location = updateLocationWith;
    //if the content is already based on the highlighted concept, do nothing
    sidora.UpdateTitleBasedOnNameInTree();
  },200)});
  jQuery('#forjstree').hide();
  jQuery('#forjstree').jstree({
    "core" : {
      "check_callback": function(callbackType,draggedObjects,mouseOverObject,someNum,dragStatus){
        if (callbackType == "copy_node"){
          var jst = jQuery("#forjstree").jstree(true);
          if (typeof(jst.pureUIChange) != 'undefined' && jst.pureUIChange) return true; //don't want a Fedora change

          //Note that all resource moves are also considered "copy_node"
          if (typeof(draggedObjects.instance) == 'undefined'){ 
            //instance only exists if it is being dragged from a tree, resources do not exist in a jstree
            if (dragStatus.core){
              //Resource
              if ((jQuery('.jstree-copy:visible').length > 0) || (jQuery('.fakejstree-copy:visible').length > 0)){
                //is a copy
                var showText = sidora.display.CREATE_LINKS_OF_RESOURCES_TO_DESTINATION + jQuery("#"+mouseOverObject.id).children("a").attr("fullname");
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
                         showText += " - " + sidora.display.ALREADY_EXISTS_ON_TARGET_WILL_NOT_CREATE_LINK + "</li>";
                      }else{
                         showText += "</li>";
                         resourcesToCopyOver.push(sidora.util.dragResources[i]);
                      }  
                    }
                    showText += "</ul>";
                    if (resourcesToCopyOver.length > 0){
                       sidora.util.Confirm(sidora.display.LINK_TO_RESOURCE_TITLE,showText,
                         function(){
                           sidora.resources.performCopyOrMove("copy",mouseOverObject.id, resourcesToCopyOver);
                         }
                      );
                    }else{
                      sidora.util.Confirm(sidora.display.LINK_TO_RESOURCE_TITLE,sidora.display.ALREADY_EXISTS_ON_TARGET_WILL_NOT_CREATE_LINK_ANY);
                   }
                  } 
                });  
              }else{
                //is a move
                var showText = sidora.display.MOVE_RESOURCES_TO_DESTINATION + jQuery("#"+mouseOverObject.id).children("a").attr("fullname")+" ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):";
                showText += "<ul>";
                var showTextForUnassociate = sidora.display.RESOURCES_EXISTED_AT_TARGET_WILL_REMOVE_FROM_SOURCE + "<ul>";
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
                        sidora.util.Confirm(sidora.display.MOVE_RESOURCES_TITLE,showText,
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
                          sidora.display.MOVE_RESOURCES_TITLE,
                          "<h4>" + sidora.display.ALREADY_EXISTS_ON_TARGET_WILL_NOT_MOVE_ANY + "</h4>"+showTextForUnassociate,
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
                  sidora.util.Confirm(sidora.display.LINK_ITEM_GENERIC_TITLE,sidora.display.TARGET_IS_LOCKED_GENERIC);
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
                 
                var showText = sidora.display.CREATE_LINKS_OF_FOLLOWING_TO;
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
                    showText += "<li>"+currSel.attr("fullname")+" ("+currSel.attr("pid")+") - " + sidora.display.ALREADY_EXISTS_ON_TARGET_WILL_NOT_CREATE_LINK + "</li>";
                  }else{
                    showText += "<li>"+currSel.attr("fullname")+" ("+currSel.attr("pid")+")</li>";
                    objectsToCopyOver.push(selected[i]);
                  }
                }
                showText += "</ul>";
                if (objectsToCopyOver.length > 0){
                  if (!sidora.util.isConfirmShowing()){
                    sidora.util.Confirm(sidora.display.LINK_ITEM_GENERIC_TITLE,showText,
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
                  sidora.util.Confirm(sidora.display.LINK_ITEM_GENERIC_TITLE,sidora.display.ALREADY_EXISTS_ON_TARGET_WILL_NOT_CREATE_LINK_ANY,
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
                sidora.util.Confirm(sidora.display.MOVE_CONCEPT_TITLE,sidora.display.TARGET_IS_LOCKED_GENERIC);
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
               
              var showText = sidora.display.MOVE_FOLLOWING_CONCEPTS_TO;
              showText += jQuery("#"+mouseOverObject.id).children("a").attr("fullname");
              showText += " ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):<ul>";
              var showTextForUnassociate = sidora.display.CONCEPTS_EXISTED_AT_TARGET_WILL_REMOVE_FROM_SOURCE + "<ul>";
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
                  sidora.util.Confirm(sidora.display.MOVE_CONCEPT_TITLE,"<h4>" + sidora.display.ALREADY_EXISTS_ON_TARGET_WILL_NOT_MOVE_ANY + "</h4>"+showTextForUnassociate,
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
  jQuery("#concept_tabs").css("position","relative");
  jQuery("#concept-resource-list").css("padding","0");
  jQuery("#concept-resource-list").css("height","100%");
}
sidora.RelocateTreeOnPage = function(){
  jQuery("body").append("<div id='fjt-holder'></div>");
  jQuery("#fjt-holder").append(jQuery("#forjstree"));
  jQuery("#fjt-holder").css("width","280px");
  jQuery("#fjt-holder").css("min-width","200px");
  jQuery("#fjt-holder").css("height","calc(100% - 43px)");
  jQuery("#fjt-holder").css("position","absolute");
  jQuery("#fjt-holder").css("top",'40px');
  jQuery("#fjt-holder").css("overflow",'auto');
  jQuery("#fjt-holder")
      .wrap('<div/>')
          .parent()
            .attr('id','conceptResizable')
            .css({'display':'block',
                  'overflow':'hidden',
                  'height':function(){return window.innerHeight - (jQuery("#branding").outerHeight()+jQuery("#branding").offset().top+6);},
                  'width':  function(){return parseInt(jQuery('#fjt-holder').width())+'px';},
                  'margin-right' : '2px',
                  'min-width':function(){return parseInt(jQuery('#fjt-holder').css('min-width'))+20+'px';}
                 })
                .resizable({handles:'e',resize:sidora.ResizeTree,stop:sidora.stopResizeTree})
                    .find('#fjt-holder')
                      .css({
                            'width': function(){return parseInt(jQuery('#conceptResizable').outerWidth())-10+'px';}
                            });
  jQuery('#conceptResizable')
    .wrap('<div/>')
      .parent()
      .attr('id','conceptTreeParent')
      .append('<div id="iframeTreeOverlay" style="position:absolute;width:100%;height:100%;"></div>');
  jQuery("#conceptResizable").find(".ui-resizable-e").css("background-color","#aaa").css("width","10px").css("right","0");
  sidora.ResizeToBrowser();
  sidora.ResizeTree(null,{element:jQuery("#conceptResizable")});
  sidora.stopResizeTree();
  sidora.testColoring();
}
sidora.testColoring = function()  // TBD BBB TODO REMOVE
{
      var sp = new URLSearchParams(location.search);
      var currentRoot = sp.get("nr");
      if (currentRoot == null) return;
  var jstreeIdSelected = null;
  var jst = jQuery("#forjstree").jstree();
  var existingTreeNodes = jst.get_json('#', {flat:true});
  jQuery.each(existingTreeNodes,function(i,obj){
    if (i % 3 < 2) {
      obj.a_attr.class = "bright-green";
    } else {
      obj.a_attr.class = "bright-yellow";
    }
  });
  jQuery("#forjstree a").addClass("bright-green")
}
sidora.ResizeTree = function (e, ui)
{
  //Protect the cursor input from being taken into the iframe by making the overlay displayable
  jQuery("#iframeTreeOverlay").show();
  if (jQuery('#resourceInformationPane').is(':visible')) {
    // if a resource is currently selected, get the width ratio for the resourcepanel
    var resourceDivWidth = parseInt(jQuery('#resourceInformationPane').outerWidth()) / parseInt(jQuery('#resourceInformationPane').parent().width()) * 100;
  } 
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
  var treeWidth = parseInt(ui.element.outerWidth())+"px";
  divTwo.css("left",treeWidth);
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
sidora.ResizeMaxWidth = function(){
  var baseMax = jQuery(window).width();
  // Maximum width set to 2000px
  if (baseMax > 2000) baseMax = 2000;
}
sidora.ResizeToBrowser = function(){
  var leftSideHeight = jQuery(window).height();
  leftSideHeight -= (jQuery("#branding").outerHeight()+jQuery("#branding").offset().top+6);
  if (jQuery("footer").is(":visible")){
    leftSideHeight -= jQuery("footer").height();
  }
  jQuery("#conceptResizable").css("height",leftSideHeight+"px");
  var tabsHeight = leftSideHeight-50;
  jQuery("#concept_tabs").css("height",tabsHeight+"px");
  var baseMax = sidora.ResizeMaxWidth();
  var concept_tabsWidth = parseInt(baseMax-jQuery('#conceptResizable').outerWidth()-8);
  var tabContentHeight = tabsHeight - jQuery(".ui-tabs-nav").height();
  jQuery("#concept-resource-list").css("height",tabContentHeight);
  jQuery("#resourceResizable").css("height",'99%');
  jQuery("#resourceInformationPane").css("height",tabContentHeight+'px')
  jQuery("#resourceInformationPane").css("padding-right",'15px');
  var conceptMetaHeight = tabContentHeight - (56);
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
  sidora.ResizeOnWindowResize();
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
        console.log(sidora.display.CONSOLE_OUTPUT_BAD_PERMISSIONS_DATA_REDIRECT);
        window.location = Drupal.settings.basePath+"user";
      }
    },
    "error":function(){
       console.log(sidora.display.CONSOLE_OUTPUT_BASIC_DATA_REDIRECT);
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
          console.log(sidora.display.CONSOLE_OUTPUT_BAD_USER_DATA_REDIRECT);
          window.location = Drupal.settings.basePath+"user";
        }
      },
      "error":function(){
         console.log(sidora.display.CONSOLE_OUTPUT_BAD_BASIC_USER_REDIRECT);
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
  jQuery("#page").before("<div id='remove-me' style='width:100%'><div style='margin:auto;width:400px;'>"+htmlEntities(sidora.display.VALIDATING_YOUR_USER_WAITING)+"</div></div>");
  setTimeout(function(){
    sidora.IsUserSetUp(
      function(){
        jQuery("#remove-me").remove(); 
        sidora.continueInit(); 
      }, function(){
        jQuery("#remove-me").remove();
        sidora.recreateUser(); 
      }
    );
  },5000);
}
sidora.recreateUser = function() {
  jQuery("#page").after('<div id="recreateUser" class="" style="max-width: 300px;margin: 0 auto;"><p>' + sidora.display.REQUIRE_FEDORA_USER_SETUP + '</p> <div style="margin: 0 20px;"><input id="setupnow" class="form-submit" value="Set Up Now"><p></p><input id="logout" class="form-submit" value="Log Out"></div></div>');
  jQuery("#setupnow").click(function(){
    var overlay = jQuery('<div class="full-screen-overlay"><div id="countdown" style="color:white;margin:30px auto;width:200px;">30' + sidora.display.SECONDS_ESTIMATED_REMAINING + '</div></div>');
    overlay.appendTo(document.body);
    jQuery("#countdown").countdown(function(){
      jQuery("#countdown").css("width","500px");
      jQuery("#countdown").html(sidora.display.REASSURE_WORKING_NOT_HUNG_DO_NOT_RELOAD);
      setTimeout(function(){window.location.reload();},5000);
    }, 30, sidora.display.SECONDS_ESTIMATED_REMAINING);

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
          console.log(sidora.display.CONSOLE_OUTPUT_BAD_BASIC_USER_REDIRECT);
        }
      }
    );
  });
  jQuery("#logout").click(function(){
    window.location = Drupal.settings.basePath+"user/logout";
  });
}
/*
 * Returns the sunburst image with "SIdora Workbench" as text in the div
 */
sidora.getSmithsonianBrandingHtml = function() {
    return '<div style="float: left;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAQnAAAEHUBqXFykQAACIxJREFUaIHtmXtQVOcZxn/ngLugXHcXsF5BRmNqQqox9R4rhopEx0qmTTux7Wg7TaeXMbbpJO1MG+2kjU10JunU2KaTVEtVpk40ponGONEGA4ggsIBoVIgI4SasuMjtYzmnf5yzl7PsInf/aN4ZZnfP+c57nud7n+993+8DvrAv7P/bpHsNwN+6hEvUdwmu3xFU3OrmWnsv7a4+bncJXKrKJFMoZlMIU8NCeSAy7N4ScLlcwtnbx7HaNrKr2zhZ1wZNd6CjB3pdoEogqYAM9EHCeWhcbPARei9AN3S6ePliE6H7i+GzVujp1W4qsgZYUjXwblOAyBa+m/ghWQ1LND4Aqjq+BA5Ut4jJ2eW0ON4DHFC7GlTVK2RZ8Q6WVOP32EoybYVkyYo3MpKXy5hZV68Qr1Y0Cv6cK576Wx5zpGe5ufK30D4DbWoHZ6m2YpZEAaGdBnJjFgGXS4is6tuE7y2EGw4A7p+3j7MpH/HvFqAtWRvoO9MD2GqrHdsEwFoODUs80RoTApdbO0TcoQpuldeDogMMa+WDlCMAFLbPHJpDSSXT4kCSIMVWTlnTIs+tUSfw/Pk6MfcvedDe7dEpQGLiCWaYNNEkmDqG5nRSI0lhgApplouUebLTKK4BR1ePmHzQLnYetsOdrn7SWBdXpn2R4AlbC5juDN65rYgJkvZshqUKJO/aGRUCeQ1OYXm9gMbiG0CfMQXqNsV8GUUCWYXkMFgxd3/AcQZTJVAlNsbbkfWhy6MBnwiOmMBbV1vE0jcKoN7pvRhgYbb3TgVA0YG8k3ISpuYM6h2plgJAIx8KYCv13BsRgdcuNost+wp99B48o+S0zfOAALDIUL/yFaxJx7QL+mwboiJJENLL2hgtFygSyBKstJV5xg6bwK7yRrH16AcghP6ygdNh7vV07rjwLGoF+JIJmle8yS9XPAMRDXqB8iGgqhBRS1IYHgmhwtdsxZ4hwyKw58pN8Wx2CYg+fv3oMxBdbZzBQNp2JrP5ymJtJlWNiDvDvjyrmqp1P4LEExpotw9JZXJ8kRes/lxadDOE9A6PQG59m/jpv4qhxwVdVo40L6QmYysPzXtLyw7BFqYic+TCr3ilzoqsg5F1SchAYhh0rtxD8pxD3igoMqm2UnAHV7+8IAIIbxo6gVpnp1iWVQJdPfoVmU8vb+LIrRCKFx7l7+kbIPaKdqufnlXoM/F8zl7eadMk5P7TxoNZgpLFB2HaGc8z62PL+4E0y4ClcugEpr9dCS0dPm2uAkhsy99NvYAtCdCY8QuWPPhXT4gNBCQVxEQ25v6BNsW7oMEbjUgZzj6yG0IEmDpYGu3NXL72eLx9aAR+cLZaUFkfuP9yzmJj+QZQIcEEnyx4n/1rMsFaiSf+7mjICtx8iB9fSwkITFFhaRTMnpMNUVVMM3ldeEyF1NhCkNTBEShqdoo3T37qBeCfcVSJootb+Eezd2FuioeWjOdI/cprILv0gbJGRFY4XP4zmkTwGXwu8TBzE0oCt8wSZFi7QHYNjsDCY5eg2xV8gKSlhx+e241D8aa82BA4lXKat9dmQlyplmHc1j6FXXWz+wVU1qv1Ezb4VkIBshog6CrMNAERNYTcDfwf7Q3iozPXdKBBBql6o9JjIRcHmydXIUtevF+eCNuSz1BhquVK80JQtR4yXzGzIynf6FcvWGYJZoc7iQ7Rb0vG14VK0GqqH8Se+E9nBM0dxt1SMFO1ypmdnsmTccZb7tx/6hakF+yApvkgu3A+lUnkQDpQCThxCnoqHgjP0znXBS3tukQGsfGQVOibwLfP7eR2nzH07ty/JhY617zAN7/6IoR2835rcHfu9iGQhNyRGjgCe7IE3Veg8ZG7g/ezjPm7+M+DOd4WwBcYGpkPnaAqGqnhWtAIbC/+XCyKOMS22QeCtwcD2HH7Vo4HKlg+L30sCtJGAN7XVz/bnl/DgqhadiRWQ1zJoPeugEbWZWb9ue209wGBtOrTRozEAj6f3+wU1DgQqkykBAWrfge2Eg2JfyTc0ZF7tV3WhA6tCssKND3M9y4tCyij0bKAe+IdxQ3QBzmOuSiSnYXh0Jb+Ai/WJPNG3aM42+/XFtKkatZaK/lGfA7zJ6LtW4Fr3XDmto29tem8W/ETTk3PJS16bAgEnpvdOYLGNjC3Urtxs1bOfdpfGT9NS2hZwe83ElzogJduLOXA3DxtX8voHkb185Xf3C646dSO+XrieLJyjQbMp/316FfyVl0C/FZUmD8RDt6Xh6S/bLRP0vr5O3DNAe5GUlXJq3iaHbVTtMZLj4BvC8wAJcJNJlTStRqoLRih9SOwr6rV2/rqhen3H+9hfcVybitGAIrfZ8AXSH6RG030BFoDL50WODq9sHyzTtQNliW9x6KYUmJCu7kv7BYpkTDLDKZ7dFBveG2ds1tM23naeDbvJhDse0gPxFSxeMrHbJ91nLQYH68qY5pC+xE49JlDfOf1T4buRZF1bSgw7TT7U15lk02/NMYEDJKsdHQOuWXQvOiLQ5WgdjXfP3GUBUWZ1PXe9ckRm4FAqaNreF480lLA3A7xRZjlHoqGeIY7HDNU4uZO4e15fPXu+9ttkqq1D5aLPGArY5XNTqrlKmnRMEnCcw461mYgcDPYtlGRwdQNETVMjytltc3O6tgy1logRoYQn0Xr1vx46B/8CHQKPXXKvRDejGQrZUN8BY9Zcvl6DMzU06V7d2UoYHqRGvP/WfmZsZmT+oid8V9+M/uf/HxqC2bf/sdnNn3bBe+z4w/eHwKTs4pFo/1zbTFO6ASbneVxdlKtJaTFNPJwBITLfo2cTxTculfGkYyBwJzsMnHlwvUgI/tgYiNYLvG4zc4q63nWxnaRFKYf9YGncI2nlAwElr1bKXJzrvodcUvGquz7Kbsg8gax1nJW2eystxayLhZspnFCD/wP7U9ib8jYfs0AAAAASUVORK5CYII=" height="20" width="20" style="padding-right: 10px;"><span style="font-size: 17px;font-weight: bold;font-family:Arial;color:#595959;text-decoration:none;"><span style="text-decoration: none; line-height: 20.5px;">SIdora Workbench</span></span></div>';
}
/**
 * Called to start loading the page, after something like a document ready
 */
sidora.InitiatePage = function(){
  jQuery("#page").hide();
  sidora.InitiateConfirmAccess();
  sidora.continueInit = function(){
    sidora.InitiateJSTree();
    sidora.RelocateTreeOnPage();
    sidora.ReformatPage();
    jQuery('#concept_tabs').tabs();
    jQuery("#page-title").after(jQuery("#workbench-menu"));
    jQuery("#concept-meta").prepend(jQuery("#concept-meta-menu"));
    sidora.ontology.CreateConceptMenu();
    sidora.ResizeOnWindowResize();
    jQuery(document).tooltip(
      /*{ position: { my: "left-7 bottom", at: "right center" } }*/
    );
    jQuery("h1").remove();
    // Next line is the starburst image
    jQuery("#branding").append(sidora.getSmithsonianBrandingHtml());
    jQuery("#branding").append("<div class='branding-user-info' style='float:right'> <a href='"+Drupal.settings.basePath+"user' class='sidora-thin-button'>Profile</a> <a href='"+Drupal.settings.basePath+"user/logout' class='sidora-thin-button'>Logout</a></div>");
    jQuery("#branding").append("<div class='branding-project-spaces' style='float:right'> <a id='proj-space-button' href='#' onclick='return false;' class='sidora-thin-button'>Research Spaces</a></div>");
    jQuery("#proj-space-button").click(sidora.ProjectSpaces.viewAll);
    // Add the close button to the top of the Shadowboxes, and remove the tooltip from them
    jQuery("#sb-nav-close").attr("title","").clone().addClass("sb-nav-close-clone").appendTo(jQuery("#sb-title"));
  }
  sidora.IsUserSetUp(sidora.continueInit, sidora.doubleCheckUser);
};
sidora.ProjectSpaces.isOwned = function() {
  return !jQuery("[pid='"+sidora.ProjectSpaces.currentPid()+"']").hasClass("not-owned");
}
sidora.ProjectSpaces.viewAll = function() {
  Shadowbox.close();
  setTimeout(function(){
  Shadowbox.open({
    content:    Drupal.settings.basePath+"sidora/research_spaces",
    player:     "iframe",
    title:      Drupal.t("Research Spaces"),
    options:  {
      onClose: function(){
        sidora.ProjectSpaces.refreshOptions();
      },
      onFinish:  function(){}
    }
  });},100);
}
sidora.ProjectSpaces.showCreate = function() {
  Shadowbox.close();
  setTimeout(function(){
  Shadowbox.open({
    content:    Drupal.settings.basePath+"sidora/research_space_create",
    player:     "iframe",
    title:      Drupal.t("Create Research Space"),
    options:  {
      onClose: function(){
        sidora.ProjectSpaces.refreshOptions();
      },
      onFinish:  function(){}
    }
  });},100);
}
/**
 * returns an array of pids that are currently shown in the table
 */
sidora.resources.getShownPids = function(){
  var shownResources = [];
  jQuery(sidora.resources.dataTable).find("tr").each(function(){
    if (this.id != "") shownResources.push(this.id);
  });
  return shownResources;
}
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
sidora.resources.refreshSelectedResourceThumbnail = function(){
 var pids = sidora.resources.getHighlighted();
 toRefreshPid = pids[0];
  var me = jQuery(jq(toRefreshPid));
  if (typeof(me.children("td").children("div").children("img").attr("src")) == 'string'){
      var imgChild = me.children("td").children("div").children("img");
      var pidThumbnail = Drupal.settings.basePath+"sidora/info/"+toRefreshPid+"/meta/TN/browser";
      jQuery.ajax(pidThumbnail,{
        complete:function(res){
         var currType = res.getResponseHeader("content-type");
         if ((currType.indexOf("image") != -1) || (currType.indexOf("jpg") != -1)){ // video and audio TN have a jpg mimetype
          me.children("td").children("div.resource-list-tn").children("img").remove();
	  me.children("td").children("div.resource-list-tn").append('<div id="gray_overlay" style="background-color:rgba(0,0,0,1);opacity:0.5;width:150px;height:90px;">');
          jQuery("#gray_overlay").append('<div id="sb-loading"><div id="sb-loading-inner"><span>&nbsp;</span></div></div>');
	  setTimeout(function(){
           me.children("td").children("div.resource-list-tn").append('<img style="max-height:90px;max-width:150px;display:none;">');
	   me.children("td").children("div.resource-list-tn").children("img").load(function(){jQuery("#gray_overlay").remove();me.children("td").children("div.resource-list-tn").children("img").css("display","");}).attr("src",pidThumbnail+"?random="+new Date().getTime());
	  },15000);
	 }
        }
      });
  }
}
sidora.resources.performBulkActions = function(){
  var action = jQuery("#sidora-resource-bulk-actions").val();
  var pids = sidora.resources.getHighlighted();
  if (pids.length == 0) {
    return;
  }
  if (action == 'duplicate') {
    sidora.ProjectSpaces.DuplicateOrTransfer('duplicate', 'resources', pids, Drupal.t("Bulk Copy Resources"));
  }
  if (action == 'move') {
    sidora.ProjectSpaces.DuplicateOrTransfer('transfer', 'resources', pids, Drupal.t("Bulk Move Resources"));
  }
  if (action == 'delete') {
    sidora.resources.DeleteResource(pids);
  }
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
sidora.resources.openInNewWindow = function(downloadPids){
  var pids = sidora.resources.getHighlighted();
  if (typeof(downloadPids) == 'string') {
    pids = [downloadPids]; 
  }
  if (typeof(downloadPids) == 'object') {
    pids = downloadPids;
  }
  for(var i = 0; i < pids.length; i++){
   window.open(sidora.resources.createViewerUrl(pids[i]));
  }
}
sidora.performTransfer = function(toLocationPid, pids) {
  var droppedOn = toLocationPid;
  var action = "duplicate";
  for(var i=0;i<pids.length;i++){
    droppedPid = pids[i];
    var userFriendlyName = sidora.display.UNKNOWN_ACTION;
    var pidList = null;
    var onSuccess = function() {
    }
    pidListForRequest = [droppedOn,droppedPid];
    userFriendlyName = Drupal.t('Copying');
    queueAction = 'duplication';
    userFriendlyName += " <em>"+sidora.util.FriendlyNameDirect(droppedPid)+"</em>";
    userFriendlyName += sidora.display.TO + " <em>"+sidora.util.FriendlyNameDirect(droppedOn)+"</em>";
    var requestUrl = Drupal.settings.basePath+'sidora/ajax_parts/'+action+'/'+droppedOn+'/'+droppedPid;
    sidora.queue.Request(userFriendlyName, requestUrl, onSuccess, null, pidListForRequest,queueAction,i+' of '+pids.length);
    console.log(userFriendlyName);
  }
  sidora.queue.Next();
}
sidora.performDuplicate = function(toLocationPid, pids, onSuccess) {
  var droppedOn = toLocationPid;
  var action = "duplicate";
  for(var i=0;i<pids.length;i++){
    droppedPid = pids[i];
    var userFriendlyName = sidora.display.UNKNOWN_ACTION;
    var pidList = null;
    if (onSuccess == undefined) {
      onSuccess = function() {};
    }
    pidListForRequest = [droppedOn,droppedPid];
    userFriendlyName = Drupal.t('Copying');
    queueAction = 'duplication';
    userFriendlyName += " <em>"+sidora.util.FriendlyNameDirect(droppedPid)+"</em>";
    userFriendlyName += sidora.display.TO + " <em>"+sidora.util.FriendlyNameDirect(droppedOn)+"</em>";
    var requestUrl = Drupal.settings.basePath+'sidora/ajax_parts/'+action+'/'+droppedOn+'/'+droppedPid;
    sidora.queue.Request(userFriendlyName, requestUrl, onSuccess, null, pidListForRequest,queueAction,i+' of '+pids.length);
    console.log(userFriendlyName);
  }
  sidora.queue.Next();
}

/*
 * Direct download of the resource.  ASSUMES OBJ AS DSID
 */
sidora.resources.download = function(downloadPids){
  var pids = sidora.resources.getHighlighted();
  if (typeof(downloadPids) == 'string') {
    pids = [downloadPids]; 
  }
  if (typeof(downloadPids) == 'object') {
    pids = downloadPids;
  }
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
  var jst = jQuery("#forjstree").jstree();
  var droppedOn = jst.get_node(toLocationId).a_attr.pid;
  var droppingThese = pids.join(",");
  //do nothing if move/copy to existing place
  if (droppedOn == fromParent) {
    console.log(sidora.display.CONSOLE_OUTPUT_DROPPED_ON_EXISTING_PARENT);
    return;
  }
  //by default this is a move
  var action = 'move/'+fromParent;
  if (copyOrMove == 'copy'){ action = 'copy'; }
  console.log("FCR "+action+" pids:"+pids.join(",")+" dropped on:"+droppedOn);
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
  var onSuccess = function(){};
  if (action != 'copy') {
    onSuccess = onSuccessfulMove;
  }
  else {
    onSuccess = onSuccessfulCopy;
  }
  sidora.resources.performCopyOrMoveFedoraActions(action, fromParent, droppedOn, pids, onSuccess);
}
sidora.resources.performCopyOrMoveFedoraActions = function(action, fromParent, droppedOn, pids, onSuccess) {
  for(var i=0;i<pids.length;i++){
    droppedPid = pids[i];
    var userFriendlyName = sidora.display.UNKNOWN_ACTION;
    var pidList = null;
    var onSuccess = null;
    if (action != 'copy'){
      pidListForRequest = [fromParent,droppedOn,droppedPid];
      jQuery(jq(pids[i])).addClass("is-being-moved");
      userFriendlyName = sidora.display.MOVING;
      queueAction = 'moveResource';
    }else{
      pidListForRequest = [droppedOn,droppedPid];
      userFriendlyName = sidora.display.COPYING;
      queueAction = 'copyResource';
    }
    userFriendlyName += " <em>"+sidora.util.FriendlyNameDirect(droppedPid)+"</em>";
    userFriendlyName += sidora.display.FROM + " <em>"+sidora.util.FriendlyNameDirect(fromParent)+"</em>";
    userFriendlyName += sidora.display.TO + " <em>"+sidora.util.FriendlyNameDirect(droppedOn)+"</em>";
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
      console.log(sidora.display.CONSOLE_OUTPUT_ERROR_ON_CREATE_MENU); //OCIO message will also end up here since not json
    },
    success: function (json_obj){
      window.sidora.ontology.tree = json_obj;
      resetMenu("concept-menu");
    }
  });
};
/*
 *  Got tired of CSS fiddling, resizing the main div programmatically based on assumed navigation size
 */
sidora.ResizeOnWindowResize = function(){
  var spaceOnRight = jQuery(window).width() - jQuery("html").width() - jQuery("#conceptResizable").width();
  // Set our minimum size of the concept information to be 1000 pixels
  var setWidthTo = Math.max(jQuery("html").width() - jQuery("#conceptResizable").width(), 900);
  jQuery("#sidora_content_concept_info").width(setWidthTo);
  jQuery("#res_table").css("width","100%");
  jQuery("#conceptResizable").height(jQuery(window).height() - 110);
  jQuery("#concept_tabs").height(jQuery(window).height() - 180);
  jQuery("#concept-meta").height(jQuery(window).height() - 270);
  jQuery("#rt").height(jQuery(window).height() - 370);
  jQuery("#concept-resource-list").height(jQuery(window).height() - 250);
  jQuery("#concept-meta div.metadata-table").height(jQuery(window).height() - 270);
}

sidora.concept.CopyNode = function(data) {
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
  if (typeof(moveToPid) == 'undefined') {
    moveToPid = data.moveToPid;
  }
  var jst = jQuery("#forjstree").jstree(true);
  var newParentExistingChildConceptsNumber = parseInt(jQuery("#"+data.parent).children("a").attr("conceptchildren"));
  var npReplacer = newParentExistingChildConceptsNumber+1;
  jQuery("#"+data.parent).children("a").attr("conceptchildren",""+npReplacer);
  jst.get_node(data.parent).a_attr.conceptchildren = ""+npReplacer;
  sidora.queue.incomingRequestsAreSilent = true;
  sidora.queue.Request(
    htmlEntities(sidora.display.CREATE_LINK_TO_CONCEPT),
    actionUrl,
    function(){
      sidora.concept.LoadContentHelp.Relationships();
      try{
        var ajaxReturn = JSON.parse(arguments[0]);
        if (!ajaxReturn.error){
          sidora.util.conceptLinkCreated(toMovePid, moveToPid);
        }
      }catch(exc){
        console.log(exc);
      }
    }, 
    sidora.util.createFunctionRefreshTree(moveToPid)
    , [moveToPid,toMovePid],'copyConcept'
  );
  sidora.queue.incomingRequestsAreSilent = false;
  sidora.queue.Next();
}
/**
 * Performs a the necessary changes to the data in the tree and Fedora after a tree node move has occurred (or should occur)
 * data.node = node that is moving
 * data.parent = ID of the node that it is being moved to
 * data.old_parent = ID of the node that it used to be on
 */
sidora.concept.MoveNode = function(data) {
  var jst = jQuery("#forjstree").jstree();
  var toMovePid = data.node.a_attr.pid;
  var moveToPid = jQuery("#"+data.parent+" a").attr('pid');
  if (typeof(moveToPid) == 'undefined') {
    moveToPid = data.moveToPid;
  }
  var moveFromPid = jQuery("#"+data.old_parent+" a").attr('pid');
  if (typeof(moveFromPid) == 'undefined') {
    moveFromPid = data.moveFromPid;
  }
  console.log("Move:"+toMovePid+" from:"+moveFromPid+" to:"+moveToPid);
  if (moveFromPid == moveToPid){ console.log('move to itself, ignoring...'); return; }
  var actionUrl = Drupal.settings.basePath+'sidora/ajax_parts/move/'+moveFromPid+'/'+moveToPid+'/'+toMovePid;

  if ( jQuery("#"+data.parent+" a").length > 0) {
    //New Parent renumber
    var newParentExistingChildConceptsNumber = parseInt(jQuery("#"+data.parent).children("a").attr("conceptchildren"));
    var npReplacer = newParentExistingChildConceptsNumber+1;
    jQuery("#"+data.parent).children("a").attr("conceptchildren",""+npReplacer);
    jst.get_node(data.parent).a_attr.conceptchildren = ""+npReplacer;
  }
  if ( jQuery("#"+data.old_parent+" a").length > 0) {
    //Old Parent renumber
    var oldParentExistingChildConceptsNumber = parseInt(jQuery("#"+data.old_parent).children("a").attr("conceptchildren"));
    var opReplacer = oldParentExistingChildConceptsNumber-1;
    jQuery("#"+data.old_parent).children("a").attr("conceptchildren",""+opReplacer);
    jst.get_node(data.old_parent).a_attr.conceptchildren = ""+opReplacer;
  }
  //next requests are silent
  sidora.queue.incomingRequestsAreSilent = true;
  var cfrt = sidora.util.createFunctionRefreshTree([moveToPid,moveFromPid]);
  sidora.queue.Request(
    'Concept move',
    actionUrl, 
    function(){
      sidora.concept.LoadContentHelp.Relationships();
      try{
        var ajaxReturn = JSON.parse(arguments[0]);
        if (!ajaxReturn.error){
          sidora.util.conceptMovedTreeChange(toMovePid, moveFromPid, moveToPid);
        }
      }catch(exc){
        console.log(exc);
      }
    },
    cfrt,
    [moveToPid,toMovePid,moveFromPid],
    'moveConcept'
  );
  sidora.queue.incomingRequestsAreSilent = false;
  sidora.queue.Next();
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
sidora.CloseIFrame = function(info, typeOfClosure){
  //if it's the shadowbox, close it
  Shadowbox.close();
  if (typeOfClosure == 'simple close'){
    return;
  }
  if (typeOfClosure == 'concept create'){
    return;
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
      if (typeof(parentPid) == 'undefined') {
        sidora.util.RefreshTree(null, node.a_attr.pid);
      }
      else {
        sidora.util.RefreshTree(null, parentPid);
      }
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
    setTimeout(sidora.util.constantCheck, 60000);
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
sidora.util.createFunctionRefreshTree = function(pids, secondsOfWait) {
  if (typeof(pids) == "string") pids = [pids];
  if (typeof(secondsOfWait) != 'number') secondsOfWait = 5;
  return function() {
    setTimeout(function(){
      pids.forEach(function(pid,index,arr){
        sidora.util.RefreshTree(null,pid);
      });
    },secondsOfWait * 1000);
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
sidora.util.treeAdditionSingleItem = function(onLoadComplete, overwriteType, jst, documentFragment, currChild){
  var ccp = currChild.a_attr.pid;
  var dfAnchor = jQuery(documentFragment).children().find("[pid='"+ccp+"']");
  return sidora.util.treeAdditionSingleItemPassAnchors(onLoadComplete, overwriteType, jst, documentFragment, currChild, ccp, dfAnchor);
}
sidora.util.treeAdditionSingleItemPassAnchors = function(onLoadComplete, overwriteType, jst, documentFragment, currChild, ccp, dfAnchor){
  //If the document fragment does not include the child then that concept was removed
  if (dfAnchor.length > 0) {
    //Find the current child representation in the document fragment
    var currRep = dfAnchor.parent();
    //Replace the html if the name of the item changed
    var dfAnchorText = jQuery(dfAnchor[0]).html();
    if (currChild.text != dfAnchorText) {
      jst.rename_node(currChild, dfAnchorText);
    }
    var a_attr_obj = {};
    jQuery(jQuery(currRep).children("a").first()[0].attributes).each(
      function() {
        // jstree puts in its own classes and we dont want to overwrite those for now
        if (this.nodeName != 'class') {
          if (this.nodeName != 'is-link' && this.nodeName != 'last-parent') {
            a_attr_obj[this.nodeName] = this.nodeValue;
          }
        }
      }
    );   
    a_attr_obj["href"] = currChild.a_attr.href;
    jQuery.each(a_attr_obj,function(nodeName,nodeValue){
      jQuery("[pid='" + ccp + "']").attr(nodeName,nodeValue);
      jst.get_node(currChild).a_attr[nodeName] = nodeValue;
    });
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
        // skip copying the last parent and whether it's a link
        jQuery(jQuery(currRepChild).children("a").first()[0].attributes).each(function() {
            a_attr_obj[this.nodeName] = this.nodeValue;
        });
        //The information coming back from the ajax call will not have the path through the tree
        //and since the concept listed can be in multiple places, the path to the concepts
        //must pull information from the existing tree for the current path we've used
        var prependHrefPath = "?path=" + currChild.a_attr.href.split("?path=")[1] + ',';
        var currRepHrefPathParts = jQuery(currRepChild).children("a").attr("href").split("?path=");
        newHrefPath = currRepHrefPathParts[0] + prependHrefPath + ccp;
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
    //Update the current node of the main pid
    sidora.util.treeAdditionSingleItem(onLoadComplete, overwriteType, jst, documentFragment, mainItem);
    var miChildrenIds = mainItem.children;
    //Go through the children
    for (var micIndex = 0; micIndex < miChildrenIds.length; micIndex++) {
      var currChild = jst.get_node(miChildrenIds[micIndex]);
      setTimeout(
        sidora.util.treeAdditionSingleItem.bind(null, onLoadComplete, overwriteType, jst, documentFragment, currChild ),
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
sidora.util.loadTreeSection = function(openingPid, onLoadComplete, overwriteType, doFast) {
  if (typeof(openingPid) == 'undefined') {
    console.log("No opening pid for loadTreeSection");
  }
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
  var url = Drupal.settings.basePath+"sidora/ajax_parts/tree/"+openingPid+"/2";
  if (doFast) {
    url += "?doFast=true";
  }
  var jst = jQuery("#forjstree").jstree(true);
  jQuery.ajax({
    "dataType":"html",
    "method":"GET",
    "url": url,
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
        console.log(sidora.display.CONSOLE_OUTPUT_REMOVE_BAD_OBJECT+currInvalidPid);
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
    if (typeof(jst.get_node(toUpdateId).a_attr) !== 'undefined') {
      var existingChildResourceNumber = parseInt(jst.get_node(toUpdateId).a_attr.resourcechildren);
      var parentName = jQuery("#"+toUpdateId+" a").attr("fullname");
      var newFullName =  parentName + " (" + number_of_children + ")";
      if (number_of_children == 0) newFullName = parentName;
      var thumbnail = jst.get_node(toUpdateId).a_attr.thumbnail;
      if (typeof(thumbnail) != 'undefined') {
        newFullName = '<div><img src="' + thumbnail + '"/></div>' + newFullName;
      }
      jst.rename_node("#"+toUpdateId, newFullName);
      jst.get_node(toUpdateId).a_attr.resourcechildren = ""+number_of_children;
    }
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
    if (typeof(parentNode.a_attr) != 'undefined') {
      var parentPid = parentNode.a_attr.pid;
      if (typeof(parentPid) == 'undefined') {
        parentPid = node.a_attr.pid;
      }
      setTimeout(function(myPid){
        jQuery.ajax({
          url: Drupal.settings.basePath+'sidora/ajax_parts/tree/'+myPid+"/2",
        }).done(function(tree_html){
          var suggestedAction = sidora.util.RefreshTreeSuggestAction(tree_html, true);
          if (suggestedAction.suggestRedirect) { window.location = Drupal.settings.basePath+'user';  }
          if (suggestedAction.suggestRetry){
            sidora.util.refreshTreeFailuresInARow++;
            if (sidora.util.refreshTreeFailuresInARow > 10) {
              console.log(sidora.display.CONSOLE_OUTPUT_TOO_MANY_TREE_FAILURES_SO_QUITTING);
              return;
            } else {
              console.log("Initiated retry:"+sidora.util.refreshTreeFailuresInARow);
              sidora.util.RefreshTreeHelper(3, myPid, onlyRefreshIfNew);
              return;
            }
          }
          if (suggestedAction.suggestIgnore) { return; }
          if (!suggestedAction.valid) { console.log("Unknown tree issue. Error code:surt1"); return; }
          sidora.util.treeAddition(tree_html);//, null, "changes");
          sidora.util.refreshTreeFailuresInARow = 0;
        }).fail(function(failure_obj){
          sidora.recentAjaxFailure(failure_obj);
        }).always(function(){
        });
      },secondsOfWait*1000,parentPid);
    }
  }); //ends nodeIds.forEach
}
/*
 * These two are the functions that get called in practice
 */
sidora.util.RefreshTreeIfNew = function(secondsOfWait, pid){
  sidora.util.RefreshTreeHelper(secondsOfWait, pid, true);
}
sidora.util.RefreshTree      = function(secondsOfWait, pid){
  sidora.util.RefreshTreeHelper(secondsOfWait, pid, false);
}

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
    "description": sidora.display.TREE_ISSUE_NEVER_CHECKED,
    "suggestRedirect":false,
    "suggestRetry":false,
    "suggestIgnore":true
  };
  var failures = 0;
  if (tree_html == '') {
    toReturn.description = sidora.display.TREE_ISSUE_NO_TREE_EXIST;
    toReturn.suggestRetry = false;
    toReturn.suggestRedirect = true;
    toReturn.suggestIgnore = false;
    failures++;
  }
  if (typeof(tree_html) != "string"){
    tree_html = ""
    toReturn.description = sidora.display.TREE_ISSUE_IS_NOT_STRING;
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
    toReturn.description = sidora.display.TREE_ISSUE_OCIO_INTERCEPT; 
    toReturn.suggestRetry = true;
    toReturn.suggestRedirect = false;
    toReturn.suggestIgnore = false;
    failures++;
  }
  if (tree_html_lowercase.indexOf("<ul>") == -1 || tree_html_lowercase.indexOf("<li>") == -1){
    toReturn.description = sidora.display.TREE_ISSUE_BAD_FORMAT; 
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
/**
 * Pulls the current project spaces from the backend and adds new ones
 * Does not remove any that the user lost permissions to view
 * Assumes any new project spaces it got are empty:
 *   used for refreshing the options when a new one is created
 * Not everything that is needed when an established project space
 * permissions are updated to include the current user
 *
 * Nodes need to talk with Fedora to be updated, give them X seconds
 * to get settled and resaved to the DB
 */
sidora.ProjectSpaces.refreshOptions = function(waitSecondsBeforeCall){
  // if the value of the dropdown does not match what's shown right now, fix it
  var shownId = jQuery("#forjstree ul li ul li:visible").attr('id');
  var selectedId = jQuery("#psdd-select").val();
  if (shownId != selectedId) {
    jQuery("#psdd-select").change();
  }

  if (typeof(waitSecondsBeforeCall) != 'number') {
    waitSecondsBeforeCall = 5;
  }
  setTimeout(function(){
    sidora.ProjectSpaces.refreshOptionsImmediate(3);
  }, waitSecondsBeforeCall * 1000)
}
sidora.ProjectSpaces.refreshOptionsImmediate = function(refreshesUntilGiveUp){
  jQuery.ajax({
    url: Drupal.settings.basePath+'sidora/ajax_parts/research_spaces_tree/1',
  }).done(function(returnedHtml){
    var jst = jQuery("#forjstree").jstree();
    var mainNode = jst.get_node("j1_1");
    var psPids = [];
    mainNode.children.forEach(function(elem){
      psPids.push(jst.get_node(elem).a_attr.pid)}
    );
    var df = jQuery(returnedHtml);
    var psaList = jQuery(df).children("li").children("ul").children("li").children("a");
    var missingElems = [];
    psaList.each(function(index,elem){
      var elemPid = elem.attributes['pid'].value;
      if (psPids.indexOf(elemPid) == -1) {
        missingElems.push(elem);
      }
    });
    var changeMade = false;
    for (var ei = 0; ei < missingElems.length; ei++){
      var elem = missingElems[ei];
      var elemAttr = [];
      jQuery.each(elem.attributes, function(ai, attr){
        if (attr.specified){
          elemAttr[attr.name] = attr.value;
        }
      });
      // elemAttr now contains the information to give to jstree for this item
      var newDomId = jst.create_node('j1_1' ,  { "text" : elem.innerHTML,"a_attr": elemAttr}, "last", function(){  console.log("done:"+elem.innerHTML); });
      jQuery("option[value='sep1']").before("<option value='"+newDomId+"'>"+elem.innerHTML+"</option>");
      jQuery("#psdd-select").val(newDomId);
      sidora.ProjectSpaces.ChangeProjectSpace(jQuery("#psdd-select").val(), true);
      jQuery("#" + newDomId + " > a").click();
      changeMade = true;
    };
    if (!changeMade && refreshesUntilGiveUp > 0) {
      setTimeout(function(){
        sidora.ProjectSpaces.refreshOptionsImmediate(refreshesUntilGiveUp-1);
      }, 1000);
    }
  });
}
/*
 * Opens the Manage panel
 */
sidora.concept.Manage = function(){
  var conceptPid = this.GetPid();
  var conceptName = this.GetName();
  sidora.manage.Open(conceptPid, conceptName, sidora.display.MANAGE_CONCEPT_TITLE, sidora.display.UPDATE_CONCEPT_INFORMATION);
}
/*
 * Generic confirming something from user.
 */
sidora.util.isConfirmShowing = function(){return jQuery("#userConfirm").is(":visible");}
sidora.util.Confirm = function(title, questionText, onConfirmation, onCancel, confirmButtonText, cancelButtonText, onAnyClose){
  if (typeof(onConfirmation) != 'function') onConfirmation = function(){};
  if (typeof(onCancel) != 'function') onCancel = function(){};
  if (typeof(onAnyClose) != 'function') onAnyClose = function(){};
  if (typeof(confirmButtonText) != 'string') confirmButtonText = sidora.display.BUTTON_HTML_CONFIRM;
  if (typeof(cancelButtonText) != 'string') cancelButtonText = sidora.display.BUTTON_HTML_CANCEL;
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
sidora.concept.DeleteConceptByTreeId = function(treeId) {
  var rc = parseInt(jQuery("#" + treeId + " a").attr("resourcechildren"));
  var cc = parseInt(jQuery("#" + treeId + " a").attr("conceptchildren"));
  var pid = (jQuery("#" + treeId + " a").attr("pid"));
  var name = (jQuery("#" + treeId + " a").attr("fullname"));
  return sidora.concept.DeleteConceptSpecified(name, pid, cc, rc);
}
sidora.concept.DeleteConcept = function(){
  return sidora.concept.DeleteConceptSpecified(sidora.concept.GetName(), sidora.concept.GetPid(), sidora.concept.GetConceptChildrenLength(), sidora.concept.GetResourceChildrenLength());
}
sidora.concept.DeleteConceptSpecified = function(name, pid, conceptChildrenLen, resourceChildrenLen) {
  jQuery('#deleteConceptDialog').remove();
  if ((conceptChildrenLen == null) || (resourceChildrenLen == null)) {
    jQuery("body").append("<div id='deleteConceptDialog' style='display:none;' title='"+htmlEntities(sidora.display.DELETE_CONCEPT_TITLE)+"'><p>Error getting the child concepts or resources for this concept. Cannot delete this concept</p><p>"+name+" ("+pid+")</p></div>");
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
  if (conceptChildrenLen + resourceChildrenLen > 0){
    jQuery("body").append("<div id='deleteConceptDialog' style='display:none;' title='"+htmlEntities(sidora.display.DELETE_CONCEPT_TITLE)+"'><p>This concept has "+conceptChildrenLen+" concept(s) and has "+resourceChildrenLen+" resource(s) as children. It cannot be deleted while it has children.</p><p>"+name+" ("+pid+")</p></div>");
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
  jQuery("body").append("<div id='deleteConceptDialog' style='display:none;' title='"+htmlEntities(sidora.display.DELETE_CONCEPT_TITLE)+"'><p>Are you sure you want to delete this concept?</p><p>"+name+" ("+pid+")</p></div>");
  jQuery("#deleteConceptDialog").dialog({
    resizable: false,
    height:205,
    width: 400,
    modal: true,
    buttons: {
      "Delete concept": function() {
        var toClose = this;
        var onDeleteWorked = sidora.util.createFunctionRefreshTree(pid);
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
        sidora.util.deletePid(pid, onDeleteWorked, onDeleteFailed, 'deleteConcept');
        jQuery( toClose ).dialog( "close" );
      },
      Cancel: function() {
        jQuery( this ).dialog( "close" );
      }
    }
  });
}
sidora.resources.UserFriendlyListing = function(pids) {
  var userFriendlyListing = '<ul>';
  for (var i = 0; i < pids.length; i++){
    userFriendlyListing += '<li>';
    userFriendlyListing += jQuery(jq(pids[i])).find(".resource-list-label").html() + " (";
    userFriendlyListing += pids[i] + ")";
    userFriendlyListing += '</li>';
  }
  userFriendlyListing += '</ul>';
  return userFriendlyListing;
}
/*
 * Confirm with the user that they want the resource unassociated / deleted and performs the unassociate/delete
 */
sidora.resources.DeleteResource = function(pid){
  var allPids = sidora.resources.getHighlighted();
  if (typeof(pid) == 'string') {
    allPids = [pid];
  }
  if (typeof(pid) == 'object') {
    allPids = pid;
  }
  var sendOutPids = [];
  var removeLinksPids = [];
  var deletePids = [];
  var cantRemoveLinksPids = [];
  for (var i = 0; i < allPids.length; i++) {
    var pid = allPids[i];
    var infoHolder = jQuery(jq(pid)).find(".sidora-info-holder");
    var administeredBy = infoHolder.attr("administered-by-pid");
    var numLinks = infoHolder.attr("num-links");
    if (numLinks == "1") {
      deletePids.push(pid); 
      sendOutPids.push(pid);
    }
    else {
      if (administeredBy == sidora.concept.GetPid()) {
        cantRemoveLinksPids.push(pid);
      }
      else {
        removeLinksPids.push(pid);
        sendOutPids.push(pid);
      }
    }
  }

  jQuery('#deleteResourceDialog').remove();
  var informationText = "";
  var removeFromParentTextBlock = "";
  if (cantRemoveLinksPids.length > 0) {
    removeFromParentTextBlock += "The following will <strong>not</strong> be removed:";
    removeFromParentTextBlock += sidora.resources.UserFriendlyListing(cantRemoveLinksPids);
    removeFromParentTextBlock += "To remove the correlation between a resource above and this concept, please do one of the following:<br>";
    removeFromParentTextBlock += " 1) move the resource to another location<br>";
    removeFromParentTextBlock += " or<br>";
    removeFromParentTextBlock += " 2) remove all other links to the resource and then you may delete it from this concept.<br><br>";
  }
  if (cantRemoveLinksPids.length == allPids.length) {
    informationText += "<strong>Your selection can not be removed. </strong>You've selected only resources that are administered by the current concept that are linked to other concepts. Check the resource's 'Relationships' pane to see these links.<br>";
    informationText += removeFromParentTextBlock;
  }
  else {
    if (cantRemoveLinksPids.length > 0) {
      informationText += "<strong>Not all of your selections can be removed. </strong> Some of the selected resources are administered by the current concept and are linked to other concepts. Check the resource's 'Relationships' pane to see these links.";
      informationText += removeFromParentTextBlock;
    }
    if (removeLinksPids.length > 0) {
      informationText += "<strong>The following links will be removed from this concept:</strong>";
      informationText += sidora.resources.UserFriendlyListing(removeLinksPids);
    }
    if (deletePids.length > 0) {
      informationText += "<strong>The following will be deleted:</strong>";
      informationText += sidora.resources.UserFriendlyListing(deletePids);
    }
  }
  jQuery("body").append("<div id='deleteResourceDialog' style='display:none;' title='Remove Resource'>"+informationText+"</div>");

/*<p>The following will be removed from "+sidora.concept.GetName()+" ("+sidora.concept.GetPid()+")</p>"+userFriendlyListing+"<p>If there are no other parents for a resource, the resource will also be deleted.</div>");
 */
  jQuery("#deleteResourceDialog").dialog({
    resizable: false,
    height:445,
    width: 400,
    modal: true,
    buttons: {
      "Delete resource": function() {
        var onDeleteWorked = sidora.util.createFunctionRefreshTree(sidora.concept.GetPid());
        var onDeleteFailed = function(data){};
        sidora.resources.DeleteResourceBusinessLogic(sendOutPids, onDeleteWorked, onDeleteFailed);
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
}
sidora.resources.shownResourcesQueryParams = function(){
  return ((sidora_util.readCookie('Drupal.dtFilter') == '')?'all':sidora_util.readCookie('Drupal.dtFilter')) + '\n' + jQuery("#titleFilter").val() + '\n' + ((sidora_util.readCookie('Drupal.sortOn') == '')?'':sidora_util.readCookie('Drupal.sortOn')) + '\n' + ((sidora_util.readCookie('Drupal.sortOrder') == '')?'':sidora_util.readCookie('Drupal.sortOrder'));
}
sidora.resources.ShowDetails = function(showPid){
  Shadowbox.open({
    content:    Drupal.settings.basePath+"sidora/ajax_parts/details/"+showPid+"?resq="+encodeURI(sidora.resources.shownResourcesQueryParams()+"&ppid="+sidora.concept.GetPid()),
    player:     "iframe",
    title:      "Resource Metadata",
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
}
sidora.resources.EditDetails = function(editPids){
  var pids_array = sidora.resources.getHighlighted();
  if (typeof(editPids) == 'string') {
    pids_array = [editPids]; 
  }
  if (typeof(editPids) == 'object') {
    pids_array = editPids;
  }
  pids = pids_array.join("&");
  Shadowbox.open({
    content:    Drupal.settings.basePath+"sidora/edit_metadata/"+pids+"",
    player:     "iframe",
    title:      "Resource Metadata",
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
}
sidora.resources.UpdateContent = function(resourcePid){
  jQuery("body").append("<div id='addDatastreamDialog' style='display:none;' title='Update Content'><iframe height='1000%' width='100%' style='height:100%;width:100%' src='"+Drupal.settings.basePath+"sidora/manage/"+resourcePid+"/upload_content' frameborder='0' marginwidth='0' marginheight='0' allowfullscreen></iframe></div>");
  jQuery("#addDatastreamDialog").dialog({
     resizable: true,
     height:600,
     width: 600,
     modal: true,
  });
  jQuery("#addDatastreamDialog").css("overflow", "hidden");
}
sidora.resources.Vestigial = function(){ // BBB TODO REMOVE TBD
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
sidora.resources.DeleteResourceBusinessLogic = function(pids, onSuccess, onFailure){
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
sidora.util.deletePid = function(pidOfInterest, onSuccess, onFailure, action){
  action = typeof action !== 'undefined' ? action : '';
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
  setTimeout(function(){
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
  },1000);
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
sidora.util.conceptLinkCreated = function(linkedPid, newParentPid) {
  // Straight copy the node over, fix href on it and children, remove grandchildren, close it
  var jst = jQuery("#forjstree").jstree();
  jst.pureUIChange = true;
  var exampleNode = sidora.util.GetTreeNodesByPid(linkedPid);
  var toCopyNode = exampleNode[0];
  var newParents = sidora.util.GetTreeNodesByPid(newParentPid);

  for (var npi = 0; npi < newParents.length; npi++) {
    var newParentId = newParents[npi];
    var newParent = jst.get_node(newParentId);
    // if the node already exists on the tree here, remove it so we can constsruct one with the proper
    // updated attributes
    if (jQuery("#"+newParent.id+" ul li a[pid='"+toCopyNode.a_attr.pid+"']").length > 0){
      jst.delete_node(jQuery("#"+newParent.id+" ul li a[pid='"+toCopyNode.a_attr.pid+"']").parent().attr('id'));
    }
    jst.copy_node(toCopyNode, newParent, "last", function(newNode, newParent, position){
      var destinationUrl = sidora.util.constructChildUrl(newParent.a_attr.href, linkedPid);
      newNode.a_attr.href = destinationUrl;
      newNode.a_attr['is-link'] = 'TRUE';
      newNode.a_attr['last-parent'] = newParent.a_attr.pid;
      // remove any children so we have full control over the future content
      for (var ci = 0; ci < newNode.children.length; ci++){
        jst.remove_node(jst.get_node(newNode.children[ci]));
      }
      for (var ci = 0; typeof(toCopyNode.children) != 'undefined' && ci < toCopyNode.children.length; ci++){
        var childNode = jst.get_node(toCopyNode.children[ci]);
        var destinationUrl = sidora.util.constructChildUrl(newNode.a_attr.href, linkedPid);
        jst.copy_node(childNode, newNode, "last", function(newChild, myCopyParent, position){
          var destinationUrl = sidora.util.constructChildUrl(myCopyParent.a_attr.href, newChild.a_attr.pid);
          newChild.a_attr.href = destinationUrl;
        });
        jst.close_node(newNode);
      }
      setTimeout(function(){
        jst.redraw(true);
      },3000);
    });
  }
  jst.pureUIChange = false;
  jst.redraw(true);
}
sidora.util.conceptMovedTreeChange = function(movedPid, oldParentPid, newParentPid){
  // Find one of the nodes, move it to one of the new parents
  // delete the nodes of all the other parents
  // copy the node and its children to the other new parents
  var jst = jQuery("#forjstree").jstree();
  var movedNodes = sidora.util.GetTreeNodesByPid(movedPid);
  var newParents = sidora.util.GetTreeNodesByPid(newParentPid);
  jst.pureUIChange = true;
  var movedNode = movedNodes[0];
  jst.move_node(movedNode, newParents[0], "last", function(newNode, newParent, position){
    for (var ci = 0; ci < movedNode.children.length; ci++){
      var childNode = jst.get_node(movedNode.children[ci]);
      var destinationUrl = sidora.util.constructChildUrl(movedNode.a_attr.href, childNode.a_attr.pid);
      childNode.a_attr.href = destinationUrl;
      // Remove the grandchildren, to be reloaded when the node is opened
      for (var gci = 0; gci < childNode.children.length; gci++) {
        jst.delete_node(jst.get_node(childNode.children[gci]));
      }
    }
  });
  // replace the href on the moved node
  destinationUrl = sidora.util.constructChildUrl(newParents[0].a_attr.href, movedPid);
  movedNode.a_attr.href = destinationUrl; 

  sidora.util.conceptRemovedTreeChange(oldParentPid, movedPid);

  for (var npi = 1; npi < newParents.length; npi++) {
    var newParentId = newParents[npi];
    var newParent = jst.get_node(newParentId);
    jst.copy_node(movedNode, newParent, "last", function(newNode, newParent, position){
      var destinationUrl = sidora.util.constructChildUrl(newParent.a_attr.href, movedPid);
      newNode.a_attr.href = destinationUrl; 
      for (var ci = 0; ci < movedNode.children.length; ci++){
        var childNode = jst.get_node(movedNode.children[ci]);
        jst.copy_node(childNode, newNode, "last", function(newChild, myCopyParent, position){
          var destinationUrl = sidora.util.constructChildUrl(myCopyParent.a_attr.href, newChild.a_attr.pid);
          newChild.a_attr.href = destinationUrl;
        });
      }
    });
    
  }  
  jst.pureUIChange = false;
  jst.redraw(true);
  // close the node so it will reload it's grandchildren when opened
  jst.close_node(movedNode);
}
sidora.util.constructChildUrl = function(parentHref, childPid) {
  var childHref = "/sidora/workbench/#" + childPid;
  if (parentHref.indexOf("=") != -1 && !parentHref.endsWith("?path=")) {
    childHref += "?path=" + parentHref.substring(parentHref.lastIndexOf("=")+1) + "," + parentHref.substring(parentHref.indexOf("#")+1,parentHref.lastIndexOf("?"));
  }
  else if (parentHref.endsWith("?path=")){
    childHref += "?path=" + parentHref.substring(parentHref.indexOf("#")+1,parentHref.lastIndexOf("?"));
  }
  else {
    childHref += "?path=" + parentHref.substring(parentHref.indexOf("#")+1);
  }
  return childHref;
}
sidora.util.conceptRemovedTreeChange = function(oldConceptParentPid, removedConceptPid) {
  var jst = jQuery("#forjstree").jstree();
  var oldParents = sidora.util.GetTreeNodesByPid(oldConceptParentPid); 
  for (var opi = 0; opi < oldParents.length; opi++) {
    var oldParentId = oldParents[opi];
    var oldParent = jst.get_node(oldParentId);
    for (var opci = 0; opci < oldParent.children.length; opci++) {
      var opChild = jst.get_node(oldParent.children[opci]);
      var opChildPid = opChild.a_attr.pid;
      if (opChildPid == removedConceptPid) {
        jst.pureUIChange = true;
        jst.delete_node(opChild);
        jst.pureUIChange = false;
      }
    }
  }
}
sidora.util.conceptAddedCompletelyNew = function(parentPid, pidOfNewItem, nidOfNewItem, nameOfNewItem) {
  var jst = jQuery("#forjstree").jstree();
  var oldParents = sidora.util.GetTreeNodesByPid(parentPid);
  for (var opi = 0; opi < oldParents.length; opi++) {
    var oldParentId = oldParents[opi];
    var oldParent = jst.get_node(oldParentId);
    // The child should take on its parents permissions, so use the parent's attributes
    var a_attr_obj = new Object();
    a_attr_obj.class = oldParent.a_attr.class;
    a_attr_obj.permissions = oldParent.a_attr.permissions;
    a_attr_obj.resourcechildren = "0";
    a_attr_obj.conceptchildren = "0";
    a_attr_obj.fullname = nameOfNewItem;
    a_attr_obj.nid = nidOfNewItem; 
    a_attr_obj.pid = pidOfNewItem;
    // calculate and use the new url
    parentHref = oldParent.a_attr.href;
    var childHref = "/sidora/workbench/#" + pidOfNewItem;
    if (parentHref.indexOf("=") != -1 && !parentHref.endsWith("?path=")) {
      childHref += "?path=" + parentHref.substring(parentHref.lastIndexOf("=")+1) + "," + parentHref.substring(parentHref.indexOf("#")+1,parentHref.lastIndexOf("?"));
    }
    else if (parentHref.endsWith("?path=")){
      childHref += "?path=" + parentHref.substring(parentHref.indexOf("#")+1,parentHref.lastIndexOf("?"));
    }
    else {
      childHref += "?path=" + parentHref.substring(parentHref.indexOf("#")+1);
    }
    a_attr_obj.href = childHref;
    var newNodeId = jQuery("#forjstree").jstree(
	  "create_node",
	  oldParent,
	  { "text" : nameOfNewItem, "a_attr":a_attr_obj },
	  0,
	  function(){},
	  true
    );
  }  
}

jQuery(function () {
  //Check to see that the page has a hash or ends with a '/' so that we will not have to reload the page on first click
  if (
       window.location.hash == "" && 
       (!window.location.pathname.startsWith(Drupal.settings.basePath) || !window.location.pathname.endsWith("/sidora/workbench/")) 
     ){
    window.location = Drupal.settings.basePath + "sidora/workbench/" + window.location.search + "#";
  }
  else {
    window.sidora.InitiatePage();
  }
});

jQuery(window).resize(function() {
  sidora.ResizeOnWindowResize();
  return;
});

/*
 * If the browser doesn't have a console, give it something so we're not creating JS errors
 */
if (typeof(window.console) == 'undefined'||typeof(window.console.log)=='undefined'){window.console = {log:function(){}};}
setTimeout(sidora.util.constantCheck,4000); //All polling links in to this function, give 4 seconds for Drupal javascripts to set up


/**
Because jQuery uses CSS syntax for selecting elements, some characters are interpreted as CSS notation. For example, ID attributes, after an initial letter (a-z or A-Z), may also use periods and colons, in addition to letters, numbers, hyphens, and underscores (see W3C Basic HTML Data Types). The colon (":") and period (".") are problematic within the context of a jQuery selector because they indicate a pseudo-class and class, respectively.

In order to tell jQuery to treat these characters literally rather than as CSS notation, they must be "escaped" by placing two backslashes in front of them.

The following function takes care of escaping these characters and places a "#" at the beginning of the ID string

from:
http://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
*/
function jq( myid ) {
  if (typeof(myid) == 'string') {
    return "#" + myid.replace( /(:|\.|\[|\])/g, "\\$1" );
  }
  else {
    console.log("Tried to get a jQuery id from non-string");
    console.log(myid);
  }
  return null;
}
function getNewPid( jsonString ) {
  var pidString = jsonString.slice(jsonString.indexOf("New Pid:"),jsonString.indexOf(":End New Pid"));
  var pidArray = pidString.split(":");
  return (pidArray[1]+":"+pidArray[2]);
} 
sidora.reloadPage = function(){
  window.location.reload();
}
sidora.util.refreshPidInTree = function(secondsOfWait){
  if (typeof(secondsOfWait) == 'undefined') secondsOfWait = null;
  sidora.util.RefreshTree(secondsOfWait,sidora.concept.GetPid());
}
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function htmlNonBreaking(str) {
  return String(str).replace(/ /g,'&nbsp;');
}
