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
 * Determine permissions based on node
 */
function sidora_node_allow($type_of_operation, $node) {
  if (empty($node)) return FALSE;
  // TODO the "create" permission
  // The create permission is determined by whether the current user is in the owning user's create group
  if ($type_of_operation == 'create') {
    // So there needs to be a node for the pid
    // Get the owner of the node ( $node->uid )
    $groups = sidora_get_groups_by_user();

    // Get the current user's groups
    foreach($groups as $group){
      if (og_is_member('node',$group->vid,'node',$node)){
        $roles = og_roles('node','og_crud_group', $group->vid);
        foreach($roles as $rid => $role) {
          if ($role == 'member') {
            $permissions = og_role_permissions(array($rid => $role));
            foreach( $permissions[$rid] as $permission_type => $is_granted) {
              if ($permission_type == 'create sidora_concept content') {
                return $is_granted;
              }
            }
          }
        }
      }
    }
    // In case the node SHOULD allow it but the folder has not been converted yet to have permission groups
    $info = sidora_get_info($node, FALSE);
    $pid = $info['pid']; 
    $admin_pid = sidora_get_owning_parent_concept_pid_by_administered_pid($pid);
    if (empty($admin_pid)) {
      global $user;
      $object = sidora_obj($pid);
      return (strtolower($object->owner) == strtolower($user->name));
    }
  } 
  else {
    return node_access($type_of_operation, $node);
  }
  return FALSE;
}
/**
 * Creates the four groups for the input user. (create, view, edit, delete)
 */
function sidora_create_all_groups_for_user($owning_user, $project_pid = NULL) {
  $groups_created = array();
  $groups_created[] = sidora_create_sidora_group($owning_user, $project_pid, 'create');
  $groups_created[] = sidora_create_sidora_group($owning_user, $project_pid, 'edit');
  $groups_created[] = sidora_create_sidora_group($owning_user, $project_pid, 'view');
  $groups_created[] = sidora_create_sidora_group($owning_user, $project_pid, 'delete');
  return $groups_created; 
}
/**
 * Creates a specified group for the input type for this user.  Assumes the group does not exist
 */
function sidora_create_sidora_group($owning_user, $project_pid, $type) {
    if (is_integer($owning_user) || is_string($owning_user)) {
      $owning_user = user_load(intval($owning_user));
    }
    if (empty($owning_user)){
      global $user;
      watchdog("SIdora","Tried creating SIdora groups with bad user, defaulted to currently logged in user: %a %b %c", 
        array("%a"=>$owning_user, "%b" => $project_pid, "%c" => $type)
      );
      $owning_user = $user;
    }
    $project_obj = sidora_obj($project_pid);
    if (empty($project_obj)) {
      return NULL;
    }
    $values = array(
      'type' => 'og_crud_group',
      'uid' => $owning_user->uid,
      'status' => 1,
      'comment' => 1,
      'promote' => 0,
      'og_roles_permissions' => array("und" => array( array("value" => TRUE))),
      'field_fedora_pid' => array("und" => array( array("value" => $project_pid))),
    );
    if ($type == 'view') {
      $values['group_access'] = array("und" => array( array("value" => TRUE)));
    }
    $entity = entity_create('node', $values);
    $wrapper = entity_metadata_wrapper('node', $entity);
    // Create View Edit Delete
    $name = $project_pid . " " . $project_obj->label . ' ' . ucfirst($type);
    $wrapper->title->set($name);
    $my_body_content = '';
    $wrapper->body->set(array('value' => $my_body_content));
    $wrapper->body->summary->set('');
    $wrapper->save(true);
    entity_save('node', $entity);
    $roles = og_roles('node','og_crud_group',$entity->vid);
    // Get the member role id
    $member_rid = NULL;
    foreach($roles as $temp_rid => $name) {
      if ($name == 'member') {
        $member_rid = $temp_rid;
      }
    }
    $new_permission_set = array();
    switch ($type) {
      case 'create':
        $new_permission_set = array(
          'create sidora_concept content' => 'create sidora_concept content',
          "update own sidora_concept content" => 0,
          "update any sidora_concept content" => 0,
          "delete own sidora_concept content" => 0,
          "delete any sidora_concept content" => 0,
          "unsubscribe" => "unsubscribe",
        );
        break;
      case 'view':
        $new_permission_set = array(
          'create sidora_concept content' => 0,
          "update own sidora_concept content" => 0,
          "update any sidora_concept content" => 0,
          "delete own sidora_concept content" => 0,
          "delete any sidora_concept content" => 0,
          "unsubscribe" => "unsubscribe",
        );
        break;
      case 'edit':
        $new_permission_set = array(
          'create sidora_concept content' => 0,
          "update own sidora_concept content" => "update own sidora_concept content",
          "update any sidora_concept content" => "update any sidora_concept content",
          "delete own sidora_concept content" => 0,
          "delete any sidora_concept content" => 0,
          "unsubscribe" => "unsubscribe",
        );
        break;
      case 'delete':
        $new_permission_set = array(
          'create sidora_concept content' => 0,
          "update own sidora_concept content" => 0,
          "update any sidora_concept content" => 0,
          "delete own sidora_concept content" => "delete own sidora_concept content",
          "delete any sidora_concept content" => "delete any sidora_concept content",
          "unsubscribe" => "unsubscribe",
        );
        break;
    }    
    og_role_change_permissions($member_rid, $new_permission_set);
    return $entity;
}

/**
 * Returns an array of the form array(pid => nid) one for each pid and its corresponding node
 * To get the pids, array_keys($the_return)
 * To get just the node ids, array_values($the_return)
 */
function sidora_get_pids_in_tree_from_nodes_by_root_pid($pid) {
  $to_return = array();
  $nid = sidora_get_concept_node_id($pid);
  if (empty($nid)){
    return $to_return;
  }
  $nids = array();
  $worked = sidora_get_pids_in_tree_from_nodes_by_node_id($nid, $nids, $to_return);
  if (!$worked) {
    return FALSE;    
  }
  return $to_return;
}
/**
 * Recursive function to pull information out of the nodes. Not expected to be called directly
 * $node_id = node_id of the root of the tree
 * $nids = array of node_ids which new node ids gets appended in the form array(node_id => node_id)
 * $pids = an array to append to of the form array(pid => nid) one for each pid and its corresponding node
 * $max_pids = when to stop going through the tree
 * returns: true if it didn't go over the max number of pids, false if it went over max pids
 */
function sidora_get_pids_in_tree_from_nodes_by_node_id($node_id, &$nids, &$pids, $max_pids = 1000) {
  // Runs into execution time issues at > 8000 nodes, would need the following line to up the execution time:
  // ini_set('max_execution_time',60);

  if (sizeof($nids) > $max_pids){
    return FALSE;
  }
  // if the node comes in as an integer, switch to string for consistency
  $node_id = (string)$node_id; 
  if (in_array($node_id, $nids)) return;
  $node = node_load($node_id);
  $pid = $node->field_fedora_pid[$node->language][0]['value'];
  $pids[$pid] = $node_id;
  $nids[$node_id] = $node_id;
  if (!empty($node->field_sidora_concept_children) && !empty($node->field_sidora_concept_children[$node->language])) {
    $children = explode(',',$node->field_sidora_concept_children[$node->language][0]['value']);
    foreach($children as $child_nid) {
      if (!in_array($child_nid, $nids) && !empty($child_nid)) {
        sidora_get_pids_in_tree_from_nodes_by_node_id($child_nid, $nids, $pids);
      }
    }
  }
  // Get rid of the node out of cache, takes longer but the memory gets used up easily otherwise (@ >6000 nodes)
  
  entity_get_controller('node')->resetCache(array($node_id));
  return sizeof($nids) <= $max_pids;
}
/**
 * returns an array of the form
 * o and t indexes are legacy leftovers, have no special meaning but has not been refactored away
 * 
 * array(
 *   'o' => pid,
 *   't' => label
 *   'crud' => permissions array ('c' => 1, 'r' => 1, 'u' => 0, 'd' => 0)
 *   'nid' => node id
 *   'isAdministeredBy' => owning parent pid
 *   'owner' => user name
 *   'children' => array(
 *     array(
 *       'o' => child1pid
 *       't' => label
 *       ...
 *     )
 *    )
 */
