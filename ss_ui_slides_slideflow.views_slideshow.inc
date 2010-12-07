<?php
// $Id$

/**
 * @file
 * The default options available with UI.Slideflow.
 */

function ss_ui_slides_slideflow_views_slideshow_modes() {
  $options = array(
    'ss_ui_slides_slideflow' => t('Slideflow'),
  );
  return $options;
}

function ss_ui_slides_slideflow_views_slideshow_option_definition() {
  $options['ss_ui_slides_slideflow'] = array(
    'contains' => array(
      'duration'  => array('default' => 700), //normal
      'on_angle'  => array('default' => 0),
      'off_angle' => array('default' => .3),
      'on_scale'  => array('default' => 1.0),
      'off_scale' => array('default' => .6),
      'off_alpha' => array('default' => .8),
      'on_alpha'  => array('default' => 1.0),
      'clearance' => array('default' => .8),
      'spacing'   => array('default' => .3),
      'pager'     => array('default' => TRUE),
      'prev'      => array('default' => '«'),
      'next'      => array('default' => '»'),
    ),
  );
  return $options;
}

function ss_ui_slides_slideflow_views_slideshow_options_form(&$form, &$form_state, &$view) {
  $fields = array(
    'duration'  => t('Animation duration (ms)'),
    'on_angle'  => t('Angle of active item (0-1)'),
    'off_angle' => t('Angle of inactive items (0-1)'),
    'on_scale'  => t('Scale of active items (0-1)'),
    'off_scale' => t('Scale of inactive items (0-1)'),
    'on_alpha'  => t('Transparency of active items (0-1)'),
    'off_alpha' => t('Transparency of inactive items (0-1)'),
    'clearance' => t('Clearance around active item'),
    'spacing'   => t('Spacing between items'),
    'pager'     => t('Add a numerical pager'),
    'prev'      => t('Previous link text'),
    'next'      => t('Next link text'),
  );
  foreach ($fields as $key => $title) {
    $form['ss_ui_slides_slideflow'][$key] = array(
      '#type' => 'textfield',
      '#title' => $title,
      '#default_value' => $view->options['ss_ui_slides_slideflow'][$key],
    );
    $form['ss_ui_slides_slideflow']['pager']['#type'] = 'checkbox';
  }
}
