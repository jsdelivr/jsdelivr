    /**
    * o-------------------------------------------------------------------------------o
    * | This file is part of the RGraph package. RGraph is Free software, licensed    |
    * | under the MIT license - so it's free to use for all purposes. Extended        |
    * | support is available if required and donations are always welcome! You can    |
    * | read more here:                                                               |
    * |                         http://www.rgraph.net/support                         |
    * o-------------------------------------------------------------------------------o
    */

    /**
    * Initialise the various objects
    */
    if (typeof(RGraph) == 'undefined') RGraph = {isRGraph:true,type:'common'};

    RGraph.CSV = function (url, func)
    {
        /**
        * Some default values
        */
        this.url       = url;
        this.ready     = func;
        this.data      = null;
        this.numrows   = null;
        this.numcols   = null;
        this.seperator = arguments[2] || ',';
        this.endofline = arguments[3] || /\r?\n/;




        /**
        * This function splits the CSV data into an array so that it can be useful.
        */
        this.fetch = function ()
        {
            var sep = this.seperator;
            var eol = this.endofline;
            var obj = this;

            if (this.url.substring(0,3) == 'id:') {

                // Get rid of any trailing slash
                var data = document.getElementById(this.url.substring(3)).innerHTML.replace(/(\r?\n)+$/, '');

                // Store the CSV data on the CSV object (ie - this object)
                obj.data = data.split(eol);
                
                // Store the number of rows
                obj.numrows = obj.data.length;

                for (var i=0,len=obj.data.length; i<len; i+=1) {


                    var row = obj.data[i].split(sep);

                    if (!obj.numcols) {
                        obj.numcols = row.length;
                    }

                    /**
                    * If the cell is purely made up of numbers - convert it
                    */
                    for (var j=0; j<row.length; j+=1) {
                        if ((/^[0-9.]+$/).test(row[j])) {
                            row[j] = parseFloat(row[j]);
                        }
                            
                        // Assign the split-up-row back to the data array
                        obj.data[i] = row;
                    }
                }
                
                // Call the ready function straight away
                obj.ready(obj);

            } else {

                RGraph.AJAX.getString(this.url, function (data)
                {
                    data = data.replace(/(\r?\n)+$/, '');
                    obj.data = data.split(eol);
                    
                    // Store the number of rows
                    obj.numrows = obj.data.length;
    
                    for (var i=0,len=obj.data.length; i<len; i+=1) {
    
    
                        var row = obj.data[i].split(sep);
    
                        if (!obj.numcols) {
                            obj.numcols = row.length;
                        }
    
                        /**
                        * If the cell is purely made up of numbers - convert it
                        */
                        for (var j=0; j<row.length; j+=1) {
                            if ((/^[0-9.]+$/).test(row[j])) {
                                row[j] = parseFloat(row[j]);
                            }
                                
                            // Assign the split-up-row back to the data array
                            obj.data[i] = row;
                        }
                    }

                    // Call the ready function straight away
                    obj.ready(obj);
                });
            }
        }




        /**
        * Returns a row of the CSV file
        * 
        * @param number index The index of the row to fetch
        * @param        start OPTIONAL If desired you can specify a column to start at (which starts at 0 by default)
        */
        this.getRow = function (index)
        {
            var row   = [];
            var start = arguments[1] || 0;

            for (var i=start; i<this.numcols; i+=1) {
                row.push(this.data[index][i]);
            }
            
            return row;
        }




        /**
        * Returns a column of the CSV file
        * 
        * @param number index The index of the column to fetch
        * @param        start OPTIONAL If desired you can specify a row to start at (which starts at 0 by default)
        */
        this.getCol =
        this.getColumn = function (index)
        {
            var col   = [];
            var start = arguments[1] || 0;

            for (var i=start; i<this.numrows; i+=1) {
                col.push(this.data[i][index]);
            }
            
            return col;
        }





        // Fetch the CSV file
        this.fetch();
    }