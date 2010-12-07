/*
 * jQuery UI Slides
 *
 * Base class for slideshow and sliding tab widgets
 *
 * Copyright (c) 2010 Ronan Dowling
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 *
 * Depends:
 *	ui.core.js
 */
 
;(function($) {
  $.widget("ui.slides", $.extend({}, {
    _init: function() {
      this._slidesInit();
    },
    _slidesInit: function() {
      this.element.addClass("ui-slides");
      this.element.data('slides', this);
      this.items_index = {};

      this._preInit();
      this._initItems();
      this._initWrappers();
      this._postInit();
      this._initAutoRotate();
      this._start();
    },
    _preInit: function() {},
    _postInit: function() {},
    _start: function() {
      // If there's a hash sent by the browser activate that tab.
      if (window.location.hash && this.items_index[window.location.hash]) {
        this.activate(this.items_index[window.location.hash], {animate: false, bubbleUp: true});
      }
      else {
        this.activate(this.items.eq(0), {animate: false, updaeURL: false});
      }
    },
    _initItems: function() {
      var self = this;
      this.items = $(this.options.items, this.element).data('slides', this).addClass('slides-item');
    },
    _initWrappers: function() {
      var o = this.options;

      //Let's determine the parent's offset/height/width
      this.offset      = o.offset ? o.offset : this._offset();
      this.height      = o.height ? o.height : this._height();
      this.width       = o.width  ? o.width  : this._width();

      this.wrapper     = this.items.eq(0).parent().wrapInner('<div class="slides-wrapper">').children().eq(0).css({position: 'absolute', 'height': this.height});
      this.mask        = this.wrapper.wrap('<div class="slides-mask">').parent().css({position: 'relative', 'height': this.height, 'width': this.width, overflow: 'hidden'});

      this.mask.css('overflow', 'hidden');
      this.mask.css({'height': this.height, 'width': this.width});
      this.wrapper.css({'height': this.height, 'width': this.width * Math.min(o.rowWidth, this.items.length)});
    },
    _initAutoRotate: function() {
      var self = this;
      this.options.paused = false;
      if (this.options.autoRotate) {
        setInterval(function() {
          if (!self.options.paused) {
            self.next();
          }
        }, this.options.autoRotate);
        this.element.hover(
          function() {self.options.paused = true},
          function() {self.options.paused = false}
        );
      }
    },
    destroy: function() {
      this.element
        .removeClass("ui-slides ui-slides-disabled")
        .removeData("slides");
  
      for ( var i = this.items.length - 1; i >= 0; i-- )
        this.items[i].item.removeClass("slides-item");
    },
    _height: function() {
      return this.element.height();
    },
    _width: function() {
      return this.element.width();
    },
    _offset: function() {
      this.element.offset()
    },
    activate: function(item, options) {
      options = options || this.options;

      item = $(item);
      if (item.hasClass('slides-item')) {
        if (!item.hasClass('slides-active')) {
          // Set the active class on the current tab and panel.
          item.siblings().removeClass('slides-active');
          item.addClass('slides-active');
        }
        // Activate all ancestor slides/tab.
        if (options.bubbleUp) {
          this.bubbleUp();
        }
        // Do the actual activation.
        this.itemActivate(item, options || this.options);

        // Update the browser hash.
        if (options.updateURL && (hash = $.data(item.get(0), 'hash'))) {
          window.location.hash = hash;
        }

        // Do the slide callback.
        if (options.complete) {
          options.complete(item);
        }
      }
    },
    next: function(options) {
     options = options || this.options;
     var next = this.items.filter('.slides-active').next();
      if (next.length == 0 && options && options.loop) {
        next = this.items.eq(0);
      }
      this.activate(next, options);
    },
    prev: function(options) {
      options = options || this.options;
      var prev = this.items.filter('.slides-active').prev();
      if (prev.length == 0 && options && options.loop) {
        prev = this.items.eq(this.items.length - 1);
      }
      this.activate(prev, options);
    },
    itemActivate: function(item, options) {},
    bubbleUp: function() {
      this.element.parents('.slides-item').each(function() {
        if (slides = $(this).data('slides')) {
          slides.activate(this, {animate: false});
        }
      });
    },
    hash: function(item) {
      return '#';
    }
  }));

  $.extend($.ui.slides, {
    getter: "serialize toArray",
    eventPrefix: "slide",
    defaults: {
      animate: true,
      duration: 500,
      autoRotate: false,
      loop: false,
      rowWidth: 1000,
      updateURL: true
    }
  });
})(jQuery);