function sidora_build_tree_from_nodes_by_pid($pid, $max_depth = 3, $preload_nodes = TRUE){
  $nid = sidora_get_concept_node_id($pid);
  if (empty($nid)){
    return '';
  }
  $to_return = array();
  module_load_include('inc', 'sidora', 'includes/project_spaces');
  $to_return[] = sidora_build_tree_from_nodes($nid, $max_depth, 0, TRUE, $preload_nodes);
  return $to_return;
}
/**
 * returns an array of the form
 * o and t indexes are legacy leftovers, have no special meaning but has not been refactored away
 * 
 * array(
 *   'o' => pid,
 *   't' => label
 *   'crud' => permissions array ('c' => 1, 'r' => 1, 'u' => 0, 'd' => 0)
 *   'nid' => node id
 *   'isAdministeredBy' => owning parent pid
 *   'owner' => user name
 *   'children' => array(
 *     array(
 *       'o' => child1pid
 *       't' => label
 *       ...
 *     )
 *    )
 */
function sidora_build_tree_from_nodes($root_node_id, $max_depth = 3, $current_depth = 0, $resync_nodes_if_needed = TRUE, $preload_nodes = TRUE){
  $to_return = array();
  $node = node_load($root_node_id);
  if ($resync_nodes_if_needed && !sidora_is_node_synced_with_fedora($node)) {
    $returned_node = sidora_update_node_from_fedora($node);
    if (empty($returned_node)){
     // This node could not be loaded from Fedora, likely it no longer exists in Fedora
     return NULL;
    }
  }
  // Assume that we are using the und field (no language) since these will be non-translated data from the Fedora Commons Repo
  $pid = $node->field_fedora_pid[$node->language][0]['value'];
  if (!empty($node->field_fedora_label) && !empty($node->field_fedora_label[$node->language])) {
    $to_return['o'] = array();
    $to_return['o']['value'] = $pid;
    $to_return['t'] = array();
    $to_return['t']['value'] = $node->field_fedora_label[$node->language][0]['value'];
    $thumbnail = empty($node->field_thumbnail)?"":$node->field_thumbnail['und'][0]['uri'];
    if (empty($thumbnail)) {
      $to_return['t']['thumbnail'] = FALSE;
    }
    else {
      $to_return['t']['thumbnail'] = file_create_url($thumbnail);
    }
    $to_return['resourcecount'] = array();
    if (!empty($node->field_sidora_resource_child_coun) && !empty($node->field_sidora_resource_child_coun[$node->language])) {
      $to_return['resourcecount']['value'] = $node->field_sidora_resource_child_coun[$node->language][0]['value'];
    }
    else {
      $to_return['resourcecount']['value'] = 0;
    }
    $to_return['crud']['c'] = sidora_node_allow('create', $node);
    $to_return['crud']['r'] = sidora_node_allow('view', $node);
    $to_return['crud']['u'] = sidora_node_allow('update', $node);
    $to_return['crud']['d'] = sidora_node_allow('delete', $node);
    
    $to_return['nid'] = $node->nid;
    $og_gids = sidora_get_group_nids_membership($node->nid);
    // sidora_get_owning_parent_concept_by_administered_pid($pid)
    // if it's in more than 4 groups then ask what its administered by to see if it's a link
    $parent_array = sidora_get_owning_parent_concept_by_administered_pid($pid);
    $parent_pid = '';
    if (!empty($parent_array)) {
      foreach($parent_array as $pid => $parent_obj) { 
        $parent_pid = $pid;
      }
    }

    $to_return['isAdministeredBy'] = $parent_pid;
    $username = sidora_get_username_from_uid($node->uid);
    $to_return['owner'] = array('value'=>$username);
    // Load each child
    if (!empty($node->field_sidora_concept_children) && !empty($node->field_sidora_concept_children[$node->language])) {
      $children = explode(',',$node->field_sidora_concept_children[$node->language][0]['value']);
      if ($current_depth < $max_depth && $preload_nodes) {
        // Put all of these in memory for quicker recall later
        node_load_multiple($children);
      }
    }
    else {
      $children = array();
    }
    $to_return['children'] = array();
    
    if ($current_depth <= $max_depth){
      foreach($children as $child) {
        if (!empty($child)) {
          if ($current_depth == $max_depth) {
            $to_return['children'][] = NULL;
          } else {
            $child_node = sidora_build_tree_from_nodes($child, $max_depth, $current_depth + 1);
            if (!empty($child_node)) {
              $to_return['children'][] = $child_node;
            }
          }
        }
      }
    }
  }
  else {
    $description = t('Invalid label on pid !pid / node !node. Likely culprit: Pid exists as a child on RELS-EXT of an object but does not exist in Fedora.', array('!pid' => $pid, '!node' => $node->nid));
    sidora_add_fedora_assumption_problem_object($pid, $description);
  }
  return $to_return;
}
/*
 * Dan was looking for something to tell the system to update a pid but from an outside source that may be automated
 * The idea is something like we did a Camera Trap import directly to Fedora and we want to tell workbench to 
 * update its data so the data is ready when the user logs in rather than having the time to update occur
 * when the first user logs in that wants to look at that data
 */
function sidora_fedora_queue_sync_external_call($csv_pids = NULL) {
  if (variable_get('sidora_debug_clear_cache',FALSE)){
    watchdog('sidora_debug_clear_cache',
      t("Q Sync External Call: %pid",
        array('%pid' => $csv_pids)
      )
    );
  }
  $stes = variable_get("sidora_trusted_external_servers","");
  $allowed = array_map('trim' , explode(',' , $stes));
  // Intentionally not checking for X-Forwarded-For
  $the_ip = filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 );
  if (in_array($the_ip, $allowed)) {
    if ($csv_pids === NULL && isset($_POST['csv_pids'])) {
      $csv_pids = $_POST['csv_pids'];
    }
    $pids = explode(",",$csv_pids);
    print '<pre>';
    foreach($pids as $pid) {
      print "\nClearing cache for:" . $pid;
      sidora_clear_tree_cache($pid);
    }
    print '</pre>';
  }
  else {
    watchdog('sidora',"Attempt to queue sync from server that wasn't in list: $the_ip -  Current ip list: $stes");
    return MENU_NOT_FOUND;
  }
}
/*
 * Tell Workbench it should update information from Fedora before the next time it displays the node information
 */
