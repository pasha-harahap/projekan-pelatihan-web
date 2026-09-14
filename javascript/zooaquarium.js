let currentAnimals = [];
// Menyimpan semua data hewan dari kategori yang sedang dibuka
let filteredAnimals = [];
// Menyimpan data hewan hasil pencarian (filter), defaultnya sama dengan currentAnimals
let currentPage = 1;
// Mengatur posisi halaman saat ini, dimulai dari halaman 1
const itemsPerPage = 6;
// Membatasi jumlah hewan yang ditampilkan dalam satu halaman sebanyak 6
const currentCategory = document.body.getAttribute('data-category');
// Mengambil nilai kategori dari atribut 'data-category' di tag <body>

const animalContainer = document.getElementById('animal-container');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// ----------------------------------------------------
// FUNGSI FETCH MENGGUNAKAN FILE JSON LOKAL
// ----------------------------------------------------
function fetchAnimalsData() {
    // Menggunakan path relatif '../' karena file HTML berada di dalam folder 'html/'
    // dan file JSON berada di dalam folder 'javascript/'
    fetch('../javascript/zooaquarium.json')
        .then(response => {
            if (!response.ok) throw new Error("Gagal mengambil data dari file JSON lokal");
            return response.json();
        })
        .then(allData => {
            currentAnimals = allData[currentCategory] || [];
            filteredAnimals = currentAnimals; 
            updateDisplay(); 
        })
        .catch(error => {
            console.error("Error Fetch Local JSON:", error);
            if (animalContainer) {
                animalContainer.innerHTML= '<div class="no-data">Gagal memuat data lokal. Pastikan membuka project menggunakan Live Server!</div>';
            }
        });
}
// ----------------------------------------------------

// Logika Pembagian Halaman (Pagination)
function updateDisplay() {
    const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage) || 1;
    
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const animalsToShow = filteredAnimals.slice(startIndex, endIndex);

    renderAnimals(animalsToShow);

    if (pageInfo) {
        pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
    }

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

// Menampilkan Kartu Hewan 
function renderAnimals(data) {
    if (!animalContainer) return;

    while (animalContainer.firstChild) {
        animalContainer.removeChild(animalContainer.firstChild);
    }

    if (data.length === 0) {
        const noDataDiv = document.createElement('div');
        noDataDiv.className = 'no-data';
        noDataDiv.textContent = 'Hewan tidak ditemukan...';
        animalContainer.appendChild(noDataDiv);
        return;
    }

    for (let i = 0; i < data.length; i++) {
        const animal = data[i];

        const card = document.createElement('div');
        card.className = 'card';
        card.addEventListener('click', () => openModal(animal));

        const img = document.createElement('img');
        img.src = animal.gambar;
        img.className = 'card-img';

        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = animal.nama;

        card.appendChild(img);
        card.appendChild(title);
        animalContainer.appendChild(card);
    }
}

// Logika Pencarian
function handleSearch() {
    const keyword = searchInput.value.toLowerCase();
    
    filteredAnimals = currentAnimals.filter(animal => animal.nama.toLowerCase().includes(keyword));
    
    currentPage = 1;
    updateDisplay();
}

// Menampilkan Halaman Detail Layar Penuh
function openModal(animal) {
    document.getElementById('modal-img').src = animal.gambar;
    document.getElementById('modal-title').textContent = animal.nama;
    document.getElementById('modal-id').textContent = animal.id;
    document.getElementById('modal-category').textContent = animal.kategori;
    document.getElementById('modal-species').textContent = animal.spesies;
    document.getElementById('modal-desc').textContent = animal.deskripsi;
    document.getElementById('modal-fact').textContent = animal.faktaMenarik;
    document.getElementById('modal-fact-img').src = animal.gambarFakta;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalOverlay.scrollTo(0, 0);
}

// Event Listeners Pagination
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateDisplay();
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateDisplay();
        }
    });
}

// Event Listeners Pencarian
if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        handleSearch();
    });
}

if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

// Event Listener Tutup Modal
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = 'auto';
    });
}

// Inisialisasi Program
document.addEventListener('DOMContentLoaded', () => {
    if (currentCategory) {
        fetchAnimalsData();
    }
});