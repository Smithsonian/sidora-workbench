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
  $epids = exhibition_config_get_exhibition_pids_for_user('');
  $epid_html = '<table><tr><th>ID</th><th>Label</th><th>Configure</th><th>Link</th><th>Friendly Link</th></tr>';
    foreach($epids as $epid){
      $epid_html .= '<tr>';
      $epid_html .= '<td>'.$epid['pid'].'</td>';
      $epid_html .= '<td>'.$epid['label'].'</td>';
      $epid_html .= '<td><a target="_blank" href ="'.base_path().'exhibition_config/config/'.$epid['pid'].'">Configure</a></td>';
      $epid_html .= '<td><a target="_blank" href ="'.variable_get('si_exhibition_website_location', '').''.$epid['pid'].'">'.variable_get('si_exhibition_website_location', '').$epid['pid'].'</a></td>';
      if ($epid['custom_url']){
        $epid_html .= '<td><a target="_blank" href ="'.
                    variable_get('si_exhibition_friendly_website_location', '').
                    $epid['custom_url'].'">'.
                    variable_get('si_exhibition_friendly_website_location', '').
                    $epid['custom_url'].'</a></td>';
      }else{
        $epid_html .= '<td>None set</td>';
      }
      $epid_html .= '</tr>';
    }
    $epid_html .= '</table>';

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
    'si_exhibition_configuration_list' => array(
      '#type' => 'markup',
      '#title' => t('List the exhibitions'),
      '#markup' => t($epid_html),
    ),
  );
  return system_settings_form($form);
}
