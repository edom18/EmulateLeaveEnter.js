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
     * @example
     *   var evt  = new EmulateLeaveEnter(el, 'enter', function (e) {...});
     *   var evt2 = new EmulateLeaveEnter(el, 'leave', function (e) {...});
     */
    function EmulateLeaveEnter(el, eventName, callback) {
        this.init.apply(this, arguments);
    }

    EmulateLeaveEnter.prototype = {
        
        /**
         * Initialize
         * @param {Elemenet} el A target element.
         * @param {string} eventName Watching event name.
         * @param {Function} callback The callback.
         */
        init: function (el, eventName, callback) {
        
            this.el_ = el;
            this.eventName_ = eventName;
            this.callback_ = callback;

            this.setOver_();
            this.setOut_();
        },
        setOver_: function () {

            var self = this,
                el = this.el_;

            el.addEventListener('mouseover', function (e) {

                var desendants = [].slice.call(el.querySelectorAll('*')),
                    related = e.relatedTarget || e.fromElement;

                if (desendants.indexOf(related) === -1 && related !== el) {
                    self.onEnter_(e);
                }
            }, false);

        },
        setOut_: function () {

            var self = this,
                el = this.el_;

            el.addEventListener('mouseout', function (e) {

                var desendants = [].slice.call(el.querySelectorAll('*')),
                    par = el.parentNode;

                while (par) {
                    if (par === e.relatedTarget) {
                        self.onLeave_(e);
                        return true;
                    }
                    par = par.parentNode;
                }

                if (e.relatedTarget !== el && desendants.indexOf(e.relatedTarget) === -1) {
                    self.onLeave_(e);
                }
            }, false);
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

}(window, document, window));
