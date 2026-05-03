// Admin Breeding List JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeBreedingList();
    initializeFilters();
    initializeModals();
    initializeBirthActions();
});

function initializeBreedingList() {
    // Set default dates
    setDefaultDates();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Initialize table sorting
    initializeTableSorting();
    
    // Load initial data
    loadBreedingData();
    
    // Check for urgent births
    checkUrgentBirths();
}

function setDefaultDates() {
    // Set today's date as default for pairing date
    const pairingDateInput = document.getElementById('pairing-date');
    if (pairingDateInput) {
        pairingDateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Set expected birth date (31 days from pairing)
    const expectedBirthInput = document.getElementById('expected-birth-date');
    if (expectedBirthInput && pairingDateInput) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + 31);
        expectedBirthInput.value = expectedDate.toISOString().split('T')[0];
    }
    
    // Set today's date for actual birth
    const actualBirthInput = document.getElementById('actual-birth-date');
    if (actualBirthInput) {
        actualBirthInput.value = new Date().toISOString().split('T')[0];
    }
}

function initializeFilters() {
    const birthFilter = document.getElementById('birth-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (birthFilter) {
        birthFilter.addEventListener('change', filterBirths);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterRecords);
    }
}

function initializeModals() {
    // Modal functions
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 300);
            }
        }
    };
    
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset form
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                setDefaultDates();
            }
        }
    };
    
    // Close modal handlers
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal on overlay click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
    
    // Form submissions
    const addForm = document.getElementById('add-breeding-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddBreeding);
    }
    
    const birthForm = document.getElementById('record-birth-form');
    if (birthForm) {
        birthForm.addEventListener('submit', handleRecordBirth);
    }
    
    // Auto-update expected birth date when pairing date changes
    const pairingDateInput = document.getElementById('pairing-date');
    const expectedBirthInput = document.getElementById('expected-birth-date');
    
    if (pairingDateInput && expectedBirthInput) {
        pairingDateInput.addEventListener('change', function() {
            const pairingDate = new Date(this.value);
            const expectedDate = new Date(pairingDate);
            expectedDate.setDate(pairingDate.getDate() + 31);
            expectedBirthInput.value = expectedDate.toISOString().split('T')[0];
        });
    }
}

function initializeBirthActions() {
    // Action functions
    window.recordBirth = function(breedingId) {
        openBirthModal(breedingId);
    };
    
    window.viewDetails = function(breedingId) {
        showBreedingDetails(breedingId);
    };
    
    window.deleteBreeding = function(breedingId) {
        if (confirm('Are you sure you want to delete this breeding record?')) {
            deleteBreedingRecord(breedingId);
        }
    };
    
    // Export function
    window.exportRecords = function() {
        exportBreedingRecords();
    };
}

function handleAddBreeding(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!data.male_rabbit_id || !data.female_rabbit_id || !data.pairing_date || !data.expected_birth_date) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Check if male and female are the same
    if (data.male_rabbit_id === data.female_rabbit_id) {
        alert('Male and female rabbits must be different');
        return;
    }
    
    // Submit data
    submitBreedingData(data, 'add');
}

function handleRecordBirth(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!data.actual_birth_date || !data.kits_born || !data.kits_survived) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate survival count
    if (parseInt(data.kits_survived) > parseInt(data.kits_born)) {
        alert('Kits survived cannot be more than kits born');
        return;
    }
    
    // Submit data
    submitBirthData(data);
}

function submitBreedingData(data, action) {
    // Show loading state
    const submitBtn = document.querySelector(`#${action}-breeding-form button[type="submit"]`);
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        closeModal('add-breeding-modal');
        
        // Show success message
        showNotification('Breeding pairing recorded successfully!', 'success');
        
        // Reload data
        loadBreedingData();
    }, 1500);
}

function submitBirthData(data) {
    // Show loading state
    const submitBtn = document.querySelector('#record-birth-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Recording...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        closeModal('record-birth-modal');
        
        // Show success message
        const survivalRate = Math.round((data.kits_survived / data.kits_born) * 100);
        showNotification(`Birth recorded successfully! ${data.kits_survived}/${data.kits_born} kits survived (${survivalRate}%)`, 'success');
        
        // Reload data
        loadBreedingData();
    }, 1500);
}

function openBirthModal(breedingId) {
    const modal = document.getElementById('record-birth-modal');
    const breedingIdInput = document.getElementById('birth-breeding-id');
    
    if (breedingIdInput) {
        breedingIdInput.value = breedingId;
    }
    
    openModal('record-birth-modal');
}

