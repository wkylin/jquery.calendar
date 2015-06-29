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
            yearIncrement: 50,
            getUrlStr: "script/date.json",
            editUrlStr: "script/editDate.json",
            deleUrlStr: "script/date.json"
        };

    function Plugin($container, options) {
        this.options = $.extend({}, defaults, options);
        var self = this;
        var beginYear = this.options.beginYear;
        var yearIncrement = this.options.yearIncrement;
        var oDate = this.options.todayDate;
        var dayNum = 0;
        var oYear = oDate.getFullYear();//全局变量 会改变
        var oMonth = oDate.getMonth() + 1; //全局变量 会改变
        var oDay = oDate.getDate();
        var curYear = oDate.getFullYear(); //当前日期，不改变
        var curMonth = oDate.getMonth() + 1;//当前日期，不改变
        var maxYear = lastArrItem();

        //数据接口地址
        var getUrl = this.options.getUrlStr;
        var editUrl = this.options.editUrlStr;
        var deleUrl = this.options.deleUrlStr;

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

        //显示标识后的休节日
        var $calendarInfo = $container.find(".ui-calendar-info");
        var $calendarFeast = $container.find(".ui-calendar-feast");
        var $calendarHoliday = $container.find(".ui-calendar-holiday");
        var $feastList = $calendarFeast.find(".ui-calendar-feast-list");
        var $holidayList = $calendarHoliday.find(".ui-calendar-holiday-list");
    
        
        //标识休/节按钮
        var $signFeast = $container.find(".ui-calendar-sign-feast");
        var $signHoliday = $container.find(".ui-calendar-sign-holiday");
        var isFeastArr = [], isHolidayArr = [];
        var tempArr = [];
        var getDateList = null;

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
            delegateTdClick();
            deleteSigned();
        };


        //初始化
        function init() {

            renderDropdownYear();
            renderDropdownMonth();
            renderDataToday();
            renderTbody();
            showDate(oYear, oMonth, oDate);
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
                    if (oYear > maxYear) { //不能大于最大年份 12月份
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
                    if (oYear < beginYear) { //不能小于最小年份 1月份
                        oYear = beginYear;
                        oMonth = 1;
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
            } else {
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
                    queryAll(getUrl, 6, $(aTd));
                    break;
                case 1:
                    debugger;
                    queryAll(getUrl, 0, $(aTd));
                    
                    break;
                case 2:
                    queryAll(getUrl, 1, $(aTd));
                    break;
                case 3:
                    queryAll(getUrl, 2, $(aTd));
                    break;
                case 4:
                    queryAll(getUrl, 3, $(aTd));
                    break;
                case 5:
                    queryAll(getUrl, 4, $(aTd));
                    break;
                case 6:
                    queryAll(getUrl, 5, $(aTd));
                    break;
            }
        }

        function delegateTdClick(){
            //单元格编辑
            $tBody.delegate("td", "click", function () {
                var $tdDec = $(this).find("a");
                var childrenSize = $tdDec.children().size();

                if (childrenSize == 3) {
                    return;
                }

                if ($tdDec.hasClass("ui-calendar-table-selected")) {
                    $tdDec.removeClass("ui-calendar-table-selected");
                    if (tempArr.length > 0) {
                        tempArr = $.grep(tempArr, function (item) {
                            return item.dateStr == $tdDec.data("date");
                        }, true);
                    }
                } else {
                    $tdDec.addClass("ui-calendar-table-selected");
                    var tempJson = {"dateStr": $tdDec.data("date"), "isHoliday": false, "isFeast": false}
                    tempArr.push(tempJson);
                }
            });
        }
        

        //标识为休息日
        $signFeast.on("click", function () {
            for (var i = 0; i < tempArr.length; i++) {
                tempArr[i].isFeast = true;
            }
            //console.log(tempArr);
            $.ajax({
                url: editUrl,
                type: "POST",
                data: tempArr,
                dataType: "json"
            }).done(function () {
                getUrl = editUrl; //测试使用,开发完成删除
                showDate(oYear, oMonth, oDate);
            });
            tempArr.length = 0;
        });

        //标识为节假日
        $signHoliday.on("click", function () {
            for (var i = 0; i < tempArr.length; i++) {
                tempArr[i].isHoliday = true;
            }
            $.ajax({
                url: editUrl,
                type: "POST",
                data: tempArr,
                dataType:"json"
            }).done(function () {
                getUrl = editUrl; //测试使用,开发完成删除
                showDate(oYear, oMonth, oDate);
            });
            showDate(oYear, oMonth, oDate);
            tempArr.length = 0;
        });


        //查询
        function queryAll(dataUri, index, $aTd) {
            $.ajax({
                url: dataUri,
                type:"POST",
                data:{"dateYear":oYear,"dateMonth":oMonth},
                dataType: "json"
            }).done(function (data) {
                getDateList = data.dateDay;
                _renderText(index, $aTd);
            });
        }

        //渲染休节日文案
        function _renderText(index, $aTd) {

            for (var k = 0; k < dayNum; k++) {

                $aTd.eq(k + index).html(showTd(k));
                var $relative = $aTd.eq(k+index).find("a");

                isFeastArr = $.grep(getDateList, function (value) {
                    return value.isFeast == true;
                });

                isHolidayArr = $.grep(getDateList, function (value) {
                    return value.isHoliday == true;
                });
                
                if (getDateList[k].isHoliday) {
                    $relative.append($('<span class="ui-calendar-table-holiday-sign">休</span>'));
                }
                if (getDateList[k].isFeast) {
                    if (getDateList[k].isHoliday) {
                        $relative.append($('<span class="ui-calendar-holiday-feast-sign">节</span>'));
                    } else {
                        $relative.append($('<span class="ui-calendar-table-feast-sign">节</span>'));
                    }
                }
            }


            //渲染出每月休和节
            showYearAndMoth();

            $feastList.empty();
            $holidayList.empty();
            $calendarInfo.find("p").remove();
            if (isFeastArr.length == 0) {
                $("<p>暂无</p>").appendTo($calendarFeast);
            } else {
                var feastItems = [];
                for (var i = 0; i < isFeastArr.length; i++) {
                    feastItems.push('<li class="ui-calendar-feast-item"><span data-sign="feast" data-date="'+ isFeastArr[i].dateStr +'">' + dateFormatForDot(isFeastArr[i].dateStr) + '</span><i>x</i></li>');
                }
                $(feastItems.join("")).appendTo($feastList);
            }

            if (isHolidayArr.length == 0) {
                $("<p>暂无</p>").appendTo($calendarHoliday);
            } else {
                var holidayItems = [];
                for (var j = 0; j < isHolidayArr.length; j++) {
                    holidayItems.push('<li class="ui-calendar-holiday-item"><span data-sign="holiday" data-date="'+ isHolidayArr[j].dateStr +'">' + dateFormatForDot(isHolidayArr[j].dateStr) + '</span><i>x</i></li>');
                }
                $(holidayItems.join("")).appendTo($holidayList);
            }
        }

        function showYearAndMoth() {
            var $span = $calendarInfo.find("h2 span");
            $span.html(oYear + "年" + oMonth + "月");
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

        //为今天保存data
        function renderDataToday() {
            var todayDate = curYear + "-" + plusZero(curMonth) + "-" + plusZero(oDay);
            $backToday.data("today", todayDate);
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

        //删除已标识的日期
        function deleteSigned(){
            $calendarInfo.delegate("i","click",function(){
                var $span = $(this).prev("span");
                var signType = $span.data("sign");
                var dateItem = $span.data("date");
                $.ajax({
                    url:deleUrl,
                    type:"POST",
                    data:{"date": dateItem,"signType": signType},//与后端开发协商一下传值方式
                    dataType:"json"
                }).done(function(){
                    getUrl = deleUrl;
                    showDate(oYear, oMonth, oDate);
                });
            });
        }
        
        //小于10的补前导0
        function plusZero(str) {
            return str < 10 ? '0' + str : str;
        }

        //日期格式转换
        function dateFormatForDot(Str) {
            var dotStr = Str.replace(/-/g, '.');
            return dotStr.substring(dotStr.indexOf(".") + 1);
        }

        //求最大年份
        function lastArrItem() {
            var arrList = [];
            for (var i = 0; i < (yearIncrement + 1); i++) {
                arrList.push(beginYear + i);
            }
            return arrList[arrList.length - 1];
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
