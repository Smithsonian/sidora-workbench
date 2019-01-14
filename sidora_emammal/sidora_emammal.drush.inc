<?php
function sidora_emammal_drush_command() {
 $items = array();
 $items['sidora-clear-nodes'] = array(
   'callback' => 'drush_sidora_clear_nodes',
   'description' => 'Deletes nodes from the database based on type and/or modification dates. Only deletes the concept nodes or the organic group nodes.',
   'options' => array(
     'dry-run' => 'Perform a check and tell the user what would happen, but make no changes in Drupal',
     'start-date' => 'Start the search at first second of this day. default: 1980-1-1',
     'end-date' => 'Stop the search at the first second of this day. default: 2050-1-1',
     'type' => 'Node type to look for, valid options: sidora_concept, og_crud_node, both. default: sidora_concept',
     'force' => 'Do not ask for a confirmation after presenting the user with the number of nodes that are about to be removed'
   ),
   'examples' => array(
     'drush sidora-clear-nodes --start-date="2017-11-6" --end-date="2017-12-15" --type="sidora_concept" --dry-run --force' => 'See what would happen if you wanted to delete sidora_concept nodes between the two dates in a script, but do not actually do it (dry-run).',
     'drush sidora-clear-nodes' => 'Delete all the sidora_concept nodes, and require a confirmation (y) before doing it."',
     'drush sidora-clear-nodes --start-date="2017-12-15" --force' => 'Delete all the sidora_concept nodes after 12/15/2017 immediately.',
   ),
 );
 $items['sidora-administer-child'] = array(
   'callback' => 'drush_sidora_administer_child',
   'description' => 'Adds a single isAdministeredBy relationship, use: drush sidora-administer-child parent_pid child_pid',
   'options' => array(
     'dry-run' => 'Perform a check and tell the user what would happen, but make no changes in Fedora',
     'replace' => 'Remove all existing isAdministeredBy relationships and add the one input by the user',
     'force' => 'Put the isAdministeredBy relationship on the child even if the parent does not exist and even if it already has an isAdministeredBy relationship, possibly giving it multiple isAdministeredBy relationships',
   ),
 );
 $items['sidora-get-crumbtrail'] = array(
   'callback' => 'drush_sidora_get_crumbtrail',
   'description' => 'Prints out the different crumbtrails through parents of the specified pid',
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
 $items['sidora-emammal'] = array(
   'callback' => 'drush_sidora_emammal',
   'description' => 'Check or update eMammal projects with camera make and model data',
   'options' => array(
     'check' => 'Lists all projects and their camera make and model',
     'update' => 'Uses --file="filename" or uses --pid="si:projectpid" --make="Camera Make" --model="Camera Model" to update the datastreams',
   ),
 );
 $items['sidora-test'] = array(
   'callback' => 'sidora_drush_test',
   'description' => 'Test that sidora drush commands are available',
 );
 return $items;
}
function sidora_emammal_drush_test() {
  print 'starting...';
  $obj = sidora_obj("si:user-projects");
  var_dump($obj);
  print 'ending.';
  drush_print('ok');
}
function drush_sidora_emammal(){
  $options = array();
  $options['file'] = drush_get_option("file",'');
  $options['pid'] = drush_get_option("pid",'');
  $options['make'] = drush_get_option("make",'');
  $options['model'] = drush_get_option("model",'');
  var_dump($options);
}
