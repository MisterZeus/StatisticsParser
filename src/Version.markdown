# StatisticsIOParser Version History #

## Version 0.6.0 ##
November 22, 2026

- Fixed URL data parsing so pasted Statistics IO and Time output is parsed after UI initialization.
- Removed duplicate clipboard, scroll-to-top, scrollbar, and button initialization.
- Added the missing shared parse-and-display function and corrected language switching to reparse existing output.
- Fixed broken About-page language links and malformed external links.
- Removed parser debug output and removed the Clipboard.js and Luxon runtime dependencies.
- Replaced Luxon duration and timestamp formatting with native JavaScript and Intl APIs.
- Replaced Clipboard.js with the browser Clipboard API and a compatibility fallback.
- Unified the project on `datatables.net-bs5` and removed duplicate DataTables packages.
- Improved parser table-name and timing-line handling, including regex escaping and malformed-input guards.
- Added skip-navigation links, `<main>` landmarks, textarea labels, navigation labels, and scroll-button button semantics.
- Removed obsolete HTML markup and duplicate CDN styles.
- Modernized Sass imports, removed legacy CSS declarations and unnecessary `!important` rules, and improved responsive layouts.
- Removed the Bootstrap Icons dependency and replaced the remaining icon glyphs with accessible text characters.
- Updated Vite, Vitest, coverage tooling, jsdom, Sass, Bootstrap, and DataTables to current releases.
- Added Popper as the explicit Bootstrap dropdown peer dependency.
- Fixed Vitest 5 global setup compatibility and restored the coverage test script.
- Updated package metadata, Node.js requirements, README instructions, and build configuration.
- Added coverage output to `.gitignore`.
- Corrected remaining About-page markup and removed stale inline styles.
- All 69 regression tests pass and the production build succeeds.

## Version 0.5.0 ##
June 1, 2025

- Refactored the application to separate the parsing of the data and the displaying of the parsed data.
- Output with columns "page server reads", "page server read-ahead reads", "lob page server reads", "lob page server read-ahead reads" are now being parsed and totaled.
- Added a "Copy Results" button to copy the parsed output.
- Now formatting the "Completion Time" timestamp.
- Removed the "Change Page Title" functionality. This will be reimplemented in the future.
- Moved the "Show Example" checkbox to under the options dropdown.
- Implemented Vite for bundling the application.
- Added a language dropdown.
- Added a scroll to top button at the bottom of the page.
- Migrated css to scss.
- Split JavaScript into modules.
- Added unit test for modules.
- Now using NPM for packages.
- Package changes:
  - Bootstrap upgraded to v5.3.6 
  - jQuery updated to v3.7.1
  - DataTables updated to v2.3.0 
  - jQuery cookies removed. Functionality moved to local storage.
  - Moment replaced with Luxon as Moment has reached end of development
  - Purl removed in favor of a pure JavaScripe solution
  - Numeral removed in favor of a pure JavaScripe solution
  - Bootstrap Glyphicon removed in favor of Bootstrap-icon
  - Clipboard added to project

## Version 0.4.4 ##
July 13, 2014

- Added the ability for a Statistics IO output be passed through a URL parameter named data.

## Version 0.4.3 ##
June 18, 2014

- Fixed a bug that prevented the output table from being reset if there were more than one Statistics IO output.

## Version 0.4.2 ##
May 26, 2014

- Fixed a bug that prevented the a output table from being written.

## Version 0.4.1 ##
April 29, 2014

- Now parses SQL Server errors and displays them in red.

## Version 0.4.0 ##
April 27, 2014

- Rebranded site to StatisticsParser.com
- Created a favion.

## Version 0.3.3 ##
April 27, 2014

- Added an option to make tables scrollable.
- Upgraded project to Bootstrap 3

## Version 0.3.2 ##
April 25, 2014

- Fixed an error that bootstrap was throwing upon load.
- Fixed an issue where site wouldn't parse in IE 8.
- Moved language data into JSON files.
- Applied formatting to Rows Affected text.
- Created new sample query based on StackOverflow database.

## Version 0.3.1 ##
April 14, 2014

- Output from Statistics Time are now formatted in hh:mm:ss.000 format.
- Version number now a js funciton.

## Version 0.3.0 ##
April 9, 2014

- Output from Statistics Time are now formatted and totaled.

## Version 0.2.4 ##
March 7, 2014

- Numbers in the table are now formatted.

## Version 0.2.3 ##
February 11, 2014

- Added a clear button. If there is a result displayed the clear button will clear the result. If there is no result displayed the clear button will clear the text area.
- Changed the Parse button color to blue. Because blue. 

## Version 0.2.2 ##
January 28, 2014

- Corrected the table headers for Spanish Statistics IO output. 

## Version 0.2.1 ##
January 27, 2014

- Statistics IO output in Spanish will be parsed. 

## Version 0.2.0 ##
January 26, 2014

- Information that isn't Statistics IO output will not be placed in a data table it will be written as text. 
- If more than one output from Statistics IO is intended to be parsed a table will be created for each output.

## Version 0.1.0 ##
May 14, 2013

- Initial version. 
- This version will take Statistics IO output from a SQL Server query and parse it. 
- All output will be put in the output table.