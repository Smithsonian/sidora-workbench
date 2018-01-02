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
defined("SIDORA_OBJECT_DOES_NOT_EXIST") or define('SIDORA_OBJECT_DOES_NOT_EXIST',"This object is not in the repository");
defined("SIDORA_MULTIPARENT") or define('SIDORA_MULTIPARENT',"This object has multiple incoming hasConcept / hasResource links");
defined("SIDORA_UNPROCESSED") or define('SIDORA_UNPROCESSED',"PID already has isAdministeredBy or does not have exactly 1 parent");

/*
 * Main function to give user access to run the code below
 */
function sidora_migration_options($one = '', $two = '') {
  if ($one == 'convert_user_projects') {
    module_load_include('inc', 'sidora', 'includes/ps_migration');
    sidora_project_space_convert_all_under_siuserprojects($two);
    exit();
  }
  if ($one == 'convert_concept') {
    print 'converting...';
    module_load_include('inc', 'sidora', 'includes/ps_migration');
    $converted = sidora_project_space_convert_concept($two);
    if ($converted) {
      print 'Converted';
    }
    else {
      print 'Error or object not found';
    }
    exit();
  }
  if ($one == 'incoming_links') {
    module_load_include('inc', 'sidora', 'includes/ps_migration');
    $silf = sidora_incoming_links_form();
    return drupal_render($silf);
    drupal_exit();
  }
  $to_return =  '<input type="submit" id="cup-submit" name="cup" value="Convert a few" class="form-submit" onclick="convertAFew()"> Convert a limited number of concepts <input id="cup-val" style="border:darkseagreen solid" type="text" name="number" size="2" value="2"/> into research spaces that are under si:user-projects<br><br><br>';
  $to_return .= '<input type="submit" id="cs-submit" name="cs" value="Convert Specific" class="form-submit" onclick="convertSpecific()"> Convert a specific concept <input id="cs-val" style="border:darkseagreen solid" type="text" name="number" size="20" value="si:1234567"/> to a research space<br><br><br>';
  $to_return .= '<input type="submit" id="pidil-submit" name="pidil" value="Load Specific Pid for Migration Table" class="form-submit" onclick="specificPidil()"> Load the migration table only for the specified pid: <input id="pidil-val" style="border:darkseagreen solid" type="text" name="number" size="20" value="si:121909"/><br><br><br>';
  $to_return .= '<a href="'.base_path().'sidora/ps_migration/incoming_links">Incoming links table</a> Show a table of objects and how many hasConcept / hasResource links come to them<br><br><br>';
  $to_return .= '<a href="'.base_path().'admin/sidora/concept_review">Remove Existing Nodes from Drupal Database</a> Clear out the nodes information 1000 nodes at a time based on search results.<br>';
  $to_return .= '
<script>
stopAdditionalCalls = false;
specificPidil = function(){
  if (stopAdditionalCalls) return;
  var goTo = "'.base_path().'sidora/ps_migration/incoming_links?pid=";
  goTo += jQuery("#pidil-val").val();
  stopAdditionalCalls = true;
  window.location = goTo;
}
convertSpecific = function(){
  if (stopAdditionalCalls) return;
  var goTo = window.location.href;
  // a hack to append but good enough for our admins
  if (goTo.slice(-1) != "/") goTo += "/";
  goTo += "convert_concept/" + jQuery("#cs-val").val();
  jQuery("input").attr("disabled","disabled");
  stopAdditionalCalls = true;
  window.location = goTo;
}
convertAFew = function(){
  if (stopAdditionalCalls) return;
  var goTo = window.location.href;
  // a hack to append but good enough for our admins
  if (goTo.slice(-1) != "/") goTo += "/";
  goTo += "convert_user_projects/" + jQuery("#cup-val").val();
  jQuery("input").attr("disabled","disabled");
  stopAdditionalCalls = true;
  window.location = goTo;
}
</script>';
  return $to_return;
}
/* 
 * Migration utility asked for a concept to be unassociated with a URL encoded note, save the note in the file
 */
function sidora_migration_unassociate_add_note($parent, $child, $encoded_note) {
  $note = urldecode($encoded_note);
  $link_removal_log = drupal_realpath("public://link_removal_log.txt");
  return file_put_contents($link_removal_log, $parent . "," . $child . ',' . $note."\n", FILE_APPEND);
}
/*
 * Give the form to show the incoming link information
 */