function sidora_fedora_queue_sync($pid_or_nid) {
  if (variable_get('sidora_debug_clear_cache',FALSE)){
    watchdog('sidora_debug_clear_cache',
      t("Queue Sync: %pid",
        array('%pid' => $pid_or_nid)
      )
    );
  }
  $nid = $pid_or_nid;
  if (sidora_contains($pid_or_nid,':')){
    $nid = sidora_quick_pid_to_node_id($pid_or_nid); 
  }
  $node = node_load($nid, NULL, TRUE);
  if (!empty($node)){
    if (variable_get('sidora_debug_clear_cache',FALSE)){
      watchdog('sidora_debug_clear_cache',
        t("Queue Sync Nid: %pid",
          array('%pid' => $nid)
        )
      );
    }
    $node_wrapper = entity_metadata_wrapper('node', $node);
    $node_wrapper->field_sidora_fedora_sync->set('0');
    $node_wrapper->save();
  }
}
function sidora_fedora_create_partial_node_set(
  $root_pid,
  $root_label,
  $root_num_resources,
  $owner_username,
  &$updated_set,
  $max_depth = 999999,
  $max_count = 999999999
){
  $root_node = sidora_create_full_node_set(
    $root_pid,
    $root_label,
    $root_num_resources,
    NULL,
    $updated_set,
    $max_depth,
    $max_count
  );
  return $root_node; 
}
/*
 * Update information from Fedora based on the form data input
 */
function sidora_fedora_sync() {
  $nid = filter_input(INPUT_GET, 'nid');
  $command = filter_input(INPUT_GET, 'command');
  $show_table = filter_input(INPUT_GET, 'show_table');
  $batch_start = filter_input(INPUT_GET, 'batch_start');
  $batch_end = filter_input(INPUT_GET, 'batch_end');
  $root_pid = filter_input(INPUT_GET, "root_pid");
  $root_label = filter_input(INPUT_GET, "root_label");
  $root_resource_count = filter_input(INPUT_GET, "root_resource_count", FILTER_SANITIZE_NUMBER_INT);
  $max_depth = filter_input(INPUT_GET, "max_depth", FILTER_SANITIZE_NUMBER_INT);
  $max_count = filter_input(INPUT_GET, "max_count", FILTER_SANITIZE_NUMBER_INT);
  $table_html = '';
  if ($command == 'update_and_create_nodes_from_queries') {
    if (empty($root_pid)) {
      $root_pid = 'si:root';
    }
    if (empty($root_label)) {
      $root_label = 'Root';
    }
    if (empty($root_resource_count)) {
      $root_resource_count = 0;
    }
    print '<pre>';
    print "\nroot_pid:\t$root_pid";
    print "\nroot_label:\t$root_label";
    print "\nroot_resource_count:\t$root_resource_count";
    print "\ncommand:\t$command";
    print "\nmax_depth:\t$max_depth";
    print "\nmax_count:\t$max_count";
    print "\n";
    $table_html = '';
    $date = date('Y-m-d H:i:s');
    print $date . "\n";
    $updated_set = array();
    $root_node =  sidora_fedora_create_partial_node_set($root_pid,$root_label,$root_resource_count,NULL,$updated_set,$max_depth,$max_count);
    print "Root Node:\n";
    var_dump($root_node);
    print "Full Set of Updated Items:\n";
    var_dump($updated_set);
    $date = date('Y-m-d H:i:s');
    print $date . "\n";
    print "\n";
    print "\n";
    print "\n";
    print '</pre>';
    exit();
  }
  if (empty($nid)) {
  }
  else if ($nid == 'ALL') {
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle',  sidora_get_concept_content_type())
      ->propertyCondition('status', 1)
      ->fieldCondition('field_fedora_label', 'value', '', '!=')
      ->addMetaData('account', user_load(1)); // Run the query as user 1.
    $result = $query->execute();
    $num = 0;
    foreach($result["node"] as $nid => $obj){
      if ($num > ($batch_start-1) && $num < $batch_end) {
        if ($command == 'resync') {
          $done = sidora_update_node_from_fedora($nid);
          if (empty($done)){
            drupal_set_message(t('Did not update node :nid from Fedora', array(":nid"=>$nid)),'warning');
          }
          else {
            drupal_set_message(t('Updated node :nid from Fedora pid :pid', array(":nid"=>$nid, ":pid"=>$done->field_fedora_pid['und'][0]['value'])));
          }
        }
        if ($command == 'queue') {
          sidora_fedora_queue_sync($nid);
        }
      }
      $num++;
    }
  }
  else {
    if ($command == 'resync_tree'){
      $successes = 0;
      $full_pid_set = sidora_get_pids_in_tree_from_nodes_by_root_pid($root_pid);
      foreach($full_pid_set as $curr_pid){
        $done = sidora_update_node_from_fedora($curr_pid);
        if ($done) $successes++;
      }
      $to_print = '{
successes: ' . $successes . '
fails: ' . (sizeof($full_pid_set) - $successes) . '
}';
      print $to_print;
      drupal_exit();
    }
    if ($command == 'resync') {
      if ($nid > 0){
        $done = sidora_update_node_from_fedora($nid);
      }
      else {
        $done = sidora_update_node_from_fedora($root_pid);
        $to_print = '{
successes: ' . (!empty($done)?1:0) . '
fails: ' . (empty($done)?1:0) . '
}';
        print $to_print;
        drupal_exit();
      }
      if (empty($done)){
        drupal_set_message(t('Did not update node :nid from Fedora pid :pid', array(":nid"=>$nid, ":pid"=>$done->field_fedora_pid['und'][0]['value'])),'warning');
      }
      else {
        drupal_set_message(t('Updated node :nid from Fedora pid :pid', array(":nid"=>$nid, ":pid"=>$done->field_fedora_pid['und'][0]['value'])));
      }
    }
    if ($command == 'queue') {
      sidora_fedora_queue_sync($nid);
    }
  }
  $tr_count = 1;
  if (!empty($show_table)) {
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle',  sidora_get_concept_content_type())
      ->propertyCondition('status', 1)
      ->fieldCondition('field_fedora_label', 'value', '', '!=')
      ->addMetaData('account', user_load(1)); // Run the query as user 1.
    $result = $query->execute();
    $table_html = '<table>';
    $table_html .= '<tr><th></th><th>Node</th><th>Node Title</th><th>Fedora Label</th><th>Num Concept Children</th><th>Num Resource Children</th><th>Sync Time</th><th>Resync NOW</th><th>Queue Resync</th></tr>';
    $tr_class = 'odd';
    $tr_count = 1;
    $start_table_node = 1; 
    $end_table_node = 1000;
    $table_page = max(intval($show_table) - 1, 0);
    $start_table_node += 1000 * $table_page;
    $end_table_node += 1000 * $table_page;
    foreach($result["node"] as $nid => $obj){
      if ($tr_count >= $start_table_node && $tr_count <= $end_table_node) {   
      $node = node_load($nid);
      if (array_key_exists('und',$node->field_fedora_label)){
        $html_escaped_name = htmlspecialchars($node->field_fedora_label['und'][0]['value']);
        $concept_children = 'Unset';
        if (array_key_exists('und',$node->field_sidora_concept_children)){
          $concept_children = count(explode(',',htmlspecialchars($node->field_sidora_concept_children['und'][0]['value'])));
        }
        $resource_children = 'Unset';
        if (array_key_exists('und',$node->field_sidora_resource_child_coun)){
          $resource_children = htmlspecialchars($node->field_sidora_resource_child_coun['und'][0]['value']);
        }
        $readable_sync_time = 'Unset (Will sync when used)';
        if (array_key_exists('und',$node->field_sidora_fedora_sync)){
          $sync_time = htmlspecialchars($node->field_sidora_fedora_sync['und'][0]['value']);
          if (empty($sync_time)) {
            $readable_sync_time = "Queued (Will sync when used)";
          }
          else {
            $readable_sync_time = date("Y-m-d H:i:s", $sync_time);
          }
        }
        $table_html .= "<tr class='$tr_class'>";
        $table_html .= "<td>$tr_count</td>";
        $table_html .= "<td><a href='" .url('node/' . $nid) . "' target='_blank'>$nid</a></td><td>$node->title</td>";
        $table_html .= "<td>$html_escaped_name</td><td>$concept_children</td><td>$resource_children</td><td>$readable_sync_time</td>";
        $table_html .= "<td><a href='?command=resync&nid=$nid&show_table=$show_table'>Resync NOW</a></td>";
        $table_html .= "<td><a href='?command=queue&nid=$nid&show_table=$show_table'>Queue Resync</td></tr>";
        $tr_class = ($tr_class == 'odd') ? "even" : "odd";
      }
      }
      $tr_count++;
    }
    $table_html .= '</table>';
  }
  $tr_count--;
  $pager = '';
  for ($page_num = 1; $page_num < ($tr_count / 1000) + 1 ; $page_num++) {
    if ($page_num == $table_page + 1) {
      $page = " <strong>$page_num</strong>";
    }
    else {
      $range = "Page $page_num : " . (1+($page_num - 1)*1000) . " to " . (($page_num * 1000 > $tr_count )?$tr_count:($page_num * 1000));
      $page = " <a href='?show_table=$page_num' title='$range'>$page_num</a>";
    }
    $pager .= $page;
  }
  $to_return = ''; 
  if (!empty($show_table)) {
    $to_return = 'Nodes: '.$tr_count;
    $to_return .= "<br/>Page: $pager";
    $to_return .= $table_html;
  }
  $to_return .= '<a href="?show_table=1">Show table of nodes</a>';
  $to_return .= '<h1>BATCH COMMANDS</h1><ul>';
  $to_return .= '<li><a href="?command=update_and_create_nodes_from_queries">Create / Update Nodes from Sparql queries</a></li>';
  $to_return .= '<li><a href="?command=queue&nid=ALL&batch_start=1&batch_end=999999&show_table=1">Queue ALL</a> This will cause the tree to load them when a user opens the tree for the first time</li>';
  $to_return .= '<li><a href="'.url('sidora/ajax_parts/tree/si:user-projects/2').'" target="_blank">Load the initial research spaces tree in a separate window</a></li>';
  $to_return .= '<li style="margin-top:20px"><a href="?command=resync&nid=ALL&batch_start=1&batch_end=999999&show_table=1">Resync ALL NOW from Fedora</a> This will take a LONG time </li>';
  $to_return .= '</ul>';
  $to_return .= '<p class="buffer-so-you-dont-click-on-resync-from-fedora-accident" style="height:100px"></p>';
  return $to_return;
}
/*
 * Check to see if the node should be updated
 */
