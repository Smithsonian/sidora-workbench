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
       'search': (readCookie('Drupal.dtFilter') == '')?'':readCookie('Drupal.dtFilter')
      },
     'processing': true,
     'serverSide': true,
     'ordering': false,
     'ajax': jQuery.fn.dataTable.pipeline({
       url: '../info/'+conceptOfInterest+'/resources/all/browser/dataTableServerSideProcessing',
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
      if (!e.ctrlKey){
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
        '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + highlightedPids.length+' resources' + '<span class="fakejstree-copy" style="display:none">+</span></div>'
      );
       
    }
    return jQuery.vakata.dnd.start(e, 
      { 
        'jstree' : true, 
        'obj' : jQuery(this), 
        'nodes' : [{ id : true, text: jQuery(this).text() }] 
      }, 
      '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + jQuery(this).text() + '<span class="fakejstree-copy" style="display:none">+</span></div>'
    );
  });
	jQuery('#res_table_filter').after('<select id=\"sidora-resource-type-dropdown\" class="form-select" name=\"search\"><option value=\"\">All</option><option value=\"images\">Image</option><option value=\"pdf\">Digitized Text</option><option value=\"csv\">Tabular Dataset</option><option value=\"audio\">Audio</option></select><input type="text" name="titleFilter" id="titleFilter" style="border: solid 1px lightblue;">');
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
    url: '../info/'+conceptOfInterest+'/permission',
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
 * Sets the visiblility of exhibition menu item on the concept menu. - RA 3/12/15
 */
