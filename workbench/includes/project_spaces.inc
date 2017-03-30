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
 * Assume that the passed in item has a node if it should, and put that node into the 
 * project spaces
 * of the best parent if not already in a project space of a parent
 *
 * To be "IN" the same project space as the parent, that means the node has the same 
 * organic group memberships that the parent does.
 * 
 * Return TRUE if things went into proper project space --
 *             this includes if there was NO proper project spaces to place it
 *        FALSE if it was something that shouldn't go into a project space or
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
  // If it IS the project space, put it into the right groups. Do not remove existing groups.
  $project_space_groups = sidora_get_groups_for_project_space($pid, TRUE);
  if (!empty($project_space_groups)) {
    foreach($project_space_groups as $individual_group) {
      og_group('node', $individual_group, array('entity_type' => 'node', 'entity' => $nid));
    }
  }
  else {
    // If already in a project space of one of its parents, then nothing needs to happen
    module_load_include('inc', 'sidora', 'includes/utils');
    $parent_infos = sidora_get_parent_concepts_by_pid($pid);
    $is_in_a_parents_project_space = FALSE;
    $current_gids = sidora_get_group_nids_membership($nid);
    // Parent communal is used for checking if all the parents have the same project spaces
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
      // If all parents have the same project spaces, put it there
      if ($parents_are_communal) {
        $parent_groups = node_load_multiple($parent_communal_gids);
        foreach($parent_groups as $parent_group) {
          og_group('node', $parent_group, array('entity_type' => 'node', 'entity' => $nid));
        }
      }
      else {
        // TODO TBD These will be more for legacy data than new objects
        // If still a child of the original_parent from the SIDORA datastream,
        //     put into that parent's project space
        // Choose the parent that has the oldest node modification date
      }
    }
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
 * Assumes owners of the project spaces should also own the organic groups
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
 * Returns the concept nodes that represent the project spaces for a set of permission groups nodes
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
           $project_spaces[] = $sgcn;
         }
      }
  }
  return $project_spaces; 
}
/**
 * Returns group nodes that have their group root pid set to the input value
 */
function sidora_get_groups_for_project_space($pid, $administrative_bookkeeping = FALSE) {
  // Only allow owner / administrator to access this information
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
    $to_return = entity_load('node', $nids);
  } 
  return $to_return;
}
/**
 * Returns a tree based on the project spaces the user has access to, defaults to 4 levels total
 */