function filterBirths() {
    const filter = document.getElementById('birth-filter').value;
    const birthCards = document.querySelectorAll('.birth-card');
    
    birthCards.forEach(card => {
        const breedingId = card.dataset.breedingId;
        // In a real implementation, you'd check the actual breeding data
        // For now, we'll simulate based on card classes
        
        let showCard = true;
        
        if (filter === 'today' && !card.classList.contains('due-today')) {
            showCard = false;
        } else if (filter === 'overdue' && !card.classList.contains('overdue')) {
            showCard = false;
        } else if (filter === 'week' && card.classList.contains('overdue')) {
            showCard = false;
        }
        
        card.style.display = showCard ? '' : 'none';
    });
    
    updateBirthsVisibility();
}

function filterRecords() {
    const statusFilter = document.getElementById('status-filter').value;
    const rows = document.querySelectorAll('.breeding-table tbody tr');
    
    rows.forEach(row => {
        const statusCell = row.cells[7].textContent.toLowerCase();
        
        if (!statusFilter || statusCell.includes(statusFilter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateTableVisibility();
}

function updateBirthsVisibility() {
    const birthCards = document.querySelectorAll('.birth-card');
    const visibleCards = Array.from(birthCards).filter(card => card.style.display !== 'none');
    
    // Update section header
    const sectionHeader = document.querySelector('.births-section h2');
    if (sectionHeader) {
        sectionHeader.textContent = `Upcoming Births (${visibleCards.length})`;
    }
    
    // Show/hide no results message
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">No upcoming births found</div>
            <button class="btn-secondary" onclick="clearBirthFilter()">Clear Filter</button>
        `;
    }
    
    if (visibleCards.length === 0) {
        if (!document.querySelector('.births-section .no-results')) {
            document.querySelector('.births-grid').appendChild(noResultsMsg);
        }
    } else {
        if (noResultsMsg.parentElement) {
            noResultsMsg.remove();
        }
    }
}

function updateTableVisibility() {
    const rows = document.querySelectorAll('.breeding-table tbody tr');
    const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
    
    // Update section header
    const sectionHeader = document.querySelector('.records-section h2');
    if (sectionHeader) {
        sectionHeader.textContent = `Recent Breeding Records (${visibleRows.length})`;
    }
    
    // Show/hide no results message
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">No breeding records found</div>
            <button class="btn-secondary" onclick="clearStatusFilter()">Clear Filter</button>
        `;
    }
    
    if (visibleRows.length === 0) {
        if (!document.querySelector('.records-section .no-results')) {
            document.querySelector('.table-container').appendChild(noResultsMsg);
        }
    } else {
        if (noResultsMsg.parentElement) {
            noResultsMsg.remove();
        }
    }
}

function clearBirthFilter() {
    document.getElementById('birth-filter').value = '';
    filterBirths();
}

function clearStatusFilter() {
    document.getElementById('status-filter').value = '';
    filterRecords();
}

function showBreedingDetails(breedingId) {
    // Simulate loading breeding details
    setTimeout(() => {
        const breeding = {
            id: breedingId,
            male_rabbit_id: 'RBT-' + breedingId.toString().padStart(3, '0'),
            female_rabbit_id: 'RBT-' + (parseInt(breedingId) + 1).toString().padStart(3, '0'),
            pairing_date: new Date().toISOString().split('T')[0],
            expected_birth_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            actual_birth_date: null,
            kits_born: null,
            kits_survived: null,
            status: 'pregnant',
            notes: 'Healthy pair, good breeding prospects'
        };
        
        alert(`Breeding Details:\n\nMale: ${breeding.male_rabbit_id}\nFemale: ${breeding.female_rabbit_id}\nPairing Date: ${breeding.pairing_date}\nExpected Birth: ${breeding.expected_birth_date}\nStatus: ${breeding.status}\n\nNotes: ${breeding.notes}`);
    }, 500);
}

function deleteBreedingRecord(breedingId) {
    const row = document.querySelector(`tr:has(button[onclick*="${breedingId}"])`);
    if (row) {
        row.style.opacity = '0.5';
        
        setTimeout(() => {
            row.style.transform = 'translateX(-100%)';
            row.style.opacity = '0';
            setTimeout(() => {
                row.remove();
                updateTableVisibility();
                showNotification('Breeding record deleted successfully', 'success');
            }, 300);
        }, 1000);
    }
}

function exportBreedingRecords() {
    const exportBtn = document.querySelector('.records-actions .btn-secondary');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<span class="btn-icon">⏳</span> Exporting...';
    exportBtn.disabled = true;
    
    setTimeout(() => {
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
        showNotification('Breeding records exported successfully!', 'success');
    }, 2000);
}

function loadBreedingData() {
    // Simulate loading data
    const tableBody = document.querySelector('.breeding-table tbody');
    const birthsGrid = document.querySelector('.births-grid');
    
    if (tableBody) {
        tableBody.style.opacity = '0.5';
        setTimeout(() => tableBody.style.opacity = '1', 500);
    }
    
    if (birthsGrid) {
        birthsGrid.style.opacity = '0.5';
        setTimeout(() => birthsGrid.style.opacity = '1', 500);
    }
}

function checkUrgentBirths() {
    // Check for urgent births and show notifications
    const dueTodayCards = document.querySelectorAll('.birth-card.due-today');
    const overdueCards = document.querySelectorAll('.birth-card.overdue');
    
    if (dueTodayCards.length > 0) {
        setTimeout(() => {
            showNotification(`👶 ${dueTodayCards.length} birth(s) due today!`, 'warning');
        }, 2000);
    }
    
    if (overdueCards.length > 0) {
        setTimeout(() => {
            showNotification(`⚠️ ${overdueCards.length} birth(s) overdue!`, 'error');
        }, 4000);
    }
}

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            this.appendChild(tooltip);
            
            setTimeout(() => tooltip.classList.add('show'), 10);
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N: Add new breeding
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openModal('add-breeding-modal');
        }
        
        // Ctrl/Cmd + B: Record birth
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            // Find first due today or overdue breeding
            const firstUrgent = document.querySelector('.birth-card.due-today, .birth-card.overdue');
            if (firstUrgent) {
                recordBirth(firstUrgent.dataset.breedingId);
            }
        }
        
        // Ctrl/Cmd + E: Export records
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportBreedingRecords();
        }
    });
}

