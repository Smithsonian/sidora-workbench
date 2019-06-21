<?php
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

/**
 * @file
 *
 * This module's Admin settings form.
 */

/**
 * Defines this modules admin settings form.
 *
 * @param array $form_state
 *   The Drupal form state.
 *
 * @return array
 *   The drupal form definition.
 */
function sidora_admin_settings() {
  module_load_include('inc', 'islandora', 'includes/content_model.autocomplete');
  module_load_include('inc', 'sidora', 'includes/workbench_viewers.admin');
  module_load_include('inc', 'sidora', 'includes/xsl_handling');
  $form = array(
/*

    'si_exhibition_data_url' => array(
      '#type' => 'textfield',
      '#title' => t('Where to obtain the website configuration for the page (not where to obtain the Fedora data itself)'),
      '#default_value' => variable_get('si_exhibition_data_url', 'http://server.net/exhibition_config/info/'),
      '#description' => t('The Fedora Commons pid will be directly appended to the above, end with / if needed.'),
    ),
*/
    'si_exhibition_website_location' => array(
      '#type' => 'textfield',
      '#title' => t('The prefix for exhibition links'),
      '#default_value' => variable_get('si_exhibition_website_location', ''),
      '#description' => t('The Fedora Commons pid will be directly appended to the above, end with / if needed.'),
    ),
    'sidora_ontology_json' => array(
      '#type' => 'textarea',
      '#title' => t('JSON determining the layout and form choices presented for add new concept'),
      '#default_value' => variable_get('sidora_ontology_json',sidora_ontology_json_default()),
      '#suffix' => '<script>
jQuery("#edit-sidora-ontology-json").on(\'change keyup paste\', function() {
  jQuery("#ontology_json_check").remove();
  try {
    var c = jQuery.parseJSON(jQuery("#edit-sidora-ontology-json").val());
    jQuery("#edit-sidora-ontology-json").after("<div id=\'ontology_json_check\' class=\'status messages\'>Valid</div>");
  }catch (err) {
    jQuery("#edit-sidora-ontology-json").after("<div id=\'ontology_json_check\' class=\'error messages\'>Invalid</div>");
  }
});</script>',
    ),
    'sidora_resource_ontology_json' => array(
      '#type' => 'textarea',
      '#title' => t('JSON determining the layout and form choices presented for add new resource'),
      '#default_value' => variable_get('sidora_resource_ontology_json',sidora_ontology_json_default()),
      '#suffix' => '<script>
jQuery("#edit-sidora-resource-ontology-json").on(\'change keyup paste\', function() {
  jQuery("#resource_ontology_json_check").remove();
  try {
    var c = jQuery.parseJSON(jQuery("#edit-sidora-resource-ontology-json").val());
    jQuery("#edit-sidora-resource-ontology-json").after("<div id=\'resource_ontology_json_check\' class=\'status messages\'>Valid</div>");
  }catch (err) {
    jQuery("#edit-sidora-resource-ontology-json").after("<div id=\'resource_ontology_json_check\' class=\'error messages\'>Invalid</div>");
  }
});</script>',
    ),
  );

  module_load_include('inc', 'xml_form_builder', 'XMLFormRepository');
  $names = XMLFormRepository::GetNames();
  // No forms exist can only create.
  /*
  if (count($names) == 0) {
    return '<div>No forms are defined. Please create a new form.</div><br/>';
  }

  $table = array(
    'header' => array(
      array(
        'data' => t('Title'),
      ),
      array(
        'data' => t('Type'),
      ),
      array(
        'data' => t('Operations'),
        'colspan' => 6,
      ),
    ),
    'rows' => array(),
  );
  
  foreach ($names as $form_info) {
    $name = $form_info['name'];
    if ($form_info['indb']) {
      $type = t('Custom');
      $edit = l(t('Edit'), xml_form_builder_get_edit_form_path($name));
      $delete = l(t('Delete'), xml_form_builder_get_delete_form_path($name));
    }
    else {
      $type = t('Built-in');
      $edit = '';
      $delete = '';
    }
    $copy = l(t('Copy'), xml_form_builder_get_copy_form_path($name));
    $view = l(t('View'), xml_form_builder_get_view_form_path($name));
    $export = l(t('Export'), xml_form_builder_get_export_form_path($name));
    $associate = l(t('Associate'), xml_form_builder_get_associate_form_path($name));

    $table['rows'][] = array(
      $name,
      $type,
      $copy,
      $edit,
      $view,
      $export,
      $delete,
      $associate,
    );
  }
  */

  $form_names_dd = '<select class="form-names-dd form-select">';
  $form_names_dd .= '<option value="sidora_all">All forms that are not specifically called out</option>';
  foreach($names as $form_info){ $name = $form_info['name']; $form_names_dd .= '<option value="'.$name.'">'.$name.'</option>'; }
  $form_names_dd .= '</select>';
  $model_names = islandora_get_content_model_names();

  $model_names_dd = '<select class="model-names-dd form-select">';
  $model_names_dd .= '<option value="sidora_all">All models that are not specifically called out</option>';
  foreach($model_names as $model => $name){ $model_names_dd .= '<option value="'.$model.'">'.$name.'</option>'; }
  $model_names_dd .= '</select>';
  $xsl_names_dd = '<select class="xsl-names-dd form-select">';
  $xsl_names_dd .= '<option value="">None - Direct metadata to browser</option>';
  module_load_include('inc', 'sidora', 'includes/xsl_handling');
  $get_xsl_records = sidora_get_all_xsl_names();
  foreach ($get_xsl_records as $xsl_form_record) {
    $xsl_names_dd .= '<option value="' . $xsl_form_record . '">' . $xsl_form_record . '</option>'; 
  }	
  $xsl_names_dd .= '</select>';
  /* example 
  $existing_json_sidora_form_config = '
    {
      "xsl_config":[
        {"form":"Expedition","model":"si:siBasicObject","dsid":"three","file":"four"},
        {"form":"Archaeology Site","model":"si:imageCModel","dsid":"three","file":"basic_form_definition_list.xsl"}
      ]
    }
  ';
  */
  $existing_json_sidora_form_config = variable_get('xsl_form_config', '');
  $sfc = json_decode($existing_json_sidora_form_config);
  $sfc_table = '
