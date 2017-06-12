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
 * Give the form to show the incoming link information
 */
function sidora_incoming_links_form($form = array(), &$form_state = NULL) {
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
select ?object (count(distinct ?incomingLink) as ?incomingLinks) from <#ri> where {
    ?incomingLink <info:fedora/fedora-system:def/relations-external#hasConcept> ?object .
}
GROUP BY ?object
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
    $query = $pids_from_all_that_need_administered_by_with_num_incoming_links;
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
      $pid_table .= '<tr class="before-' . str_replace(":", "-", $pid) . ' ' . $row_class[$row_num++%2]  . '"><td>' . $pid . '</td><td>' . $result['title']['value'] . '</td><td>' . $result['incomingLinks']['value'] . '</td>';
      $table_pids[] = $result['object']['value'];
      $pid_table .= '<td>';
      if (intval($result['incomingLinks']['value']) > 1) {
        $pid_table .= 'Click to pick';
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
        $pid_table .= '<tr class="after-' . str_replace(":", "-", $pid) . '"><td>' . $pid . '</td><td>' . $administered_by . '</td></tr>';
      }
      $pid_table .= '</tbody></table>';
    }
  global $user;
  $form['info'] = array(
    '#markup' => t('After the project space is created, you can choose who should be part of the project space.')
  );
  $form["pids_to_automatically_set_administered_by"] = array(
    '#type' => 'hidden',
  );
  $form["pid_table"] = array(
    '#markup' => $pid_table,
  );
  $form['batch_size'] = array(
    '#type' => 'textfield',
    '#value' => 10,
    '#description' => t('Batch size for automatic add'), 
    '#attributes' => array(
      'id' => 'batch-size',
    ),
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Automatically add where appropriate'),
    '#description' => t('Will only add isAdministeredBy to items with a single hasConcept / hasResource incoming link'),
    '#attributes' => array(
      'id' => 'start-button',
      'onclick' => 'incomingLinksAddAppropriate();',
    ),
  );
  $form['stop-it'] = array(
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

function sidora_incoming_links_form_validate($form, &$form_state) {
  if (empty($form_state['values']['ps_name'])){ 
    form_set_error('ps_name', 'Enter a name for the project space.');
  }
}
function sidora_incoming_links_form_submit($form, &$form_state) {
  global $user;
  module_load_include('inc', 'islandora', 'includes/utilities');
  try
  {
    $tuque = islandora_get_tuque_connection();
    $project_space_obj = $tuque->repository->constructObject(islandora_get_namespace('si:root'));
   }catch(Exception $e) {
     return t('The Fedora repository server is currently unavailable. Please contact the site administrator %email',
       array('%email' => (variable_get('site_admin_email_to', '') != ''?' at ' . variable_get('site_admin_email_to'):''))
    );
  }
  $created_node = sidora_create_personal_project_space($user, array("label"=>$form_state['values']['ps_name'],"description"=>$form_state['values']['ps_desc']));
  if (!empty($created_node)) {
    drupal_set_message("New Project Space Created");
    $file = file_load($form_state['values']['file']);
    $file->status = FILE_STATUS_PERMANENT;
    $file_after = file_save($file);
    // Note: It was INCREDIBLY DIFFICULT to figure out how to save thumbnail, so I imagine
    // that most people do not perform uploads the way this is set up.
    // It looks generally obvious now, but look around and you'll see nobody does it this way 
    // That may indicate this is not how Drupal expects you to do it.
    // This does create an entry in the file_usage table, so we are not in a situation where
    // it creates orphan managed files.
    // It was designed to do file resizing on the upload, so that's where the validators are.
    // Most have the validators on the form_validate step, but we wanted a resize and preview
    // before the form was submitted.
    $created_node->field_thumbnail['und'][0] = array(
      'fid' => $file->fid,
      'alt' => '',
      'title' => '',
    );
    node_save($created_node);
    drupal_goto(substr(current_path(), 0, strrpos(current_path(), '/')).'/project_spaces');
  }
  else {
    drupal_set_message("New Project Space Creation Failed", "warning");
  }
}
