(function (win, doc) {

    'use strict';

    var el = doc.getElementById('target');
    var evt  = new EmulateLeaveEnter(el, 'enter', function (e) {
        alert('Enter!');
    });
    var evt2 = new EmulateLeaveEnter(el, 'leave', function (e) {
        alert('Leave!');
    });

    el.addEventListener('mouseover', evt.doOver.bind(evt), false);
    el.addEventListener('mouseout', evt2.doOut.bind(evt2), false);

}(window, document));
