// ==UserScript==
// @name         Auto Set Print Settings
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Automatically sets the print orientation to Portrait, checks the "With Letterhead" checkbox, and sets the correct Letter Head based on the company name. Additionally, handles column selection based on company name.
// @author       You
// @match        https://erpnext.hpagroup.co.in/app/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/Auto%20Set%20Print%20Settings.js
// @downloadURL  https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/Auto%20Set%20Print%20Settings.js
// ==/UserScript==

(function() {
    'use strict';

    function updateOrientation(modal) {
        const orientationSelect = modal.querySelector('select[data-fieldname="orientation"]');
        if (orientationSelect) {
            orientationSelect.value = 'Portrait';
            const event = new Event('change', { bubbles: true });
            orientationSelect.dispatchEvent(event);
        }
    }

    function checkLetterhead(modal) {
        const letterHeadCheckbox = modal.querySelector('input[data-fieldname="with_letter_head"]');
        if (letterHeadCheckbox && !letterHeadCheckbox.checked) {
            letterHeadCheckbox.click();
        }
    }

    function setLetterHead(modal, companyName) {
        const letterHeadSelect = modal.querySelector('select[data-fieldname="letter_head"]');
        if (letterHeadSelect) {
            if (companyName === 'H.P. AUTOMOTIVE') {
                letterHeadSelect.value = 'HP Letter head';
            } else if (companyName === 'HPA TRANSTRADE PRIVATE LIMITED') {
                letterHeadSelect.value = 'HPA Letter head';
            } else if (companyName === 'HPA MAXMARK PRIVATE LIMITED') {
                letterHeadSelect.value = 'HPM Letter head';
            } else if (companyName === 'HPA Group') {
                letterHeadSelect.value = ''; // Do not select anything for HPA Group
            }
            const event = new Event('change', { bubbles: true });
            letterHeadSelect.dispatchEvent(event);
        }
    }

    function handleColumnSelection(modal, companyName) {
        if (companyName !== 'HPA Group') {
            const pickColumnsCheckbox = modal.querySelector('input[data-fieldname="pick_columns"]');
            if (pickColumnsCheckbox && !pickColumnsCheckbox.checked) {
                pickColumnsCheckbox.click();
            }

            setTimeout(() => {
                const selectAllButton = modal.querySelector('button.select-all');
                if (selectAllButton) {
                    selectAllButton.click();

                    setTimeout(() => {
                        const companyColumnCheckbox = modal.querySelector('input[data-unit="company"]');
                        if (companyColumnCheckbox && companyColumnCheckbox.checked) {
                            companyColumnCheckbox.click();
                        }
                    }, 500); // Delay to ensure the checkboxes are rendered
                }
            }, 500); // Delay to ensure the modal is fully rendered
        }
    }

    function handleModal(modal) {
        updateOrientation(modal);
        checkLetterhead(modal);
        const companyField = document.querySelector('input[data-fieldname="company"]');
        if (companyField) {
            const companyName = companyField.value;
            setLetterHead(modal, companyName);
            handleColumnSelection(modal, companyName);
        }
    }

    const observer = new MutationObserver(function(mutations) {
        const modal = document.querySelector('.modal-dialog');
        if (modal) {
            handleModal(modal);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
