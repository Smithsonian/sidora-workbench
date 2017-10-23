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
function exhibition_config_view_session_visibility($pid) {
  echo '<pre>';
  echo $pid;
  print_r($_SESSION['exhibition_visibility'][$pid]);
  echo '<pre/>';
  if (isset($_SESSION['exhibition_visibility'][$pid])) {
    foreach ($_SESSION['exhibition_visibility'][$pid]['page'] as $page_number => $visibility_array) {
      $visibility_array = json_decode($visibility_array, TRUE);
      echo '<pre>';
      echo 'page : ' . $page_number;
      print_r($visibility_array);
      echo '</pre>';
    } 
  }
}
/*
 * Return the information for the base information column
 */
function exhibition_config_get_sidebar_info($root_pid) {
  // We want to give the information the user can actually deal with.
  // They are not going to be able to manually go through more than a certain number
  // of items, and the cutoff will be how much is a little more than they can deal with
  // The reason to have a lower cutoff is to preserve on communication and objects in the
  // visibility page
  $cutoff_number = 100;
 
  $shown = $hidden = array();
  $metadata_shown = $vis_items_with_metadata_hidden = array();
  $preview_shown = $vis_items_with_no_preview = array();
  $downloads_shown = $vis_items_with_no_download = array();

  exhibition_config_prepare_visibility_for_use($root_pid);
  $visibility_page_keys = exhibition_config_get_visibility_page_keys($root_pid);
  for ($vpki = 0; $vpki < sizeof($visibility_page_keys); $vpki++) {
    $visibility_page_key = $visibility_page_keys[$vpki];
    $visibility_array = exhibition_config_get_visibility_page($root_pid, $visibility_page_key);
    $visibility_array = json_decode($visibility_array, TRUE);
    if (!empty($visibility_array)){
      foreach($visibility_array as $pid => $individual_form_data) {
        if ($individual_form_data['show_name']['#default_value']) {
          $shown[] = $pid;
          if ($individual_form_data['show_meta']['#default_value']) {
            $metadata_shown[] = $pid;
          }
          else {
            $vis_items_with_metadata_hidden[] = $pid;
          }
          if ($individual_form_data['show_preview']['#type'] == 'checkbox') {
            if ($individual_form_data['show_preview']['#default_value']) {
              $preview_shown[] = $pid;
            }
            else {
              $vis_items_with_no_preview[] = $pid;
            }
          }
          if ($individual_form_data['allow_download']['#type'] == 'checkbox') {
            if ($individual_form_data['allow_download']['#default_value']) {
              $downloads_shown[] = $pid;
            }
            else {
              $vis_items_with_no_download[] = $pid;
            }
          }

        }
        else {
          $hidden[] = $pid;
        }
      }
    }
  }
  $to_print = array(
    'shown'=>$shown,
    'hidden'=>$hidden,
    'meta_shown'=>$metadata_shown,
    'meta_hidden'=>$vis_items_with_metadata_hidden,
    'preview'=>$preview_shown,
    'no_preview'=>$vis_items_with_no_preview,
    'download'=>$downloads_shown,
    'no_download'=>$vis_items_with_no_download,
  );
  print json_encode($to_print);
  exit();
}
/**
 * Return a visibility object containing a page, or containing all pages based on the page range
 * $page_range - integer or a range that is two integers separated by a dash
 */