function sidora_incoming_links_form($form = array(), &$form_state = NULL) {
  $specific_pid = filter_input(INPUT_GET, 'pid', FILTER_SANITIZE_STRING);
  if (!empty($_GET['auto_add']) || !empty($_POST['auto_add'])) {
    sidora_incoming_links_auto_add();
  }
  drupal_add_css(drupal_get_path('module','sidora').'/css/workbench_basic_screen.css',array('weight' => '1000000', 'group' => CSS_THEME));
  drupal_add_css(drupal_get_path('module','sidora').'/css/workbench_util.css',array('weight' => '1000000', 'group' => CSS_THEME));
  drupal_add_js(drupal_get_path('module','sidora').'/js/ps_migration.js',array('weight' => '1000000', 'group' => CSS_THEME));
  $offset = filter_input(INPUT_GET, 'offset', FILTER_VALIDATE_INT);
  $limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT);
  if (empty($offset)) {
    $offset = 0;
  }
  if (empty($limit)) {
    $limit = 100;
  }
    $pids_with_more_than_one_incoming_link_query = "
select ?object ?title (count(distinct ?incomingLink) as ?incomingLinks) from <#ri> where {
    ?object <info:fedora/fedora-system:def/model#label> ?title .
    ?incomingLink <info:fedora/fedora-system:def/relations-external#hasConcept> ?object .
}
GROUP BY ?object ?title
HAVING (count(distinct ?incomingLink) > 1)
OFFSET $offset
LIMIT $limit
";
    $pids_with_administered_by = "
select ?object ?adminBy from <#ri> where {
    ?object <http://oris.si.edu/2017/01/relations#isAdministeredBy> ?adminBy
}
OFFSET $offset
LIMIT $limit
";
    $pids_that_need_administered_by = "
select ?object ?title from <#ri> where {
    ?object <info:fedora/fedora-system:def/model#label> ?title .
    FILTER NOT EXISTS { ?object <http://oris.si.edu/2017/01/relations#isAdministeredBy> ?anything . }
}
order by ?object
OFFSET $offset
LIMIT $limit
";
    $pids_from_concepts_that_need_administered_by_with_num_incoming_links = "
select ?object ?title (count(distinct ?incomingLink) as ?incomingLinks) from <#ri> where {
    ?object <info:fedora/fedora-system:def/model#label> ?title .
    ?incomingLink <info:fedora/fedora-system:def/relations-external#hasConcept> ?object .
    FILTER NOT EXISTS { ?object <http://oris.si.edu/2017/01/relations#isAdministeredBy> ?anything . }
}
GROUP BY ?object ?title
OFFSET $offset
LIMIT $limit
";
    $pids_from_resources_that_need_administered_by_with_num_incoming_links = "
select ?object ?title (count(distinct ?incomingLink) as ?incomingLinks) from <#ri> where {
    ?object <info:fedora/fedora-system:def/model#label> ?title .
    ?incomingLink <info:fedora/fedora-system:def/relations-external#hasResource> ?object .
    FILTER NOT EXISTS { ?object <http://oris.si.edu/2017/01/relations#isAdministeredBy> ?anything . }
}
GROUP BY ?object ?title
OFFSET $offset
LIMIT $limit
";
    $pids_from_all_that_need_administered_by_with_num_incoming_links = "
select ?object ?title (count(distinct ?incomingLink) as ?incomingLinks) from <#ri> where {
    ?object <info:fedora/fedora-system:def/model#label> ?title .
    ?incomingLink ?sidoraRelation ?object .
    VALUES ?sidoraRelation { 
      <info:fedora/fedora-system:def/relations-external#hasResource>
      <info:fedora/fedora-system:def/relations-external#hasConcept>
    }
    FILTER NOT EXISTS { ?object <http://oris.si.edu/2017/01/relations#isAdministeredBy> ?anything . }
}
GROUP BY ?object ?title
OFFSET $offset
LIMIT $limit
";
    $everything_and_its_parent = '
select ?object ?incomingLink from <#ri> where {
    ?incomingLink ?relationship ?object .
    VALUES ?relationship { <info:fedora/fedora-system:def/relations-external#hasConcept> <info:fedora/fedora-system:def/relations-external#hasResource> }
}
';
    $specific_pid_query = '
