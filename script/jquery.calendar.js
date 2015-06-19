;
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery.dropdown'], factory);
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
            todayDate: new Date(),
            beginYear: 2015,
            yearIncrement: 20
        };

    function Plugin($container, options) {
        this.options = $.extend({}, defaults, options);
        var self = this;
        var beginYear = this.options.beginYear;
        var yearIncrement = this.options.yearIncrement;
        var oDate = this.options.todayDate;
        var dayNum = 0;
        var oYear = oDate.getFullYear();
        var oMonth = oDate.getMonth() + 1;
        var oDay = oDate.getDate();
        var maxYear= lastArrItem();

        //日期表格
        var $table = $container.find(".ui-calendar-table");
        var $tBody = $table.find("tbody");
        var $year = $container.find(".ui-calendar-year-box .ui-dropdown-btn span");
        var $month = $container.find(".ui-calendar-month-box .ui-dropdown-btn span");
        var $nextMonth = $container.find(".ui-calendar-next-month");
        var $prevMonth = $container.find(".ui-calendar-prev-month");
        var $backToday = $container.find(".ui-calendar-back-today");

        /**
         * 下拉选择菜单
         * year
         * month
         */
        var $dropdown = $container.find(".ui-calendar-year-box .ui-dropdown,.ui-calendar-month-box .ui-dropdown");
        var $dropdownGroup = $dropdown.find(".ui-dropdown-btn-group");
        var $dropdownMenu = $dropdown.find(".ui-dropdown-menu");
        var $dropdownOption;

        var $dropDownYearMenu = $container.find(".ui-calendar-year-box .ui-dropdown-menu-box");
        var $dropDownMonthMenu = $container.find(".ui-calendar-month-box .ui-dropdown-menu-box");

        function initialize() {
            self.update();
            return self;
        }

        this.update = function () {
            init();
            nextMonth();
            prevMonth();
            backToday();
            dropDown();
            tdClick();
        };

        //初始化
        function init() {
            renderDropdownYear();
            renderDropdownMonth();
            renderTbody();
            showDate(oYear, oMonth, oDate);
        }

        //日期每一天绑定点击事件
        function tdClick(){
            $tBody.find("td:not(:empty)").on("click",function(){
                var $tdDec = $(this).find("a");
                if($tdDec.hasClass("ui-calendar-table-selected")){
                    $tdDec.removeClass("ui-calendar-table-selected");
                }else{
                    $tdDec.addClass("ui-calendar-table-selected");
                }
                
            });
        }
        
        
        //下拉菜单选择日期
        function dropDown() {
            $dropdownGroup.hover(function () {
                $(this).parent(".ui-dropdown").addClass("ui-dropdown-hover");
            }, function () {
                $(this).parent(".ui-dropdown").removeClass("ui-dropdown-hover");
            });

            $dropdownGroup.on("click", function () {
                var $menu = $(this).next(".ui-dropdown-menu");
                if ($menu.is(":visible")) {
                    $menu.hide();
                    return false;
                } else {
                    $(".ui-dropdown-menu").hide();
                    $menu.show();
                    return false;
                }
            });

            $dropdownOption.hover(function () {
                $dropdownOption.removeClass("ui-dropdown-hover");
                $(this).addClass("ui-dropdown-hover");
            }, function () {
                $dropdownOption.removeClass("ui-dropdown-hover");
            });

            $dropdownOption.on("click", function () {
                var type = $(this).data("type");
                var value = $(this).data("value");
                $(this).siblings().removeClass("ui-dropdown-selected");
                $(this).addClass("ui-dropdown-selected");
                var dropdownBtnSpan = $(this).parents(".ui-dropdown").find(".ui-dropdown-btn span");
                dropdownBtnSpan.text($(this).data("value"));

                if (type == "year") {
                    oYear = value;
                    oMonth = $month.text();
                } else {
                    oYear = $year.text();
                    oMonth = value;
                }
                showDate(oYear, oMonth, oDate);
            });

            $(document).on("click", function () {
                $dropdownMenu.hide();
            });
        }

        // 返回今天
        function backToday() {
            $backToday.on("click", function () {
                var dateStr = $(this).data("today");
                var curDates = new Date(dateStr);

                oYear = curDates.getFullYear();
                oMonth = curDates.getMonth() + 1;

                dropdownSelected();

                showDate(curDates.getFullYear(), curDates.getMonth() + 1, curDates);
            });
        }

        //下一个月份
        function nextMonth() {
            $nextMonth.on("click", function () {
                ++oMonth;
                if (oMonth > 12) {
                    oMonth = 1;
                    ++oYear;
                    if(oYear> maxYear){ //不能大于最大年份 12月份
                        oYear = maxYear;
                        oMonth = 12;
                    }
                }
                dropdownSelected();
                showDate(oYear, oMonth, oDate);
            })
        }

        //上一个月份
        function prevMonth() {

            $prevMonth.on("click", function () {
                    --oMonth;
                    if (oMonth < 1) {
                        oMonth = 12;
                        --oYear;
                        if(oYear < beginYear){ //不能小于最小年份 1月份
                            oYear= beginYear;
                            oMonth=1;
                        }
                    }
                dropdownSelected();
                showDate(oYear, oMonth, oDate);
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


        //渲染年份
        function renderDropdownYear() {
            var yearList = [];
            for (var i = 0; i < (yearIncrement + 1); i++) {
                var yearLi = '<li data-value="' + (beginYear + i) + '" data-type="year" class="ui-dropdown-option">' + (beginYear + i) + '年</li>';
                yearList.push(yearLi);
            }
            $(yearList.join("")).appendTo($dropDownYearMenu);
            $dropdownOption = $dropdown.find(".ui-dropdown-option");
            dropdownSelected();
        }

        //渲染月份
        function renderDropdownMonth() {
            var monthList = [];
            for (var i = 1; i <= 12; i++) {
                var monthLi = '<li data-value="' + i + '" data-type="month" class="ui-dropdown-option">' + i + '月</li>';
                monthList.push(monthLi);
            }
            $(monthList.join("")).appendTo($dropDownMonthMenu);
            $dropdownOption = $dropdown.find(".ui-dropdown-option");
            dropdownSelected();
        }


        //渲染日期表格
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

        //渲染日期表格数据
        function showDate(year, month, curDate) {

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
            curDate.setMonth(month - 1);
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


        //日期显示
        function showTd(key) {
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

        //显示选中的年月
        function dropdownSelected() {

            $dropdownOption.removeClass("ui-dropdown-selected");

            $dropdownOption.each(function (i, item) {

                if ($(item).data("type") == "year") {
                    if ($(item).data("value") == oYear) {
                        $(item).addClass("ui-dropdown-selected");
                    }
                } else {
                    if ($(item).data("value") == oMonth) {
                        $(item).addClass("ui-dropdown-selected");
                    }
                }
            });
        }

        //小于10的补前导0
        function plusZero(str) {
            return str < 10 ? '0' + str : str;
        }

        //求最大年份
        function lastArrItem(){
            var arrList=[];
            for (var i = 0; i < (yearIncrement + 1); i++) {
                arrList.push(beginYear+i);
            }
            return arrList[arrList.length-1];
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
