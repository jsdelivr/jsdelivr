YUI.add('gallery-patch-350-charts-numericaxis', function(Y) {

    Y.NumericAxis.prototype._roundMinAndMax = function(min, max, setMin, setMax)
    {
        var roundingUnit,
            minimumRange,
            minGreaterThanZero = min >= 0,
            maxGreaterThanZero = max > 0,
            dataRangeGreater,
            maxRound,
            minRound,
            topTicks,
            botTicks,
            tempMax,
            tempMin,
            units = this.getTotalMajorUnits() - 1,
            alwaysShowZero = this.get("alwaysShowZero"),
            roundingMethod = this.get("roundingMethod"),
            useIntegers = (max - min)/units >= 1;
        if(roundingMethod)
        {
            if(roundingMethod == "niceNumber")
            {
                roundingUnit = this._getMinimumUnit(max, min, units);
                if(minGreaterThanZero && maxGreaterThanZero)
                {
                    if((alwaysShowZero || min < roundingUnit) && !setMin)
                    {
                        min = 0;
                        roundingUnit = this._getMinimumUnit(max, min, units);
                    }
                    else
                    {
                       min = this._roundDownToNearest(min, roundingUnit);
                    }
                    if(setMax)
                    {
                        if(!alwaysShowZero)
                        {
                            min = max - (roundingUnit * units);
                        }
                    }
                    else if(setMin)
                    {
                        max = min + (roundingUnit * units);
                    }
                    else
                    {
                        max = this._roundUpToNearest(max, roundingUnit);
                    }
                }
                else if(maxGreaterThanZero && !minGreaterThanZero)
                {
                    if(alwaysShowZero)
                    {
                        topTicks = Math.round(units/((-1 * min)/max + 1));
                        topTicks = Math.max(Math.min(topTicks, units - 1), 1);
                        botTicks = units - topTicks;
                        tempMax = Math.ceil( max/topTicks );
                        tempMin = Math.floor( min/botTicks ) * -1;
                        
                        if(setMin)
                        {
                            while(tempMin < tempMax && botTicks >= 0)
                            {
                                botTicks--;
                                topTicks++;
                                tempMax = Math.ceil( max/topTicks );
                                tempMin = Math.floor( min/botTicks ) * -1;
                            }
                            //if there are any bottom ticks left calcualate the maximum by multiplying by the tempMin value
                            //if not, it's impossible to ensure that a zero is shown. skip it
                            if(botTicks > 0)
                            {
                                max = tempMin * topTicks;
                            }
                            else
                            {
                                max = min + (roundingUnit * units);
                            }
                        }
                        else if(setMax)
                        {
                            while(tempMax < tempMin && topTicks >= 0)
                            {
                                botTicks++;
                                topTicks--;
                                tempMin = Math.floor( min/botTicks ) * -1;
                                tempMax = Math.ceil( max/topTicks );
                            }
                            //if there are any top ticks left calcualate the minimum by multiplying by the tempMax value
                            //if not, it's impossible to ensure that a zero is shown. skip it
                            if(topTicks > 0)
                            {
                                min = tempMax * botTicks * -1;
                            }
                            else
                            {
                                min = max - (roundingUnit * units);
                            }
                        }
                        else
                        {
                            roundingUnit = Math.max(tempMax, tempMin);
                            roundingUnit = this._getNiceNumber(roundingUnit);  
                            max = roundingUnit * topTicks;
                            min = roundingUnit * botTicks * -1;
                        }
                    }
                    else 
                    {
                        if(setMax)
                        {
                            min = max - (roundingUnit * units);
                        }
                        else if(setMin)
                        {
                            max = min + (roundingUnit * units);
                        }
                        else
                        {
                            min = this._roundDownToNearest(min, roundingUnit);
                            max = this._roundUpToNearest(max, roundingUnit);
                        }
                    }
                }
                else
                {
                    if(setMin)
                    {
                        if(alwaysShowZero)
                        {
                            max = 0;
                        }
                        else
                        {
                            max = min + (roundingUnit * units);
                        }
                    }
                    else if(!setMax)
                    {
                        if(alwaysShowZero || max === 0 || max + roundingUnit > 0)
                        {
                            max = 0;
                            roundingUnit = this._getMinimumUnit(max, min, units);
                            min = max - (roundingUnit * units);
                        }
                        else
                        {
                            min = this._roundDownToNearest(min, roundingUnit);
                            max = this._roundUpToNearest(max, roundingUnit);
                        }
                    }
                    else
                    {
                        min = max - (roundingUnit * units);
                    }
                }
            }
            else if(roundingMethod == "auto") 
            {
                if(minGreaterThanZero && maxGreaterThanZero)
                {
                    if((alwaysShowZero || min < (max-min)/units) && !setMin)
                    {
                        min = 0;
                    }
                
                    roundingUnit = (max - min)/units;
                    if(useIntegers)
                    {
                        roundingUnit = Math.ceil(roundingUnit);
                    }
                    max = min + (roundingUnit * units);
                }
                else if(maxGreaterThanZero && !minGreaterThanZero)
                {
                    if(alwaysShowZero)
                    {
                        topTicks = Math.round( units / ( (-1 * min) /max + 1) );
                        topTicks = Math.max(Math.min(topTicks, units - 1), 1);
                        botTicks = units - topTicks;

                        if(useIntegers)
                        {
                            tempMax = Math.ceil( max/topTicks );
                            tempMin = Math.floor( min/botTicks ) * -1;
                        }
                        else
                        {
                            tempMax = max/topTicks;
                            tempMin = min/botTicks * -1;
                        }
                        roundingUnit = Math.max(tempMax, tempMin);
                        max = roundingUnit * topTicks;
                        min = roundingUnit * botTicks * -1;
                    }
                    else
                    {
                        roundingUnit = (max - min)/units;
                        if(useIntegers)
                        {
                            roundingUnit = Math.ceil(roundingUnit);
                        }
                        min = this._roundDownToNearest(min, roundingUnit);
                        max = this._roundUpToNearest(max, roundingUnit);
                    }
                }
                else
                {
                    roundingUnit = (max - min)/units;
                    if(useIntegers)
                    {   
                        roundingUnit = Math.ceil(roundingUnit);
                    }
                    if(alwaysShowZero || max === 0 || max + roundingUnit > 0)
                    {
                        max = 0;
                        roundingUnit = (max - min)/units;
                        if(useIntegers)
                        {
                            Math.ceil(roundingUnit);
                        }
                        min = max - (roundingUnit * units);
                    }
                    else
                    {
                        min = this._roundDownToNearest(min, roundingUnit);
                        max = this._roundUpToNearest(max, roundingUnit);
                    }

                }
            }
            else if(!isNaN(roundingMethod) && isFinite(roundingMethod))
            {
                roundingUnit = roundingMethod;
                minimumRange = roundingUnit * units;
                dataRangeGreater = (max - min) > minimumRange;
                minRound = this._roundDownToNearest(min, roundingUnit);
                maxRound = this._roundUpToNearest(max, roundingUnit);
                if(setMax)
                {
                    min = max - minimumRange;
                }
                else if(setMin)
                {
                    max = min + minimumRange;
                }
                else if(minGreaterThanZero && maxGreaterThanZero)
                {
                    if(alwaysShowZero || minRound <= 0)
                    {
                        min = 0;
                    }
                    else
                    {
                        min = minRound;
                    }
                    max = min + minimumRange;
                }
                else if(maxGreaterThanZero && !minGreaterThanZero)
                {
                    min = minRound;
                    max = maxRound;
                }
                else
                {
                    if(alwaysShowZero || maxRound >= 0)
                    {
                        max = 0;
                    }
                    else
                    {
                        max = maxRound;
                    }
                    min = max - minimumRange;
                }
            }
        }
        this._dataMaximum = max;
        this._dataMinimum = min;
    };




}, 'gallery-2012.04.12-13-50' ,{skinnable:false, requires:['charts-base']});
