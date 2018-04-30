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
 * When this was originally coded, research spaces were being called project spaces, and 
 * the code reflects that. The term moving forward should always be research space.
 * Do not put "project space" anywhere that the end user would be able to see it, and
 * preferrably for the administrators as well. This includes urls, like 
 * .../sidora/research_space_create, etc.
 */

/*
 * Put the item into the research spaces that are associated with the selected research space
 */
function sidora_put_into_project_spaces($item_identifier, $project_space_identifier) {
  $obj_info = sidora_get_info($item_identifier, FALSE);
  $ps_info = sidora_get_info($project_space_identifier, FALSE);
  if (empty($obj_info) || empty($ps_info) || empty($obj_info['nid']) || empty($ps_info['pid'])) {
    return FALSE;
  }
  $nid = $obj_info['nid'];
  $ps_pid = $ps_info['pid'];
  $project_space_groups = sidora_get_groups_for_project_space($ps_pid, TRUE);
  if (empty($project_space_groups)){
    return FALSE;
  }
  foreach($project_space_groups as $individual_group) {
    og_group('node', $individual_group, array('entity_type' => 'node', 'entity' => $nid));
  }
  return TRUE;
}
/**
 * Put the first object in the groups of second object
 */
function sidora_put_this_into_their_project_space($add_to_groups_id, $get_groups_from_id) {
  $atg_info = sidora_get_info($add_to_groups_id, FALSE);
  $ggf_info = sidora_get_info($get_groups_from_id, FALSE);
  if (empty($atg_info) || empty($ggf_info)) {
    return FALSE;
  }
  $og_gids = sidora_get_group_nids_membership($ggf_info['nid']);
  $groups = node_load_multiple($og_gids);
  foreach($groups as $group) {
    og_group('node', $group, array('entity_type' => 'node', 'entity' => $atg_info['nid']));
  }
  return TRUE;
}

/**
 * Assume that the passed in item has a node if it should, and put that node into the 
 * research spaces
 * of the best parent if not already in a research space of a parent
 *
 * To be "IN" the same research space as the parent, that means the node has the same 
 * organic group memberships that the parent does.
 * 
 * Return TRUE if things went into proper research space --
 *             this includes if there was NO proper research spaces to place it
 *        FALSE if it was something that shouldn't go into a research space or
 *              requires more set up (not a concept, or no node created yet for the concept)
 * 
 */

function sidora_put_into_proper_project_space($pid_or_fedora_obj_or_nid_or_node) {
  $sidora_obj_info = sidora_get_info($pid_or_fedora_obj_or_nid_or_node, FALSE);
  if (empty($sidora_obj_info)) {
    return FALSE;
  }
  $node = $sidora_obj_info['node'];
  $nid = $sidora_obj_info['nid'];
  // reminder obj may not be loaded (FALSE on 2nd param of sidora_get_info)
  $pid = $sidora_obj_info['pid'];
  if (empty($node) || empty($nid)) {
    // What was passed in was not a concept that already has a node created. Do nothing.
    return FALSE;
  }
  // Parent choice decision priorities:
  // If it IS the research space, put it into the right groups. Do not remove existing groups.
  $project_space_groups = sidora_get_groups_for_project_space($pid, TRUE);
  $check_legacy_parents = TRUE;
  if (!empty($project_space_groups)) {
    foreach($project_space_groups as $individual_group) {
      og_group('node', $individual_group, array('entity_type' => 'node', 'entity' => $nid));
    }
    $check_legacy_parents = FALSE;
  }
  else {
    // If already in a research space of one of its parents, then nothing needs to happen
    module_load_include('inc', 'sidora', 'includes/utils');
    $owning_pid = sidora_get_owning_parent_concept_pid_by_administered_pid($pid);
    if (empty($owning_pid)) {
      $check_legacy_parents = TRUE;
    }
    else {
      $check_legacy_parents = FALSE;
      $owning_parent_gids = sidora_get_group_nids_membership(sidora_get_concept_node_id($owning_pid));
      $parent_groups = node_load_multiple($owning_parent_gids);
      foreach($parent_groups as $parent_group) {
        og_group('node', $parent_group, array('entity_type' => 'node', 'entity' => $nid));
      }
    }
  }
  if ($check_legacy_parents) {
    watchdog('sidora',t("This pid does not have proper isAdministeredBy relationship: %pid" , array("%pid"=>$pid)));
    $parent_infos = sidora_get_parent_concepts_by_pid($pid);
    $is_in_a_parents_project_space = FALSE;
    $current_gids = sidora_get_group_nids_membership($nid);
    // Parent communal is used for checking if all the parents have the same research spaces
    $parent_communal_gids = array();
    $parents_are_communal = TRUE;
    // Even if it doesn't have groups itself, go thru to see if parents have communal groups
    foreach($parent_infos as $parent_info) {
      $parent_pid = $parent_info['pid'];
      $parent_gids = sidora_get_group_nids_membership(sidora_get_concept_node_id($parent_pid));
      $intersect_check = array_intersect($current_gids, $parent_gids);
      if (sizeof($intersect_check) == sizeof($parent_gids)) {
        // Is in all the groups of this parent
        $is_in_a_parents_project_space = TRUE;
        break;
      }
      if (empty($parent_communal_gids)) {
        $parent_communal_gids = $parent_gids;
        sort($parent_communal_gids);
      }
      else {
        sort($parent_gids);
        if (!($parent_gids == $parent_communal_gids)) {
          $parents_are_communal = FALSE;
        }
      }
    }
    if (!$is_in_a_parents_project_space){
      // If there is only one parent, put it in there (communal will be true)
      // If all parents have the same research spaces, put it there
      if ($parents_are_communal) {
        $parent_groups = node_load_multiple($parent_communal_gids);
        foreach($parent_groups as $parent_group) {
          og_group('node', $parent_group, array('entity_type' => 'node', 'entity' => $nid));
        }
      }
      else {
        // TODO TBD These will be more for legacy data than new objects
        // If still a child of the original_parent from the SIDORA datastream,
        //     put into that parent's research space
        // Choose the parent that has the oldest node modification date
      }
    }
  }
  return TRUE;
}
/**
 * Remove the node from research spaces that its parent does not belong
 */
