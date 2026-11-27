/* =================================
   PENGATURAN ADMIN - JAVASCRIPT
================================= */

// Kamus terjemahan lengkap untuk Admin
const kamusAdmin = {
    'Pengaturan': 'Settings',
    'Pengaturan Admin': 'Admin Settings',
    'Atur bahasa dan tampilan aplikasi': 'Configure application language and appearance',
    'Bahasa': 'Language',
    'Bahasa Indonesia': 'Indonesian',
    'Bahasa Inggris': 'English',
    'Tema': 'Theme',
    'Terang': 'Light',
    'Gelap': 'Dark',
    'Ukuran Huruf': 'Font Size',
    'Kecil': 'Small',
    'Sedang': 'Medium',
    'Besar': 'Large',
    'Sidebar terbuka otomatis': 'Auto-open sidebar',
    'Tampilkan menu samping secara penuh saat halaman dibuka': 'Display the side menu fully when the page is opened',
    'Batal': 'Cancel',
    'Simpan Pengaturan': 'Save Settings',
    'Berhasil!': 'Success!',
    'Pengaturan Admin berhasil disimpan.': 'Admin settings successfully saved.',
    'OK': 'OK',

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

function cekBahasaEn() {
    let data = {};
    try {
        data = JSON.parse(localStorage.getItem('pengaturanAdmin')) || {};
    } catch (e) {}
    let b = String(data.bahasa || data.language || data.lang || '').toLowerCase();
    return (b === 'en' || b.indexOf('eng') === 0 || b.indexOf('ing') === 0);
}

const T = text => (cekBahasaEn() && kamusAdmin[text]) ? kamusAdmin[text] : text;

document.addEventListener('DOMContentLoaded', () => {
    if (cekBahasaEn()) {
        document.documentElement.lang = 'en';
        document.title = 'Admin Settings - Electricity Usage System';

        // Terjemahkan seluruh elemen teks di halaman secara agresif
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, label, span, p, a, button, option').forEach(el => {
            let original = el.textContent.trim();
            if (kamusAdmin[original]) {
                el.textContent = kamusAdmin[original];
            }
        });
    }

    loadSettings();

    const form = document.getElementById('settingsForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            saveSettings();
        });
    }
});

function loadSettings() {
    try {
        let data = JSON.parse(localStorage.getItem('pengaturanAdmin')) || {};
        
        // 1. Bahasa
        if (data.bahasa) {
            const selectBahasa = document.getElementById('bahasa');
            if (selectBahasa) selectBahasa.value = data.bahasa;
        }

        // 2. Tema (Radio Button)
        if (data.tema) {
            const temaRadio = document.querySelector(`input[name="tema"][value="${data.tema}"]`);
            if (temaRadio) temaRadio.checked = true;
        }

        // 3. Ukuran Huruf (Radio Button)
        if (data.huruf) {
            const hurufRadio = document.querySelector(`input[name="huruf"][value="${data.huruf}"]`);
            if (hurufRadio) hurufRadio.checked = true;
        }

        // 4. Sidebar Otomatis (Checkbox)
        if (data.sidebar !== undefined) {
            const sidebarCheck = document.getElementById('sidebarOtomatis');
            if (sidebarCheck) sidebarCheck.checked = data.sidebar;
        }
    } catch (e) {}
}

function saveSettings() {
    const bahasaSelect = document.getElementById('bahasa');
    const temaChecked = document.querySelector('input[name="tema"]:checked');
    const hurufChecked = document.querySelector('input[name="huruf"]:checked');
    const sidebarCheck = document.getElementById('sidebarOtomatis');

    const data = {
        bahasa: bahasaSelect ? bahasaSelect.value : 'id',
        tema: temaChecked ? temaChecked.value : 'terang',
        huruf: hurufChecked ? hurufChecked.value : 'sedang',
        sidebar: sidebarCheck ? sidebarCheck.checked : true
    };

    localStorage.setItem('pengaturanAdmin', JSON.stringify(data));

    // Terapkan perubahan tema/huruf secara langsung ke elemen root/body
    if (data.tema === 'gelap') {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }

    showModal(T('Berhasil!'), T('Pengaturan Admin berhasil disimpan.'));
}

function showModal(title, message) {
    let overlay = document.getElementById('modalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'modalOverlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
            display: flex; align-items: center; justify-content: center; z-index: 9999;
            backdrop-filter: blur(4px);
        `;
        overlay.innerHTML = `
            <div style="background: #1e293b; color: #f8fafc; padding: 24px; border-radius: 16px; width: min(90vw, 360px); text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
                <div style="width: 48px; height: 48px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">✓</div>
                <h3 id="modalTitle" style="margin: 0 0 8px; font-size: 20px; font-weight: 700;"></h3>
                <p id="modalMessage" style="margin: 0 0 20px; font-size: 14px; color: #94a3b8; line-height: 1.5;"></p>
                <button id="modalBtn" style="width: 100%; padding: 10px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;"></button>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('modalBtn').textContent = T('OK');

    overlay.style.display = 'flex';

    document.getElementById('modalBtn').onclick = function () {
        overlay.style.display = 'none';
        location.reload();
    };
}