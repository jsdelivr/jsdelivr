/**
 * this plugin adds support for mouseenter and mouseleave events
 */
(function(Gator) {
    var oldAddEvent = Gator.addEvent;

    function _isMouseEnterOrLeave(parent_element, match, root, e) {
        if (!e.relatedTarget) {
             return true;
        }

        if (root && parent_element !== match) {
            return false;
        }

        if (match === e.relatedTarget) {
            return false;
        }

        if (match.contains(e.relatedTarget)) {
            return false;
        }

        return true;
    }

    Gator.addEvent = function(gator, type, callback) {
        // if the type is mouseenter or mouseleave then
        // bind them as mouseover and mouseout
        if (type == 'mouseenter') {
            type = 'mouseover';
        }

        if (type == 'mouseleave') {
            type = 'mouseout';
        }

        oldAddEvent(gator, type, callback);
    };

    Gator.matchesEvent = function(type, element, match, root, e) {
        if (type == 'mouseenter' || type == 'mouseleave') {
            return _isMouseEnterOrLeave(element, match, root, e);
        }

        return true;
    };
}) (Gator);
