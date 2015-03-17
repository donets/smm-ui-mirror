'use strict';

/** helper functions **/

/* jshint unused:false */

function setTimeList (timeList, start, end) {
    _.clearArray(timeList);
    for (var minutes = 15; minutes <= 45; minutes = minutes + 15) {
        if (start && +start.split(':')[1] < minutes) {
            console.log(minutes);
            timeList.push(start.split(':')[0] + ':' + minutes);
        }
    }
    for (var hour = start ? +start.split(':')[0] + 1 : 6; hour <= (end ? end : 23); hour++) {
        if (hour < 10) {
            hour = '0' + hour;
        }
        timeList.push(hour + ':00');
        if(hour !== end) {
            for (var min = 15; min <= 45; min = min + 15) {
                timeList.push(hour + ':' + min);
            }
        }
    }
    return (timeList);
}

function setWeekdayList (weekdayList) {
    for (var day = 1; day <= 7; day++) {
        weekdayList.push({ number: day, text: moment().isoWeekday(day).format('dddd') });
    }
    return (weekdayList);
}

function toggleSelection (name, sel) {

    var idx = sel.indexOf(name.id);

    if (idx > -1) {
        sel.splice(idx, 1);
    }

    else {
        sel.push(name.id);
    }

}

function getScrollbarWidth() {
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';

    // add innerdiv
    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

_.mixin({
    clearArray: function(array) {
        while (array.length > 0) {
            array.pop();
        }
    }
});