function sidora_remove_from_incorrect_project_spaces($pid_or_fedora_obj_or_nid_or_node) {
  
  $sidora_obj_info = sidora_get_info($pid_or_fedora_obj_or_nid_or_node, FALSE);
  if (empty($sidora_obj_info)) {
    return FALSE;
  }
  $node = $sidora_obj_info['node'];
  $nid = $sidora_obj_info['nid'];
  // reminder obj may not be loaded (FALSE on 2nd param of sidora_get_info)
  $pid = $sidora_obj_info['pid'];
  if (empty($node) || empty($nid)) {
    // What was passed in was not a concept that already has a node created. Do nothing.
    return FALSE;
  }
  
  $current_gids = sidora_get_group_nids_membership($nid);

  // proper_groups is going to be a list of groups that we think it should be a part of
  // So, if there are more groups that are not part of proper_groups remove it from those groups

  // If it IS the research space, do not remove it from those groups
  $proper_group_ids = sidora_get_groups_for_project_space($pid, TRUE, TRUE);

  module_load_include('inc', 'sidora', 'includes/utils');

  // If it has a real owner, use that
  $obj = sidora_obj($pid);
  $rels = $obj->relationships->get(SI_RELS_EXT_URI, 'isAdministeredBy');
  $ignore_other_parents = FALSE;
  foreach ($rels as $rel) {
    $ignore_other_parents = TRUE;
    $parent_pid = $rel['object']['value'];
    $parent_gids = sidora_get_group_nids_membership(sidora_get_concept_node_id($parent_pid));
    $proper_group_ids = array_merge($parent_gids, $proper_group_ids);
  }

  // Below is for NON-MIGRATED DATA which should be none, but things change
  if (!$ignore_other_parents) {
    watchdog('sidora',t('This pid does not have proper isAdministeredBy relationship: %pid' , array("%pid"=>$pid)));
    $parent_infos = sidora_get_parent_concepts_by_pid($pid);
    foreach($parent_infos as $parent_info) {
      $parent_pid = $parent_info['pid'];
      $parent_gids = sidora_get_group_nids_membership(sidora_get_concept_node_id($parent_pid));
      $proper_group_ids = array_merge($parent_gids, $proper_group_ids);
    }
  }

  $remove_from_gids = array_diff($current_gids, $proper_group_ids);
  foreach($remove_from_gids as $gid) {
    og_ungroup('node', $gid, 'node', $nid);
  }
  return TRUE;
}
/*
 * Returns the node ids of the groups that this node id is a member of
 * So, if there's these groups
 * NODE ID | GROUP NAME
 *     908 | Happy Concept Create
 *     909 | Happy Concept Delete
 *    1024 | Happy Concept Update
 * and this concept node:
 *    1301 | Cars of the 1950s
 * and "Cars of the 1950s" is a member of "Happy Concept Create" and "Happy Concept Update" then
 * the return will be:
 * array( 908, 1024 )
 */
function sidora_get_group_nids_membership($nid) {
  $current_groups_info = og_get_entity_groups('node',$nid);
  $current_gids = array();
  if (array_key_exists('node',$current_groups_info)) {
    foreach($current_groups_info['node'] as $group_node_id){
      $current_gids[] = $group_node_id;
    }
  }
  return $current_gids;
}

/**
 * Returns the PIDs for the research spaces that this pid is in
 */
function sidora_get_project_space_pids_for_pid($pid){
  $to_return = array();
  $gids = sidora_get_project_space_nodes_for_pid($pid);
  foreach($gids as $gid){
    $groups = node_load_multiple($gids);
    $pids = sidora_get_project_space_pids_from_og_groups($groups, NULL, FALSE);
    $to_return += $pids;
  }
  $to_return = array_unique($to_return);
  return $to_return;
}
/**
 * Returns if the object is a research space or not
 */
function sidora_is_project_space($pid_or_fedora_obj_or_nid_or_node) {
  module_load_include('inc', 'sidora', 'includes/sidora_nodes');
  $sidora_obj_info = sidora_get_info($pid_or_fedora_obj_or_nid_or_node, FALSE);
  if (empty($sidora_obj_info)) {
    return FALSE;
  }
  $node = $sidora_obj_info['node'];
  $nid = $sidora_obj_info['nid'];
  if (empty($node) || empty($nid)) {
    return FALSE;
  }
  $pid = $sidora_obj_info['pid'];
  $proj_spaces_for_current = sidora_get_project_space_pids_for_pid($pid);
  if (in_array($pid, $proj_spaces_for_current)) {
    return TRUE;
  }
  return FALSE;
}
/**
 * Returns the group node ids for the research spaces that this pid is in
 */
function sidora_get_project_space_nodes_for_pid($pid){
  module_load_include('inc', 'sidora', 'includes/utils');
  if (!is_string($pid)){
    debug_print_backtrace();
  }
  $nid = sidora_quick_pid_to_node_id($pid);
  $gids = array();
  if (empty($nid)){
    // We'll assume this is a resource now since there's not a node for this pid
    $owner_pid = sidora_get_owning_parent_concept_pid_by_administered_pid($pid);
    if (!empty($owner_pid)) {
      $parent_nid = sidora_quick_pid_to_node_id($owner_pid);
      // We could call this function again to get the research space pids but I
      // don't want to worry about garbage data putting us in an infinite loop and
      // unneeded complexity to the base cases. So ONLY check the listed parents
      // and if they don't have the information return nothing.
      $some_gids = sidora_get_group_nids_membership($parent_nid);
      $gids += $some_gids; 
    }
    else {
      watchdog('sidora',t('This pid does not have proper isAdministeredBy relationship: %pid' , array("%pid"=>$pid)));
      $parent_pid_info = sidora_get_parent_concepts_by_pid($pid);
      foreach($parent_pid_info as $curr_parent_info) {
        $parent_pid = $curr_parent_info['pid'];
        $parent_nid = sidora_quick_pid_to_node_id($parent_pid);
        // We could call this function again to get the research space pids but I
        // don't want to worry about garbage data putting us in an infinite loop and
        // unneeded complexity to the base cases. So ONLY check the listed parents
        // and if they don't have the information return nothing.
        $some_gids = sidora_get_group_nids_membership($parent_nid);
        $gids += $some_gids; 
      }
    }
  }
  else {
    $gids = sidora_get_group_nids_membership($nid);
  }
  $gids = array_unique($gids);
  return $gids;
}

/**
 * Assumes owners of the research spaces should also own the organic groups
 * Uses logged in user if none specified
 * Special 'all' for load all users data
 */
function sidora_get_owned_project_spaces($user_of_interest = NULL) {
  global $user;
  if (empty($user_of_interest)) {
    $user_of_interest = $user;
  }
  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', 'node')
    ->propertyCondition('type', 'og_crud_group')
    ->propertyCondition('status', NODE_PUBLISHED)
    ->addMetaData('account', user_load(1));
  if (!sidora_is_admin() || $user_of_interest != 'all') {
    $query->propertyCondition('uid', $user_of_interest->uid);
  }
  $result = $query->execute();
  $group_nodes = array();
  if (isset($result['node'])) {
    $nids = array_keys($result['node']);
    $group_nodes = entity_load('node', $nids);
  }
  return sidora_get_project_spaces_from_og_groups($group_nodes, $user);
}

/**
 * Returns the concept pids for fedora objects that represent the research spaces for a set of permission groups nodes
 */
