// ==UserScript==
// @name         ERPNext - Hide Extra Description in Multi Doctype
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Hide extra data in item link suggestions
// @author       Gopal Kedia (H.P. Automotive)
// @match        https://erp.hpagroup.co.in/app/*
// @match        https://erpnext.hpagroup.co.in/app/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/hide_link_description.js
// @downloadURL  https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/hide_link_description.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the second part of the div and adjust the first part
    function hideExtraData() {
        // Select all div elements with the class 'link-select-row'
        var linkRows = document.querySelectorAll('.row.link-select-row');

        linkRows.forEach(function(linkRow) {
            // Select the first and second child divs within the row
            var col1 = linkRow.children[0];
            var col2 = linkRow.children[1];

            if (col2) {
                // Hide the second div
                col2.style.display = 'none';

                // Adjust the first div to use the full width
                col1.classList.remove('col-xs-4');
                col1.classList.add('col-xs-12');
            }
        });
    }

    // Function to observe for changes in the DOM and apply the hiding logic
    function observeDOMChanges() {
        // Create a mutation observer to watch for changes in the DOM
        var observer = new MutationObserver(function(mutations) {
            hideExtraData();
        });

        // Start observing the body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial call to hide elements in case they are already present
        hideExtraData();
    }

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        observeDOMChanges();
    });
})();
