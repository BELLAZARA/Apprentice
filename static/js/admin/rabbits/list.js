// Admin Rabbits List JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeRabbitsList();
    initializeSearch();
    initializeFilters();
    initializeModals();
    initializeTableActions();
});

function initializeRabbitsList() {
    // Initialize tooltips
    initializeTooltips();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Initialize table sorting
    initializeTableSorting();
    
    // Load initial data
    loadRabbitsData();
}

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

function initializeFilters() {
    const filters = ['breed-filter', 'status-filter', 'location-filter'];
    
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
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
    const addForm = document.getElementById('add-rabbit-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddRabbit);
    }
    
    const editForm = document.getElementById('edit-rabbit-form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditRabbit);
    }
}

function initializeTableActions() {
    // Rabbit action functions
    window.viewRabbit = function(rabbitId) {
        showRabbitDetails(rabbitId);
    };
    
    window.editRabbit = function(rabbitId) {
        openEditModal(rabbitId);
    };
    
    window.deleteRabbit = function(rabbitId) {
        if (confirm('Are you sure you want to delete this rabbit? This action cannot be undone.')) {
            deleteRabbitRecord(rabbitId);
        }
    };
    
    // Export function
    window.exportData = function() {
        exportRabbitsData();
    };
    
    // Reset filters
    window.resetFilters = function() {
        document.getElementById('search-input').value = '';
        document.getElementById('breed-filter').value = '';
        document.getElementById('status-filter').value = '';
        document.getElementById('location-filter').value = '';
        loadRabbitsData();
    };
}

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.rabbits-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updateTableVisibility();
}

function applyFilters() {
    const breedFilter = document.getElementById('breed-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    
    const rows = document.querySelectorAll('.rabbits-table tbody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        if (breedFilter && row.cells[1].textContent !== breedFilter) {
            showRow = false;
        }
        
        if (statusFilter && !row.cells[5].textContent.toLowerCase().includes(statusFilter)) {
            showRow = false;
        }
        
        if (locationFilter && row.cells[4].textContent !== locationFilter) {
            showRow = false;
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    updateTableVisibility();
}

function updateTableVisibility() {
    const rows = document.querySelectorAll('.rabbits-table tbody tr');
    const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
    
    // Update table header
    const tableHeader = document.querySelector('.table-header h2');
    if (tableHeader) {
        tableHeader.textContent = `All Rabbits (${visibleRows.length})`;
    }
    
    // Show/hide no results message
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">No rabbits found matching your criteria</div>
            <button class="btn-secondary" onclick="resetFilters()">Reset Filters</button>
        `;
    }
    
    if (visibleRows.length === 0) {
        if (!document.querySelector('.no-results')) {
            document.querySelector('.table-container').appendChild(noResultsMsg);
        }
    } else {
        if (noResultsMsg.parentElement) {
            noResultsMsg.remove();
        }
    }
}

function handleAddRabbit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!data.rabbit_id || !data.breed || !data.gender || !data.date_of_birth || !data.cage_location) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Submit data
    submitRabbitData(data, 'add');
}

function handleEditRabbit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Submit data
    submitRabbitData(data, 'edit');
}

function submitRabbitData(data, action) {
    // Show loading state
    const submitBtn = document.querySelector(`#${action}-rabbit-form button[type="submit"]`);
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        closeModal(`${action}-rabbit-modal`);
        
        // Show success message
        showNotification(`Rabbit ${action === 'add' ? 'added' : 'updated'} successfully!`, 'success');
        
        // Reload data
        loadRabbitsData();
    }, 1500);
}

