YUI.add('gallery-scroll-nav', function(Y) {

Y.namespace('Plugin').ScrollNav = Y.Base.create('scroll-nav', Y.Plugin.Base, [], {

  initializer : function(config){
    Y.delegate('click', function(e){
      var href = e.currentTarget.getAttribute('href'),
          target, targetY, hash, winH, docH;

      // make sure the link we clicked has a hash and is for this page
      if('#' !== href.substring(0,1)){
        return;
      }

      // if we made it this far let's prevent the link from firing
      e.preventDefault();

      // get the hash from the clicked href
      hash = href.substring(1);

      // find the target with the hash
      if(hash === '') {
        targetY = 0;
      }else{
        // get target
        target = (Y.one('a[name="' + hash + '"]')) ? Y.one('a[name="' + hash + '"]') : Y.one('#' + hash);

        targetY = target.getY();
      }

      if(targetY !== null) {
        // pause the animation if it's running,
        // stopping causes the scroll bar to jump
        if(this.anim && this.anim.get('running')) {
          this.anim.pause();
        }

        // record current window conditions
        winH = Y.DOM.winHeight();
        docH = Y.DOM.docHeight();

        // create the animation and run it
        this.anim = new Y.Anim({
          node: this.get('scroller'),
          to: { // can't scoll to target if it's beyond the doc height - window height
            scroll : [Y.DOM.docScrollX(), Math.min(docH - winH, targetY)]
          },
          duration: this.get('duration'),
          easing: this.get('easing'),
          on : {
            end : function() { location.hash = hash; }
          }
        }).run();
      }
    }, this.get('host'), this.get('selector'), this);
  }
},{
  NS : 'scrollNav',
  ATTRS : {
    easing : {
      value : Y.Easing.easeOutStrong
    },
    duration : {
      value : 1.5
    },
    selector : {
      value : 'a'
    },
    scroller : {
      value : 'window'
    }
  }
});


}, 'gallery-2011.03.11-23-49' ,{requires:['node','event','anim','plugin','base']});
