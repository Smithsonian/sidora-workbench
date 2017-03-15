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
           $project_spaces[] = sidora_get_concept_node($pid);
         }
      }
  }
  return $project_spaces; 
}
/**
 * Returns group nodes that have their group root pid set to the input value
 */
function sidora_get_groups_for_project_space($pid) {
  // Only allow owner / administrator to access this information
  global $user;
  if (!sidora_allow($user, $pid, 'permission')) {
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
function sidora_project_spaces_tree(){
  $to_return = '';
  $nodes = sidora_get_project_spaces_by_member();
  $to_return .= "<ul>";
  foreach($nodes as $node) {
    $pid = $node->field_fedora_pid[$node->language][0]["safe_value"];
    $standard_print = sidora_html_tree_for_ajax($pid);
    $to_return .= substr($standard_print, 4, sizeof($standard_print) - 11);
  }
  $to_return .= "</ul>";
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