function openEditModal(rabbitId) {
    // Load rabbit data
    loadRabbitDetails(rabbitId, function(rabbit) {
        const modal = document.getElementById('edit-rabbit-modal');
        const form = document.getElementById('edit-rabbit-form');
        
        // Populate form fields
        form.innerHTML = `
            <input type="hidden" id="edit-rabbit-id" name="rabbit_id" value="${rabbit.id}">
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-rabbit-id-field">Rabbit ID *</label>
                    <input type="text" id="edit-rabbit-id-field" name="rabbit_id" value="${rabbit.rabbit_id}" required>
                </div>
                <div class="form-group">
                    <label for="edit-breed">Breed *</label>
                    <select id="edit-breed" name="breed" required>
                        <option value="California" ${rabbit.breed === 'California' ? 'selected' : ''}>California</option>
                        <option value="New Zealand" ${rabbit.breed === 'New Zealand' ? 'selected' : ''}>New Zealand</option>
                        <option value="Flemish Giant" ${rabbit.breed === 'Flemish Giant' ? 'selected' : ''}>Flemish Giant</option>
                        <option value="Dutch" ${rabbit.breed === 'Dutch' ? 'selected' : ''}>Dutch</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-gender">Gender *</label>
                    <select id="edit-gender" name="gender" required>
                        <option value="male" ${rabbit.gender === 'male' ? 'selected' : ''}>Male</option>
                        <option value="female" ${rabbit.gender === 'female' ? 'selected' : ''}>Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-status">Status *</label>
                    <select id="edit-status" name="status" required>
                        <option value="active" ${rabbit.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="sold" ${rabbit.status === 'sold' ? 'selected' : ''}>Sold</option>
                        <option value="deceased" ${rabbit.status === 'deceased' ? 'selected' : ''}>Deceased</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-cage-location">Cage Location *</label>
                    <input type="text" id="edit-cage-location" name="cage_location" value="${rabbit.cage_location}" required>
                </div>
                <div class="form-group">
                    <label for="edit-current-weight">Current Weight (g)</label>
                    <input type="number" id="edit-current-weight" name="current_weight" value="${rabbit.current_weight || ''}" placeholder="0">
                </div>
            </div>
            
            <div class="form-group">
                <label for="edit-notes">Notes</label>
                <textarea id="edit-notes" name="notes" rows="3">${rabbit.notes || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal('edit-rabbit-modal')">Cancel</button>
                <button type="submit" class="btn-primary">Update Rabbit</button>
            </div>
        `;
        
        openModal('edit-rabbit-modal');
    });
}

function loadRabbitDetails(rabbitId, callback) {
    // Simulate API call to get rabbit details
    setTimeout(() => {
        const rabbit = {
            id: rabbitId,
            rabbit_id: 'RBT-' + rabbitId.toString().padStart(3, '0'),
            breed: 'California',
            gender: 'male',
            status: 'active',
            cage_location: 'Block A',
            current_weight: 2100,
            notes: 'Healthy and active'
        };
        callback(rabbit);
    }, 500);
}

function showRabbitDetails(rabbitId) {
    loadRabbitDetails(rabbitId, function(rabbit) {
        // Create details modal or navigate to details page
        alert(`Rabbit Details:\n\nID: ${rabbit.rabbit_id}\nBreed: ${rabbit.breed}\nGender: ${rabbit.gender}\nStatus: ${rabbit.status}\nLocation: ${rabbit.cage_location}\nWeight: ${rabbit.current_weight}g\n\nNotes: ${rabbit.notes}`);
    });
}

function deleteRabbitRecord(rabbitId) {
    // Show loading state
    const row = document.querySelector(`tr[data-rabbit-id="${rabbitId}"]`);
    if (row) {
        row.style.opacity = '0.5';
    }
    
    // Simulate API call
    setTimeout(() => {
        if (row) {
            row.style.transform = 'translateX(-100%)';
            row.style.opacity = '0';
            setTimeout(() => {
                row.remove();
                updateTableVisibility();
                showNotification('Rabbit deleted successfully', 'success');
            }, 300);
        }
    }, 1000);
}

function exportRabbitsData() {
    // Show loading state
    const exportBtn = document.querySelector('.table-actions .btn-secondary');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<span class="btn-icon">⏳</span> Exporting...';
    exportBtn.disabled = true;
    
    // Simulate export process
    setTimeout(() => {
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
        showNotification('Data exported successfully!', 'success');
    }, 2000);
}

function loadRabbitsData() {
    // Simulate loading data
    const tableBody = document.querySelector('.rabbits-table tbody');
    if (tableBody) {
        // Add loading state
        tableBody.style.opacity = '0.5';
        
        setTimeout(() => {
            tableBody.style.opacity = '1';
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
        // Ctrl/Cmd + N: Add new rabbit
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openModal('add-rabbit-modal');
        }
        
        // Ctrl/Cmd + F: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl/Cmd + E: Export data
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportRabbitsData();
        }
    });
}

function initializeTableSorting() {
    const headers = document.querySelectorAll('.rabbits-table th');
    headers.forEach((header, index) => {
        if (index < 7) { // Don't sort the actions column
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                sortTable(index);
            });
        }
    });
}

function sortTable(columnIndex) {
    const table = document.querySelector('.rabbits-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Determine sort direction
    const currentSort = table.dataset.sortColumn === columnIndex.toString() ? table.dataset.sortDirection : 'asc';
    const newDirection = currentSort === 'asc' ? 'desc' : 'asc';
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Handle numeric values
        if (columnIndex === 6) { // Weight column
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
    const headers = document.querySelectorAll('.rabbits-table th');
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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