function exhibition_config_get_visibility_page($pid, $page_range) {
  if (isset($_SESSION['exhibition_visibility'][$pid]['page'])){
    if (empty($page_range)) {
      return $_SESSION['exhibition_visibility'][$pid]['page'];
    }
    else {
      if (isset($_SESSION['exhibition_visibility'][$pid]['page'][$page_range])){
        return $_SESSION['exhibition_visibility'][$pid]['page'][$page_range];
      }
    }
  }
  if (isset($_SESSION['exhibition_visibility'][$pid]['storage'])) {
    if (isset($_SESSION['exhibition_visibility'][$pid]['storage'][$page_range])) {
      $full_filename = $_SESSION['exhibition_visibility'][$pid]['storage'][$page_range];
      $myfile = fopen($full_filename, 'r');
      $to_return = fread($myfile, filesize($full_filename));
      fclose($myfile);
      return $to_return;
    }
    else {
      watchdog("exhibition_config","bad ask for vis_page: $pid $page_range");
      echo "bad ask for vis_page: $pid $page_range\n";
    }
  }
  return NULL;
}
function exhibition_config_set_visibility_page($pid, $page_range, $value) {
  global $user;
  if (isset($_SESSION['exhibition_visibility'][$pid]['page'])){
    if (isset($_SESSION['exhibition_visibility'][$pid]['page'][$page_range])){
      $_SESSION['exhibition_visibility'][$pid]['page'][$page_range] = $value;
    }
  }
  $target_dir = file_directory_temp();
  $name = uniqid("vis_page_".$user->uid.'_');
  $full_filename = $target_dir . DIRECTORY_SEPARATOR . $name;
  $_SESSION['exhibition_visibility'][$pid]['storage'][$page_range] = $full_filename;
  $myfile = fopen($full_filename, "w");
  fwrite($myfile, $value);
  fclose($myfile);
}
/*
 * return all the valid keys for the visibility pages
 */
