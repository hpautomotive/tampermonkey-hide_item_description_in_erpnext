// ==UserScript==
// @name         ERPNext - Hide Extra Description in Multi Doctype
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Hide extra data in item link suggestions
// @author       Your Name
// @match        https://erp.hpagroup.co.in/app/*
// @match        https://erpnext.hpagroup.co.in/app/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/hide_link_description.js
// @downloadURL  https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/hide_link_description.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the elements with the class 'small'
    function hideExtraData() {
        // Select all elements whose ID starts with 'awesomplete_list_'
        var listBoxes = document.querySelectorAll('[id^="awesomplete_list_"]');

        listBoxes.forEach(function(listBox) {
            // Select all span elements with the class 'small' within the matched elements
            var elements = listBox.querySelectorAll('.small');

            // Iterate through each element and hide it
            elements.forEach(function(element) {
                element.style.display = 'none';
            });
        });
    }

    // Wait for the page to fully load
    window.addEventListener('load', function() {
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
    });
})();