function sidora_get_project_space_pids_from_og_groups($group_nodes, $user, $only_return_groups_that_owner_can_change = TRUE) {
  $pids = array();
  $project_spaces = array();
  foreach($group_nodes as $node){
      $pid = NULL;
      if (!empty($node->field_fedora_pid) && array_key_exists($node->language, $node->field_fedora_pid)) {
        $pid = $node->field_fedora_pid[$node->language][0]['value'];
      }
      // Initially let's restrict this to people that are able to change permissions, may open it up later
      if (!$only_return_groups_that_owner_can_change || sidora_allow($user, $pid, 'permission')) {
         if (!in_array($pid, $pids) && !empty($pid)) {
           $pids[] = $pid;
         }
      }
  }
  return $pids; 
}
/**
 * Returns the concept nodes that represent the research spaces for a set of permission groups nodes
 */
function sidora_get_project_spaces_from_og_groups($group_nodes, $user, $only_return_groups_that_owner_can_change = TRUE) {
  $pids = array();
  $project_spaces = array();
  foreach($group_nodes as $node){
      $pid = NULL;
      if (!empty($node->field_fedora_pid) && array_key_exists($node->language, $node->field_fedora_pid)) {
        $pid = $node->field_fedora_pid[$node->language][0]['value'];
      }
      // Initially let's restrict this to people that are able to change permissions, may open it up later
      if (!$only_return_groups_that_owner_can_change || sidora_allow($user, $pid, 'permission')) {
         if (!in_array($pid, $pids) && !empty($pid)) {
           $pids[] = $pid;
           $sgcn = sidora_get_concept_node($pid);
           if (!empty($sgcn)) {
             $project_spaces[] = $sgcn;
           }
           else {
             // if it's empty then there are permissions groups that point to pids that there is not a node for
             watchdog('sidora','Permission groups exist for pid: '.$pid.' but no folder node exists for it.');
           }
         }
      }
  }
  return $project_spaces; 
}
/**
 * Returns group nodes or node ids that have their group root pid set to the input value
 */
function sidora_get_groups_for_project_space($pid, $administrative_bookkeeping = FALSE, $return_nids_only = FALSE) {
  // Only allow owner / administrator to access this information, unless it's for bookkeeping
  global $user;
  if (!sidora_allow($user, $pid, 'permission') && !$administrative_bookkeeping) {
    return array();
  }
  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', 'node')
    ->propertyCondition('type', 'og_crud_group')
    ->propertyCondition('status', NODE_PUBLISHED)
    ->fieldCondition('field_fedora_pid', 'value', $pid, '=')
    ->addMetaData('account', user_load(1));
  $result = $query->execute();
  $to_return = array();
  if (isset($result['node'])) {
    $nids = array_keys($result['node']);
    if ($return_nids_only) {
      $to_return = $nids;
    }
    else {
      $to_return = entity_load('node', $nids);
    }
  } 
  return $to_return;
}
/**
 * Returns a tree based on the research spaces the user has access to, defaults to 4 levels total
 */
function sidora_project_spaces_tree($root_label = 'Research Space Destinations:', $include_href = FALSE, $permissions = array("create"), $start_open = TRUE, $num_levels = 3){
  //sleep(3);
  $ignore_pid = filter_input(INPUT_GET, 'ignore_pid', FILTER_SANITIZE_STRING);
  $specify_pids = filter_input(INPUT_GET, 'specify_pids', FILTER_SANITIZE_STRING);
  if (!empty($specify_pids)) {
    $specify_pids = explode(',', $specify_pids);
    if (empty($root_label)) {
      $root_label = 'Highlight a folder and submit';
    }
  }
  $always_ignore_pids = array('si:root','si:user-projects');
  global $user;
  $nodes = sidora_get_project_spaces_by_member();
  $to_return = '';
  $to_return .= '<ul>';
  $to_return .= '<li';
  if ($start_open) {
    $to_return .= ' class="jstree-open"';
  }
  $to_return .= '>';
  $to_return .= $root_label;
  foreach($nodes as $node) {
    $pid = $node->field_fedora_pid[$node->language][0]["safe_value"];
    if (
      $ignore_pid != $pid && 
      !in_array($pid, $always_ignore_pids) && 
      (sizeof($specify_pids) == 0 || in_array($pid, $specify_pids))
    ) {
      $continue_output = FALSE;
      if (empty($permissions)) {
        $continue_output = sidora_allow($user, $pid, 'view');
      }
      foreach($permissions as $permission_name) {
        if ($continue_output || sidora_allow($user, $pid, $permission_name)) {
          $continue_output = TRUE;
        }
      }
      if ($continue_output) {
        $filled = sidora_build_tree_from_nodes_by_pid($pid, $num_levels - 1);
        if (!empty($specify_pids)) {
          $filled = $filled[0]['children'];
        }
        $html_tree_from_query_result = sidora_html_tree_from_query_results_tree($filled, '', $num_levels, '', 'a', $include_href, $permissions);
        $to_return .= '<ul>';
        $to_return .= $html_tree_from_query_result;
        $to_return .= '</ul>';
      }
    }
  }
  $to_return .= '</li></ul>';
  return $to_return;
}

function sidora_sharing_create_or_get_owned_groups($for_uid = NULL) {
  $owned_groups = sidora_get_owned_groups();
  // If the user has no owned groups, create the groups
  if (empty($owned_groups)) {
    if ($for_uid == NULL) {
      global $user;
      $for_uid = $user->uid;
    }
    $newly_created_groups = sidora_create_all_groups_for_user($for_uid);
    // Also put all their stuff into the new groups
    return sidora_sharing_put_all_owned_concepts_into_owned_groups($for_uid, $newly_created_groups);
  }
  else {
    return $owned_groups;
  }
}

function sidora_sharing_put_all_owned_concepts_into_owned_groups($for_uid = NULL, $use_these_groups = NULL) {
  if ($for_uid == NULL) {
    global $user;
    $for_uid = $user->uid;
  }
  $owned_groups = ($use_these_groups == NULL) ? sidora_sharing_create_or_get_owned_groups($for_uid) : $use_these_groups;
  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle',  sidora_get_concept_content_type())
    ->propertyCondition('status', 1)
    ->propertyCondition('uid', $for_uid)
    ->fieldCondition('field_fedora_label', 'value', '', '!=')
    ->addMetaData('account', user_load(1));
  $result = $query->execute();
  foreach($result["node"] as $nid => $obj){
    foreach($owned_groups as $owned_group) {
      og_group('node', $owned_group, array('entity_type' => 'node', 'entity' => $nid));
    }
  }
  return $owned_groups;
}

/*
 * Returns the nodes of the research spaces of the specified user id (or current user on NULL)
 */
