// ==UserScript==
// @name         ERPNext - Hide Extra Description in Multi Doctype
// @namespace    http://tampermonkey.net/
// @version      1.0.4
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

    // Function to hide the elements with the class 'small' and the specified 'text-muted' elements
    function hideExtraData() {
        // Select all elements whose ID starts with 'awesomplete_list_'
        var listBoxes = document.querySelectorAll('[id^="awesomplete_list_"]');

        listBoxes.forEach(function(listBox) {
            // Select all span elements with the class 'small' within the matched elements
            var smallElements = listBox.querySelectorAll('.small');
            smallElements.forEach(function(element) {
                element.style.display = 'none';
            });
        });

        // Select all div elements with the class 'col-xs-8' containing a span with the class 'text-muted'
        var colElements = document.querySelectorAll('.col-xs-8');
        colElements.forEach(function(colElement) {
            var textMutedSpan = colElement.querySelector('.text-muted');
            if (textMutedSpan) {
                colElement.style.display = 'none';
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
