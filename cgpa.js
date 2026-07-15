 /**
 * PREMIUM LIGHTWEIGHT CGPA & SPI CALCULATOR
 * Modular Architecture with Multi-University Support
 */

const UNIVERSITIES = {
    silverOak: {
        id: "silverOak",
        name: "Silver Oak University",
        grades: { "AA": 10, "AB": 9, "BB": 8, "BC": 7, "CC": 6, "CD": 5, "DD": 4, "FF": 0 },
        // Standard formula: (CGPA - 0.5) * 10
        calcPercentage: (cgpa) => cgpa > 0.5 ? (cgpa - 0.5) * 10 : 0
    },
    gujarat: {
        id: "gujarat",
        name: "Gujarat University",
        grades: { "A+": 10, "A": 9, "B+": 8, "B": 7, "C+": 6, "C": 5, "D": 4, "F": 0 },
        calcPercentage: (cgpa) => cgpa > 0.5 ? (cgpa - 0.5) * 10 : 0
    },
    gls: {
        id: "gls",
        name: "GLS University",
        grades: { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "F": 0 },
        // Standard multiplier formula
        calcPercentage: (cgpa) => cgpa * 9.5
    },
    lj: {
        id: "lj",
        name: "L.J. University",
        grades: { "AA": 10, "AB": 9, "BB": 8, "BC": 7, "CC": 6, "CD": 5, "DD": 4, "FF": 0 },
        calcPercentage: (cgpa) => cgpa > 0.5 ? (cgpa - 0.5) * 10 : 0
    },
    gseb: {
        id: "gseb",
        name: "GSEB (Higher Secondary)",
        grades: { "A1": 10, "A2": 9, "B1": 8, "B2": 7, "C1": 6, "C2": 5, "D": 4, "E1": 0, "E2": 0 },
        calcPercentage: (cgpa) => cgpa * 9.5
    }
};

