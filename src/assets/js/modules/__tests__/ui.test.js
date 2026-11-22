import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    clearResultElement,
    clearResult,
    toggleCheckmark,
    includeExample,
    initializeScrollToTop,
    initializeClipboard,
    toggleResultControls,
    initializeUI,
    copyResultText
} from '../ui.js';
import { parseData } from '../parser.js';

// Mock storage module
vi.mock('../storage.js', () => ({
    getTableScrollbarPreference: vi.fn().mockReturnValue(true),
    toggleStoredBoolean: vi.fn().mockReturnValue(true)
}));

// Mock parser module
vi.mock('../parser.js', () => ({
    parseData: vi.fn().mockReturnValue({
        data: [{ rowtype: 1 }]
    })
}));

vi.mock('../displaystats.js', () => ({
    displayParsedData: vi.fn()
}));

describe('UI Module', () => {
    let mockElements;

    beforeEach(() => {
        // Create a simpler mock structure
        mockElements = {
            result: {
                firstChild: null,
                children: [],
                removeChild: function(child) {
                    const index = this.children.indexOf(child);
                    if (index > -1) {
                        this.children.splice(index, 1);
                    }
                    this.firstChild = this.children[0] || null;
                }
            },
            resultControls: {
                style: { display: 'none' }
            },
            clearButton: {
                innerHTML: '',
                textContent: ''
            },
            copyResultButton: {
                textContent: 'Copy Result',
                addEventListener: vi.fn()
            },
            statiotext: {
                value: ''
            },
            scrollToTop: {
                classList: {
                    add: vi.fn(),
                    remove: vi.fn()
                },
                addEventListener: vi.fn()
            },
            exampleOptionCheck: {
                parentElement: {
                    onclick: null
                }
            },
            scrollbarOptionCheck: {
                style: { display: 'none' },
                parentElement: {
                    onclick: null
                }
            },
            parseButton: {
                onclick: null
            }
        };

        // Setup document mock
        global.document = {
            getElementById: vi.fn((id) => mockElements[id])
        };

        // Setup window mock
        global.window = {
            addEventListener: vi.fn(),
            pageYOffset: 0,
            scrollTo: vi.fn()
        };

        // Reset parseText mock before each test
        vi.fn().mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
        // Clean up mocks
        Object.values(mockElements).forEach(element => {
            if (element.classList) {
                element.classList.add.mockClear();
                element.classList.remove.mockClear();
            }
        });
    });

    describe('clearResultElement', () => {
        it('should clear result element and update UI', () => {
            const resultElement = mockElements.result;
            const child = { some: 'child' };
            resultElement.firstChild = child;
            resultElement.children = [child];

            clearResultElement(resultElement, {
                buttonclear: 'Clear'
            });

            expect(resultElement.children.length).toBe(0);
            expect(resultElement.firstChild).toBeNull();
            expect(mockElements.resultControls.style.display).toBe('none');
            expect(mockElements.clearButton.textContent).toBe('Clear');
        });
    });

    describe('clearResult', () => {
        it('should clear result element when it has children', () => {
            const resultElement = mockElements.result;
            const child = { some: 'child' };
            resultElement.children = [child];
            resultElement.firstChild = child;

            clearResult({});

            expect(resultElement.children.length).toBe(0);
            expect(resultElement.firstChild).toBeNull();
        });

        it('should clear textarea when result has no children', () => {
            mockElements.result.children = [];
            mockElements.result.firstChild = null;
            clearResult({});
            expect(mockElements.statiotext.value).toBe('');
        });
    });

    describe('toggleCheckmark', () => {
        it('should toggle checkmark visibility', () => {
            const checkmarkSpan = {
                style: { display: 'none' }
            };

            toggleCheckmark(checkmarkSpan, 'testKey');

            expect(checkmarkSpan.style.display).toBe('');
        });
    });

    describe('includeExample', () => {
        it('should include example text when value is true', () => {
            includeExample(true, {
                sampleoutput: 'Sample output text'
            });
            expect(mockElements.statiotext.value).toBe('Sample output text');
        });

        it('should clear textarea when value is false', () => {
            includeExample(false, {
                sampleoutput: 'Sample output text'
            });
            expect(mockElements.statiotext.value).toBe('');
        });
    });

    describe('initializeScrollToTop', () => {
        it('should initialize scroll to top functionality', () => {
            initializeScrollToTop();

            expect(global.window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
            expect(global.document.getElementById('scrollToTop').addEventListener)
                .toHaveBeenCalledWith('click', expect.any(Function));
        });

        it('should show button when scrolled down', () => {
            initializeScrollToTop();
            const scrollHandler = global.window.addEventListener.mock.calls[0][1];
            
            global.window.pageYOffset = 200;
            scrollHandler();

            expect(mockElements.scrollToTop.classList.add)
                .toHaveBeenCalledWith('visible');
        });

        it('should hide button when scrolled to top', () => {
            initializeScrollToTop();
            const scrollHandler = global.window.addEventListener.mock.calls[0][1];
            
            global.window.pageYOffset = 0;
            scrollHandler();

            expect(mockElements.scrollToTop.classList.remove)
                .toHaveBeenCalledWith('visible');
        });
    });

    describe('initializeClipboard', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            mockElements.result.textContent = 'Parsed result';
            global.navigator = {
                clipboard: {
                    writeText: vi.fn().mockResolvedValue(undefined)
                }
            };
        });

        afterEach(() => {
            vi.useRealTimers();
            delete global.navigator;
        });

        it('should initialize clipboard functionality', () => {
            initializeClipboard({
                buttoncopyresultmessage: 'Copied!'
            });

            expect(mockElements.copyResultButton.addEventListener)
                .toHaveBeenCalledWith('click', expect.any(Function));
        });

        it('should handle successful copy', async () => {
            initializeClipboard({
                buttoncopyresultmessage: 'Copied!'
            });

            const clickHandler = mockElements.copyResultButton.addEventListener.mock.calls[0][1];
            await clickHandler();

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Parsed result');
            expect(mockElements.copyResultButton.textContent).toBe('Copied!');
            vi.advanceTimersByTime(2000);
            expect(mockElements.copyResultButton.textContent).toBe('Copy Result');
        });

        it('should handle copy error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            global.navigator = {
                clipboard: {
                    writeText: vi.fn().mockRejectedValue(new Error('copy failed'))
                }
            };

            initializeClipboard({
                buttoncopyresultmessage: 'Copied!'
            });

            const clickHandler = mockElements.copyResultButton.addEventListener.mock.calls[0][1];
            await clickHandler();

            expect(consoleSpy).toHaveBeenCalledWith('Failed to copy text:', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });

    describe('toggleResultControls', () => {
        it('should show controls when hasData is true', () => {
            toggleResultControls(true);
            expect(mockElements.resultControls.style.display).toBe('block');
        });

        it('should hide controls when hasData is false', () => {
            toggleResultControls(false);
            expect(mockElements.resultControls.style.display).toBe('none');
        });
    });

    describe('initializeUI', () => {
        it('should initialize all UI components', () => {
            initializeUI({
                buttonclear: 'Clear',
                buttonclearresult: 'Clear Result',
                buttoncopyresultmessage: 'Copied!',
                sampleoutput: 'Sample output text'
            });

            expect(mockElements.copyResultButton.addEventListener)
                .toHaveBeenCalledWith('click', expect.any(Function));
            expect(global.window.addEventListener).toHaveBeenCalled();
            expect(mockElements.scrollbarOptionCheck.style.display).toBe('');
        });
    });

    describe('Button Handlers', () => {
        let mockLang;

        beforeEach(() => {
            mockLang = {
                buttonclear: 'Clear',
                buttonclearresult: 'Clear Result',
                sampleoutput: 'Sample output text'
            };

            // Initialize UI to set up button handlers
            initializeUI(mockLang);
        });

        describe('Parse Button Handler', () => {
            it('should clear result and parse text when clicked', async () => {
                const parseButton = mockElements.parseButton;
                const resultElement = mockElements.result;
                
                // Add some initial content
                resultElement.children = [{ some: 'child' }];
                resultElement.firstChild = resultElement.children[0];

                // Trigger click handler
                parseButton.onclick();

                // Verify result was cleared
                expect(resultElement.children.length).toBe(0);
                expect(resultElement.firstChild).toBeNull();

                // Verify clear button text was updated
                expect(mockElements.clearButton.textContent).toBe(mockLang.buttonclearresult);

                // Verify result controls were shown
                expect(mockElements.resultControls.style.display).toBe('block');

                // Verify parser was called
                expect(parseData).toHaveBeenCalled();
            });
        });

        describe('Clear Button Handler', () => {
            it('should clear result element when it has children', () => {
                const clearButton = mockElements.clearButton;
                const resultElement = mockElements.result;
                
                // Add some initial content
                resultElement.children = [{ some: 'child' }];
                resultElement.firstChild = resultElement.children[0];

                // Trigger click handler
                clearButton.onclick();

                // Verify result was cleared
                expect(resultElement.children.length).toBe(0);
                expect(resultElement.firstChild).toBeNull();
            });

            it('should clear textarea when result has no children', () => {
                const clearButton = mockElements.clearButton;
                const resultElement = mockElements.result;
                
                // Set initial state
                resultElement.children = [];
                resultElement.firstChild = null;
                mockElements.statiotext.value = 'Some text';

                // Trigger click handler
                clearButton.onclick();

                // Verify textarea was cleared
                expect(mockElements.statiotext.value).toBe('');
            });
        });

        describe('Example Option Handler', () => {
            it('should include example text when clicked', () => {
                const exampleOption = mockElements.exampleOptionCheck.parentElement;
                
                // Trigger click handler
                exampleOption.onclick({ preventDefault: vi.fn() });

                // Verify example text was included
                expect(mockElements.statiotext.value).toBe(mockLang.sampleoutput);
            });
        });

        describe('Scrollbar Option Handler', () => {
            it('should toggle checkmark when clicked', () => {
                const scrollbarOption = mockElements.scrollbarOptionCheck.parentElement;
                const checkmarkSpan = mockElements.scrollbarOptionCheck;
                
                // Set initial state
                checkmarkSpan.style.display = 'none';

                // Trigger click handler
                scrollbarOption.onclick({ preventDefault: vi.fn() });

                // Verify checkmark was toggled
                expect(checkmarkSpan.style.display).toBe('');
            });
        });
    });
}); 