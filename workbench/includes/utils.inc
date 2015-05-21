<?php

/**
 * @file
 * Helper functions.
 *
 * ©2012 Smithsonian Institution.  Permission is granted to use, copy, modify,
 * and distribute this software and its documentation for educational, research
 * and non-profit purposes, without fee and without a signed licensing
 * agreement, provided that this notice, including the following two paragraphs,
 * appear in all copies, modifications and distributions.  For commercial
 * licensing, contact the Office of the Chief Information Officer, Smithsonian
 * Institution, 380 Herndon Parkway, MRC 1010, Herndon, VA. 20170, 202-633-5256.
 *
 * This software and accompanying documentation is supplied “as is” without
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
 */

/**
 * Check for a relationship between objects.
 *
 * Before we add a relationhip between objects we want to make sure that,
 * relationship doesn't exist only checks for a relationship between collection
 * and child using isMemberOf or isMemberOfCollection. This query could be more
 * flexible, in future we could also parse the rels-ext to check for more?
 */
function sidora_check_for_relationship($current_pid, $collection_pid) {
  $query = 'select $object $title
    from <#ri>
    where $object <mulgara:is> <info:fedora/' . $current_pid . '>
    and $object <info:fedora/fedora-system:def/model#label> $title
    and ($object <fedora-rels-ext:hasConcept> <info:fedora/' . $collection_pid . '>
    or $object <fedora-rels-ext:hasResource> <info:fedora/' . $collection_pid . '>)';
  $results = sidora_query($query);
  if (empty($results)) {
    return FALSE;
  }
  else {
    return TRUE;
  }
}

/**
 * function to add a relationship child of parent
 *
 * @param string $uri
 * @param string $predicate
 * @param string $recipient
 * @param string $related
 * @param string $remove
 * @param boolean $should_exit - whether or not to call exit() on an error
 *
 */
function sidora_update_relationship($uri, $predicate, $recipient, $related, $remove = FALSE) {
  return sidora_update_relationship_choose_exit($uri, $predicate, $recipient, $related, $remove, TRUE);
}
function sidora_update_relationship_choose_exit($uri, $predicate, $recipient, $related, $remove = FALSE, $should_exit = FALSE) {
  $toReturn = array();
  // get the repository from the tuque wrapper
  $repo = tuque_wrapper_get_repository_instance();

  try {
    $description = $repo->api->a->describeRepository(); // Check for repository access
    $parent = $repo->getObject($recipient); // Check for object access
    if (!$remove) {
      $parent->relationships->add($uri, $predicate, $related);
    }
    else {
      $parent->relationships->remove($uri, $predicate, $related);
    }
  } catch(Exception $e) {
    $code = $e->getCode();
    if ($should_exit){
     switch ($code) {
      case '404':
        if (!isset($description)) { // Couldn't reach the repository.
          drupal_set_message(t('The Fedora repository server is currently unavailable. Please contact the site administrator.'), 'error', FALSE);
        }
        drupal_not_found();
        break;
      case '401':
      case '403':
        drupal_access_denied();
        break;
      default:
        drupal_set_message(t('An error occured when attempting to access the fedora repository. Please contact the site administrator.'), 'error', FALSE);
        $message = '%type: !message in %function (line %line of %file).';
        $backtrace = $e->getTrace();
        $caller = $backtrace[1];
        $variables = array(
          '%type' => get_class($e),
          '!message' => check_plain($e->getMessage()),
          '%function' => $caller['function'],
          '%file' => $caller['file'],
          '%line' => $caller['line']
        );
        watchdog('islandora', $message, $variables, WATCHDOG_ERROR, NULL);
        drupal_not_found();
        break;
     }
     exit();
    }else{
     $toReturn['success'] = false;
     $toReturn['msg'] = $code;
     return $toReturn;
    }
  }
  $toReturn['success'] = true; 
  return $toReturn;
}

/**
 *
 * @param string $pid
 * @return array
 *
 */
function sidora_get_parents($pid) {
  $query = 'select $object $title $created
    from <#ri>
    where ($object <info:fedora/fedora-system:def/model#label> $title
    and $object <fedora-model:createdDate> $created
    and $object <fedora-model:state> <info:fedora/fedora-system:def/model#Active>
    and ($object <fedora-rels-ext:hasResource> <info:fedora/' . $pid . '>
    or $object <fedora-rels-ext:hasConcept> <info:fedora/' . $pid . '> ))
    order by $title';
  $results = sidora_query($query);
  return $results;
}

/**
 *
 * @param string $pid
 * @return array
 *
 */
function sidora_get_children($pid) {
  $query =
    'select $object $title $created
    from <#ri>
    where ($object <info:fedora/fedora-system:def/model#label> $title
    and $object <fedora-model:createdDate> $created
    and $object <fedora-model:state> <info:fedora/fedora-system:def/model#Active>
    and (<info:fedora/' .$pid . '> <fedora-rels-ext:hasConcept> $object))
    order by $title';
  $results = sidora_query($query);
  return $results;
}


