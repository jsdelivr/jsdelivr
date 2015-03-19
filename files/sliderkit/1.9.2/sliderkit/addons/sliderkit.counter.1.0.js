/**
 *  Slider Kit Counter, v1.0 - 2011/09/23
 *  http://www.kyrielles.net/sliderkit
 *  
 *  Copyright (c) 2010-2012 Alan Frog
 *  Licensed under the GNU General Public License
 *  See <license.txt> or <http://www.gnu.org/licenses/>
 *  
 *  Requires : jQuery Slider Kit v1.7.1+
 * 
 */
(function( $ ) {

	SliderKit.prototype.Counter = (function() {
		var obj = this;
		
		var csslib = {
			countItems: obj.options.cssprefix+"-count-items",
			countLines: obj.options.cssprefix+"-count-lines",
			countCur: obj.options.cssprefix+"-count-current",
			countTot: obj.options.cssprefix+"-count-total"
		};	
		
		// Panels counter
		if( obj.arePanels ){
			var countItemsObj = $( "."+csslib.countItems, obj.domObj );
			var countItemsCur = $( "."+csslib.countCur, countItemsObj );
			
			if( countItemsObj.size() > 0 && countItemsCur.size() > 0 ) {
			
				var itemsCounter = 1;
				
				var _countItems = function(){
					countItemsCur.text( (obj.currId != 0 ? obj.currId : obj.startId) + 1 );
				};
				
				// First time display
				if( obj.firstTime ){
					$( "."+ csslib.countTot, countItemsObj ).text( obj.allItems );
					_countItems();
				}
				
				// Store the function into the callback list
				obj.panelAnteFns.push( _countItems );
			}
		}
		
		// Nav lines counter
		if( obj.isNavClip ){	
			var countLinesObj = $( "."+csslib.countLines, obj.domObj );
			var countLinesCur = $( "."+csslib.countCur, countLinesObj );
			
			if( countLinesObj.size() > 0 && countLinesCur.size() > 0) {
				var linesNum = Math.ceil( obj.navLINum / obj.options.shownavitems );
							
				var _countLines = function(){
					var currLine = Math.ceil( (obj.currId +1) / obj.options.shownavitems );			
					countLinesCur.text( currLine );
				};
			
				// First time display
				if( obj.firstTime ){
					$( "."+ csslib.countTot, countLinesObj ).text( linesNum );
					_countLines();
				}
				
				// Store the function into the callback list
				obj.navAnteFns.push( _countLines );
				obj.panelPostFns.push( _countLines );
			}
		}
    });
	
})( jQuery );