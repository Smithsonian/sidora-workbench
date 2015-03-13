<?php

/**
 * @file
 *
 * Utility functions that provided simplicity or convenience.
 */
function si_exhibition_get_repo(){
  return islandora_get_tuque_connection()->repository;
}
/**
 * Given an object info array as defined by the *_info() functions, determine if the user can access it.
 *
 * @param array $object_info
 *   An array containing a 'pid' field.
 *
 * @return boolean
 *  TRUE if accessible FALSE otherwise.
 */
function si_exhibition_check_object_info_accessible(array $object_info) {
  $repo = si_exhibition_get_repo();
  try {
    $object = $repo->getObject($object_info['pid']);
    // @todo remove object from cache.
  } catch(Exception $e) {
    return FALSE;
  }
  return TRUE;
}

/**
 * Fetchs some information about the given object's parents.
 *
 * @param FedoraObject $object
 *   The object who's parents info will be returned.
 *
 * @return array
 *   An array of array's containing the following key value pairs for each parent of the given object:
 *    pid, label
 */
function si_exhibition_get_parent_info(FedoraObject $object) {
  $repo = si_exhibition_get_repo();
  $query = si_exhibition_generate_parent_concept_query($object->id);
  $results = $repo->ri->itqlQuery($query);
  $parents = array_map(function($o) { return array('pid' => $o['o']['value'], 'label' => $o['t']['value'], 'count' => $o['k0']['value']); }, $results);
  // @todo replace the checks for each objects existance once we have the appropriate information in the rels to determine if its accessible.
  return array_filter($parents, 'si_exhibition_check_object_info_accessible');
}

/**
 * Query for fetching the Parent Concepts pids and labels.
 *
 * @param string $pid
 *   The object to query for.
 *
 * @return string
 *   An itql query string.
 */
function si_exhibition_generate_parent_concept_query($pid) {
  return 'select $o $t from <#ri> where
    $o <fedora-model:state> <fedora-model:Active> and
    $o <fedora-model:label> $t and
    $o <fedora-rels-ext:hasConcept> <info:fedora/' . $pid . '>
    order by $t';
}


/**
 * Fetchs some information about the given object's child concepts.
 *
 * @param FedoraObject $object
 *   The parent object who's child concept info will be returned.
 *
 * @return array
 *   An array of array's containing the following key value pairs for each child concpet of the given object:
 *    pid, label
 */
function si_exhibition_get_child_concept_info(FedoraObject $object) {
  $repo = si_exhibition_get_repo();
  $query = si_exhibition_generate_child_concept_query($object->id);
  $results = $repo->ri->itqlQuery($query);
  $children = array_map(function($o) { return array('pid' => $o['o']['value'], 'label' => $o['t']['value'], 'count' => $o['k0']['value']); }, $results);
  // @todo replace the checks for each objects existance once we have the appropriate information in the rels to determine if its accessible.
  return array_filter($children, 'si_exhibition_check_object_info_accessible');
}

/**
 * Query for fetching the Child Concepts labels and the number of Child Concepts they have.
 *
 * @param string $pid
 *   The object to query for.
 *
 * @return string
 *   An itql query string.
 */
function si_exhibition_generate_child_concept_query($pid) {
  $count = 'count(select $c from <#ri> where
    $o <fedora-rels-ext:hasConcept> $c and
    $c <fedora-model:state> <fedora-model:Active>)';
  return 'select $o $t ' . $count . ' from <#ri> where
     $o <fedora-model:state> <fedora-model:Active> and
     $o <fedora-model:label> $t and
     <info:fedora/' . $pid . '> <fedora-rels-ext:hasConcept> $o
     order by $t';
}

/**
 * Fetchs some information about the given object's child resources.
 *
 * @param string $pid
 *   The object to query for.
 * @param string $type
 *   The type of resource to look for, can be any one of ('images', 'pdf', 'text', 'csv', 'video').
 * @param string $sort
 *   The sort to apply to the resources label either ('asc', 'desc').
 * @param int $limit
 *   The number of results to limit this query to.
 * @param int $offset
 *   The offset into the number of results to truncate from the results.
 *
 * @return array
 *   An array of array's containing the following key value pairs for each child concpet of the given object:
 *    pid, label, datastreams
 */
function si_exhibition_get_child_resource_info(FedoraObject $object, $type = 'all', $sort = 'asc', $limit = NULL, $offset = NULL) {
  $resource_types = array(
    'all' => array(),
    'images' => array('si:imageCModel', 'si:generalImageCModel'),
    'pdf' => array('si:fieldbookCModel'),
    'csv' => array('si:datasetCModel'),
    'text' => FALSE,
    'video' => FALSE
  );
  $resource_types = isset($resource_types[$type]) ? $resource_types[$type] : FALSE;
  if ($resource_types !== FALSE) {
    $repo = si_exhibition_get_repo();
    $query = si_exhibition_generate_child_resource_query($object->id, $resource_types, $sort, $limit, $offset);
    $results = $repo->ri->itqlQuery($query);
    $resources = array_map(function($o) { return array('pid' => $o['o']['value'], 'label' => $o['t']['value']); }, $results);
    // @todo replace the checks for each objects existance once we have the appropriate information in the rels to determine if its accessible.
    $resources =  array_filter($resources, 'si_exhibition_check_object_info_accessible');
    foreach ($resources as $key => &$resource) { // Add additional info
      $object = $repo->getObject($resource['pid']); // We know it exists from the previous filter call.
      $resource['models'] = $object->models;
      try {
        foreach ($object as $dsid => $datatream) {
          $resource['datastreams'][] = $dsid;
        }
      } catch(Exception $e) { unset($resources[$key]); } // Ignore when we can't access a resources datastream.
    }
    return $resources;
  }
  return array();
}