function exhibition_config_get_visibility_page_keys($pid){
  $page_keys = $storage_keys = $keys = array();
  if (isset($_SESSION['exhibition_visibility'][$pid]['page'])) {
    $page_keys = array_keys($_SESSION['exhibition_visibility'][$pid]['page']);
  }
  if (isset($_SESSION['exhibition_visibility'][$pid]['storage'])) {
    $storage_keys = array_keys($_SESSION['exhibition_visibility'][$pid]['storage']);
  }
  $full_keys = array_merge($page_keys, $storage_keys);
  return $full_keys;
}
function exhibition_config_ajax_parts($op,$pid,$arg1='',$arg2=''){
  switch ($op) {
    case 'sidebar':
      exhibition_config_get_sidebar_info($pid); 
    break;
    case 'paging' :
    $objects_per_session_page = '200'; //TODO change
    $per_page = $arg1;
    $page_number = $arg2;
    if (isset($pid)) {
      $page_per_session = $objects_per_session_page / $per_page;
      $starting_page = floor($page_number / $page_per_session) * $page_per_session;
      $ending_page = exhibition_config_get_page($objects_per_session_page-1,$per_page);
      if ($page_number % $page_per_session == 0) {
        $session_key = ($starting_page - ($ending_page - 1)) . '-' . $starting_page;
      }
      else {
        $session_key = ($starting_page + 1) . '-' . ($starting_page+$ending_page);
      }
      $ecgvp = exhibition_config_get_visibility_page($pid, $session_key);
      if (empty($ecgvp)) {
        $page_offset = exhibition_config_get_offset($page_number,1,$per_page);
        $session_page_offset = floor($page_offset / $objects_per_session_page) * $objects_per_session_page;
        $checkbox_rows = exhibition_config_get_tree_checkboxes($pid);
        $saved_visibility = exhibition_config_load_visibility_for_configuration($pid);
        $visibility_array = array_slice($checkbox_rows,$session_page_offset,$objects_per_session_page);
        $session_starting_page = exhibition_config_get_page($session_page_offset,$per_page);
        $tree_html = '';
        $visibility_array = exhibition_config_update_visibility($visibility_array,$saved_visibility,$tree_html);
        exhibition_config_set_visibility_page($pid,$session_key,json_encode($visibility_array));
      }
      else {
        $visibility_array = json_decode(exhibition_config_get_visibility_page($pid,$session_key),TRUE);
        $session_starting_page = $starting_page+1;
      }   
      $current_page_offset = exhibition_config_get_offset($page_number,$session_starting_page,$per_page);
      $visibility_array = array_slice($visibility_array,$current_page_offset,$per_page);
      $current_page = $visibility_array;
      $to_return = '';
      foreach ($current_page as $visibility_path => $visibility_row) {
        if ((is_array($visibility_row)) && (array_key_exists('show_name',$visibility_row))) {
          foreach($visibility_row as $visibility_key => $visibility_value) {
            if ((is_array($visibility_value)) && (array_key_exists('#type',$visibility_value))) {
              $to_return .= $visibility_value['#prefix'];
              if ($visibility_value['#type'] == 'checkbox') {
                $to_return .= '<div class="form-item form-type-checkbox form-item-visibility-' . $visibility_path . '-' . $visibility_key . '">';
                $to_return .= '<input ';
                $to_return .= 'label="' . (isset($visibility_value['#attributes']['label'])?$visibility_value['#attributes']['label']:'') . '" ';
                $to_return .= 'pid="' . (isset($visibility_value['#attributes']['pid'])?$visibility_value['#attributes']['pid']:'') . '" ';
                $to_return .= 'path="' . (isset($visibility_value['#attributes']['path'])?$visibility_value['#attributes']['path']:'') . '" ';
                $to_return .= 'model="' . (isset($visibility_value['#attributes']['model'])?$visibility_value['#attributes']['model']:'') . '" ';
                $to_return .= 'type="checkbox" ';
                $to_return .= 'class="' . $visibility_key . ' form-checkbox" ';
                $to_return .= 'name="visibility[' . $visibility_path . '][' . $visibility_key . ']" ';
                $to_return .= 'id="edit-visibility-' . str_replace(array(':','/'), '', str_replace('_','-',$visibility_path . '-' . $visibility_key)) . '" ';
                $to_return .= 'value="1" ';
                $to_return .= ($visibility_value['#default_value']=="1"?' checked="checked"':'');
                $to_return .= '>';
                $to_return .= '</div>';
              }
              $to_return .= $visibility_value['#suffix'];
            }
          }
        }
      } 
      print $to_return;
    }
    else {
      print 'object not found';
    }
    break;
    case 'check_visibility' :
    $to_return = array();
    if ((isset($pid)) &&  (isset($_POST['csv_pids']))) {
      exhibition_config_prepare_visibility_for_use($pid);
      $pids_to_check = array();
      if (strtolower($_POST['csv_pids']) != 'all') {
        $pids_to_check = explode(',',$_POST['csv_pids']);
      }
      else {
        $pids_to_check = exhibition_config_get_all_pids($pid);
      }   
      if (!empty($pids_to_check)) {
        if (isset($_POST['visibility']) && (!empty($_POST['visibility']))) {
          $visibility_settings = json_decode($_POST['visibility'],true);
        }
        $visibility_page_keys = exhibition_config_get_visibility_page_keys($pid);
        for ($vpki = 0; $vpki < sizeof($visibility_page_keys); $vpki++) {
          $visibility_page_key = $visibility_page_keys[$vpki];
          $visibility_array = exhibition_config_get_visibility_page($pid, $visibility_page_key);
          $visibility_array = json_decode($visibility_array, TRUE);
          foreach ($pids_to_check as $pid_visibility) {
            if (array_key_exists($pid_visibility, $visibility_array)) {
              $parent_visibility_array = $visibility_array[$pid_visibility];
              $visibility_status = '0';
              if (array_key_exists('all', $visibility_settings)) {
                foreach($parent_visibility_array as $visibility_key => $visibility_value) {
                  if ((is_array($visibility_value)) && (array_key_exists('#default_value',$visibility_value))) {
                    if ($parent_visibility_array[$visibility_key]['#default_value'] == $visibility_settings['all']) {
                      $visibility_status = '1';
                    }
                    else {
                      if (isset($_POST['condition']) && (!empty($_POST['condition'])) && (strtolower($_POST['condition']) == 'and')) {
                        $visibility_status = '0';
                      }
                    }
                  }
                }
                if ($visibility_status == '1') array_push($to_return, array('pid' => $pid_visibility,'label' => $parent_visibility_array['show_name']['#attributes']['label']));
              }
              else {           
                foreach ($visibility_settings as $setting_name => $setting_value) {
                  if (
                    is_array($parent_visibility_array) && 
                    (array_key_exists($setting_name,$parent_visibility_array)) &&
                    (array_key_exists('#default_value', $parent_visibility_array[$setting_name]))
                  ) {
                    if ($parent_visibility_array[$setting_name]['#default_value'] == $visibility_settings[$setting_name]) {
                      $visibility_status = '1';
                    }
                    else {
                      if (isset($_POST['condition']) && (!empty($_POST['condition'])) && (strtolower($_POST['condition']) == 'and') && ($visibility_status == '1')) {
                        $visibility_status = '0';
                      }
                      else {
                        break;
                      }
                    }
                  }
                }
                if ($visibility_status == '1') {
                  array_push($to_return, array('pid' => $pid_visibility,'label' => $parent_visibility_array['show_name']['#attributes']['label'],'status' => 'true'));
                }
              }
            }
          }
        }
      }
    }
    print json_encode($to_return);          
    break;
    case 'get_children_visibility' :
    $to_return = array();
    if ((isset($pid)) &&  (isset($_POST['parent_pid_path']))) {
      $pids_to_check = explode(',',$_POST['parent_pid_path']);
      if (!empty($pids_to_check)) {
        exhibition_config_prepare_visibility_for_use($pid);
        if (isset($_POST['visibility']) && (!empty($_POST['visibility']))) {
          $posted_visibility_settings = json_decode($_POST['visibility'],true);
        }
        foreach ($pids_to_check as $pid_visibility) {
          $visibility_page_keys = exhibition_config_get_visibility_page_keys($pid);
          //foreach (exhibition_config_get_visibility_page($pid) as $visibility_page_key => $visibility_array) {
          foreach ($visibility_page_keys as $visibility_page_key) {
            $visibility_array = exhibition_config_get_visibility_page($pid, $visibility_page_key);
            $visibility_array = json_decode($visibility_array, TRUE);
            $preg_match = '/';
            $pid_path = explode('/',$pid_visibility);
            $pid_delimitor = '';
            foreach ($pid_path as $pid_value) {
              $preg_match .= $pid_delimitor . $pid_value;
              $pid_delimitor = '\/';
            }
            $preg_match .= '[\/*]/';
            $children_array = preg_grep($preg_match, array_keys($visibility_array));
            foreach ($children_array as $child_pid) {
              $visibility_status = '0';
              $pid_child_visibility = $visibility_array[$child_pid];
              if (array_key_exists('all', $posted_visibility_settings)) {
                foreach($pid_child_visibility as $visibility_key => $visibility_value) {
                  if ((is_array($visibility_value)) && (array_key_exists('#default_value',$visibility_value))) {
                    if ($pid_child_visibility[$visibility_key]['#default_value'] == $posted_visibility_settings['all']) {
                      $visibility_status = '1';
                    }
                    else {
                      if (isset($_POST['condition']) && (!empty($_POST['condition'])) && (strtolower($_POST['condition']) == 'and')) {
                        $visibility_status = '0';
                      }
                    }
                  }
                }
                if ($visibility_status == '1') array_push($to_return, array('pid' => $child_pid,'label' => $pid_child_visibility['show_name']['#attributes']['label']));
              }
              else {           
                foreach ($posted_visibility_settings as $setting_name => $setting_value) {
                  if (is_array($pid_child_visibility) && (array_key_exists($setting_name,$pid_child_visibility))) {
                    if ($pid_child_visibility[$setting_name]['#default_value'] == $posted_visibility_settings[$setting_name]) {
                      $visibility_status = '1';
                    }
                    else {
                      if (isset($_POST['condition']) && (!empty($_POST['condition'])) && (strtolower($_POST['condition']) == 'and') && ($visibility_status == '1')) {
                        $visibility_status = '0';
                      }
                      else {
                        break;
                      }
                    }
                  }
                }
                if ($visibility_status == '1') {
                  array_push($to_return, array('pid' => $child_pid,'label' => $pid_child_visibility['show_name']['#attributes']['label'],'status' => 'true'));
                }
                /*else {
                  array_push($to_return, array('pid' => $child_pid,'label' => $pid_child_visibility['show_name']['#attributes']['label'],'status' => 'false'));
                }*/
              }
            }
          }
        }
      }
    }
    print json_encode($to_return);          
    break;
    case $op == 'set_visibility_multiple':
    $to_return = array();
    $visibility_settings = json_decode($_POST['visibility'],TRUE);
    $pids_to_check = array_keys($visibility_settings);
    if ((isset($pid)) &&  (!empty($pids_to_check))) {
      if (!empty($pids_to_check)) {
        exhibition_config_prepare_visibility_for_use($pid);
        foreach ($pids_to_check as $pid_visibility) {
          $visibility_page_keys = exhibition_config_get_visibility_page_keys($pid);
          $completed_pid = FALSE;
          // We don't want to load all the visibility if we don't have to, so once the setting for the pid is complete, break the loop
          for ($vpki = 0; $vpki < sizeof($visibility_page_keys) && !$completed_pid; $vpki++) {
            $visibility_page_key = $visibility_page_keys[$vpki];
            $visibility_array = exhibition_config_get_visibility_page($pid, $visibility_page_key);
            $visibility_array = json_decode($visibility_array, TRUE);
            if (array_key_exists($pid_visibility, $visibility_array)) {
              $parent_visibility_array = $visibility_array[$pid_visibility];
              if (is_array($parent_visibility_array)) {
                foreach ($visibility_settings[$pid_visibility] as $visibility_key => $visibility_value) {
                  $parent_visibility_array[$visibility_key]['#default_value'] = ($visibility_value == '1'?'1':'');
                }
                array_push($to_return,$pid_visibility);
                $visibility_array[$pid_visibility] = $parent_visibility_array;
                exhibition_config_set_visibility_page($pid, $visibility_page_key, json_encode($visibility_array));
                $completed_pid = TRUE;
              }
            }
          }
        }
      }
    }
    print json_encode($to_return);          
    break;
    
    case 'set_children_visibility' :
    $to_return = array();
    if ((isset($pid)) &&  (isset($_POST['parent_pid_path']))) {
      exhibition_config_prepare_visibility_for_use($pid);
      $pids_to_check = explode(',',$_POST['parent_pid_path']);
      if (!empty($pids_to_check)) {
        $visibility_settings_array = json_decode($_POST['visibility'],true);
        foreach ($pids_to_check as $individual_pid_to_check) {
          $visibility_page_keys = exhibition_config_get_visibility_page_keys($pid);
          //foreach (exhibition_config_get_visibility_page($pid) as $visibility_page_key => $visibility_array) {
          foreach ($visibility_page_keys as $visibility_page_key) {
            $visibility_array = exhibition_config_get_visibility_page($pid, $visibility_page_key);
            $visibility_array = json_decode($visibility_array, TRUE);
            $preg_match = '/';
            $pid_path = explode('/',$individual_pid_to_check);
            $pid_delimitor = '';
            foreach ($pid_path as $pid_value) {
              $preg_match .= $pid_delimitor . $pid_value;
              $pid_delimitor = '\/';
            }
            $preg_match .= '[\/*]/';
            $children_array = preg_grep($preg_match, array_keys($visibility_array));
            foreach ($children_array as $child_pid) {
              $pid_visibility = $visibility_array[$child_pid];
              if (array_key_exists('all', $visibility_settings_array)) {
                foreach($pid_visibility as $visibility_key => $visibility_value) {
                  if ((is_array($visibility_value)) && (array_key_exists('#default_value',$visibility_value))) {
                    $pid_visibility[$visibility_key]['#default_value'] = ($visibility_settings_array['all'] == '1'?'1':'');
                  }
                }
              }
              else{
                foreach($visibility_settings_array as $visibility_setting_key => $visibility_setting_value) {
                  if (array_key_exists($visibility_setting_key,$pid_visibility)) {
                    $pid_visibility[$visibility_setting_key]['#default_value'] = ($visibility_setting_value == '1'?'1':'');
                  }
                } 
              }     
              $visibility_array[$child_pid] = $pid_visibility;
            }
            exhibition_config_set_visibility_page($pid, $visibility_page_key,json_encode($visibility_array));
          }
          
        }
      }
    }
    print json_encode($to_return);          
    break;
    case 'set_visibility' :
    $pids_to_check = explode(',',$_POST['csv_pids']);
    $posted_visibility_settings_array = json_decode($_POST['visibility'],true);
    $to_return = array();
    if ((isset($pid)) &&  (isset($_POST['csv_pids'])) && (!empty($posted_visibility_settings_array))) {
      $pids_to_check = explode(',',$_POST['csv_pids']);
      exhibition_config_prepare_visibility_for_use($pid);
      if (!empty($pids_to_check)) {
        foreach ($pids_to_check as $pid_visibility) {

          // Find the specific item to set throughout the entire set of data
          $visibility_page_keys = exhibition_config_get_visibility_page_keys($pid);
          //foreach (exhibition_config_get_visibility_page($pid) as $visibility_page_key => $visibility_array) {
          $completed_pid = FALSE;
          // We don't want to load all the visibility if we don't have to, so once the setting for the pid is complete, break the loop
          for ($vpki = 0; $vpki < sizeof($visibility_page_keys) && !$completed_pid; $vpki++) {
            $visibility_page_key = $visibility_page_keys[$vpki];
            $visibility_array = exhibition_config_get_visibility_page($pid, $visibility_page_key);
            $visibility_array = json_decode($visibility_array, TRUE);
            if (array_key_exists($pid_visibility, $visibility_array)) {
              $parent_visibility_array = $visibility_array[$pid_visibility];
              if (is_array($parent_visibility_array)) {
                if (array_key_exists('all', $posted_visibility_settings_array)) {
                  // If the special word "all" is sent by the user, then go through each setting and turn it off
                  foreach($parent_visibility_array as $visibility_key => $visibility_value) {
                    if ((is_array($visibility_value)) && (array_key_exists('#default_value',$visibility_value))) {
                      $parent_visibility_array[$visibility_key]['#default_value'] = ($posted_visibility_settings_array['all'] == '1'?'1':'');
                    }
                  }
                }
                else{
                  foreach($posted_visibility_settings_array as $posted_visibility_setting_key => $posted_visibility_setting_value) {
                    if (array_key_exists($posted_visibility_setting_key,$parent_visibility_array)) {
                      $parent_visibility_array[$posted_visibility_setting_key]['#default_value'] = ($posted_visibility_setting_value == '1'?'1':'');
                    }
                  } 
                }     
                array_push($to_return,$pid_visibility);
                $visibility_array[$pid_visibility] = $parent_visibility_array;
                exhibition_config_set_visibility_page($pid, $visibility_page_key, json_encode($visibility_array));
                break;
              }
              $completed_pid = TRUE;
            }
          }
        }
      }
    }
    print json_encode($to_return);
    break;
    case 'clear_session' :
    $cleared = FALSE;
    if (isset($pid)) {
      $cleared = exhibition_config_unload_visibility($pid);
    }
    if ($cleared) {
      print json_encode("Cleared");
    }
    else {
      print json_encode("Already empty");
    }
    break;    
  }
} 
function exhibition_permission_form_submit($form, &$form_state) {
  $root_pid = $form['pid']['#value'];
  $form_state['redirect'] = false;
  // take all visibility pages from the session for the root pid
  // for each pidpath in each page, check 
  $post_array = array();
  $resource_visibility_only = array('show_preview','allow_download','show_degraded');
  $concept_visibility_only = array('future_children_show_name','future_children_show_meta','future_children_show_preview','future_children_allow_download','future_children_show_degraded');
  //$packed = $form['packed']['#value'];
  //$packed_index = 0;
  $visibility_page_keys = exhibition_config_get_visibility_page_keys($root_pid);
  var_dump($visibility_page_keys);
  for ($vpki = 0; $vpki < sizeof($visibility_page_keys); $vpki++) {
    $visibility_page_key = $visibility_page_keys[$vpki];
    $visibility_array = exhibition_config_get_visibility_page($root_pid, $visibility_page_key);
    $visibility_array = json_decode($visibility_array, TRUE);
    if (!empty($visibility_array)) {
      foreach($visibility_array as $object_key => $object_visibility) {
        if ((is_array($object_visibility)) && (array_key_exists('show_name',$object_visibility))) {
          $pid = $object_visibility['show_name']['#attributes']['pid'];
          $depth = $object_visibility['show_name']['#attributes']['path'];
          $pid_result = array(
             'pid' => $pid,
             'label' => $object_visibility['show_name']['#attributes']['label'],
             'model' => $object_visibility['show_name']['#attributes']['model'],
             'type' => $object_visibility['show_name']['#attributes']['type'],
          );
          foreach($object_visibility as $visibility_key => $visibility_value) {
            if ((is_array($visibility_value)) && ((array_key_exists('#type',$visibility_value)) && ($visibility_value['#type'] == 'checkbox'))) {
              $pid_result[$visibility_key] = $visibility_value['#default_value'];
            }
          }
          $post_array[$depth] = $pid_result; 
        }   
      }
    }
  }
  $visibility_settings_array = array();
  foreach($post_array as $key => $value) {
    $visibility_array = array();
    $visibility_array['pid'] = $value['pid'];
    $path = preg_replace('/[\/]/', '_', $key);  
    $path_array = explode('_',$path);
    array_pop($path_array);
    $path = implode('_',$path_array);
    $visibility_array['path'] = $path;
    $visibility_array['visibility'] = $value;
    exhibition_config_save_visibility_optimized($visibility_array); 
  }
  exhibition_config_clear_exhibition_cache();
  exhibition_config_unload_visibility($root_pid);
  $path = current_path();
  drupal_goto($path);
}
/**
 * Removes the temporary storage associated with running visibility
 * Returns TRUE if it actually cleared something from session, FALSE otherwise
 */