function sidora_project_spaces_tree($root_label = 'Project Spaces where you can create:', $include_href = FALSE, $permissions = array("create"), $start_open = TRUE){
  $ignore_pid = filter_input(INPUT_GET, 'ignore_pid', FILTER_SANITIZE_STRING);
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
    if ($ignore_pid != $pid) {
      $continue_output = FALSE;
      if (empty($permissions)) {
        $continue_output = TRUE;
      }
      foreach($permissions as $permission_name) {
        if ($continue_output || sidora_allow($user, $pid, $permission_name)) {
          $continue_output = TRUE;
        }
      }
      if ($continue_output) {
        $filled = sidora_build_tree_from_nodes_by_pid($pid);
        $num_levels = 3;
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
 * Returns the nodes of the project spaces of the specified user id (or current user on NULL)
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
  global $user;
  if (!sidora_is_admin($user) && !empty($uid)){
    $form['info'] = array(
      '#markup' => t('Need administrator to load specific users.')
    );
    return $form;
  }
  $owned_groups = sidora_get_project_spaces_by_member($uid);
  $form['table'] = array(
    '#theme' => 'table',
    '#header' => array(t('Name'), t('Description'), t('Owner')),
  );
  $rows = array();
  $can_change_permission = FALSE;
  $default_ps = (empty($user->data['default_ps']))?"":$user->data['default_ps'];

  foreach($owned_groups as $i => $owned_group) {
      $pid = $owned_group->field_fedora_pid[$owned_group->language][0]["safe_value"];
      $row = array(
        "name_$i" => array('data' => array(
          '#markup' => $owned_group->field_fedora_label[$owned_group->language][0]["safe_value"],
        )),
        "desc_$i" => array('data' => array(
          '#markup' => t('TBD'),
        )),
        "owner_$i" => array('data' => array(
          '#markup' => sidora_get_username_from_uid($owned_group->uid),
        )),
      );
      if (empty($uid) || $uid == $user->uid){
        $form['table']['#header'] = array(t('Name'), t('Description'), t('Owner'), t('Is Default'));
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
        $row["edit_$i"] = array('data' => array(
          '#markup' => l(t('Permissions'),'/sidora/sharing_permissions/' . $pid),
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
  if ($can_change_permission) {
    $form['table']['#header'][] = t('Permissions');
  }
  $form['table']['#rows'] = $rows;
  $form['default_ps'] = array('#type'=>'radio', '#attributes' => array('style' => 'display:none;'));
  if (sidora_is_admin()) { 
    $form['show_all'] = array(
      '#markup' => '<div>' . l(t('Show All'),'/sidora/project_spaces/all') . '<div>',
    );
  }
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );
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
    '#header' => array(t('User'), t('Create'),t('View'),t('Edit'),t('Delete')),
  );
  $selected_groups = sidora_get_groups_for_project_space($pid);
  $member_to_group_association = sidora_get_member_to_group_association($selected_groups);
  $rows = array();
  foreach($member_to_group_association as $uid => $groups) {
    // Do not include yourself in the list of users
    if ($uid != $user->uid) { 
      $username = sidora_get_username_from_uid($uid);
      $row = array(
        "username_$uid" => array(
          '#markup' => $username,
        ),
        "create_$uid" => array(
          '#type' =>'checkbox',
          '#default_value' => FALSE,
        ),
        "view_$uid" => array(
          '#type' =>'checkbox',
          '#default_value' => FALSE,
        ),
        "edit_$uid" => array(
          '#type' =>'checkbox',
          '#default_value' => FALSE,
        ),
        "delete_$uid" => array(
          '#type' =>'checkbox',
          '#default_value' => FALSE,
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
      '#type' => 'textfield',
    ),
    "create_new" => array(
      '#type' =>'checkbox',
      '#default_value' => FALSE,
    ),
    "view_new" => array(
      '#type' =>'checkbox',
      '#default_value' => FALSE,
    ),
    "edit_new" => array(
      '#type' =>'checkbox',
      '#default_value' => FALSE,
    ),
    "delete_new" => array(
      '#type' =>'checkbox',
      '#default_value' => FALSE,
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
  return t('Giving a user create, edit, or delete permission will allow the user to view the content, even if view is not checked.') . drupal_render($content);
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

function sidora_create_personal_project_space($account) {
  $owner = sidora_get_drupal_user($account);
  $user_projects = islandora_object_load('si:user-projects');
  if (!is_object($user_projects)) {
    return FALSE;
  }
  module_load_include('inc', 'xml_form_builder', 'includes/associations');
  $user_ps_object = $user_projects->repository->constructObject('si');
  $user_ps_object->owner = $owner->name;
  $user_ps_object->label = "{$owner->name} Project Space";
  $user_ps_object->models = array('si:conceptCModel', variable_get('sidora_automatic_person_model', 'si:HierarchyObject'));
  $associations = xml_form_builder_get_associations(array(), $user_ps_object->models, array());
  if (count($associations) == 1){
    sidora_update_datastream($user_ps_object, '<sidora>
<model>'.$associations[0]['content_model'].'</model>
<form>'.$associations[0]['form_name'].'</form>
<ontology_location_id>AUTOMATIC_PROJECT_SPACE_CREATION</ontology_location_id>
<meta_requirements_fulfilled>TRUE</meta_requirements_fulfilled>
<initial_dsid>'.$associations[0]['dsid'].'</initial_dsid>
</sidora>', 'SIDORA');
  }else{
    $dsid = variable_get('sidora_automatic_person_dsid', 'DESCMETA');
    sidora_update_datastream($user_ps_object, '<sidora>
<model>'.variable_get('sidora_automatic_person_model', 'si:HierarchyObject').'</model>
<form>'. variable_get('sidora_automatic_person_form', 'Person 2015').'</form>
<ontology_location_id>AUTOMATIC_USER_CREATION_FROM_SIDORA_DEFAULT</ontology_location_id>
<meta_requirements_fulfilled>FALSE</meta_requirements_fulfilled>
<initial_dsid>'.$dsid.'</initial_dsid>
</sidora>', 'SIDORA');
    if (empty($user_ps_object[$dsid])) sidora_update_datastream($user_ps_object, '<xml></xml>', $dsid);
  }

  sidora_add_child($user_projects, $user_ps_object);

  // Create the concept
  islandora_add_object($user_ps_object);
  $concept_pid = $user_ps_object->id;
  // Create a placeholder node that will be filled in when requested
  $created_node = sidora_get_update_or_create_concept_node($concept_pid, array());
  // Create the groups
  sidora_create_sidora_group($owner, $concept_pid, 'create');
  sidora_create_sidora_group($owner, $concept_pid, 'view');
  sidora_create_sidora_group($owner, $concept_pid, 'edit');
  sidora_create_sidora_group($owner, $concept_pid, 'delete');
}

function sidora_transfer_project_space($project_space_node, $new_owner) {
  global $user;
  // The one requesting the transfer must be an admin or the owner
  if (!sidora_is_admin() && !($user->uid == $project_space_node->uid)) {
    watchdog("sidora",t("Invalid user attempted to change a project space to a new owner: %name", array("%name" => $new_owner->name)));
  }
  
}
