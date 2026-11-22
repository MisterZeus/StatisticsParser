/**
 * Document initialization logic - extracted for testability.
 * Handles language setup, URL params, clipboard, scroll-to-top, and button handlers.
 */
import { initializeLanguage } from './assets/js/modules/language.js';
import {
    initializeUI,
    parseText
} from './assets/js/modules/ui.js';

export async function initalizeDocument() {
    const urlParams = new URLSearchParams(window.location.search);
    const languageType = urlParams.get('lang') || 'en';
    const urlStatsOutput = urlParams.get('data');

    // Initialize language
    window.langText = await initializeLanguage(languageType);

    // Initialize UI
    initializeUI(window.langText);

    document.querySelectorAll('[data-lang]').forEach(element => {
        element.addEventListener('click', async function (e) {
            e.preventDefault();
            window.langText = await initializeLanguage(this.dataset.lang);
            if (document.getElementById("statiotext").value) {
                parseText(window.langText);
            }
        });
    });

    // Parse URL-provided data after all handlers have been registered.
    if (urlStatsOutput !== null && urlStatsOutput !== '') {
        document.getElementById("statiotext").value = urlStatsOutput;
        parseText(window.langText);
    }
}