function sidora_is_node_synced_with_fedora($node) {
  if (!empty($node->field_sidora_fedora_sync)) {
    // Currently based on the design that if we need to have it updated, this value gets cleared
    return !empty($node->field_sidora_fedora_sync[$node->language][0]['value']);
  }
  return FALSE;
}
/**
 * Create the form to use on the con9cept review page, will show Drupal errors
 * if the options array has weird data in it (as in dates are not in Y-m-d format)
 */
function sidora_concept_review_form($form, &$form_state) {
  if (!empty($_SESSION['concept_node_maintenance_values'])) {
    $options = $_SESSION['concept_node_maintenance_values'];
  }
  $form['help_info'] = array(
    '#markup' => 'The following search will return a set of nodes. After looking at the result set you can decide if you want to remove these nodes from the database. The search itself will not delete nodes.',
    
  );
  $form['type_selector'] = array(
    '#type' => 'select',
    '#description' => 'Select the type of node you are looking for.  Reminder that removing the og_crud_groups will make it so that a node is no longer a research space',
    '#options' => array('og_crud_group' => t('og_crud_group (Permission groups)'),'sidora_concept' => t('sidora_concept (concept node)'),'both'=>t('Both')),
    '#default_value' => empty($options['type'])?'sidora_concept':$options['type'],
    '#title' => t('Search for:'),
  );
  $form['date_range'] = array(
    '#type' => 'fieldset',
    '#title' => 'Last modified during date range',
  );
  $dp = NULL;
  if (!empty($options['after_date'])) {
    $dp = explode('-',$options['after_date']);
  }
  $form['date_range']['after_date'] = array(
    '#type' => 'date',
    '#title' => t('Start'),
    '#default_value' => empty($options)?NULL:array('year' => $dp[0], 'month' => $dp[1], 'day' => $dp[2]),
  );
  $dp = NULL;
  if (!empty($options['before_date'])) {
    $dp = explode('-',$options['before_date']);
  }
  $form['date_range']['before_date'] = array(
    '#type' => 'date',
    '#title' => t('End'),
    '#default_value' => empty($options)?NULL:array('year' => $dp[0], 'month' => $dp[1], 'day' => $dp[2]),
  );
  $form['clear_button'] = array(
    '#type' => 'submit',
    '#value' => t('Clear'),
  );
  $form['submit_button'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );
  return $form;
}
/**
 * Converts the form submission from the concept review form into the $options array for a maintenance search and
 * saves that in the session so it can be used as the options for the next concept_review display
 */
function sidora_concept_review_form_submit($form, &$form_state) {
  if ($form_state['values']['op'] == 'Submit') {
    $options = array();
    $options['type'] = $form_state['values']['type_selector']; 
    $options['before_date'] = $form_state['values']['before_date']['year'] . '-' . $form_state['values']['before_date']['month'] . '-' . $form_state['values']['before_date']['day']; 
    $options['after_date'] = $form_state['values']['after_date']['year'] . '-' . $form_state['values']['after_date']['month'] . '-' . $form_state['values']['after_date']['day']; 
    $_SESSION['concept_node_maintenance_values'] = $options;
  }
  else if ($form_state['values']['op'] == 'Clear') {
    unset($_SESSION['concept_node_maintenance_values']);
  }
}
/**
 * Creates a search options array from various sources
 */
function sidora_concept_node_maintenance_generate_options(&$options) {
  if (empty($options['type'])) {
    $get_from = INPUT_GET;
    $options = array();
    $options['type'] = filter_input($get_from, 'type');
    $options['before_date'] = filter_input($get_from, 'before_date');
    $options['after_date'] = filter_input($get_from, 'after_date');
    $options['action'] = filter_input($get_from, 'action');
  }  
  if (empty($options['type'])) {
    $get_from = INPUT_POST;
    $options = array();
    $options['type'] = filter_input($get_from, 'type');
    $options['before_date'] = filter_input($get_from, 'before_date');
    $options['after_date'] = filter_input($get_from, 'after_date');
    $options['action'] = filter_input($get_from, 'action');
    
  }
  // Pull the information from the last submit
  if (empty($options['type'])) {
    if (!empty($_SESSION['concept_node_maintenance_values'])) {
      $options = $_SESSION['concept_node_maintenance_values'];
    }
  }
}
/**
 * Search for nodes that are important to SIdora, if nothing passed in and nothing
 * saved in the session, then it tries
 * to pull information from GET parameters and then from POST parameters
 *
 * $options - array of options that can have the following keys:
 *    'type' - type of node, 'sidora_concept', 'og_crud_group', or 'both'
 *    'before_date' - only nodes modified before this day, string in Y-m-d
 *    'after_date' - only nodes modified on or after this day, string in Y-m-d
 * returns
 *   array where the node id is the array key and the value is
 *   an array of the type:
 *    array('nid' => node id, 'vid' => version id, 'type' => node type)
 */