select ?object ?title (count(distinct ?incomingLink) as ?incomingLinks) from <#ri> where {
    ?object <info:fedora/fedora-system:def/model#label> ?title .
    ?incomingLink ?relationship ?object .
    VALUES ?object { <info:fedora/' . $specific_pid . '> } .
    VALUES ?relationship { <info:fedora/fedora-system:def/relations-external#hasConcept> <info:fedora/fedora-system:def/relations-external#hasResource> }
}
Group BY ?object ?title
';

    $query = $pids_from_all_that_need_administered_by_with_num_incoming_links;
    if (!empty($_GET['multiparent'])) {
      $query = $pids_with_more_than_one_incoming_link_query;
    }
    // Still want the specific pid query if the pid accidentally went blank (url ends like '?pid=' )
    if ($specific_pid !== NULL) {
       $query = $specific_pid_query;
    }
//    $query = $pids_with_administered_by;
    $tuque = islandora_get_tuque_connection();
    if ($tuque) {
      try{
      $ri = $tuque->repository->ri;
      $results = $ri->sparqlQuery($query);
      //var_dump($results);
      }catch(Exception $e){
        var_dump($e);
      }
    }
    else {
     print 'no tuque';
    }
    $pid_table = '<table class="" id="incoming-links-table">
 <thead><tr class="even"><th>PID</th><th>Label</th><th>Incoming Links</th><th colspan="1">Administered By</th></tr></thead>