<script>
window.filesUpdated = function(updateObj){
  console.log(updateObj);
  var currentOptions = jQuery(jQuery(".xsl-names-dd")[0]).children("option").map(function() {return jQuery(this).val();}).get();
  var files = updateObj.files;
  for(var i = 0; i < files.length; i++){
    var currName = files[i].name;
    if (currentOptions.indexOf(currName) == -1){
      //If this is a brand new file, add it to the end of the file listing
      var optionsHtml = "<option value=\""+currName+"\">"+currName+"</option>";
      jQuery(".xsl-names-dd").append(optionsHtml);
    } 
  }
}
window.recolorTable = function(){
  var tableRows = jQuery(".sfc-table tr").removeClass("even").removeClass("odd");
  for(var i=0;i<tableRows.length;i++){
    jQuery(tableRows[i]).addClass( (i%2==0)?"even":"odd" );
  }
}
window.generateSidoraFormConfig = function(){
  var toAdd = jQuery(".sfc-table tr:visible").not(".removed").has("td");
  var obj = {"xsl_config":[]};
  for (var i = 0; i < toAdd.length; i++){
    obj.xsl_config.push({
      "form": jQuery(toAdd[i]).find(".form-names-dd").val(),
      "model": jQuery(toAdd[i]).find(".model-names-dd").val(),
      "dsid": jQuery(toAdd[i]).find("input[type=\'textfield\']").val(),
      "file": jQuery(toAdd[i]).find(".xsl-names-dd").val()
    });
  }
  return obj;
}
jQuery(document).ready(function(){
  jQuery("#anf-button").click(function(){
  var myWin = window.open(Drupal.settings.basePath+"sidora/info/xsl_Upload/upload2","XSL_UPLOAD","width=550,height=250,0,status=0,");
  });
  jQuery("#dxsl-button").click(function(){
    Shadowbox.open({
      content:    Drupal.settings.basePath+"sidora/delete_xsl",
      player:     "iframe",
      title:      "Delete XSL",
      options: {
        onFinish:  function(){}
      }
    });

 });
  jQuery("#anr-button").click(function(){
    var tableRow = \'<tr><td>'.$form_names_dd.'</td><td>'.$model_names_dd.'</td><td><input type="textfield" class="form-text" /></td><td><select class="xsl-names-dd form-select">\'+jQuery(".xsl-names-dd")[0].innerHTML.replace(\'selected="selected"\',"")+\'</select></td><td><input type="button" class="form-submit remove-row" value="Remove"/></td></tr>\';
    jQuery(".sfc-table tbody").append(tableRow);
    recolorTable();
    window.establishRemoveReadd();
  });
  window.establishRemoveReadd();
});
window.establishRemoveReadd = function(){
  jQuery(".sfc-table .remove-row").not(".removable").click(function(){
    if (jQuery(this).closest("tr").hasClass("removed")){
      jQuery(this).closest("tr").removeClass("removed");
      console.log("remove");
      jQuery(this).val("Remove");
    }else{
      jQuery(this).closest("tr").addClass("removed"); //make red
      console.log("readd");
      jQuery(this).val("Readd");
    }
    recolorTable();
  }).addClass("removable");
}
window.formPreSubmit = function(){
  jQuery("input[name=\'xsl_form_config\']").val(JSON.stringify(generateSidoraFormConfig()));
}
</script>
<style>
tr.removed.even {
  background: #A00000;
}
tr.removed.odd {
  background: #600000;
}
</style>
<table class="sticky-enabled tableheader-processed sticky-table sfc-table">
 <thead><tr><th>Form</th><th>Model</th><th>DSID</th><th colspan="1">File</th><th>Remove</th> </tr></thead>