function sidora_get_cmodels_cmodel($pid) {
  $query = 'select $object $title $model $parent_model
    from <#ri>
    where ($object <info:fedora/fedora-system:def/model#label> $title
    and $object <mulgara:is> <info:fedora/' . $pid . '>
    and $object <fedora-model:hasModel> $model
    and $model <fedora-model:hasModel> $parent_model
    and $object <fedora-model:state> <info:fedora/fedora-system:def/model#Active>)
    minus $model <mulgara:is> <info:fedora/fedora-system:FedoraObject-3.0>
    minus $model <mulgara:is> <info:fedora/fedora-system:ContentModel-3.0>
    minus $parent_model <mulgara:is> <info:fedora/fedora-system:FedoraObject-3.0>
    order by $title';
  module_load_include('inc', 'fedora_repository', 'CollectionClass');
  $collection = new CollectionClass();
  $results = $collection->getRelatedObjects(NULL, 1000000, NULL, $query);
  $ret = array();
  if ($results != '') {
    $document = new DOMDocument();
    $document->loadXML($results);
    $path = new DOMXPath($document);
    $path->registerNamespace('sparql', 'http://www.w3.org/2001/sw/DataAccess/rf1/result');
    $results = $path->query('//sparql:result');
    $count = $results->length;
    if ($count > 0) {
      for ($i = 0; $i < $count; $i++) {
        $result = $results->item($i);
        $parent_model_pid = substr($path->query('sparql:parent_model/@uri', $result)->item(0)->value, 12); // 12 characteres in "info:fedora/"
        $ret[] = $parent_model_pid;
      }
    }
    return $ret;
  }
  return $ret;
}

/**
 * gets a list of concept object pids with their titles by comparing the substring to the objects label
 * used for generating type aheads.
 *
 * @param string $substring
 * @return array
 */
function sidora_get_concepts(&$concepts, $substring = NULL) {
  if (!isset($substring)) {
    return array();
  }
  $results = array();
  foreach ($concepts as $key => $concept) {
    if (stripos($concept, $substring) !== FALSE) {
      $results[$key] = $concept;
    }
  }
  return $results;
}

/**
 * runs and itql query and returns the results in an array, array is formatted for form api select element
 * @param string $query
 * @return array
 */
function sidora_query($query) {
  module_load_include('inc', 'fedora_repository', 'CollectionClass');
  $collection = new CollectionClass();
  $results = $collection->getRelatedObjects(NULL, 1000000, NULL, $query);
  $results = trim($results);
  $ret = array();
  if ($results != '') {
    $document = new DOMDocument();
    $document->loadXML($results);
    $path = new DOMXPath($document);
    $path->registerNamespace('sparql', 'http://www.w3.org/2001/sw/DataAccess/rf1/result');
    $results = $path->query('//sparql:result');
    $count = $results->length;
    if ($count > 0) {
      for ($i = 0; $i < $count; $i++) {
        $result = $results->item($i);
        $pid = substr($path->query('sparql:object/@uri', $result)->item(0)->value, 12); // 12 characteres in "info:fedora/"
        $label = $path->query('sparql:title', $result)->item(0)->textContent;
        if (strlen($label) > 125) {
          $label = substr($label, 0, 125); //this text will be shown in a form select so keep it short
        }
        if (!empty($label)) {
          $ret[$pid] = $label;
        }
      }
    }
    return $ret;
  }
  return $ret;
}

/**
 * Creates a list of recently ingested objects that have a RELS-EXT statement that says this objects metadata has not yet been modified.
 * This list appears on the users account page so they can find objects they have ingested but not yet updated.
 *
 * @global object $user
 *  the drupal user
 *
 * @global <type> $base_url
 *
 * @return string
 *  a themed pager
 */
function sidora_get_unmodified_objects() {
  global $user;
  global $base_url;
  $name = $user->name;
  $query = 'select $object $title $model $created $orginalMeta $ownerID from <#ri>
where ($object <info:fedora/fedora-system:def/model#label> $title
and $object <fedora-model:hasModel> $model
and $object <fedora-model:createdDate> $created
and $object <fedora-model:state> <info:fedora/fedora-system:def/model#Active>
and $object <info:fedora/fedora-system:def/model#ownerId> $ownerID
and $ownerID <mulgara:is> \'' . $name . '\'
and $object <http://islandora.org/ontologies/metadata#orginal_metadata> $orginalMeta
and $orginalMeta <mulgara:is> \'TRUE\'
)
minus $model <mulgara:is> <info:fedora/fedora-system:FedoraObject-3.0>
minus $model <mulgara:is> <info:fedora/fedora-system:ContentModel-3.0>
order by $title';
  module_load_include('inc', 'fedora_repository', 'CollectionClass');
  $collection = new CollectionClass();
  $results = $collection->getRelatedObjects(NULL, 1000000, NULL, $query);
  $results = trim($results);
  $arr = array();
  if ($results != '') {
    $document = new DOMDocument();
    $document->loadXML($results);
    $path = new DOMXPath($document);
    $path->registerNamespace('sparql', 'http://www.w3.org/2001/sw/DataAccess/rf1/result');
    $results = $path->query('//sparql:result');
    $count = $results->length;
    $number_per_page = variable_get('sidora_number_per_page', 10);
    $page_number = 0;
    if (isset($_GET['page'])) {
      $page_number = $_GET['page'];
    }
    if ($count > 0) {
      $ii = $page_number * $number_per_page;
      for ($i = $ii; $i < $count; $i++) {
        $result = $results->item($i);
        $pid = substr($path->query('sparql:object/@uri', $result)->item(0)->value, 12); // 12 characteres in "info:fedora/"
        $label = $path->query('sparql:title', $result)->item(0)->textContent;
        $created = $path->query('sparql:created', $result)->item(0)->textContent;
        $relatedCount = $path->query('sparql:k0', $result)->item(0)->textContent;
        $arr[] = l($label, $base_url . '/fedora/repository/' . $pid);
        if ($i >= $ii - 1 + $number_per_page)
          break;
      }
    }
  }
  _sidora_pager_init($count, $number_per_page, $element = 0);
  $pager = theme('pager', NULL, $number_per_page, 0, NULL, 10);
  return $pager . '<br />' . theme('item_list', $arr, 'Image objects with Original Metadata') . '<br />' . $pager;
}

/**
 * Initialize a pager for theme('pager') without running an SQL query.
 *
 * The nuts and bolts of this function are borrowed from z3950.module
 * and also apachesolr.module.
 *
 * @see pager_query()
 *
 * @param $total
 *  The total number of items found.
 * @param $limit
 *  The number of items you will display per page.
 * @param $element
 *  An optional integer to distinguish between multiple pagers on one page.
 *
 * @return
 *  The current page for $element. 0 by default if $_GET['page'] is empty.
 */
function _sidora_pager_init($total, $limit = 10, $element = 0) {
  // set global variables
  global $pager_page_array;
  global $pager_total;
  global $pager_total_items;

  // get value from page parameter
  $page = isset($_GET['page']) ? $_GET['page'] : '';

  // Convert comma-separated $page to an array, used by other functions.
  $pager_page_array = explode(',', $page);

  // We calculate the total of pages as ceil(items / limit).
  $pager_total_items[$element] = $total;
  $pager_total[$element] = ceil($pager_total_items[$element] / $limit);
  $pager_page_array[$element] = max(0, min((int) $pager_page_array[$element], ((int) $pager_total[$element]) - 1));

  // return the current position
  return $pager_page_array[$element];
}

/**
 * Gets the root object for the given user.  Note this is for tree operations, not for user operations.
 *
 * @param stdClass $account
 *   The user in quetion, defaults to the logged in user.
 *
 * @return string
 *   The PID of the root object of the given user.
 */
function sidora_get_user_root_object(stdClass $account = NULL) {
  global $user;
  $account = is_object($account) ? $account : $user;
  if (in_array('administrator', $account->roles)) {
    return variable_get('islandora_repository_pid', 'si:root');
  }
  elseif (isset($account->data['islandora_user_pid'])) {
    return $account->data['islandora_user_pid'];
  }
  return '';
}

function sidora_get_user_object(stdClass $account = NULL) {
  global $user;
  $account = is_object($account) ? $account : $user;
  if (isset($account->data['islandora_user_pid'])) {
    return $account->data['islandora_user_pid'];
  }
  return '';
}



/**
 * Gets the child resources belonging to the given object.
 *
 * @param AbstractObject $object
 *   The object in which the child objects belong.
 *
 * @return array
 *   An associative array describing the child resources.
 */
function sidora_get_child_resources(AbstractObject $object, array $params = array(), &$count = NULL) {
  $out = array();
  $default_params = array(
    'filter' => '',
    'start' => 0,
    'limit' => NULL,
    'sort' => 'pid',
    'dir' => 'ASC',
  );
  $params = array_merge($default_params, $params);
  $limit = isset($params['limit']) ? "LIMIT {$params['limit']}" : '';
  $order = '';
  if (!empty($params['sort'])) {
    $order = "ORDER BY {$params['dir']}(?{$params['sort']})";
  }
  $filter = '';
  if (!empty($params['filter'])) {
    foreach ($params['filter'] as $properties) {
      $field = $properties['field'];
      switch ($properties['type']) {
        case 'string':
          $value = preg_quote($properties['value'], '/');
          $filter .= "FILTER(regex(?{$field}, '^.*{$value}.*', 'i'))\n";
          break;

        case 'datetime':
          $op = $properties['comparison'];
          $value = explode(' ', $properties['value']);
          $date = $value[0];
          $time = $value[1];
          $filter .= "FILTER(?{$field} {$op} xsd:dateTime('{$date}T{$time}Z'))\n";
          break;
      }
    }
  }
  $query = "SELECT ?pid ?label ?model ?created FROM <#ri> WHERE {
    <info:fedora/{$object->id}> <fedora-rels-ext:hasResource> ?pid .
    ?pid <fedora-model:state> <fedora-model:Active>;
         <fedora-model:label> ?label;
         <fedora-model:hasModel> ?model;
         <fedora-model:createdDate> ?created.
    {$filter}
    FILTER(!sameTerm(?model, <info:fedora/fedora-system:FedoraObject-3.0>) &&
           !sameTerm(?model, <info:fedora/si:resourceCModel>))
    }
    {$order}
    OFFSET {$params['start']}
    {$limit}";
  $results = $object->repository->ri->query($query, 'sparql');
  if ($count === NULL) {
    $count = $object->repository->ri->countQuery($query, 'sparql');
  }
  foreach ($results as $result) {
    $pid = $result['pid']['value'];
    $out[$pid]['pid'] = $pid;
    $out[$pid]['label'] = $result['label']['value'];
    $out[$pid]['created'] = $result['created']['value'];
    $out[$pid]['models'][] = $result['model']['value'];
  }
  return $out;
}

