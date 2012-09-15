/**
 * Emulate mouseEnter / mouseLeave for webkit.
 */
(function (win, doc, exports) {

    'use strict';

    /**
     * Emulate mouse enter and leave.
     * @constructor
     * @param {Elemenet} el A target element.
     * @param {string} eventName Watching event name.
     * @param {Function} callback The callback.
     * @param {Object=} attr The attribute.
     * @example
     *   var evt  = new EmulateLeaveEnter(el, 'enter', function (e) {...});
     *   var evt2 = new EmulateLeaveEnter(el, 'leave', function (e) {...});
     */
    function EmulateLeaveEnter(el, eventName, callback, attr) {
        this.init.apply(this, arguments);
    }

    EmulateLeaveEnter.prototype = {
        
        /**
         * Initialize
         * @param {Elemenet} el A target element.
         * @param {string} eventName Watching event name.
         * @param {Function} callback The callback.
         */
        init: function (el, eventName, callback, attr) {
        
            eventName = eventName.toLowerCase();
            attr || (attr = {});

            var methodType = {
                    'enter': 'setOver_',
                    'leave': 'setOut_'
                };

            this.el_ = el;
            this.eventName_ = eventName;
            this.callback_ = callback;

            if (attr.auto) {
                this[methodType[eventName]]();
            }
        },
        getDesendants_: function (el) {
            return [].slice.call(el.querySelectorAll('*'));
        },
        doOver: function (e) {

            var el = this.el_,
                desendants = this.getDesendants_(el),
                related = e.relatedTarget || e.fromElement;

            if (desendants.indexOf(related) === -1 && related !== el) {
                this.onEnter_(e);
            }
        },
        doOut: function (e) {

            var el = this.el_,
                desendants = this.getDesendants_(el),
                par = el.parentNode,
                related = e.relatedTarget || e.toElement;

            while (par) {
                if (par === related) {
                    this.onLeave_(e);
                    return true;
                }
                par = par.parentNode;
            }

            if (related !== el && desendants.indexOf(related) === -1) {
                this.onLeave_(e);
            }
        },
        setOver_: function () {
            this.el_.addEventListener('mouseover', this.doOver.bind(this), false);
        },
        setOut_: function () {
            this.el_.addEventListener('mouseout', this.doOut.bind(this), false);
        },

        /**
         * @param {Event} e Event object.
         */
        onLeave_: function (e) {
            this.fire_('leave', e);
        },

        /**
         * @param {Event} e Event object.
         */
        onEnter_: function (e) {
            this.fire_('enter', e);
        },

        /**
         * Fire the callback if eventType same this.eventName_.
         * @param {string} eventType, The event type.
         * @param {Event} e Event object.
         */
        fire_: function (eventType, e) {
            if (this.checkType_(eventType)) {
                if (({}).toString.call(this.callback_) === '[object Function]') {
                    this.callback_(e);
                }
            }
        },

        /**
         * @param {string} type The type.
         * @return {boolean} return true if eventName_ is type.
         */
        checkType_: function (type) {
            return this.eventName_ === type;
        }
    };
    EmulateLeaveEnter.prototype.constructor = EmulateLeaveEnter;

    /*! -----------------------------------------
        EXPORTS
    --------------------------------------------- */
    exports.EmulateLeaveEnter = EmulateLeaveEnter;

}(window, document, window));
