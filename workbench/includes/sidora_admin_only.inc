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

/*
 * This file contains functions that would only ever get called by administrators
 */


/*
 * Function which ingests an uploaded file directly to a named datastream.  This is originally designed for use with the
 * management UI
 */
function sidora_management_ingest($pid, $dsid, $label = NULL, $mimeType = NULL) {
  $object = sidora_obj($pid);
  if (empty($object)) {
    return;
  }
  $datastream = isset($object[$dsid]) ? $object[$dsid] : $object->constructDatastream($dsid);
  if ($label !== NULL) $datastream->label = $label; 
  // don't use empty() since we want to set it to empty string '' if user wants to
  if ($mimeType !== NULL) $datastream->mimeType = $mimeType;
  $current_uploads = sidora_create_resource_get_current_uploads();
  $datastream->setContentFromFile($current_uploads[0]->filepath);
  $object->ingestDatastream($datastream);
}

/*
 * Prints the management panel UI, prints an upload screen for the management UI, or saves a change from the management panel
 * based on the input settings
 * $pid - The PID of the object of interest
 * $show_or_save - one of the following:
 *               'new_dsid' - creates a new datastream based on the uploaded file with information in the POST
 *               'upload' - print the uploader html / js
 *               'remove' - does a purgeDatastream on a datastream
 *               'save' - saves the owner and label to the ones input on the management panel
 *               'show' or anything else - shows the management panel
 * $dsid_to_remove - lists the datastream id to use when doing a remove
 * $confirm_action - if empty then returns that a confirmation must be done, !empty will actually perform the purgeDatastream
 */