function sidora_get_project_spaces_by_member($uid = NULL){
  global $user;
  if ($uid == 'all') {
    $to_return = sidora_get_owned_project_spaces($uid);
  }
  else {
    $owner = sidora_get_drupal_user($uid);
    if (empty($owner)) {
      return array();
    }
    $group_nodes = sidora_get_groups_by_user();
    $to_return = sidora_get_project_spaces_from_og_groups($group_nodes, $user, FALSE);
  }
  return $to_return;
}
function sidora_project_space_creation_form($form = array(), &$form_state, $existing_pid = '') {
  drupal_add_css(drupal_get_path('module','sidora').'/css/workbench_basic_screen.css',array('weight' => '1000000', 'group' => CSS_THEME));
  drupal_add_css(drupal_get_path('module','sidora').'/css/workbench_util.css',array('weight' => '1000000', 'group' => CSS_THEME));
  global $user;
  $init_info = array('name'=>'','desc'=>'','file'=>'');
  if (!empty($existing_pid)) {
    if (!sidora_is_project_space($existing_pid) || !sidora_allow($user, $existing_pid, 'update')) {
      // Maybe this was just created and never initialized, try initializing it now
      sidora_build_tree_from_nodes_by_pid($existing_pid, 0);
      sidora_put_into_proper_project_space($existing_pid);
    }
    if (!sidora_is_project_space($existing_pid) || !sidora_allow($user, $existing_pid, 'update')) {
      $form['info'] = array(
        '#markup' => t('Unable to load the Research Space for editing. This error has been entered into the log so site administrators can view the issue. Contact the site administrator if you would like immediate assistance.'),
      );
      watchdog('sidora_spaces',t('Could not load this item for research space editing by the logged in user: %t', array('%t' => $existing_pid)));
      return $form;
    }
    else {
      $obj = sidora_obj($existing_pid);
      $init_info['name'] = $obj->label;
      drupal_set_title('Research Space Edit');
      $info = sidora_get_info($existing_pid);
      $node = $info['node'];
      $init_info['file'] = (empty($node->field_thumbnail['und'][0]))?'':$node->field_thumbnail['und'][0]['uri'];
      $init_info['desc'] = empty($node->body)?'':$node->body['und'][0]['value'];
    }
  }
  $form_state['existing_pid'] = $existing_pid;
  if (empty($existing_pid)) { 
    $form['info'] = array(
      '#markup' => t('After the research space is created, you can choose who should be part of the research space.')
    );
  }
  $form["ps_name"] = array(
    '#type' => 'textfield',
    '#size' => 128,
    '#title' => t('Enter the new research space name'),
    '#default_value' => $init_info['name'],
  );
  $form["ps_desc"] = array(
    '#type' => 'textarea',
    '#cols' => 80,
    '#title' => t('Enter the new research space description'),
    '#default_value' => $init_info['desc'],
  );
  if (!empty($init_info['file'])) {
    $form['remove_icon'] = array(
      '#type' => 'checkbox',
      '#title' => 'Remove existing icon: <img src="' . file_create_url($init_info['file']) . '">',
    );
    
  } 
  $form["file"] = array(
      '#type' => 'managed_file',
      '#title' => empty($init_info['file'])?t('Icon'):t('Overwrite Existing Icon'),
      '#description' => t('This file will be resized fit in a 24 x 24 space. Allowed extensions: gif png jpg jpeg'),
      '#upload_validators' => array(
        'file_validate_extensions' => array('gif png jpg jpeg'),
        // Pass the maximum file size in bytes
        'file_validate_size' => array(1 * 1024 * 1024),
        'file_validate_image_resolution' => array('24x24', '1x1'),
        'sidora_icon_upload_message' => array(),
      ),
      '#upload_location' => 'public://',
      '#attributes' => array('default_image_path' => ''),
  );
  $form['logo_preview'] = array(
    '#markup' => '<div style="position:relative;top:-25px;"><a href="#" onclick="doPreview();">Click here</a> to preview with current icon (must be uploaded) and name.<br><div class="logo-preview"></div></div>
    <script>
      doPreview=function(){
        myHref = jQuery(".file a").attr("href");
        myHtml = "";
        if (typeof(myHref) != "undefined") {
          myHtml =\'<img src="\' + jQuery(".file a").attr("href") + \'">\';
        }
        myHtml += " " + jQuery("#edit-ps-name").val();
        jQuery(".logo-preview").html(myHtml);
        return false;
      }
    </script>',
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
    '#attributes' => array(
      'onclick' => 'jQuery(body).append("<div class=\"full-screen-overlay\"></div>");',
    ),
  );
  $form['close'] = array(
    '#markup' => '<a style="" href="' . $GLOBALS['base_url'] . '/sidora/research_spaces" onclick="if (window.parent.sidora) {window.parent.sidora.ProjectSpaces.refreshOptions(1);} jQuery(body).append(\'<div class=\\\'full-screen-overlay\\\'></div>\');"><input type="button" id="closebottom" name="closebottom" value="Close" class="form-submit"></a>',
  );
  return $form;
}
function sidora_icon_upload_message(){
  drupal_set_message("Submit this form to save the new icon to the research space.", "warning");
  return array();
}
function sidora_project_space_creation_form_validate($form, &$form_state) {
  if (empty($form_state['values']['ps_name'])){ 
    form_set_error('ps_name', 'Enter a name for the research space.');
  }
}
function sidora_project_space_creation_form_submit($form, &$form_state) {
  $created_node = NULL;
  if (!empty($form_state['existing_pid'])) {
    $pid = $form_state['existing_pid'];
    module_load_include('inc', 'sidora', 'includes/sidora_nodes');
    $ps_info = sidora_get_info($pid);
    $obj = $ps_info['obj'];
    $old_label = $obj->label;
    $new_label = $form_state['values']['ps_name'];
    if ($old_label != $new_label) {
      $obj->label = $new_label;
    }
    $info =  array("label"=>$form_state['values']['ps_name'],"description"=>$form_state['values']['ps_desc']);
    $created_node = sidora_get_update_or_create_concept_node($pid, $info);
    if (array_key_exists('remove_icon',$form_state['values']) && $form_state['values']['remove_icon']) {
      $created_node->field_thumbnail['und'][0] = array();
      node_save($created_node);
    }
    drupal_set_message("Research Space Edits Saved");
  }
  else {
    global $user;
    module_load_include('inc', 'islandora', 'includes/utilities');
    $created_node = sidora_create_personal_project_space($user, array("label"=>$form_state['values']['ps_name'],"description"=>$form_state['values']['ps_desc']));
    if (!empty($created_node)) {
      // Load the information into the node from Fedora
      sidora_update_node_from_fedora($created_node);
      drupal_set_message("New Research Space Created");
    }
  }
  if (!empty($created_node)){
    $file = file_load($form_state['values']['file']);
    if (!empty($file)) {
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
    }
    node_save($created_node);
    sidora_put_into_proper_project_space($created_node);

    // On a create, go to the research_spaces page (which will then close)
    if (empty($form_state['existing_pid'])) {
      drupal_goto('sidora/research_spaces', array('query' => array('close' => 'now')));
    }
  }
  else {
    drupal_set_message("Research Space Editing Failed", "warning");
  }
}
/**
 * Removes a link to codebooks if the resource was unassociated from the research space
 */
