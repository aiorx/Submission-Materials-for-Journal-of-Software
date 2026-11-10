// Supported via standard GitHub programming aids
// Global variables to store papers data and filtered results
let papersData = [];
let filteredPapers = [];
let currentView = 'grid';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadPapersData();
    setupEventListeners();
});

// Load and parse CSV data
async function loadPapersData() {
    try {
        const response = await fetch('data/articles.csv');
        const csvText = await response.text();
        papersData = parseCSV(csvText);

        // Remove header row and empty rows
        papersData = papersData.slice(1).filter(row => row[0] && row[0].trim());

        filteredPapers = [...papersData];

        // Initialize UI
        updateStats();
        populateFilters();
        displayPapers();

    } catch (error) {
        console.error('Error loading papers data:', error);
        showErrorMessage('Failed to load papers data. Please check if the CSV file exists.');
    }
}

// Parse CSV text into array of arrays
function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            // End of row
            if (currentField || currentRow.length > 0) {
                currentRow.push(currentField.trim());
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
            }
        } else {
            currentField += char;
        }
    }

    // Add final row if exists
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }

    return rows;
}

// Get paper object from CSV row
function getPaperFromRow(row) {
    return {
        name: row[0] || '',
        authors: row[1] || '',
        dataset: row[2] || '',
        target: row[3] || '',
        pdf: row[4] || '',
        link: row[5] || '',
        date: row[6] || '',
        keywords: row[7] || '',
        taskType: row[8] || '',
        evaluationType: row[9] || '',
        benchmarkType: row[10] || '',
        autonomyLevel: row[11] || '',
        testingObjective: row[12] || '',
        adaptability: row[13] || '',
        abstract: row[14] || '',
        overview: row[15] || '',
        summary: row[16] || ''
    };
}

// Update statistics in header
function updateStats() {
    document.getElementById('total-papers').textContent = papersData.length;

    const uniqueCategories = new Set();
    papersData.forEach(row => {
        const paper = getPaperFromRow(row);
        if (paper.taskType) uniqueCategories.add(paper.taskType);
        if (paper.evaluationType) uniqueCategories.add(paper.evaluationType);
        if (paper.autonomyLevel) uniqueCategories.add(paper.autonomyLevel);
    });

    document.getElementById('total-categories').textContent = uniqueCategories.size;
}

// Populate filter dropdowns with unique values
function populateFilters() {
    const taskTypes = new Set();
    const evaluationTypes = new Set();
    const autonomyLevels = new Set();
    const adaptabilityTypes = new Set();

    papersData.forEach(row => {
        const paper = getPaperFromRow(row);
        if (paper.taskType) taskTypes.add(paper.taskType);
        if (paper.evaluationType) evaluationTypes.add(paper.evaluationType);
        if (paper.autonomyLevel) autonomyLevels.add(paper.autonomyLevel);
        if (paper.adaptability) adaptabilityTypes.add(paper.adaptability);
    });

    // Populate filter dropdowns
    populateSelect('task-type-filter', Array.from(taskTypes).sort());
    populateSelect('evaluation-type-filter', Array.from(evaluationTypes).sort());
    populateSelect('autonomy-level-filter', Array.from(autonomyLevels).sort());
    populateSelect('adaptability-filter', Array.from(adaptabilityTypes).sort());
}

// Helper function to populate select elements
function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    const currentValue = select.value;

    // Clear existing options except the first one
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    // Restore previous selection if it exists
    if (currentValue && options.includes(currentValue)) {
        select.value = currentValue;
    }
}

