// Admin Health List JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeHealthList();
    initializeFilters();
    initializeModals();
    initializeAlertActions();
});

function initializeHealthList() {
    // Set current date for treatment form
    setCurrentDate();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Initialize table sorting
    initializeTableSorting();
    
    // Load initial data
    loadHealthData();
    
    // Check for critical alerts
    checkCriticalAlerts();
}

function setCurrentDate() {
    const treatmentDateInput = document.getElementById('treatment-date');
    if (treatmentDateInput) {
        treatmentDateInput.value = new Date().toISOString().split('T')[0];
    }
}

function initializeFilters() {
    const severityFilter = document.getElementById('severity-filter');
    const outcomeFilter = document.getElementById('outcome-filter');
    
    if (severityFilter) {
        severityFilter.addEventListener('change', filterRecords);
    }
    
    if (outcomeFilter) {
        outcomeFilter.addEventListener('change', filterRecords);
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
    
    // Form submission
    const addForm = document.getElementById('add-health-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddHealthRecord);
    }
    
    // Follow-up checkbox handler
    const followUpCheckbox = document.getElementById('follow-up-required');
    const followUpDateInput = document.getElementById('follow-up-date');
    
    if (followUpCheckbox && followUpDateInput) {
        followUpCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Set default follow-up date (7 days from treatment)
                const followUpDate = new Date();
                followUpDate.setDate(followUpDate.getDate() + 7);
                followUpDateInput.value = followUpDate.toISOString().split('T')[0];
                followUpDateInput.required = true;
            } else {
                followUpDateInput.value = '';
                followUpDateInput.required = false;
            }
        });
    }
}

function initializeAlertActions() {
    // Alert functions
    window.dismissAlert = function(alertId) {
        dismissHealthAlert(alertId);
    };
    
    window.dismissAllAlerts = function() {
        if (confirm('Dismiss all health alerts?')) {
            dismissAllHealthAlerts();
        }
    };
    
    window.viewRabbitHealth = function(rabbitId) {
        viewRabbitHealthHistory(rabbitId);
    };
    
    window.recordTreatment = function(rabbitId) {
        openTreatmentModal(rabbitId);
    };
    
    // Health record actions
    window.viewDetails = function(recordId) {
        showHealthRecordDetails(recordId);
    };
    
    window.editRecord = function(recordId) {
        openEditModal(recordId);
    };
    
    window.deleteRecord = function(recordId) {
        if (confirm('Are you sure you want to delete this health record?')) {
            deleteHealthRecord(recordId);
        }
    };
    
    // Vaccination actions
    window.recordVaccination = function(vaccinationId) {
        recordVaccinationAdministered(vaccinationId);
    };
    
    window.scheduleReminder = function(vaccinationId) {
        scheduleVaccinationReminder(vaccinationId);
    };
    
    window.scheduleVaccinations = function() {
        openVaccinationScheduler();
    };
    
    // Export function
    window.exportRecords = function() {
        exportHealthRecords();
    };
}

function handleAddHealthRecord(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!data.rabbit_id || !data.symptoms || !data.treatment_date) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Submit data
    submitHealthData(data, 'add');
}

function submitHealthData(data, action) {
    // Show loading state
    const submitBtn = document.querySelector(`#add-health-form button[type="submit"]`);
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        closeModal('add-health-modal');
        
        // Show success message
        showNotification('Health record logged successfully!', 'success');
        
        // Reload data
        loadHealthData();
        
        // Update alerts if needed
        updateHealthAlerts();
    }, 1500);
}

function dismissHealthAlert(alertId) {
    const alertCard = document.querySelector(`[data-alert-id="${alertId}"]`);
    if (alertCard) {
        alertCard.style.transform = 'translateX(100%)';
        alertCard.style.opacity = '0';
        
        setTimeout(() => {
            alertCard.remove();
            updateAlertsVisibility();
            showNotification('Alert dismissed', 'success');
        }, 300);
    }
}

function dismissAllHealthAlerts() {
    const alertCards = document.querySelectorAll('.alert-card');
    let dismissedCount = 0;
    
    alertCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateX(100%)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.remove();
                dismissedCount++;
                
                if (dismissedCount === alertCards.length) {
                    updateAlertsVisibility();
                    showNotification(`Dismissed ${dismissedCount} health alerts`, 'success');
                }
            }, 300);
        }, index * 100); // Stagger the animations
    });
}