function exhibition_config_unload_visibility($pid) {
  $to_return = FALSE;
  if (isset($_SESSION['exhibition_visibility'][$pid])) {
    unset($_SESSION['exhibition_visibility'][$pid]);
    $to_return = TRUE;
  }
  exhibition_config_file_cleanup();
  return $to_return;
}
/**
 * Remove files that are from our user but not part of the session
 */
function exhibition_config_file_cleanup() {
  $allowed_files = array();
  if (isset($_SESSION['exhibition_visibility'])) {
    foreach($_SESSION['exhibition_visibility'] as $root_pid => $info) {
      if (isset($info['storage'])) {
        foreach($info['storage'] as $pages_index => $filename) {
          $allowed_files[] = $filename;
        }
      }
    } 
  }
  // Anything that belongs to our user will be vis_page_<uid>_<uniqueid>
  // So if it follows that pattern but is not part of our session, delete it
  $target_dir = file_directory_temp();
  global $user;
  $filter = '/vis_page_' . $user->uid . '_.*/';
  $files = file_scan_directory($target_dir, $filter);
  foreach($files as $check_file) {
    if (!in_array($check_file->uri, $allowed_files)) {
      file_unmanaged_delete($check_file->uri);
    }
  }
}
/*
 * Stores all information in a format that works similar to a cache, using the file system
 * This is run when something needs to iterate over all of the data, and can be run at any time
 * only doing load when the information had not fully loaded.
 */
