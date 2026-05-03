// Admin Feeding List JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeFeedingList();
    initializeFilters();
    initializeModals();
    initializeScheduleActions();
});

function initializeFeedingList() {
    // Set current date/time for feeding form
    setCurrentDateTime();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Initialize table sorting
    initializeTableSorting();
    
    // Load initial data
    loadFeedingData();
}

function setCurrentDateTime() {
    const feedingTimeInput = document.getElementById('feeding-time');
    if (feedingTimeInput) {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        feedingTimeInput.value = localDateTime;
    }
}

function initializeFilters() {
    const blockFilter = document.getElementById('block-filter');
    const dateFilter = document.getElementById('date-filter');
    
    if (blockFilter) {
        blockFilter.addEventListener('change', filterSchedule);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterRecords);
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
                setCurrentDateTime();
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
    
    // Form submission
    const addForm = document.getElementById('add-feeding-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddFeeding);
    }
    
    // Batch feeding checkbox
    const batchCheckbox = document.getElementById('batch-feeding');
    if (batchCheckbox) {
        batchCheckbox.addEventListener('change', function() {
            const rabbitSelect = document.getElementById('rabbit-select');
            if (this.checked) {
                rabbitSelect.disabled = true;
                rabbitSelect.value = '';
            } else {
                rabbitSelect.disabled = false;
            }
        });
    }
}

function initializeScheduleActions() {
    // Action functions
    window.markComplete = function(feedingId) {
        markFeedingComplete(feedingId);
    };
    
    window.markAllComplete = function() {
        if (confirm('Mark all pending feedings as complete?')) {
            markAllFeedingsComplete();
        }
    };
    
    // Feeding record actions
    window.viewFeeding = function(feedingId) {
        showFeedingDetails(feedingId);
    };
    
    window.editFeeding = function(feedingId) {
        openEditModal(feedingId);
    };
    
    window.deleteFeeding = function(feedingId) {
        if (confirm('Are you sure you want to delete this feeding record?')) {
            deleteFeedingRecord(feedingId);
        }
    };
    
    // Export function
    window.exportRecords = function() {
        exportFeedingRecords();
    };
}

function handleAddFeeding(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Handle batch feeding
    const isBatch = document.getElementById('batch-feeding').checked;
    if (isBatch) {
        data.batch_feeding = true;
        data.rabbit_id = null; // Will be determined by block
    }
    
    // Validate required fields
    if (!data.feed_type || !data.quantity || !data.cage_or_block) {
        if (!isBatch && !data.rabbit_id) {
            alert('Please select a rabbit or enable batch feeding');
            return;
        }
        alert('Please fill in all required fields');
        return;
    }
    
    // Submit data
    submitFeedingData(data, 'add');
}

function submitFeedingData(data, action) {
    // Show loading state
    const submitBtn = document.querySelector(`#${action}-feeding-form button[type="submit"]`);
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        closeModal('add-feeding-modal');
        
        // Show success message
        showNotification(`Feeding ${action === 'add' ? 'recorded' : 'updated'} successfully!`, 'success');
        
        // Reload data
        loadFeedingData();
        
        // Update schedule if applicable
        updateScheduleDisplay();
    }, 1500);
}

function markFeedingComplete(feedingId) {
    const feedingItem = document.querySelector(`[data-feeding-id="${feedingId}"]`);
    if (feedingItem) {
        // Show loading state
        feedingItem.style.opacity = '0.5';
        
        // Simulate API call
        setTimeout(() => {
            // Update UI
            feedingItem.classList.remove('pending');
            feedingItem.classList.add('completed');
            
            // Update actions
            const actionsDiv = feedingItem.querySelector('.feeding-actions');
            const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            actionsDiv.innerHTML = `<span class="completed-time">${now}</span>`;
            
            feedingItem.style.opacity = '1';
            
            // Update block status
            updateBlockStatus(feedingItem.closest('.block-card'));
            
            showNotification('Feeding marked as complete', 'success');
        }, 1000);
    }
}

function markAllFeedingsComplete() {
    const pendingItems = document.querySelectorAll('.feeding-item.pending');
    let completedCount = 0;
    
    pendingItems.forEach(item => {
        setTimeout(() => {
            markFeedingComplete(item.dataset.feedingId);
            completedCount++;
            
            if (completedCount === pendingItems.length) {
                showNotification(`Marked ${completedCount} feedings as complete`, 'success');
            }
        }, Math.random() * 1000); // Stagger the updates
    });
}

function updateBlockStatus(blockCard) {
    const feedings = blockCard.querySelectorAll('.feeding-item');
    const completedFeedings = blockCard.querySelectorAll('.feeding-item.completed');
    const statusDiv = blockCard.querySelector('.block-status');
    
    if (feedings.length === completedFeedings.length) {
        statusDiv.className = 'block-status complete';
        statusDiv.textContent = '✅ Complete';
    } else {
        statusDiv.className = 'block-status pending';
        statusDiv.textContent = '⏳ Pending';
    }
}