function sidora_concept_node_maintenance_search($options) {
  $type = 'sidora_concept';
  $before_date = '1980-01-01';
  $after_date = '1980-01-01';
  if(!empty($options['type'])) { 
    $type = $options['type'];
  }
  if(!empty($options['before_date'])) { 
    $before_date = $options['before_date'];
  }
  if(!empty($options['after_date'])) { 
    $after_date = $options['after_date'];
  }
  // What do I care about?
  // Clear out concept nodes that have not been updated in X days
  // Clear out organic group nodes that have not been updated in X days
  //
  // Check what type, sidora_concept or og_crud_group
  drupal_set_time_limit(60);
  $query = new EntityFieldQuery();
  if ($type != 'both'){
    $query->entityCondition('entity_type', 'node')
      ->propertyCondition('changed', strtotime($before_date . ' +1 day'), '<')
      ->propertyCondition('changed', strtotime($after_date), '>')
      ->propertyCondition('type', $type);
  }
  else {
    $query->entityCondition('entity_type', 'node')
      ->propertyCondition('changed', strtotime($before_date . ' +1 day'), '<')
      ->propertyCondition('changed', strtotime($after_date), '>')
      ->propertyCondition('type', array('sidora_concept','og_crud_group'), 'IN');
  }
  $result = $query->execute();
  return $result;
}
/**
 * Delete the nodes found by the search options listed
 */
function sidora_concept_node_maintenance_delete($options) {
  $result = sidora_concept_node_maintenance_search($options);
  // Suggested to only delete 500 at a time
  // after deleting a mass number of nodes the MySQL DB may
  // take a long time to reclaim the space (or never).  If you need that
  // space dump the DB, drop and recreate
  $result_nids = array_keys($result['node']);
  $batch_size = 1000;
  $current_start = 0;
  $current_end = $batch_size;
  do {
    $to_delete = array_slice($result_nids, $current_start, $batch_size);
    $current_start += $batch_size;
    $current_end += $batch_size;
    node_delete_multiple($to_delete);
    // Cycling thru to delete everything resulted in timeouts,
    // just do the first set and change UI to let user know
    return $to_delete;
  } while($current_end < sizeof($result_nids));
  return $result_nids;
}
/**
 * Remove a set of nodes based on a search
 */
function sidora_concept_node_maintenance($options = array()){
  sidora_concept_node_maintenance_generate_options($options);
  if (!empty($options['action'])) {
    if ($options['action'] == 'delete') {
      $result_nids = sidora_concept_node_maintenance_delete($options);
      $message = "Deleted " . count($result_nids)  . " nodes";
      print $message;
      drupal_set_message($message);
      drupal_exit();
    }
  }
  $result = sidora_concept_node_maintenance_search($options);
  $form = drupal_get_form('sidora_concept_review_form');
  $to_return = drupal_render($form);
  if (!$result) {
    $to_return .= "Nodes found: NONE";
  }
  else {
    $avs = array_values($result['node']);
    $to_return .= "Nodes found: " . count($avs);
    $header = array('NID','Type');
    $rows = array();
    foreach($avs as $avn => $av) {
      $rows[] = array(l($av->nid, 'node/' . $av->nid), $av->type);
    }
    $to_return .= theme('table', array('header' => $header, 'rows' => $rows));
    $to_return .= '<input type="submit" id="clear-nodes-button" name="clear-nodes" value="Delete Nodes" class="form-submit" onclick="deleteNodes(); return false;">';
    $to_return .= '<script>';
    if (count($avs) <= 1000) {
      $to_return .= '
deleteNodes = function(){
  if (confirm("Delete all ' . count($avs) . ' nodes?")) {
    jQuery.ajax({
      type: "POST",
      data: "action=delete&type=' . $options['type'] . '&before_date=' . $options['before_date'] . '&after_date=' . $options['after_date'] . '",
      success: function(){location.reload()}
    });
  }
}
';
    }
    else {
      $to_return .= '
deleteNodes = function(){
  if (confirm("Too many to delete all. Delete 1000 nodes?")) {
    jQuery.ajax({
      type: "POST",
      data: "action=delete&type=' . $options['type'] . '&before_date=' . $options['before_date'] . '&after_date=' . $options['after_date'] . '",
      success: function(){location.reload()}
    });
  }
}
';
    }
    $to_return .= '</script>';
  }
  return $to_return;
}
/**
 * Recursively create the tree based on the query information returned
 */
function sidora_create_full_node_set($pid, $label, $num_resources, $owner_username, &$already_updated, $max_depth = 100, $max_count = 1200, $path = array()) {
  ini_set('max_execution_time',60);
  if ($max_depth == 0) { $max_depth = 100; }
  if ($max_count == 0) { $max_count = 1200; }
  //print "\n Max depth: $max_depth , current depth: " . count($path) . " Max count: $max_count, current count: " . count($already_updated) . "\n";
  //print "\n===============================================";
  print "\n path:" . implode(" " , $path) . " $pid";
  flush();


  $depth_count = count($path);
  if ($depth_count > $max_depth){
    // Create the node as a placeholder, but do not fill in the information or children
    // Placeholders require an empty array of information
    $node = sidora_get_update_or_create_concept_node($pid, array());
    return $node;
  }
  if (count($already_updated) > $max_count){
    print "\nHit max, exiting";
    print "\n". date('Y-m-d H:i:s');
    print "\n\n";
    exit();
  }
  if (in_array($pid, $already_updated)){
    // We already made this node this session, return it
    $node = sidora_get_update_or_create_concept_node($pid);
    return $node;
  }
  if (in_array($pid, $path)){
    // This is in its own tree, creating a loop. Return NULL for now...
    return NULL;
  }
  $results = _sidora_get_child_results_cache($pid);
  $child_nids = array();
  $self_child = FALSE;
  $path[] = $pid;
  foreach ($results as $c_index=>$child){
    $child_pid = $child['o']['value'];
    // If it has itself as a child somehow, do not follow that tree, but add that fact in later
    if ($pid == $child_pid) {
      $self_child = TRUE;
    }
    else {
      $child_node = sidora_create_full_node_set($child_pid, $child['t']['value'], $child['resourcecount']['value'], $child['owner']['value'], $already_updated, $max_depth, $max_count, $path);
      if ($child_node !== NULL) {
        $child_nids[] = $child_node->nid;
        $already_updated[] = $child_pid;
      }
      else {
        //This means it was creating a loop, what to do??
      }
    }
  }
  if (count($child_nids) == 0){
    print "\n========= $pid is leaf";
  }
  print "\nPID: $pid owned by: $owner_username Count: " . count($already_updated) ."\n";
  print '==';
  $info = array(
    'label' => $label,
    'concept_children' => implode(',',$child_nids),
    'resource_children' => $num_resources,
    'owner' => $owner_username,
  );
  print '--';
  print json_encode($info);
  $node = sidora_get_update_or_create_concept_node($pid, $info, TRUE);
  /*
  if ($self_child) {
    $child_nids[] = $node->nid;
    $info['concept_children'] = implode(',',$child_nids);
    $node = sidora_get_update_or_create_concept_node($pid, $info);
  }
  */
  return $node;
}