function exhibition_config_prepare_visibility_for_use($pid) {
  exhibition_config_file_cleanup();
  if (isset($_SESSION['exhibition_visibility'][$pid]['paging']) && ($_SESSION['exhibition_visibility'][$pid]['paging'] == 'all')) {
    return;
  }
  else {
    if (isset($_SESSION['exhibition_visibility'][$pid]['started'])){
      // If we are getting big hits to try and do refreshes there's something wrong. Wait it out then continue.
      $minimum_seconds_between_refreshes = 120;
      $time_waited_so_far = 0;
      // and if the session data gets wacky, clear it
      while (
        // if something goes fishy with the session, only wait the max time between refreshes (no perma loop)
        $time_waited_so_far < $minimum_seconds_between_refreshes &&
        // wait until the waiting period is over to refresh
        ($_SESSION['exhibition_visibility'][$pid]['started']+$minimum_seconds_between_refreshes > time()) &&
        // If it "started" in the future then things are weird, don't wait
        ($_SESSION['exhibition_visibility'][$pid]['started'] < time())
      ){
        $sleep_increment = 10;
        sleep($sleep_increment);
        $time_waited_so_far += $sleep_increment;
        // if it finished up while we were waiting, then we're good
        if (isset($_SESSION['exhibition_visibility'][$pid]['paging']) && ($_SESSION['exhibition_visibility'][$pid]['paging'] == 'all')) {
          return;
        }
      }
    }
    $_SESSION['exhibition_visibility'][$pid]['started'] = time();
    $checkbox_rows = exhibition_config_get_tree_checkboxes($pid);
    $saved_visibility = exhibition_config_load_visibility_for_configuration($pid);
    $total_session_pages = array();
    $objects_per_session_page = '200'; //TODO change
    $objects_per_page = '40';  //TODO change
    $total_session_pages = exhibition_config_get_total_session_pages(count($checkbox_rows),$objects_per_session_page);
    foreach ($total_session_pages as $page_key) {
      $existing_keys = exhibition_config_get_visibility_page_keys($pid);
      if (!in_array($page_key, $existing_keys)) {
        $page_number_array = explode('-',$page_key);
        $starting_page = $page_number_array[0];
        $page_offset = exhibition_config_get_offset($starting_page,1,$objects_per_page);
        $visibility_array = array_slice($checkbox_rows,$page_offset,$objects_per_session_page);
        $tree_html = '';
        $visibility_array = exhibition_config_update_visibility($visibility_array,$saved_visibility,$tree_html);
        exhibition_config_set_visibility_page($pid,$page_key, json_encode($visibility_array));
      }
    }
    $_SESSION['exhibition_visibility'][$pid]['paging'] = 'all';
  }
  return;
}
/*
 * Gets all the pids that we have stored
 */
function exhibition_config_get_all_pids($root_pid) {
  $pids_to_check = array();
  $visibility_page_keys = exhibition_config_get_visibility_page_keys($root_pid);
  for ($vpki = 0; $vpki < sizeof($visibility_page_keys); $vpki++) {
    $visibility_page_key = $visibility_page_keys[$vpki];
    $visibility_array = exhibition_config_get_visibility_page($root_pid, $visibility_page_key);
    $visibility_array = json_decode($visibility_array, TRUE);
    $pids_in_visibility = array_keys($visibility_array);
    $pids_to_check = array_merge($pids_to_check,$pids_in_visibility);
  }
  return $pids_to_check;
}   
