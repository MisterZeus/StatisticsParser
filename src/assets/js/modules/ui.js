import {
    getTableScrollbarPreference,
    toggleStoredBoolean
} from './storage.js';
import { parseData } from './parser.js';
import { displayParsedData } from './displaystats.js';


// UI module for handling user interface elements and interactions

/**
 * Clears the result element and updates UI state
 * @param {HTMLElement} resultElement - The result container element
 * @param {Object} lang - Language object for text
 */
export function clearResultElement(resultElement, lang) {
    if (!resultElement) return;
    while (resultElement.firstChild) {
        resultElement.removeChild(resultElement.firstChild);
    }
    const resultControls = document.getElementById("resultControls");
    if (resultControls) resultControls.style.display = 'none';

    if(lang.buttonclear) {
        const clearButton = document.getElementById("clearButton");
        if (clearButton) clearButton.textContent = lang.buttonclear;
    }
}

/**
 * Clears the textarea or result based on current state
 * @param {Object} lang - Language object for text
 */
export function clearResult(lang) {
    const resultElement = document.getElementById("result");
    if (resultElement.children.length > 0) {
        clearResultElement(resultElement, lang);
    } else {
        document.getElementById("statiotext").value = '';
    }
}

/**
 * Toggles the visibility of a checkmark and updates localStorage
 * @param {HTMLElement} checkmarkSpan - The checkmark element
 * @param {string} storageKey - The localStorage key
 */
export function toggleCheckmark(checkmarkSpan, storageKey) {
    const newValue = toggleStoredBoolean(storageKey);
    checkmarkSpan.style.display = newValue ? '' : 'none';
}

/**
 * Includes example text in the textarea
 * @param {boolean} value - Whether to show example
 * @param {Object} lang - Language object containing example text
 */
export function includeExample(value, lang) {
    const txt = document.getElementById("statiotext");
    txt.value = value ? lang.sampleoutput : "";
}

export function parseText(lang) {
    clearResultElement(document.getElementById("result"), lang);

    const iotext = document.getElementById("statiotext").value;
    const showScrollbar = getTableScrollbarPreference();
    const parsedData = parseData(iotext, lang);
    displayParsedData(parsedData, showScrollbar, lang);

    if (lang.buttonclearresult) {
        document.getElementById("clearButton").textContent = lang.buttonclearresult;
    }

    toggleResultControls(parsedData.data.length > 0);
    return parsedData;
}

/**
 * Initializes the scroll-to-top button functionality
 */
export function initializeScrollToTop() {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (!scrollToTopButton) return;

    window.addEventListener('scroll', () => {
        if ((window.scrollY ?? window.pageYOffset ?? 0) > 100) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });
    
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initializes clipboard functionality
 * @param {Object} lang - Language object for button text
 */
export async function copyResultText() {
    const result = document.getElementById('result');
    const text = result?.innerText || result?.textContent || '';

    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = typeof document.execCommand === 'function'
        && document.execCommand('copy');
    textarea.remove();

    if (!copied) {
        throw new Error('Unable to copy result');
    }
}

export function initializeClipboard(lang) {
    const button = document.getElementById('copyResultButton');
    if (!button) return;

    button.addEventListener('click', async () => {
        const originalText = button.textContent;
        try {
            await copyResultText();
            button.textContent = lang.buttoncopyresultmessage;
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    });
}

/**
 * Shows or hides the result controls based on data presence
 * @param {boolean} hasData - Whether there is data to display
 */
export function toggleResultControls(hasData) {
    const resultControls = document.getElementById("resultControls");
    if (resultControls) resultControls.style.display = hasData ? 'block' : 'none';
}

/**
 * Initializes all UI components
 * @param {Object} lang - Language object for text
 */
export function initializeUI(lang) {
    // Initialize scroll-to-top functionality
    initializeScrollToTop();
    
    // Initialize clipboard
    initializeClipboard(lang);
    
    // Set up scrollbar option
    if(getTableScrollbarPreference()) {
        const scrollbarOption = document.getElementById("scrollbarOptionCheck");
        if (scrollbarOption) scrollbarOption.style.display = '';
    }
    
    // Set up button handlers
    setupButtonHandlers(lang);
}

/**
 * Sets up button click handlers
 * @param {Object} lang - Language object for text
 */
function setupButtonHandlers(lang) {
    // Parse button
    const parseButton = document.getElementById('parseButton');
    if (parseButton) parseButton.onclick = function() {
        parseText(window.langText || lang);
    };

    // Clear button
    const clearButton = document.getElementById('clearButton');
    if (clearButton) clearButton.onclick = function() {
        clearResult(window.langText || lang);
    };

    // Example option
    const exampleOption = document.getElementById('exampleOptionCheck')?.parentElement;
    if (exampleOption) exampleOption.onclick = function(e) {
        e.preventDefault();
        includeExample(true, lang);
    };

    // Scrollbar option
    const scrollbarOption = document.getElementById('scrollbarOptionCheck')?.parentElement;
    if (scrollbarOption) scrollbarOption.onclick = function(e) {
        e.preventDefault();
        toggleCheckmark(document.getElementById("scrollbarOptionCheck"), 'tableScrollbar');
    };
} 