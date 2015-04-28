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

String.prototype.csvToArray = function (o) {
    var od = {
        'fSep': ',',
        'rSep': '\r\n',
        'quot': '"',
        'head': false,
        'trim': false
    }
    if (o) {
        for (var i in od) {
            if (!o[i]) o[i] = od[i];
        }
    } else {
        o = od;
    }
    var a = [
        ['']
    ];
    for (var r = 0, f = 0, p = 0, q = 0; p < this.length; p++) {
        var c;
        switch (c = this.charAt(p)) {
            case o.quot:
                if (q && this.charAt(p + 1) == o.quot) {
                    a[r][f] += o.quot;
                    ++p;
                } else {
                    q ^= 1;
                }
                break;
            case o.fSep:
                if (!q) {
                    if (o.trim) {
                        a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    }
                    a[r][++f] = '';
                } else {
                    a[r][f] += c;
                }
                break;
            case o.rSep.charAt(0):
                if (!q && (!o.rSep.charAt(1) || (o.rSep.charAt(1) && o.rSep.charAt(1) == this.charAt(p + 1)))) {
                    if (o.trim) {
                        a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    }
                    a[++r] = [''];
                    a[r][f = 0] = '';
                    if (o.rSep.charAt(1)) {
                        ++p;
                    }
                } else {
                    a[r][f] += c;
                }
                break;
            default:
                a[r][f] += c;
        }
    }
    if (o.head) {
        a.shift()
    }
    if (a[a.length - 1].length < a[0].length) {
        a.pop()
    }
    return a;
};

_.mixin({
    clearArray: function(array) {
        while (array.length > 0) {
            array.pop();
        }
    }
});



