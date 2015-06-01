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
function lowercase_user_admin_settings() {
  global $base_url;
  $form = array(
    'lowercase_user_link' => array(
      '#markup' => l(t('Click to change users to lowercase now.'),$base_url.'/lowercase_user/db_run'),
    ),
  );
  return system_settings_form($form);
}

