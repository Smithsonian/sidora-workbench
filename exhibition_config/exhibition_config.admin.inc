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
 * @file
 *
 * This module's Admin settings form.
 */

/**
 * Defines this modules admin settings form.
 *
 * @param array $form_state
 *   The Drupal form state.
 *
 * @return array
 *   The drupal form definition.
 */
function exhibition_config_admin_settings() {
  $epid_html = exhibition_config_get_exhibition_html_table_for_user('');
  drupal_add_js(drupal_get_path('module','exhibition_config').'/../sidora_shared/js/sidora_admin_screens.js',array('weight' => '1000000', 'group' => JS_THEME));
  $form = array(
    'si_exhibition_website_location' => array(
      '#type' => 'textfield',
      '#title' => t('The prefix for exhibition links'),
      '#default_value' => variable_get('si_exhibition_website_location', ''),
      '#description' => t('The Fedora Commons pid will be directly appended to the above, end with / if needed.'),
    ),
    'si_exhibition_friendly_website_location' => array(
      '#type' => 'textfield',
      '#title' => t('The prefix for exhibition links for the friendly urls'),
      '#default_value' => variable_get('si_exhibition_friendly_website_location', ''),
      '#description' => t('The friendly name gets directly appended.  This is usually "&lt;server&gt;/public/" with the right server.'),
    ),
    'si_exhibition_clear_cache_url' => array(
      '#type' => 'textfield',
      '#title' => t('URL to clear the exhibition cache when publishing the exhibition'),
      '#default_value' => variable_get('si_exhibition_clear_cache_url', ''),
      '#description' => t('This url is called to clear the cache when publishing an exhibition.'),
    ),
    'si_exhibition_agree_before_allowed_public_json' => array(
      '#type' => 'textarea',
      '#title' => t('JSON determining the posting to public agreement'),
      '#default_value' => variable_get('si_exhibition_agree_before_allowed_public_json', ''),
      '#description' => t('JSON to configure the dialog before a user can make an exhibition public'),
      '#attributes' => array(
        'class' => array('validate-json'),
       ),
    ),
    'si_exhibition_configuration_list' => array(
      '#type' => 'markup',
      '#title' => t('List the exhibitions'),
      '#markup' => t($epid_html),
    ),
		'si_exhibition_preview_warning' => array(
		  '#type' => 'textarea',
			'#title' => t('Warning to display in exhibition visibiity settings when preview is enabled and download is disabled for resources'),
			'#default_value' => variable_get('si_exhibition_preview_warning',''),
			'#description' => t('Warning to display when the user saves exhibition visibility settings, enabling the preview but not download'),
		),	
  );
  return system_settings_form($form);
}
