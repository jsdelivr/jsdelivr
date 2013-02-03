/*!
  jQuery Wookmark plugin 0.5
  @name jquery.wookmark.js
  @author Christoph Ono (chri@sto.ph or @gbks)
  @version 0.5
  @date 3/19/2012
  @category jQuery plugin
  @copyright (c) 2009-2012 Christoph Ono (www.wookmark.com)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
$.fn.wookmark = function(options) {
  
  if(!this.wookmarkOptions) {
    this.wookmarkOptions = $.extend( {
        container: $('body'),
        offset: 2,
        autoResize: false,
        itemWidth: $(this[0]).outerWidth(),
        resizeDelay: 50
      }, options);
  } else if(options) {
    this.wookmarkOptions = $.extend(this.wookmarkOptions, options);
  }
  
  // Layout variables.
  if(!this.wookmarkColumns) {
    this.wookmarkColumns = null;
    this.wookmarkContainerWidth = null;
  }
  
  // Main layout function.
  this.wookmarkLayout = function() {
    // Calculate basic layout parameters.
    var columnWidth = this.wookmarkOptions.itemWidth + this.wookmarkOptions.offset;
    var containerWidth = this.wookmarkOptions.container.width();
    var columns = Math.floor((containerWidth+this.wookmarkOptions.offset)/columnWidth);
    var offset = Math.round((containerWidth - (columns*columnWidth-this.wookmarkOptions.offset))/2);
    
    // If container and column count hasn't changed, we can only update the columns.
    var bottom = 0;
    if(this.wookmarkColumns != null && this.wookmarkColumns.length == columns) {
      bottom = this.wookmarkLayoutColumns(columnWidth, offset);
    } else {
      bottom = this.wookmarkLayoutFull(columnWidth, columns, offset);
    }
    
    // Set container height to height of the grid.
    this.wookmarkOptions.container.css('height', bottom+'px');
  };
  
  /**
   * Perform a full layout update.
   */
  this.wookmarkLayoutFull = function(columnWidth, columns, offset) {
    // Prepare Array to store height of columns.
    var heights = [];
    while(heights.length < columns) {
      heights.push(0);
    }
    
    // Store column data.
    this.wookmarkColumns = [];
    while(this.wookmarkColumns.length < columns) {
      this.wookmarkColumns.push([]);
    }
    
    // Loop over items.
    var item, top, left, i=0, k=0, length=this.length, shortest=null, shortestIndex=null, bottom = 0;
    for(; i<length; i++ ) {
      item = $(this[i]);
      
      // Find the shortest column.
      shortest = null;
      shortestIndex = 0;
      for(k=0; k<columns; k++) {
        if(shortest == null || heights[k] < shortest) {
          shortest = heights[k];
          shortestIndex = k;
        }
      }
      
      // Postion the item.
      item.css({
        position: 'absolute',
        top: shortest+'px',
        left: (shortestIndex*columnWidth + offset)+'px'
      });
      
      // Update column height.
      heights[shortestIndex] = shortest + item.outerHeight() + this.wookmarkOptions.offset;
      bottom = Math.max(bottom, heights[shortestIndex]);
      
      this.wookmarkColumns[shortestIndex].push(item);
    }
    
    return bottom;
  };
  
  /**
   * This layout function only updates the vertical position of the 
   * existing column assignments.
   */
  this.wookmarkLayoutColumns = function(columnWidth, offset) {
    var heights = [];
    while(heights.length < this.wookmarkColumns.length) {
      heights.push(0);
    }
    
    var i=0, length = this.wookmarkColumns.length, column;
    var k=0, kLength, item;
    var bottom = 0;
    for(; i<length; i++) {
      column = this.wookmarkColumns[i];
      kLength = column.length;
      for(k=0; k<kLength; k++) {
        item = column[k];
        item.css({
          left: (i*columnWidth + offset)+'px',
          top: heights[i]+'px'
        });
        heights[i] += item.outerHeight() + this.wookmarkOptions.offset;
        
        bottom = Math.max(bottom, heights[i]);
      }
    }
    
    return bottom;
  };
  
  // Listen to resize event if requested.
  this.wookmarkResizeTimer = null;
  if(!this.wookmarkResizeMethod) {
    this.wookmarkResizeMethod = null;
  }
  if(this.wookmarkOptions.autoResize) {
    // This timer ensures that layout is not continuously called as window is being dragged.
    this.wookmarkOnResize = function(event) {
      if(this.wookmarkResizeTimer) {
        clearTimeout(this.wookmarkResizeTimer);
      }
      this.wookmarkResizeTimer = setTimeout($.proxy(this.wookmarkLayout, this), this.wookmarkOptions.resizeDelay)
    };
    
    // Bind event listener.
    if(!this.wookmarkResizeMethod) {
      this.wookmarkResizeMethod = $.proxy(this.wookmarkOnResize, this);
    }
    $(window).resize(this.wookmarkResizeMethod);
  };
  
  /**
   * Clear event listeners and time outs.
   */
  this.wookmarkClear = function() {
    if(this.wookmarkResizeTimer) {
      clearTimeout(this.wookmarkResizeTimer);
      this.wookmarkResizeTimer = null;
    }
    if(this.wookmarkResizeMethod) {
      $(window).unbind('resize', this.wookmarkResizeMethod);
    }
  };
  
  // Apply layout
  this.wookmarkLayout();
  
  // Display items (if hidden).
  this.show();
};