<tbody>
  <tr style="display:none;"><td>'.$form_names_dd.'</td><td>'.$model_names_dd.'</td><td><input type="textfield" class="form-text" /></td><td>'.$xsl_names_dd.'</td><td><input type="button" class="form-submit remove-row" value="Remove"/></td></tr>

';
  $even = FALSE;
  if (!empty($sfc->xsl_config)){
    foreach ($sfc->xsl_config as $config_line){
      $class = $even?'even':'odd';
      $sfc_table .= '<tr class="'.$class.'">';
      $sfc_table .= '<td>';
      $sfc_table .= str_replace("value=\"$config_line->form\"",'value="'.$config_line->form.'" selected="selected"',$form_names_dd);
      $sfc_table .= '</td>';
      $sfc_table .= '<td>';
      $sfc_table .= str_replace("value=\"$config_line->model\"",'value="'.$config_line->model.'" selected="selected"',$model_names_dd);
      $sfc_table .= '</td>';
      $sfc_table .= '<td>';
      $sfc_table .= '<input type="textfield" class="form-text" value="'.$config_line->dsid.'" />';
      $sfc_table .= '</td>';
      $sfc_table .= '<td>';
      $sfc_table .= str_replace("value=\"$config_line->file\"",'value="'.$config_line->file.'" selected="selected"',$xsl_names_dd);
      $sfc_table .= '</td>';
      $sfc_table .= '<td>';
      $sfc_table .= '<input type="button" class="form-submit remove-row" value="Remove"/>';
      $sfc_table .= '</td>';
      $sfc_table .= '</tr>';
      $even = !$even;
    }
  }
  $sfc_table .= '</tbody></table>';
  $add_new_files_button = '<input id="anf-button" type="button" class="form-submit" value="Upload New XSL File"/>';
  $add_new_row_button = '<input id="anr-button" type="button" class="form-submit" value="Add New Row to Configure"/>';
  $sfc_label = '<label>Metadata Form XSL Configuration</label>';
  // create the delete xsl files button
  $remove_xsl_file_button = '<input id="dxsl-button" type="button" class="form-submit" value="Remove a XSL File"/>';
  
  $form['xsl_form_config'] = array(
      '#type' => 'hidden',
      '#default_value' => variable_get('xsl_form_config', ''),
     // '#suffix' => $sfc_label.$sfc_table.$add_new_row_button.$add_new_files_button,//.theme('table',$table),
      '#suffix' => $sfc_label.$sfc_table.$add_new_row_button.$add_new_files_button.$remove_xsl_file_button,//.theme('table',$table),
  );

  $models = array();
  $model = 'not_a_content_model';
  $models[] = array(
    '#type' => 'fieldset',
    '#title' => 'Items that are not content models',
    '#description' => t('If the DSID does not exist for the object, the display will not be attempted.'),
    'resource_viewer_dsid_'.$model => array(
      '#type' => 'textfield',
      '#title' => t('DSID'),
      '#default_value' => variable_get('resource_viewer_dsid_'.$model,'DC'),
    ),
    'resource_viewer_viewer_'.$model => array(
      '#type' => 'select',
      '#title' => t('Viewer'),
      '#options' => array(
        //remember to change this and the one below it when adding a new type
        'direct' => t('Direct stream to browser (actual image / binary / text)'),
        'web_view' => t('Direct stream to browser for web viewable items, download message for others'),
        'img_src_webpage' => t('Put the item directly to the viewer pane as an image at its original size'),
        'pdfjs' => t('PDF to HTML5 via Javascript (pdf.js)'),
        'IDS' => t('Smithsonian IDS Viewer'),
        'OpenSeaDragon' => t('OpenSeaDragon'),
        'PHPExcel' => t('PHPExcel'),
        'none' => t('None - no display available'),
        'never' => t('Never set'),
      ),
      '#default_value' => variable_get('resource_viewer_viewer_'.$model,'never'),
    ),
    //TODO: make both this and the looped additions to use the same code instead of copy/paste
  );

  foreach($model_names as $model => $name){
    $models[] = array(
      '#type' => 'fieldset',
      '#title' => $name,
      'resource_viewer_dsid_'.$model => array(
        '#type' => 'textfield',
        '#title' => t('DSID'),
        '#default_value' => variable_get('resource_viewer_dsid_'.$model,'OBJ'),
      ),
      'resource_viewer_viewer_'.$model => array(
        '#type' => 'select',
        '#title' => t('Viewer'),
        '#options' => array(
          'direct' => t('Direct stream to browser (actual image / binary / text)'),
          'web_view' => t('Direct stream to browser for web viewable items, download message for others'),
          'img_src_webpage' => t('Put the item directly to the viewer pane as an image at its original size'),
          'JW Audio Player' => t('JW Player for audio'),
          'pdfjs' => t('PDF to HTML5 via Javascript (pdf.js)'),
          'JW Video Player' => t('JW Player for video'),
          'IDS' => t('Smithsonian IDS Viewer'),
          'OpenSeaDragon' => t('OpenSeaDragon'),
          'PHPExcel' => t('PHPExcel'),
          'none' => t('None - no display available'),
          'never' => t('Never set'),
        ),
        '#default_value' => variable_get('resource_viewer_viewer_'.$model,'never'),
      ),
    );

  }
  $form['govt_msg'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Log In Message',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_login_message' => array(
        '#type' => 'textarea',
        '#title' => t('Government Warning text'),
        '#default_value' => variable_get('sidora_login_message', ''),
        '#description' => t('This message is shown on the log in screen.'),
      ),
    ),
  );
  $form['one'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Resource Viewer Content Model Settings',
      '#description' => t('Listed below are all the Content Models with viewers for Content Viewer.  <br/>"Never set" will also not attempt to display the item, and is used for record-keeping as opposed to an operational difference from "None" <br/>"Smithsonian IDS Viewer" will require that the Smithsonian IDS have access to the image, which means that the image will need to be set to publicly viewable.  (In development - the direct download is to be used when not publicly viewable.)'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'models' => $models,
    ),
  );
  $form['sidora_person'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Account Creation',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#description' => t('When automatically generating an object for a newly created user, the model is checked for associations.  If there is more than one association or no associations available the additional defaults below are used.'),
      'sidora_automatic_person_model' => array(
        '#type' => 'textfield',
        '#title' => t('Model'),
        '#default_value' => variable_get('sidora_automatic_person_model', 'si:HierarchyObject'),
      ),
      'sidora_automatic_person_form' => array(
        '#type' => 'textfield',
        '#title' => t('Form name'),
        '#default_value' => variable_get('sidora_automatic_person_form', 'Person 2015'),
        '#description' => t('This value will only be used if there is not exactly one association with the model listed above'),
      ),
      'sidora_automatic_person_dsid' => array(
        '#type' => 'textfield',
        '#title' => t('DSID for editing'),
        '#default_value' => variable_get('sidora_automatic_person_dsid', 'DESCMETA'),
        '#description' => t('This value will only be used if there is not exactly one association with the model listed above'),
      ),
    ),
  );