/**
 * Gets the child concepts belonging to the given object.
 *
 * @param AbstractObject $object
 *   The object in which the child objects belong.
 *
 * @return array
 *   An associative array describing the child concepts.
 */
function sidora_get_child_concepts(AbstractObject $object) {
  $out = array();
  $child_concepts = 'count(select $child from <#ri> where
    $concept <fedora-rels-ext:hasConcept> $child and
    $child <fedora-model:state> <fedora-model:Active>)';
  $child_resources = 'count(select $child from <#ri> where
    $concept <fedora-rels-ext:hasResource> $child and
    $child <fedora-model:state> <fedora-model:Active>)';
  $count = $child_concepts . ' ' . $child_resources;
  $query = 'select $concept $label $model $created ' . $count . ' from <#ri> where
    <info:fedora/' . $object->id . '> <fedora-rels-ext:hasConcept> $concept and
    $concept <fedora-model:state> <fedora-model:Active> and
    $concept <fedora-model:label> $label and
    $concept <fedora-model:createdDate> $created and
    $concept <fedora-model:hasModel> $model
    minus $model <mulgara:is> <info:fedora/si:conceptCModel>
    minus $model <mulgara:is> <info:fedora/fedora-system:FedoraObject-3.0>';
  $results = $object->repository->ri->query($query, 'itql');
  foreach ($results as $result) {
    $pid = $result['concept']['value'];
    $out[$pid]['pid'] = $pid;
    $out[$pid]['label'] = $result['label']['value'];
    $out[$pid]['num_concepts'] = (int) $result['k0']['value'];
    $out[$pid]['num_resources'] = (int) $result['k1']['value'];
    $out[$pid]['num_children'] = (int) $result['k0']['value'] + $result['k1']['value'];
    $out[$pid]['models'][] = $result['model']['value'];
  }
  return $out;
}

