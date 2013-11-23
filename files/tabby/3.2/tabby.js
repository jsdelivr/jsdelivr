/* =============================================================

    Tabby v3.2
    Simple, mobile-first toggle tabs by Chris Ferdinandi
    http://gomakethings.com

    Free to use under the MIT License.
    http://gomakethings.com/mit/
    
 * ============================================================= */

(function() {

    'use strict';

    // Feature Test
    if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

        // Function to show a tab
        var showTab = function (toggle) {

            // Define the target tab and siblings
            var dataID = toggle.getAttribute('data-target');
            var dataTarget = document.querySelector(dataID);
            var targetSiblings = buoy.getSiblings(dataTarget);

            // Get toggle parent and parent sibling elements
            var toggleParent = toggle.parentNode;
            var toggleSiblings = buoy.getSiblings(toggleParent);

            // Add '.active' class to tab toggle and parent element
            buoy.addClass(toggle, 'active');
            buoy.addClass(toggleParent, 'active');

            // Remove '.active' class from all sibling elements
            [].forEach.call(toggleSiblings, function (sibling) {
                buoy.removeClass(sibling, 'active');
            });

            // Add '.active' class to target tab
            buoy.addClass(dataTarget, 'active');

            // Remove '.active' class from all other tabs
            [].forEach.call(targetSiblings, function (sibling) {
                buoy.removeClass(sibling, 'active');
            });

        };

        // Define tab toggles
        var tabToggle = document.querySelectorAll('.tabs a, .tabs button');

        // For each tab toggle
        [].forEach.call(tabToggle, function (toggle) {

            // When tab toggle is clicked
            toggle.addEventListener('click', function(e) {
             
                // Prevent default link behavior
                e.preventDefault();

                // Activate the tab
                showTab(toggle);
             
            }, false);

        });

    }

})();
