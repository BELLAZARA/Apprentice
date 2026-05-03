// Admin Outcomes List JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeOutcomesList();
    initializeFilters();
    initializeModals();
    initializeCharts();
    initializeFollowUpActions();
});

function initializeOutcomesList() {
    // Initialize tooltips
    initializeTooltips();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Initialize table sorting
    initializeTableSorting();
    
    // Load initial data
    loadOutcomesData();
    
    // Initialize progress bars
    initializeProgressBars();
    
    // Initialize impact scores
    initializeImpactScores();
}

function initializeFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const resultFilter = document.getElementById('result-filter');
    const periodFilter = document.getElementById('period-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterOutcomes);
    }
    
    if (resultFilter) {
        resultFilter.addEventListener('change', filterOutcomes);
    }
    
    if (periodFilter) {
        periodFilter.addEventListener('change', refreshAnalysis);
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
                setCurrentDate();
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
    const addForm = document.getElementById('add-outcome-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddOutcome);
    }
    
    // Follow-up checkbox handler
    const followUpCheckbox = document.getElementById('follow-up-required');
    const followUpDateInput = document.getElementById('follow-up-date');
    
    if (followUpCheckbox && followUpDateInput) {
        followUpCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Set default follow-up date (14 days from outcome)
                const followUpDate = new Date();
                followUpDate.setDate(followUpDate.getDate() + 14);
                followUpDateInput.value = followUpDate.toISOString().split('T')[0];
                followUpDateInput.required = true;
            } else {
                followUpDateInput.value = '';
                followUpDateInput.required = false;
            }
        });
    }
}

function initializeCharts() {
    // Draw category success chart
    drawCategoryChart();
    
    // Initialize chart animations
    setTimeout(() => animateCharts(), 500);
}

function drawCategoryChart() {
    const canvas = document.getElementById('category-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = [
        { category: 'Feeding', success: 75 },
        { category: 'Breeding', success: 82 },
        { category: 'Health', success: 68 },
        { category: 'Sales', success: 91 }
    ];
    
    // Simple pie chart
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    let currentAngle = -Math.PI / 2;
    const total = data.reduce((sum, item) => sum + item.success, 0);
    
    data.forEach((item, index) => {
        const sliceAngle = (item.success / total) * 2 * Math.PI;
        
        // Draw slice
        const colors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'];
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.category, labelX, labelY);
        ctx.fillText(item.success + '%', labelX, labelY + 12);
        
        currentAngle += sliceAngle;
    });
}

function animateCharts() {
    // Animate impact bars
    const impactFills = document.querySelectorAll('.impact-fill');
    impactFills.forEach(fill => {
        const progress = fill.dataset.progress;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = progress + '%';
        }, 100);
    });
    
    // Animate score bars
    const scoreFills = document.querySelectorAll('.score-fill');
    scoreFills.forEach(fill => {
        const score = fill.dataset.score;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = (score * 10) + '%';
        }, 100);
    });
}

function initializeProgressBars() {
    const progressFills = document.querySelectorAll('.impact-fill');
    progressFills.forEach(fill => {
        const progress = fill.dataset.progress;
        if (progress) {
            fill.style.width = progress + '%';
        }
    });
}

function initializeImpactScores() {
    const scoreFills = document.querySelectorAll('.score-fill');
    scoreFills.forEach(fill => {
        const score = fill.dataset.score;
        if (score) {
            fill.style.width = (score * 10) + '%';
        }
    });
}

function initializeFollowUpActions() {
    // Follow-up functions
    window.completeFollowUp = function(followupId) {
        completeFollowUpAction(followupId);
    };
    
    window.rescheduleFollowUp = function(followupId) {
        rescheduleFollowUpAction(followupId);
    };
    
    window.viewDecision = function(followupId) {
        viewDecisionDetails(followupId);
    };
    
    // Outcome functions
    window.viewDetails = function(outcomeId) {
        showOutcomeDetails(outcomeId);
    };
    
    window.editOutcome = function(outcomeId) {
        openEditModal(outcomeId);
    };
    
    window.addFollowUp = function(outcomeId) {
        openFollowUpModal(outcomeId);
    };
    
    window.deleteOutcome = function(outcomeId) {
        if (confirm('Are you sure you want to delete this outcome?')) {
            deleteOutcomeRecord(outcomeId);
        }
    };
    
    // Export function
    window.exportRecords = function() {
        exportOutcomesData();
    };
    
    // Analysis functions
    window.refreshAnalysis = function() {
        refreshAnalysisData();
    };
}

function handleAddOutcome(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!data.decision_id || !data.result_description || !data.result_type || !data.outcome_date) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Submit data
    submitOutcomeData(data, 'add');
}

function submitOutcomeData(data, action) {
    // Show loading state
    const submitBtn = document.querySelector('#add-outcome-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        closeModal('add-outcome-modal');
        
        // Show success message
        showNotification('Outcome recorded successfully!', 'success');
        
        // Reload data
        loadOutcomesData();
        
        // Update analysis
        refreshAnalysisData();
    }, 1500);
}

function completeFollowUpAction(followupId) {
    const followupCard = document.querySelector(`[data-followup-id="${followupId}"]`);
    if (followupCard) {
        followupCard.style.opacity = '0.5';
        
        setTimeout(() => {
            followupCard.style.transform = 'translateX(-100%)';
            followupCard.style.opacity = '0';
            setTimeout(() => {
                followupCard.remove();
                showNotification('Follow-up completed', 'success');
            }, 300);
        }, 1000);
    }
}

