// ==UserScript==
// @name         ERPNext - Auto Close Specific Popups
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Try to auto-close popups with specific content on ERPNext more reliably
// @author       H.P. Automotive
// @match        https://erpnext.hpagroup.co.in/app/payment-entry/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function closePopup() {
        // Query for popups containing specific messages
        const modals = document.querySelectorAll('.modal-dialog.msgprint-dialog');
        modals.forEach(modal => {
            const msgContent = modal.querySelector('.msgprint');
            if (msgContent && msgContent.innerHTML.includes('No outstanding invoices found for the customer <strong>Suspense</strong>')) {
                const closeButton = modal.querySelector('.btn-modal-close');
                if (closeButton) {
                    closeButton.click();  // Attempt to close by clicking the button
                } else {
                    modal.remove();  // Remove the modal element from the DOM as a fallback
                }
            }
        });
    }

    // Use an interval to periodically check for the popup
    setInterval(closePopup, 200); // Check every 200 milliseconds

    // Also run the check when the page has fully loaded
    window.addEventListener('load', closePopup);
})();