/**
 * Gets the number of children the given object has.
 *
 * @param AbstractObject $object
 *   The parent object.
 *
 * @return int
 *   The number of children the given object has.
 */
function sidora_get_number_of_children(AbstractObject $object) {
  $out = array(
    'num_concepts' => 0,
    'num_resources' => 0,
    'num_children' => 0,
  );
  $child_concepts = 'count(select $child from <#ri> where
    $concept <fedora-rels-ext:hasConcept> $child and
    $child <fedora-model:state> <fedora-model:Active>)';
  $child_resources = 'count(select $child from <#ri> where
    $concept <fedora-rels-ext:hasResource> $child and
    $child <fedora-model:state> <fedora-model:Active>)';
  $count = $child_concepts . ' ' . $child_resources;
  $query = 'select $concept ' . $count . ' from <#ri> where
    $concept <mulgara:is> <info:fedora/' . $object->id . '>';
  $results = $object->repository->ri->query($query, 'itql');
  if (count($results)) {
    $result = $results[0];
    $out = array(
      'num_concepts' => (int) $result['k0']['value'],
      'num_resources' => (int) $result['k1']['value'],
      'num_children' => (int) $result['k0']['value'] + $result['k1']['value'],
    );
  }
  return $out;
}

/**
 * Gets the parent concepts the given object belongs to.
 *
 * @param AbstractObject $object
 *   The child object.
 *
 * @return array
 *   An associative array describing the parent concepts.
 */
function sidora_get_parent_concepts(AbstractObject $object) {
  $out = array();
  $query = "SELECT ?pid ?label ?model FROM <#ri> WHERE {
      {
        ?pid  <fedora-rels-ext:hasConcept> <info:fedora/{$object->id}>;
          <fedora-model:state> <fedora-model:Active>;
          <fedora-model:label> ?label;
          <fedora-model:hasModel> ?model.
        FILTER(!sameTerm(?model, <info:fedora/fedora-system:FedoraObject-3.0>) &&
               !sameTerm(?model, <info:fedora/si:conceptCModel>))
      } UNION {
        ?pid  <fedora-rels-ext:hasResource> <info:fedora/{$object->id}>;
          <fedora-model:state> <fedora-model:Active>;
          <fedora-model:label> ?label;
          <fedora-model:hasModel> ?model.
        FILTER(!sameTerm(?model, <info:fedora/fedora-system:FedoraObject-3.0>) &&
               !sameTerm(?model, <info:fedora/si:resourceCModel>))
      } UNION {
        ?pid  <fedora-rels-ext:managesCodebook> <info:fedora/{$object->id}>;
          <fedora-model:state> <fedora-model:Active>;
          <fedora-model:label> ?label;
          <fedora-model:hasModel> ?model.
        FILTER(!sameTerm(?model, <info:fedora/fedora-system:FedoraObject-3.0>) &&
               !sameTerm(?model, <info:fedora/si:resourceCModel>))
      }
    } ORDER BY ?label";
  $results = $object->repository->ri->query($query, 'sparql');
  foreach ($results as $result) {
    $pid = $result['pid']['value'];
    $out[$pid]['pid'] = $pid;
    $out[$pid]['label'] = $result['label']['value'];
    $out[$pid]['models'][] = $result['model']['value'];
  }
  return $out;
}

/**
 * Gets the given objects concept/resource content model.
 *
 * Assumes that concepts/resources will only ever be composed of a single
 * content model, aside from "si:resourceCModel" and "si:conceptCModel".
 *
 * @param AbstractObject $object
 *   The object to get the content model from.
 * @param array $ignore_models
 *   The models to ignore, if not given the following defaults are used:
 *   - 'si:resourceCModel'
 *   - 'si:conceptCModel'
 *   - 'fedora-system:FedoraObject-3.0'
 *
 * @return string
 *   The PID of the concept model, or NULL if none was found.
 */
function sidora_get_model(AbstractObject $object, array $ignore_models = NULL) {
  // Reduce to the last model that isn't and ignored si:resourceCModel.
  $ignore_models = isset($ignore_models) ? $ignore_models : array(
    'si:resourceCModel',
    'si:conceptCModel',
    'fedora-system:FedoraObject-3.0',
  );
  $ignore_base_content_models = function(&$result, $model) use($ignore_models) {
    $ignore_model = in_array($model, $ignore_models);
    $result = $ignore_model ? $result : $model;
    return $result;
  };
  return array_reduce($object->models, $ignore_base_content_models);
}

/**
 * Checks if the given object is a resource.
 *
 * @param AbstractObject $object
 *   The object to get the content model from.
 *
 * @return bool
 *   TRUE if the given object is a resource, FALSE otherwise.
 */
function sidora_is_resource(AbstractObject $object) {
  $resource_models =array(
      'si:imageCModel',
      'si:generalImageCModel',
      'si:datasetCModel',
      'si:fieldbookCModel',
  );
  return in_array('si:resourceCModel', $object->models) ||
    array_intersect($resource_models, $object->models);
}

/**
 * Checks if the given object is a codebook.
 *
 * @param AbstractObject $object
 *   The object to get the content model from.
 *
 * @return bool
 *   TRUE if the given object is a codebook, FALSE otherwise.
 */
function sidora_is_codebook(AbstractObject $object) {
  $codebook_models = array(
      'si:codebookCModel',
  );
  return array_intersect($codebook_models, $object->models);
}

/**
 * Checks if the given object is a concept.
 *
 * @param AbstractObject $object
 *   The object to get the content model from.
 *
 * @return bool
 *   TRUE if the given object is a concept, FALSE otherwise.
 */