/*
 * Return a quick pid to node without doing a node DB lookup, or add to list
 */
function sidora_quick_pid_to_node_id($pid, $node_id = '', $add_to_request_memory = TRUE){
  static $ptn = array();
  if (empty($node_id)){
    if (isset($ptn[$pid])) {
      return $ptn[$pid];
    }
    if ($add_to_request_memory) {
      $nid = sidora_get_concept_node_id($pid);
      $ptn[$pid] = $nid;
      return $nid;
    }
    return NULL;
  }
  else {
    $ptn[$pid] = $node_id;
  }
}
/*
 * Based on any of the common ways to look up a Fedora object representation, give back information 
 * on the other representations for the data
 * $load_from_fedora - if TRUE will ask Islandora to look up the information from Fedora to give
 *   back the Islandora representation.  If looking for a nid/node -> pid or pid -> nid/node you don't 
 *   want to incur that cost so don't
 * returns
  $to_return = array(
    'node' => $node,
    'nid' => $nid,
    'obj' => $obj,
    'pid' => $pid,
    'description' => $description, // this is the description from the node. This info is NOT in Fedora
  );
 */
function sidora_get_info($pid_or_fedora_obj_or_nid_or_node, $load_from_fedora = TRUE){
  $node = FALSE;
  $nid = '';
  $obj = NULL;
  $pid = '';
  $description = '';
  if (empty($pid_or_fedora_obj_or_nid_or_node)) {
    return FALSE;
  }
  elseif (is_string($pid_or_fedora_obj_or_nid_or_node) || is_numeric($pid_or_fedora_obj_or_nid_or_node)){
    if (is_numeric($pid_or_fedora_obj_or_nid_or_node)) {
      $pid_or_fedora_obj_or_nid_or_node = (string)$pid_or_fedora_obj_or_nid_or_node;
    }
    // A string, so it's pid or nid
    if (strpos($pid_or_fedora_obj_or_nid_or_node, ":") === FALSE) {
      // No colon, so it's a nid
      $nid = $pid_or_fedora_obj_or_nid_or_node;
      // Get the node
      $node = node_load($nid);
      if ($node !== FALSE) {
        // Pull the pid
        if (array_key_exists($node->language, $node->field_fedora_pid)) {
          $pid = $node->field_fedora_pid[$node->language][0]['value'];
          // Get the object
          if ($load_from_fedora) {
            $obj = sidora_obj($pid);
          }
        }
        else {
          // No PID in this node, we got passed something that isn't configured properly
          $description = t('No pid in the node');
        }
      }
      else {
        $description = t('No node with this nid');
      }
    } else {
      // Had colon, it's a pid
      $pid = $pid_or_fedora_obj_or_nid_or_node;
      // Get the object
      if ($load_from_fedora) {
        $obj = sidora_obj($pid);
      }
      // Get the node
      $node = sidora_get_concept_node($pid);
      if (!empty($node)) {
        // Get the nid
        $nid = $node->nid;
      }
    }
  }
  elseif ("IslandoraFedoraObject" == get_class($pid_or_fedora_obj_or_nid_or_node)){
    // Fedora object
    $obj = $pid_or_fedora_obj_or_nid_or_node;
    $pid = $obj->id;
    // Get the node
    $node = sidora_get_concept_node($pid);
    if (!empty($node)){
      // Get the nid
      $nid = $node->nid;
    }
  }
  else {
    // Node
    $node = $pid_or_fedora_obj_or_nid_or_node;
    $nid = $node->nid;
    $pid = $node->field_fedora_pid[$node->language][0]['value'];
    // Get the object
    if ($load_from_fedora) {
      $obj = sidora_obj($pid);
    }
  }
  $to_return = array(
    'node' => $node,
    'nid' => $nid,
    'obj' => $obj,
    'pid' => $pid,
    'description' => $description,
  );
  return $to_return;
}
/**
 * Resets a node based on its Fedora object. Requires node to already exist
 * $pid_or_fedora_obj_or_nid_or_node - some identifier of the thing to update
 * returns the node or FALSE if it couldn't perform the action
 */
function sidora_update_node_from_fedora($pid_or_fedora_obj_or_nid_or_node){
  $sidora_obj_info = sidora_get_info($pid_or_fedora_obj_or_nid_or_node);
  if (empty($sidora_obj_info)) {
    return FALSE;
  }
  $node = $sidora_obj_info['node'];
  $obj = $sidora_obj_info['obj'];
  $pid = $sidora_obj_info['pid'];
  if (empty($node) || empty($pid)) {
    return FALSE;
  }
  if (empty($obj)) {
    // This object couldn't be found in Fedora, we can't do an update
    $to_return = sidora_update_concept_node($node, array('label' => ''), TRUE);
    return FALSE;
  }
  return sidora_update_or_create_node_from_fedora($pid_or_fedora_obj_or_nid_or_node);
}
/**
 * Updates or creates a node based on its Fedora object. Requires that the object is a concept
 * $pid_or_fedora_obj_or_nid_or_node - some identifier of the thing to update
 * returns the node or FALSE if it couldn't perform the action
 */
function sidora_update_or_create_node_from_fedora($pid_or_fedora_obj_or_nid_or_node) {
  $sidora_obj_info = sidora_get_info($pid_or_fedora_obj_or_nid_or_node);
  if (empty($sidora_obj_info)) {
    return FALSE;
  }
  $node = $sidora_obj_info['node'];
  $nid = $sidora_obj_info['nid'];
  $obj = $sidora_obj_info['obj'];
  $pid = $sidora_obj_info['pid'];
  $is_concept = sidora_is_concept($obj);
  if (!$is_concept){
    return FALSE;
  }
  // Pull the information from fedora and fill the info section which will be passed to the node updater
  $children_concepts = $obj->relationships->get(FEDORA_RELS_EXT_URI, 'hasConcept');
  $child_nids = array();
  // Check the child pids for duplicates - so we don't need to get node ids and THEN find out it's a duplicate
  $child_pids = array();
  foreach($children_concepts as $child_concept) {
    $child_pid = $child_concept['object']['value'];
    if (!in_array($child_pid, $child_pids) && ($child_pid != $pid)){
      $child_pids[] = $child_pid;
      $existing_child_nid = sidora_get_concept_node_id($child_pid);
      if (empty($existing_child_nid)) {
        // create the stub
        $child_node = sidora_get_update_or_create_concept_node($child_pid, array());
        if (!empty($child_node)) {
          $child_nid = $child_node->nid;
        }
        else {
          $child_nid = NULL;
        }
      }
      else {
        $child_nid = $existing_child_nid;
      }
      if (!empty($child_nid)) {
        $child_nids[] = $child_nid;
      }
    }
  }
  $children_resources = $obj->relationships->get(FEDORA_RELS_EXT_URI, 'hasResource');
  $num_children_resources = count($children_resources);
  $info = array(
    'label' => $obj->label,
    'concept_children' => implode(',',$child_nids),
    'resource_children' => $num_children_resources,
    'owner' => $obj->owner,
  ); 
  $to_return = NULL;
  // If the node doesn't exist, create it
  if (empty($node)) {
    $to_return = sidora_get_update_or_create_concept_node($pid, $info);
  }
  else {
    $to_return = sidora_update_concept_node($node, $info, TRUE);
  }
  module_load_include('inc', 'sidora', 'includes/project_spaces');
  sidora_put_into_proper_project_space($nid);
  return $to_return;
}

