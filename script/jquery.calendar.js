/**
 * Created by wangjingang on 2015/6/17.
 */

;
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if (typeof exports === 'object') {
        module.exports = factory(require("jquery"));
    }
    else {
        factory(jQuery);
    }
}
(function ($) {

    var pluginName = "wkCalendar",
        defaults = {
            
        };

    function Plugin($container, options) {
        this.options = $.extend({}, defaults, options);
        var self = this;
        var $viewport = $container.find(".ui-dropdown-menu-inner");

        function _initialize() {

            self.update();
            _init();
            return self;
        }

        this.update= function(){
            console.log("update");
        }
        
        function _init(){
            console.log($viewport.html());
        }
        
        return _initialize();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
            }
        });
    };
}));