<tbody>';
    $row_class = array('odd','even');
    $row_num = 0;
    $table_pids = array();
    if (!empty($_GET['data_only'])) {
      print json_encode($results);
      exit();
    }
    foreach($results as $result) {
      $pid = $result['object']['value'];
      $pid_with_replacement_dash = str_replace(":", "-", $pid);
      $pid_table .= '<tr class="before-' . $pid_with_replacement_dash . ' ' . $row_class[$row_num++%2]  . '"><td>' . $pid . '</td><td>' . $result['title']['value'] . '</td><td>' . $result['incomingLinks']['value'] . '</td>';
      $table_pids[] = $result['object']['value'];
      $pid_table .= '<td>';
      if (intval($result['incomingLinks']['value']) > 1 || !empty($specific_pid)) {
        $pid_table .= '<input id="load-' . $pid_with_replacement_dash . '" pid="' . $pid . '" onclick="loadParents(\'load-' . $pid_with_replacement_dash . '\', \'' . $pid . '\');" type="submit" value="Load Parent Table" class="form-submit">';
      }
      else {
        // nothing in the cell
      }
      $pid_table .= '</td>';
      $pid_table .= '</tr>';
    }
    $pid_table .= '</tbody></table>';
    if (!empty($_GET['do_it'])) {
      sidora_incoming_links_add_administered_by_to_parent($table_pids);
      $pid_table .= 'AFTER';
      $pid_table .= '<table class="">
 <thead><tr class="even"><th>PID</th><th>Administered By</th></thead>
<tbody>';
      $tpab = sidora_incoming_links_list_administered_by($table_pids);
      $has_administered_by_pids = array_keys($tpab);
      $still_no_administered_by = array_diff($table_pids, $has_administered_by_pids);
      foreach($still_no_administered_by as $snabp) {
        $pid_table .= '<br>No administered by for:'.$snabp;
      }
      foreach($tpab as $pid => $administered_by) {
        $pid_table .= '<tr class="after-' . $pid_with_replacement_dash . '"><td>' . $pid . '</td><td>' . $administered_by . '</td></tr>';
      }
      $pid_table .= '</tbody></table>';
    }
  global $user;
  $form['info'] = array(
    '#markup' => t('')
  );
  $form["pids_to_automatically_set_administered_by"] = array(
    '#type' => 'hidden',
  );
  $form["pid_table"] = array(
    '#markup' => $pid_table,
  );
  $form['sp_holder'] = array(
    '#type' => 'fieldset',
    '#title' => t('Single Pid'),
    '#collapsible' => TRUE, // Added
    '#collapsed' => FALSE,  // Added
  );
  $form['sp_holder']['single_pid'] = array(
    '#type' => 'textfield',
    '#value' => (empty($specific_pid)?'si:121909':$specific_pid),
    '#description' => t('Load only this pid (click load a single pid)'), 
    '#attributes' => array(
      'id' => 'specific-pid',
    ),
  );
  $form['sp_holder']['show_single_pid'] = array(
    '#type' => 'submit',
    '#value' => t('Load a single pid'),
    '#description' => t('Reloads the page with only the specific pid loaded'),
    '#attributes' => array(
      'id' => 'load-specific-pid',
      'onclick' => 'loadSinglePid();',
    ),
  );
  $form['normal_search_holder'] = array(
    '#type' => 'fieldset',
    '#title' => t('Table Loader'),
    '#collapsible' => TRUE, // Added
    '#collapsed' => FALSE,  // Added
  );
  $form['normal_search_holder']['results_limit'] = array(
    '#type' => 'textfield',
    '#value' => 100,
    '#description' => t('Maximum number of items in table for the next load'), 
    '#attributes' => array(
      'id' => 'results-limit',
    ),
  );
  $form['normal_search_holder']['results_offset'] = array(
    '#type' => 'textfield',
    '#value' => 0,
    '#description' => t('Results Offset (not recommended)'), 
    '#attributes' => array(
      'id' => 'results-offset',
    ),
  );
  $form['normal_search_holder']['show_basic_table'] = array(
    '#type' => 'submit',
    '#value' => t('Load the basic table'),
    '#description' => t('Reloads the page with the basic table information'),
    '#attributes' => array(
      'id' => 'load-basic',
      'onclick' => 'loadBasic();',
    ),
  );
  $form['normal_search_holder']['show_only_multiparent'] = array(
    '#type' => 'submit',
    '#value' => t('Load only multiparent'),
    '#description' => t('Reloads the page with the table only listing items with multiple hasConcept / hasResource parents'),
    '#attributes' => array(
      'id' => 'load-multiparent',
      'onclick' => 'loadMultiparent();',
    ),
  );
  $form['batch_holder']  = array(
    '#type' => 'fieldset',
    '#title' => t('Batch Setting of isAdministeredBy'),
    '#collapsible' => TRUE, // Added
    '#collapsed' => FALSE,  // Added
  );

  $form['batch_holder']['batch_size'] = array(
    '#type' => 'textfield',
    '#value' => 10,
    '#description' => t('Batch size for automatic add'), 
    '#attributes' => array(
      'id' => 'batch-size',
    ),
  );
  $form['batch_holder']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Automatically add where appropriate'),
    '#description' => t('Will only add isAdministeredBy to items with a single hasConcept / hasResource incoming link'),
    '#attributes' => array(
      'id' => 'start-button',
      'onclick' => 'incomingLinksAddAppropriate();',
    ),
  );
  $form['batch_holder']['stop-it'] = array(
    '#type' => 'submit',
    '#value' => t('STOP before next call'),
    '#description' => t(''),
    '#attributes' => array(
      'id' => 'stop-button',
      'disabled' => 'disabled',
      'onclick' => 'stopAddCalls();',
    ),
  );
  return $form;
}

function sidora_incoming_links_direct_query($query) {
  $tuque = islandora_get_tuque_connection();
  $results = NULL;
  if ($tuque) {
    try{
      $ri = $tuque->repository->ri;
      $results = $ri->sparqlQuery($query);
      //var_dump($results);
    }catch(Exception $e){
      var_dump($e);
    }
  }
  else {
   print 'no tuque';
  }
  return $results;
}
/*
 * Send in an array of pids and if they have a single parent will add isAdministeredBy to that parent
 *
 * This will ignore pids with existing isAdministeredBy
 */
function sidora_incoming_links_auto_add($pids = NULL){
  $to_send = NULL;
  if (is_array($pids)) {
    $to_send = $pids;
  }
  if (is_string($pids)) {
    $to_send = explode(',',$pids);
  }
  if (empty($to_send) && (!empty($_GET['auto_add']))) {
    $to_send = explode(',',$_GET['auto_add']);
  }
  if (empty($to_send) && (!empty($_POST['auto_add']))) {
    $to_send = explode(',',$_POST['auto_add']);
  }
  $returned = sidora_incoming_links_add_administered_by_to_parent($to_send);
  $pids_processed = array_keys($returned);
  $unprocessed = array_diff($to_send, $pids_processed);
  $to_add_to_returned = array_fill_keys($unprocessed, SIDORA_UNPROCESSED);
  $returned += $to_add_to_returned; 
  header('Content-Type: application/json');
  print json_encode($returned);
  exit();
}
/*
 * Send in an array of pids and if they have a single parent will add isAdministeredBy to that parent
 *
 * This will ignore pids with existing isAdministeredBy
 */
