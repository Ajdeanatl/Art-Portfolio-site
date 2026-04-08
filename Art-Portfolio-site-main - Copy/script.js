const products = [
    {
        id: 1,
        title: "Bass Guitar Commission",
        shopTitle: "Bass Guitar Print",
        year: "2026 Gallery",
        price: "$50.00",
        type: "prints",
        showInGallery: true,
        images: ["assets/guitar.jpg", "assets/guitar2.jpg", "assets/guitar3.jpg", "assets/guitar4.jpg"],
        galleryDescription: "Acryllic on polyurethane \n13\"\ x 20.5\"\ ",
        shopDescription: "High quality 300 DPI print of an airbrushed bass guitar.\n 14\"\ x 21.75\"\ ",
        stripeLink: "https://buy.stripe.com/9B6eVd2cfcz90lnesa0Ny00"
    },
    {
        id: 2,
        title: "Test Gallery 2",
        shopTitle: null,
        year: "2025",
        price: null,
        type: null,
        showInGallery: false,
        image: "assets/testgallery2.png", // Will not break! Script now handles both image & images formats.
        description: "Test",
        stripeLink: null
    },
    {
        id: 3,
        title: "Test Hat",
        shopTitle: "Test Hat",
        year: "2025",
        price: "$99.99",
        type: "apparel",
        showInGallery: false,
        image: "assets/testhat.png",
        description: "Test",
        stripeLink: null
    },
    {
        id: 4,
        title: "Rodeo Scene Graphic Commission",
        shopTitle: null,
        year: "2026 Gallery",
        price: null,
        type: null,
        showInGallery: true,
        images: ["assets/rodeoscene.jpg", "assets/rodeoscene2.jpg"],
        galleryDescription: "Acryllic on canvas \n20\"\ x 15\"\ ",
        stripeLink: null
    }
];

// View Elements
const galleryContainer = document.getElementById("gallery-container");
const galleryView = document.getElementById("gallery-view");
const artView = document.getElementById("art-view");
const productView = document.getElementById("product-view");
const aboutView = document.getElementById("about-view");
const contactView = document.getElementById("contact-view");
const sidebar = document.getElementById("sidebar");
const shopSubmenu = document.getElementById("shop-submenu");
const scrollIndicator = document.getElementById("scroll-indicator");

// Carousel State variables
let currentArtImages = [];
let currentImageIndex = 0;

window.onload = function () {
    renderMainGallery();
};

// --- HELPER FUNCTION: Prevents crashes if you use 'image' instead of 'images' ---
function getImages(item) {
    if (item.images && Array.isArray(item.images)) return item.images;
    if (item.image) return [item.image];
    return [""]; // Safe fallback
}

function renderMainGallery() {
    hideAllViews();
    galleryView.classList.remove("hidden");
    galleryContainer.innerHTML = "";

    const galleryItems = products.filter(item => item.showInGallery);

    if (galleryItems.length === 0) {
        galleryContainer.innerHTML = "<p style='text-align:center;padding:3rem;'>No gallery items yet.</p>";
        return;
    }

    const years = [...new Set(galleryItems.map(item => item.year))].sort().reverse();

    years.forEach(year => {
        const yearHeader = document.createElement("div");
        yearHeader.className = "section-header";
        yearHeader.innerHTML = `<span>${year}</span>`;
        galleryContainer.appendChild(yearHeader);

        const grid = document.createElement("div");
        grid.className = "grid-container";

        galleryItems
            .filter(item => item.year === year)
            .forEach(item => {
                const card = document.createElement("div");
                card.className = "card gallery-card";
                
                const itemImages = getImages(item);

                card.innerHTML = `
                    <img src="${itemImages[0]}" 
                         class="card-img"
                         onclick="openArt(${item.id})"
                         onload="resizeMasonryItems()"> 

                    <div class="card-info">
                        <div class="card-title">${item.title}</div>
                        <button class="btn btn-view-full" onclick="openArt(${item.id})">See More</button>
                    </div>
                `;
                grid.appendChild(card);
            });

        galleryContainer.appendChild(grid);
    });

    setTimeout(resizeMasonryItems, 200);
}

function openArt(id) {
    const item = products.find(p => p.id === id);
    if (!item) return;

    hideAllViews();
    artView.classList.remove("hidden");

    currentArtImages = getImages(item);
    currentImageIndex = 0;

    document.getElementById("a-title").innerText = item.title;
    document.getElementById("a-desc").innerText = item.galleryDescription || "";
    updateCarousel();
    window.scrollTo(0, 0);
    setTimeout(checkScrollIndicator, 100);
}

