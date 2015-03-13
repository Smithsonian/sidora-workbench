<?php
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
  $form = array(
    'si_exhibition_website_location' => array(
      '#type' => 'textfield',
      '#title' => t('The prefix for exhibition links)'),
      '#default_value' => variable_get('si_exhibition_website_location', ''),
      '#description' => t('The Fedora Commons pid will be directly appended to the above, end with / if needed.'),
    ),
  );
  return $form;
}
