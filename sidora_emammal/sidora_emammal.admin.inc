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
function sidora_emammal_admin_settings() {
  $form = array(
    'sidora_emammal_wi_base_url' => array(
      '#type' => 'textfield',
      '#title' => t('Base URL for the Wildlife Insights'),
      '#description' => t('API URL where operations are directly appened. Typically ends with /, example: ').'https://staging.api.wildlifeinsights.org/api/v1/',
      '#default_value' => variable_get('sidora_emammal_wi_base_url', ''),
    ),
    'sidora_emammal_wi_token_url' => array(
      '#type' => 'textfield',
      '#title' => t('Sign-In Token URL for Wildlife Insights'),
      '#description' => t('Full URL for the WI token, example (note the URL does not contain "api"): ').'https://staging.api.wildlifeinsights.org/v1/auth/sign-in',
      '#default_value' => variable_get('sidora_emammal_wi_token_url', ''),
    ),
    'sidora_emammal_wi_sign_in' => array(
      '#type' => 'textarea',
      '#title' => t('Sign-In JSON Data for Wildlife Insights'),
      '#description' => t('Full JSON used for sign-in, example: {"email":"sample@email.com","password":"1234"}'),
      '#default_value' => variable_get('sidora_emammal_wi_sign_in', ''),
    ),
    'sidora_ontology_json' => array(
      '#type' => 'textarea',
      '#title' => t('JSON determining the layout and form choices presented for add new concept'),
      '#default_value' => variable_get('sidora_ontology_json',sidora_ontology_json_default()),
      '#suffix' => '<script>
jQuery("#edit-sidora-ontology-json").on(\'change keyup paste\', function() {
  jQuery("#ontology_json_check").remove();
  try {
    var c = jQuery.parseJSON(jQuery("#edit-sidora-ontology-json").val());
    jQuery("#edit-sidora-ontology-json").after("<div id=\'ontology_json_check\' class=\'status messages\'>Valid</div>");
  }catch (err) {
    jQuery("#edit-sidora-ontology-json").after("<div id=\'ontology_json_check\' class=\'error messages\'>Invalid</div>");
  }
});</script>',
    ),
    'sidora_resource_ontology_json' => array(
      '#type' => 'textarea',
      '#title' => t('JSON determining the layout and form choices presented for add new resource'),
      '#default_value' => variable_get('sidora_resource_ontology_json',sidora_ontology_json_default()),
      '#suffix' => '<script>
jQuery("#edit-sidora-resource-ontology-json").on(\'change keyup paste\', function() {
  jQuery("#resource_ontology_json_check").remove();
  try {
    var c = jQuery.parseJSON(jQuery("#edit-sidora-resource-ontology-json").val());
    jQuery("#edit-sidora-resource-ontology-json").after("<div id=\'resource_ontology_json_check\' class=\'status messages\'>Valid</div>");
  }catch (err) {
    jQuery("#edit-sidora-resource-ontology-json").after("<div id=\'resource_ontology_json_check\' class=\'error messages\'>Invalid</div>");
  }
});</script>',
    ),
  );


  return system_settings_form($form);
}
