// ==UserScript==
// @name         ERPNext Print Format Adjuster
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Adjust print format based on invoice number for Sales and Purchase Invoices
// @author       H.P. AUTOMOTIVE
// @match        https://erpnext.hpagroup.co.in/app/*
// @match        https://hpa-group.frappe.cloud/app/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/ERPNext%20Print%20Format%20Adjuster.js
// @downloadURL  https://raw.githubusercontent.com/hpautomotive/tampermonkey-hide_item_description_in_erpnext/main/ERPNext%20Print%20Format%20Adjuster.js
// ==/UserScript==

(function() {
    'use strict';

    function setPrintFormat(format) {
        console.log(`Setting print format to: ${format}`);
        let input = document.querySelector('input[data-fieldname="print_format"]');
        if (input) {
            // Check if the value is already set correctly to avoid unnecessary changes
            if (input.value !== format) {
                input.value = format;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }, 100); // Slight delay to ensure the input change is processed correctly
                console.log(`Print format set successfully to: ${format}`);
            } else {
                console.log('Print format is already set correctly.');
            }
        } else {
            console.log('Print format input field not found.');
        }
    }

    function adjustPrintFormat() {
        const url = window.location.href;
        console.log(`Current URL: ${url}`);
        const salesInvoicePattern = /Sales%20Invoice\/(HP%2FS|HM%2FS|HT%2FS|HP%2FCN|HM%2FCN|HT%2FCN|HP%2FP|HM%2FP|HT%2FP)[^\/]*/;
        const purchaseInvoicePattern = /Purchase%20Invoice\/(HPA%2FPI|HP%2FPI|HPM%2FPI|HPA%2FDN|HP%2FDN|HPM%2FDN)[^\/]*/;

        let match = url.match(salesInvoicePattern);

        if (match) {
            const invoiceNumber = match[1];
            console.log(`Matched Sales Invoice number: ${invoiceNumber}`);

            if (invoiceNumber.startsWith('HP%2FS') || invoiceNumber.startsWith('HM%2FS') || invoiceNumber.startsWith('HT%2FS')) {
                setPrintFormat("HPA - Sales Invoice (For PDF Sharing)");
            } else if (invoiceNumber.startsWith('HP%2FCN') || invoiceNumber.startsWith('HM%2FCN') || invoiceNumber.startsWith('HT%2FCN')) {
                setPrintFormat("HPA - Credit Note (For PDF Sharing)");
            } else if (invoiceNumber.startsWith('HP%2FP') || invoiceNumber.startsWith('HM%2FP') || invoiceNumber.startsWith('HT%2FP')) {
                setPrintFormat("HPA POS Invoice - Cash");
            } else {
                console.log('Sales Invoice number pattern not recognized.');
            }
        } else {
            match = url.match(purchaseInvoicePattern);

            if (match) {
                const invoiceNumber = match[1];
                console.log(`Matched Purchase Invoice number: ${invoiceNumber}`);

                if (invoiceNumber.startsWith('HPA%2FPI') || invoiceNumber.startsWith('HP%2FPI') || invoiceNumber.startsWith('HPM%2FPI')) {
                    setPrintFormat("HPA - Purchase Invoice (For PDF Sharing)");
                } else if (invoiceNumber.startsWith('HPA%2FDN') || invoiceNumber.startsWith('HP%2FDN') || invoiceNumber.startsWith('HPM%2FDN')) {
                    setPrintFormat("HPA - Debit Note (For PDF Sharing)");
                } else {
                    console.log('Purchase Invoice number pattern not recognized.');
                }
            } else {
                console.log('No matching invoice pattern found in URL.');
            }
        }
    }

    function initObserver() {
        const targetNode = document.querySelector('body');
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const url = window.location.href;
                    if (url.includes('/app/print/')) {
                        adjustPrintFormat();
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    window.addEventListener('load', () => {
        // Delay the execution to ensure the page is fully loaded
        setTimeout(() => {
            adjustPrintFormat();
            initObserver();
        }, 1000); // 1 second delay to ensure everything is loaded
    });
})();