/**
 * Retrieves or creates and returns a concept node for this pid
 */
function sidora_get_update_or_create_concept_node($pid, $info = NULL, $set_fedora_sync = FALSE){
  $node_id = sidora_get_concept_node_id($pid);
  if (empty($node_id)){
    $object = sidora_obj($pid);
    if (!empty($object)){
      $is_concept = sidora_is_concept($object);
      if ($is_concept || $pid == 'si:root') {
        watchdog('sidora', "Create:<pre>" . sidora_debug_string_backtrace()."</pre>info:".json_encode($info));
        return sidora_create_concept_node($pid, $info, $set_fedora_sync);
      }
      else {
        return NULL;
      }
    }
    else {
      watchdog('sidora', "Passed a pid:" . $pid . " that did not have a Fedora object with the intent of creating a concept node:<pre>" . sidora_debug_string_backtrace()."</pre>info:".json_encode($info));
      return NULL;
    }
  }
  else {
    $node = node_load($node_id);
    if (!empty($info)){
      sidora_update_concept_node($node, $info, $set_fedora_sync);
    }
    return $node;
  }
}
/*
 * return the number of resource children from this node / nid / pid / obj
 */
function sidora_node_get_num_resource_children($identifier) {
  $info = sidora_get_info($identifier, FALSE);
  $node = $info['node'];
  if (!sidora_is_node_synced_with_fedora($node)) {
    sidora_update_node_from_fedora($node);
  }
  $node_wrapper = entity_metadata_wrapper('node', $node);
  $existing_resource_children = $node_wrapper->field_sidora_resource_child_coun->value();
  return $existing_resource_children;
}
/*
 * Removes a child to the from the child list
 * If no child_node_id is entered, assumes the thing removed was a resource
 * returns the node that was input
 */
function sidora_update_concept_node_remove_child($node, $child_node_id = NULL) {
  $node_wrapper = entity_metadata_wrapper('node', $node);
  // If the child is null, then it was a resource, subtract one resource from the resource count
  if (empty($child_node_id)) {
    $existing_resource_children = $node_wrapper->field_sidora_resource_child_coun->value();
    $new_resource_children = ((int)$existing_resource_children) - 1;
    $node_wrapper->field_sidora_resource_child_coun->set($new_resource_children);
  }
  else {
    $new_concept_children = $child_node_id;
    $existing_concept_children = $node_wrapper->field_sidora_concept_children->value();
    if (!empty($existing_concept_children)) {
      $child_array = explode("," , $existing_concept_children);
      if(($key = array_search($child_node_id, $child_array)) !== false) {
        unset($child_array[$key]);
      }
      $new_concept_children = implode("," , $child_array);
    }
    $node_wrapper->field_sidora_concept_children->set($new_concept_children);
  }
  $node_wrapper->save(); 
  return $node;
}
/*
 * Adds a child to the end of the child list
 * If no child_node_id is entered, assumes the thing added was a resource
 * returns the node that was input
 */
function sidora_update_concept_node_add_child($node, $child_node_id = NULL) {
  if (empty($node) || empty($node->nid)){
    watchdog('sidora', "ERROR: sidora_update_concept_node_add_child, asked to add $child_node_id to an empty parent:<pre>" . sidora_debug_string_backtrace()."</pre>");
    return $node;
  }
  watchdog("sidora","sidora_update_concept_node_add_child, node id:" . $node->nid . " new child node id:" . $child_node_id);
  $node_wrapper = entity_metadata_wrapper('node', $node);
  // If the child is null, then it was a resource, add one resource from the resource count
  if (empty($child_node_id)) {
    $existing_resource_children = $node_wrapper->field_sidora_resource_child_coun->value();
    $new_resource_children = ((int)$existing_resource_children) + 1;
    $node_wrapper->field_sidora_resource_child_coun->set($new_resource_children);
  }
  else {
    $new_concept_children = $child_node_id;
    if (!empty($node_wrapper->field_sidora_concept_children)) {
      $existing_concept_children = $node_wrapper->field_sidora_concept_children->value();
      if (!empty($existing_concept_children)) {
        $new_concept_children = $existing_concept_children . ',' . $child_node_id;
      }
    }
    else {
      watchdog('sidora',"Invalid concept node:" . $node->nid);
    }
    $node_wrapper->field_sidora_concept_children->set($new_concept_children);
  }
  $node_wrapper->save(); 
  return $node;
}
/*
 * Updates an existing node with information
 */
function sidora_update_concept_node($node, $info, $set_fedora_sync = FALSE) {
  watchdog('sidora', "Update:<pre>" . sidora_debug_string_backtrace()."</pre>info:".json_encode($info));
  $node_wrapper = entity_metadata_wrapper('node', $node);
  if (array_key_exists('label',$info)) {
    $node_wrapper->field_fedora_label->set($info['label']);
  }
  if (array_key_exists('concept_children',$info)) {
    $node_wrapper->field_sidora_concept_children->set($info['concept_children']);
  }
  if (array_key_exists('resource_children',$info)) {
    $node_wrapper->field_sidora_resource_child_coun->set($info['resource_children']);
  }
  else {
    $node_wrapper->field_sidora_resource_child_coun->set(0);
  }
  if (array_key_exists('description',$info)) {
    $node_wrapper->body->set(array('value' => $info['description']));
  }
  if ($set_fedora_sync) {
    $node_wrapper->field_sidora_fedora_sync->set(strtotime("now"));
  }
  if (array_key_exists('owner',$info)) {
    $output = db_select('users','u')->fields('u', array('uid'))->condition('name',$info['owner'],'=')->execute()->fetchAssoc();
    // If the Fedora user didn't exist in Drupal, assign it to the superuser
    $node_wrapper->author = 1;
    if (!empty($output)) {
      foreach($output as $record) {
        $node_wrapper->author = $record;
      }
    }
  }
  $save_output = $node_wrapper->save();
  return $node;
}
/**
 * Retrieves the first found concept node for this single pid
 */
function sidora_get_concept_node($pid) {
  $nodes = sidora_get_concept_nodes($pid);
  if (empty($nodes)) {
    return NULL;
  }
  if (sizeof($nodes) > 1) {
    $nodes_list = '';
    foreach($nodes as $nid => $node) {
      $nodes_list .= ' ' . $nid;
    }
    $text = t("Concept to PID 1-to-1 relationship failure. PID: !pid nodes: !nodes_list", array('!pid' => $pid, '!nodes_list' => $nodes_list));
    watchdog("sidora", $text);
  }
  $nv = array_values($nodes);
  $node = array_shift($nv);
  return $node; 
}
/**
 * Retrieves concept nodes for this pid or array of pids
 */
function sidora_get_concept_nodes($pid) {
  $pid_array = $pid;
  if (is_string($pid)){
    $pid_array = array($pid);
  }
  try {
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle',  sidora_get_concept_content_type())
      ->propertyCondition('status', 1)
      ->fieldCondition('field_fedora_pid', 'value', $pid_array, 'IN')
      ->addMetaData('account', user_load(1)); // Run the query as user 1.
    $result = $query->execute();
    if (sizeof($result) === 0){
      return NULL;
    }
    $to_load = array();
    foreach($result["node"] as $nid => $obj){
      $to_load[] = $nid;
    }
  }
  catch (EntityFieldQueryException $exception) {
    return NULL;
  }
  return node_load_multiple($to_load);
}
/**
 * Retrieves concept node for this pid or array of pids
 */
