YUI.add('gallery-node-reset', function(Y) {


        var NR = function(config) {
            config.node = (
                (Y.Widget && config.host instanceof Y.Widget) ? config.host.get('boundingBox') : 
                    ((config.host) ? config.host : config.node)
            );

            NR.superclass.constructor.call(this, config);
        },
        resetCSS = 'ID div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, button, textarea, p, blockquote, th, td { margin: 0; padding: 0; }';
        resetCSS += 'ID table { border-collapse: collapse; border-spacing: 0; }';
        resetCSS += 'ID fieldset, img { border: 0; }';
        resetCSS += 'ID address, caption, cite, code, dfn, em, strong, th, var, optgroup { font-style: inherit; font-weight: inherit; }';
        resetCSS += 'ID del, ins { text-decoration: none; }';
        resetCSS += 'ID li { list-style: none; }';
        resetCSS += 'ID caption, th { text-align: left; }';
        resetCSS += 'ID h1, h2, h3, h4, h5, h6 { font-size: 100%; font-weight: normal; }';
        resetCSS += 'ID abbr, acronym { border: 0; font-variant: normal; }';
        resetCSS += 'ID sup { vertical-align: baseline; }';
        resetCSS += 'ID sub { vertical-align: baseline; }';
        
        NR.NAME = "gallery-node-reset";

        NR.NS = "reset";

        NR.ATTRS = {
            node: {
                setter: function(n) {
                    return Y.one(n);
                }
            },
            sheet: {
                value: null
            }
        };

        Y.extend(NR, Y.Base, {
            initializer: function() {
                var id = this.get('node').get('id'), sheet;

                resetCSS = resetCSS.replace(/, /g, ', #' + id + ' ');
                resetCSS = resetCSS.replace(/ID/g, '#' + id);

                sheet = Y.StyleSheet(resetCSS, 'node-reset-' + id);
                sheet.enable();

                this.set('sheet', sheet);
            },
            destructor: function() {
                this.get('sheet').disable();
            }
        });
        Y.namespace('Plugin');
        Y.Plugin.NodeReset = NR;

    


}, 'gallery-2009.12.08-22' ,{requires:['node', 'stylesheet', 'base']});