function sidora_incoming_links_add_administered_by_to_parent($pids) {
  $illp = sidora_incoming_links_list_parents($pids);
  return sidora_incoming_links_add_administered_by_to_value($illp);
}

/*
 * Send in an associative array where the key is the pid and the value is the target of isAdministeredBy
 * Or...
 * Send in an associative array where the key is the pid and the value is an array of pids, where the 
 *  value for isAdministeredBy should only be set if it's an array of length 1
 * Ex:
 * array ("si:213" => "si:user-projects", "si:443" => "si:user-projects") 
 * will change the RELS-EXT of si:213 and si:443 to add the relationship "<sidora:isAdministeredBy>si:user-projects</sidora:isAdministeredBy>"
 *
 * This will ignore the pid if it already has an isAdministeredBy relationship, so
 * do not use this to "re-set" an isAdministeredBy value
 *
 */
function sidora_incoming_links_add_administered_by_to_value($pids_to_parent_pids) {
  $to_return = array();
  $pid_list = array_keys($pids_to_parent_pids);
  $pids_and_their_administered_by = sidora_incoming_links_list_administered_by($pid_list);
  $pids_already_has_administered_by = array_keys($pids_and_their_administered_by);
  foreach($pids_to_parent_pids as $pid => $to_be_administered_by_checker) {
    $to_be_administered_by = NULL;
    if (is_string($to_be_administered_by_checker)) {
      $to_be_administered_by = $to_be_administered_by_checker;
    }
    if (is_array($to_be_administered_by_checker)) {
      if (sizeof($to_be_administered_by_checker) == 1) {
        $to_be_administered_by = $to_be_administered_by_checker[0];
      }
    }
    if (!empty($to_be_administered_by) && !in_array($pid, $pids_already_has_administered_by)) {
      $object = sidora_obj($pid);
      if (empty($object)) {
        $to_return[$pid] = SIDORA_OBJECT_DOES_NOT_EXIST; 
      }
      else {
        $object->relationships->add(SI_RELS_EXT_URI, 'isAdministeredBy', $to_be_administered_by);
        $to_return[$pid] = $to_be_administered_by;
      }
    }
  }
  return $to_return;
}

/*
 * Send in an array of pids, this will return an associative array with key pid and value of their isAdministeredBy
 * If the object does not have isAdministeredBy then it will not be in the returned array
 *
 * Assumes that there will be a maximum of one isAdministeredBy relationship
 *
 * Ex: si:213 isAdministeredBy si:user-projects and si:778 has no isAdministeredBy
 * sending in sidora_incoming_links_list_administered_by( array("si:213","si:778") ) returns
 * array ("si:213" => "si:user-projects")
 */
function sidora_incoming_links_list_administered_by($pids) {
  $object_values_build = "";
  foreach($pids as $pid) {
    $object_values_build .= ' <info:fedora/' . $pid . '>';
  }
  $query = 'select ?object ?adminBy from <#ri> where {
    ?object <http://oris.si.edu/2017/01/relations#isAdministeredBy> ?adminBy
    VALUES ?object { ' . $object_values_build . '}
  }';
  $results = sidora_incoming_links_direct_query($query);
  $to_return = array();
  foreach($results as $result) {
    $to_return[$result['object']['value']] = $result['adminBy']['value'];
  }
  return $to_return;
}

/**
 * Send in an array of pids, this will return an associative array with key pid and values as an array of pids that represent
 * the hasConcept or hasResource parents of that pid
 * Ex:
 * si:user-projects hasConcept si:213
 * si:user-projects hasConcept si:443
 * si:900 hasConcept si:213
 * sending in sidora_incoming_links_list_parents( array( "si:213", "si:443" ) ) returns
 * array ("si:213" => array( "si:user-projects", "si:900"), "si:443" => array ("si:user-projects"))
 */
