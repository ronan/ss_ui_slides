/*
 * jQuery UI Slides Coverflow
 *
 * Coverflow-like slide widget
 *
 * Copyright (c) 2010 Ronan Dowling
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 *
 * Depends:
 *	ui.slides.js
 *	ui.slidetabs.js
 */

(function($) {
  $.widget("ui.slideflow", $.extend({}, $.ui.slidetabs.prototype, {
    _init: function() { 
      this._slidesInit();
    },
    _preInit: function() {
    },
    _postInit: function() {
      this.items.css('position', 'absolute').bind("click", function() {
        self.activate(this);
        return false;
      });
      this._tabsInit();
      this.stageWidth = this.element.parent()[0].offsetWidth;

      this.current = -1;

      // Reset all the filter items so that IE can calculate the center properly.
      this.refresh(1, 1, -1);
    },
    _height: function() {
      return this.items.eq(0).height();
    },
    _width: function() {
      return this.items.eq(0).width();
    },
    _offset: function() {
      this.element.offset()
    },
    itemActivate: function(item, options) {
      this.moveTo(item, options);
    },
    moveTo: function(item, options) {
      duration = this.options.duration;

      if (item != this.current) { 
        this.previous = this.current;
        this.current = item;

        if(typeof(this.previous) == 'undefined' || this.previous == this.current) return false; // Don't animate when clicking on the same item

        var current = this.items.index(this.current);
        var previous = this.items.index(this.current);
        var self = this, to = Math.abs(previous-current) <=1 ? previous : current+(previous < current ? -1 : 1);
        $.fx.step.flow = function(fx) {
          self.refresh(fx.now, to, current);
        };

        var func = (config && options.animate) ? 'animate' : 'css';

        this.wrapper.stop()[func]({
          flow: 1,
          left: self.center(this.current)
        }, {
          duration: duration,
          easing: this.options.easing,
          complete: function() {self.refresh(1, to, current);} // Make sure the animation completes entirely.
        });
      }
    },
    center: function(item) {
      var pos = -(this.width * this.options.off_scale * this.options.spacing) * item  + (this.stageWidth / 2) - (this.items.eq(item).width() / 2);
      return pos;
    },
    refresh: function(state,from,to) {
      var self = this, offset = null;

      this.items.each(function(i) {
        var side = (i == to && from-to < 0 ) ||  i-to > 0 ? "left" : "right";
        var mod = i == to ? (1-state) : ( i == from ? state : 1 );

        var scale = ((1-mod) * self.options.on_scale) + (mod * self.options.off_scale);
        var angle = ((1-mod) * self.options.on_angle) + (mod * self.options.off_angle);
        var alpha = ((1-mod) * self.options.on_alpha) + (mod * self.options.off_alpha);

        angle = (side == "right" ? -angle : angle);

        // Move all the items in based on how much they've been scaled down
        var offset = i * self.width * self.options.off_scale * self.options.spacing;

        // Add a clearance gap for the larger center item
        var clearance = ((self.width/2) - ((self.width/2) * self.options.off_scale)) * self.options.clearance * mod;
        offset += side == "right" ? -clearance : clearance;
 
        // Set the z-index based on distance from the current item.
        var z = self.items.length + (side == "left" ? to-i : i-to);
        // Make sure the previous item stays in front until halfway through the transition.
        z += mod < .5 ? 2 : 0;

        if ($.browser.msie) {
          if (this.filters.length) {
            this.filters.item(0).M11 = scale;
            this.filters.item(0).M12 = 0;
            this.filters.item(0).M21 = angle * scale;
            this.filters.item(0).M22 = scale;
            this.filters.item(0).Dx = self.width/2 * (1-scale);
            this.filters.item(0).Dy = self.height/2 * (1-scale) * (1-angle/2);
            this.filters.item(1).opacity = alpha * 100;
          }
          $(this).css({
            left: offset,
            zIndex: z
          });
        }
        else {
          // Only apply the transform if needed.
          var transform = 'none';
          if (angle != 0 || scale != 1) {
            transform = "matrix(1,"+angle+",0,1,0,0) scale("+scale+")";
          }
          $(this).css({
            webkitTransform: transform,
            MozTransform: transform,
            transform: transform,
            left: offset,
            zIndex: z,
            opacity: alpha
          });
        }
      });
      
    },
    /*
    hash: function(item) {
      return '#' + ($(item).attr('href')).replace(window.location.protocol + '//' + window.location.host, '').replace('#', '');
    }
    */
  }));

  $.extend($.ui.slidetabs, {
    getter: "serialize toArray",
    eventPrefix: "slide",
    defaults: {
      animate: true,
      duration: 500,
      on_angle: 0,
      off_angle: .3,
      on_scale: 1.0,
      off_scale: .6,
      off_alpha: .8,
      on_alpha: 1.0,
      clearance: .8,
      spacing: .3,
    }
  });
})(jQuery);


