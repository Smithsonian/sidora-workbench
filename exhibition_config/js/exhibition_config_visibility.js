
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
  submit = false; 
    var prev = -1;
    jQuery( "#selectable>ul" ).selectable({
    selecting: function(e, ui) {
        var curr = jQuery(ui.selecting.tagName, e.target).index(ui.selecting);
        if(e.shiftKey && prev > -1) {
            console.log(prev, curr, Math.min(prev, curr));
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
  jQuery("input:checkbox").click(fillInSidebar);
  jQuery("#open-advanced").after(jQuery("#edit-save"));
  jQuery(window).resize(resizeConceptTreePage);
});