function sidora_remove_old_codebook_associations_after_unassociating_resource_from_project_space($resource_pid){
  // Find out if it has codebooks, if not, do nothing
  $codebook_pids = sidora_get_codebook_pids($resource_pid);
  if (!empty($codebook_pids)){
    // Find out the research spaces of the resource
    $resource_ps_pids = sidora_get_project_space_pids_for_pid($resource_pid);
    // For each codebook
    foreach($codebook_pids as $codebook_pid){
      // Find out the research space it's owned by
      $curr_codebook_ps_pids = sidora_get_project_space_pids_for_pid($codebook_pid);
      // Simplifying assumption that this codebook is managed by a single research space
      $curr_codebook_ps_pid = array_pop($curr_codebook_ps_pids);
      // If the current codebook is not controlled by a research space, do not remove the link
      // If this resource is in the codebook's research space then do not remove the link
      if (!empty($curr_codebook_ps_pid) && !in_array($curr_codebook_ps_pid, $resource_ps_pids)){
        $object = sidora_obj($resource_pid);
        $object->relationships->remove(FEDORA_RELS_EXT_URI, 'hasCodebook', $codebook_pid);
      }
    }
  }
}
/**
 * Ensures that linking a resource to a different research space will have a codebook in the new research space
 */
function sidora_maintain_codebooks_when_linking_resource_to_new_project_space($resource_pid, $destination_pid){
  $new_ps_pids = sidora_get_project_space_pids_for_pid($destination_pid);
  if (!empty($new_ps_pids)){
    // Simplifying assumption that the place we are copying it to has a single research space
    // if above line not true then change "if (!empty" line to "foreach($new_ps_pids as $new_ps_pid){"
    $new_ps_pid = $new_ps_pids[0];
    $codebook_pids = sidora_get_codebook_pids($resource_pid);
    if (!empty($codebook_pids)){
      foreach($codebook_pids as $codebook_pid){
        // if the same research space then no need to do anything
        $curr_codebook_ps_pids = sidora_get_project_space_pids_for_pid($codebook_pid);
        // Simplifying assumption that this codebook is managed by a single research space
        $curr_codebook_ps_pid = array_pop($curr_codebook_ps_pids);
        if ($curr_codebook_ps_pid != $new_ps_pid) {
          // Do not remove the new object's refrences to the old codebook (done by unassociate)
          // Create a new set of codebooks and add in references on the new object
          $new_codebook = sidora_exact_duplicate($codebook_pid);
          // Manager of the new codebook is the research space the tabular data got copied into
          $ps_obj = sidora_obj($new_ps_pid);
          $ps_obj->relationships->add(FEDORA_RELS_EXT_URI, 'managesCodebook', $new_codebook->id);
          // Add the relationship of the duplicated codebook to the copied ("linked") object
          // So this means this object will point to DOUBLE the original number of codebooks if
          // the target research space doesn't already own the codebooks. Copying ("linking")
          // back and forth will continue duplicating codebooks on each link.
          // Use unassociate to remove unneeded linkages before copying ("linking") back and forth
          $object = sidora_obj($resource_pid);
          $object->relationships->add(FEDORA_RELS_EXT_URI, 'hasCodebook', $new_codebook->id);
        }
      }
    }
  }
}
function sidora_project_space_transfer_form($form = array(), &$form_state, $pid = NULL, $to_username = NULL) {
  drupal_add_css(drupal_get_path('module','sidora').'/css/workbench_basic_screen.css',array('weight' => '1000000', 'group' => CSS_THEME));
  global $user;
  $node = sidora_get_concept_node($pid);
  if (empty($node) || ($node->uid != $user->uid && !sidora_is_admin())) {
    $form['info'] = array(
      '#markup' => t('You no longer have access to change the owner of this research space.')
    );
    return $form;
  }
  if (empty( $node->field_fedora_label[$node->language][0]["safe_value"])){
    $form['info'] = array(
      '#markup' => t('This Research Space is corrupted. A message has been logged for the administrators. Contact the site administrator for immediate assistance.')
    );
    watchdog('sidora',t('User tried to transfer a research space, but it does not have the right node structure, entered pid: %t',array("%t"=>empty($pid)?"no pid entered":$pid)));
    return $form;
  }
  $label = $node->field_fedora_label[$node->language][0]["safe_value"];
  $form['pid_info_1'] = array(
    '#markup' => "<h1>$label</h1>",
  );
  if ($node->uid != $user->uid) {
    $form['current_owner_info'] = array(
      '#markup' => t('<h5> The current owner of this project is %uname. </h5>', array('%uname' => $node->name)),
    );
  }
  $form['pid_info_2'] = array(
    '#markup' => t('Transfer this research space to a new owner.'),
  );
  if (empty($to_username)) {
    $form["username_new"] = array(
      '#type' => 'textfield',
      '#autocomplete_path' => 'user/autocomplete',
      '#title' => t('Enter the username of the new owner'),
    );
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Submit'),
    );
  }
  else {
    if (empty($form_state['input'])) {
      if ($node->uid == $user->uid && !sidora_is_admin()) {
        drupal_set_message(t("After you transfer ownership you will no longer be able to change permissions or transfer ownership on the research space."),"warning");
      }
      drupal_set_message(t("Are you sure you want to transfer this research space to the user listed below?"),"warning");
    }
    $to_user = user_load_by_name($to_username);
    if (!empty($to_user)) {
      $form["username_new"] = array(
        '#type' => 'textfield',
        '#value' => $to_user->name,
        '#attributes' => array('readonly' => 'readonly'),
        '#attributes' => array('style' => 'background: #aaa'),
      );
    }
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Confirm'),
    );
  }
  $form_state['storage']['pid'] = $pid;
  return $form;
}
/*
 * Validation for the research space transfer form
 */
function sidora_project_space_transfer_form_validate($form, &$form_state) {
  $uid = '';
  if (!empty($form_state['values']['username_new'])){
    $result = (db_query("SELECT uid FROM users WHERE name = :s", array(':s' => $form_state['values']['username_new'])));
    foreach($result as $indiv){
      $uid = $indiv->uid;
    }
  }
  if (empty($uid)){ 
    form_set_error('username_new', 'Enter a valid username.');
  }
}

function sidora_project_space_transfer_form_submit($form, &$form_state) {
  if ($form_state['values']['op'] == 'Confirm') {
    $name = $form_state['values']['username_new'];
    $to_user = user_load_by_name($name);
    $pid = $form_state['storage']['pid'];
    // The sidora_transfer_project_space will hold the functionality to stop unauthorized users from making the change
    $node = sidora_get_concept_node($pid);
    $worked = sidora_transfer_project_space($node, $to_user);
    if ($worked) {
      $obj = sidora_obj($pid);
      $obj->owner = strtolower($name);
      drupal_set_message("Research Space ownership transferred.");
      drupal_goto(substr(current_path(), 0, strrpos(current_path(), '/')));
    }
    else {
      drupal_set_message("Error during processing.", "error");
    }
  }
  if ($form_state['values']['op'] == 'Submit') {
    $to_goto = (current_path() . '/' . $form_state['values']['username_new']);
    drupal_goto($to_goto);
  }
}