const app = (function() {
    
    // State
    let currentUniId = "silverOak";
    let currentUni = UNIVERSITIES[currentUniId];
    let spiData = [];
    let cgpaData = [];

    // DOM Elements Cache
    const DOM = {
        uniSelect: document.getElementById('university-select'),
        navBtns: document.querySelectorAll('.nav-btn'),
        sections: document.querySelectorAll('.calc-section'),
        spiBody: document.getElementById('spi-body'),
        cgpaBody: document.getElementById('cgpa-body'),
        resSpi: document.getElementById('display-spi'),
        resCgpa: document.getElementById('display-cgpa'),
        resCred: document.getElementById('display-credits'),
        resPerc: document.getElementById('display-percent'),
        badge: document.getElementById('performance-badge')
    };

    // --- Initialization ---
    function init() {
        populateUniversityDropdown();
        setupTabs();
        loadData();
        
        if(spiData.length === 0) addSpiRow();
        if(cgpaData.length === 0) addCgpaRow();
        
        renderSpiTable();
        renderCgpaTable();
        calculate();
    }

    // --- Setup & Handlers ---
    function populateUniversityDropdown() {
        DOM.uniSelect.innerHTML = '';
        for (const key in UNIVERSITIES) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = UNIVERSITIES[key].name;
            if (key === currentUniId) opt.selected = true;
            DOM.uniSelect.appendChild(opt);
        }
    }

    function changeUniversity(uniId) {
        currentUniId = uniId;
        currentUni = UNIVERSITIES[uniId];
        localStorage.setItem('notesHub_uni', uniId);
        
        // Reset grades to valid default for new university
        const defaultGrade = Object.keys(currentUni.grades)[0];
        spiData.forEach(row => row.grade = defaultGrade);
        
        renderSpiTable();
        calculate();
    }

    function setupTabs() {
        DOM.navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                DOM.navBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const targetId = e.target.getAttribute('data-target');
                DOM.sections.forEach(sec => {
                    if(sec.id === targetId) {
                        sec.style.display = 'block';
                        sec.classList.add('fade-in');
                    } else {
                        sec.style.display = 'none';
                        sec.classList.remove('fade-in');
                    }
                });
            });
        });
    }

    // --- Dynamic Render: SPI ---
    function addSpiRow() {
        spiData.push({ id: Date.now(), name: '', credits: '', grade: Object.keys(currentUni.grades)[0] });
        renderSpiTable();
        saveData();
    }

    function removeSpiRow(id) {
        spiData = spiData.filter(r => r.id !== id);
        renderSpiTable();
        calculate();
    }

    function renderSpiTable() {
        DOM.spiBody.innerHTML = '';
        spiData.forEach((row, i) => {
            const tr = document.createElement('tr');
            tr.className = 'fade-in';
            
            let gradeOptions = Object.keys(currentUni.grades).map(g => 
                `<option value="${g}" ${row.grade === g ? 'selected' : ''}>${g}</option>`
            ).join('');

            tr.innerHTML = `
                <td><input type="text" placeholder="Sub ${i+1}" value="${row.name}" oninput="app.updateSpi(${row.id}, 'name', this.value)"></td>
                <td><input type="number" placeholder="0" min="1" max="10" value="${row.credits}" oninput="app.updateSpi(${row.id}, 'credits', this.value)"></td>
                <td><select class="grid-select" onchange="app.updateSpi(${row.id}, 'grade', this.value)">${gradeOptions}</select></td>
                <td><button class="action-btn" onclick="app.removeSpiRow(${row.id})">×</button></td>
            `;
            DOM.spiBody.appendChild(tr);
        });
    }

    function updateSpi(id, field, val) {
        const row = spiData.find(r => r.id === id);
        if(row) {
            row[field] = val;
            calculate();
        }
    }

    // --- Dynamic Render: CGPA ---
    function addCgpaRow() {
        cgpaData.push({ id: Date.now(), credits: '', spi: '' });
        renderCgpaTable();
        saveData();
    }

    function removeCgpaRow(id) {
        cgpaData = cgpaData.filter(r => r.id !== id);
        renderCgpaTable();
        calculate();
    }

    function renderCgpaTable() {
        DOM.cgpaBody.innerHTML = '';
        cgpaData.forEach((row, i) => {
            const tr = document.createElement('tr');
            tr.className = 'fade-in';
            tr.innerHTML = `
                <td>Sem ${i+1}</td>
                <td><input type="number" placeholder="0" value="${row.credits}" oninput="app.updateCgpa(${row.id}, 'credits', this.value)"></td>
                <td><input type="number" placeholder="0.00" step="0.01" value="${row.spi}" oninput="app.updateCgpa(${row.id}, 'spi', this.value)"></td>
                <td><button class="action-btn" onclick="app.removeCgpaRow(${row.id})">×</button></td>
            `;
            DOM.cgpaBody.appendChild(tr);
        });
    }

    function updateCgpa(id, field, val) {
        const row = cgpaData.find(r => r.id === id);
        if(row) {
            row[field] = val;
            calculate();
        }
    }

    // --- Core Math Engine ---
    function calculate() {
        // Calculate SPI
        let spiTotalCredits = 0, spiTotalPoints = 0;
        spiData.forEach(r => {
            const c = parseFloat(r.credits);
            if(!isNaN(c) && c > 0) {
                spiTotalCredits += c;
                spiTotalPoints += (c * currentUni.grades[r.grade]);
            }
        });
        const currentSpi = spiTotalCredits > 0 ? (spiTotalPoints / spiTotalCredits) : 0;

        // Calculate CGPA
        let cgpaTotalCredits = 0, cgpaTotalPoints = 0;
        cgpaData.forEach(r => {
            const c = parseFloat(r.credits);
            const s = parseFloat(r.spi);
            if(!isNaN(c) && c > 0 && !isNaN(s)) {
                cgpaTotalCredits += c;
                cgpaTotalPoints += (c * s);
            }
        });
        const currentCgpa = cgpaTotalCredits > 0 ? (cgpaTotalPoints / cgpaTotalCredits) : 0;

        // Compute Dominant Metric
        const domMetric = currentCgpa > 0 ? currentCgpa : currentSpi;
        const totalCredsDisplay = Math.max(spiTotalCredits, cgpaTotalCredits);
        
        // Calculate Percentage based on configured university formula
        const percentage = currentUni.calcPercentage(domMetric);

        updateDashboard(currentSpi, currentCgpa, totalCredsDisplay, percentage, domMetric);
        saveData();
    }

    function updateDashboard(spi, cgpa, cred, perc, domMetric) {
        DOM.resSpi.innerText = spi.toFixed(2);
        DOM.resCgpa.innerText = cgpa.toFixed(2);
        DOM.resCred.innerText = cred;
        DOM.resPerc.innerText = Math.max(0, perc).toFixed(2) + '%';

        // Badge Status Logic
        DOM.badge.className = 'badge fade-in';
        if(domMetric === 0) {
            DOM.badge.innerText = 'Enter Data';
        } else if(domMetric >= 8.5) {
            DOM.badge.classList.add('good');
            DOM.badge.innerText = 'Excellent';
        } else if(domMetric >= 6.5) {
            DOM.badge.classList.add('avg');
            DOM.badge.innerText = 'Good';
        } else {
            DOM.badge.classList.add('poor');
            DOM.badge.innerText = 'Needs Work';
        }
    }

    // --- Storage & Utils ---
    function saveData() {
        localStorage.setItem('notesHub_spi', JSON.stringify(spiData));
        localStorage.setItem('notesHub_cgpa', JSON.stringify(cgpaData));
    }

    function loadData() {
        const savedUni = localStorage.getItem('notesHub_uni');
        if(savedUni && UNIVERSITIES[savedUni]) {
            currentUniId = savedUni;
            currentUni = UNIVERSITIES[savedUni];
        }

        const savedSpi = localStorage.getItem('notesHub_spi');
        const savedCgpa = localStorage.getItem('notesHub_cgpa');
        if(savedSpi) spiData = JSON.parse(savedSpi);
        if(savedCgpa) cgpaData = JSON.parse(savedCgpa);
    }

    function resetData() {
        if(confirm("Clear all calculation data?")) {
            spiData = []; cgpaData = [];
            addSpiRow(); addCgpaRow();
            calculate();
        }
    }

    function copyResults() {
        const text = `University: ${currentUni.name}\nSPI: ${DOM.resSpi.innerText}\nCGPA: ${DOM.resCgpa.innerText}\nPercentage: ${DOM.resPerc.innerText}\nTotal Credits: ${DOM.resCred.innerText}`;
        navigator.clipboard.writeText(text).then(() => {
            alert("Results copied to clipboard!");
        }).catch(err => {
            alert("Failed to copy results.");
        });
    }

    // Public API
    return {
        init, changeUniversity,
        addSpiRow, removeSpiRow, updateSpi,
        addCgpaRow, removeCgpaRow, updateCgpa,
        resetData, copyResults
    };

})();

document.addEventListener('DOMContentLoaded', app.init);