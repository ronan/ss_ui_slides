(function($) {
  $.widget("ui.slidetabs", $.extend({}, $.ui.slides.prototype, {
    _init: function() { 
      this._slidesInit();
    },
    _postInit: function() {
      this.items.css('float', 'left');
      this._tabsInit();
    },
    _tabsInit: function() {
      var o = this.options;
      var self = this;
      this.tab_index = {};

      if (o.tabs) {
        // Build a pager or find the preexisting tabs.
        if (o.tabs == 'pager') {
          this.tabs = this._buildPager();
        }
        else {
          this.tabs = $(o.tabs, this.element);
        }
        this.tabs.each(function(index) {
          var panel = self.items.eq(index);
          var hash = '';
          if (this.href) {
            hash = self.hash(this);
          }
          if (hash) {
            this.href = hash;
            self.items_index[hash] = panel;
            self.tab_index[hash] = this;
            this.item = panel;
            $.data(panel.get(0), 'tab', $(this));
            $.data(panel.get(0), 'hash', hash);
          }
          $(this).addClass('slidetab-tab').click(function() {
            self.activate(panel);
            return false;
          });
        });
      }
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
    _buildPager: function() {
      var self = this;
      // Build the bottom pager.
      if (this.items.length > 1) {
        this.pager = $('<div class="slidetabs-pager">');
        for (var i = 1; i <= this.items.length; i++) {
          (function (index, pager) {
            var link = $('<a href="#' + index + '" class="slidetabs-pager-link slidetabs-pager-link-' + index + '">' + index + '</a>');
            pager.append(link);
          })(i, this.pager);
        }
        if (this.options.prevnext) {
          this.pager.prepend($('<a class="slidetabs-pager-prev" href="#">«</a>').click(function(){self.prev(); return false;}));
          this.pager.append($('<a class="slidetabs-pager-next" href="#">»</a>').click(function(){self.next(); return false;}));
        }
        $(this.element).append(this.pager);
        return this.pager.find('.slidetabs-pager-link');
      }
      return $;
    },
    itemActivate: function(item, config) {
      var func = (config && config.animate) ? 'animate' : 'css';

      //Resize the height and left pos
      var position = item.position();
      this.wrapper[func]({left: -position.left, top: -position.top}, $.extend({}, config.scrollSettings));
      this.mask[func]({height: item.height()}, $.extend({}, config.resizeSettings));

      this.tabs.removeClass('active');
      $($.data(item.get(0), 'tab')).addClass('active');
    },
    hash: function(item, base_path) {
      base_path = base_path || window.location.pathname;
      return '#' + ($(item).attr('href')).replace(window.location.protocol + '//' + window.location.host, '').replace(base_path, '').replace('#', '');
    }
  }));

  $.extend($.ui.slidetabs, {
    getter: "serialize toArray",
    eventPrefix: "slide",
    defaults: $.extend({}, $.ui.slides.defaults, {
      animate: true,
      duration: 500,
      rowWidth: 1000,
      scrollSettings: {'duration': 500, 'axis': 'xy'},
      resizeSettings: {'duration': 500},
      prevnext: false
    })
  });
})(jQuery);


