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
 * This file adds in configuration settings for the SIdora viewers
 */
function _sidora_admin_settings_add_viewer_configs(&$form){
  drupal_add_library('system', 'drupal.collapse');
  $form['Viewer Configurations'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Viewer Configurations',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
    ),
  ); 
  $form['Viewer Configurations']['fieldset']['OpenSeaDragonInfo'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'OpenSeaDragon Info',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'osd_jquery_library_location' => array(
        '#type' => 'textfield',
        '#title' => t('The path to jQuery for the SIdora OpenSeaDragon viewer'),
        '#default_value' => variable_get('osd_jquery_library_location', $GLOBALS['base_url'].'/sites/all/libraries/openseadragon-djatoka/jquery/jquery-2.1.4.min.js'),
        '#description' => t('Preferred version is jquery-2.1.4.min.js '),
        '#attributes' => array('size' => 120),
        '#maxlength' => 1024,
      ),
      'osd_library_location' => array(
        '#type' => 'textfield',
        '#title' => t('The path to the required JavaScript for the SIdora OpenSeaDragon viewer'),
        '#default_value' => variable_get('osd_library_location', $GLOBALS['base_url'].'/sites/all/libraries/openseadragon-djatoka/'),
        '#description' => t('Include the trailing slash. Location for files: openseadragon/openseadragon.min.js js/djtilesource.js and includes the openseadragon/images folder for prefixUrl'),
        '#attributes' => array('size' => 120),
        '#maxlength' => 1024,
      ),
      'osd_local_resolver_service' => array(
        '#type' => 'textfield',
        '#title' => t('Location of the local resolver service which will take a pid, datastream id and version'),
        '#default_value' => variable_get('osd_local_resolver_service', $GLOBALS['base_url'].'/'.'sidora/osd/'),
        '#description' => t('Include the trailing slash.'),
        '#attributes' => array('size' => 120),
        '#maxlength' => 1024,
      ),
      'osd_proxy_pid_prefix' => array(
        '#type' => 'textfield',
        '#title' => t('Prefix the URL before the pid for the base image'),
        '#default_value' => variable_get('osd_proxy_pid_prefix', ''),
        '#description' => t('The URL for the base image is made up of this prefix, then the pid, then the post-fix. (ex: http://server.net:8080/fedora/objects/ )'),
      ),
      'osd_proxy_pid_postfix' => array(
        '#type' => 'textfield',
        '#title' => t('Post-fix for the URL after the pid for the base image'),
        '#default_value' => variable_get('osd_proxy_pid_postfix', ''),
        '#description' => t('The URL for the base image is made up of the prefix, then the pid, then this post-fix. (ex: /datastreams/OBJ/content )'),
      ),
      'osd_proxy_resolver_url' => array(
        '#type' => 'textfield',
        '#title' => t('The base URL for the resolver'),
        '#default_value' => variable_get('osd_proxy_resolver_url', ''),
        '#description' => t('The resolver is the location of the image resizer itself. (ex: http://server.net/adore-djatoka/resolver )'),
      ),
    ),
	);
  global $base_url;
  $form['Viewer Configurations']['fieldset']['PDFJS'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'PDF.js',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_pdf_js_location' => array(
        '#type' => 'textfield',
        '#title' => t('Location of the viewer.html file'),
        '#default_value' => variable_get(
          'sidora_pdf_js_location', 
          $base_url.'/sites/all/libraries/pdfjs/web/viewer.html'
        ),
        '#attributes' => array('size' => 120),
        '#maxlength' => 1024,
      ),
    ),
	);
  $form['Viewer Configurations']['fieldset']['Tabular'] = array(
    'fieldset' => array(
      '#type' => 'fieldset',
      '#title' => 'Tabular Data through dataTables',
      '#description' => t(''),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      'sidora_dataTables_location' => array(
        '#type' => 'textfield',
        '#title' => t('Location of the dataTables libraries'),
        '#default_value' => variable_get(
          'sidora_dataTables_location', 
          $base_url.'/sites/all/libraries/dataTables/'
        ),
        '#attributes' => array('size' => 120),
        '#description' => t('Include the trailing slash.  This includes files: css/jquery.dataTabls.css js/jquery.js js/jquery.dataTables.min.js'),
        '#maxlength' => 1024,
      ),
    ),
	);
}
