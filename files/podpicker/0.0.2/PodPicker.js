/*!
 * Pod Picker - A Podcast Timeline Generator
 * https://github.com/RoberMac/PodPicker
 *
 * Copyright (c) 2015 RoberTu <robertu0717@gmail.com>
 * @license MIT
 * @version v0.0.2
 */

;(function (window, document){

    'use strict';

    function PodPicker(container, items, options){

        // init
        this.itemsIndex = 0
        this.preTime = 0
        this.startTimeSet = []

        /**
         * Basic Check
         * throw an error if the parameters is invalid
         **********************************************
         */

        // check `container` parameter
        typeof container === 'undefined'
        ? this.throwError('Pod Picker: `container` parameter is required')
        : container.constructor !== String
            ? this.throwError('Pod Picker: `container` parameter must be an string')
            : container = document.getElementById(container)

        !container
        ? this.throwError('Pod Picker: `container` parameter is not related to an existing ID')
        : null

        // check `items` parameter
        typeof items === 'undefined'
        ? this.throwError('Pod Picker: `items` parameter is required')
        : items.constructor !== Array
            ? this.throwError('Pod Picker: `items` parameter must be an array')
            : items.length <= 0
                ? this.throwError('Pod Picker: `items` parameter cannot be an empty array')
                : null

        // check `options` parameter
        typeof options !== 'undefined' && options.constructor !== Object
        ? this.throwError('Pod Picker: `options` parameter must be an object')
        : options = options || {}

        // Sort items array by item object
        var that = this
        items = items.sort(function (pre, next){

            var pre  = that.convertTime(pre.start),
                next = that.convertTime(next.start);

            if (pre > next){
                return 1
            } else if (pre < next){
                return -1
            } else {
                return 0
            }
        })

        // Setup
        this.setup(container, items, options)

    }

    /**
     * Setup
     */
    PodPicker.prototype.setup = function (container, items, options){

        // allow options: 'audioElem', 'timelineColor'
        // check allow options: 'audioElem'
        typeof options.audioElem !== 'undefined'
        ? typeof options.audioElem !== 'string'
            ? this.throwError('Pod Picker: `options.audioElem` must be an string')
            : null
        : null

        // check allow options: 'timelineColor'
        typeof options.timelineColor !== 'undefined'
        ? typeof options.timelineColor !== 'string'
            ? this.throwError('Pod Picker: `options.timelineColor` must be an string')
            : /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(options.timelineColor)
                // via http://stackoverflow.com/a/8027444/3786947
                ? null
                : this.throwError('Pod Picker: `options.timelineColor` must be an hex color')
        : null

        // init options
        var audioElem = options.audioElem
                ? document.getElementById(options.audioElem)
                : document.getElementsByTagName('audio')[0],
            timelineColor = options.timelineColor || '#CECECF',
            that     = this;


        /**
         * Create the timeline element and then append it to `container` element
         ************************************************************************
         */

        /**
         * Check `audioElem` source file, throw error if audio file is MP3 file format
         *
         * For more details, see: 
         *   http://forums.codescript.in/javascript/html5-audio-currenttime-attribute-inaccurate-27606.html
         *   https://jsfiddle.net/yp3o8cyw/2/
         *
         */
        var currentSrcInterval = setInterval(function (){
            var currentSrc = audioElem.currentSrc
            if (currentSrc){
                clearInterval(currentSrcInterval)
                currentSrc.match(/\.mp3/i)
                    ? that.throwError('Pod Picker: does not support MP3 file format')
                    : createTimeline()
            }
        }, 10)

        function createTimeline(){
            var fragment = document.createDocumentFragment(''),
                timeline = document.createElement('div'),
                pointer  = document.createElement('span'),
                ul       = document.createElement('ul'),
                len      = items.length;

            for (var i = 0; i < len; i++){

                var item  = document.createElement('li'),
                    span  = document.createElement('span'),
                    start = that.convertTime(items[i].start);

                // Extract all `item` start time and then push it to `that.startTimeSet`
                that.startTimeSet.push(start)

                // Register event handlers to `item` element
                ;(function (_item, index, start){
                    // Jump to certain time offsets in `audioElem` when user click the item > span element
                    _item.addEventListener('click', function (){
                        audioElem.pasued
                        ? audioElem.play()
                        : null
                        audioElem.currentTime = start
                        audioElem.play()
                        that.setPointerPosition(false, index, true)
                    })

                    // set pointer position to current mouseenter item
                    _item.addEventListener('mouseenter', function (){
                        that.setPointerPosition(false, index)
                    })
                })(span, i + 1, start)

                item.className = 'pp-item'
                span.appendChild(document.createTextNode(items[i].title))
                item.appendChild(span)
                ul.appendChild(item)
            }

            // Register event handlers to `timeline` element
            timeline.addEventListener('mouseleave', function (){
                // reset pointer position
                that.setPointerPosition(true)
            })

            // Register event handlers to `audioElem` element
            audioElem.addEventListener('timeupdate', function (){
                // init
                var currentTime  = audioElem.currentTime,
                    startTimeSet = that.startTimeSet,
                    len          = startTimeSet.length;

                if (Math.abs(that.preTime - currentTime) > 1){
                    // user-triggered
                    for (var i = 0; i < len; i++){
                        currentTime > startTimeSet[i]
                        ? that.setPointerPosition(false, i + 1, true)
                        : null
                    }
                } else {
                    // auto-triggered
                    for (var i = 0; i < len; i++){
                        currentTime > startTimeSet[i] - 1 
                            && currentTime <= startTimeSet[i] + 1 
                            && that.itemsIndex !== i + 1
                        ? that.setPointerPosition(false, i + 1, true)
                        : null
                    }
                }

                that.preTime = currentTime
            })

            ul.style.color = timelineColor
            pointer.id = 'pp-pointer'
            timeline.id = 'pp-timeline'
            timeline.appendChild(ul)
            timeline.appendChild(pointer)
            fragment.appendChild(timeline)
            container.appendChild(fragment)
        }

    }

    /**
     * Set or reset timeline pointer position
     */
    PodPicker.prototype.setPointerPosition = function (isResetPosition, index, isSetItemsIndex){

        var item       = document.getElementsByClassName('pp-item'),
            pointer    = document.getElementById('pp-pointer'),
            item_h     = item[0].offsetHeight,
            item_len   = item.length;

        if (isSetItemsIndex){
            // Set timeline pointer position
            this.itemsIndex = index
            // Set timeline section style
            item[index - 1].children[0].className = 'currentSection'
            for (var i = 0; i < item_len; i++){
                i !== index - 1
                ? item[i].children[0].className = ''
                : null
            }
        }

        pointer.style.top = isResetPosition
                            ? this.itemsIndex === 0
                                ? '0px' // before play
                                : (this.itemsIndex * item_h - item_h / 2 - 6) + 'px'
                            : (index * item_h - item_h / 2 - 6) + 'px'

    }

    /**
     * Convert time string to seconds
     */
    PodPicker.prototype.convertTime = function(timeString){

        // check time string
        /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/.test(timeString)
        // via http://stackoverflow.com/a/8318367/3786947
        ? null
        : this.throwError('Pod Picker: `start` time string must be "hh:mm:ss", "mm:ss" or "ss" format')

        var timeArray = timeString.split(':'),
            len = timeArray.length;

        switch (len){

            case 1: 
                return timeArray[0] * 1
                break;
            case 2:
                return timeArray[0] * 60 + timeArray[1] * 1
                break;
            case 3:
                return timeArray[0] * 60 * 60 + timeArray[1] * 60 + timeArray[2] * 1
                break;
            default:
                this.throwError('Pod Picker: `start` time string must be "hh:mm:ss", "mm:ss" or "ss" format')
        }

    }

    /**
     * Throw Error
     */
    PodPicker.prototype.throwError = function (error_string){
        throw new Error(error_string)
    }


    // Browser globals
    if (!window.PodPicker){
        window.PodPicker = PodPicker;
    }

})(window, document);