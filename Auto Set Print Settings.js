// ==UserScript==
// @name         Auto Set Print Settings
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automatically sets the print orientation to Portrait, checks the "With Letterhead" checkbox, and sets the correct Letter Head based on the company name
// @author       You
// @match        https://erpnext.hpagroup.co.in/app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to log and update orientation
    function updateOrientation(modal) {
        console.log('Modal found:', modal);
        const orientationSelect = modal.querySelector('select[data-fieldname="orientation"]');
        if (orientationSelect) {
            console.log('Orientation select found:', orientationSelect);
            orientationSelect.value = 'Portrait';
            // Trigger the change event for the select element to update the UI
            const event = new Event('change', { bubbles: true });
            orientationSelect.dispatchEvent(event);
            console.log('Orientation set to Portrait');
        } else {
            console.log('Orientation select not found');
        }
    }

    // Function to log and check the "With Letter head" checkbox
    function checkLetterhead(modal) {
        console.log('Modal found:', modal);
        const letterHeadCheckbox = modal.querySelector('input[data-fieldname="with_letter_head"]');
        if (letterHeadCheckbox) {
            console.log('Letter head checkbox found:', letterHeadCheckbox);
            if (!letterHeadCheckbox.checked) {
                letterHeadCheckbox.click();
                console.log('"With Letter head" checkbox checked');
            } else {
                console.log('"With Letter head" checkbox already checked');
            }
        } else {
            console.log('Letter head checkbox not found');
        }
    }

    // Function to set the appropriate Letter Head based on the company name
    function setLetterHead(modal) {
        const letterHeadSelect = modal.querySelector('select[data-fieldname="letter_head"]');
        const companyField = document.querySelector('input[data-fieldname="company"]');
        if (letterHeadSelect && companyField) {
            console.log('Letter Head select found:', letterHeadSelect);
            const companyName = companyField.value;
            console.log('Company name:', companyName);
            if (companyName === 'H.P. AUTOMOTIVE') {
                letterHeadSelect.value = 'HP Letter head';
            } else if (companyName === 'HPA Group' || companyName === 'HPA TRANSTRADE PRIVATE LIMITED') {
                letterHeadSelect.value = 'HPA Letter head';
            } else if (companyName === 'HPA MAXMARK PRIVATE LIMITED') {
                letterHeadSelect.value = 'HPM Letter head';
            } else {
                console.log('No matching letter head for company:', companyName);
            }
            // Trigger the change event for the select element to update the UI
            const event = new Event('change', { bubbles: true });
            letterHeadSelect.dispatchEvent(event);
            console.log('Letter Head set based on company name');
        } else {
            if (!letterHeadSelect) console.log('Letter Head select not found');
            if (!companyField) console.log('Company field not found');
        }
    }

    // Wait for the modal to appear
    const observer = new MutationObserver(function(mutations, observer) {
        console.log('Mutation observed');
        const modal = document.querySelector('.modal-dialog');
        if (modal) {
            console.log('Modal dialog detected');
            updateOrientation(modal);
            checkLetterhead(modal);
            setLetterHead(modal);
            // Stop observing after making the changes
            observer.disconnect();
        } else {
            console.log('Modal dialog not detected');
        }
    });

    console.log('Starting observer');
    observer.observe(document.body, { childList: true, subtree: true });
})();
