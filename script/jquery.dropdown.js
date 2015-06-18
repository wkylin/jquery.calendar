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
}(function ($) {

    var pluginName = "wkDropdown",
        defaults = {
            eventType:"click",
            onChange: $.noop()
        };

    function Plugin($container, options) {
        this.options = $.extend({}, defaults, options);
        var self = this;
       
        var $dropdownGroup= $container.find(".ui-dropdown-btn-group");
        var $dropdownMenu = $container.find(".ui-dropdown-menu");
        
        var $dropdownSpan = $container.find(".ui-dropdown-btn span");
        var $dropdownOption = $container.find(".ui-dropdown-option");

        function initialize() {

            self.update();

            return self;
        }

        
        
        this.update = function () {
            init();
        };

        $dropdownGroup.hover(function () {
            $container.addClass("ui-dropdown-hover");
        }, function () {
            $container.removeClass("ui-dropdown-hover");
        });
        
        $dropdownGroup.on("click",function(){
            if($dropdownMenu.is(":visible")){
                $dropdownMenu.hide();
                return false;
            }else{
                $(".ui-dropdown-menu").hide();
                $dropdownMenu.show();
                
                return false;
            }
        });

        $dropdownOption.hover(function(){
            $dropdownOption.removeClass("ui-dropdown-hover");
            $(this).addClass("ui-dropdown-hover");
        },function(){
            $dropdownOption.removeClass("ui-dropdown-hover");
        });

        $dropdownOption.on("click",function(){
            $dropdownOption.removeClass("ui-dropdown-selected");
            $(this).addClass("ui-dropdown-selected");
            $dropdownSpan.text($(this).data("value"));
        });
        
        $(document).on("click",function(){
            $dropdownMenu.hide();
        });
        
        //初始化
        function init() {
           
        }

       
       

        //初始化方法
        return initialize();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin" + pluginName)) {
                $.data(this, "plugin" + pluginName, new Plugin($(this), options));
            }
        });
    };
}));
