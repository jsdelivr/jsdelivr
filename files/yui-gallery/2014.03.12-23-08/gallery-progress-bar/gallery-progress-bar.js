YUI.add('gallery-progress-bar', function(Y) {

    var LANG = Y.Lang;

    Y.ProgressBar = Y.Base.create('progressBar', Y.Widget, [], {

        _anim: null,


        /** set up **/
        renderUI: function() {
            this.get('contentBox').append(LANG.sub(this.get('layout'), {
                sliderClass: this.getClassName('slider'),
                labelClass: this.getClassName('label')
            }));
        },

        bindUI: function() {
            this.after('labelChange', this._updateLabel);
            this.after('labelTemplateChange', this._updateLabel);
            this.after('progressChange', this._updateBar);
        },

        syncUI: function() {
            this._updateBar();
        },

        /** A little bit of sugar **/
        increment: function(step) {
            step = step || 1;
            this.set('progress', this.get('progress') + parseFloat(step, 10));
            return this;
        },

        decrement: function(step) {
            step = step || 1;
            this.set('progress', this.get('progress') - parseFloat(step, 10));
            return this;
        },

        update: function(progress) {
            this.set('progress', progress);
            return this;
        },

        setLabelAt: function(position, value) {
            var label = this.get('label');
            position = parseFloat(position, 10);
            label[position] = value;
            this.set('label', label);
            return this;
        },

        removeLabelAt: function(position) {
            var label = this.get('label');
            position = parseFloat(position, 10);
            if (label[position] !== undefined && label[position] !== null) {
                delete label[position];
            }
            this.set('label', label);
            return this;
        },

        setLabelTemplateAt: function(position, value) {
            var template = this.get('labelTemplate');
            position = parseFloat(position, 10);
            template[position] = value;
            this.set('labelTemplate', template);
            return this;
        },

        removeLabelTemplateAt: function(position) {
            var template = this.get('labelTemplate');
            position = parseFloat(position, 10);
            if (template[position] !== undefined && template[position] !== null) {
                delete template[position];
            }
            this.set('labelTemplate', template);
            return this;
        },

        /** protected updaters **/
        _updateLabel: function(e) {
            var progress = this.get('progress'),
                attrs = this.getAttrs(),
                label = this._getLabel(progress),
                labelTemplate = this._getLabelTemplate(progress);
                
            attrs.label = label || '';
            this.get('contentBox').all('.' + this.getClassName('label')).set('text', LANG.sub(labelTemplate, attrs));
        },

        _updateBar: function(e) {
            var cb = this.get('contentBox'),
                position = cb.get('offsetWidth') * this.get('progress') / 100;

            if (!this._anim) {
                this._makeAnim();
            }

            if (this._anim && this._anim.get('running')) {
                this._anim.stop();
            }
            
            this._anim.set('to.width', position);
            
            this._anim.run();

            this._updateLabel();
        },

        _makeAnim: function() {
            var animConfig = this.get('animation'),
                node = this.get('contentBox').one(this.get('animateNode'));

            animConfig.node = node;

            if (!animConfig.to) {
                animConfig.to = {
                    width: 0
                };
            }
            
            this._anim = new Y.Anim(animConfig);
        },

        _getAnimateNode: function() {
            return ('.' + this.getClassName('slider'));
        },
        
        _getLabel : function(progress) {
            var label = this.get('label'),
                labelString = null,
                keys, i = -1, l;
                
            if ( !LANG.isObject(label) ) {
                return label; 
            }

            if (label[progress] !== undefined && label[progress] !== null) {
                labelString = label[progress];
            } else {
                keys = Y.Object.keys(label);
                keys.sort(Y.Array.numericSort);
                l = keys.length;
                while (++i < l) {
                    if (keys[i] <= progress) {
                        labelString = label[keys[i]];
                    }
                }
            }
            
            return labelString;
        },
        
        _getLabelTemplate : function(progress) {
            var template = this.get('labelTemplate'),
                templateString = null,
                keys, i = -1, l;
            
            if ( !LANG.isObject(template) ) {
                return template;
            }
            
            if (template[progress] !== undefined && template[progress] !== null) {
                templateString = template[progress];
            } else {
                keys = Y.Object.keys(template);
                keys.sort(Y.Array.numericSort);
                l = keys.length;
                while (++i < l) {
                    if (keys[i] <= progress) {
                        templateString = template[keys[i]];
                    }
                }
            }
            
            return templateString;
        }

    }, {
        ATTRS: {

            animation: {
                value: {
                    easing: Y.Easing.easeIn,
                    duration: 0.5
                }
            },

            animateNode: {
                valueFn: '_getAnimateNode'
            },

/* REMOVED FOR TRANSITION BUG
    transition : {
      value : {
        easing : 'ease-out',
        duration: 0.5
      }
    },
    */

            labelTemplate: {
                value: { 0 : '{label} - {progress}%' },
                validator: function(val) {
                    return (LANG.isString(val) || LANG.isObject(val));
                },
                setter: function(val) {
                    if (LANG.isString(val)) {
                        val = {
                            0: val
                        };
                    }
                    return val;
                }
            },

            label: {
                value: {
                    0: 'Loading',
                    100: 'Complete'
                },
                validator: function(val) {
                    return (LANG.isString(val) || LANG.isObject(val));
                },
                setter: function(val) {
                    if (LANG.isString(val)) {
                        val = {
                            0: val
                        };
                    }
                    return val;
                }
            },

            layout: {
                value: '<div class="{sliderClass} {labelClass}"></div>'
            },

            precision: {
                value: 2,
                setter: function(val) {
                    return parseInt(val, 10);
                }
            },

            progress: {
                value: 0,
                setter: function(val) {
                    var precision = Math.pow(10, this.get('precision'));
                    val = parseFloat(val, 10);
                    if (val < 0) {
                        val = 0;
                    } else if (val > 100) {
                        val = 100;
                    }
                    return Math.round(val * precision) / precision;
                }
            }
        }
    });





}, 'gallery-2011.02.09-21-32' ,{requires:['widget','anim','base-build']});
