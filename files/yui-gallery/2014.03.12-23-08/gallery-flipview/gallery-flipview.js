YUI.add('gallery-flipview', function(Y) {

var FLICK_MIN_DISTANCE = 15;

Y.FlipView = Y.Base.create('flipview', Y.Widget, [],
{
    initializer: function() {
        this.cb = this.get('contentBox');
        //this.pageCount = this.cb.one('.footer');
    },

    destructor: function() {
    },

    renderUI: function() {
        //var list = this.list = this.cb.one('ul:first-child'), count;
        var count;

        this.pages = this.cb.get('children').filter('.page');

        this.pageWidth = parseInt(this.pages.item(0).getComputedStyle('width'));
        this.pageHeight = parseInt(this.pages.item(0).getComputedStyle('height'));
        this.cb.setStyles({
            width: this.pageWidth,
            height: this.pageHeight
        });

        count = this.pages.size();
        this.pages.each(function(node, idx) {
            //node.setStyles({'z-index' : count - idx});
            if (idx != 0) {
                node.addClass('hidden');
            }
        }, this);

        this.currPageIdx = 0;
    },

    bindUI: function() {
        this.cb.on('flick', function(e) {
            if (e.flick.distance < 0) {
                this.next();
            } else {
                this.prev();
            }
        },
        {
            minDistance: FLICK_MIN_DISTANCE,
            axis: 'x',
            minVelocity: 0,
            preventDefault: true
        }, this);
        
        document.ontouchmove = function(e) {e.preventDefault()};
    },

    next: function() {
        var oldPage, oldPageClone, oldPageClipper,
            newPage, newPageClone, newPageClipper,
            leftFlip, newFlip,
            that = this;

        if ( (this.currPageIdx >= this.pages.size() - 1) || this.flipping ) {
            return;
        }

        this.flipping = true;

        oldPage = this.pages.item(this.currPageIdx);
        newPage = this.pages.item(this.currPageIdx + 1);

        newPage.removeClass('hidden');

        //this.pageCount.set('innerHTML', this.currPageIdx+1);


        // clipper original page to show only half
        oldPageClipper = Y.Node.create('<div class="left-clipper page"></div>').append(oldPage);
        newPageClipper = Y.Node.create('<div class="right-clipper page"></div>').append(newPage);
        newPage.setStyles({'margin-left' : - this.pageWidth/2});
        this.cb.append(oldPageClipper);
        this.cb.append(newPageClipper);

        // cloned page is to show flipping effect
        oldPageClone = oldPage.cloneNode(true);
        newPageClone = newPage.cloneNode(true);
        newPageClone.removeClass('hidden');

        oldPageClone.setStyles({'margin-left' : -this.pageWidth / 2});
        newPageClone.setStyles({'margin-left' : 0});

        leftFlip = Y.Node.create('<div class="right-flip page"></div>').append(oldPageClone);
        leftFlip.setStyles({
            width: this.pageWidth / 2
        });
        leftFlip.appendTo(this.cb);

        newFlip = Y.Node.create('<div class="left-flip page"></div>').append(newPageClone);
        newFlip.setStyles({
            width: this.pageWidth / 2
        });
        newFlip.appendTo(this.cb);

        leftFlip.transition({
            easing: 'ease-in-out',
            duration: this.get('flipDuration'),
            transform: 'rotateY(-180deg)'
        }, function() {
        });

        newFlip.transition({
            easing: 'ease-in-out',
            duration: this.get('flipDuration'),
            transform: 'rotateY(0)'
        }, function() {
            // Ideally this should be sync with leftFlip transition.
            that.currPageIdx ++;

            newPage.setStyles({'margin-left': 0});
            oldPage.addClass('hidden');
            newPage.appendTo(that.cb);
            oldPage.appendTo(that.cb);
            oldPageClipper.remove();
            newPageClipper.remove();
            leftFlip.remove();
            newFlip.remove();

            that.flipping = false;
        });
    },

    prev: function() {
        var oldPage, oldPageClone, oldPageClipper,
            newPage, newPageClone, newPageClipper,
            leftFlip, rightFlip,
            that = this;

        if ( (this.currPageIdx <= 0 ) || this.flipping ) {
            return;
        }

        this.flipping = true;

        oldPage = this.pages.item(this.currPageIdx);
        newPage = this.pages.item(this.currPageIdx - 1);

        newPage.removeClass('hidden');

        //this.pageCount.set('innerHTML', this.currPageId-1);
        
        // clipper original page to show only half
        oldPageClipper = Y.Node.create('<div class="right-clipper page"></div>').append(oldPage);
        newPageClipper = Y.Node.create('<div class="left-clipper page"></div>').append(newPage);
        oldPage.setStyles({'margin-left' : - this.pageWidth/2});
        this.cb.append(oldPageClipper);
        this.cb.append(newPageClipper);

        // cloned page is to show flipping effect
        oldPageClone = oldPage.cloneNode(true);
        newPageClone = newPage.cloneNode(true);
        newPageClone.removeClass('hidden');

        newPageClone.setStyles({'margin-left' : -this.pageWidth / 2});
        oldPageClone.setStyles({'margin-left' : 0});

        leftFlip = Y.Node.create('<div class="right-flip to-left page"></div>').append(newPageClone);
        leftFlip.setStyles({
            width: this.pageWidth / 2
        });
        leftFlip.appendTo(this.cb);

        rightFlip = Y.Node.create('<div class="left-flip to-left page"></div>').append(oldPageClone);
        rightFlip.setStyles({
            width: this.pageWidth / 2
        });
        rightFlip.appendTo(this.cb);

        leftFlip.transition({
            easing: 'ease-in-out',
            duration: this.get('flipDuration'),
            transform: 'rotateY(0deg)'
        }, function() {
        });

        rightFlip.transition({
            easing: 'ease-in-out',
            duration: this.get('flipDuration'),
            transform: 'rotateY(180deg)'
        }, function() {
            // Ideally this should be sync with leftFlip transition.
            that.currPageIdx --;

            newPage.setStyles({'margin-left': 0});
            oldPage.addClass('hidden');
            newPage.appendTo(that.cb);
            oldPage.appendTo(that.cb);
            oldPageClipper.remove();
            newPageClipper.remove();
            leftFlip.remove();
            rightFlip.remove();

            that.flipping = false;
        });
    }
},
{
    NAME: 'flipview',
    ATTRS: {
        flipDuration: {
            value:  0.50
        }
    }
});



}, 'gallery-2012.02.01-21-35' ,{skinnable:false, requires:['base','widget','node','event-flick','transition']});