function viewRabbitHealthHistory(rabbitId) {
    // Simulate loading rabbit health history
    setTimeout(() => {
        const healthHistory = [
            { date: '2024-01-15', issue: 'Regular checkup', outcome: 'Healthy' },
            { date: '2024-01-10', issue: 'Vaccination', outcome: 'Completed' },
            { date: '2024-01-05', issue: 'Weight loss', outcome: 'Recovered' }
        ];
        
        let historyText = `Health History for ${rabbitId}:\n\n`;
        healthHistory.forEach(record => {
            historyText += `${record.date}: ${record.issue} - ${record.outcome}\n`;
        });
        
        alert(historyText);
    }, 500);
}

function openTreatmentModal(rabbitId) {
    // Pre-fill rabbit ID in the health form
    const rabbitSelect = document.getElementById('rabbit-select');
    if (rabbitSelect) {
        rabbitSelect.value = rabbitId;
    }
    
    openModal('add-health-modal');
}

function showHealthRecordDetails(recordId) {
    // Simulate loading health record details
    setTimeout(() => {
        const record = {
            id: recordId,
            rabbit_id: 'RBT-' + recordId.toString().padStart(3, '0'),
            symptoms: 'Lethargy, loss of appetite',
            diagnosis: 'Respiratory infection',
            treatment_given: 'Antibiotics, supportive care',
            medication: 'Oxytetracycline',
            dosage: '10mg/kg daily for 5 days',
            treatment_date: new Date().toISOString().split('T')[0],
            veterinarian: 'Dr. Smith',
            outcome: 'Ongoing',
            follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: 'Monitor closely for improvement'
        };
        
        alert(`Health Record Details:\n\nRabbit: ${record.rabbit_id}\nDate: ${record.treatment_date}\nSymptoms: ${record.symptoms}\nDiagnosis: ${record.diagnosis}\nTreatment: ${record.treatment_given}\nMedication: ${record.medication}\nDosage: ${record.dosage}\nVeterinarian: ${record.veterinarian}\nOutcome: ${record.outcome}\nFollow-up: ${record.follow_up_date}\n\nNotes: ${record.notes}`);
    }, 500);
}

function openEditModal(recordId) {
    showHealthRecordDetails(recordId);
    // In a real implementation, this would open an edit modal
}

function deleteHealthRecord(recordId) {
    const row = document.querySelector(`tr:has(button[onclick*="${recordId}"])`);
    if (row) {
        row.style.opacity = '0.5';
        
        setTimeout(() => {
            row.style.transform = 'translateX(-100%)';
            row.style.opacity = '0';
            setTimeout(() => {
                row.remove();
                updateTableVisibility();
                showNotification('Health record deleted successfully', 'success');
            }, 300);
        }, 1000);
    }
}

function recordVaccinationAdministered(vaccinationId) {
    const vaccinationCard = document.querySelector(`[data-vaccination-id="${vaccinationId}"]`);
    if (vaccinationCard) {
        vaccinationCard.style.opacity = '0.5';
        
        setTimeout(() => {
            vaccinationCard.style.transform = 'translateX(-100%)';
            vaccinationCard.style.opacity = '0';
            setTimeout(() => {
                vaccinationCard.remove();
                updateVaccinationsVisibility();
                showNotification('Vaccination recorded successfully', 'success');
            }, 300);
        }, 1000);
    }
}

function scheduleVaccinationReminder(vaccinationId) {
    showNotification('Vaccination reminder scheduled', 'success');
}

function openVaccinationScheduler() {
    showNotification('Vaccination scheduler coming soon', 'info');
}

function exportHealthRecords() {
    const exportBtn = document.querySelector('.records-actions .btn-secondary');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<span class="btn-icon">⏳</span> Exporting...';
    exportBtn.disabled = true;
    
    setTimeout(() => {
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
        showNotification('Health records exported successfully!', 'success');
    }, 2000);
}

