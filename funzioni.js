// ==========================================
// 1. IL MOTORE DI REINDIRIZZAMENTO
// ==========================================

function vaiAllArticolo(urlDesktop, urlMobile) {
    // Debug per vedere cosa succede in console (clicca F12 sul browser)
    console.log("Larghezza schermo:", window.innerWidth);
    console.log("URL Desktop:", urlDesktop);
    console.log("URL Mobile:", urlMobile);

    // Se siamo sotto i 768px E esiste un URL mobile, usa quello
    if (window.innerWidth <= 850 && urlMobile && urlMobile !== "undefined" && urlMobile !== "") {
        window.location.href = urlMobile;
    } else {
        // Altrimenti vai su quello desktop
        window.location.href = urlDesktop;
    }
}

// ==========================================
// 2. CARICAMENTO ARTICOLI (FETCH)
// ==========================================

let articoliData = [];

fetch('articoli.json')
    .then(response => response.json())
    .then(articoli => {
        articoliData = articoli;
        const grid = document.getElementById('articlesGrid');
        if (!grid) return;
        
        grid.innerHTML = ""; // Pulisce la griglia prima di caricare

        articoli.forEach(art => {
            // CREIAMO L'ELEMENTO ARTICOLO
            const article = document.createElement('article');
            article.className = "article-card";
            article.style.cursor = "pointer";
            
            // ASSEGNIAMO IL CLICK tramite la funzione corretta
            article.onclick = function() {
                vaiAllArticolo(art.url, art.url_mobile);
            };

            article.innerHTML = `
                <div class="article-image-container">
                    <img src="${art.immagine}" alt="${art.categoria}" class="article-image">
                </div>
                <div class="article-content">
                    <h3 class="article-category">${art.categoria}</h3>
                    <p class="article-date">${art.data}</p>
                    <h2 class="article-title">${art.titolo}</h2>
                    <p class="article-text">${art.anteprima}</p>
                </div>
            `;
            grid.appendChild(article);
        });
    })
    .catch(err => console.error("Errore caricamento articoli:", err));

// ==========================================
// 3. GESTIONE MENU E RICERCA
// ==========================================

function openMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar && overlay) {
        sidebar.style.width = (window.innerWidth <= 845) ? "100%" : "37%";
        overlay.style.display = "block";
        document.body.classList.add("menu-aperto");
    }
}

function closeMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (sidebar) {
        sidebar.style.width = "0";
        if (overlay) overlay.style.display = "none";
        document.body.classList.remove("menu-aperto");
    }
}

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
        
        // Logica di click anche per i risultati della ricerca
        item.onclick = () => vaiAllArticolo(art.url, art.url_mobile);
        
        resultsContainer.appendChild(item);
    });
}

// ==========================================
// 4. INIZIALIZZAZIONE
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    // Fix per il pulsante di chiusura su mobile
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
});

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