/**
 * Assumes the form was submitted for the logged in user
 */
function sidora_project_spaces_form_submit($form, &$form_state) {
  global $user;
  $owned_groups = sidora_get_project_spaces_by_member();
  foreach($owned_groups as $i => $owned_group) {
    $pid = $owned_group->field_fedora_pid[$owned_group->language][0]["safe_value"];
    // Only allow user to set defaults to something they can see
    if ($pid == $form_state['values']['default_ps']) {
      $edit['data']['default_ps'] = $pid;
      user_save($user,$edit);
    }
  }
}

/*
 * Create the sharing permissions form
 */
function sidora_project_spaces_form($form = array(), &$form_state, $uid = NULL) {
  drupal_add_css(drupal_get_path('module','sidora').'/css/workbench_basic_screen.css',array('weight' => '1000000', 'group' => CSS_THEME));
  drupal_add_js("
        jQuery(document).ready(function(){
          if (window.location.href.endsWith('?close=now')) {
            window.parent.sidora.ProjectSpaces.showOverlayDuringRefresh = true;
            window.parent.Shadowbox.close();
          }
        });
","inline");
  global $user;
  if (!sidora_is_admin($user) && !empty($uid)){
    $form['info'] = array(
      '#markup' => t('Need administrator to load specific users.')
    );
    return $form;
  }
  $owned_groups = sidora_get_project_spaces_by_member($uid);
  $form['cnps'] = array(
    '#markup' => '<a style="float:right" href="' . $GLOBALS['base_url'] . '/sidora/research_space_create"><input type="button" id="cnps" name="cnps" value="Create Research Space" class="form-submit"></a>',
  );
  $form['autopost'] = array(
    '#markup' => '<script>jQuery(document).ready(function(){jQuery("[name=\'default_ps\']").click(function(){jQuery.post(\'\',jQuery("#sidora-project-spaces-form").serialize())});});</script>',
  );
  $form['table'] = array(
    '#theme' => 'table',
    '#header' => array(t('Name'), t('Owner')),
  );
  $rows = array();
  $can_change_permission = FALSE;
  $default_ps = (empty($user->data['default_ps']))?"":$user->data['default_ps'];

  foreach($owned_groups as $i => $owned_group) {
    if (empty($owned_group) || empty($owned_group->field_fedora_pid[$owned_group->language])){
      watchdog("sidora","Problem with group:" . (empty($owned_group)?"empty":$owned_group->id));
    }
    else {
      $ogl = $owned_group->language;
      $pid = $owned_group->field_fedora_pid[$ogl][0]["safe_value"];
      $name_markup = '<span class="rs-listing-rs-name">';
      $name_markup .= '<a href="/sidora/workbench/#' . $pid . '?path=" onclick="var toChoose = jQuery(\'#forjstree ul li ul li a[pid=\\\'' . $pid . '\\\']\', window.parent.document).parent().attr(\'id\'); jQuery(\'#psdd-select\', window.parent.document).val(toChoose); window.parent.Shadowbox.close();  jQuery(\'#psdd-select\',window.parent.document).change(); return false;" class="">';
      $name_markup .= (empty($owned_group->field_fedora_label[$ogl]))?"(none)":$owned_group->field_fedora_label[$ogl][0]["safe_value"];
      $name_markup .= '</a>';
      $name_markup .= '</span>';
      $name_markup .= '<br>';
      $name_markup .= '<span class="rs-listing-rs-desc">';
      if (!empty($owned_group->body[$ogl])) {
        $ogb = $owned_group->body[$ogl];
      }
      $name_markup .= (empty($ogb))?"":$ogb[0]["value"];
      $name_markup .= '</span>';
      $row = array(
        "name_$i" => array('data' => array(
          '#markup' => $name_markup,
        )),
        "owner_$i" => array('data' => array(
          '#markup' => sidora_get_username_from_uid($owned_group->uid),
        )),
      );
      if (empty($uid) || $uid == $user->uid){
        $form['table']['#header'] = array(t('Name'), t('Owner'), t('Is Default'));
        $row["is_default_$i"] = array('data' => array(
          "check_default_$i" => array(
            '#type' =>'radio',
            '#attributes' => array(
              'name' => "default_ps",
              'value' => $pid,
            ),
          ),
        ));
        if ($pid == $default_ps) {
          $row["is_default_$i"]['data']["check_default_$i"]['#attributes']['checked'] = 'checked';
        }
      }
      if (sidora_allow($user, $pid, 'permissions')) {
        $operations_markup = l(t('Edit'),'/sidora/research_space_create/' . $pid);
        $operations_markup .= ' | ';
        $operations_markup .= l(t('Permissions'),'/sidora/sharing_permissions/' . $pid);
        $operations_markup .= ' | ';
        $operations_markup .= l(t('Change Owner'),'/sidora/research_space_transfer/' . $pid);
        $row["edit_$i"] = array('data' => array(
          '#markup' => $operations_markup,
        ));
        $can_change_permission = TRUE;
      }
      else {
        $row["edit_$i"] = array('data' => array(
          '#markup' => ''
      ));
      }
      $rows['myrow'.$i] = $row;
    }
  }
  if ($can_change_permission) {
    $form['table']['#header'][] = t('Operations');
  }
  $form['table']['#rows'] = $rows;
  if (empty($uid) || $uid == $user->uid){
    $form['default_ps'] = array('#type'=>'radio', '#attributes' => array('style' => 'display:none;'));
    if (sidora_is_admin()) { 
      $form['show_all'] = array(
        '#markup' => '<div style="position:relative;top:-30px;height:0px;">' . l(t('Show All'),'/sidora/research_spaces/all') . '</div>',
      );
    }
  }
  if ($uid == 'all') {
    $form['show_mine'] = array(
      '#markup' => '<div style="margin-bottom:8px;">' . l(t('Show Mine'),'/sidora/research_spaces') . '</div>',
    );
  }
  $form['close'] = array(
    '#markup' => '<a style="float:left" href="#" onclick="window.parent.Shadowbox.close(); return false;"><input type="button" id="closebottom" name="closebottom" value="Close" class="form-submit"></a>',
  );
  if (empty($uid) || $uid == $user->uid){
    $form['submit'] = array(
      '#attributes' => array('style' => 'display:none'),
      '#type' => 'submit',
      '#value' => t('Submit'),
    );
  }
  return $form;
}

/*
 * Create the sharing permissions form
 */
function sidora_sharing_permissions_form($form = array(), &$form_state, $pid) {
  global $user;
  if (!sidora_allow($user, $pid, 'permissions')) {
    $form['info'] = array(
      '#markup' => t('PID not found or no access to permissions for PID')
    );
    return $form;
  }
  $node = sidora_get_concept_node($pid);
  $label = $node->field_fedora_label[$node->language][0]["safe_value"];
  $form['pid_info'] = array(
    '#markup' => "<h1>$label</h1>"
  );
  $form['table'] = array(
    '#theme' => 'sidora_sharing_permissions',
    '#header' => array(t('User'), t('View'), t('Create'), t('Edit'), t('Delete')),
  );
  $selected_groups = sidora_get_groups_for_project_space($pid);
  $member_to_group_association = sidora_get_member_to_group_association($selected_groups);
  $rows = array();
  foreach($member_to_group_association as $uid => $groups) {
    // Do not include the owner, they have override on permissions
    if ($uid != $node->uid) { 
      $username = sidora_get_username_from_uid($uid);
      $row = array(
        "username_$uid" => array(
          '#markup' => $username,
        ),
        "view_$uid" => array(
          '#type' =>'checkbox',
          '#default_value' => FALSE,
          '#attributes' => array("sidora_option"=>array('view_only')),
        ),
        "create_$uid" => array(
          '#type' =>'checkbox',
          '#default_value' => FALSE,
          '#attributes' => array("sidora_option"=>array('require_view')),
        ),
        "edit_$uid" => array(
          '#type' =>'checkbox',
          '#default_value' => FALSE,
          '#attributes' => array("sidora_option"=>array('require_view')),
        ),
        "delete_$uid" => array(
          '#type' =>'checkbox',
          '#default_value' => FALSE,
          '#attributes' => array("sidora_option"=>array('require_view')),
        ),
      );
      foreach($groups as $group) {
        $row[sidora_get_sidora_group_type($group) . "_$uid"]['#default_value'] = TRUE;
      }
      $rows[$uid] = $row;
    }
  }
  $row = array(
    "username_new" => array(
      '#autocomplete_path' => 'user/autocomplete',
      '#type' => 'textfield',
    ),
    "view_new" => array(
      '#type' =>'checkbox',
      '#default_value' => FALSE,
      '#attributes' => array("sidora_option"=>array('view_only')),
    ),
    "create_new" => array(
      '#type' =>'checkbox',
      '#default_value' => FALSE,
      '#attributes' => array("sidora_option"=>array('require_view')),
    ),
    "edit_new" => array(
      '#type' =>'checkbox',
      '#default_value' => FALSE,
      '#attributes' => array("sidora_option"=>array('require_view')),
    ),
    "delete_new" => array(
      '#type' =>'checkbox',
      '#default_value' => FALSE,
      '#attributes' => array("sidora_option"=>array('require_view')),
    ),
  );
  $rows[] = $row;
  $form['table']['rows'] = $rows;

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );
  $form_state['storage']['pid'] = $pid;
  return $form;
}

