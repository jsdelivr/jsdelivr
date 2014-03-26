YUI.add('gallery-timepicker', function(Y) {

/*
Copyright (c) 2009, Stephen Woods
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Stephen Woods nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY STEPHEN WOODS ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL STEPHEN WOODS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Inspired by: http://haineault.com/media/jquery/ui-timepickr/page/
This software is based on a concept by Maxime Haineault in code licensed under
an MIT license. However, none of his code or implementation details will reviewed
or used for this project.
*/


/**
 * A yui 3 timepicker
 * 
 * @module Timepicker
 * @requires oop, event-custom, attribute, base, dom, classnamemanager, widget, event
 */
 
 
 /**
  * a YUI 3 implementation of the classic jQuery
  * timepicker widget
  * @class Timepicker
  * @namespace Y.Saw
  * @extends Widget
  */

    

var array = Y.Array,
getClassName = Y.ClassNameManager.getClassName,

//repeated and/or magic strings
NAMESPACE   = 'Saw',
CONSTRUCTOR = 'Timepicker',

CELL_CLASS   = 'cell',
HOUR_CLASS   = 'hour',
MINUTE_CLASS = 'minute',
AMPM_CLASS   = 'ampm',
ACTIVE_CLASS = 'active',

NAME        = 'NAME',
ROW         = 'row',
AMSTR_KEY   = 'strings.am',
PMSTR_KEY   = 'strings.pm',

DELAY_KEY   = 'delay',



//constants for AM & PM
AM          = 0,
PM          = 1;


//create the constructor, chain the parent
function Timepicker(config) {
	Timepicker.superclass.constructor.apply(this, arguments); 
     /* the "model", actually a cache of dom refrences to find 
        elements quickly later */
	this._model = {ampm : {},hour : {} , minute : {}};
}

 /* utils */

/**
 * Pad numbers to two digits
 * @protected
 * @method pad
 * @param {Number} num the number to bad
 * @returns {String} padded number as string
 * @type String|Object|Array|Boolean|Number
 */
function pad(num) {
    return (num < 10) ? '0' + num : num;
}

/**
 * Creates a cell based on the little template defined in "str" 
 * @protected
 * @method makeCell
 * @param {String} str The contents of the cell
 * @param {String} rowId the unique classname for the row to identify it later
 *
 * @returns {String} returns the assembled html string
 */

function makeCell(str, rowId){
    var thisClass = getClassName(Timepicker[NAME], Timepicker[str]),
        myStr = '<li class="'+thisClass+' '+Timepicker[CELL_CLASS]+' '+Timepicker[rowId]+'">'+str+'</li>';
    return myStr;
}




Timepicker[NAME] = 'timepicker';

Timepicker.ATTRS = {
    
    time:{
        value:{
            hour:0,
            minute:0,
            ampm:AM
        }
    },
    
    delay:{
        value:15
    },

    strings: {
        value: {
            am : "AM",
            pm : "PM",
            seperator : ':'
        }
    }
};


//build class names
Timepicker[HOUR_CLASS] = getClassName(Timepicker[NAME], HOUR_CLASS);
Timepicker[MINUTE_CLASS] = getClassName(Timepicker[NAME], MINUTE_CLASS);
Timepicker[AMPM_CLASS] = getClassName(Timepicker[NAME], AMPM_CLASS);
Timepicker[HOUR_CLASS] = getClassName(Timepicker[NAME], HOUR_CLASS, ROW);
Timepicker[MINUTE_CLASS] = getClassName(Timepicker[NAME], MINUTE_CLASS, ROW);
Timepicker[CELL_CLASS] = getClassName(Timepicker[NAME], CELL_CLASS);
Timepicker[ACTIVE_CLASS] = getClassName(Timepicker[NAME], ACTIVE_CLASS);



Y.extend(Timepicker, Y.Widget, {
    
    
          /* static vars */
          
          AM:AM,
          
          PM:PM,
          
          /* allow a short delay before highlight */
          _timer: null,
          
    
        
          initializer:function(){
              this.set('time.ampm', AM);
              var hour = this.get('time.hour');
              this.set('time.hour', ((hour === 0) ? 12 : hour));

          },
          
          destructor: function(){
              // nuke the model, which is storing references to dom objects
              
              delete(this._model.ampm);
              delete(this._model.hour);
              delete(this._model.minute);
              
          },
          
          /**
           * This method syncs the value of time object,
           * including building the strings for 12hr and 24hr
           * also fires a 'timeset' event
           * @method _syncTime
           * @protected
           *
           */
          _syncTime:function(){

              /**
               * Fires when a new time has been set (after the time strings)
               * have been built. Use this event rather than timeChange.
               * @event timeset
               * @param {Object} the time attribute object with the following attributes
               * <dl>
               *   <dt>hour</dt>
               *   <dd>The 12 hour hour</dd>
               *   <dt>minute</dt>
               *   <dd>The minutes</dd>
               *   <dt>s12hour</dt>
               *   <dd>A string representing the 12 hour time, with a seperator and an am/pm indicator as defined in strings</dd>
               *   <dt>s24hour</dt>
               *   <dd>A string representing the 24 hour time, with the seperator defined in strings</dd>
               * </dl>
               */


               /**
                * Fires when a cell is clicked on
                * @event cellclick
                * @param event {Event.Facade} An Event Facade object
                */
              var time = this.get('time'),
              
              ampm = time.ampm,
              seperator = this.get('strings.seperator'),
              minute    = pad(time.minute),
              
              //build the string for ampm based on the strings
              ampmString = (ampm === AM) ? this.get(AMSTR_KEY) : this.get(PMSTR_KEY);
              
              //store the string representation of the 12 hour time

              this.set('time.s12hour', 
                      ((time.hour === 0) ? 12 : time.hour) + 
                      seperator + minute + ampmString);
              
              //convert 12 hour to 24
              var hour = (ampm === PM) ? parseInt(time.hour,10) + 12 : parseInt(time.hour,10);
              if(hour == 24 || hour === 0 ) {hour = Math.abs(hour-12);}
              if(hour == 12 && ampm == AM) {hour = 0;}

              //store the string for 24 hour time
              this.set('time.s24hour', hour + seperator + minute);
              
              //fire time change event
              this.fire('timeset', this.get('time'));
          },
          
          _handleClick:function(e){
              //dispatch 'cellclick' event on any clicks
              if(e.target.test('.'+Timepicker[CELL_CLASS])){
                  this.fire('cellclick', this.get('time'));
              }
          },
          
          _handleOver:function(e){
              //this handles mouseover events, which it uses to change
              //the store value of time as defined in the params
              
              var targ = e.target, delay = this.get(DELAY_KEY);
              
              if(this._timer){
                  this._timer.cancel();
                  this._timer = null;
              }
              
              this._timer = Y.later(delay, this, this._highlight, targ);
              
              
          },
          
          _highlight:function(targ){
              //make sure this is one of our cells
                if(targ.test('.'+Timepicker[CELL_CLASS])){

                    var value = targ.get('innerHTML');

                    //we are using classnames to figure out which row is which
                    if(targ.hasClass(Timepicker[HOUR_CLASS])){
                        this.set('time.hour',value);
                    }else if (targ.hasClass(Timepicker[AMPM_CLASS])){

                        //ugly, but otherwise we would need to embed metadata
                        //somewhere else, this seemed easy enough
                        var amString = this.get(AMSTR_KEY);

                        if(value == amString){
                            this.set('time.ampm', AM);
                        } else{
                            this.set('time.ampm', PM);
                        }

                    }else{
                        this.set('time.minute', value);
                    }

                }
                this._syncTime();

                this.syncUI();
          },
          
          _handleOut:function(e){
              if(this._timer){
                  this._timer.cancel();
                  this._timer = null;
              }  
          },
          
          renderUI: function(){
              //FIXME: This could be more efficient!
              
              /*
              current implementation builds three ordered lists, one for 
              each row. Then we use the makeCell private method tp create a cell
              with the given class, based on string constants defined up top
              */
              var cb = this.get('contentBox'),
                   m = this._model,
				   rows = [], 
				   i;
                   
              //create row function is very simple...
              function createRow(){ return cb.create('<ol>');}
              
              var row = [];
              //only need three rows
              for (i=0; i <= 3; i++) {
                  row[i] = createRow();
              }
              
              //wrap make cell in node create
              function mc (str, c){
                  return cb.create(makeCell(str, c));
              }
              

              m[AMPM_CLASS].AM = mc(this.get(AMSTR_KEY),AMPM_CLASS);
              m[AMPM_CLASS].PM = mc(this.get(PMSTR_KEY),AMPM_CLASS);
              row[0].appendChild(m[AMPM_CLASS].AM);
              row[0].appendChild(m[AMPM_CLASS].PM);
              
              //build rows, creating a function to use only twice, but
              //still remove duplicates
              function assembleRow(start, row, max, step, c){
                  for(var i = start; i<=max; i=i+step){
                      var cell = mc(i, c);
                      m[c][i] = cell;
                      row.appendChild(cell);
                  } 
              }
                 
              assembleRow(1, row[1], 12, 1, HOUR_CLASS);

              assembleRow(0, row[2], 45, 15, MINUTE_CLASS);
              
              this._model[AMPM_CLASS].row = row[0];
              this._model[HOUR_CLASS].row = row[1];
              this._model[MINUTE_CLASS].row = row[2];
              
              var parent = cb.create('<div>');
              
              
              array.each(row, function(item){
                  parent.appendChild(item);
              });

              cb.appendChild(parent);
        
              //store for later
              this.allCells = cb.all('li');
         
          },
          
          /**
           * Show/hide the widget
           * @method toggle
           */              
          toggle: function(){
  Y.log('Toggling picker visability', 'info', CONSTRUCTOR);
              this[(this.get('visible') ? 'hide' : 'show')]();
              this.syncUI(); //IE 6 has an issue without this
          },
          
          bindUI: function(){
              
              var cb = this.get('contentBox');

              cb.on('click', this._handleClick, this);
              cb.on('mouseover', this._handleOver, this);
              cb.on('mouseout', this._handleOut, this);
          },
          
          syncUI: function(){
              Y.log('Syncing picker time', 'info', CONSTRUCTOR);
              //get the current tine vlaue
              var time = this.get('time');
             
              //get all of the li elements to clear their active state
              this.allCells.removeClass(Timepicker[ACTIVE_CLASS]);
              
              var m = this._model;
              var apos = 0;
              
              //handle ampm row, because of l10n can't count on
              //the value, so instead we use the "constant"
              if(time.ampm == AM){
                  m.ampm.AM.addClass(Timepicker[ACTIVE_CLASS]);
                  apos = m.ampm.AM.getX();
              }else if(time.ampm == PM){
                  m.ampm.PM.addClass(Timepicker[ACTIVE_CLASS]);
                  apos = m.ampm.PM.getX();
              }
              
              //handle minute row
              m.minute[time.minute].addClass(Timepicker[ACTIVE_CLASS]);
             
              
              //handle hour row
              m.hour[time.hour].addClass(Timepicker[ACTIVE_CLASS]);
              
              m.hour.row.setX(apos);

              m.minute.row.setX(m.hour[time.hour].getX());
 
          }
      });
      
Y.Base.build(Timepicker.NAME, Timepicker, {dynamic:false});
Y.namespace(NAMESPACE +'.'+CONSTRUCTOR);
Y[NAMESPACE][CONSTRUCTOR] = Timepicker;


}, 'gallery-2011.10.12-20-24' ,{requires:['oop', 'event-custom', 'attribute', 'base', 'dom', 'classnamemanager', 'widget', 'event']});
