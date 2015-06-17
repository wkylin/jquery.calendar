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

    var pluginName = "wkCalendar",
        defaults = {
            todayDate: new Date()
        };

    function Plugin($container, options) {
        this.options = $.extend({}, defaults, options);
        var self = this;
        var oDate = this.options.todayDate;
        var dayNum = 0;
        var oYear = oDate.getFullYear();
        var oMonth = oDate.getMonth() + 1;
        var oDay = oDate.getDate();

        var currentYear = oDate.getFullYear();
        var currentMonth = oDate.getMonth() + 1;
        var currentDay = oDate.getDate();

        //判断月份的天数
        if (oMonth == 1 || oMonth == 3 || oMonth == 5 || oMonth == 7 || oMonth == 8 || oMonth == 10 || oMonth == 12) {
            dayNum = 31;
        }
        else if (oMonth == 4 || oMonth == 6 || oMonth == 9 || oMonth == 11) {
            dayNum = 30;
        }
        else if (oMonth == 2 && _isLeapYear(oYear)) {
            dayNum = 29;
        }
        else {
            dayNum = 28;
        }

        function _initialize() {

            self.update();
            
            return self;
        }

        this.update= function(){
            _init();
        };
        
        //初始化
        function _init(){
            
            console.log(dayNum);
        }

        //判断是否润年  
        function _isLeapYear(year) {
            if (year % 4 == 0 && year % 100 != 0) {
                return true;
            }
            else {
                if (year % 400 == 0) {
                    return true;
                }else {
                    return false;
                }
            }
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
