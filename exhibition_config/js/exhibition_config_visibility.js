
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
  jQuery("#main_shown .fieldset-wrapper").html("");
  jQuery("[id$=show-name]:checked").each(function(){
    jQuery("#main_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
  });
  jQuery("#main_hidden .fieldset-wrapper").html("");
  jQuery("[id$=show-name]").not(":checked").each(function(){
    jQuery("#main_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
  });

  jQuery("#meta_shown .fieldset-wrapper").html("");
  jQuery("[id$=show-meta]:checked").each(function(){
    jQuery("#meta_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
  });
  jQuery("#meta_hidden .fieldset-wrapper").html("");
  jQuery("[id$=show-meta]").not(":checked").each(function(){
    if (jQuery(jQuery(this).closest("li").children()[3]).find("input:checked").size() > 0){
      jQuery("#meta_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
    }
  });
  jQuery("#preview_shown .fieldset-wrapper").html("");
  jQuery("[id$=show-preview]:checked").each(function(){
    jQuery("#preview_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
  });
  jQuery("#preview_hidden .fieldset-wrapper").html("");
  jQuery("[id$=show-preview]").not(":checked").each(function(){
    if (jQuery(jQuery(this).closest("li").children()[3]).find("input:checked").size() > 0){
      jQuery("#preview_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
    }
  });
  jQuery("#downloads_shown .fieldset-wrapper").html("");
  jQuery("[id$=allow-download]:checked").each(function(){
    jQuery("#downloads_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
  });
  jQuery("#downloads_hidden .fieldset-wrapper").html("");
  jQuery("[id$=allow-download]").not(":checked").each(function(){
    if (jQuery(jQuery(this).closest("li").children()[3]).find("input:checked").size() > 0){
      jQuery("#downloads_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
    }
  });
}
resizeConceptTreePage = function() {
  jQuery("#concept_tree").parent().height(jQuery(window).innerHeight()-100);
}
jQuery(function(){
  fillInSidebar();
  resizeConceptTreePage();
  jQuery( "#visibility-list-table li:odd" ).addClass("light-background");//css( "background-color", "#eeeeff" );
  jQuery("#open-advanced").after(jQuery("#edit-save"));
  jQuery(window).resize(resizeConceptTreePage);
  jQuery("input:checkbox").click(function(){
   var invisibleParents = [];
	 var message = "<ul>";
   if (jQuery(this).is(":checked")){
	   var path = jQuery(this).attr("path").split("/");
	   pid = "";
	   for (ctr=0;ctr<path.length;ctr++){
	     if (pid == "") {
		     pid = path[ctr];
		   }else{
		     pid = pid+"/"+path[ctr];
		   }
		   visibilityToCheck = "visibility["+pid+"][show_name]";
			 if (!(jQuery("[name=\'"+visibilityToCheck+"\']").is(":checked"))) {		  
	       invisibleParents.push(visibilityToCheck);
				 message +="<li>This object needs to be visible " + jQuery("[name=\'"+visibilityToCheck+"\']").attr("label")+"</li>";
		 }
	 }
	 if ((jQuery(this).attr("id").indexOf("show-name") != -1) && (jQuery(this).closest("li").children("div")[1].innerHTML == 'Concept')) {
	   var children = jQuery("#selectable").find("[depth^='"+jQuery(this).attr("path")+"/']");
		 if (children.length >0) {
	     for (ctr=0;ctr<children.length;ctr++){
		    var path = jQuery(children[ctr]).attr("depth");
				if (!(jQuery("[name=\'visibility[" + path + "][show_name]\']").is(":checked"))){
				  invisibleParents.push("visibility[" + path + "][show_name]");
					message += "<li>Child : " + jQuery("[name=\'visibility[" + path + "][show_name]\']").attr("label")+"</li>";
				}
			}
		}
	}				
	 message += "</ul>";
	 if (invisibleParents.length > 0){
		 var resetCheckboxID = jQuery(this).attr("id");
		 changeParentConfirm("Visibility Settings Change", message, function(){changeParents(invisibleParents);fillInSidebar();}, function(){resetCheckbox(resetCheckboxID);}); 
	}
}
})
jQuery("#change_all").click(function(){
  var selectedArray = [];
	jQuery("li.ui-selected").each(function() {
	  selectedArray.push({
            path: jQuery(this).attr("depth"), 
            name:  jQuery(this).children("div")[2].innerHTML
        });	
		})
		if (selectedArray.length >0){
      jQuery('#changeAll').remove();
      var checkboxesHtml = "<ul class='visibility-list-table' width='100'><li class='visibility-row'><div class='visibility-setting'>Show Name</div><div class='visibility-setting'>Show Meta</div>";
			checkboxesHtml += "<div class='visibility-setting'>Show Preview</div><div class='visibility-setting'>Allow Download</div></li>";
			checkboxesHtml += "<li class='visibility-row'><div class='visibility-setting'><input type='checkbox' id='show-name' value='1'></div><div class='visibility-setting'><input type='checkbox' id='show-meta' value='1'></div>";
			checkboxesHtml += "<div class='visibility-setting'><input type='checkbox' id='show-preview' value='1'></div><div class='visibility-setting'><input type='checkbox' id='allow-download' value='1'></div></li></ul>";
			checkboxesHtml += "<div>Note: Concepts cannot have previews or downloads</div>";
			checkboxesHtml += "<div>Saving will apply visibility changes to the following:</div>";
			checkboxesHtml += "<div class='dialog_concept_tree'>";
			for (ctr=0;ctr<selectedArray.length;ctr++){
			  checkboxesHtml += "<div>"+selectedArray[ctr].name+"<div>";
			}
			checkboxesHtml += "</div>";	
			jQuery("body").append("<div id='changeAll' style='display:none;' title='Change Visibility for all selected:'><div>"+checkboxesHtml+"</div></div>");
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
      dialogConfig.buttons['Save'] = function() {
		    var visibilitySettings = [];
		    visibilitySettings.push({
		      showName: jQuery("#show-name").is(":checked"),
          showMeta: jQuery("#show-meta").is(":checked"),
					showPreview: jQuery("#show-preview").is(":checked"),
					allowDownload: jQuery("#allow-download").is(":checked")
		    });
		    changeSelected(visibilitySettings[0]);
        jQuery( this ).dialog( "close" );
      };
      dialogConfig.buttons['Cancel'] = function() {
        jQuery( this ).dialog( "close" );
      }
      jQuery("#changeAll").dialog(dialogConfig);
	  }
})
/* open-advanced functionality is incomplete */
jQuery("#open-advanced").click(function(){
  var selectedArray = [];
	jQuery("li.ui-selected").each(function() {
	  selectedArray.push({
            path: jQuery(this).attr("depth"), 
            fullPath: jQuery(this).children("div")[2].innerHTML,
						name:  jQuery(this).attr("name"),
						type: jQuery(this).children("div")[1].innerHTML
        });	
		})
		if (selectedArray.length >0){
      jQuery('#changeAll').remove();
      var checkboxesHtml = "<div class='dialog_concept_tree'><ul class='visibility-list-table'><li id='dialog-header'><div class='visibility-name'>Name</div>";
			checkboxesHtml += "<div class='visibility-type'>Type</div><div class='visibility-path'>Full Path</div>";
			checkboxesHtml += "<div class='visibility-setting'>Show Name</div><div class='visibility-setting'>Show Meta</div>";
			checkboxesHtml += "<div class='visibility-setting'>Show Preview</div><div class='visibility-setting'>Allow Download</div>";
			checkboxesHtml += "<div class='visibility-setting'>Future Children Show Name</div><div class='visibility-setting'>Future Children Show Name</div>";
			checkboxesHtml += "<div class='visibility-setting'>Future Children Show Preview</div><div class='visibility-setting'>Future Children Allow Download</div></li>";
			checkboxesHtml += "</ul><div>Note: Concepts cannot have previews or downloads</div>";
			checkboxesHtml += "<div>Saving will apply visibility changes to the following:</div>";
			checkboxesHtml += "<ul class='visibility-list-table'>";
			for (ctr=0;ctr<selectedArray.length;ctr++){
			  checkboxesHtml += "<li class='visibility-row'><div class='visibility-name'>"+selectedArray[ctr].name+"</div>";
			  checkboxesHtml += "<div class='visibility-type'>"+selectedArray[ctr].type+"</div>";
			  checkboxesHtml += "<div class='visibility-path'>"+selectedArray[ctr].fullPath+"</div>";
			  //checkboxesHtml += "<div class='visibility-setting'><input type='checkbox' id='"+show-name' value='1'></div>";
			}
			checkboxesHtml += "</ul></div>";	
			jQuery("body").append("<div id='changeAll' style='display:none;' title='Change Visibility for all selected:'><div>"+checkboxesHtml+"</div></div>");
  var dialogConfig = {
    resizable: true,
    height:600,
    width: 1200,
    modal: true,
    buttons: {},
    close: function(){
     jQuery( this ).dialog( "close" );
    }
  };
  dialogConfig.buttons['Save'] = function() {
		var visibilitySettings = [];
		visibilitySettings.push({
		      showName: jQuery("#show-name").is(":checked"),
          showMeta: jQuery("#show-meta").is(":checked"),
					showPreview: jQuery("#show-preview").is(":checked"),
					allowDownload: jQuery("#allow-download").is(":checked")
		});
		changeSelected(visibilitySettings[0]);
    jQuery( this ).dialog( "close" );
  };
  dialogConfig.buttons['Cancel'] = function() {
    jQuery( this ).dialog( "close" );
  }
  jQuery("#changeAll").dialog(dialogConfig);
	}
})				
});
changeSelected = function(visibilitySettings) {
	jQuery("li.ui-selected").each(function() {
		jQuery("[name='visibility["+jQuery(this).attr("depth")+"][show_name]']").prop("checked",visibilitySettings.showName);
		jQuery("[name='visibility["+jQuery(this).attr("depth")+"][show_meta]']").prop("checked",visibilitySettings.showMeta);
		if (jQuery(this).children("div")[1].innerHTML == 'Resource') {
		  jQuery("[name='visibility["+jQuery(this).attr("depth")+"][show_preview]']").prop("checked",visibilitySettings.showPreview);
		  jQuery("[name='visibility["+jQuery(this).attr("depth")+"][allow_download]']").prop("checked",visibilitySettings.allowDownload);
		}
	})
}		  
changeParents = function(invisibleItems) {
	for (ctr=0;ctr<invisibleItems.length;ctr++){
		jQuery("[name='" + invisibleItems[ctr] + "']").prop("checked",true);
	}
}		
resetCheckbox = function(visibilityCheckbox) {
  jQuery("#"+visibilityCheckbox).prop("checked",false);
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
