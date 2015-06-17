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


        //生成表格 tbody
        var $table = $container.find(".ui-calendar-table");
        var $tBody = $table.find("tbody");
        var $year = $container.find(".ui-calendar-year-box .ui-dropdown-btn");
        var $month = $container.find(".ui-calendar-month-box .ui-dropdown-btn");
        var $nextMonth = $container.find(".ui-calendar-next-month");
        var $prevMonth = $container.find(".ui-calendar-prev-month");
        var $backToday = $container.find(".ui-calendar-back-today");

        function initialize() {

            self.update();

            return self;
        }

        
        
        this.update = function () {
            init();
        };

        //初始化
        function init() {
            renderTbody();
            showDate(oYear, oMonth,oDate);
            nextMonth();
            prevMonth();
            backToday()
        }

       
        // 返回今天
        function backToday(){
            $backToday.on("click",function(){
                var dateStr= $(this).data("today");
                var curDates = new Date(dateStr);
                
                oYear = curDates.getFullYear();
                oMonth = curDates.getMonth()+1;
                showDate(curDates.getFullYear(), curDates.getMonth()+1, curDates);
            });
        }
        //下一个月份
        function nextMonth(){
            $nextMonth.on("click",function(){
                ++oMonth;
                if (oMonth > 12) {
                    oMonth = 1;
                    ++oYear;
                }

                showDate(oYear, oMonth, oDate);
            })
        }
        
        //上一个月份
        function prevMonth(){
            $prevMonth.on("click", function () {
                --oMonth;
                if (oMonth < 1) {
                    oMonth = 12;
                    --oYear;
                }
                showDate(oYear, oMonth,oDate);
            });
            
        }
        
        //判断是否润年  
        function isLeapYear(year) {
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

        function renderTbody() {
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

        function showDate(year, month,curDate) {
            
            $year.text(year);
            $month.text(month);

            //判断月份的天数
            if (oMonth == 1 || oMonth == 3 || oMonth == 5 || oMonth == 7 || oMonth == 8 || oMonth == 10 || oMonth == 12) {
                dayNum = 31;
            }
            else if (oMonth == 4 || oMonth == 6 || oMonth == 9 || oMonth == 11) {
                dayNum = 30;
            }
            else if (oMonth == 2 && isLeapYear(oYear)) {
                dayNum = 29;
            }
            else {
                dayNum = 28;
            }
            
            
            //设置当月第一天的星期数
            var aTd = $table.find('td');
            $(aTd).html('');

            curDate.setFullYear(year);
            curDate.setMonth(month-1);
            curDate.setDate(1);

  
            switch (curDate.getDay()) {
                case 0:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 6).html(showTd(i));
                    }
                    break;
                case 1:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i).html(showTd(i));
                    }
                    break;
                case 2:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 1).html(showTd(i));
                    }
                    break;
                case 3:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 2).html(showTd(i));
                    }
                    break;
                case 4:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 3).html(showTd(i));
                    }
                    break;
                case 5:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 4).html(showTd(i));
                    }
                    break;
                case 6:
                    for (var i = 0; i < dayNum; i++) {
                        $(aTd).eq(i + 5).html(showTd(i));
                    }
                    break;
            }
        }


        function showTd(key){
            var dateStr = oYear + '-' + plusZero(oMonth) + '-' + plusZero(1 + key);
            var weekend = new Date(dateStr);
            var tdHtml = '<div class="ui-calendar-relative"><a data-date="' + dateStr + '" class="';
            if (key == oDay - 1) {
                tdHtml += 'ui-calendar-table-today';
            }
            if (weekend.getDay() == 0 || weekend.getDay() == 6) {
                tdHtml += ' ui-calendar-table-weekend';
            }
            tdHtml += '" href="javascript:void(0);"><span class="ui-calendar-daynumber">' + (key + 1) + '</span></a></div>';
            return tdHtml;
        }
        function plusZero(str) {
            return str < 10 ? '0' + str : str;
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