function sidora_incoming_links_list_parents($pids) {
  $object_values_build = "";
  foreach($pids as $pid) {
    $object_values_build .= ' <info:fedora/' . $pid . '>';
  }
  $query = 'select ?object ?incomingLink from <#ri> where {
    ?incomingLink ?relationship ?object .
    VALUES ?relationship { <info:fedora/fedora-system:def/relations-external#hasConcept> <info:fedora/fedora-system:def/relations-external#hasResource> }
    VALUES ?object { ' . $object_values_build . '}
  }';
  $results = sidora_incoming_links_direct_query($query);
  $to_return = array();
  foreach($results as $result) {
    $to_return[$result['object']['value']][] = $result['incomingLink']['value'];
  }
  return $to_return;
}

/*
 * Creates a new project space and copies information from the concept to the new project space.
 * Within the project space there will be the original concept, renamed "Metadata for <name>"
 */
function sidora_project_space_convert_concept($original_pid, $pattern = '/(.+)/', $replacement = 'Metadata for $1', $unmatched_replacement = 'Metadata for $1') {
  module_load_include('inc', 'sidora', 'includes/project_spaces');
  $original = sidora_obj($original_pid);
  if (!empty($original)) {
    // Tries to make the owner the drupal user associated
    $owner = sidora_get_drupal_user($original->owner);
    // If the owner doesn't exist any more, then set the owner to the current drupal user
    if (empty($owner)) {
      $owner = sidora_get_drupal_user();
    }

    $ps_node = sidora_create_personal_project_space(
      $owner->name,
      array("label"=>$original->label,"description"=>"Project Space conversion from legacy object")
    );
    $ps_pid = '';
    if (!empty($ps_node->field_fedora_pid) && array_key_exists($ps_node->language, $ps_node->field_fedora_pid)) {
      $ps_pid = $ps_node->field_fedora_pid[$ps_node->language][0]['value'];
    }

    // just the concepts
    $cr =  _sidora_get_child_results_cache($original_pid);
    foreach ($cr as $child) {
      $child_pid = $child['o']['value'];
      sidora_copy($ps_pid, $child_pid, FALSE);
      sidora_unassociate($original_pid, $child_pid, FALSE);
    }

    // Move codebooks to the new research space
    sidora_copy($ps_pid, $original_pid, FALSE);
    $resource_rels = $original->relationships->get(FEDORA_RELS_EXT_URI, 'managesCodebook');
    foreach($resource_rels as $resource_rel) {
      $resource_pid = $resource_rel['object']['value'];
      sidora_copy($ps_pid, $resource_pid, FALSE);
      sidora_unassociate($original_pid, $resource_pid, FALSE);
    }

    $new_label = preg_replace($pattern, $replacement, $original->label, 1);
    if (empty($new_label) || $new_label == $original->label) {
      $new_label = preg_replace('/(.+)/', $unmatched_replacement, $original->label, 1);
    }
    $original->label = $new_label;
    $original->relationships->registerNamespace("sidora", SI_RELS_EXT_URI);
    $original->relationships->add(SI_RELS_EXT_URI, 'isAdministeredBy', $ps_pid);
    return TRUE;
  }
  else {
    return FALSE;
  }
}

function sidora_project_space_convert_all_under_siuserprojects($num_conversions_string = "1"){
  $num_conversions = intval($num_conversions_string);
  $pattern = '/(.*) Projects/i';
  $replacement = '$1 Personal Information';
  // Load si:user-projects children
  $cr = _sidora_get_child_results_cache('si:user-projects');
  $num_so_far = 0;
  foreach ($cr as $child) {
    $pid = $child['o']['value'];
    $obj = sidora_obj($pid);
    print 'pid:'. $pid;
    if (!empty($obj) && sidora_is_person($obj) && $num_conversions > $num_so_far) {
      //print 'next!'; exit();
      sidora_project_space_convert_concept($pid, $pattern, $replacement);
      sidora_unassociate('si:user-projects',$pid,FALSE,TRUE);
      $num_so_far++;
      print ' converted';
    }
    print '<hr>';
    if ($num_so_far >= $num_conversions) {
      print 'COMPLETE';
      exit();
    }
  }
}