function rescheduleFollowUpAction(followupId) {
    // Simulate rescheduling
    showNotification('Follow-up rescheduled successfully', 'success');
}

function viewDecisionDetails(followupId) {
    // Simulate loading decision details
    setTimeout(() => {
        alert(`Follow-up Details:\n\nDecision: Decision about feeding optimization\nDate: 2024-01-15\nFollow-up Required: Yes\nNotes: Monitor feed efficiency for 2 weeks\n\nThis follow-up is scheduled for 2024-01-29`);
    }, 500);
}

function showOutcomeDetails(outcomeId) {
    // Simulate loading outcome details
    setTimeout(() => {
        alert(`Decision Outcome Details:\n\nDecision: Feeding Schedule Optimization\nCategory: Feeding\nResult: Successful\nImpact Score: 8/10\nOutcome Date: 2024-01-20\n\nResult Description: The new feeding schedule resulted in 15% feed cost reduction while maintaining rabbit health.\n\nImpact Assessment: Positive impact on operational costs and efficiency.\n\nLessons Learned: Gradual changes to feeding schedules are more effective than sudden changes.`);
    }, 500);
}

function openEditModal(outcomeId) {
    showOutcomeDetails(outcomeId);
    // In a real implementation, this would open an edit modal
}

function openFollowUpModal(outcomeId) {
    // Simulate opening follow-up modal
    alert(`Follow-up scheduling for outcome ID: ${outcomeId}\n\nThis would open a modal to schedule follow-up actions.`);
}

function deleteOutcomeRecord(outcomeId) {
    const row = document.querySelector(`tr:has(button[onclick*="${outcomeId}"])`);
    if (row) {
        row.style.opacity = '0.5';
        
        setTimeout(() => {
            row.style.transform = 'translateX(-100%)';
            row.style.opacity = '0';
            setTimeout(() => {
                row.remove();
                showNotification('Outcome deleted successfully', 'success');
            }, 300);
        }, 1000);
    }
}

function exportOutcomesData() {
    const exportBtn = document.querySelector('.records-actions .btn-secondary');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<span class="btn-icon">⏳</span> Exporting...';
    exportBtn.disabled = true;
    
    setTimeout(() => {
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
        showNotification('Outcomes data exported successfully!', 'success');
    }, 2000);
}

function refreshAnalysisData() {
    const analysisCards = document.querySelectorAll('.analysis-card');
    analysisCards.forEach(card => {
        card.style.opacity = '0.5';
        
        setTimeout(() => {
            card.style.opacity = '1';
        }, 500);
    });
    
    // Redraw charts with new data
    setTimeout(() => {
        drawCategoryChart();
        animateCharts();
    }, 600);
    
    showNotification('Analysis data refreshed', 'info');
}

function filterOutcomes() {
    const categoryFilter = document.getElementById('category-filter').value;
    const resultFilter = document.getElementById('result-filter').value;
    const rows = document.querySelectorAll('.outcomes-table tbody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        // Check category filter
        if (categoryFilter) {
            const categoryCell = row.cells[2].textContent.toLowerCase();
            if (!categoryCell.includes(categoryFilter)) {
                showRow = false;
            }
        }
        
        // Check result filter
        if (resultFilter && showRow) {
            const resultCell = row.cells[3].textContent.toLowerCase();
            if (!resultCell.includes(resultFilter.replace('_', ' '))) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    updateTableVisibility();
}

function updateTableVisibility() {
    const rows = document.querySelectorAll('.outcomes-table tbody tr');
    const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
    
    // Update section header
    const sectionHeader = document.querySelector('.records-section h2');
    if (sectionHeader) {
        sectionHeader.textContent = `Recent Decision Outcomes (${visibleRows.length})`;
    }
    
    // Show/hide no results message
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">No outcomes found matching your criteria</div>
            <button class="btn-secondary" onclick="clearFilters()">Clear Filters</button>
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

function clearFilters() {
    document.getElementById('category-filter').value = '';
    document.getElementById('result-filter').value = '';
    filterOutcomes();
}

function loadOutcomesData() {
    // Simulate loading data
    const tableBody = document.querySelector('.outcomes-table tbody');
    if (tableBody) {
        tableBody.style.opacity = '0.5';
        setTimeout(() => tableBody.style.opacity = '1', 500);
    }
}

function setCurrentDate() {
    const outcomeDateInput = document.getElementById('outcome-date');
    if (outcomeDateInput) {
        outcomeDateInput.value = new Date().toISOString().split('T')[0];
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
        // Ctrl/Cmd + N: Add new outcome
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openModal('add-outcome-modal');
        }
        
        // Ctrl/Cmd + E: Export records
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportOutcomesData();
        }
        
        // Ctrl/Cmd + R: Refresh analysis
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            refreshAnalysisData();
        }
    });
}

function initializeTableSorting() {
    const headers = document.querySelectorAll('.outcomes-table th');
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
    const table = document.querySelector('.outcomes-table');
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
        if (columnIndex === 0 || columnIndex === 6) {
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            return newDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }
        
        // Handle numeric columns (impact score)
        if (columnIndex === 4) {
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
    const headers = document.querySelectorAll('.outcomes-table th');
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
    
    .notification-info {
        border-left-color: #2196f3;
    }
`;
document.head.appendChild(style);