/**
 * Query for fetching the Child Resources given what type of data they disseminate.
 *
 * @param string $pid
 *   The object to query for.
 * @param string $resource_types
 *   The types of resource to look for, defined as a list of content models, if empty all resources will be returned.
 * @param string $sort
 *   The sort to apply to the resources label either ('asc', 'desc').
 * @param int $limit
 *   The number of results to limit this query to.
 * @param int $offset
 *   The offset into the number of results to truncate from the results.
 *
 * @return string
 *   An itql query string
 */
function si_exhibition_generate_child_resource_query($pid, array $resource_types, $sort = 'asc', $limit = NULL, $offset = NULL) {
  $limit_types = '';
  if (!empty($resource_types)) {
    $limit_type_expression = function($o) {
      return "\$m <mulgara:is> <info:fedora/$o>";
    };
    $limit_types = array_map($limit_type_expression, $resource_types);
    $limit_types = implode(' or ', $limit_types);
    $limit_types = "({$limit_types}) and";
  }
  $limit = isset($limit) ? "limit $limit" : '';
  $offset = isset($offset) ? "offset $offset" : '';
  return 'select $o $t $m from <#ri> where
    $o <fedora-model:state> <fedora-model:Active> and
    $o <fedora-model:label> $t and
    <info:fedora/' . $pid . '> <fedora-rels-ext:hasResource> $o and
    ' . $limit_types . '
    $o <fedora-model:hasModel> $m
    minus $m <mulgara:is> <info:fedora/si:resourceCModel>
    minus $m <mulgara:is> <info:fedora/fedora-system:FedoraObject-3.0>
    order by $t ' . $sort . '
    ' . $limit . '
    ' . $offset;
}

/**
 * Transforms the given CSV file to an array.
 *
 * @param string $file_path
 *   The path to the file to transform.
 *
 * @return array
 *   An array of array's where each row in the csv file corresponds to a single array of values in the returned array.
 */
function si_exhibition_transform_csv_file_to_array($file_path) {
  /**
   * parseCSV could be an option in the future: http://code.google.com/p/parsecsv-for-php/
   */
  $rows = array();
  if (($file = fopen($file_path, "r")) !== FALSE) {
    while (($row = fgetcsv($file, 100000, ",")) !== FALSE) {
      $rows[] = $row;
    }
    fclose($file);
  }
  return $rows;
}

/**
 * Fetches the get paramters to configure the pager.
 *
 * @return array
 *   array($show, $sort, $limit, $offset)
 */
function si_exhibition_get_pager_parameters() {
  $show = isset($_GET['show']) ? $_GET['show'] : 'all';
  $sort = isset($_GET['sort']) ? $_GET['sort'] : 'asc';
  $limit = isset($_GET['limit']) ? $_GET['limit'] : 10;
  $page =  isset($_GET['page']) ? $_GET['page'] : 0;
  return array($show, $sort, $limit, $page);
}

/**
 * Fetchs the given objects datastream contents.
 * Fails silently if something goes wrong.
 *
 * @param string $pid
 *   The PID of the object.
 * @param string $dsid
 *   The DSID of the datastream to fetch from.
 *
 * @return string
 *   The datastream's contents if successful, an empty string otherwise.
 */
function si_exhibition_get_datastream_contents(FedoraObject $object, $dsid) {
  if (isset($object[$dsid])) {
    $repo = si_exhibition_get_repo();
    return $repo->api->a->getDatastreamDissemination($object->id, $dsid, NULL); // Work around for bug in Tuque API: ISLANDORA-752
  }
  return '';
}

/**
 * Fetchs the given objects CSV datastream contents.
 *
 * @param string $pid
 *   The PID of the object.
 *
 * @return string
 *   The datastream's contents if successful, an empty string otherwise.
 */
function si_exhibition_get_csv_datastream_content(FedoraObject $object) {
  // @todo combined the various csv datastreams into one.
  return si_exhibition_get_datastream_contents($object, 'CSV');
}

/**
 * Fetchs the given objects TEXT datastream contents.
 *
 * @param string $pid
 *   The PID of the object.
 *
 * @return string
 *   The datastream's contents if successful, an empty string otherwise.
 */
function si_exhibition_get_text_datastream_content(FedoraObject $object) {
  return si_exhibition_get_datastream_contents($object, 'TEXT');
}
