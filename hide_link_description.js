// ==UserScript==
// @name         ERPNext - Hide Extra Description in Multi Doctype
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  Hide extra data in item link suggestions
// @author       H.P. Automotive
// @match        https://erpnext.hpagroup.co.in/app/*
// @match        https://hpa-group.frappe.cloud/app/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/hide_link_description.js
// @downloadURL  https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/hide_link_description.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Hide elements with specific classes and adjust layout
     */
    function hideExtraData() {
        try {
            // Select all elements whose ID starts with 'awesomplete_list_'
            const listBoxes = document.querySelectorAll('[id^="awesomplete_list_"]');
            listBoxes.forEach(listBox => {
                // Select and hide all span elements with the class 'small' within the matched elements
                const smallElements = listBox.querySelectorAll('.small');
                smallElements.forEach(element => {
                    element.style.display = 'none';
                });
            });

            // Select and hide all div elements with the class 'col-xs-8' containing a span with the class 'text-muted'
            const colElements = document.querySelectorAll('.col-xs-8');
            colElements.forEach(colElement => {
                const textMutedSpan = colElement.querySelector('.text-muted');
                if (textMutedSpan) {
                    colElement.style.display = 'none';
                }
            });

            // Adjust divs within link-select-row in popups
            const linkRows = document.querySelectorAll('.row.link-select-row');
            linkRows.forEach(linkRow => {
                const col1 = linkRow.children[0];
                const col2 = linkRow.children[1];
                if (col2) {
                    col2.style.display = 'none';
                    col1.classList.replace('col-xs-4', 'col-xs-12');
                }
            });
        } catch (error) {
            console.error('Error in hideExtraData:', error);
        }
    }

    /**
     * Observe for changes in the DOM and apply the hiding logic
     */
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            hideExtraData();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial call to hide elements in case they are already present
        hideExtraData();
    }

    // Wait for the page to fully load before starting the observer
    window.addEventListener('load', observeDOMChanges);
})();
