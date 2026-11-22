// Import Bootstrap's JS for navbar and dropdown behavior
import 'bootstrap'
import 'datatables.net-bs5';

import { initalizeDocument } from './initialize.js';

// Initialize on document ready using native JavaScript
document.addEventListener('DOMContentLoaded', async function() {
    await initalizeDocument();
});

export { initalizeDocument };
