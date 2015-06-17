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


        //生成表格 tbody

        var $table = $(".ui-calendar-table");
        var $tBody = $table.find("tbody");
        var $year = $(".ui-calendar-year-box .ui-dropdown-btn");
        var $month = $(".ui-calendar-month-box .ui-dropdown-btn");


        function _initialize() {

            self.update();

            return self;
        }

        this.update = function () {
            _init();
        };

        //初始化
        function _init() {
            _renderTbody();
            _showDate(oDate.getFullYear(), oDate.getMonth());
        }

        //判断是否润年  
        function _isLeapYear(year) {
            if (year % 4 == 0 && year % 100 != 0) {
                return true;
            }
            else {
                if (year % 400 == 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        function _renderTbody() {
            for (var j = 0; j < 6; j++) {
                var oTr = document.createElement('tr');
                for (var k = 0; k < 7; k++) {
                    var oTd = document.createElement('td');
                    $(oTr).append(oTd);
                }
                $($tBody).append(oTr);
            }
            $table.append($tBody);
        }

        function _showDate(year, month) {

            $year.text(oYear);
            $month.text(oMonth);

            //设置当月第一天的星期数
            var aTd = $table.find('td');
            $(aTd).html('');
            //$(aTd).removeClass("current");
            oDate.setFullYear(year);
            oDate.setMonth(month);
            oDate.setDate(1);

            switch (oDate.getDay()) {
                case 0:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 6).html(_showTd(i));
                    }
                    break;
                case 1:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i).html(_showTd(i));
                    }
                    break;
                case 2:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 1).html(_showTd(i));
                    }
                    break;
                case 3:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 2).html(_showTd(i));
                    }
                    break;
                case 4:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 3).html(_showTd(i));
                    }
                    break;
                case 5:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 4).html(_showTd(i));
                    }
                    break;
                case 6:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 5).html(_showTd(i));
                    }
                    break;
            }
        }


        function _showTd(key){
            var dateStr = oYear + '-' + _plusZero(oMonth) + '-' + _plusZero(1 + key);
            var weekend = new Date(dateStr);
            var tdHtml = '<div class="ui-calendar-relative"><a data-date="' + dateStr + '" class="';
            if (key == currentDay - 1) {
                tdHtml += 'ui-calendar-table-today';
            }
            if (weekend.getDay() == 0 || weekend.getDay() == 6) {
                tdHtml += ' ui-calendar-table-weekend';
            }
            tdHtml += '" href="javascript:void(0);"><span class="ui-calendar-daynumber">' + (key + 1) + '</span></a></div>';
            return tdHtml;
        }
        function _plusZero(str) {
            return str < 10 ? '0' + str : str
        }

        //初始化方法
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
