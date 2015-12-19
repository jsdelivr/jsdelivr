/*global obviel:false */
(function($, obviel) {
    
    obviel.view({
        iface: 'event',
        ephemeral: true,
        render: function() {
            this.el.trigger(this.obj.name);
        }
    });
    
    obviel.view({
        iface: 'redirect',
        ephemeral: true,
        render: function() {
            this.el.render(this.obj.target);
        }
    });

    obviel.view({
        iface: 'multi',
        ephemeral: true,
        render: function() {
            var el = this.el;
            var objects = this.obj.objects || [];
            $.each(objects, function(index, obj) {
                el.render(obj);
            });
        }
    });
    
}(jQuery, obviel));
