// $Id$

/**
 * This will set our initial behavior, by starting up each individual slideshow.
 */
Drupal.behaviors.ssUISlidesSlideflow = function (context) {
  for (var id in Drupal.settings.ssUISlidesSlideflow) {
    $(id+':not(.ssUISlidesSlideflow-processed)', context).each(function() {
      $(this).flow(Drupal.settings.ssUISlidesSlideflow[id]);
    }).addClass('ssUISlidesSlideflow-processed');
  }
}
