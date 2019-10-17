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

function sidora_dc_xml_join($previous_version_string, $current_version_string) {
  $doc1 = new DOMDocument();
  $doc1->loadXML($previous_version_string);
  $doc2 = new DOMDocument();
  $doc2->loadXML($current_version_string);

  $all_elements_old = $doc1->getElementsByTagName('*');
  $all_elements_new = $doc2->getElementsByTagName('*');
  $old_xpath = new DOMXPath($doc1);
  $new_xpath = new DOMXPath($doc2);
  for ($i = 0; $i < $all_elements_new->length; $i++) {
    $node_for_value_extraction = $all_elements_new->item($i);
    // Only replacing end values, pull all text from the node,
    $val_extract_node_path = $node_for_value_extraction->getNodePath();
    $txt = '';
    $is_text_node = TRUE;
    foreach($node_for_value_extraction->childNodes as $node) {
      if ($node->nodeType !== XML_TEXT_NODE) {
        $is_text_node = FALSE;
      }
      else {
        $txt .= $node->nodeValue;
      }
    }
    if ($is_text_node) {
      $old_nodes_of_xpath = $old_xpath->query($val_extract_node_path);
      $new_nodes_of_xpath = $new_xpath->query($val_extract_node_path);
      // replace the old node with the new information

      // If there is only one node from the old and one node from the new, just replace the value
      // Here we assume that additional node attributes like xml:lang="en" and xsi:type="dcterms:URI" are not changed.

      if ($old_nodes_of_xpath->length == 1 && $new_nodes_of_xpath->length == 1) {
        $parentNode = $old_nodes_of_xpath->item(0);
        while ($parentNode->hasChildNodes()) {
          $parentNode->removeChild($parentNode->firstChild);
        }
        $t_value = $doc1->createTextNode($txt);
        $parentNode->appendChild($t_value);
      }
      else {
        // The reason for removing then adding is if we have multiple children on either the previous or new state
        // Simply altering the value of existing nodes would not work.
        // If there are 2 nodes in the new dom, it does this twice (remove & add both, remove & add both), we accept that as okay

        // remove ALL the old nodes with that path
        foreach($old_nodes_of_xpath as $node_to_remove) {
          $node_to_remove->parentNode->removeChild($node_to_remove);
        }

        $node_to_append = $doc1->importNode($node_for_value_extraction);
        $node_to_append->removeAttributeNS();
        $t_value = $doc1->createTextNode($txt);
        $node_to_append->appendChild($t_value);
        // For Dublin Core we know that all children are directly on the main node, so we don't need to create a path
        $all_elements_old->item(0)->appendChild($node_to_append);
      }
    }
  }
  $xml_string = $doc1->saveXML();
  watchdog("dc_manipulation.inc", "xml_string: !xml", array("!xml" => $xml_string), WATCHDOG_NOTICE);
  return $xml_string;
}

function sidora_dc_join_and_return_xml($pid) {
  $xml_string = NULL;
  $object = sidora_obj($pid);
  if (empty($object)) {
    return NULL;
  }
  $dc_datastream = $object['DC'];
  if (empty($dc_datastream)) {
    return NULL;
  }
  if ($dc_datastream->versionable && count($dc_datastream) > 1){
    // The current one is $dc_datastream[0]
    $insert_data_into = $dc_datastream[1]->content;
    $form_and_dsid = sidora_get_form_and_dsid($pid);
    if (empty($form_and_dsid)) {
      return NULL;
    }
    watchdog("dc_manipulation.inc", "form name: !formname | dsid: !dsid", array('!formname' => $form_and_dsid['form_name'], '!dsid' => $form_and_dsid['dsid']), WATCHDOG_NOTICE);
    $associations = xml_form_builder_get_associations(array($form_and_dsid['form_name']), $object->models, array($form_and_dsid['dsid']));
    watchdog(
      'dc_manipulation.inc',
      'Here is the printed variable: <pre>@placeholder_name</pre>',
      array('@placeholder_name' => print_r( $associations, TRUE)),
      WATCHDOG_INFO
    );
    if (sizeof($associations) < 1) {
      return NULL;
    }
    if (empty($associations[0])) {
      // xml_form_builder_get_associations could return a single non-array transform
      $association = $associations;
    }
    else {
      $association = $associations[0]['transform'];
    }
    $transform = xml_form_builder_get_transform_file($association);
    // If there's not a DC transform set, this is almost certainly a misconfigured form, but maybe not.
    // Let's not clutter watchdog yet...
    if ($transform != FALSE) {
      $post_transform_dd = null;
      watchdog("dc_manipulation.inc", "Association in dc_manipulation.inc: $association", NULL, WATCHDOG_NOTICE);
      watchdog("dc_manipulation.inc", "Association is of type: " . gettype($association), NULL, WATCHDOG_NOTICE);
      if (!empty($object[$associations[0]['dsid']])){
        $pre_transform_string = $object[$associations[0]['dsid']]->content;
        $pre_transform_dd = new DOMDocument();
        $pre_transform_dd->loadXML($pre_transform_string);
        $post_transform_dd = xml_form_builder_transform_document($transform, $pre_transform_dd);
        if ($post_transform_dd == null) {
          watchdog(
            'sidora',
            "DC transform failed! PID: !pid associations !associations transform !transform",
             array('!pid' => $pid, '!associations' => json_encode($associations), '!transform' => json_encode($transform))
          );
        }
        else {
          $post_transform_string = $post_transform_dd->saveXML();
          // Place information from the transformed metadata into the old entry
          $xml_string = sidora_dc_xml_join($insert_data_into, $post_transform_string);
        }
      }
      else {
        watchdog(
          'sidora',
          "Problem finding datastream of object: !pid with association !association",
           array('!pid' => $pid, '!association' => json_encode($association))
        );
      }
    }
  }
  else {
    // Not enough versions or it's not versionable
    return NULL;
  }
  return $xml_string;
}
