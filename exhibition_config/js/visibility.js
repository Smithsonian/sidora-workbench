fillInSidebar = function(){
jQuery("#main_shown .fieldset-wrapper").html("");
jQuery("[id$=show-name]:checked").each(function(){
  
  jQuery("#main_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
})
jQuery("#main_hidden .fieldset-wrapper").html("");
jQuery("[id$=show-name]").not(":checked").each(function(){
  jQuery("#main_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
})

jQuery("#meta_shown .fieldset-wrapper").html("");
jQuery("[id$=show-meta]:checked").each(function(){
 /* var test = jQuery(this).attr("path");
	test = test.replace( /(:|\.|\[|\]|\\)/g, "\\$1" )
	test = "visibility["+test+"][show_name]";
	console.log(test);
	console.log(jQuery("[name='"+test+"']").is(":checked"));*/
  jQuery("#meta_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
})
jQuery("#meta_hidden .fieldset-wrapper").html("");
jQuery("[id$=show-meta]").not(":checked").each(function(){
  if (jQuery(jQuery(this).closest("li").children()[3]).children(":checked").size() > 0){
    jQuery("#meta_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
  }
})
jQuery("#preview_shown .fieldset-wrapper").html("");
jQuery("[id$=show-preview]:checked").each(function(){
  jQuery("#preview_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
})
jQuery("#preview_hidden .fieldset-wrapper").html("");
jQuery("[id$=show-preview]").not(":checked").each(function(){
  if (jQuery(jQuery(this).closest("li").children()[3]).children(":checked").size() > 0){
    jQuery("#preview_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
  }
})
jQuery("#downloads_shown .fieldset-wrapper").html("");
jQuery("[id$=allow-download]:checked").each(function(){
  jQuery("#downloads_shown .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
})
jQuery("#downloads_hidden .fieldset-wrapper").html("");
jQuery("[id$=allow-download]").not(":checked").each(function(){
  if (jQuery(jQuery(this).closest("li").children()[3]).children(":checked").size() > 0){
    jQuery("#downloads_hidden .fieldset-wrapper").append("<div>"+jQuery(this).closest("li").children()[2].innerHTML+"</div>");
  }
})
}
resizeConceptTreePage = function() {
  jQuery("#concept_tree").parent().height(jQuery(window).innerHeight()-100);
}
/*test = function(path) {
  if (jQuery(this).is(":checked")){
	test = "visibility["+path+"][show_name]";
	console.log(test);
	console.log(jQuery("[name="+test+"]").is(":checked"));
	if (!(jQuery("[name=\'"+test+"\']").is(":checked"))){
	  alert("Show Name not checked!");
	}
}*/
