/*
 * Flow - Ronan Dowling - Gorton Studios
 *
 * Derived from ui.coverflow http://labs.dextrose.com/ 
 *
 * jQuery UI Labs - flow
 * - for experimental use only -
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Depends:
 *  ui.core.js
 *	effects.core.js
 */
;(function($){
  $.widget("ui.flow", {
    _init: function() {
      var self = this;

      this.items = $(this.options.items, this.element).addClass('flow-item').css({position: 'absolute'}).bind("click", function() {
        if (!$(this).is('.active')) {
          self.activate(this);
          return false;
        }
      });

      this.itemWidth = this.itemHeight = 0;
      this.items.each(function() {
        self.itemWidth = Math.max(self.itemWidth, $(this).width());
        self.itemHeight = Math.max(self.itemHeight, $(this).height());
      });

      this.stageWidth = this.element.parent()[0].offsetWidth;

      var h       = this.options.height ? this.options.height : this.itemHeight;
      var w       = this.options.width ? this.options.width : this.stageWidth;

      this.wrapper = this.element.wrapInner('<div class="flow-wrapper">').children().eq(0).css({position: 'absolute', 'height': h});
      this.mask    = this.wrapper.wrap('<div class="flow-mask">').parent().css({position: 'relative', 'height': h, 'width': w, overflow: 'hidden'});


      // Build the bottom pager.
      if (this.items.length > 1) {
        this.pager = $('<div class="slideflow-pager">');
        if (this.options.pager) {
          for (var i = 0; i < this.items.length; i++) {
            (function (index, pager) {
              var hash = self.hash(index);
              var link = $('<a href="' + hash + '" class="flow-pager pager-'+ index +'">'+(index+1)+'</a>').click(function() {
                if (!$(this).is('.active')) {
                  self.activate(index);
                  return false;
                }
              });
              pager.append(link);
            })(i, this.pager);
          }
        }
        if (this.options.prev) {
          this.pager.prepend($('<a class="prev" href="#">' + this.options.prev + '</a>').click(function(){self.activate(self.current-1); return false;}));
        }
        if (this.options.next) {
          this.pager.append($('<a class="next" href="#">' + this.options.next + '</a>').click(function(){self.activate(self.current+1); return false;}));
        }
        $(this.element).after(this.pager);
      }

      // Get the start item from the fragment of the url if applicable.
      this.current = -1;
      var start = this.items.index($(window.location.hash.replace('flow--', '')));

      // Reset all the filter items so that IE can calculate the center properly.
      this.refresh(1, start, -1);
 
      if (start >= 0) {
        this.activate(start, 1);
      }
      else {
        this.current = -1;
        this.moveTo(0, 1);
      }

      //this.element.css("left", self.center(this.current));
    },
    getItem: function(item) {
      return !isNaN(parseInt(item)) ? this.items.eq(parseInt(item)) : item;
    },
    getIndex: function(item) {
      item = !isNaN(parseInt(item)) ? parseInt(item) : this.items.index(item);
      if (item >= 0 && item < this.items.length) {
        item;
      }
      return -1;
    },
    hash: function(item) {
      if (item = this.getItem(item)) {
        return '#flow--' + $(item).attr('id');
      }
      return '#';
    },
    activate: function(item, duration) {
      if (item = this.getItem(item)) {
        // Scoll to the item.
        this.moveTo(item, duration);
        // Update the window location
        // window.location.hash  = this.hash(item);
        // Run the item activation callback.
        if (this.options.callback) {
          this.options.callback(item, this.current, this.previous);
        }

      }
    },
    moveTo: function(item, duration) {
      duration = typeof(duration) == 'undefined' ? this.options.duration : duration;

      item = !isNaN(parseInt(item)) ? parseInt(item) : this.items.index(item);
      if (item >= 0 && item < this.items.length && item != this.current) { 
        this.previous = this.current;
        this.current = item;

        // Update the pager.
        if (this.pager) {
          $('a', this.pager).removeClass('active');
          $('a.pager-' + item, this.pager).addClass('active');
        }

        this.items.removeClass('active').addClass('inactive');
        this.items.eq(item).addClass('active').removeClass('inactive');

        if(typeof(this.previous) == 'undefined' || this.previous == this.current) return false; // Don't animate when clicking on the same item

        var self = this, to = Math.abs(self.previous-self.current) <=1 ? self.previous : self.current+(self.previous < self.current ? -1 : 1);
        $.fx.step.flow = function(fx) {
          self.refresh(fx.now, to, self.current);
        };

        this.wrapper.stop().animate({
          flow: 1,
          left: self.center(this.current)
        }, {
          duration: duration,
          easing: this.options.easing,
          complete: function() {self.refresh(1, to, self.current);} // Make sure the animation completes entirely.
        });
      }
    },
    center: function(item) {
      var pos = -(this.itemWidth * this.options.off_scale * this.options.spacing) * item  + (this.stageWidth / 2) - (this.items.eq(item).width() / 2);
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
        var offset = i * self.itemWidth * self.options.off_scale * self.options.spacing;

        // Add a clearance gap for the larger center item
        var clearance = ((self.itemWidth/2) - ((self.itemWidth/2) * self.options.off_scale)) * self.options.clearance * mod;
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
            this.filters.item(0).Dx = self.itemWidth/2 * (1-scale);
            this.filters.item(0).Dy = self.itemHeight/2 * (1-scale) * (1-angle/2);
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
          if ($(this).attr('id') == 'screen-3-video-outtakes-extended-interviews-test-video-two') {
          }
        }
      });
      
    }
  });

  $.extend($.ui.flow, {
    defaults: {
      on_angle: 0,
      off_angle: .3,
      on_scale: 1.0,
      off_scale: .6,
      off_alpha: .8,
      on_alpha: 1.0,
      clearance: .8,
      spacing: .3,
      duration: 600,
      keyboard: true,
      pager: true,
      prev: '&laquo;',
      next: '&raquo;',
      callback: false,
      easing: "easeOutQuint",
      items: "> *"
    }
  });
  
})(jQuery); 