function sidora_is_concept(AbstractObject $object) {
  $concept_models = array(
      'si:collectionCModel',
      'si:projectCModel',
      'si:ctPlotCModel',
      'si:peopleCModel',
      'si:organizationCModel',
      'si:expeditionCModel',
      'si:cameraTrapCModel',
      'si:ncdCollectionCModel',
      'si:dwcCModel',
      'si:lidoCollectionCModel',
  );
  return in_array('si:conceptCModel', $object->models)  ||
    array_intersect($concept_models, $object->models);
}

/**
 * Create/Update a datastream with the given parameters.
 *
 * @param AbstractObject $object
 *   The object to update.
 * @param string $file
 *   The absolute path to the file to use as content for the datastream.
 * @param string $dsid
 *   The datastream ID.
 * @param string $label
 *   The datastream label.
 * @param string $mimetype
 *   The datastream mimetype, if none given it will be guessed from the file
 *   extension.
 * @param string $control_group
 *   The datastream control group.
 *
 * @return bool
 *   TRUE if successful, FALSE otherwise.
 */
function sidora_update_datastream(AbstractObject $object, $file, $dsid, $label = NULL, $mimetype = NULL, $control_group = 'M', $copy = TRUE) {
  $mime_detector = new MimeDetect();
  $ds = isset($object[$dsid]) ? $object[$dsid] : $object->constructDatastream($dsid, $control_group);
  $is_file = file_exists($file);
  $ds->label = isset($label) ? $label : $dsid;
  $ds->mimetype = isset($mimetype) ? $mimetype :
    $is_file ? $mime_detector->getMimeType($file) : 'text/xml';
  if ($is_file) {
    $ds->setContentFromFile($file, $copy);
  }
  else {
    $ds->content = $file;
  }
  if (empty($object[$dsid])) {
    $object->ingestDatastream($ds);
  }
  return TRUE;
}

/**
 * Adds the child Resources/Concepts to the parent Concept.
 *
 * @param AbstractObject $parent
 *   The parent to add the children to.
 * @param array $children
 *   The child objects to add to the parent.
 */
function sidora_add_children(AbstractObject $parent, array $children) {
  foreach ($children as $child) {
    sidora_add_child($parent, $child);
  }
}

/**
 * Adds the child Resource/Concept to the parent Concept.
 *
 * @param AbstractObject $parent
 *   The parent to add the child to.
 * @param AbstractObject $child
 *   The child to add to the parent.
 */
function sidora_add_child(AbstractObject $parent, AbstractObject $child) {
  if (sidora_is_concept($child)) {
    sidora_set_relationship($parent->relationships, FEDORA_RELS_EXT_URI, 'hasConcept', $child->id);
  }
  elseif (sidora_is_resource($child)) {
    sidora_set_relationship($parent->relationships, FEDORA_RELS_EXT_URI, 'hasResource', $child->id);
  }
}

/**
 * Sets a relationship, if not already present.
 *
 * @param FedoraRelationships $relationships
 *   The Fedora relationships to be modified, either RELS-EXT or RELS-INT.
 * @param string $predicate_uri
 *   The predicate URI.
 * @param string $predicate
 *   The predicate.
 * @param string $object
 *   The object.
 * @param bool $literal
 *   TRUE if the object is a literal, FALSE if it is an object.
 */
function sidora_set_relationship(FedoraRelationships $relationships, $predicate_uri, $predicate, $object, $literal = FALSE) {
  $results = $relationships->get($predicate_uri, $predicate, $object, $literal);
  if (count($results) == 0) {
    $relationships->add($predicate_uri, $predicate, $object, $literal);
  }
}

/**
 * Creates a user object for the given user account.
 *
 * All user objects are added as children to 'si:user-projects'.
 *
 * @param stdClass $account
 *   The Drupal user account object.
 *
 * @return AbstractObject
 *   The created user object if successful, FALSE otherwise.
 */