// Display papers in the current view
function displayPapers() {
    const container = document.getElementById('papers-container');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');

    resultsCount.textContent = filteredPapers.length;

    if (filteredPapers.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    container.style.display = currentView === 'grid' ? 'grid' : 'flex';
    container.className = currentView === 'grid' ? 'papers-grid' : 'papers-list';
    noResults.style.display = 'none';

    container.innerHTML = '';

    filteredPapers.forEach((row, index) => {
        const paper = getPaperFromRow(row);
        const paperCard = createPaperCard(paper, index);
        container.appendChild(paperCard);
    });
}

// Create a paper card element
function createPaperCard(paper, index) {
    const card = document.createElement('div');
    card.className = 'paper-card';
    card.onclick = () => openPaperModal(paper);

    // Format date for display
    const formattedDate = formatDate(paper.date);

    // Create tags for categories
    const tags = [];
    if (paper.taskType) tags.push({ text: paper.taskType, class: 'task-type' });
    if (paper.evaluationType) tags.push({ text: paper.evaluationType, class: 'evaluation-type' });
    if (paper.autonomyLevel) tags.push({ text: paper.autonomyLevel, class: 'autonomy-level' });

    // Truncate abstract for card display
    const abstractPreview = paper.abstract.length > 300
        ? paper.abstract.substring(0, 300) + '...'
        : paper.abstract;

    // Check if paper has dataset/code
    const hasDataset = paper.dataset && paper.dataset.toLowerCase() !== 'n/a' && paper.dataset.trim() !== '';
    const hasCode = paper.link && (paper.link.includes('github.com') || paper.link.includes('gitlab.com'));

    // Check if link is ArXiv (either arxiv.org/abs/ or arxiv.org/pdf/)
    const isArxivLink = paper.link && (paper.link.includes('arxiv.org/abs/') || paper.link.includes('arxiv.org/pdf/'));

    // Convert ArXiv PDF links to abstract links for the ArXiv button
    const getArxivAbsLink = (link) => {
        if (link && link.includes('arxiv.org/pdf/')) {
            return link.replace('arxiv.org/pdf/', 'arxiv.org/abs/').replace('.pdf', '');
        }
        return link;
    };

    card.innerHTML = `
        <div class="paper-content">
            <h3 class="paper-title">${escapeHtml(paper.name)}</h3>
            <p class="paper-authors">${escapeHtml(paper.authors)}</p>
            <p class="paper-date">${formattedDate}</p>
            <div class="paper-tags">
                ${tags.map(tag => `<span class="tag ${tag.class}">${escapeHtml(tag.text)}</span>`).join('')}
            </div>
            <p class="paper-abstract">${escapeHtml(abstractPreview)}</p>
            <div class="paper-actions">
                ${isArxivLink ? `<a href="${getArxivAbsLink(paper.link)}" target="_blank" class="btn btn-primary">📖 ArXiv</a>` : ''}
                ${paper.pdf ? `<a href="${paper.pdf}" target="_blank" class="btn btn-secondary">📄 PDF</a>` : ''}
                ${!isArxivLink && paper.link ? `<a href="${paper.link}" target="_blank" class="btn btn-secondary">🔗 Link</a>` : ''}
                ${hasCode ? `<button class="btn btn-secondary" onclick="event.stopPropagation(); openCodeDemo()">💻 Code</button>` : ''}
                ${hasDataset && !hasCode ? `<button class="btn btn-secondary" onclick="event.stopPropagation(); openDatasetDemo()">📊 Dataset</button>` : ''}
                <button class="btn btn-outline" onclick="event.stopPropagation(); openPaperModal(${JSON.stringify(paper).replace(/"/g, '&quot;')})">Details</button>
            </div>
        </div>
    `;

    return card;
}

// Format date string for display
function formatDate(dateStr) {
    if (!dateStr) return 'Date not available';

    // Try to parse various date formats
    const formats = [
        /^(\w+)\s+(\d{4})$/i, // "April 2025"
        /^(\w+)\s+(\d{1,2}),?\s+(\d{4})$/i, // "April 15, 2025"
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // "2025-04-15"
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/ // "04/15/2025"
    ];

    const monthNames = {
        'january': 'Jan', 'february': 'Feb', 'march': 'Mar', 'april': 'Apr',
        'may': 'May', 'june': 'Jun', 'july': 'Jul', 'august': 'Aug',
        'september': 'Sep', 'october': 'Oct', 'november': 'Nov', 'december': 'Dec'
    };

    // Format: "Month Year"
    const monthYearMatch = dateStr.match(formats[0]);
    if (monthYearMatch) {
        const month = monthNames[monthYearMatch[1].toLowerCase()] || monthYearMatch[1];
        return `${month} ${monthYearMatch[2]}`;
    }

    return dateStr;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup event listeners
function setupEventListeners() {
    // Search input with debounce
    let searchTimeout;
    document.getElementById('search-input').addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    // Enter key in search
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Modal close on outside click
    document.getElementById('paper-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Perform search based on search input
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();

    if (!searchTerm) {
        applyFilters();
        return;
    }

    filteredPapers = papersData.filter(row => {
        const paper = getPaperFromRow(row);
        return (
            paper.name.toLowerCase().includes(searchTerm) ||
            paper.authors.toLowerCase().includes(searchTerm) ||
            paper.abstract.toLowerCase().includes(searchTerm) ||
            paper.keywords.toLowerCase().includes(searchTerm) ||
            paper.taskType.toLowerCase().includes(searchTerm) ||
            paper.evaluationType.toLowerCase().includes(searchTerm) ||
            paper.autonomyLevel.toLowerCase().includes(searchTerm)
        );
    });

    // Apply other filters to search results
    applyAdditionalFilters();
    displayPapers();
}

// Apply all filters
function applyFilters() {
    // Start with all papers or search results
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();

    if (searchTerm) {
        performSearch();
        return;
    }

    filteredPapers = [...papersData];
    applyAdditionalFilters();
    displayPapers();
}

// Apply additional filters (excluding search)
function applyAdditionalFilters() {
    const taskTypeFilter = document.getElementById('task-type-filter').value;
    const evaluationTypeFilter = document.getElementById('evaluation-type-filter').value;
    const autonomyLevelFilter = document.getElementById('autonomy-level-filter').value;
    const adaptabilityFilter = document.getElementById('adaptability-filter').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;

    filteredPapers = filteredPapers.filter(row => {
        const paper = getPaperFromRow(row);

        // Task type filter
        if (taskTypeFilter && paper.taskType !== taskTypeFilter) {
            return false;
        }

        // Evaluation type filter
        if (evaluationTypeFilter && paper.evaluationType !== evaluationTypeFilter) {
            return false;
        }

        // Autonomy level filter
        if (autonomyLevelFilter && paper.autonomyLevel !== autonomyLevelFilter) {
            return false;
        }

        // Adaptability filter
        if (adaptabilityFilter && paper.adaptability !== adaptabilityFilter) {
            return false;
        }

        // Date range filter
        if (dateFrom || dateTo) {
            const paperDate = parseDateForComparison(paper.date);
            if (paperDate) {
                if (dateFrom && paperDate < new Date(dateFrom)) {
                    return false;
                }
                if (dateTo && paperDate > new Date(dateTo)) {
                    return false;
                }
            }
        }

        return true;
    });
}

// Parse date string for comparison
function parseDateForComparison(dateStr) {
    if (!dateStr) return null;

    // Try parsing "Month Year" format
    const monthYearMatch = dateStr.match(/^(\w+)\s+(\d{4})$/i);
    if (monthYearMatch) {
        const monthNames = {
            'january': 0, 'february': 1, 'march': 2, 'april': 3,
            'may': 4, 'june': 5, 'july': 6, 'august': 7,
            'september': 8, 'october': 9, 'november': 10, 'december': 11
        };
        const monthIndex = monthNames[monthYearMatch[1].toLowerCase()];
        if (monthIndex !== undefined) {
            return new Date(parseInt(monthYearMatch[2]), monthIndex, 1);
        }
    }

    // Fallback to Date parsing
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('task-type-filter').value = '';
    document.getElementById('evaluation-type-filter').value = '';
    document.getElementById('autonomy-level-filter').value = '';
    document.getElementById('adaptability-filter').value = '';
    document.getElementById('date-from').value = '';
    document.getElementById('date-to').value = '';

    filteredPapers = [...papersData];
    displayPapers();
}

// Toggle between grid and list view
function toggleView(view) {
    currentView = view;

    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    displayPapers();
}

// Open paper details modal
function openPaperModal(paper) {
    const modal = document.getElementById('paper-modal');
    const modalBody = document.getElementById('modal-body');

    // Check if paper has dataset/code
    const hasDataset = paper.dataset && paper.dataset.toLowerCase() !== 'n/a' && paper.dataset.trim() !== '';
    const hasCode = paper.link && (paper.link.includes('github.com') || paper.link.includes('gitlab.com'));

    // Check if link is ArXiv (either arxiv.org/abs/ or arxiv.org/pdf/)
    const isArxivLink = paper.link && (paper.link.includes('arxiv.org/abs/') || paper.link.includes('arxiv.org/pdf/'));

    // Convert ArXiv PDF links to abstract links for the ArXiv button
    const getArxivAbsLink = (link) => {
        if (link && link.includes('arxiv.org/pdf/')) {
            return link.replace('arxiv.org/pdf/', 'arxiv.org/abs/').replace('.pdf', '');
        }
        return link;
    };

    modalBody.innerHTML = `
        <div class="modal-paper-details">
            <h2 class="modal-title">${escapeHtml(paper.name)}</h2>
            <p class="modal-authors"><strong>Authors:</strong> ${escapeHtml(paper.authors)}</p>
            <p class="modal-date"><strong>Date:</strong> ${formatDate(paper.date)}</p>

            ${paper.keywords ? `<p class="modal-keywords"><strong>Keywords:</strong> ${escapeHtml(paper.keywords)}</p>` : ''}

            <div class="modal-categories">
                ${paper.taskType ? `<p><strong>Task Type:</strong> <span class="tag task-type">${escapeHtml(paper.taskType)}</span></p>` : ''}
                ${paper.evaluationType ? `<p><strong>Evaluation Type:</strong> <span class="tag evaluation-type">${escapeHtml(paper.evaluationType)}</span></p>` : ''}
                ${paper.autonomyLevel ? `<p><strong>Autonomy Level:</strong> <span class="tag autonomy-level">${escapeHtml(paper.autonomyLevel)}</span></p>` : ''}
                ${paper.adaptability ? `<p><strong>Adaptability:</strong> ${escapeHtml(paper.adaptability)}</p>` : ''}
                ${paper.testingObjective ? `<p><strong>Testing Objective:</strong> ${escapeHtml(paper.testingObjective)}</p>` : ''}
                ${paper.benchmarkType ? `<p><strong>Benchmark Type:</strong> ${escapeHtml(paper.benchmarkType)}</p>` : ''}
            </div>

            ${paper.abstract ? `
                <div class="modal-section">
                    <h3>Abstract</h3>
                    <p>${escapeHtml(paper.abstract)}</p>
                </div>
            ` : ''}

            ${paper.overview ? `
                <div class="modal-section">
                    <h3>Overview</h3>
                    <p>${escapeHtml(paper.overview)}</p>
                </div>
            ` : ''}

            ${paper.summary ? `
                <div class="modal-section">
                    <h3>Summary</h3>
                    <p>${escapeHtml(paper.summary)}</p>
                </div>
            ` : ''}

            ${paper.dataset ? `
                <div class="modal-section">
                    <h3>Dataset</h3>
                    <p>${escapeHtml(paper.dataset)}</p>
                </div>
            ` : ''}

            <div class="modal-actions">
                ${isArxivLink ?
                    `<a href="${getArxivAbsLink(paper.link)}" target="_blank" class="btn btn-primary">📖 ArXiv</a>
                     <a href="${paper.link}" target="_blank" class="btn btn-secondary">📄 PDF</a>` :
                    paper.pdf ? `<a href="${paper.pdf}" target="_blank" class="btn btn-primary">📄 Read Paper</a>` :
                    paper.link ? `<a href="${paper.link}" target="_blank" class="btn btn-primary">📄 Paper</a>` : ''
                }
                ${!isArxivLink && paper.link && paper.link !== paper.pdf ? `<a href="${paper.link}" target="_blank" class="btn btn-secondary">🔗 View Link</a>` : ''}
                ${hasCode ? `<button class="btn btn-secondary" onclick="openCodeDemo()">💻 Code Demo</button>` : ''}
                ${hasDataset && !hasCode ? `<button class="btn btn-secondary" onclick="openDatasetDemo()">📊 Dataset Demo</button>` : ''}
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('paper-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show error message
function showErrorMessage(message) {
    const container = document.getElementById('papers-container');
    container.innerHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Demo functions for code and dataset buttons
function openCodeDemo() {
    alert('This is a demo code button. In a real implementation, this would link to the code repository or open a code viewer.');
}

function openDatasetDemo() {
    alert('This is a demo dataset button. In a real implementation, this would link to the dataset or open a dataset explorer.');
}
