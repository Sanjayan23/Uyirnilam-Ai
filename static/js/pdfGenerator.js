/**
 * Uyirnilam AI - Universal PDF Generator (High-Fidelity)
 * Version 1.3 - Dynamic CSS processing, Viewport forcing, and Font assurance.
 */

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`CDN Load failed: ${src}`));
        document.head.appendChild(script);
    });
}

function getFormattedDate(forFilename = false) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    if (forFilename) return `${day}-${month}-${year}`;
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

async function getImgBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = () => reject(new Error(`Image Error: ${url}`));
        img.src = url;
    });
}

function findJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    if (window.jsPDF) return window.jsPDF;
    return null;
}

async function generatePDF(pageTitle, containerId) {
    alert(`Generating High-Fidelity ${pageTitle}... Please stay on this tab.`);

    try {
        // 1. Ensure Dependencies & Fonts
        if (!findJsPDF()) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        if (!window.html2canvas) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        
        // Wait for all fonts to settle for sharp text
        if (document.fonts) { await document.fonts.ready; }

        const JsPDF = findJsPDF();
        const container = document.getElementById(containerId);
        if (!container) throw new Error("Container not found.");

        // 2. Prepare Global Styles for Snapshots (Scrollables)
        const scrollables = container.querySelectorAll('.overflow-y-auto, .hide-sb, [style*="max-height"]');
        const originalStyles = [];
        scrollables.forEach(el => {
            originalStyles.push({ el, mh: el.style.maxHeight, ov: el.style.overflow, h: el.style.height });
            el.style.setProperty('max-height', 'none', 'important');
            el.style.setProperty('overflow', 'visible', 'important');
            el.style.setProperty('height', 'auto', 'important');
        });

        await new Promise(r => setTimeout(r, 600));

        // 3. High-Fidelity Render with onclone processing
        const DESKTOP_WIDTH = 1440; // Force Desktop Viewport
        
        const canvas = await window.html2canvas(container, {
            scale: 2,           // High quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#020f0c',
            windowWidth: DESKTOP_WIDTH, // Simulate desktop width
            width: DESKTOP_WIDTH,       // Capture desktop width
            logging: false,
            onclone: (clonedDoc) => {
                const clonedContainer = clonedDoc.getElementById(containerId);
                if (!clonedContainer) return;
                
                // Fix for alignment: Force cloned container to desktop width
                clonedContainer.style.width = DESKTOP_WIDTH + 'px';
                clonedContainer.style.maxWidth = 'none';
                
                // FIX FOR bg-clip-text: Detection and Overrides
                // html2canvas fails on text-clipping. We detect elements using it and apply solid colors.
                const clipperSelector = '.bg-clip-text, [class*="bg-clip-text"], [style*="background-clip: text"]';
                const clippers = clonedContainer.querySelectorAll(clipperSelector);
                
                clippers.forEach(el => {
                    // Force text to be visible and colored (emerald/cyan/white depending on brand)
                    el.style.backgroundClip = 'unset';
                    el.style.webkitBackgroundClip = 'unset';
                    el.style.backgroundImage = 'none';
                    el.style.setProperty('-webkit-text-fill-color', 'white', 'important');
                    el.style.color = 'white'; 
                    
                    // Specific highlight for page titles
                    if (el.tagName === 'H1' || el.classList.contains('text-4xl') || el.classList.contains('text-3xl')) {
                        el.style.color = '#10b981'; // Brand Emerald
                        el.style.setProperty('-webkit-text-fill-color', '#10b981', 'important');
                    }
                });

                // Remove floating UI elements that might clutter PDF
                const exclude = clonedContainer.querySelectorAll('button:not(.pdf-keep), .no-pdf, .sidebar-toggle');
                exclude.forEach(el => el.style.display = 'none');
            }
        });

        // 4. Cleanup Live UI
        originalStyles.forEach(item => {
            item.el.style.maxHeight = item.mh;
            item.el.style.overflow = item.ov;
            item.el.style.height = item.h;
        });

        // 5. Build PDF with smart scaling for A4
        const doc = new JsPDF('p', 'pt', 'a4');
        const pdfW = doc.internal.pageSize.getWidth();
        const pdfH = doc.internal.pageSize.getHeight();
        
        // Scale 1440px capture down to A4 (leaving 20pt margin)
        const imgW = pdfW - 40;
        const imgH = (canvas.height * imgW) / canvas.width;
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        let logo = null;
        try { logo = await getImgBase64('/static/images/logo.jpg'); } catch(e) {}
        const now = getFormattedDate();

        const addOverlays = (p) => {
            // Header
            doc.setFillColor(255, 255, 255); doc.rect(0, 0, pdfW, 90, 'F');
            if(logo) doc.addImage(logo, 'JPEG', 20, 20, 50, 50);
            doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(16, 185, 129); doc.text("Uyirnilam AI", 85, 45);
            doc.setFont("helvetica", "normal"); doc.setFontSize(14); doc.setTextColor(80, 80, 80); doc.text(pageTitle, 85, 65);
            doc.setFontSize(10); doc.setTextColor(120, 120, 120); doc.text(now, pdfW - 20, 45, { align: 'right' });
            doc.setDrawColor(16, 185, 129); doc.setLineWidth(1.5); doc.line(20, 85, pdfW - 20, 85);

            // Footer
            doc.setFillColor(255, 255, 255); doc.rect(0, pdfH - 35, pdfW, 35, 'F');
            doc.line(20, pdfH - 30, pdfW - 20, pdfH - 30);
            doc.setFontSize(9); doc.setTextColor(150, 150, 150);
            doc.text("Agriculture Intelligence System | Confidential Report", 20, pdfH - 15);
            doc.text(`Page ${p}`, pdfW - 20, pdfH - 15, { align: 'right' });
        };

        const topM = 100; const botM = 50;
        const pgAreaH = pdfH - topM - botM;
        let hLeft = imgH; let p = 1;

        doc.addImage(imgData, 'JPEG', 20, topM, imgW, imgH);
        addOverlays(p);
        hLeft -= pgAreaH;

        while (hLeft > 0) {
            doc.addPage(); p++;
            doc.addImage(imgData, 'JPEG', 20, -(p - 1) * pgAreaH + topM, imgW, imgH);
            addOverlays(p);
            hLeft -= pgAreaH;
        }

        doc.save(`${pageTitle.replace(/\s+/g, '_')}_${getFormattedDate(true)}.pdf`);
        alert("PDF Saved Successfully!");

    } catch (err) {
        console.error("PDF Fail:", err);
        alert("High-Fidelity Rendering Error: " + err.message);
    }
}
