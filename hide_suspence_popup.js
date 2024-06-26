// ==UserScript==
// @name         ERPNext - Auto Close Specific Popups
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Auto close popups with specific content on ERPNext after form refreshes or loadings
// @match        https://erpnext.hpagroup.co.in/app/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/hide_suspence_popup.js
// @downloadURL  https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/hide_suspence_popup.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the popup content matches the specified structure and close it
    function checkAndClosePopup() {
        const modals = document.querySelectorAll('.modal-dialog.msgprint-dialog');

        modals.forEach(modal => {
            const modalContent = modal.querySelector('.modal-content');
            const modalTitle = modalContent ? modalContent.querySelector('.modal-title') : null;
            const msgPrint = modalContent ? modalContent.querySelector('.msgprint') : null;

            console.log("Checking modal:", modalContent, modalTitle, msgPrint);

            if (
                modalTitle &&
                modalTitle.textContent.trim() === 'Message' &&
                msgPrint &&
                msgPrint.innerHTML.trim() === 'No outstanding invoices found for the customer <strong>Suspense</strong> which qualify the filters you have specified.'
            ) {
                console.log("Closing modal with title 'Message'");

                // Try clicking the close button
                const closeButton = modalContent.querySelector('.btn-modal-close');
                if (closeButton) {
                    console.log("Found close button");
                    closeButton.click();
                    // Dispatching the click event explicitly
                    const event = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    closeButton.dispatchEvent(event);
                    console.log("Dispatched click event");

                    setTimeout(() => {
                        if (modal) {
                            // Fallback: remove modal directly if it still exists
                            modal.remove();
                            console.log("Removed modal directly after fallback");
                        }

                        // Ensure the body is scrollable
                        document.body.style.overflow = '';
                        document.body.classList.remove('modal-open');

                        // Hide the backdrop if present
                        const backdrop = document.querySelector('.modal-backdrop.fade.show');
                        if (backdrop) {
                            backdrop.remove();
                            console.log("Removed backdrop");
                        }
                    }, 500); // Reduced delay to 100 milliseconds
                } else {
                    // Fallback: remove modal directly if close button is not found
                    modal.remove();
                    console.log("Removed modal directly");

                    // Ensure the body is scrollable
                    document.body.style.overflow = '';
                    document.body.classList.remove('modal-open');

                    // Hide the backdrop if present
                    const backdrop = document.querySelector('.modal-backdrop.fade.show');
                    if (backdrop) {
                        backdrop.remove();
                        console.log("Removed backdrop");
                    }
                }
            }
        });
    }

    // Function to observe for changes in the DOM and apply the popup check logic
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    checkAndClosePopup();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial call to check for the popup in case it is already present
        checkAndClosePopup();
    }

    // Wait for the page to fully load before starting the observer
    window.addEventListener('load', observeDOMChanges);
})();