sidora.concept.LoadContentHelp.Exhibition_view = function(conceptOfInterest){
  jQuery.ajax({
    dataType: "json",
    url: '../info/'+conceptOfInterest+'/exhibition',
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
    url: '../info/'+conceptOfInterest+"/relationships"
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
    url: '../info/'+conceptOfInterest+'/meta/sidora_xsl_config_variable/browser/html',
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
        content:    "../edit_metadata/"+window.sidora.concept.GetPid()+"",
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
sidora.concept.LoadContentHelp.CreateMenu = function(conceptOfInterest){
  jQuery.ajax({
    url: '../info/'+conceptOfInterest+'/create_resource_menu',
  }).done(function(menu_html){
    var availableResourcesToCreateForConceptHtml = menu_html;
    jQuery("#resource-create").remove();
    if (menu_html.length > 0){
      jQuery("#resource-files-menu").append('<li id="resource-create"><a id="resource-create-link" href="#" onclick="return false;"><input type="image" src="'+Drupal.settings.basePath+'sites/all/modules/islandora_xml_forms-7.x/elements/images/add.png" title="Create a new resource as a child of the highlighted concept."> Add&nbsp;resource</a>'+availableResourcesToCreateForConceptHtml+'</li>');
      jQuery("#resource-create a").attr("onclick","return false;");
      jQuery("#resource-create a").click(function(){
        var model = jQuery(this).attr("model");
        var form = jQuery(this).attr("formname");
        var ontologyId = jQuery(this).attr("ontology-id");
        if (typeof(model) != 'undefined' && "" != model){
          var url = "../create_resource/"+window.sidora.concept.GetPid()+"/"+model+"/";
          if (typeof(form) != 'undefined') {
            url += form + "/" + ontologyId + "/fresh";
          }
          //console.log('form:'+form);
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
    //jQuery("#resource-menu").jMenu(sidora.util.jMenuConfig);
  }).fail(function(failure_obj){
    sidora.recentAjaxFailure(failure_obj);
  });
}
/*
 * Loads the Resource List panel with information from the input concept pid
 */
sidora.concept.LoadContentHelp.FullTableReload = function(conceptOfInterest){
  jQuery.ajax({
    url: '../info/'+conceptOfInterest+'/resources/all/browser/html_placeholder'
  }).done(function(resources_table){
    myDiv = jQuery(resources_table);
    jQuery('#concept-resource-list-internal').children().not('.workbench-nav').remove();
    jQuery('#concept-resource-list-internal').append(myDiv);
    sidora.concept.LoadContentHelp.Resources.TableLoad(conceptOfInterest);
    sidora.concept.LoadContentHelp.Resources.TableActionsSetup();
    sidora.concept.LoadContentHelp.CreateMenu(conceptOfInterest);
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
sidora.util.jMenuConfig =  {ulWidth:250, openClick:true, TimeBeforeClosing:8000};
sidora.queue = new SidoraQueue();
sidora.InitiateJSTree = function(){
  jQuery('#forjstree').bind('loaded.jstree', function(e,data){setTimeout(function(){
    //Figure out what's supposed to be selected, given the information in the hash
    var itemSelectorForCurrentItemInTree = 'a[href=\"'+window.location.pathname + window.location.search + window.location.hash +'\"]';
    jstreeIdSelected = jQuery(itemSelectorForCurrentItemInTree).parent().attr('id');
    //If the item is not available, walk down the path until it is
    if (typeof(jstreeIdSelected) == 'undefined'){
      var walkerItems = window.location.hash.substr(window.location.hash.indexOf("?path=")+6);
      var walkerItemArray = walkerItems.split(",");
      var newMainItem = '';
      while(walkerItemArray.length > 0 && walkerItemArray[0] != "" && typeof(jstreeIdSelected) == 'undefined'){ 
        var rearrangedHash = '#'+walkerItemArray.pop()+"?path="+walkerItemArray.join(",");
        itemSelectorForCurrentItemInTree = 'a[href=\"'+window.location.pathname + window.location.search + rearrangedHash +'\"]';
        jstreeIdSelected = jQuery(itemSelectorForCurrentItemInTree).parent().attr('id');
      }
    }
    toOpen = [];
    //Figure out the path down the tree to open up
    toOpen.unshift(jstreeIdSelected);
    while(toOpen[0] != false){
      toOpen.unshift(jQuery('#forjstree').jstree('get_parent','#'+toOpen[0]));
    }
    //Close the entire tree
    jQuery('#forjstree').jstree('close_all');
    //Open up the path that was figured out above
    for (i = 0; i < toOpen.length; i++){
      if (toOpen[i]) jQuery('#forjstree').jstree('open_node','#'+toOpen[i]);
    }
    jQuery('#forjstree').jstree('select_node',itemSelectorForCurrentItemInTree);
    //When you select a node, update the url in the browser, change the page title (not browser title) and load the concept content into the main window
    jQuery('#forjstree').bind('select_node.jstree', function(e,data) {
      window.location = jQuery('#'+data.selected[0]).children('a').attr('href');
      sidora.UpdateTitleBasedOnNameInTree(jQuery(jQuery('#'+data.selected[0]).find("a")[0]).text());
      sidora.concept.LoadContent();
    });
    jQuery('#forjstree').bind('copy_node.jstree', function (e, data) {
      //Copy node
      var toMovePid = data.node.a_attr.pid;
      var moveToPid = jQuery("#"+data.parent+" a").attr('pid');
      var actionUrl = '../ajax_parts/copy/'+moveToPid+'/'+toMovePid
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
      }, function(){
        sidora.util.RefreshTree();
      }, [moveToPid,toMovePid]);
      sidora.queue.incomingRequestsAreSilent = false;
      sidora.queue.Next();
    });

    jQuery('#forjstree').bind('delete_node.jstree',function(event,data){
      var toMovePid = data.node.a_attr.pid;
      var moveFromPid = jQuery("#"+data.parent+" a").attr('pid');
      var actionUrl = '../ajax_parts/unassociate/'+moveFromPid+'/'+toMovePid;
      var jst = jQuery("#forjstree").jstree(true);
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
      },  function(){
        sidora.util.RefreshTree();
      }, [toMovePid,moveFromPid]);
      sidora.queue.incomingRequestsAreSilent = false;
      sidora.queue.Next();

    });

    jQuery('#forjstree').bind('move_node.jstree',function(event,data){
      var toMovePid = data.node.a_attr.pid;
      var moveToPid = jQuery("#"+data.parent+" a").attr('pid');
      var moveFromPid = jQuery("#"+data.old_parent+" a").attr('pid');
      console.log("Move:"+toMovePid+" from:"+moveFromPid+" to:"+moveToPid);
      if (moveFromPid == moveToPid){ console.log('move to itself, ignoring...'); return; }
      var actionUrl = '../ajax_parts/move/'+moveFromPid+'/'+moveToPid+'/'+toMovePid;

      var jst = jQuery("#forjstree").jstree(true);
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
      }, function(){
        sidora.util.RefreshTree();
      }, [moveToPid,toMovePid,moveFromPid]);
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
          if (typeof(draggedObjects.instance) == 'undefined'){ //instance only exists if it is being dragged from a tree, resources do not exist in a jstree
            if (dragStatus.core){
              //Resource
              if ((jQuery('.jstree-copy:visible').length > 0) || (jQuery('.fakejstree-copy:visible').length > 0)){
                //is a copy
                var showText = "Copy the following resources to "+jQuery("#"+mouseOverObject.id).children("a").attr("fullname")+" ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):";
                showText += "<ul>";
                for (var i = 0; i < sidora.util.dragResources.length; i++){
                  showText += "<li>"+jQuery(jq(sidora.util.dragResources[i])).find(".resource-list-label").text();
                  showText += " ("+sidora.util.dragResources[i]+")</li>";
                }
                showText += "</ul>";
                sidora.util.Confirm("Copy resource",showText,
                  function(){
                    sidora.resources.performCopyOrMove("copy",mouseOverObject.id);
                  }
                );
              }else{
                //is a move
                var showText = "Move the following resources to "+jQuery("#"+mouseOverObject.id).children("a").attr("fullname")+" ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):";
                showText += "<ul>";
                for (var i = 0; i < sidora.util.dragResources.length; i++){
                  showText += "<li>"+jQuery(jq(sidora.util.dragResources[i])).find(".resource-list-label").text();
                  showText += " ("+sidora.util.dragResources[i]+")</li>";
                }
                showText += "</ul>";
                sidora.util.Confirm("Move resource",showText,
                function(){
                  sidora.resources.performCopyOrMove("move",mouseOverObject.id);
                }
                );
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
                for(i=0; i<currentChildren.length; i++){
                  currentChildrenPids.push(jst.get_node(currentChildren[i]).a_attr.pid);
                  //console.log("ccp:"+i+":"+currentChildrenPids[i]);
                }
                 
                var showText = "Copy the following concepts to ";
                showText += jQuery("#"+mouseOverObject.id).children("a").attr("fullname");
                showText += " ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):<ul>";
                var selected = jQuery("#forjstree").jstree(true).get_selected();
                var objectsToCopyOver = [];
                for(i=0; i<selected.length; i++){
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
              var jst = jQuery("#forjstree").jstree(true);
              var parentNode = jst.get_node(mouseOverObject.id);
              var currentChildren = parentNode.children;
              var currentChildrenPids = [];
              for(i=0; i<currentChildren.length; i++){
                currentChildrenPids.push(jst.get_node(currentChildren[i]).a_attr.pid);
                //console.log("ccp:"+i+":"+currentChildrenPids[i]);
              }
               
              var showText = "Move the following concepts to ";
              showText += jQuery("#"+mouseOverObject.id).children("a").attr("fullname");
              showText += " ("+jQuery("#"+mouseOverObject.id).children("a").attr("pid")+"):<ul>";
              
              var showTextForUnassociate = "The concepts listed below existed on the target already and will not be overwritten. They will be removed from the concepts that they were dragged from:<ul>";
              var selected = jQuery("#forjstree").jstree(true).get_selected();
              var objectsToCopyOver = [];
              var objectsToUnassociate = [];
              for(i=0; i<selected.length; i++){
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
    jQuery("body").keydown(function(e){
      jQuery(".fakejstree-copy").toggle(e.ctrlKey);
    });
    jQuery("body").keyup(function(e){
      jQuery(".fakejstree-copy").toggle(e.ctrlKey);
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
  jQuery("#fjt-holder").css("width","300px");
  jQuery("#fjt-holder").css("position","fixed");
  jQuery("#fjt-holder").css("overflow","auto");
  jQuery("#fjt-holder").css("top",parseInt(jQuery("body").css("padding-top"))+10+"px");
  sidora.ResizeToBrowser();
}
sidora.ResizeToBrowser = function(){
  jQuery("#sidora_content_concept_info").css("min-width",0);
  jQuery("#concept_tabs").css("min-width",0);
  var newHeight = jQuery(window).height();
  newHeight -= (parseInt(jQuery("body").css("padding-top"))+10);
  if (jQuery("footer").is(":visible")){
    newHeight -= jQuery("footer").height();
  }
  jQuery("#fjt-holder").css("height",newHeight+"px");

  var tabsHeight = newHeight-50;
  jQuery("#concept_tabs").css("height",tabsHeight+"px");
  jQuery("#concept_tabs").css("width",(jQuery(window).width()-310)+"px");
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
sidora.InitiateConfirmAccess = function(){
  jQuery.ajax(
  {
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
       window.location = Drupal.settings.basePath+"user";
    }
  }
);
}
sidora.InitiatePage = function(){
  sidora.InitiateConfirmAccess();
  sidora.InitiateJSTree();
  sidora.RelocateTreeOnPage();
  sidora.ReformatPage();
  jQuery('#concept_tabs').tabs();
  sidora.concept.LoadContent();
  jQuery("#page-title").after(jQuery("#workbench-menu"));
  jQuery("#concept-meta").prepend(jQuery("#concept-meta-menu"));
  //jQuery("#concept-menu").jMenu(sidora.util.jMenuConfig);
  jQuery('#concept-menu ul li').children(':contains("Permissions")').addClass("ui-state-disabled").css("margin",0).css("padding-left","5px").css("border",0);
  sidora.ontology.CreateMenu();
  sidora.ResizeOnWindowResize();
  jQuery(document).tooltip(
  { position: { my: "left-7 bottom", at: "right center" } }
  );
  jQuery("#branding").append("<div class='branding-user-info' style='float:right'> <a href='"+Drupal.settings.basePath+"user'>Profile</a> <a href='"+Drupal.settings.basePath+"user/logout'>Logout</a></div>");
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
        var pidThumbnail = "../info/"+currPid+"/meta/TN/browser";
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
sidora.resources.performCopyOrMove = function(copyOrMove, toLocationId){
  var pids = sidora.util.dragResources;
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
  var newParentExistingChildResourcesCount = parseInt(jQuery("#"+toLocationId).find("a").attr("resourcechildren")); // the original number of resources in the target pid
  var jst = jQuery("#forjstree").jstree(true);
  var onSuccessfulCopy = function(ajaxRequest,ajaxReturn){
     var newParentExistingChildResourceNumber = parseInt(jQuery("#"+toLocationId).find("a").attr("resourcechildren"));
     var newParentNewChildResourceNumber = newParentExistingChildResourceNumber+1;
     var newParentExistingHtml = jQuery("#"+toLocationId).text();
     if (newParentExistingChildResourceNumber == 0){
        jst.rename_node("#"+toLocationId, newParentExistingHtml + " (" + newParentNewChildResourceNumber + ")");
      }else{
        jst.rename_node("#"+toLocationId, newParentExistingHtml.substring(0,newParentExistingHtml.lastIndexOf(" ("))+" (" + newParentNewChildResourceNumber + ")");
      }
     jQuery("#"+toLocationId).find("a").attr("resourcechildren",""+newParentNewChildResourceNumber);
     if (newParentNewChildResourceNumber == (pids.length + newParentExistingChildResourcesCount)){
       sidora.util.RefreshTree();
    }  
   }   
  var onSuccessfulMove = function(ajaxRequest,ajaxReturn){
     var newParentExistingChildResourceNumber = parseInt(jQuery("#"+toLocationId).find("a").attr("resourcechildren"));
     var newParentNewChildResourceNumber = newParentExistingChildResourceNumber+1;
     var newParentExistingHtml = jQuery("#"+toLocationId).text();
     if (newParentExistingChildResourceNumber == 0){
        jst.rename_node("#"+toLocationId, newParentExistingHtml + " (" + newParentNewChildResourceNumber + ")");
      }else{
        jst.rename_node("#"+toLocationId, newParentExistingHtml.substring(0,newParentExistingHtml.lastIndexOf(" ("))+" (" + newParentNewChildResourceNumber + ")");
      }
     jQuery("#"+toLocationId).find("a").attr("resourcechildren",""+newParentNewChildResourceNumber);
     var fromSource = jq(fromParent).substring(1);
     var oldParentExistingChildResourceNumber = parseInt(jQuery("[pid=" + fromSource + "]").attr("resourcechildren"));
     var oldParentNewChildResourceNumber = oldParentExistingChildResourceNumber - 1;
     var oldParentNode = jst.get_node(jQuery("[pid='" + fromSource + "']").closest("li").attr("id"));
     var oldParentExistingHtml = jQuery("#"+oldParentNode.id).text();
     if (oldParentNewChildResourceNumber == 0){
        jst.rename_node(oldParentNode,oldParentExistingHtml.substring(0,oldParentExistingHtml.lastIndexOf(" ("))); 
      }else{
        jst.rename_node(oldParentNode,oldParentExistingHtml.substring(0,oldParentExistingHtml.lastIndexOf(" ("))+" ("+oldParentNewChildResourceNumber+")");
      }
      jQuery("[pid=" + fromSource + "]").attr("resourcechildren",""+oldParentNewChildResourceNumber);
      if (newParentNewChildResourceNumber == (pids.length + newParentExistingChildResourcesCount)){
        sidora.util.RefreshTree();
      }  
  }  
  for(var i=0;i<pids.length;i++){
    droppedPid = pids[i];
    var userFriendlyName = 'Unknown action';
    if (action != 'copy'){
      jQuery(jq(pids[i])).addClass("is-being-moved");
      userFriendlyName = "Moving "+droppedPid+" from "+fromParent+" to "+droppedOn;
      sidora.queue.Request(userFriendlyName, '../ajax_parts/'+action+'/'+droppedOn+'/'+droppedPid, onSuccessfulMove, null, [fromParent,droppedOn,droppedPid]);
    }else{
      userFriendlyName = "Copying "+droppedPid+" from "+fromParent+" to "+droppedOn;
      sidora.queue.Request(userFriendlyName, '../ajax_parts/'+action+'/'+droppedOn+'/'+droppedPid, onSuccessfulCopy, null, [droppedOn,droppedPid]);
    }
    console.log(userFriendlyName);
  }
  sidora.queue.Next();
}
/* This function was created by RAmlani on 4/10/15. This function is currently not being used anywhere.
When moving resources this function can check if any of those resources already exist on the target PID. 
This function can possibly be used in future to generate a message alerting the user of duplicate resources
and also possibly providing the user with some custom actions like move & replace, ignore move etc.
*/
sidora.resources.checkForDuplicateResourcesRA = function(copyOrMove, toLocationId){
  // get the pid of the target 
  var targetPid = jQuery("#"+toLocationId).children("a").attr("pid");
  // ajax call to generate a list of the resources currently on the target
 jQuery.ajax({
      url: "../ajax_parts/generate_resource_list/"+targetPid,
      success: function(resourceList){
          var currentChildrenPids = JSON.parse(resourceList);;
          for (var i = 0; i < sidora.util.dragResources.length; i++){
            if (jQuery.inArray(sidora.util.dragResources[i],currentChildrenPids) > -1)
           { 
           //alert('we found a duplicate');
           }
          }
      }
 });
}
/*
 * Gets the current concept json object and creates a menu from it
 */
sidora.ontology.CreateMenu = function(){
  jQuery.ajax({
    dataType: "json",
    url: Drupal.settings.basePath+"sidora/ajax_parts/ontology",
    error: function(){
      console.log("error on create menu");
    },
    success: function (json_obj){
      window.sidora.ontology.tree = json_obj;
      jQuery("#concept-file-menu").append("<li id='concept-create'><a href='#' onclick='return false;'><input type='image' src='"+Drupal.settings.basePath+"sites/all/modules/islandora_xml_forms-7.x/elements/images/add.png' title='Create a new concept as a child of the highlighted concept.'>&nbsp;Add&nbsp;a&nbsp;new&nbsp;concept</a><ul>"+window.sidora.ontology._createSubmenu(window.sidora.ontology.tree)+"</ul></li>");
      resetMenu("concept-menu");
      jQuery("#concept-create").find("a").not(".ui-state-disabled").bind("click.createConcept",function(){
        var model = jQuery(this).attr("model");
        var form = jQuery(this).attr("formname");
        var ontologyId = jQuery(this).attr("ontology-id");
        if (typeof(model) != 'undefined'){
          var url = "../create_concept/"+window.sidora.concept.GetPid()+"/"+model+"/";
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
      if (typeof(obj.model) != 'undefined') model = ' model="'+obj.model+'"';
      if (typeof(obj.form) != 'undefined') formName = ' formname="'+obj.form+'"';
      if (typeof(obj['ontology-id']) != 'undefined') ontologyId = ' ontology-id="'+obj['ontology-id']+'"';
      if (typeof(obj.disabled) != 'undefined' && obj.disabled) classDisabled = " ui-state-disabled";
      toReturn += ("<li title='"+obj.description+"' class=''><a onclick='return false;' href='#'"+model+formName+ontologyId+" class="+classDisabled+">"+key.replace(/ /g, '&nbsp;')+"</a>"+childrenHtml+"</li>\n");
    }
  }
  return toReturn;
}
/*
 *  Got tired of CSS fiddling, resizing the main div programmatically based on assumed navigation size
 */
sidora.ResizeOnWindowResize = function(){
  var bodywidth = jQuery(window).width();
  var menuwidth = 360;
  var newwidth = bodywidth-menuwidth;
  jQuery("#sidora_content_concept_info").width(newwidth);

  //Resize the resource information pane for the resource page 
  sidora.resources.individualPanel.ResizeAndStop();
}
/*
 * Attempts to pull the number of child concepts from the tree
 */
sidora.concept.GetConceptChildrenLength = function(){
  var itemSelectorForCurrentItemInTree = 'a[href=\"'+window.location.pathname + window.location.search + window.location.hash +'\"]';
  var directPull = jQuery(itemSelectorForCurrentItemInTree).attr("conceptchildren");
  if (typeof(directPull) != 'undefined'){
    return parseInt(directPull);
  }
  return parseInt("-1"); // return -1 if there's any error in retrieving the conceptchildren value.
}
/*
 * Attempts to pull a concept name from the tree or just returns whatever is passed in
 */
sidora.concept.GetName = function(suggestedName){
  var conceptName = suggestedName;
  //If didn't send in concept name, try to get it from tree
  if (typeof(conceptName) == 'undefined' || conceptName == null){
    var itemSelectorForCurrentItemInTree = 'a[href=\"'+window.location.pathname + window.location.search + window.location.hash +'\"]';
    var directPull = jQuery(itemSelectorForCurrentItemInTree).attr("fullname");
    if (typeof(directPull) != 'undefined'){
      return directPull;
    }
    conceptName = jQuery(itemSelectorForCurrentItemInTree).text();
  }
  //If there's a (num) at the end, remove it
  var newTitle = conceptName;
  if (conceptName.lastIndexOf(" (") > 0){
    newTitle = conceptName.substring(0,conceptName.lastIndexOf(" ("));
  }
  return newTitle;
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
  sidora.util.RefreshTree();
}
sidora.util.constantCheck = function(){
  setTimeout(sidora.util.constantCheck, 30000);
  sidora.resources.updateThumbnails();
}
/*
 * Goes to get the tree from the server and replaces exsiting tree
 * singleTripWaitMilliseconds - number of milliseconds to wait for other refreshTree requests to come in
 *      - so that only one refresh tree request goes out no matter how many times its called during that time period
 */
sidora.util.refreshTreeRequestInProgress = false;
sidora.util.RefreshTreeIfNew = function(secondsOfWait){
  if (typeof(secondsOfWait) == 'undefined') secondsOfWait = .01;
  setTimeout(function(){
    jQuery.ajax({
      url: '../ajax_parts/tree',
    }).done(function(tree_html){
      if (tree_html == '') window.location = Drupal.settings.basePath+'user';  //No tree indicates a user problem
      if (tree_html == sidora.util.latestTreeGrab){
        console.log("Tree same as prior tree, no update to UI");
        return;
      }
      sidora.util.latestTreeGrab = tree_html;
      sidora.RefreshTreeHtml(tree_html);
    }).fail(function(failure_obj){
      sidora.recentAjaxFailure(failure_obj);
    });
  },secondsOfWait*1000);
}
sidora.util.RefreshTree = function(singleTripWaitMilliseconds){
  if (typeof(singleTripWaitMilliseconds) == 'undefined') singleTripWaitMilliseconds = 10;
  //Wait to see if we get a few requests at a time before going thru with the reload
  if (sidora.util.refreshTreeRequestInProgress) return;
  sidora.util.refreshTreeRequestInProgress = true;
  setTimeout(function(){
    jQuery.ajax({
      url: '../ajax_parts/tree',
    }).done(function(tree_html){
      if (tree_html == '') window.location = Drupal.settings.basePath+'user';  //No tree indicates a user problem
      sidora.util.latestTreeGrab = tree_html;
      //Note that you may want to refresh the tree even if the latest is the same as the previous
      //For example, a concept move has failed.  The concept move shows in the UI, so the tree
      //needs to be reverted back.  If you want to update the tree only on if it's changed see RefreshTreeIfNew
      sidora.RefreshTreeHtml(tree_html);
    }).fail(function(failure_obj){
      sidora.recentAjaxFailure(failure_obj);
    }).always(function(){
      sidora.util.refreshTreeRequestInProgress = false;
    });
  },singleTripWaitMilliseconds);
}
/*
 * Replaces exsiting tree with passed in html, and initializes new tree
 */
sidora.RefreshTreeHtml = function(tree_html){
    myDiv = jQuery(tree_html);
    jQuery('#forjstree').after("<div id='toReplaceForjstree' style='display:none;'></div>").attr("id","oldjstree");
    jQuery('#toReplaceForjstree').append(myDiv).attr("id","forjstree");
    sidora.InitiateJSTree();
    jQuery("#oldjstree").remove();
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
  if (sidora.concept.GetConceptChildrenLength() == "-1"){
    jQuery("body").append("<div id='deleteConceptDialog' style='display:none;' title='Delete Concept'><p>Error getting the child concepts for this concept. Cannot delete this concept</p><p>"+sidora.concept.GetName()+" ("+sidora.concept.GetPid()+")</p></div>");
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
  if (sidora.concept.GetConceptChildrenLength() + sidora.resources.GetLength() > 0){
    jQuery("body").append("<div id='deleteConceptDialog' style='display:none;' title='Delete Concept'><p>This concept has "+sidora.concept.GetConceptChildrenLength()+" concept(s) and has "+sidora.resources.GetLength()+" resource(s) as children. It cannot be deleted while it has children.</p><p>"+sidora.concept.GetName()+" ("+sidora.concept.GetPid()+")</p></div>");
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
          var onDeleteWorked = function(){
            jQuery( toClose ).dialog( "close" );
            jQuery("#deleteConceptConfirm").remove();
            jQuery("body").append("<div title='Concept Deleted' id='deleteConceptConfirm'><p>Concept Deleted</p><div>");
            jQuery("#deleteConceptConfirm").dialog({
              resizable:false, modal:true
            });
            sidora.util.RefreshTree();
          }
          var onDeleteFailed = function(data){
            jQuery( toClose ).dialog( "close" );
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
  toReturn += ' <input type="image" src="'+Drupal.settings.basePath+'sites/all/modules/islandora_xml_forms-7.x/elements/images/add.png" title="Add the login / group to the list">';
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
        var onDeleteWorked = function(){sidora.util.RefreshTree();}
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
  //  if (pids.length != 1) return;
  pids = pids_array.join("&");
	  Shadowbox.open({
      content:    "../edit_metadata/"+pids+"",
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
  jQuery.ajax({
    url: '../info/'+roipid+'/meta/sidora_xsl_config_variable/browser/html',
  }).done(function(meta_html){
    myDiv = jQuery(meta_html);
    jQuery('#resource-meta .metadata-table').remove();
    jQuery('#resource-meta').append(myDiv);
    sidora.resources.individualPanel.ResizeAndStop(); //Gives it proper height
  }).fail(function(meta_html){
    var myDiv = sidora.util.getErrorMessageHtml();
    jQuery('#resource-meta .metadata-table').remove();
    jQuery('#resource-meta').append(myDiv);
    sidora.resources.individualPanel.ResizeAndStop(); //Gives it proper height
    sidora.recentAjaxFailure(meta_html);
  });;
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
  return sidora.util.deletePid(this.GetPid(), onSuccess, onFailure);
}
/*
 * Unassociate and delete orphan of the Pid
 */
sidora.util.deletePid = function(pidOfInterest, onSuccess, onFailure){
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
  var url = '../ajax_parts/unassociate_delete_orphan/'+unassociateFrom+'/'+pidOfInterest;
  var userFriendlyToastName = "Remove "+pidOfInterest+" from "+unassociateFrom;
  sidora.queue.RequestPost(userFriendlyToastName,url,"",onSuccess,onFailure,[pidOfInterest,unassociateFrom]);
  sidora.queue.Next();
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
  var remainingSpace = parent.width() - ui.element.outerWidth() - 0,
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
  //jQuery("#concept-resource-list-internal").css('min-height',newMinHeight);
  //jQuery("#resourceIframeHolder").height(newMinHeight-40);
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
              sidora.queue.RequestPost(userFriendlyToastName+":"+name+" ("+pid+")",Drupal.settings.basePath+"sidora/manage/"+pid+"/save","label="+jQuery("#objPropLabel").val()+"&owner="+jQuery("#objPropOwner").val(),function(){},function(){},pid);
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
        sidora.queue.RequestPost("Removed Datastream "+dsid+" from "+pid,Drupal.settings.basePath+"sidora/manage/"+pid+"/remove/"+dsid+"/confirm","",
          function(){
            sidora.manage.resetFrame();
          },
          function(){},pid);
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
  window.sidora.InitiatePage()
});

jQuery(window).resize(function() {
  sidora.ResizeOnWindowResize();
  sidora.ResizeToBrowser();
});

/*
 * If the browser doesn't have a console, give it something so we're not creating JS errors
 */
if (typeof(window.console) == 'undefined'||typeof(window.console.log)=='undefined'){window.console = {log:function(){}};}
sidora.util.constantCheck(); //All polling links in to this function


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
    for(i=0;i < ca.length;i++) {
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