/*
  $form['one']['si_exhibition_data_urli3'] = array(
      '#type' => 'textfield',
      '#title' => t('Where to obtain the website configuration for the page (not where to obtain the Fedora data itself)'),
      '#default_value' => variable_get('si_exhibition_data_url', 'http://<server>/exhibition_config/info/'),
      '#description' => t('The Fedora Commons pid will be directly appended to the above, end with / if needed.'),
    );
*/
  _sidora_admin_settings_add_viewer_configs($form);
  $form['sidora_js_libs'] = array(
     'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Javascript Libraries (Non-viewer related)',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_js_lib_location_jstree' => array(
        '#type' => 'textfield',
        '#title' => t('jstree'),
        '#default_value' => variable_get('sidora_js_lib_location_jstree', ''),
        '#description' => t('This should be an http / https location containing jstree.js and themes/default/style.min.css.  jsTree can be downloaded from https://github.com/vakata/jstree or http://jstree.com'),
        '#attributes' => array('size' => 120),
        '#maxlength' => 1024,
      ),  
      'sidora_js_lib_location_plupload' => array(
        '#type' => 'textfield',
        '#title' => t('PL Upload'),
        '#default_value' => variable_get('sidora_js_lib_location_plupload', ''),
        '#description' => t('This should be an http / https location containing plupload.full.min.js, jqueryui.plupload/jquery.ui.plupload.js, and jquery.ui.plupload/css/jquery.ui.plupload.css.  Pluplup can be downloaded from http://www.pulupload.com'),
        '#attributes' => array('size' => 120),
        '#maxlength' => 1024,
      ),  
    ),
  );
  $form['account_request'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'New Account Request',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'account_request_email_to' => array(
        '#type' => 'textfield',
        '#title' => t('Send New Account Request Email to'),
        '#default_value' => variable_get('account_request_email_to', ''),
        '#description' => t('New account requests are sent to this email address.'),
      ),
      'account_request_email_from' => array(
        '#type' => 'textfield',
        '#title' => t('Send New Account Request Emails from'),
        '#default_value' => variable_get('account_request_email_from', ''),
        '#description' => t('New account requests will be sent from this email address.'),
      ),  
    ),
  );
  $form['codebook_parser'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Codebook Parser',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_codebook_parser_url' => array(
        '#type' => 'textfield',
        '#title' => t('Codebook Parser URL'),
        '#default_value' => variable_get('sidora_codebook_parser_url', ''),
        '#description' => t('The location of codebook parser. Valid entry looks like this: http://&lt;server&gt;:&lt;port&gt;/codebook/?'),
      ),  
    ),
  );
  $legacy_items = array(
    'person' => 'Person',
    'research_project' => 'Research Project',
    'expedition' => 'Expedition',
    'research_site_or_area' => 'Research Site or Area',
    'camera_trap_deployment' => 'Camera Trap Deployment',
    'archaeology_site' => 'Archaeology Site',
    'camera_trap_plot' => 'Camera Trap Plot',
    'field_book_collection' => 'Field Book Collection',
    'cultural_heritage_entity_or_object' => 'Cultural Heritage Entity or Object',
    'camera_trap_image' => 'Camera Trap Image',
    'general_image' => 'General Image',
    'pdf' => 'Digitized Text PDF',
    'tabular_data_set_object' => 'Tabular Data Set Object'
    );
  $form_names = array('None' => 'Not Set');
  foreach($names as $form_info){ 
    $form_name = $form_info['name'];
    $form_names[$form_name] = $form_name;
  }
  foreach($legacy_items as $item => $name){
    $legacy_item_fieldset[] = array(
      '#type' => 'fieldset',
      '#title' => t($name),
      'sidora_legacy_' . $item . '_form' => array(
        '#type' => 'select',
        '#options' => $form_names,
        '#default_value' => variable_get('sidora_legacy_'.$item.'_form', ''),
      ),  
      );
  }
  $form['legacy_items_form_config'] = array(
    '#type' => 'fieldset',
    '#title' => 'Configure forms used by legacy items',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    'items' => $legacy_item_fieldset,
  );
  $form['si_smx_collapse'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'XSL for objects that have no XML Form',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_metadata_xsl' => array(
        '#type' => 'textarea',
        '#title' => t('XSL for transforming the object metadata into HTML for display on the "Metadata" display'),
        '#default_value' => variable_get('sidora_metadata_xsl', sidora_xsl_string(NULL)),
      ),
    ),
  );

  $form['site_administrator_contact'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Site administrator email',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'site_admin_email_to' => array(
        '#type' => 'textfield',
        '#title' => t('Send admin troubleshooting emails to'),
        '#default_value' => variable_get('site_admin_email_to', ''),
        '#description' => t('All admin emails are sent to this email address.'),
      ),
    ),
  );
  $form['external_access'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'External Servers',
      '#description' => t('These are the IPs of servers which are allowed to tell workbench that an update is needed on specified pids'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_trusted_external_servers' => array(
        '#type' => 'textfield',
        '#title' => t('Server IPs (comma seperated)'),
        '#default_value' => variable_get('sidora_trusted_external_servers', ''),
        '#description' => t('Server IPs (comma seperated)'),
      ),  
    ),
  );
  $form['sidora_user_page_info'] = array(
    '#type' => 'checkbox',
    '#title' => 'Show SIdora information on the user page',
    '#description' => t('This displays their "user object" and any managed codebooks.'),
    '#default_value' => variable_get('sidora_user_page_info', FALSE),
  );

  $form['debug'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Debug',
      '#description' => 'Debug options',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_allow_all_to_debug' => array(
        '#type' => 'textfield',
        '#title' => t('Allow all users access to debug'),
        '#default_value' => variable_get('sidora_allow_all_to_debug',''),
        '#description' => t('If set to "ALL" then all users have access to built-in sidora debug information.  Otherwise only administrators have access.'), //This was not stored as a "role" because we want to be able to give it to any user at the time the debugging happens then turn it off completely.  "ALL" here will give access to the sidora_testing functionality. In the future there may be different strings which give additional granularity
      ),
      'sidora_debug_clear_cache' => array(
        '#type' => 'checkbox',
        '#title' => t('Debug clear cache to watchdog log'),
        '#default_value' => variable_get('sidora_debug_clear_cache',FALSE),
        '#description' => t(''),
      ),
      'sidora_debug_turn_off_warnings' => array(
        '#type' => 'checkbox',
        '#title' => t('Turn off watchdog warnings about improper relationships'),
        '#default_value' => variable_get('sidora_debug_turn_off_warnings',FALSE),
        '#description' => t('Examples: no parent, no isAdministered link, links to objects that dont exist'),
      ),
    ),
  );
  $form['sidora_disable_locking_by_pid'] = array(
    '#type' => 'checkbox',
    '#title' => 'Disable locking',
    '#description' => t('Usually pids have locks to eliminate multiple users attempting to access it at one.  Checking this box turns off that feature.'),
    '#default_value' => variable_get('sidora_disable_locking_by_pid', ''),
  );
  $form['batch_url'] = array(
     'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Batch Ingest URL',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_batch_ingest_url' => array(
        '#type' => 'textfield',
        '#title' => t('Batch Metadata URL'),
        '#default_value' => variable_get('sidora_batch_ingest_url', ''),
        '#description' => t('The location of endpoint for initiating a batch ingest. Valid entry looks like this: http://&lt;server&gt;:&lt;port&gt;/batch/process/'),
      ),	
      'sidora_batch_status_url' => array(
        '#type' => 'textfield',
	'#title' => t('Batch Status URL'),
	'#default_value' => variable_get('sidora_batch_status_url', ''),
	'#description' => t('The location of endpoint for checking the status of a batch ingest. Valid entry looks like this: http://&lt;server&gt;:&lt;port&gt;/batch/newBatchResource/'),
     ),	
    ),
  );
  $form['fuseki_url'] = array(
     'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Fuseki URL',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_fuseki_url' => array(
        '#type' => 'textfield',
        '#title' => t('Fuseki url'),
        '#default_value' => variable_get('sidora_fuseki_url', ''),
        '#description' => t('The location of Fuseki endpoint. Valid entry looks like this: http://&lt;server&gt;:&lt;port&gt;/fuseki/dataset.html'),
      ),	
    ),
  );
  $form['sidora_check_node_info'] = array(
     'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Check Nodes Exist in Fedora',
      '#description' => t('Nodes that do not exist in Fedora will be unpublished. Check the unpublished nodes to delete them.'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_check_node_exist_start' => array(
        '#type' => 'textfield',
        '#title' => t('Node number'),
        '#description' => t('Start checking at this node number when seeing if the node exists in Fedora'),
        '#default_value' => variable_get('sidora_check_node_exist_start','1'),
      ),
      'sidora_check_node_exist_limit' => array(
        '#type' => 'textfield',
        '#title' => t('Number of nodes'),
        '#description' => t('Checking this number of nodes at a cron'),
        '#default_value' => variable_get('sidora_check_node_exist_limit','100'),
      ),
    ),
  );
  $form['#attributes'] = array('OnSubmit' => 'formPreSubmit();');
  $form['sidora_links'] = array(
    '#markup' => '<ul id="sidora-admin-links"><h2>Administrative Links</h2>
<li><a href="config_transfer">' . t('Config Transfer') . '</a>' . t(' Download or upload a SIdora configuration') . '</li>
<li><a href="fedora_object_issues">' . t('Fedora Object Issues') . '</a>' . t(' Check object issues have been found by the workbench (Malformed objects list)') . '</li>
<li><a href="fedora_sync">Choose when to set concept objects to resync with Fedora</a></li>
<li><a href="check_user_projects">' . t('Check User Projects') . '</a>' . t(' Check if the children of si:user-projects is out of sync with the Drupal users') . '</li>
<li><a href="update_xsl_db">' . t('Update Sidora XSLs in database') . '</a>' . t(' Update the Sidora XSLs in database (XSL file location - path_to_sidora/workbench/XSL/)') . '</li>
<li><a href="download_xsl">' . t('Download Sidora XSLs') . '</a>' . t(' Download all the SIdora XSLs from the database as an archive') . '</li> 
</ul>
<script>

jQuery(document).ready(function(){
  jQuery("#edit-actions").after(jQuery("#sidora-admin-links"));
});
</script>',
  );
  return system_settings_form($form);
}