/*
 * Validation for the sharing permissions form
 */
function sidora_sharing_permissions_form_validate($form, &$form_state) {
  if (!empty($form_state['values']['username_new'])){
    $result = (db_query("SELECT uid FROM users WHERE name = :s", array(':s' => $form_state['values']['username_new'])));
    foreach($result as $indiv){
      $uid = $indiv->uid;
    }
    if (empty($uid)){ 
      form_set_error('username_new', 'Enter a valid username.');
    }
    else {
      $form_state['values']["create_$uid"] = $form_state['values']["create_new"];
      $form_state['values']["view_$uid"] =   $form_state['values']["view_new"];
      $form_state['values']["edit_$uid"] =   $form_state['values']["edit_new"];
      $form_state['values']["delete_$uid"] = $form_state['values']["delete_new"];
    }
  }
}

/*
 * Submit handler for the sharing permissions form
 */
function sidora_sharing_permissions_form_submit($form, &$form_state) {
  $pid = $form_state['storage']['pid'];
  global $user;
  if (!sidora_allow($user, $pid, 'permissions')) {
    // Do not allow any unauthorized items in the submit handler
    return;
  }

  $groups = sidora_get_groups_for_project_space($pid);
  $group_assoc = array();
  foreach($groups as $group) {
   $group_type = sidora_get_sidora_group_type($group);
   $group_assoc[$group_type] = $group;
  }
  foreach($form_state['values'] as $gtu => $add_remove) {
    // The index is made up of <group_type>_<user_id> so break it up to see what we should do
    // the value is whether the group should contain that user, so either add or remove them
    if (sidora_contains($gtu, '_')) {
      $parts = explode('_',$gtu);
      $type = $parts[0];
      $uid = $parts[1];
      if (is_numeric($uid) && array_key_exists($type, $group_assoc)) {
        $group = $group_assoc[$type];
        if ($add_remove) {
          og_group('node', $group, array('entity' => $uid));
        }
        else {
          og_ungroup('node', $group, 'user', $uid);
        }
      }
    }
  }
}

/*
 * themes the sharing_permissions_form
 */
function theme_sidora_sharing_permissions(&$variables){
  drupal_add_css(drupal_get_path('module','sidora').'/css/workbench_basic_screen.css',array('weight' => '1000000', 'group' => CSS_THEME));
  drupal_add_js("
jQuery(document).ready(function(){

jQuery('[sidora_option=\'require_view\']').change(function(){ checkViewPermission(this); });
jQuery('[sidora_option=\'view_only\']').change(function(){ uncheckAllPermission(this); });
uncheckAllPermission = function(clicked){
   if (!clicked.checked){
     var allItem = jQuery(clicked).closest('tr').find('[sidora_option=\'require_view\']');
     jQuery(allItem).prop('checked','');
   } 
}
checkViewPermission = function(clicked){
   if (clicked.checked){
     var viewItem = jQuery(clicked).closest('tr').find('[sidora_option=\'view_only\']');
     jQuery(viewItem).prop('checked','checked');
   } 
}

});  ", 'inline');
  $form = $variables['form'];
  $rows = $form['rows'];
  $header = $form['#header'];
  $content = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => array(),
  );
  foreach (element_children($rows) as $row_index) {
    $row = array();
    // Traverse each column in the row.  @see element_children().
    foreach (element_children($rows[$row_index]) as $col_index) {
      // Render the column form element.
      $row[] = drupal_render($rows[$row_index][$col_index]);
    }
    // Add the row to the table.
    $content['#rows'][] = $row;
  }
  return t('Giving a user create, edit, or delete permission allows the user to view the content.') . drupal_render($content);
}

/*
 * Returns an array of group objects that are owned by the entered user id or current user if blank / null
 */
function sidora_get_owned_groups($uid = NULL) {
  global $user;
  if ($uid == NULL) {
    $uid = $user->uid;
  }
  $gids = og_get_all_group();
  $groups = node_load_multiple($gids);
  $selected_groups = array();
  foreach($groups as $group){
    if ($group->uid == $uid){
      $selected_groups[] = $group;
    }
  }
  return $selected_groups;
}
/**
 * Returns an array of the form
 * $returned[$uid] = array of groups they are a member of (from the input groups)
 */