function filterRecords() {
    const severityFilter = document.getElementById('severity-filter').value;
    const outcomeFilter = document.getElementById('outcome-filter').value;
    const rows = document.querySelectorAll('.health-table tbody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        // In a real implementation, you'd check actual severity and outcome
        // For now, we'll simulate based on the outcome badge
        if (outcomeFilter) {
            const outcomeCell = row.cells[5].textContent.toLowerCase();
            if (!outcomeCell.includes(outcomeFilter)) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    updateTableVisibility();
}

function updateTableVisibility() {
    const rows = document.querySelectorAll('.health-table tbody tr');
    const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
    
    // Update section header
    const sectionHeader = document.querySelector('.records-section h2');
    if (sectionHeader) {
        sectionHeader.textContent = `Recent Health Records (${visibleRows.length})`;
    }
    
    // Show/hide no results message
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">No health records found</div>
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

function updateAlertsVisibility() {
    const alertCards = document.querySelectorAll('.alert-card');
    const visibleCards = Array.from(alertCards).filter(card => card.style.display !== 'none');
    
    // Update section header
    const sectionHeader = document.querySelector('.alerts-section h2');
    if (sectionHeader) {
        sectionHeader.textContent = `Active Health Alerts (${visibleCards.length})`;
    }
    
    // Show/hide no results message
    let noResultsMsg = document.querySelector('.no-results');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.innerHTML = `
            <div class="no-results-icon">✅</div>
            <div class="no-results-text">No active health alerts</div>
        `;
    }
    
    if (visibleCards.length === 0) {
        if (!document.querySelector('.alerts-section .no-results')) {
            document.querySelector('.alerts-grid').appendChild(noResultsMsg);
        }
    } else {
        if (noResultsMsg.parentElement) {
            noResultsMsg.remove();
        }
    }
}

function updateVaccinationsVisibility() {
    const vaccinationCards = document.querySelectorAll('.vaccination-card');
    const visibleCards = Array.from(vaccinationCards).filter(card => card.style.display !== 'none');
    
    // Update section header
    const sectionHeader = document.querySelector('.vaccination-section h2');
    if (sectionHeader) {
        sectionHeader.textContent = `Vaccination Schedule (${visibleCards.length})`;
    }
}

function clearFilters() {
    document.getElementById('severity-filter').value = '';
    document.getElementById('outcome-filter').value = '';
    filterRecords();
}

function loadHealthData() {
    // Simulate loading data
    const tableBody = document.querySelector('.health-table tbody');
    const alertsGrid = document.querySelector('.alerts-grid');
    const vaccinationGrid = document.querySelector('.vaccination-grid');
    
    if (tableBody) {
        tableBody.style.opacity = '0.5';
        setTimeout(() => tableBody.style.opacity = '1', 500);
    }
    
    if (alertsGrid) {
        alertsGrid.style.opacity = '0.5';
        setTimeout(() => alertsGrid.style.opacity = '1', 500);
    }
    
    if (vaccinationGrid) {
        vaccinationGrid.style.opacity = '0.5';
        setTimeout(() => vaccinationGrid.style.opacity = '1', 500);
    }
}

function updateHealthAlerts() {
    // Simulate updating alerts after adding new health record
    const alertsGrid = document.querySelector('.alerts-grid');
    if (alertsGrid) {
        alertsGrid.style.opacity = '0.5';
        setTimeout(() => alertsGrid.style.opacity = '1', 500);
    }
}

function checkCriticalAlerts() {
    // Check for critical health alerts and show notifications
    const criticalAlerts = document.querySelectorAll('.alert-card.critical');
    const highAlerts = document.querySelectorAll('.alert-card.high');
    
    if (criticalAlerts.length > 0) {
        setTimeout(() => {
            showNotification(`🚨 ${criticalAlerts.length} critical health alert(s)!`, 'error');
        }, 2000);
    }
    
    if (highAlerts.length > 0) {
        setTimeout(() => {
            showNotification(`⚠️ ${highAlerts.length} high priority alert(s)`, 'warning');
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
        // Ctrl/Cmd + N: Add new health record
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openModal('add-health-modal');
        }
        
        // Ctrl/Cmd + D: Dismiss all alerts
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            dismissAllAlerts();
        }
        
        // Ctrl/Cmd + E: Export records
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportHealthRecords();
        }
        
        // Ctrl/Cmd + V: Schedule vaccinations
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            scheduleVaccinations();
        }
    });
}

function initializeTableSorting() {
    const headers = document.querySelectorAll('.health-table th');
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
    const table = document.querySelector('.health-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Determine sort direction
    const currentSort = table.dataset.sortColumn === columnIndex.toString() ? table.dataset.sortDirection : 'asc';
    const newDirection = currentSort === 'asc' ? 'desc' : 'asc';
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Handle date column
        if (columnIndex === 0) {
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            return newDirection === 'asc' ? aDate - bDate : bDate - aDate;
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
    const headers = document.querySelectorAll('.health-table th');
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
    
    .notification-info {
        border-left-color: #2196f3;
    }
`;
document.head.appendChild(style);
