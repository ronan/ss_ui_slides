<?php
// $Id$

/**
 * @file
 * Theme & preprocess functions for the SS Views Slideflow module.
 */


function theme_ss_ui_slides_slideflow($view, $options, $rows, $title) {
  $vss_id = $view->name . '-' . $view->current_display;

  $settings = array_merge(
    array(
      'vss_id' => $vss_id,
    ),
    $options['ss_ui_slides_slideflow']
  );

  drupal_add_js(array('ssUISlidesSlideflow' => array('#views_slideshow_slideflow_main_' . $vss_id => $settings)), 'setting');
  drupal_add_js(drupal_get_path('module', 'ss_ui_slides_slideflow') . '/js/ui.core.js', 'theme', 'footer');
  drupal_add_js(drupal_get_path('module', 'ss_ui_slides_slideflow') . '/js/effects.core.js', 'theme', 'footer');
  drupal_add_js(drupal_get_path('module', 'ss_ui_slides_slideflow') . '/js/ui.flow.js', 'theme', 'footer');
  drupal_add_js(drupal_get_path('module', 'ss_ui_slides_slideflow') . '/js/ss_ui_slides_slideflow.js', 'theme', 'footer');


  return '<div id="views_slideshow_slideflow_main_' . $vss_id . '" class="views-slideflow">'. theme('views_view_unformatted', $view, $options, $rows, $title) .'</div>';

}

