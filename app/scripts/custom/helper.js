'use strict';

/** helper functions **/

/* jshint unused:false */

function setTimeList (timeList, start, end) {
    if (start && start.split(':')[1] === '00') {
        timeList.push(start.split(':')[0] + ':30');
    }
    for (var hour = start ? +start.split(':')[0] + 1 : 6; hour <= (end ? end : 23); hour++) {
        if (hour < 10) {
            hour = '0' + hour;
        }
        timeList.push(hour + ':00');
        if(hour !== end) {
            timeList.push(hour + ':30');
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