function sidora_create_user_object(stdClass $account) {
  $user_projects = islandora_object_load('si:user-projects');
  if (!is_object($user_projects)) {
    return FALSE;
  }
  module_load_include('inc', 'xml_form_builder', 'includes/associations');
  $user_object = $user_projects->repository->constructObject('si-user');
  $user_object->owner = $account->name;
  $user_object->label = "{$account->name} Projects";
  $user_object->models = array('si:conceptCModel', variable_get('sidora_automatic_person_model', 'si:HierarchyObject'));
  $eaccpf = sidora_create_default_person_eaccpf($user_object, $account);
  sidora_update_datastream($user_object, $eaccpf, 'EAC-CPF');
  $collection_policy = drupal_get_path('module', 'sidora') . '/data/policies/default_COLLECTION_POLICY.xml';
  sidora_update_datastream($user_object, $collection_policy, 'COLLECTION_POLICY');
  sidora_update_datastream($user_object, sidora_create_default_xacml($account), 'POLICY');
  $associations = xml_form_builder_get_associations(array(), $user_object->models, array());
  if (count($associations) == 1){
    sidora_update_datastream($user_object, '<sidora>
<model>'.$associations[0]['content_model'].'</model>
<form>'.$associations[0]['form_name'].'</form>
<ontology_location_id>AUTOMATIC_USER_CREATION_FROM_ASSOCIATION</ontology_location_id>
<meta_requirements_fulfilled>FALSE</meta_requirements_fulfilled>
<initial_dsid>'.$associations[0]['dsid'].'</initial_dsid>
</sidora>', 'SIDORA');
  }else{
    $dsid = variable_get('sidora_automatic_person_dsid', 'DESCMETA');
    sidora_update_datastream($user_object, '<sidora>
<model>'.variable_get('sidora_automatic_person_model', 'si:HierarchyObject').'</model>
<form>'. variable_get('sidora_automatic_person_form', 'Person 2015').'</form>
<ontology_location_id>AUTOMATIC_USER_CREATION_FROM_SIDORA_DEFAULT</ontology_location_id>
<meta_requirements_fulfilled>FALSE</meta_requirements_fulfilled>
<initial_dsid>'.$dsid.'</initial_dsid>
</sidora>', 'SIDORA');
    if (empty($user_object[$dsid])) sidora_update_datastream($user_object, '<xml></xml>', $dsid);
  }

  sidora_add_child($user_projects, $user_object);
  return islandora_add_object($user_object);
}

/**
 * Creates the default XACML POLICY for the given user.
 *
 * If no users is given the currently logged in user is used.
 *
 * Creates a policy that wherein the object cannot be edited or viewed unless
 * you are the creator or have an administrator role.
 *
 * @param stdClass $account
 *   A Drupal user object.
 *
 * @return string
 *   The generated XACML POLICY.
 */
function sidora_create_default_xacml(stdClass $account = NULL) {
  module_load_include('inc', 'islandora_xacml_api', 'Xacml');
  global $user;
  $account = is_object($account) ? $account : $user;
  $xacml = new Xacml();
  $xacml->managementRule->addUser(array('fedoraAdmin', $account->name));
  $xacml->managementRule->addRole(array('administrator'));
  $xacml->viewingRule->addUser(array('fedoraAdmin', $account->name));
  $xacml->viewingRule->addRole(array('administrator'));
  $xml = $xacml->getXmlString(TRUE);
  return $xml;
}

/**
 * Creates the default EAC-CPF datastream for the given user.
 *
 * @param AbstractObject $object
 *   The Drupal users Fedora object.
 * @param stdClass $account
 *   A Drupal user object.
 *
 * @return string
 *   The generated EAC-CPF document.
 */
function sidora_create_default_person_eaccpf(AbstractObject $object, $account) {
  $date = date("c");
  return <<<EOT
<eac-cpf xmlns="urn:isbn:1-931666-33-4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink"
    xsi:schemaLocation="urn:isbn:1-931666-33-4 http://eac.staatsbibliothek-berlin.de/schema/cpf.xsd">
  <control>
    <recordId>{$object->id}</recordId>
    <maintenanceStatus>created</maintenanceStatus>
    <maintenanceAgency>
      <agencyName/>
    </maintenanceAgency>
    <maintenanceHistory>
      <maintenanceEvent>
        <eventType>created</eventType>
        <eventDateTime>{$date}</eventDateTime>
        <agentType>human</agentType>
        <agent>{$account->name}</agent>
        <eventDescription>Record Created</eventDescription>
      </maintenanceEvent>
    </maintenanceHistory>
  </control>
  <cpfDescription>
    <identity>
      <entityType>person</entityType>
      <nameEntry localType="primary">
        <part localType="fullname"/>
      </nameEntry>
      <nameEntry>
        <part localType="surname"/>
        <part localType="forename"/>
        <part localType="middle"/>
      </nameEntry>
      <nameEntry localType="alt">
        <part>{$account->name}</part>
      </nameEntry>
    </identity>
    <description>
      <existDates>
        <dateRange>
          <fromDate/>
          <toDate/>
        </dateRange>
      </existDates>
      <occupation>
        <term/>
      </occupation>
      <biogHist>
        <p/>
      </biogHist>
    </description>
  </cpfDescription>
</eac-cpf>
EOT;
}
function sidora_get_file_extension_from_mime($file_mime_type){
      $file_extensions_for_mime_types_map = array(
        'application/x-authorware-bin' => '.aab',
        'application/x-authorware-map' => '.aam',
        'application/x-authorware-seg' => '.aas',
        'text/vnd.abc' => '.abc',
        'video/animaflex' => '.afl',
        'application/x-aim' => '.aim',
        'text/x-audiosoft-intra' => '.aip',
        'application/x-navi-animation' => '.ani',
        'application/x-nokia-9000-communicator-add-on-software' => '.aos',
        'application/mime' => '.aps',
        'application/arj' => '.arj',
        'image/x-jg' => '.art',
        'text/asp' => '.asp',
        'application/x-mplayer2' => '.asx',
        'video/x-ms-asf-plugin' => '.asx',
        'audio/x-au' => '.au',
        'application/x-troff-msvideo' => '.avi',
        'video/avi' => '.avi',
        'video/msvideo' => '.avi',
        'video/x-msvideo' => '.avi',
        'video/avs-video' => '.avs',
        'application/x-bcpio' => '.bcpio',
        'application/mac-binary' => '.bin',
        'application/macbinary' => '.bin',
        'application/x-binary' => '.bin',
        'application/x-macbinary' => '.bin',
        'image/x-windows-bmp' => '.bmp',
        'application/x-bzip' => '.bz',
        'application/vnd.ms-pki.seccat' => '.cat',
        'application/clariscad' => '.ccad',
        'application/x-cocoa' => '.cco',
        'application/cdf' => '.cdf',
        'application/x-cdf' => '.cdf',
        'application/java' => '.class',
        'application/java-byte-code' => '.class',
        'application/x-java-class' => '.class',
        'application/x-cpio' => '.cpio',
        'application/mac-compactpro' => '.cpt',
        'application/x-compactpro' => '.cpt',
        'application/x-cpt' => '.cpt',
        'application/pkcs-crl' => '.crl',
        'application/pkix-crl' => '.crl',
        'application/x-x509-user-cert' => '.crt',
        'application/x-csh' => '.csh',
        'text/x-script.csh' => '.csh',
        'application/x-pointplus' => '.css',
        'text/css' => '.css',
        'application/x-deepv' => '.deepv',
        'video/dl' => '.dl',
        'video/x-dl' => '.dl',
        'application/commonground' => '.dp',
        'application/drafting' => '.drw',
        'application/x-dvi' => '.dvi',
        'drawing/x-dwf (old)' => '.dwf',
        'model/vnd.dwf' => '.dwf',
        'application/acad' => '.dwg',
        'application/dxf' => '.dxf',
        'text/x-script.elisp' => '.el',
        'application/x-bytecode.elisp (compiled elisp)' => '.elc',
        'application/x-elc' => '.elc',
        'application/x-esrehber' => '.es',
        'text/x-setext' => '.etx',
        'application/envoy' => '.evy',
        'application/vnd.fdf' => '.fdf',
        'application/fractals' => '.fif',
        'image/fif' => '.fif',
        'video/fli' => '.fli',
        'video/x-fli' => '.fli',
        'text/vnd.fmi.flexstor' => '.flx',
        'video/x-atomic3d-feature' => '.fmf',
        'image/vnd.fpx' => '.fpx',
        'image/vnd.net-fpx' => '.fpx',
        'application/freeloader' => '.frl',
        'image/g3fax' => '.g3',
        'image/gif' => '.gif',
        'video/gl' => '.gl',
        'video/x-gl' => '.gl',
        'application/x-gsp' => '.gsp',
        'application/x-gss' => '.gss',
        'application/x-gtar' => '.gtar',
        'multipart/x-gzip' => '.gzip',
        'application/x-hdf' => '.hdf',
        'text/x-script' => '.hlb',
        'application/hlp' => '.hlp',
        'application/x-winhelp' => '.hlp',
        'application/binhex' => '.hqx',
        'application/binhex4' => '.hqx',
        'application/mac-binhex' => '.hqx',
        'application/mac-binhex40' => '.hqx',
        'application/x-binhex40' => '.hqx',
        'application/x-mac-binhex40' => '.hqx',
        'application/hta' => '.hta',
        'text/x-component' => '.htc',
        'text/webviewhtml' => '.htt',
        'x-conference/x-cooltalk' => '.ice ',
        'image/x-icon' => '.ico',
        'application/x-ima' => '.ima',
        'application/x-httpd-imap' => '.imap',
        'application/inf' => '.inf ',
        'application/x-internett-signup' => '.ins',
        'application/x-ip2' => '.ip ',
        'video/x-isvideo' => '.isu',
        'audio/it' => '.it',
        'application/x-inventor' => '.iv',
        'i-world/i-vrml' => '.ivr',
        'application/x-livescreen' => '.ivy',
        'audio/x-jam' => '.jam ',
        'application/x-java-commerce' => '.jcm ',
        'image/x-jps' => '.jps',
        'application/x-javascript' => '.js ',
        'image/jutvision' => '.jut',
        'music/x-karaoke' => '.kar',
        'application/x-ksh' => '.ksh',
        'text/x-script.ksh' => '.ksh',
        'audio/x-liveaudio' => '.lam',
        'application/lha' => '.lha',
        'application/x-lha' => '.lha',
        'application/x-lisp' => '.lsp ',
        'text/x-script.lisp' => '.lsp ',
        'text/x-la-asf' => '.lsx',
        'application/x-lzh' => '.lzh',
        'application/lzx' => '.lzx',
        'application/x-lzx' => '.lzx',
        'text/x-m' => '.m',
        'audio/x-mpequrl' => '.m3u ',
        'application/x-troff-man' => '.man',
        'application/x-navimap' => '.map',
        'application/mbedlet' => '.mbd',
        'application/x-magic-cap-package-1.0' => '.mc$',
        'application/mcad' => '.mcd',
        'application/x-mathcad' => '.mcd',
        'image/vasa' => '.mcf',
        'text/mcf' => '.mcf',
        'application/netmc' => '.mcp',
        'application/x-troff-me' => '.me ',
        'application/x-frame' => '.mif',
        'application/x-mif' => '.mif',
        'www/mime' => '.mime ',
        'audio/x-vnd.audioexplosion.mjuicemediafile' => '.mjf',
        'video/x-motion-jpeg' => '.mjpg ',
        'application/x-meme' => '.mm',
        'audio/mod' => '.mod',
        'audio/x-mod' => '.mod',
        'audio/x-mpeg' => '.mp2',
        'video/x-mpeq2a' => '.mp2',
        'audio/mpeg3' => '.mp3',
        'audio/x-mpeg-3' => '.mp3',
        'application/vnd.ms-project' => '.mpp',
        'application/marc' => '.mrc',
        'application/x-troff-ms' => '.ms',
        'application/x-vnd.audioexplosion.mzz' => '.mzz',
        'application/vnd.nokia.configuration-message' => '.ncm',
        'application/x-mix-transfer' => '.nix',
        'application/x-conference' => '.nsc',
        'application/x-navidoc' => '.nvd',
        'application/oda' => '.oda',
        'application/x-omc' => '.omc',
        'application/x-omcdatamaker' => '.omcd',
        'application/x-omcregerator' => '.omcr',
        'text/x-pascal' => '.p',
        'application/pkcs10' => '.p10',
        'application/x-pkcs10' => '.p10',
        'application/pkcs-12' => '.p12',
        'application/x-pkcs12' => '.p12',
        'application/x-pkcs7-signature' => '.p7a',
        'application/x-pkcs7-certreqresp' => '.p7r',
        'application/pkcs7-signature' => '.p7s',
        'text/pascal' => '.pas',
        'image/x-portable-bitmap' => '.pbm ',
        'application/vnd.hp-pcl' => '.pcl',
        'application/x-pcl' => '.pcl',
        'image/x-pict' => '.pct',
        'image/x-pcx' => '.pcx',
        'application/pdf' => '.pdf',
        'audio/make.my.funk' => '.pfunk',
        'image/x-portable-graymap' => '.pgm',
        'image/x-portable-greymap' => '.pgm',
        'application/x-newton-compatible-pkg' => '.pkg',
        'application/vnd.ms-pki.pko' => '.pko',
        'text/x-script.perl' => '.pl',
        'application/x-pixclscript' => '.plx',
        'text/x-script.perl-module' => '.pm',
        'application/x-portable-anymap' => '.pnm',
        'image/x-portable-anymap' => '.pnm',
        'model/x-pov' => '.pov',
        'image/x-portable-pixmap' => '.ppm',
        'application/powerpoint' => '.ppt',
        'application/x-mspowerpoint' => '.ppt',
        'application/x-freelance' => '.pre',
        'paleovu/x-pv' => '.pvu',
        'text/x-script.phyton' => '.py ',
        'applicaiton/x-bytecode.python' => '.pyc ',
        'audio/vnd.qcelp' => '.qcp ',
        'video/x-qtc' => '.qtc',
        'audio/x-realaudio' => '.ra',
        'application/x-cmu-raster' => '.ras',
        'image/x-cmu-raster' => '.ras',
        'text/x-script.rexx' => '.rexx ',
        'image/vnd.rn-realflash' => '.rf',
        'image/x-rgb' => '.rgb ',
        'application/vnd.rn-realmedia' => '.rm',
        'audio/mid' => '.rmi',
        'application/ringing-tones' => '.rng',
        'application/vnd.nokia.ringing-tone' => '.rng',
        'application/vnd.rn-realplayer' => '.rnx ',
        'image/vnd.rn-realpix' => '.rp ',
        'text/vnd.rn-realtext' => '.rt',
        'application/x-rtf' => '.rtf',
        'video/vnd.rn-realvideo' => '.rv',
        'audio/s3m' => '.s3m ',
        'application/x-lotusscreencam' => '.scm',
        'text/x-script.guile' => '.scm',
        'text/x-script.scheme' => '.scm',
        'video/x-scm' => '.scm',
        'application/sdp' => '.sdp ',
        'application/x-sdp' => '.sdp ',
        'application/sounder' => '.sdr',
        'application/sea' => '.sea',
        'application/x-sea' => '.sea',
        'application/set' => '.set',
        'application/x-sh' => '.sh',
        'text/x-script.sh' => '.sh',
        'audio/x-psid' => '.sid',
        'application/x-sit' => '.sit',
        'application/x-stuffit' => '.sit',
        'application/x-seelogo' => '.sl ',
        'audio/x-adpcm' => '.snd',
        'application/solids' => '.sol',
        'application/x-pkcs7-certificates' => '.spc ',
        'application/futuresplash' => '.spl',
        'application/streamingmedia' => '.ssm ',
        'application/vnd.ms-pki.certstore' => '.sst',
        'application/sla' => '.stl',
        'application/vnd.ms-pki.stl' => '.stl',
        'application/x-navistyle' => '.stl',
        'application/x-sv4cpio' => '.sv4cpio',
        'application/x-sv4crc' => '.sv4crc',
        'x-world/x-svr' => '.svr',
        'application/x-shockwave-flash' => '.swf',
        'application/x-tar' => '.tar',
        'application/toolbook' => '.tbk',
        'application/x-tcl' => '.tcl',
        'text/x-script.tcl' => '.tcl',
        'text/x-script.tcsh' => '.tcsh',
        'application/x-tex' => '.tex',
        'application/plain' => '.text',
        'application/gnutar' => '.tgz',
        'audio/tsp-audio' => '.tsi',
        'application/dsptype' => '.tsp',
        'audio/tsplayer' => '.tsp',
        'text/tab-separated-values' => '.tsv',
        'text/x-uil' => '.uil',
        'application/i-deas' => '.unv',
        'application/x-ustar' => '.ustar',
        'multipart/x-ustar' => '.ustar',
        'application/x-cdlink' => '.vcd',
        'text/x-vcalendar' => '.vcs',
        'application/vda' => '.vda',
        'video/vdo' => '.vdo',
        'application/groupwise' => '.vew ',
        'application/vocaltec-media-desc' => '.vmd ',
        'application/vocaltec-media-file' => '.vmf',
        'audio/voc' => '.voc',
        'audio/x-voc' => '.voc',
        'video/vosaic' => '.vos',
        'audio/voxware' => '.vox',
        'audio/x-twinvq' => '.vqf',
        'application/x-vrml' => '.vrml',
        'x-world/x-vrt' => '.vrt',
        'application/wordperfect6.1' => '.w61',
        'audio/wav' => '.wav',
        'audio/x-wav' => '.wav',
        'application/x-qpro' => '.wb1',
        'image/vnd.wap.wbmp' => '.wbmp',
        'application/vnd.xara' => '.web',
        'application/x-123' => '.wk1',
        'windows/metafile' => '.wmf',
        'text/vnd.wap.wml' => '.wml',
        'application/vnd.wap.wmlc' => '.wmlc ',
        'text/vnd.wap.wmlscript' => '.wmls',
        'application/vnd.wap.wmlscriptc' => '.wmlsc ',
        'application/x-wpwin' => '.wpd',
        'application/x-lotus' => '.wq1',
        'application/mswrite' => '.wri',
        'application/x-wri' => '.wri',
        'text/scriplet' => '.wsc',
        'application/x-wintalk' => '.wtk ',
        'image/x-xbitmap' => '.xbm',
        'image/x-xbm' => '.xbm',
        'image/xbm' => '.xbm',
        'video/x-amt-demorun' => '.xdr',
        'xgl/drawing' => '.xgz',
        'image/vnd.xiff' => '.xif',
        'audio/xm' => '.xm',
        'application/xml' => '.xml',
        'text/xml' => '.xml',
        'xgl/movie' => '.xmz',
        'application/x-vnd.ls-xpix' => '.xpix',
        'image/xpm' => '.xpm',
        'video/x-amt-showrun' => '.xsr',
        'image/x-xwd' => '.xwd',
        'image/x-xwindowdump' => '.xwd',
        'application/x-compress' => '.z',
        'application/x-zip-compressed' => '.zip',
        'application/zip' => '.zip',
        'multipart/x-zip' => '.zip',
        'text/x-script.zsh' => '.zsh',
      );
      if (isset($file_extensions_for_mime_types_map[$file_mime_type]))
      {
          return $file_extensions_for_mime_types_map[$file_mime_type];
      }
      $pieces = explode('/', $file_mime_type);
      return '.' . array_pop($pieces);
}