function filterSchedule() {
    const blockFilter = document.getElementById('block-filter').value;
    const blockCards = document.querySelectorAll('.block-card');
    
    blockCards.forEach(card => {
        if (!blockFilter || card.dataset.block === blockFilter) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterRecords() {
    const dateFilter = document.getElementById('date-filter').value;
    const rows = document.querySelectorAll('.feeding-table tbody tr');
    
    rows.forEach(row => {
        const dateCell = row.cells[0].textContent;
        const rowDate = dateCell.split(' ')[0];
        
        if (!dateFilter || rowDate === dateFilter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateTableVisibility();
}

function updateTableVisibility() {
    const rows = document.querySelectorAll('.feeding-table tbody tr');
    const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
    
    // Update section header
    const sectionHeader = document.querySelector('.records-section h2');
    if (sectionHeader) {
        sectionHeader.textContent = `Recent Feeding Records (${visibleRows.length})`;
    }
    
    // Show/hide no results message
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">No feeding records found for the selected date</div>
            <button class="btn-secondary" onclick="clearDateFilter()">Clear Filter</button>
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

function clearDateFilter() {
    document.getElementById('date-filter').value = '';
    filterRecords();
}

function showFeedingDetails(feedingId) {
    // Simulate loading feeding details
    setTimeout(() => {
        const feeding = {
            id: feedingId,
            rabbit_id: 'RBT-' + feedingId.toString().padStart(3, '0'),
            feed_type: 'Pellets',
            quantity: 200,
            cage_or_block: 'Block A',
            feeding_time: new Date().toLocaleString(),
            recorded_by: 'John Doe',
            notes: 'Normal feeding'
        };
        
        alert(`Feeding Details:\n\nRabbit: ${feeding.rabbit_id}\nFeed Type: ${feeding.feed_type}\nQuantity: ${feeding.quantity}g\nBlock: ${feeding.cage_or_block}\nTime: ${feeding.feeding_time}\nRecorded By: ${feeding.recorded_by}\n\nNotes: ${feeding.notes}`);
    }, 500);
}

function openEditModal(feedingId) {
    // Load feeding data
    showFeedingDetails(feedingId);
    
    // For now, just show details
    // In a real implementation, this would open an edit modal
}

function deleteFeedingRecord(feedingId) {
    const row = document.querySelector(`tr:has(button[onclick*="${feedingId}"])`);
    if (row) {
        row.style.opacity = '0.5';
        
        setTimeout(() => {
            row.style.transform = 'translateX(-100%)';
            row.style.opacity = '0';
            setTimeout(() => {
                row.remove();
                updateTableVisibility();
                showNotification('Feeding record deleted successfully', 'success');
            }, 300);
        }, 1000);
    }
}

function exportFeedingRecords() {
    const exportBtn = document.querySelector('.records-actions .btn-secondary');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<span class="btn-icon">⏳</span> Exporting...';
    exportBtn.disabled = true;
    
    setTimeout(() => {
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
        showNotification('Feeding records exported successfully!', 'success');
    }, 2000);
}

function loadFeedingData() {
    // Simulate loading data
    const tableBody = document.querySelector('.feeding-table tbody');
    if (tableBody) {
        tableBody.style.opacity = '0.5';
        
        setTimeout(() => {
            tableBody.style.opacity = '1';
        }, 500);
    }
}

function updateScheduleDisplay() {
    // Update the schedule display after adding new feeding
    const scheduleGrid = document.querySelector('.schedule-grid');
    if (scheduleGrid) {
        scheduleGrid.style.opacity = '0.5';
        
        setTimeout(() => {
            scheduleGrid.style.opacity = '1';
        }, 500);
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
        // Ctrl/Cmd + N: Add new feeding
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openModal('add-feeding-modal');
        }
        
        // Ctrl/Cmd + E: Export records
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportFeedingRecords();
        }
        
        // Ctrl/Cmd + M: Mark all complete
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            markAllComplete();
        }
    });
}

function initializeTableSorting() {
    const headers = document.querySelectorAll('.feeding-table th');
    headers.forEach((header, index) => {
        if (index < 6) { // Don't sort the actions column
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                sortTable(index);
            });
        }
    });
}

function sortTable(columnIndex) {
    const table = document.querySelector('.feeding-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Determine sort direction
    const currentSort = table.dataset.sortColumn === columnIndex.toString() ? table.dataset.sortDirection : 'asc';
    const newDirection = currentSort === 'asc' ? 'desc' : 'asc';
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Handle date/time column
        if (columnIndex === 0) {
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            return newDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }
        
        // Handle numeric values
        if (columnIndex === 3) { // Quantity column
            const aNum = parseFloat(aValue.replace(/[^0-9.]/g, '')) || 0;
            const bNum = parseFloat(bValue.replace(/[^0-9.]/g, '')) || 0;
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
    const headers = document.querySelectorAll('.feeding-table th');
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
    }, 3000);
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
