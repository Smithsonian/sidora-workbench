jQuery(document).ready(function(){

/*
 * Validate JSON items
 * In the Drupal form, add the class "validate-json" to a text area
 */
jQuery(".validate-json").on('change keyup paste', function() {
  var messagePlacementId = jQuery(this).attr("id")+"-json-message";
  jQuery("#"+messagePlacementId).remove();
  try {
    var c = jQuery.parseJSON(jQuery(this).val());
    jQuery(this).after("<div id='"+messagePlacementId+"' class='status messages'>Valid</div>");
  }catch (err) {
    jQuery(this).after("<div id='"+messagePlacementId+"' class='error messages'>Invalid</div>");
  }
});

});//end ready
