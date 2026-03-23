let currentPrimary = "#4e73df";
    let currentSecondary = "#1cc88a";
    let currentText = "#e2e8f0";

 
    function adjustBrightness(hex, percent) {
        


        let r, g, b;
        if (hex.startsWith('#')) {
            r = parseInt(hex.slice(1,3), 16);
            g = parseInt(hex.slice(3,5), 16);
            b = parseInt(hex.slice(5,7), 16);
        } else return hex;
       


        let factor = percent / 50;
        let newR = Math.min(255, Math.max(0, Math.floor(r * factor)));
        let newG = Math.min(255, Math.max(0, Math.floor(g * factor)));
        let newB = Math.min(255, Math.max(0, Math.floor(b * factor)));
        if (percent <= 50) {
            let darkFactor = percent / 50;
            newR = Math.floor(r * darkFactor);
            newG = Math.floor(g * darkFactor);
            newB = Math.floor(b * darkFactor);
        } else {
            let brightFactor = (percent - 50) / 50;
            newR = Math.min(255, Math.floor(r + (255 - r) * brightFactor));
            newG = Math.min(255, Math.floor(g + (255 - g) * brightFactor));
            newB = Math.min(255, Math.floor(b + (255 - b) * brightFactor));
        }
        return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
    }

    function updatePrimaryFromPickerAndSlider() {
        let baseColor = document.getElementById('primaryColorPicker').value;
        let brightness = parseInt(document.getElementById('primaryBrightness').value);
        let finalColor = adjustBrightness(baseColor, brightness);
        currentPrimary = finalColor;
        document.getElementById('primaryHexValue').innerText = finalColor.toUpperCase();
        applyTheme();
        addConsoleLog(`Applied primary color: ${finalColor.toUpperCase()}`);
        updateClassEditorContent();
    }

    function updateSecondary() {
        let base = document.getElementById('secondaryColorPicker').value;
        let bright = parseInt(document.getElementById('secondaryBrightness').value);
        let final = adjustBrightness(base, bright);
        currentSecondary = final;
        document.getElementById('secondaryHexValue').innerText = final.toUpperCase();
        applyTheme();
        document.getElementById('secondaryConsole').innerHTML = `> Secondary updated: ${final.toUpperCase()}`;
        updateClassEditorContent();
    }

    function updateTextColor() {
        let base = document.getElementById('textColorPicker').value;
        let bright = parseInt(document.getElementById('textBrightness').value);
        let final = adjustBrightness(base, bright);
        currentText = final;
        document.getElementById('textColorHexValue').innerText = final.toUpperCase();
        applyTheme();
        updateClassEditorContent();
    }

    function applyTheme() {

       
        document.documentElement.style.setProperty('--bs-primary', currentPrimary);
        document.documentElement.style.setProperty('--bs-secondary', currentSecondary);
        document.documentElement.style.setProperty('--bs-body-color', currentText);
        document.documentElement.style.setProperty('--bs-body-bg', '#0a0a10');
      
        let styleUpdate = document.getElementById('dynamicThemeOverride');
        if(!styleUpdate) {
            let s = document.createElement('style');
            s.id = 'dynamicThemeOverride';
            document.head.appendChild(s);
        }

        let sheet = document.getElementById('dynamicThemeOverride');
        sheet.innerHTML = `
            .btn-primary, .bg-primary { background-color: ${currentPrimary} !important; border-color: ${currentPrimary} !important; }
            .text-primary, .navbar-brand .text-primary, i.text-primary { color: ${currentPrimary} !important; }
            .avatar-circle { background: ${currentPrimary} !important; }
            .stat-card i.text-primary { color: ${currentPrimary} !important; }
            .grid-toggle-btn:hover { background: ${currentPrimary}40; }
            .admin-navbar .nav-link:hover { color: ${currentPrimary} !important; }
            body, .text-secondary { color: ${currentText} !important; }
            .table-dark { color: ${currentText}; }
        `;
    


        if(window.revenueChartInstance) {
            window.revenueChartInstance.data.datasets[0].borderColor = currentPrimary;
            window.revenueChartInstance.data.datasets[0].backgroundColor = currentPrimary + '30';
            window.revenueChartInstance.update();
        }
        



        document.querySelectorAll('.avatar-circle').forEach((el, idx) => {
            if(idx === 0) el.style.background = currentPrimary;
            else if(idx === 1) el.style.background = currentSecondary;
        });
    }

    function addConsoleLog(msg) {
        const consoleDiv = document.getElementById('consoleOutput');
        const newLog = document.createElement('div');
        newLog.className = 'console-line text-success';
        newLog.innerHTML = `> ${msg}`;
        consoleDiv.appendChild(newLog);
        if(consoleDiv.children.length > 6) consoleDiv.removeChild(consoleDiv.children[0]);
       
    }

    function updateClassEditorContent() {
        let editor = document.getElementById('classEditor');


        let content = `/* Bootstrap Class Overrides (Live) */
:root { --bs-primary: ${currentPrimary}; --bs-secondary: ${currentSecondary}; }
.btn-primary { background: ${currentPrimary}; border-color: ${currentPrimary}; }
.bg-primary { background: ${currentPrimary} !important; }
.text-primary { color: ${currentPrimary} !important; }
.badge.bg-secondary { background: ${currentSecondary} !important; }
body { color: ${currentText}; }`;
        editor.value = content;
    }

    

    function setGridColumns(cols) {
        let container = document.getElementById('gridCardsContainer');
        let children = Array.from(container.children);
        let colClass = `col-md-${Math.floor(12/cols)}`;
        children.forEach(child => {
            child.className = `${colClass} mb-2`;
        });
        addConsoleLog(`Grid layout changed to ${cols} columns`);
    }

 





    function setGoogleFont(fontFamily) {
        let linkId = 'google-font-dynamic';
        let existing = document.getElementById(linkId);
        if(existing) existing.remove();
        let link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        let formatted = fontFamily.replace(/ /g, '+');
        link.href = `https://fonts.googleapis.com/css2?family=${formatted}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
        document.body.style.fontFamily = `${fontFamily}, 'Inter', sans-serif`;
        addConsoleLog(`Font changed to ${fontFamily}`);
    }

    



    let ctx = document.getElementById('revenueChart').getContext('2d');
    window.revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ label: 'Revenue (k$)', data: [12, 19, 15, 22, 28, 34], borderWidth: 3, tension: 0.3, fill: true, pointBackgroundColor: '#4e73df', pointBorderColor: '#fff' }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { grid: { color: '#2d3748' }, ticks: { color: '#a0aec0' } }, x: { ticks: { color: '#a0aec0' } } } }
    });
    window.revenueChartInstance.data.datasets[0].borderColor = '#4e73df';
    window.revenueChartInstance.update();



    document.getElementById('primaryColorPicker').addEventListener('input', updatePrimaryFromPickerAndSlider);
    document.getElementById('primaryBrightness').addEventListener('input', updatePrimaryFromPickerAndSlider);
    document.getElementById('secondaryColorPicker').addEventListener('input', updateSecondary);
    document.getElementById('secondaryBrightness').addEventListener('input', updateSecondary);
    document.getElementById('textColorPicker').addEventListener('input', updateTextColor);
    document.getElementById('textBrightness').addEventListener('input', updateTextColor);
    document.querySelectorAll('.grid-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => setGridColumns(parseInt(e.target.getAttribute('data-cols'))));
    });
    document.getElementById('googleFontSelect').addEventListener('change', (e) => setGoogleFont(e.target.value));




    updatePrimaryFromPickerAndSlider();
    updateSecondary();
    updateTextColor();
    setGoogleFont('Inter');
    addConsoleLog('Admin Pro Studio ready · Theme engine live');
    updateClassEditorContent();