/* =================================
   LAPORAN ADMIN - JAVASCRIPT (FIXED)
================================= */

const isEn = (function () {
    var data = {};
    try {
        data = JSON.parse(localStorage.getItem('pengaturanAdmin')) || {};
    } catch (e) {}

    var b = String(data.bahasa || data.language || data.lang || '').toLowerCase();
    return (b === 'en' || b.indexOf('eng') === 0 || b.indexOf('ing') === 0);
})();

// Kamus terjemahan utama
const kamusLaporan = {
    'Laporan Konsumsi Listrik': 'Electricity Consumption Report',
    'Rekapitulasi pemakaian listrik berdasarkan ruangan dan periode': 'Summary of electricity usage by room and period',
    'Bulan': 'Month',
    'Tahun': 'Year',
    'Status': 'Status',
    'Semua Bulan': 'All Months',
    'Semua Tahun': 'All Years',
    'Semua Status': 'All Statuses',
    'Semua': 'All',
    'Tampilkan': 'Show',
    'Cetak PDF': 'Print PDF',
    'Cari ruangan atau bulan...': 'Search room or month...',
    'Nama Ruangan': 'Room Name',
    'Total kWh': 'Total kWh',
    
    // Status
    'NORMAL': 'NORMAL',
    'BOROS': 'WASTEFUL',
    'HEMAT': 'SAVING',
    'Normal': 'NORMAL',
    'Boros': 'Wasteful',
    'Hemat': 'Saving',
    'Efficient': 'Efficient',

    // Bulan
    'Okt': 'Oct', 'Sep': 'Sep', 'Agu': 'Aug', 'Des': 'Dec',
    'Jan': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Apr',
    'Mei': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Nov': 'Nov',

    // Navigasi
    'Back': 'Back',
    'Next': 'Next',
    'Tidak ada data laporan yang ditemukan di database.': 'No report data found in the database.',

    // Nama Ruangan
    'R. Perpustakaan': 'Library Room',
    'R. Lab Komputer 1': 'Computer Lab 1',
    'R. Lab Komputer 2': 'Computer Lab 2',
    'Lab Komputer 1': 'Computer Lab 1',
    'Lab Komputer 2': 'Computer Lab 2',
    'R. Lab Komputer': 'Computer Lab',

    // Menu Sidebar & Header
    'Dashboard': 'Dashboard',
    'Data Ruangan': 'Room Data',
    'Data Tagihan': 'Billing Data',
    'Edit User': 'Edit User',
    'Laporan': 'Reports',
    'Keluar': 'Logout',
    'Admin': 'Admin',
    'Edit Profil': 'Edit Profile',
    'Pengaturan': 'Settings'
};

// Fungsi penerjemah cerdas
const T = text => {
    if (!isEn || !text) return text;
    let clean = String(text).trim();
    if (kamusLaporan[clean]) return kamusLaporan[clean];

    let lower = clean.toLowerCase();
    if (lower.includes('lab komputer 1')) return clean.replace(/lab komputer 1/gi, 'Computer Lab 1').replace(/r\.\s*/gi, '');
    if (lower.includes('lab komputer 2')) return clean.replace(/lab komputer 2/gi, 'Computer Lab 2').replace(/r\.\s*/gi, '');
    if (lower.includes('perpustakaan')) return clean.replace(/perpustakaan/gi, 'Library').replace(/r\.\s*/gi, '');
    if (lower.includes('semua tahun')) return 'All Years';
    if (lower.includes('semua bulan')) return 'All Months';
    if (lower.includes('semua status')) return 'All Statuses';

    return text;
};

// Fungsi pemindai untuk menerjemahkan elemen teks halaman secara real-time
function translateDOM() {
    if (!isEn) return;
    document.querySelectorAll('h1, h2, h3, h4, label, button, option, th, td, span, a, p').forEach(el => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
            let txt = el.textContent.trim();
            let translated = T(txt);
            if (translated !== txt) {
                el.textContent = translated;
            }
        } else if (el.tagName === 'OPTION') {
            let txt = el.textContent.trim();
            let translated = T(txt);
            if (translated !== txt) {
                el.textContent = translated;
            }
        }
    });

    const searchInput = document.querySelector('input[name="cari"]');
    if (searchInput && searchInput.placeholder) {
        searchInput.placeholder = T(searchInput.placeholder);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Terapkan Tema dan Bahasa dari LocalStorage saat halaman dimuat
    try {
        let settings = JSON.parse(localStorage.getItem('pengaturanAdmin')) || {};
        if (settings.tema === 'gelap') {
            document.documentElement.classList.add('dark-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
            document.body.classList.remove('dark-theme');
        }
    } catch (e) {}

    if (isEn) {
        document.documentElement.lang = 'en';
        document.title = 'Reports (Admin) — Electricity Consumption System';
        translateDOM();
    }

    // Observer untuk mendeteksi perubahan elemen secara dinamis
    if (isEn) {
        const observer = new MutationObserver(() => {
            translateDOM();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
});