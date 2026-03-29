
// --- 1. GESTIONE MENU SIDEBAR ---
function toggleSearch() {
    const input = document.getElementById("searchInput");
    
    if (input) {
        // Se l'input è nascosto o non ha stile, lo mostriamo
        if (input.style.display === "none" || input.style.display === "") {
            input.style.display = "block";
            input.focus();
        } else {
            // Se è già visibile, lo nascondiamo e svuotiamo la ricerca
            input.style.display = "none";
            input.value = "";
            
            // Opzionale: pulisce anche i risultati della ricerca sotto
            const results = document.getElementById("searchResults");
            if (results) results.innerHTML = "";
        }
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
        overlay.style.display = "none";
        if (menuIcon) menuIcon.style.opacity = "1";
        
        // Reset: nascondiamo l'input e puliamo i risultati
        if (searchInput) {
            searchInput.style.display = "none";
            searchInput.value = "";
        }
        if (searchResults) searchResults.innerHTML = "";
    }
}
function openMenu() {
    console.log("Apertura menu...");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuIcon = document.getElementById("menuIcon");
    
    if (sidebar && overlay) {
        sidebar.style.width = (window.innerWidth <= 768) ? "100%" : "37%";
        overlay.style.display = "block";
        if (menuIcon) menuIcon.style.opacity = "0";
    }
}


// --- 2. RICERCA E ARTICOLI ---
var articoliData = [];

fetch('articoli.json')
    .then(response => response.json())
    .then(articoli => {
        articoliData = articoli;
        const grid = document.getElementById('articlesGrid');
        if (!grid) return;
        
        articoli.forEach(art => {
            grid.innerHTML += `
                <article class="article-card" onclick="window.location='${art.url}'" style="cursor: pointer;">
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
    .catch(err => console.error("Errore articoli:", err));

function searchArticles() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const resultsContainer = document.getElementById("searchResults");
    if (!resultsContainer) return;
    resultsContainer.innerHTML = "";
    
    if (input.length < 2) return;
    
    const found = articoliData.filter(art => 
        art.titolo.toLowerCase().includes(input) || art.categoria.toLowerCase().includes(input)
    );
    
    found.slice(0, 3).forEach(art => {
        const a = document.createElement("a");
        a.href = art.url; // Assumendo che "url" sia il campo corretto per il link all'articolo
        a.className = "search-result-item";
        a.textContent = art.titolo;
        resultsContainer.appendChild(a);
    });
}

// --- 3. NEWSLETTER E INIZIALIZZAZIONE ---
document.addEventListener("DOMContentLoaded", function() {
    // 1. Controlliamo se nella sessione attuale il popup è già stato mostrato
    const isPopupShown = sessionStorage.getItem('newsletterShown');

    // 2. Se non è mai stato mostrato in questa sessione, lo attiviamo
    if (!isPopupShown) {
        openNewsletter();
        // 3. Salviamo subito l'informazione per evitare che riappaia ricaricando la pagina
        sessionStorage.setItem('newsletterShown', 'true');
    }
});

// Funzione per aprire il popup newsletter
function openNewsletter() {
    document.getElementById('newsletterOverlay').classList.add('active');
}

function closeNewsletter() {
    const nl = document.getElementById('newsletterOverlay');
    if (nl) nl.classList.remove('active');
}
    

document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        // Questo intercetta il tocco del dito prima ancora del "click"
        closeBtn.addEventListener('touchstart', function(e) {
            console.log("Tocco rilevato su mobile");
            closeMenu();
            e.preventDefault(); // Impedisce bug di scrolling
        }, {passive: false});
    }
});

articoliFiltrati.forEach(function(art) {
    grid.innerHTML += `
        <article class="article-card" onclick="window.location='${art.url}'" style="cursor: pointer;">
            <img src="${art.immagine}" alt="${art.categoria}" class="article-image">
            <div class="article-content">
                <h3 class="article-category">${art.categoria}</h3>
                <p class="article-date">${art.data}</p>
                <h2 class="article-title">${art.titolo}</h2>
                <p class="article-text">${art.anteprima}</p>
            </div>
        </article>
    `;
});

function openMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuIcon = document.getElementById("menuIcon");
    
    if (sidebar) {
        sidebar.style.width = "100%"; 
        if (overlay) overlay.style.display = "block";
        if (menuIcon) menuIcon.style.opacity = "0"; // Nasconde l'icona menu stessa
        
        // AGGIUNGI QUESTA RIGA:
        document.body.classList.add("menu-aperto");
    }
}

function closeMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const menuIcon = document.getElementById("menuIcon");
    
    if (sidebar) {
        sidebar.style.width = "0";
        if (overlay) overlay.style.display = "none";
        if (menuIcon) menuIcon.style.opacity = "1";
        
        // AGGIUNGI QUESTA RIGA:
        document.body.classList.remove("menu-aperto");
    }
}