function sidora_management_panel($pid, $show_or_save = 'show', $dsid_to_remove = '', $confirm_action = FALSE){
  global $user;
   if ($show_or_save == 'upload_content'){
    if (!empty($pid)){
      $object = sidora_obj($pid);
      $dsid_to_remove = strtoupper('obj');
        $model_for_extensions = '*';
	$models = $object->models;
        $sidora_models = array('si:imageCModel','si:generalImageCModel','si:datasetCModel','si:fieldbookCModel','islandora:sp-audioCModel','islandora:sp_videoCModel','si:genericCModel','si:rawGeneSequenceCModel','si:assembledGeneSequenceCModel');
      foreach($models as $model){
          if (in_array($model, $sidora_models)){
            $model_for_extensions = $model;
	    break;
	 }
      }
      $to_return =  sidora_create_resource_get_upload_form_html($model_for_extensions, NULL, NULL, 'Update OBJ');
  drupal_add_css(drupal_get_path('module','sidora').'/css/workbench_create_resource.css',array('weight' => '1000000', 'group' => CSS_THEME));
  drupal_add_js(drupal_get_path('module','sidora').'/js/workbench_util.js',array('weight' => '1000000', 'group' => JS_THEME));
  drupal_add_js(drupal_get_path('module','sidora').'/js/workbench_uploader.js',array('weight' => '1000000', 'group' => JS_THEME));
    drupal_add_js('
       submitIt = function(){
       jQuery(".form-submit").attr("disabled",true);
       var postData = "identifier=OBJ"+"&state=A";
	 jQuery.ajax({ 
         type: "POST",
         url: window.location.href.substring(0,window.location.href.lastIndexOf("/",window.location.href.length-5)+1)+"new_dsid",
         data: postData,
         success: function(){
	 window.parent.jQuery("#addDatastreamDialog").dialog("close");
	 window.parent.sidora.resources.refreshResourceThumbnail("' . $pid . '");
         }
       });
       }
       jQuery(document).ready(function(){
         var tableHtml = "<table style=\"display: none; visibility: hidden;\">";
         tableHtml +=  "<tr><td>Label:</td><td><input id=\"dsl\" value=\"\" type=\"text\" style=\"border:solid 1px lightblue;\"></td></tr>";
         tableHtml += "</table>";
         //jQuery("#create-resource-upload").append(tableHtml);
         jQuery(".form-submit").remove();
         jQuery(".non-bulk").remove();
         jQuery("#create-resource-upload").append("<input class=\"form-submit\" value=\"Update Content\" onclick=\"submitIt();\">");
         uploader.bind("FilesAdded", function(up, files) {
           jQuery("#filelist").html("");
         });
         uploader.bind("FileUploaded", function() {
          if (uploader.files.length == (uploader.total.uploaded + uploader.total.failed)) {
           while (jQuery("#filelist div").length > 1){
            jQuery(jQuery("#filelist div")[0]).remove();
           }
          }
         });
       });
       ',array('type' => 'inline', 'weight' => '1000000', 'group' => JS_THEME));
       return $to_return;
    }
	}
  if ($show_or_save == 'new_dsid'){
    if (!sidora_allow($user,$pid,'update')) {
      return 'This user is not authorized to change this object';
    } 
    $label = filter_input(INPUT_POST, 'label', FILTER_SANITIZE_STRING);
    $identifier = filter_input(INPUT_POST, 'identifier', FILTER_SANITIZE_URL);
    $state = filter_input(INPUT_POST, 'state', FILTER_SANITIZE_URL);
    $mime_detect = new MimeDetect();
    $current_uploads = sidora_create_resource_get_current_uploads();
    $mimeType = $mime_detect->getMimeType($current_uploads[0]->filepath);
    if (strtoupper($identifier) == 'OBJ'){
      $object = sidora_obj($pid);
      if (!$object[$identifier]->versionable){
       $object[$identifier]->versionable = true;
      }
      if (empty($label)){
        $label = $current_uploads[0]->filename;
      }
    }
    sidora_management_ingest($pid, $identifier, $label, $mimeType);
    $to_return = 'complete';
    return $to_return;
  }
  if (($show_or_save == 'upload') && sidora_is_admin()){
    $to_return =  sidora_create_resource_get_upload_form_html('*', NULL, NULL, 'Upload File');
  drupal_add_css(drupal_get_path('module','sidora').'/css/workbench_create_resource.css',array('weight' => '1000000', 'group' => CSS_THEME));
  drupal_add_js(drupal_get_path('module','sidora').'/js/workbench_util.js',array('weight' => '1000000', 'group' => JS_THEME));
  drupal_add_js(drupal_get_path('module','sidora').'/js/workbench_uploader.js',array('weight' => '1000000', 'group' => JS_THEME));
      drupal_add_js('
        submitIt = function(){
        var postData = "label="+jQuery("#dsl").val()+"&identifier="+jQuery("#dsi").val()+"&state="+jQuery("#state").val();
        jQuery.ajax({ 
         type: "POST",
         url: window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+"new_dsid",
         data: postData,
         success: function(){
          window.parent.jQuery("#addDatastreamDialog").dialog("close");
          window.parent.sidora.manage.resetFrame();
         }
       });
      }
      jQuery(document).ready(function(){
       var tableHtml = "<table>";
       tableHtml +=  "<tr><td>Identifier:</td><td><input id=\"dsi\" value=\"\" type=\"text\" style=\"border:solid 1px lightblue;\"></td></tr>";
       tableHtml +=  "<tr><td>Label:</td><td><input id=\"dsl\" value=\"\" type=\"text\" style=\"border:solid 1px lightblue;\"></td></tr>";
       tableHtml +=  "<tr><td>State:</td><td><select id=\"dss\"><option value=\"A\">Active</option><option value=\"I\">Inactive</option></select></td></tr>";
  tableHtml += "</table>";
  jQuery("#create-resource-upload").append(tableHtml);
  jQuery(".form-submit").remove();
  jQuery("#create-resource-upload").append("<input class=\"form-submit\" value=\"Add\" onclick=\"submitIt();\">");
  uploader.bind("FilesAdded", function(up, files) {
    jQuery("#filelist").html("");
    while (up.files.length > 1) {
        up.removeFile(up.files[0]);
    }
  });
  uploader.bind("FileUploaded", function() {
    if (uploader.files.length == (uploader.total.uploaded + uploader.total.failed)) {
      while (jQuery("#filelist div").length > 1){
        jQuery(jQuery("#filelist div")[0]).remove();
      }
    }
  });

});
',array('type' => 'inline', 'weight' => '1000000', 'group' => JS_THEME));
    return $to_return;
  }
  if (($show_or_save == 'remove') && sidora_is_admin()){
    if (empty($confirm_action)){
      return t('This action cannot be undone.  Are you sure?');
    }
    if (!empty($dsid_to_remove)){
      $object = sidora_obj($pid);
      if (empty($object)){ drupal_not_found(); }
      $object->purgeDatastream($dsid_to_remove);
    }
    return 'DS purge complete';
  }
  if (($show_or_save == 'save') && sidora_is_admin()){
    if (!sidora_allow($user,$pid,'update')) drupal_not_found();
    $label = filter_input(INPUT_POST, 'label', FILTER_SANITIZE_STRING);
    $owner = filter_input(INPUT_POST, 'owner', FILTER_SANITIZE_URL);
    $object = sidora_obj($pid);
    if (empty($object)){ drupal_not_found(); }
    if ($label != $object->label){
      sidora_clear_tree_cache($pid);
      $object->label = $label;
    }
    if ($owner != $object->owner){
      $object->owner = $owner;
    }
    return;
  }
  if (!sidora_allow($user,$pid,'view')) drupal_not_found();
  if (!sidora_is_admin()) drupal_not_found();
  $object = sidora_obj($pid);
  if (empty($object)){ drupal_not_found(); }
  print '
<style>
.object-properties {
  padding: 15px;
}
</style>
<div id="objectManagement" style="
    position: absolute;
    background: whitesmoke;
    width:100%;
    height:100%;
    overflow: auto;
"><div id="objectManagementObjProperties" class="object-properties"><table>
    <tbody><tr><td>Label:</td><td><input type="text" name="label" style="border: solid 1px lightblue;" id="objPropLabel" value="'.$object->label.'" size="50"></td></tr>
    <tr><td>Owner:</td><td><input type="text" name="owner" style="border: solid 1px lightblue;" id="objPropOwner" value="'.$object->owner.'" size="50"></td></tr>
    <tr><td>State:</td><td><input type="text" name="" disabled="disabled" value="'.$object->state.'" size="50"></td></tr>
    <tr><td>Date Created:</td><td><input type="text" name="ok" disabled="disabled" value="'.$object->createdDate.'" size="50"></td></tr>
    <tr><td>Last Modified:</td><td><input type="text" name="ok" disabled="disabled"  value="'.$object->lastModifiedDate.'" size="50"></td></tr>
  </tbody></table>
  <input class="form-submit" value="Save Changes" onclick="" id="submitObjProperties"></div>
<div id="objectManagementDatastreams" class="object-properties"><table>
    <tbody><tr><th>ID</th><th>Label</th><th>State</th><th>Mime Type</th><th>Date Created</th><th>Versions</th><th>Actions</th></tr>
';
  foreach($object as $dsid=>$datastream){
    print '<tr><td>'.$datastream->id.'</td><td>'.$datastream->label.'</td><td>'.$datastream->state.'</td><td>'.$datastream->mimetype.'</td><td>'.$datastream->createdDate.'</td><td>';
    if ($datastream->versionable) {
      print '<a href="javascript:void(0);" class="versionHistory" datastream="' . $datastream->id . '" pid="' . $datastream->parent->id . '">'.count($datastream).'</a> ';
    }
    print '</td><td>';
    $viewer_filename = $datastream->id.'.';
    if (strpos($datastream->mimetype,'image/') === 0)
      $viewer_filename .= substr($datastream->mimetype,6);
    else
      $viewer_filename .= 'txt'; //Attempt to have the browser view any other type of file
    print '<a href="'.base_path().'sidora/info/'.$pid.'/meta/'.$datastream->id.'/download">Download</a> ';
    print '<a href="'.base_path().'sidora/info/'.$pid.'/meta/'.$datastream->id.'/browser/'.$viewer_filename.'" target="_blank">View</a> ';
    print '<a href="#" onclick="window.sidora.manage.removeDatastream(\''.$pid.'\',\''.$datastream->id.'\'); return false;">Remove</a> ';
    print '</td></tr>'."\n";
  }
  print '
    </tbody></table>
    <input class="form-submit" value="Add Datastream" onclick="" id="addDatastream">
    </div></div>
';
  drupal_exit();
}

/*
 * Sets the SIdora instance with the imported information
 * Assumes the same style as sidora_settings_object() would produce
 * If the parameter value is a string, assumes it is a json string to decode
 * ignore_settings
 * dry_run will not make any changes, just give the messages
 *
 */
function sidora_settings_import($object, $settings = array(), $dry_run = TRUE) {
  $ignore_settings           = isset($settings['ignore_settings']) ?           $settings['ignore_settings']            : array();
  $only_apply_settings       = isset($settings['only_apply_settings']) ?       $settings['only_apply_settings']        : array();
  $show_ignores_as_warnings  = isset($settings['how_ignores_as_warnings']) ?   $settings['show_ignores_as_warnings']   : FALSE;
  $process_forms             = isset($settings['process_forms']) ?             $settings['process_forms']              : TRUE;
  $process_form_associations = isset($settings['process_form_associations']) ? $settings['process_form_associations']  : TRUE;
  $process_admin_settings    = isset($settings['process_admin_settings']) ?    $settings['process_admin_settings']     : TRUE;
  $process_xslts             = isset($settings['process_xslts']) ?             $settings['process_xslts']              : TRUE;
  $ignore_message_type = $show_ignores_as_warnings?'warning':'status';
  // make the comparisons case insensitive by having all lower
  $ignore_settings = array_map('strtolower',$ignore_settings);
  $only_apply_settings = array_filter(array_map('strtolower',$only_apply_settings));
  if (is_string($object)) {
    $object = json_decode($object);
  }

  $dry_run_prefix = ($dry_run)?t('DRY RUN, NO CHANGE:'):'';

  // $full_export['forms'] = $forms;
  // $full_export['associations'] = $associations;
  // $full_export['admin_settings'] = $settings_holder;
  $forms = ($process_forms) ? $object->forms : array();
  $associations = ($process_form_associations) ? $object->associations : array();
  $xslts = ($process_xslts) ? $object->xslt : array();
  $admin_settings = ($process_admin_settings) ? $object->admin_settings : array();
  module_load_include('inc', 'xml_form_builder', 'XMLFormRepository');
  module_load_include('inc', 'xml_form_builder', 'XMLFormDatabase');
  module_load_include('inc', 'xml_form_builder', 'includes/associations');
  foreach ($forms as $form_name=>$form_string) {
    if (
      !in_array(strtolower($form_name),$ignore_settings)
      &&
      (empty($only_apply_settings) || sidora_contains($form_name,$only_apply_settings,TRUE))
    ) {
      $definition = new DOMDocument();
      $definition->loadXML($form_string);
      $success_delete = ($dry_run || XMLFormDatabase::Delete($form_name));
      if ($success_delete) {
        foreach (xml_form_builder_get_associations(array($form_name)) as $assoc) {
          if (!$dry_run) {
            db_delete('xml_form_builder_form_associations')
            ->condition('id', intval($assoc['id']))
            ->execute();
          }
          drupal_set_message($dry_run_prefix . t('Deleted the association ID:%id with the form %form_name.', array(
            '%id' => $assoc['id'],
            '%form_name' => $form_name,
          )));
        }
        drupal_set_message($dry_run_prefix . t('Successfully deleted form "%name" in order to reimport it.', array('%name' => $form_name)));
      }
      $create_success = ($dry_run || XMLFormRepository::Create($form_name, $definition));
      if ($create_success) {
        drupal_set_message($dry_run_prefix . t('Successfully imported form "%name".', array('%name' => $form_name)));
      }
      else {
        drupal_set_message($dry_run_prefix . t('FAILED imported on form "%name".', array('%name' => $form_name)),'error');
      }
   }
   else {
     drupal_set_message($dry_run_prefix . t('Ignored form "%name".', array('%name' => $form_name)),$ignore_message_type);
   }
  }
  foreach ($associations as $association) {
    $a_object = array(
      'content_model' => $association->content_model,
      'form_name' => $association->form_name,
      'dsid' => $association->dsid,
      'title_field' => serialize((array)($association->title_field)),
      'transform' => $association->transform,
      'self_transform' => $association->self_transform,
      'template' => $association->template,
    );
    $form_name = $association->form_name;
    $model = $association->content_model;
    $setting_name_for_ignore = $association->content_model.'-'.$association->form_name;
    if (
      !in_array(strtolower($setting_name_for_ignore),$ignore_settings)
      &&
      (empty($only_apply_settings) || sidora_contains($setting_name_for_ignore,$only_apply_settings,TRUE))
    ) {
      $insert_success = ( $dry_run ||
        db_insert('xml_form_builder_form_associations')
        ->fields($a_object)
        ->execute()
      );
      if ($insert_success) {
        drupal_set_message($dry_run_prefix . t('Successfully imported form association "%name" to "%model" ( "%model-%name"  ).', array('%name' => $form_name, '%model' => $model)));
      }
      else {
        drupal_set_message($dry_run_prefix . t('FAILED import form association "%name" to "%model" ( "%model-%name"  ).', array('%name' => $form_name, '%model' => $model)),'error');
      }
    }
    else {
      drupal_set_message($dry_run_prefix . t('Ignored association "%name" to "%model" ( "%model-%name"  ).', array('%name' => $form_name, '%model' => $model)),$ignore_message_type);
    }
  }
  if ($process_xslts) {
    $setting_name_for_ignore = 'sidora_xslts';
    if (
      !in_array(strtolower($setting_name_for_ignore),$ignore_settings)
      &&
      (empty($only_apply_settings) || sidora_contains($setting_name_for_ignore,$only_apply_settings,TRUE))
      ) {
        if (!($dry_run)) {
	 db_truncate('sidora_xsl')->execute();
	}	 
	$truncate_success = ( $dry_run || (db_query('select count(*) from {sidora_xsl}')->fetchField() == '0'));
        if ($truncate_success) {
	  foreach ($xslts as $xslt_name => $xslt_definition) {
           $insert_success = ( $dry_run ||
             db_insert('sidora_xsl')
               ->fields(array('form_name' => $xslt_name, 'form_definition' => $xslt_definition,'updated' => date('Y-m-d H:i:s'),))
               ->execute()
              );
            if ($insert_success) {
              drupal_set_message($dry_run_prefix . t('Successfully imported xslt "%name".', array('%name' => $xslt_name)));
            }
            else {
              drupal_set_message($dry_run_prefix . t('FAILED imported on xslt "%name".', array('%name' => $xslt_name)),'error');
            }
	  }
	}
	else {
        drupal_set_message($dry_run_prefix . t('FAILED to delete existing xslts in database.'),'error');
        }
      }
      else {
        drupal_set_message($dry_run_prefix . t('Ignored xslts'),$ignore_message_type);
      }
    } 	   
    foreach ($admin_settings as $setting_name=>$setting_value) {
      if (
      !in_array(strtolower($setting_name),$ignore_settings)
      &&
      (empty($only_apply_settings) || sidora_contains($setting_name,$only_apply_settings,TRUE))
      ) {
        $original_value = variable_get($setting_name);
        if (json_encode($original_value) === json_encode($setting_value)) {
          drupal_set_message($dry_run_prefix . t('Administrative setting "%name" was already set to the content specified in this configuration.',array('%name' => json_encode($setting_name))));
        }
         else {
            if (!$dry_run) variable_set($setting_name,$setting_value);
            drupal_set_message($dry_run_prefix . t('Administrative setting "%name" set from <br/>"%original" <br/>to <br/>"%newval".',array('%name' => $setting_name,'%original'=>json_encode($original_value),'%newval'=>json_encode($setting_value))));
         }
       }
       else {
         drupal_set_message($dry_run_prefix . t('Ignored administrative setting "%name".',array('%name' => $setting_name)),$ignore_message_type);
       }
     }
}

/*
 * Downloads the current SIdora Fedora object issues or shows a form to view the issues
 */
function sidora_fedora_object_issues($direct_download = "") {

  $download_filename = 'object_issues.json';
  if ($direct_download == $download_filename) {
    header("Content-type: application/json");
    header("Content-Disposition: attachment; filename=\"$download_filename\"");
    $assumption_problems = variable_get('sidora_assumption_problems',t('Problems list is empty'));
    module_load_include('php', 'sidora', 'includes/json_readable_encode');
    print json_readable_encode($assumption_problems, 0);
    drupal_exit();
  }
  else {
    $form = drupal_get_form('sidora_fedora_object_issues_form');
    $download_link = '<a href="fedora_object_issues/'.$download_filename.'">Download current issues</a>';
    return $download_link.drupal_render($form);
  }
}

/*
 * Form for displaying SIdora Fedora object issues
 */
function sidora_fedora_object_issues_form($form, &$form_state) {
  
  $assumption_problems = variable_get('sidora_assumption_problems',array(
    'object_issues' => array(),
    'relationship_issues' => array(),
    'other_issues' => array(),
  ));
  $output = '';
  $issue_pids = $assumption_problems['object_issues'];
  $header = array();
  $header[] = array('data' => t('Pid'));
  $header[] = array('data' => t('Description'));
  $header[] = array('data' => t('Time'));
  $rows = array();
  foreach ($issue_pids as $pid => $pid_issues) {
    foreach ($pid_issues as $issue) {
      $rows[] = array(
        array('data' => $pid),
        array('data' => $issue['description']),
        array('data' => $issue['time']),
      );
    }
  }
  $table_attributes = array('id' => 'sidora_object_issues');
  $output .= theme('table', array('header'=>$header, 'rows'=>$rows, 'attributes'=>$table_attributes));

  $issue_pids = $assumption_problems['relationship_issues'];
  $header = array();
  $header[] = array('data' => t('Pid'));
  $header[] = array('data' => t('Description'));
  $header[] = array('data' => t('DSID'));
  $header[] = array('data' => t('Predicate'));
  $header[] = array('data' => t('Time'));
  $rows = array();
  foreach ($issue_pids as $pid => $pid_issues) {
    foreach ($pid_issues as $issue) {
      $rows[] = array(
        array('data' => $pid),
        array('data' => $issue['description']),
        array('data' => $issue['dsid']),
        array('data' => $issue['predicate_object']),
        array('data' => $issue['time']),
      );
    }
  }
  $table_attributes = array('id' => 'sidora_relationship_issues');
  $output .= theme('table', array('header'=>$header, 'rows'=>$rows, 'attributes'=>$table_attributes));

  $issues = $assumption_problems['other_issues'];
  $header = array();
  $header[] = array('data' => t('Number'));
  $header[] = array('data' => t('Description'));
  $header[] = array('data' => t('Pids Involved'));
  $header[] = array('data' => t('Time'));
  $rows = array();
  foreach ($issues as $num => $issue) {
    $rows[] = array(
      array('data' => $num),
      array('data' => $issue['description']),
      array('data' => implode(', ',$issue['pids_involved'])),
      array('data' => $issue['time']),
    );
  }
  $table_attributes = array('id' => 'sidora_other_issues');
  $output .= theme('table', array('header'=>$header, 'rows'=>$rows, 'attributes'=>$table_attributes));
  $stop_milli = variable_get('sidora_log_assumption_stop',0);
  $form['log_assumption_stop'] = array(
    '#title' => 'Log assumption issues for the following number of seconds:', 
    '#description' => '86400 = day, 604800 = week.',
    '#type' => 'textfield',
    '#default_value' => max(0,(int)($stop_milli - microtime(true))),
  );

  $form['clear_pids'] = array(
    '#type' => 'textarea',
    '#title' => t('List of pids to clear from the issues'),
    '#description' => t('Put in pids to clear, one pid per line. Put the word ALL without quotes to clear the entire list. Items in the "Other Issues" table can only be cleared by the ALL clear.'),
    '#prefix' => $output,
  );
  $form['submit'] = array(  
  // ensure this aligns with information in the validator on the #id check
    '#type' => 'submit',
    '#value' => t('Clear the listed Pids'),
  );
  return $form;
}

/*
 * Clears specific or all entries in the object issues list
 */
function sidora_fedora_object_issues_form_submit($form, &$form_state) {
  global $user;
  $empty_problems = array(
    'object_issues' => array(),
    'relationship_issues' => array(),
    'other_issues' => array(),
  );
  variable_set('sidora_log_assumption_stop',(int)microtime(true) + (int)$form_state['values']['log_assumption_stop']);

  if ($form_state['values']['clear_pids'] == 'ALL') {
    variable_set('sidora_assumption_problems',$empty_problems);
    drupal_set_message(t('The Fedora object issues list has been emptied'));
  }
  else {
    $assumption_problems = variable_get('sidora_assumption_problems',$empty_problems);
    $pids = array_map('trim', explode("\n",$form_state['values']['clear_pids'])); 
    // Explode it and trim any whitespace
    foreach ($pids as $pid) {
      if (!empty($pid)) {
        unset($assumption_problems['object_issues'][$pid]);
        unset($assumption_problems['relationship_issues'][$pid]);
        drupal_set_message(t('The Fedora object issues list has removed items under Pid:%pid',array('%pid' => $pid)));
      }
    }
    variable_set('sidora_assumption_problems',$assumption_problems);
  }
}


/*
 * Downloads the current SIdora configuration or shows a form to allow importing a configuration
 */
function sidora_config_transfer($direct_download = "") {
  global $base_url;
  $download_filename = 'site_config_from_';
  $alpha_base_url = preg_replace('/[^a-zA-z0-9]/', '-', $base_url);
  $alpha_base_url = preg_replace('/-+/', '-', $alpha_base_url);
  $download_filename .= $alpha_base_url . '.json';
  if ($direct_download == $download_filename) {
    $sidora_settings_object = sidora_settings_object();
    header("Content-type: application/json");
    header("Content-Disposition: attachment; filename=\"$download_filename\"");
    $sso_json = json_encode($sidora_settings_object);
    print sidora_pretty_json($sso_json);
    drupal_exit();
  }
  elseif (array_key_exists('useLastDryRunAsConfigSource', $_GET) && $_GET['useLastDryRunAsConfigSource'] === 'true') {
      $filepath = $_SESSION['sidora_uploaded_json_config']['object_filepath'];
      $file_contents = file_get_contents($filepath);
      $object = json_decode($file_contents);
      sidora_settings_import($object,$_SESSION['sidora_uploaded_json_config'],FALSE);
      drupal_goto('admin/sidora/config_transfer');
  }
  else {
    $form = drupal_get_form('sidora_config_form');
    $download_link = '<a href="config_transfer/'.$download_filename.'">Download current config</a>';
    $sidora_settings_object = sidora_settings_object();
    $servers_table = '<h3>Servers listing (These setting names should probably be in the "Ignore these settings if in the import file" text area above.)</h3><table id="sidora-server-table"><tr><th>Setting Name</th><th>Setting Value</th></tr>';
    foreach ($sidora_settings_object['admin_settings'] as $setting_name => $value) {
      if (is_string($value) && sidora_startsWith($value, 'http')) {
        $servers_table .= '<tr><td>' . $setting_name . '</td><td>' . $value . '</td></tr>';
      }
    }
    $servers_table .= '</table>';
  $all_setting_indexes = '<h3>All Drupal Settings names</h3><table>';
  global $conf;
  foreach ($conf as $drupal_setting_index=>$drupal_setting) {
    $all_setting_indexes .= '<tr><td>' . $drupal_setting_index . '</td></tr>';
  }
  $all_setting_indexes .= '</table>';
    $current_settings_info = '<h2>Current Settings Information</h2>';
    $current_settings_info .= $servers_table;
    if (array_key_exists('showAllDrupalSettings', $_GET) && $_GET['showAllDrupalSettings'] === 'true') {
      $current_settings_info .= $all_setting_indexes;
    }
    else {
      $current_settings_info .= '<br/><a href="?showAllDrupalSettings=true"> Show all the Drupal settings names </a>';
    }
    $to_return = $download_link.drupal_render($form).$current_settings_info;
  }
  return $to_return;
}

/*
 * Form for uploading a configuration file to import settings from a previously saved SIdora configuration or saved from
 * a different server
 */
function sidora_config_form($form, &$form_state) {
  $form['file'] = array(
    '#type' => 'file',
    '#title' => t('Config File'),
    '#description' => t('This configuration will be immediately applied on clicking the "Import" button below.'),
  );
  $form['show_ignores_as_warnings'] = array(
    '#type' =>'checkbox',
    '#title'=>t('Show ignores as warnings (otherwise will appear as normal message info)'),
    '#default_value' =>TRUE, 
    // for default checked and false is not checked
  );
  $form['dry_run'] = array(
    '#type' =>'checkbox',
    '#title'=>t('Dry Run (do not actually make changes)'),
    '#default_value' =>TRUE, 
    // for default checked and false is not checked
  );
  $form['process_forms'] = array(
    '#type' =>'checkbox',
    '#title'=>t('Process Forms'),
    '#default_value' => variable_get('sidora_config_process_forms',TRUE),
  );
  $form['process_form_associations'] = array(
    '#type' =>'checkbox',
    '#title'=>t('Process Form Associations'),
    '#default_value' => variable_get('sidora_config_process_form_associations',TRUE),
  );
  $form['process_xslts'] = array(
    '#type' =>'checkbox',
    '#title'=>t('Process SIdora XSLTs'),
    '#default_value' => variable_get('sidora_config_process_xslts',TRUE),
  );
  $form['process_admin_settings'] = array(
    '#type' =>'checkbox',
    '#title'=>t('Process Administrative Settings'),
    '#default_value' => variable_get('sidora_config_process_admin_settings',TRUE),
  );
  $form['only_apply_settings'] = array(
    '#type' => 'textarea',
    '#title' => t('Only apply settings that have one of the following in the name'),
    '#description' => t('Put parts of names of the settings one per line (form name / model-form name / variable name)'),
    '#default_value' => variable_get("sidora_config_only_apply",""),
  );
  $form['ignore_settings'] = array(
    '#type' => 'textarea',
    '#title' => t('Ignore these settings if in the import file'),
    '#description' => t('Put the names of the settings one per line (form name / model-form name / variable name)'),
    '#default_value' => variable_get("sidora_config_import_ignores","si_exhibition_website_location\nosd_proxy_resolver_url"),
  );
  $form['upload_submit'] = array(  
  // ensure this aligns with information in the validator on the #id check
    '#type' => 'submit',
    '#value' => t('Import And Apply Config File'),
  );
  return $form;
}

/*
 * Imports the file into the system configuration
 */
function sidora_config_form_submit($form, &$form_state) {
  global $user;
  $validators = array('file_validate_extensions' => array('json txt'));
  $file = file_save_upload('file',$validators);
  variable_set("sidora_config_import_ignores",$form_state['values']['ignore_settings']);
  variable_set("sidora_config_only_apply",$form_state['values']['only_apply_settings']);
  variable_set("sidora_config_process_forms",$form_state['values']['process_forms']);
  variable_set("sidora_config_process_form_associations",$form_state['values']['process_form_associations']);
  variable_set("sidora_config_process_admin_settings",$form_state['values']['process_admin_settings']);
  variable_set("sidora_config_process_xslts",$form_state['values']['process_xslts']);
  $process_forms = $form_state['values']['process_forms'];
  $process_form_associations = $form_state['values']['process_form_associations'];
  $process_xslts = $form_state['values']['process_xslts'];
  $process_admin_settings = $form_state['values']['process_admin_settings'];
  $ignore_settings = array_map('trim', explode("\n",$form_state['values']['ignore_settings'])); 
  // Explode it and trim any whitespace
  $ignore_settings = array_map('trim', explode("\n",$form_state['values']['ignore_settings'])); 
  // Explode it and trim any whitespace
  $only_apply_settings = array_map('trim', explode("\n",$form_state['values']['only_apply_settings'])); 
  // Explode it and trim any whitespace
  $dry_run = $form_state['values']['dry_run'];
  $show_ignores_as_warnings = $form_state['values']['show_ignores_as_warnings'];
  if (!empty($file)) {
    $filepath = drupal_realpath($file->uri);
    $file_contents = file_get_contents($filepath);
    $object = json_decode($file_contents);
    $_SESSION['sidora_uploaded_json_config'] = array();
    $_SESSION['sidora_uploaded_json_config']['object_filepath'] = $filepath;
    $_SESSION['sidora_uploaded_json_config']['ignore_settings'] = $ignore_settings;
    $_SESSION['sidora_uploaded_json_config']['only_apply_settings'] = $only_apply_settings;
    $_SESSION['sidora_uploaded_json_config']['dry_run'] = $dry_run;
    $_SESSION['sidora_uploaded_json_config']['show_ignores_as_warnings'] = $show_ignores_as_warnings;
    $_SESSION['sidora_uploaded_json_config']['process_forms'] = $process_forms;
    $_SESSION['sidora_uploaded_json_config']['process_form_associations'] = $process_form_associations;
    $_SESSION['sidora_uploaded_json_config']['process_admin_settings'] = $process_admin_settings;
    $_SESSION['sidora_uploaded_json_config']['process_xslts'] = $process_xslts;
    sidora_settings_import($object,$_SESSION['sidora_uploaded_json_config'],$dry_run);

    if ($dry_run) drupal_set_message('Update the configuration of server with the configuration used in the dry run by clicking this link: <a href="?useLastDryRunAsConfigSource=true">Use the Dry Run config</a>','whitebox');
  }
}

/*
 * Returns an object for moving settings between SIdora instances
 */
//function sidora_settings_object($ignore_list = array('si_exhibition_website_location','osd_proxy_resolver_url')) {
function sidora_settings_object($ignore_list = array()) {
  global $conf;
  $starts_with = array();
  $starts_with[] = 'resource_viewer_dsid_';
  $starts_with[] = 'resource_viewer_viewer_';
  $starts_with[] = 'islandora_';
  $starts_with[] = 'sidora_';
  $starts_with[] = 'si_exhibition_';
  $exact_match = array();
  $exact_match[] = 'si_exhibition_website_location';
  $exact_match[] = 'sidora_ontology_json';
  $exact_match[] = 'sidora_resource_ontology_json';
  $exact_match[] = 'xsl_form_config';
  $exact_match[] = 'sidora_login_message';
  $exact_match[] = 'sidora_automatic_person_model';
  $exact_match[] = 'sidora_automatic_person_form';
  $exact_match[] = 'sidora_automatic_person_dsid';
  $exact_match[] = 'osd_proxy_pid_prefix';
  $exact_match[] = 'osd_proxy_pid_postfix';
  $exact_match[] = 'osd_proxy_resolver_url';
  $exact_match[] = 'account_request_email_to';
  $exact_match[] = 'account_request_email_from';
  $exact_match[] = 'site_admin_email_to';
  $settings_holder = array();
  foreach ($conf as $drupal_setting_index=>$drupal_setting) {
    if (in_array($drupal_setting_index,$exact_match) && !in_array($drupal_setting_index,$ignore_list)) {
      $settings_holder[$drupal_setting_index] = $drupal_setting;
    }
    foreach ($starts_with as $sw_check) {
      if (!in_array($starts_with,$ignore_list)) {
        if (strpos($drupal_setting_index, $sw_check) === 0) {
          $settings_holder[$drupal_setting_index] = $drupal_setting;
        }
      }
    }
  }
  module_load_include('inc', 'xml_form_builder', 'XMLFormRepository');
  module_load_include('inc', 'xml_form_builder', 'includes/associations');
  $names = XMLFormRepository::GetNames();
  $associations = xml_form_builder_get_associations($names, array(), array(), FALSE);
  $forms = array();
  foreach ($names as $form_info) {
    $form_name = $form_info['name'];
    if ($form_info['indb']) {
      $definition = XMLFormRepository::Get($form_name);
      $definition->formatOutput = TRUE;
      $form_string = $definition->saveXML();
      $forms[$form_name] = $form_string;
    }
  }
  $xslt = array();
  if (db_table_exists('sidora_xsl')) {
    $get_xsl_records = db_query("select form_name, form_definition from sidora_xsl");
    foreach ($get_xsl_records as $xsl_form_record) {
      if (sidora_endsWith(strtolower($xsl_form_record->form_name), ".xsl")) {
        $xslt[$xsl_form_record->form_name] = $xsl_form_record->form_definition;
      }
    }
  }
  $full_export = array();
  $full_export['forms'] = $forms;
  $full_export['associations'] = $associations;
  $full_export['admin_settings'] = $settings_holder;
  $full_export['xslt'] = $xslt;
  return $full_export;
}

/**
 * Implements hook_xml_form_builder_get_self_transforms of the XML Form Builder module
 * This allows admins to pick these transforms when using the XML Form Builder
 */
function sidora_hook_xml_form_builder_get_self_transforms() {
  $mp_prefix = realpath('.');
  // All of the following were NOT correct ways to get to the file system path.  Included for future reference:
  // file_default_scheme(); 
  // file_create_url(file_default_scheme()."://");//file_directory_path();//base_path();//$_SERVER['DOCUMENT_ROOT'].base_path();
  $t_dir = $mp_prefix.'/sites/all/modules/sidora_specific/self_transforms';
  $to_return = array();
  if (file_exists($t_dir)) {
    $files = array_diff(scandir($t_dir),array('..','.'));
    foreach ($files as $file) {
      $to_return[$file] = "$mp_prefix/sites/all/modules/sidora_specific/self_transforms/$file";
    }
  }
  return $to_return;
}

/**
 * Implements hook_xml_form_builder_get_transforms of the XML Form Builder module
 * This allows admins to pick these transforms when using the XML Form Builder
 */
function sidora_hook_xml_form_builder_get_transforms() {
  $mp_prefix = realpath('.');
  // All of the following were NOT correct ways to get to the file system path.  Included for future reference:
  // file_default_scheme(); 
  // file_create_url(file_default_scheme()."://");//file_directory_path();//base_path();//$_SERVER['DOCUMENT_ROOT'].base_path();
  $t_dir = $mp_prefix.'/sites/all/modules/sidora_specific/transforms';
  $to_return = array();
  if (file_exists($t_dir)) {
    $files = array_diff(scandir($t_dir),array('..','.'));
    foreach ($files as $file) {
      $to_return[$file] = "$mp_prefix/sites/all/modules/sidora_specific/transforms/$file";
    }
  }
  return $to_return;
  /* For reference, how to include items in the returned array
  return array(
    'customCT_to_dc.xsl' => "$module_path/transforms/customCT_to_dc.xsl",
    'darwinCore_to_dublinCore_ver5.xsl' => "$module_path/transforms/darwinCore_to_dublinCore_ver5.xsl",
    'dc_no_transform.xsl' => "$module_path/transforms/dc_no_transform.xsl",
    'dwc_to_dc.xsl' => "$module_path/transforms/dwc_to_dc.xsl",
    'eaccpf_to_dc.xsl' => "$module_path/transforms/eaccpf_to_dc.xsl",
    'eac_to_dc.xsl' => "$module_path/transforms/eac_to_dc.xsl",
    'fgdc_to_dc.xsl' => "$module_path/transforms/fgdc_to_dc.xsl",
  );
  */
}