function updateCarousel() {
    document.getElementById("a-img").src = currentArtImages[currentImageIndex];
    const dotsContainer = document.getElementById("carousel-dots");
    dotsContainer.innerHTML = "";

    if (currentArtImages.length > 1) {
        document.querySelector(".left-btn").style.display = "block";
        document.querySelector(".right-btn").style.display = "block";

        currentArtImages.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.className = `dot ${index === currentImageIndex ? 'active' : ''}`;
            dot.onclick = () => goToImage(index);
            dotsContainer.appendChild(dot);
        });
    } else {
        document.querySelector(".left-btn").style.display = "none";
        document.querySelector(".right-btn").style.display = "none";
    }
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentArtImages.length;
    updateCarousel();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + currentArtImages.length) % currentArtImages.length;
    updateCarousel();
}

function goToImage(index) {
    currentImageIndex = index;
    updateCarousel();
}

function openFullImage() {
    if(currentArtImages.length > 0) {
        window.open(currentArtImages[currentImageIndex], '_blank');
    }
}

function renderShop(category) {
    hideAllViews();
    galleryView.classList.remove("hidden");
    galleryContainer.innerHTML = "";

    const shopHeader = document.createElement("div");
    shopHeader.className = "section-header";
    shopHeader.innerHTML = `<span>Shop: ${category.charAt(0).toUpperCase() + category.slice(1)}</span>`;
    galleryContainer.appendChild(shopHeader);

    const grid = document.createElement("div");
    grid.className = "grid-container";

    const shopItems = products.filter(item => item.type === category);

    if (shopItems.length === 0) {
        galleryContainer.innerHTML += "<p style='text-align:center;padding:2rem;'>No items found.</p>";
        return;
    }

    shopItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "card shop-card";
        
        const itemImages = getImages(item);

        card.innerHTML = `
            <img src="${itemImages[0]}" 
                 class="card-img"
                 onclick="openProduct(${item.id})"
                 onload="resizeMasonryItems()">

            <div class="card-info">
                <div class="card-title">${item.shopTitle || item.title}</div>
                <div class="card-price">${item.price}</div>
            </div>
        `;
        grid.appendChild(card);
    });

    galleryContainer.appendChild(grid);
    setTimeout(resizeMasonryItems, 200);
}

function openProduct(id) {
    const item = products.find(p => p.id === id);
    if (!item || !item.type) return;

    hideAllViews();
    productView.classList.remove("hidden");

    const itemImages = getImages(item);
    document.getElementById("p-img").src = itemImages[0];
    
    document.getElementById("p-title").innerText = item.shopTitle || item.title;
    document.getElementById("p-price").innerText = item.price;
    document.getElementById("p-desc").innerText = item.shopDescription || "";
    document.getElementById("p-buy-link").href = item.stripeLink;

    window.scrollTo(0, 0);
    setTimeout(checkScrollIndicator, 100);
}

function resizeMasonryItems() {
    const grids = document.querySelectorAll(".grid-container");
    if (grids.length === 0) {
        checkScrollIndicator();
        return;
    }

    grids.forEach(grid => {
        const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")) || 10;
        const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("gap")) || 32;

        grid.querySelectorAll(".card").forEach(item => {
            const img = item.querySelector("img");
            const info = item.querySelector(".card-info");
            
            if (img && info) {
                const height = img.getBoundingClientRect().height + info.getBoundingClientRect().height;
                const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
                item.style.gridRowEnd = "span " + span;
            }
        });
    });

    checkScrollIndicator();
}

function showPage(page) {
    hideAllViews();
    if (page === "about") aboutView.classList.remove("hidden");
    if (page === "contact") contactView.classList.remove("hidden");
    setTimeout(checkScrollIndicator, 100);
}

function goBack() {
    renderMainGallery();
}

function hideAllViews() {
    galleryView.classList.add("hidden");
    artView.classList.add("hidden");
    productView.classList.add("hidden");
    aboutView.classList.add("hidden");
    contactView.classList.add("hidden");
}

function toggleSidebar() {
    sidebar.classList.toggle("open");
}

function toggleShopMenu() {
    shopSubmenu.classList.toggle("hidden-submenu");
}

/* --- Scroll Indicator Logic --- */
function checkScrollIndicator() {
    if (!scrollIndicator) return;
    
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    // Hides arrow if there is nowhere to scroll, or if you reach the bottom
    if (scrollHeight <= clientHeight || (scrollTop + clientHeight >= scrollHeight - 50)) {
        scrollIndicator.classList.add('hidden-scroll');
    } else {
        scrollIndicator.classList.remove('hidden-scroll');
    }
}

function scrollDown() {
    window.scrollBy({
        top: window.innerHeight * 0.6,
        behavior: 'smooth'
    });
}

window.addEventListener("scroll", checkScrollIndicator);
window.addEventListener("resize", () => {
    setTimeout(resizeMasonryItems, 100);
});