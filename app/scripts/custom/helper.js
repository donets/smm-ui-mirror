'use strict';

/** helper functions **/

/* jshint unused:false */

function setTimeList (timeList, start, end) {
    _.clearArray(timeList);
    for (var minutes = 5; minutes <= 55; minutes = minutes + 5) {
        if (start && +start.split(':')[1] < minutes) {
            timeList.push(start.split(':')[0] + ':' + (minutes === 5 ? '0' + minutes : minutes));
        }
    }
    for (var hour = start ? +start.split(':')[0] + 1 : 6; hour <= (end ? end : 23); hour++) {
        if (hour < 10) {
            hour = '0' + hour;
        }
        timeList.push(hour + ':00');
        if(hour !== end) {
            for (var min = 5; min <= 55; min = min + 5) {
                timeList.push(hour + ':' + (min === 5 ? '0' + min : min));
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
    outer.style.msOverflowStyle = 'scrollbar';

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