function sidora_get_concept_node_id($pid) {
  $pid_array = $pid;
  if (is_string($pid)){
    $pid_array = array($pid);
  }
  try{
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
      ->entityCondition('bundle',  sidora_get_concept_content_type())
      ->propertyCondition('status', 1)
      ->fieldCondition('field_fedora_pid', 'value', $pid_array, 'IN')
      ->addMetaData('account', user_load(1)); // Run the query as user 1.
    $result = $query->execute();
    if (sizeof($result) === 0){
      return NULL;
    }
    $to_return = array();
    foreach($result["node"] as $nid => $obj){
      $to_return[] = $nid;
    }
    if (is_string($pid)){
      if (sizeof($to_return) == 1){
        return $to_return[0];
      }
    }
  }
  catch (EntityFieldQueryException $exception) {
    return NULL;
  }
  return $to_return;
}
/**
 * Creates a concept node - does not check to see if a node already exists for this pid
 * REQUIRES an info to be passed in, even if empty array
 * $info includes the following:
 *   'label' => The label of the Fedora object
 *   'concept_children' => a CSV of all of the NODE children of the node (NOT PIDS, NODE IDS)
 *   'resource_children' => a number of resources for the Fedora object
 * A Fresh Node of Fedora object that was just created:
 * $info = array("label"=>'label',"concept_children"=>'',"resource_children"=>0);
 * A node of a Fedora object that already existed:
 * $info = array("label"=>'label',"concept_children"=>'88,89,92',"resource_children"=>7);
 * 
 */
function sidora_create_concept_node($pid, $info = NULL, $set_fedora_sync = FALSE, $owner_id = 1){
  if ($info === NULL) {
    return NULL;
  }
  $time_now = strtotime("now");
  // add node properties
  $newNode = (object) NULL;
  $newNode->type = sidora_get_concept_content_type();
  $newNode->title = 'PID_' . $pid;
  node_object_prepare($newNode);
  $newNode->language = LANGUAGE_NONE;
  $newNode->uid = $owner_id;
  $newNode->created = $time_now;
  $newNode->changed = $time_now;
  $newNode->status = 1;
  $newNode->comment = 0;
  $newNode->promote = 0;
  $newNode->moderate = 0;
  $newNode->sticky = 0;

  // add field data
  $newNode->field_fedora_pid[$newNode->language][]['value'] = $pid;
  if (!empty($info)){
    $newNode->field_fedora_label[$newNode->language][]['value'] = $info['label'];
    if (array_key_exists('concept_children',$info)) {
      $newNode->field_sidora_concept_children[$newNode->language][]['value'] = $info['concept_children'];
    }
    else {
      $newNode->field_sidora_concept_children[$newNode->language][]['value'] = '';
    }
    if (array_key_exists('resource_children',$info)) {
      $newNode->field_sidora_resource_child_coun[$newNode->language][]['value'] = $info['resource_children'];
    }
    else {
      $newNode->field_sidora_resource_child_coun[$newNode->language][]['value'] = 0;
    }

    $newNode->body[$newNode->language][]['value'] = empty($info['description'])?"":$info['description'];
    // overwrite the owner info if there is a valid owner listed in the info
    if (!empty($info['owner'])) {
      $owner_user = user_load_by_name($info['owner']);
      if (!empty($owner_user)) {
        $newNode->uid = $owner_user->uid;
      }
    }
  }
  
  if ($set_fedora_sync) {
    $newNode->field_sidora_fedora_sync[$newNode->language][]['value'] = $time_now;
  }

  // Prepare node for saving
  $newNode = node_submit($newNode); 
  // save node
  node_save($newNode);
  return $newNode;
}
/**
 * Returns the owner id of the pid if the concept is a shared item, otherwise returns the current user's id
 * 
 */
function sidora_get_default_owner_id_under_pid($pid){
  global $user;
  //Get the node that represents the pid
  $node = sidora_get_concept_node($pid);
  if (empty($node)) {
    return $user->uid;
  }

  //If there is a node, check to see if it's in a share group
  $node_groups = og_get_entity_groups('node', $node);
 
  module_load_include('inc', 'sidora', 'includes/project_spaces');
  //If it is in a share group, return the node's owner
  $owned_groups = sidora_get_owned_groups($node->uid);
  $group_assoc = array();
  foreach($owned_groups as $owned_group) {
    $group_type = sidora_get_sidora_group_type($owned_group);
    if (!empty($group_type) && !empty($node_groups['node'])) {
      foreach($node_groups['node'] as $membership_id => $node_group_group_id) {
        if ($node_group_group_id == $owned_group->vid) {
          return $owned_group->uid;
        }
      }
    }
  }
  //If not in a share group, return the current user's id
  return $user->uid;
}
/**
 * Creates a node type for concepts if one doesn't exist, and returns the "machine name" for the type
 */
function sidora_get_concept_content_type(){
  static $to_return = NULL;
  if (!empty($to_return)) {
    return $to_return;
  }
  $type_name = 'sidora_concept';
  $ntgn = node_type_get_names();
  if ( in_array( $type_name, array_keys($ntgn) ) ) {
    $to_return = $type_name;
    return $type_name;
  }
  $concept_type = array(
    'type' => $type_name,
    'name' => t('SIdora Concept'),
    'base' => 'node_content',
    'description' => t("This is content related to a Fedora Commons Repository / SIdora concept"),
    'custom' => 1,
    'modified' => 1,
    'locked' => 0,
  );
  $type = node_type_set_defaults( $concept_type );
  node_type_save( $type );
  //  Add a body field.
  node_add_body_field( $type );
  $to_return = $type_name;
  return $type_name;
}

/**
 * Create the fields necessary for the nodes that represent a Fedora Digital Object and add it to the Fedora digital 
 * object content type
 */
function sidora_create_fields_for_fedora_object_nodes(){
  $fields = array(
    'Fedora PID'=> array('field_name' => 'field_fedora_pid', 'type' => 'text', 'settings' => array('max_length' => 128)),
    'Fedora Label'=> array('field_name' => 'field_fedora_label', 'type' => 'text', 'settings' => array('max_length' => 128)),
    'Fedora Child Concepts'=> array('field_name' => 'field_sidora_concept_children', 'type' => 'text',  'settings' => array('max_length' => 2000)),
    'Fedora Child Resources'=> array('field_name' => 'field_sidora_resource_children', 'type' => 'text',  'settings' => array('max_length' => 2000)),
    // Fedora Sync is a timestamp in the system given by time() that the data was last updated from Fedora
    // It can be compared against the node->updated and if the offset is known between this system and Fedora against the updated date there
    'Fedora Sync'=> array('field_name' => 'field_sidora_fedora_sync', 'type' => 'text'),
  );
  foreach ($fields as $label => $field) {
    $field_name = $field['field_name'];
    // Make sure the field doesn't already exist.
    if (!field_info_field($field_name)) {
      // Create the field.
      field_create_field($field);

      // Create the instance.
      $instance = array(
        'field_name' => $field_name,
        'entity_type' => 'node',
        'bundle' => sidora_get_concept_content_type(),
        'label' => $label,
        'description' => 'Fedora Commons Repo digital object PID',
        'required' => TRUE,
      );
      field_create_instance($instance);
      watchdog('sidora', t('!field_name was added successfully.', array('!field_name' => $field_name)));
    }
  }
}
