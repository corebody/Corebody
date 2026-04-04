// ==========================================
// 1. GESTIONE NAVIGAZIONE (DESKTOP vs MOBILE)
// ==========================================

/**
 * Reindirizza all'URL corretto in base alla larghezza dello schermo.
 * @param {string} urlDesktop - Link per versione PC
 * @param {string} urlMobile - Link per versione Smartphone
 */
function vaiAllArticolo(urlDesktop, urlMobile) {
    // Soglia standard per mobile: 768px
    if (window.innerWidth <= 768 && urlMobile) {
        window.location.href = urlMobile;
    } else {
        window.location.href = urlDesktop;
    }
}

// ==========================================
// 2. GESTIONE MENU SIDEBAR E RICERCA
// ==========================================

function openMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuIcon = document.getElementById("menuIcon");
    
    if (sidebar && overlay) {
        // 100% su mobile, 37% su desktop
        sidebar.style.width = (window.innerWidth <= 768) ? "100%" : "37%";
        overlay.style.display = "block";
        if (menuIcon) menuIcon.style.opacity = "0";
        document.body.classList.add("menu-aperto");
    }
}

function closeMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuIcon = document.getElementById("menuIcon");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    
    if (sidebar) {
        sidebar.style.width = "0";
        if (overlay) overlay.style.display = "none";
        if (menuIcon) menuIcon.style.opacity = "1";
        
        // Reset ricerca alla chiusura
        if (searchInput) {
            searchInput.style.display = "none";
            searchInput.value = "";
        }
        if (searchResults) searchResults.innerHTML = "";
        
        document.body.classList.remove("menu-aperto");
    }
}

function toggleSearch() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    if (input.style.display === "none" || input.style.display === "") {
        input.style.display = "block";
        input.focus();
    } else {
        input.style.display = "none";
        input.value = "";
        const results = document.getElementById("searchResults");
        if (results) results.innerHTML = "";
    }
}

// ==========================================
// 3. CARICAMENTO ARTICOLI E RICERCA
// ==========================================

let articoliData = [];

fetch('articoli.json')
    .then(response => response.json())
    .then(articoli => {
        articoliData = articoli;
        const grid = document.getElementById('articlesGrid');
        if (!grid) return;
        
        articoli.forEach(art => {
            grid.innerHTML += `
                <article class="article-card" 
                         onclick="vaiAllArticolo('${art.url}', '${art.url_mobile}')" 
                         style="cursor: pointer;">
                    <div class="article-image-container">
                        <img src="${art.immagine}" alt="${art.categoria}" class="article-image">
                    </div>
                    <div class="article-content">
                        <h3 class="article-category">${art.categoria}</h3>
                        <p class="article-date">${art.data}</p>
                        <h2 class="article-title">${art.titolo}</h2>
                        <p class="article-text">${art.anteprima}</p>
                    </div>
                </article>`;
        });
    })
    .catch(err => console.error("Errore caricamento articoli:", err));

function searchArticles() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const resultsContainer = document.getElementById("searchResults");
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = "";
    if (input.length < 2) return;
    
    const found = articoliData.filter(art => 
        art.titolo.toLowerCase().includes(input) || 
        art.categoria.toLowerCase().includes(input)
    );
    
    found.slice(0, 3).forEach(art => {
        const item = document.createElement("div");
        item.className = "search-result-item";
        item.textContent = art.titolo;
        item.style.cursor = "pointer";
        
        // Applica la logica mobile/desktop anche alla ricerca
        item.onclick = () => vaiAllArticolo(art.url, art.url_mobile);
        
        resultsContainer.appendChild(item);
    });
}

// ==========================================
// 4. NEWSLETTER E INIZIALIZZAZIONE
// ==========================================

function openNewsletter() {
    const nl = document.getElementById('newsletterOverlay');
    if (nl) nl.classList.add('active');
}

function closeNewsletter() {
    const nl = document.getElementById('newsletterOverlay');
    if (nl) nl.classList.remove('active');
}

document.addEventListener("DOMContentLoaded", function() {
    // Popup mostrato solo una volta per sessione
    if (!sessionStorage.getItem('newsletterShown')) {
        setTimeout(openNewsletter, 2000); // Apre dopo 2 secondi
        sessionStorage.setItem('newsletterShown', 'true');
    }

    // Gestione chiusura menu su mobile (touchstart per reattività)
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('touchstart', function(e) {
            closeMenu();
            e.preventDefault();
        }, {passive: false});
    }
});

// Aggiornamento dinamico larghezza sidebar al resize
window.addEventListener('resize', () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar && sidebar.style.width !== "0px" && sidebar.style.width !== "") {
        sidebar.style.width = (window.innerWidth <= 768) ? "100%" : "37%";
    }
});