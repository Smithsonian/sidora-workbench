<?php
function sidora_drush_command() {
 $items = array();
 $items['sidora-administer-child'] = array(
   'callback' => 'drush_sidora_administer_child',
   'description' => 'Adds a single isAdministeredBy relationship, use: drush sidora-administer-child parent_pid child_pid',
   'options' => array(
     'dry-run' => 'Perform a check and tell the user what would happen, but make no changes in Fedora',
     'replace' => 'Remove all existing isAdministeredBy relationships and add the one input by the user',
     'force' => 'Put the isAdministeredBy relationship on the child even if the parent does not exist and even if it already has an isAdministeredBy relationship, possibly giving it multiple isAdministeredBy relationships',
   ),
 );
 $items['sidora-administer-tree'] = array(
   'callback' => 'drush_sidora_administer_tree',
   'description' => 'Adds a single isAdministeredBy relationship, use: drush sidora-administer-child parent_pid child_pid',
   'options' => array(
     'dry-run' => 'Perform a check and tell the user what would happen, but make no changes in Fedora',
     'recursive' => 'Continue down the tree in a recursive fashion',
     'force' => 'Put the isAdministeredBy relationship on the child even if the parent does not exist and even if it already has an isAdministeredBy relationship, possibly giving it multiple isAdministeredBy relationships',
     'concepts-exclude' => 'Do not attempt to relationships to concepts, will still recurse if set',
     'resources-exclude' => 'Do not attempt to add relationships to resources',
     'codebooks-exclude' => 'Do not attempt to add relationships to codebooks. Codebooks are assumed to already have the proper managesCodebook relationships',
   ),
 );
 $items['sidora-test'] = array(
   'callback' => 'sidora_drush_test',
   'description' => 'Test that sidora drush commands are available',
 );
 return $items;
}
function sidora_drush_test() {
  print 'starting...';
  $obj = sidora_obj("si:user-projects");
  var_dump($obj);
  print 'ending.';
  drush_print('ok');
}
function drush_sidora_administer_tree($root_pid) {
  drush_print("Root: $root_pid");
  $root_obj = sidora_obj($root_pid);
  if (empty($root_obj)) {
    drush_print("ERROR: $root_pid is not in Fedora.");
  }
  else {
    $no_errors = array();
    $with_errors = array();
    $all_processed = array();
    $other_errors = array();
    sidora_drush_recursive_administer_tree($root_pid, $no_errors, $with_errors, $all_processed, $other_errors);
    drush_print("Objects that have been processed correctly or recursed over other than root (" . sizeof($all_processed) . ") :");
    foreach($all_processed as $processed_pid) {
      drush_print($processed_pid);
    }
    drush_print("==========================");
    $dry_run = drush_get_option("dry-run");
    if ($dry_run) {
      drush_print("DRY-RUN, isAdministeredBy relationships that would have been attempted (" . sizeof($no_errors) . "):");
    }
    else {
      drush_print("Objects where isAdministeredBy was added (" . sizeof($no_errors) . "):");
    }
    foreach($no_errors as $processed_pid) {
      drush_print($processed_pid);
    }
    if (sizeof($with_errors) > 0 || sizeof($other_errors) > 0) {
      drush_print("==========================");
      drush_print("ERRORS:");
      foreach($with_errors as $processed_pid => $error_info) {
        drush_print($processed_pid . "\t" . $error_info);
      }
      foreach($other_errors as $error_info) {
        drush_print($error_info);
      }
    }
  }
}
function sidora_drush_recursive_administer_tree($parent_pid, &$processed_without_error, &$processed_with_error, &$all_processed, &$other_errors){
  $concepts_exclude = drush_get_option("concepts-exclude");
  $resources_exclude = drush_get_option("resources-exclude");
  $codebooks_exclude = drush_get_option("codebooks-exclude");
  $dry_run = drush_get_option("dry-run");
  $recursive = drush_get_option("recursive");
  $force = drush_get_option("force");
  $cr = _sidora_get_child_results_cache($parent_pid);
  // These are the concepts
  foreach ($cr as $child) {
    $child_pid = $child['o']['value'];
    $child_obj = sidora_obj($child_pid);
    if (empty($child_obj)) {
      $error = "ERROR: $child_pid should be a child of $root_pid, but is not in Fedora.";
      drush_print($error, 0, STDERR);
      $other_errors[] = $error;
    }
    elseif (in_array($child_pid, $all_processed)){
      $error = "ERROR: $child_pid already processed, a loop exists.";
      drush_print($error, 0, STDERR);
      $other_errors[] = $error;
    }
    else {
      $has_concept_parents = sidora_get_parent_concepts($child_obj);
      $error = FALSE;
      if (sizeof($has_concept_parents) > 1) {
        $error = "ERROR: $child_pid is the target of  " . sizeof($has_concept_parents) . " hasConcept relationships";
        drush_print($error, 0, STDERR);
      }
      elseif (!$concepts_exclude) {
        $error = sidora_drush_administer_child($parent_pid, $child_pid, $dry_run, FALSE, $force, FALSE);
      }

      if ($error) {
        $processed_with_error[$child_pid] = $error;
      }
      else {
        if (!$concepts_exclude) {
          $processed_without_error[] = $child_pid;
        }
      }
      $all_processed[] = $child_pid;
      if ($recursive) {
        sidora_drush_recursive_administer_tree($child_pid, $processed_without_error, $processed_with_error, $all_processed, $other_errors);
      }
    }
  }
  if (!$resources_exclude) {
    $parent_obj = sidora_obj($parent_pid); 
    $resources = $parent_obj->relationships->get(FEDORA_RELS_EXT_URI, 'hasResource');
    foreach ($resources as $resource) {
      $resource_pid = ($resource['object']['value']);
      $error = sidora_drush_administer_child($parent_pid, $resource_pid, $dry_run, FALSE, $force, FALSE);
      if ($error) {
        $processed_with_error[$resource_pid] = $error;
      }
      else {
        $processed_without_error[] = $resource_pid;
      }
      $all_processed[] = $resource_pid;
    }
  }
  if (!$codebooks_exclude) {
    $parent_obj = sidora_obj($parent_pid); 
    $codebooks = $parent_obj->relationships->get(FEDORA_RELS_EXT_URI, 'managesCodebook');
    foreach ($codebooks as $codebook_info) {
      $codebook_pid = ($codebook_info['object']['value']);
      $error = sidora_drush_administer_child($parent_pid, $codebook_pid, $dry_run, FALSE, $force, FALSE);
      if ($error) {
        $processed_with_error[$codebook_pid] = $error;
      }
      else {
        $processed_without_error[] = $codebook_pid;
      }
      $all_processed[] = $resource_pid;
    }
  }

}
function drush_sidora_administer_child($parent_pid, $child_pid) {
  $dry_run = drush_get_option("dry-run");
  $replace = drush_get_option("replace");
  $force = drush_get_option("force");
  drush_print("Parent: $parent_pid");
  drush_print(" Child: $child_pid");
  sidora_drush_administer_child($parent_pid, $child_pid, $dry_run, $replace, $force);
}
function sidora_drush_administer_child($parent_pid, $child_pid, $dry_run, $replace, $force, $print_summary = TRUE) {
  $error = '';
  $parent_obj = sidora_obj($parent_pid);
  $child_obj = sidora_obj($child_pid);
  if (empty($child_obj)) {
    $error = "Child $child_pid does not exist in Fedora."; 
    drush_print($error, 0, STDERR);
  }
  elseif (empty($parent_obj) && !$force) {
    $error = "Parent does not exist. Use --force to create a relationship to a non-existent object.";
    drush_print($error, 0, STDERR);
  }
  elseif ($parent_obj->id == $child_obj->id && !$force) {
    $error = "Parent and child are the same. Use --force to create this relationship.";
    drush_print($error, 0, STDERR);
  }
  else {
    $child_rels = $child_obj->relationships->get(SI_RELS_EXT_URI, 'isAdministeredBy');
    if (sizeof($child_rels) > 0 && !$replace && !$force) {
      $error = "Child already has (" . sizeof($child_rels) . ") isAdministeredBy, first relationship with " . $child_rels[0]['object']['value'];
      drush_print($error, 0, STDERR, FALSE);
      drush_print(". Use --force to create this relationship, or --replace to remove the existing relationships.\n", 0, STDERR);
      if ($print_summary) {
        drush_print("EXISTING RELATIONSHIPS:", 0, NULL, FALSE);
      }
    }
    else {
      if ($replace) {
        foreach($child_rels as $child_rel) {
          if ($dry_run) {
            drush_print("DRY-RUN: WOULD REMOVE $child_pid isAdministeredBy " . $child_rel['object']['value']);
          }
          else {
            drush_print("Removing $child_pid isAdministeredBy " . $child_rel['object']['value']);
            $child_obj->relationships->remove(SI_RELS_EXT_URI, 'isAdministeredBy', $child_rel['object']['value']);
          }
        }
      }
      if ($dry_run) {
        drush_print("DRY-RUN:    WOULD ADD $child_pid isAdministeredBy $parent_pid");
      }
      else {
        drush_print("  Adding $child_pid isAdministeredBy " . $parent_pid);
        $child_obj->relationships->add(SI_RELS_EXT_URI, 'isAdministeredBy', $parent_pid);
      }
      $to_output = "";
      $child_rels = $child_obj->relationships->get(SI_RELS_EXT_URI, 'isAdministeredBy');
      if ($print_summary) {
        drush_print("Completed, ", 0, NULL, FALSE);
      }
    }
    if ($print_summary) {
      drush_print("(".sizeof($child_rels).") child isAdministeredBy relationships: ", 0, NULL, FALSE);
      foreach($child_rels as $child_rel) {
        if (!empty($to_output)) {
          $to_output .= ', ';
        }
        $to_output .= $child_rel['object']['value'];
      }
      drush_print($to_output);
    }
  }
  return $error;
}
