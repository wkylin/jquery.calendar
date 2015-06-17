$(function() {
    var oDate = new Date();
    var dayNum = 0;
    var oYear = oDate.getFullYear();
    var oMonth = oDate.getMonth() + 1;
    var oDay = oDate.getDate();

    var currentYear = oDate.getFullYear();
    var currentMonth = oDate.getMonth() + 1;
    var currentDay = oDate.getDate();

    var bBtn = true;//开关
    //生成主体框架
    $("#data-con").append('<div class="data-header"><div class="prev-mon"><</div><div class="next-mon">></div><div class="current-mon"><span class="year"></span>年<span class="month"></span>月</div></div>');
    $("#data-con").append('<table cellpadding="0" cellspacing="0"><thead><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></thead><tbody></tbody></table>');

    //判断月份的天数
    if (oMonth == 1 || oMonth == 3 || oMonth == 5 || oMonth == 7 || oMonth == 8 || oMonth == 10 || oMonth == 12) {
        dayNum = 31;
    }
    else if (oMonth == 4 || oMonth == 6 || oMonth == 9 || oMonth == 11) {
        dayNum = 30;
    }
    else if (oMonth == 2 && isLeapYear(year)) {
        dayNum = 29;
    }
    else {
        dayNum = 28;
    }
    //生成td
    for (var i = 0; i < 7; i++) {
        var oTbody = $("#data-con").find("tbody");
        for (var i = 0; i < 6; i++) {
            var oTr = document.createElement('tr');
            for (var j = 0; j < 7; j++) {
                var oTd = document.createElement('td');
                $(oTr).append(oTd);
            }
            $(oTbody).append(oTr);
        }
        $("#data-con").find("table").append(oTbody);

    }

    //插入日期
    function showDate(year, month) {
        //判断是否润年  
        function isLeapYear(year) {
            if (year % 4 == 0 && year % 100 != 0) {
                return true;
            }
            else {
                if (year % 400 == 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        $(".year").text(oYear);
        $(".month").text(oMonth);

        //设置当月第一天的星期数
        var aTd = $("#data-con").find('td');
        $(aTd).text('');
        $(aTd).removeClass("current");
        oDate.setFullYear(year);
        oDate.setMonth(month - 1);
        oDate.setDate(1);
        switch (oDate.getDay()) {
            case 0:
                for (var i = 0; i < dayNum; i++) {
                    $(aTd).eq(i + 6).text(i + 1);
                }
                break;
            case 1:
                for (var i = 0; i < dayNum; i++) {
                    $(aTd).eq(i).text(i + 1);
                }
                break;
            case 2:
                for (var i = 0; i < dayNum; i++) {
                    $(aTd).eq(i + 1).text(i + 1);
                }
                break;
            case 3:
                for (var i = 0; i < dayNum; i++) {
                    $(aTd).eq(i + 2).text(i + 1);
                }
                break;
            case 4:
                for (var i = 0; i < dayNum; i++) {
                    $(aTd).eq(i + 3).text(i + 1);
                }
                break;
            case 5:
                for (var i = 0; i < dayNum; i++) {
                    $(aTd).eq(i + 4).text(i + 1);
                }
                break;
            case 6:
                for (var i = 0; i < dayNum; i++) {
                    $(aTd).eq(i + 5).text(i + 1);
                }
                break;
        }
    }
    showDate(oDate.getFullYear(), oDate.getMonth() + 1);//初始化日期
    
    
    //下一月
    $(".next-mon").on("click", function() {
        ++oMonth;
        if (oMonth > 12) {
            oMonth = 1;
            ++oYear;
            $(".year").text(oYear);
        }
        $(".month").text(oMonth);
        showDate(oYear, oMonth);


        if (oYear >= currentYear) {
            if (oMonth >= currentMonth) {
                $("#data-con").find('td').removeClass("disable");
            }
            if (oYear == currentYear && oMonth == currentMonth) {
                for (var i = 0; i < $("#data-con").find('td').length; i++) {
                    if ($("#data-con").find('td').eq(i).text() == currentDay) {
                        $("#data-con").find('td').eq(i).addClass("current");
                    }
                    if ($("#data-con").find('td').eq(i).text() < currentDay) {
                        $("#data-con").find('td').eq(i).addClass("disable");
                    }
                }
            }
        }
        if ($("#data-con").find(".select-box").length) {

            $("#select-box").hide()
        };
		

    });

    //上一月
    $(".prev-mon").on("click", function() {
        --oMonth;
        if (oMonth < 1) {
            oMonth = 12;
            --oYear;
            $(".year").text(oYear);
        }
        $(".month").text(oMonth);
        showDate(oYear, oMonth);


        if (oYear == currentYear) {
            if (oMonth < currentMonth) {
                $("#data-con").find('td').addClass("disable");
            }

            if (oMonth == currentMonth) {
                for (var i = 0; i < $("#data-con").find('td').length; i++) {
                    if ($("#data-con").find('td').eq(i).text() == currentDay) {
                        $("#data-con").find('td').eq(i).addClass("current");
                    }
                    if ($("#data-con").find('td').eq(i).text() < currentDay) {
                        $("#data-con").find('td').eq(i).addClass("disable");
                    }
                }
            }
        }
        if ($("#data-con").find(".select-box").length) {

            $("#select-box").hide()
        }
		
    });

    //当前日期样式
    function showStyle(currentYear, currentMonth) {
        var aTd = $("#data-con").find('td');
        for (var i = 0; i < $(aTd).length; i++) {
            if (currentYear == $(".year").text() && currentMonth == $(".month").text()) {
                if ($(aTd).eq(i).text() == oDay) {
                    $(aTd).eq(i).addClass("current");
                }
            }
            if (currentYear == $(".year").text() && currentMonth >= $(".month").text()) {
                if ($(aTd).eq(i).text() < oDay) {
                    $(aTd).eq(i).addClass("disable");
                }
            }
        }
		console.log(currentYear);
		console.log(currentMonth);
		
    }
    showStyle(oDate.getFullYear(), oDate.getMonth() + 1);

    function tdClick() {
        var aTd = $("#data-con").find('td');
        $(aTd).on("click", function(event) {
            if($(this).hasClass("disable")){

            }
            else{

            var _month = $(".month").text();
            var _start= $(this).parent("tr").find(".disable").length;


            if($(this).parent("tr").find("td").eq(0).text()==''){
                var _length=$(this).parent("tr").find("td").length;
                var _jj=1;
                for(var i=0; i<_length; i++){
                    if($(this).parent("tr").find("td").eq(i).text()==''){
                        _jj++;
                    }
                }
                _start=_jj-1;
            }
            var _day = parseInt($(this).parent("tr").find("td").eq(_start).text());
            console.log(_day)
            var _weekday=["一","二","三","四","五","六","日"]
            $("div").remove(".select-box");
            if ($("#data-con").find(".select-box").length) {
            }
            else {
                $("#data-con").append('<div class="select-box" id="select-box"><div class="select-tit">选项<div class="close-btn" id="close">×</div></div><ul id="select-list"></ul></div>');
                var _html = '';
                for (var i = _start; i < 7; i++) {
                    _html += '<li><div class="day-time"><div class="day">' + _month + '月<span class="sDay">' + (_day++) + '</span>日</div><div class="weekday">星期'+_weekday[i]+'</div></div><div class="select"><button type="button" class="select-btn abled" data-val="'+i+'">abled</button>&nbsp;<button type="button" class="select-btn disabled" data-val="'+i+'">disabled</button></div></li>'
                    if((_day)>dayNum){
                        break;
                    }

                }
                $("#select-list").append(_html);
            }
            event.stopPropagation();
            }
        });
    }
    tdClick();

    $("#data-con").on("click", "#close", function() {
        $("div").remove(".select-box");
    });

    $(document).on("click",function(){
        $("div").remove(".select-box");
    });

    $("#data-con").on("click",".abled",function(event){
        var _index=$(this).attr("data-val");
        var _target=$("#data-con").find("li").eq(_index).find("span").text();
        var aTd = $("#data-con").find('td');
        for (var i = 0; i < $(aTd).length; i++) {
            if ($(aTd).eq(i).text()==_target) {
                $(aTd).eq(i).removeClass("disable");
                $(aTd).eq(i).addClass("hover");
            }  
        }

        event.stopPropagation();
    })

    $("#data-con").on("click",".disabled",function(event){
        var _index=$(this).attr("data-val");
        var _target=$("#data-con").find("li").eq(_index).find("span").text();
        var aTd = $("#data-con").find('td');
        for (var i = 0; i < $(aTd).length; i++) {
            if ($(aTd).eq(i).text()==_target) {
                $(aTd).eq(i).removeClass("hover");
                $(aTd).eq(i).addClass("disable");
            }  
        }
        event.stopPropagation();
    })


})