function sidora_get_member_to_group_association($selected_groups) {
  $member_to_group_association = array();
  foreach($selected_groups as $group){
    $members = og_get_group_members_properties($group, array(), 'members', 'node');
    foreach($members as $member){
      if (empty($member_to_group_association[$member])){
        $member_to_group_association[$member] = array();
      }
      $member_to_group_association[$member][] = $group;
    }
  }
  return $member_to_group_association;
}

/**
 * Encapsulating getting the group type in case we do not want to use the title as the discriminator later (like using actual permissions instead)
 */
function sidora_get_sidora_group_type($group){
  if (sidora_endsWith($group->title,' Create')) return 'create';
  if (sidora_endsWith($group->title,' View')) return 'view';
  if (sidora_endsWith($group->title,' Edit')) return 'edit';
  if (sidora_endsWith($group->title,' Delete')) return 'delete';
  return NULL;
}

function sidora_create_personal_project_space($account = NULL, $info = NULL) {
  $owner = sidora_get_drupal_user($account);
  $user_projects = islandora_object_load('si:user-projects');
  if (!is_object($user_projects)) {
    return FALSE;
  }
  module_load_include('inc', 'xml_form_builder', 'includes/associations');
  module_load_include('inc', 'islandora', 'includes/utilities');
  module_load_include('inc', 'sidora', 'includes/utils');
  $user_ps_object = $user_projects->repository->constructObject('si');
  $user_ps_object->owner = $owner->name;
  $ontology_location = "USER_INITIATED_PROJECT_SPACE_CREATION";
  if (empty($info) || empty($info['label'])) {
    $user_ps_object->label = "{$owner->name} Research Space";
    $ontology_location = "AUTOMATIC_PROJECT_SPACE_CREATION";
  }
  else {
    $user_ps_object->label = $info['label'];
  }
  $user_ps_object->models = array('si:conceptCModel', variable_get('sidora_automatic_person_model', 'si:HierarchyObject'));
  $associations = xml_form_builder_get_associations(array(), $user_ps_object->models, array());
  if (count($associations) == 1){
    sidora_update_datastream($user_ps_object, '<sidora>
<model>'.$associations[0]['content_model'].'</model>
<form>'.$associations[0]['form_name'].'</form>
<ontology_location_id>'.$ontology_location.'</ontology_location_id>
<meta_requirements_fulfilled>TRUE</meta_requirements_fulfilled>
<initial_dsid>'.$associations[0]['dsid'].'</initial_dsid>
</sidora>', 'SIDORA',NULL,NULL,'X');
  }else{
    $dsid = variable_get('sidora_automatic_person_dsid', 'DESCMETA');
    sidora_update_datastream($user_ps_object, '<sidora>
<model>'.variable_get('sidora_automatic_person_model', 'si:HierarchyObject').'</model>
<form>'. variable_get('sidora_automatic_person_form', 'Person 2015').'</form>
<ontology_location_id>AUTOMATIC_USER_CREATION_FROM_SIDORA_DEFAULT</ontology_location_id>
<meta_requirements_fulfilled>FALSE</meta_requirements_fulfilled>
<initial_dsid>'.$dsid.'</initial_dsid>
</sidora>', 'SIDORA',NULL,NULL,'X');
    if (empty($user_ps_object[$dsid])) sidora_update_datastream($user_ps_object, '<xml></xml>', $dsid, NULL, NULL, 'X');
  }

  sidora_add_child($user_projects, $user_ps_object);

  // Create the concept
  islandora_add_object($user_ps_object);
  $created_node = sidora_create_groups_for_pid($user_ps_object, $owner, $info);
  return $created_node;
}
function sidora_create_groups_for_pid($user_ps_object, $owner, $info = array()){
  global $user;
  $concept_pid = $user_ps_object->id;
  if (empty($info)) {
    $info = array();
  }
  $info['label'] = $user_ps_object->label;
  $info['concept_children'] = 0;
  $info['resource_children'] = 0;
  if (empty($info) || empty($info['owner'])){
    if (empty($owner) || empty($owner->name)){
      $info['owner'] = $user->name;
    }
    else {
      $info['owner'] = $owner->name;
    }
  }

  $created_node = sidora_get_update_or_create_concept_node($concept_pid, $info);
  // Create the groups
  sidora_create_sidora_group($owner, $concept_pid, 'create');
  sidora_create_sidora_group($owner, $concept_pid, 'view');
  sidora_create_sidora_group($owner, $concept_pid, 'edit');
  sidora_create_sidora_group($owner, $concept_pid, 'delete');
  node_save($created_node);
  sidora_put_into_project_spaces($concept_pid, $concept_pid);
   
  return $created_node;
}

function sidora_transfer_project_space($ps_node, $new_owner) {
  if (is_numeric($ps_node)) {
    $ps_node = node_load($ps_node);
  }
  if (is_string($ps_node)) {
    watchdog("sidora", t("Passed research space could not be determined. Did not pass in a node or node id. Function does not take pids."));
    return FALSE;
  }
  if (is_numeric($new_owner)) {
    $new_owner = user_load($new_owner);
  }
  global $user;
  if (empty($new_owner) || empty($new_owner->uid) || empty($ps_node) || empty($ps_node->uid)) {
    $info = "|new_owner empty?" . empty($new_owner);
    if (!empty($new_owner)) {
      $info .= "|new_owner uid:" . $new_owner->uid;
    }
    $info .= "|ps_node empty?" . empty($ps_node);
    if (!empty($ps_node)) {
      $info .= "|ps_node uid:" . $ps_node->uid;
    }
    watchdog("sidora", t("Invalid attempt to change a research space to a new owner, new owner or research space is invalid. Info:".$info));
    return FALSE;
  }
  // The one requesting the transfer must be an admin or the owner
  if (!sidora_is_admin() && !($user->uid == $ps_node->uid)) {
    watchdog(
      "sidora",
      t(
        "Invalid user attempted to change a research space to a new owner id: %name from owner id: %currentowner",
        array("%name" => $new_owner->uid, "%currentowner" => $ps_node->uid)
      )
    );
    return FALSE;
  }
  $pid = '';
  if (!empty($ps_node->field_fedora_pid) && array_key_exists($ps_node->language, $ps_node->field_fedora_pid)) {
    $pid = $ps_node->field_fedora_pid[$ps_node->language][0]['value'];
  }
  if (empty($pid)) {
    watchdog(
      "sidora",
      t(
        "Invalid attempt to change a research space to a new owner id: %name from owner id: %currentowner",
        array("%name" => $new_owner->id, "%currentowner" => $ps_node->uid)
      )
    );
    return FALSE;
  }
  
  $groups = sidora_get_groups_for_project_space($pid);
  $to_change = $groups;
  $to_change[] = $ps_node;
  foreach($to_change as $node) {
    $node->uid = $new_owner->uid;
    node_save($node);
  }
  // if there is a problem saving an exception gets thrown. Let it bubble up.
  return TRUE;
}
