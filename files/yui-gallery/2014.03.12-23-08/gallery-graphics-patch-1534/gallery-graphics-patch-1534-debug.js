YUI.add('gallery-graphics-patch-1534', function (Y, NAME) {

if(Y.VMLShape) {
    Y.VMLShape.ATTRS.stroke.setter = function(val) {
        var i,
            stroke,
            wt,
            tmpl = this.get("stroke") || this._getDefaultStroke();
        if(val)
        {
            if(val.hasOwnProperty("weight"))
            {
                wt = parseInt(val.weight, 10);
                if(!isNaN(wt))
                {
                    val.weight = wt;
                }
            }
            for(i in val)
            {
                if(val.hasOwnProperty(i))
                {
                    tmpl[i] = val[i];
                }
            }
        }
        if(tmpl.color && tmpl.color.toLowerCase().indexOf("rgba") > -1)
        {
           tmpl.opacity = Y.Color._getAlpha(tmpl.color);
           tmpl.color =  Y.Color.toHex(tmpl.color);
        }
        stroke = tmpl;
        this._strokeFlag = true;
        return stroke;
    };
    Y.VMLShape.ATTRS.fill.setter = function(val) {
        var i,
            fill,
            tmpl = this.get("fill") || this._getDefaultFill();

        if(val)
        {
            //ensure, fill type is solid if color is explicitly passed.
            if(val.hasOwnProperty("color"))
            {
                val.type = "solid";
            }
            for(i in val)
            {
                if(val.hasOwnProperty(i))
                {
                    tmpl[i] = val[i];
                }
            }
        }
        fill = tmpl;
        if(fill && fill.color)
        {
            if(fill.color === undefined || fill.color === "none")
            {
                fill.color = null;
            }
            else
            {
                if(fill.color.toLowerCase().indexOf("rgba") > -1)
                {
                    fill.opacity = Y.Color._getAlpha(fill.color);
                    fill.color =  Y.Color.toHex(fill.color);
                }
            }
        }
        this._fillFlag = true;
        return fill;
    };
}


}, 'gallery-2014.01.28-00-45');