function initializeTableSorting() {
    const headers = document.querySelectorAll('.breeding-table th');
    headers.forEach((header, index) => {
        if (index < 8) { // Don't sort the actions column
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                sortTable(index);
            });
        }
    });
}

function sortTable(columnIndex) {
    const table = document.querySelector('.breeding-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Determine sort direction
    const currentSort = table.dataset.sortColumn === columnIndex.toString() ? table.dataset.sortDirection : 'asc';
    const newDirection = currentSort === 'asc' ? 'desc' : 'asc';
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Handle date columns
        if (columnIndex === 0 || columnIndex === 3 || columnIndex === 4) {
            const aDate = aValue === 'Pending' ? new Date(0) : new Date(aValue);
            const bDate = bValue === 'Pending' ? new Date(0) : new Date(bValue);
            return newDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }
        
        // Handle numeric columns
        if (columnIndex === 5 || columnIndex === 6) {
            const aNum = parseFloat(aValue.replace(/[^0-9]/g, '')) || 0;
            const bNum = parseFloat(bValue.replace(/[^0-9]/g, '')) || 0;
            return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // Handle text values
        return newDirection === 'asc' ? 
            aValue.localeCompare(bValue) : 
            bValue.localeCompare(aValue);
    });
    
    // Reorder rows
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort indicators
    updateSortIndicators(columnIndex, newDirection);
    
    // Store sort state
    table.dataset.sortColumn = columnIndex;
    table.dataset.sortDirection = newDirection;
}

function updateSortIndicators(columnIndex, direction) {
    const headers = document.querySelectorAll('.breeding-table th');
    headers.forEach((header, index) => {
        header.innerHTML = header.innerHTML.replace(/[▲▼]/g, '');
        if (index === columnIndex) {
            header.innerHTML += direction === 'asc' ? ' ▲' : ' ▼';
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add custom styles
const style = document.createElement('style');
style.textContent = `
    .tooltip {
        position: absolute;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        white-space: nowrap;
        z-index: 1000;
    }
    
    .tooltip.show {
        opacity: 1;
    }
    
    .no-results {
        text-align: center;
        padding: 60px 20px;
        color: #666;
    }
    
    .no-results-icon {
        font-size: 3rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    .no-results-text {
        font-size: 1.1rem;
        margin-bottom: 20px;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border-left: 4px solid #3a5c3e;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: #4caf50;
    }
    
    .notification-error {
        border-left-color: #f44336;
    }
    
    .notification-warning {
        border-left-color: #ff9800;
    }
`;
document.head.appendChild(style);
