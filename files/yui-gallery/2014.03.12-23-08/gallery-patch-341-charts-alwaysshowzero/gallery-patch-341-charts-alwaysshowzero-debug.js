YUI.add('gallery-patch-341-charts-alwaysshowzero', function(Y) {

Y.NumericAxis.prototype._updateMinAndMax = function()
{
    var data = this.get("data"),
        max, 
        min,
        len,
        num,
        i = 0,
        key,
        setMax = this.get("setMax"),
        setMin = this.get("setMin");
    if(!setMax || !setMin)
    {
        if(data && data.length && data.length > 0)
        {
            len = data.length;
            for(; i < len; i++)
            {	
                num = data[i];
                if(isNaN(num))
                {
                    if(Y.Lang.isObject(num))
                    {
                        min = max = 0;
                        //hloc values
                        for(key in num)
                        {
                           if(num.hasOwnProperty(key))
                           {
                                max = Math.max(num[key], max);
                                min = Math.min(num[key], min);
                           }
                        }
                    }
                    max = setMax ? this._setMaximum : max;
                    min = setMin ? this._setMinimum : min;
                    continue;
                }
                
                if(setMin)
                {
                    min = this._setMinimum;
                }
                else if(min === undefined)
                {
                    min = num;
                }
                else
                {
                    min = Math.min(num, min); 
                }
                if(setMax)
                {
                    max = this._setMaximum;
                }
                else if(max === undefined)
                {
                    max = num;
                }
                else
                {
                    max = Math.max(num, max);
                }
                
                this._actualMaximum = max;
                this._actualMinimum = min;
            }
        }
        this._roundMinAndMax(min, max, setMin, setMax);
    }
};


}, 'gallery-2011.09.28-20-06' ,{requires:['charts']});
