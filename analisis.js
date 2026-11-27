/* =================================
   TEMA (gelap / terang) & UKURAN HURUF
================================= */

(function () {
    var data = {};
    try {
        data = JSON.parse(localStorage.getItem('pengaturanPimpinan')) || {};
    } catch (e) {}

    var gelap = data.tema === 'gelap';
    var kelasHuruf = { kecil: 'font-small', besar: 'font-large' }[data.huruf] || 'font-medium';

    if (gelap) {
        document.documentElement.classList.add('dark-theme');
    }

    function pasang() {
        if (gelap) document.body.classList.add('dark-theme');

        var sudahAda = /font-(small|medium|large)/.test(document.body.className);
        if (!sudahAda) document.body.classList.add(kelasHuruf);
    }

    if (document.body) {
        pasang();
    } else {
        document.addEventListener('DOMContentLoaded', pasang);
    }
})();



/* =================================
   BAHASA (dibaca sekali, dipakai semua bagian)
================================= */

const isEn = (function () {
    var data = {};
    try {
        data = JSON.parse(localStorage.getItem('pengaturanPimpinan')) || {};
    } catch (e) {}

    var b = String(data.bahasa || data.language || data.lang || '').toLowerCase();
    return (b === 'en' || b.indexOf('eng') === 0 || b.indexOf('ing') === 0);
})();

const namaRuanganEn = {
    'Kelas': 'Classroom',
    'L. Komputer': 'Computer Lab',
    'R. Dosen': 'Lecturers Room',
    'R. T.U': 'Admin Office',
    'R. Seminar': 'Seminar Room',
    'Perpustakaan': 'Library',
    'Laboratorium': 'Laboratory'
};

function namaRuangan(nama) {
    return isEn ? (namaRuanganEn[nama] || nama) : nama;
}

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. SIDEBAR & HAMBURGER MENU
    // ==========================================
    const btnHamburger = document.getElementById('btn-hamburger');
    const sidebar = document.getElementById('sidebar');

    if (btnHamburger && sidebar) {
        btnHamburger.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');

            btnHamburger.setAttribute(
                'aria-expanded',
                sidebar.classList.contains('collapsed') ? 'false' : 'true'
            );
        });
    }

    // ==========================================
    // 2. DROPDOWN PROFIL USER
    // ==========================================
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('user-dropdown');

    function setDropdown(open) {
        userDropdown.hidden = !open;
        userBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setDropdown(userDropdown.hidden);
        });

        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
                setDropdown(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setDropdown(false);
        });
    }

    // ==========================================
    // 3. GRAFIK DENGAN CHART.JS
    // ==========================================
    const ctx = document.getElementById('grafikListrik');

    if (ctx && typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Inter', Arial, sans-serif";
                // Warna grafik untuk tema gelap
        if (document.documentElement.classList.contains('dark-theme')) {
            Chart.defaults.color = '#cbd5e1';
            Chart.defaults.borderColor = '#22344f';
        }

        const labelGrafik = [
            'Kelas', 'L. Komputer', 'R. Dosen', 'R. T.U',
            'R. Seminar', 'Perpustakaan', 'Laboratorium'
        ].map(namaRuangan);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labelGrafik,
                datasets: [{
                    label: isEn ? 'Electricity usage (kWh)' : 'Pemakaian listrik (kWh)',
                    data: [800, 200, 150, 120, 950, 1050, 1300],
                    backgroundColor: document.documentElement.classList.contains('dark-theme') ? '#3b82f6' : '#7cb5ec',
                    barThickness: 30,
                    borderRadius: 4
                }]
            },
            options: {
                locale: isEn ? 'en-US' : 'id-ID',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1600
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // ==========================================
    // 4. TABEL DENGAN PAGINATION
    // ==========================================
    const dataRuangan = [
        { no: 1, nama: 'Kelas', ac: 8, lampu: 3, kwh: 800, rasio: 53.3 },
        { no: 2, nama: 'L. Komputer', ac: 28, lampu: 10, kwh: 200, rasio: 40.0 },
        { no: 3, nama: 'R. Dosen', ac: 13, lampu: 6, kwh: 150, rasio: 18.8 },
        { no: 4, nama: 'R. T.U', ac: 11, lampu: 7, kwh: 120, rasio: 19.7 },
        { no: 5, nama: 'R. Seminar', ac: 6, lampu: 8, kwh: 950, rasio: 31.7 },
        { no: 6, nama: 'Perpustakaan', ac: 10, lampu: 12, kwh: 1050, rasio: 28.4 },
        { no: 7, nama: 'Laboratorium', ac: 5, lampu: 6, kwh: 1300, rasio: 35.2 }
    ];

    const itemPerPage = 4;
    let currentPage = 1;
    const totalPages = Math.ceil(dataRuangan.length / itemPerPage);

    const tbody = document.getElementById('tabel-data');
    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');
    const pageInfo = document.getElementById('page-info');

    function renderTable(page) {
        if (!tbody) return;
        tbody.innerHTML = '';

        const start = (page - 1) * itemPerPage;
        const end = start + itemPerPage;
        const paginatedData = dataRuangan.slice(start, end);

        paginatedData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.no}</td>
                <td>${namaRuangan(row.nama)}</td>
                <td>${row.ac}</td>
                <td>${row.lampu}</td>
                <td>${row.kwh.toLocaleString(isEn ? 'en-US' : 'id-ID')}</td>
                <td>${row.rasio.toFixed(1)}</td>
            `;
            tbody.appendChild(tr);
        });

        if (pageInfo) pageInfo.innerText = `${page} / ${totalPages}`;

        if (btnBack) btnBack.disabled = (page === 1);
        if (btnNext) btnNext.disabled = (page === totalPages);
    }

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(currentPage);
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable(currentPage);
            }
        });
    }

    renderTable(currentPage);
});

/* =================================
   TERJEMAHAN BAHASA INGGRIS (teks halaman)
================================= */

(function () {

    if (!isEn) return;

    document.documentElement.lang = 'en';

    var kamus = {
        // Sidebar & header
        'Dashboard': 'Dashboard',
        'Laporan': 'Reports',
        'Analisis': 'Analysis',
        'Keluar': 'Logout',
        'Pimpinan': 'Leader',
        'Edit Profil': 'Edit Profile',
        'Pengaturan': 'Settings',

        // Judul halaman
        'Analisis Pimpinan': 'Leader Analysis',
        'Perbandingan Listrik (bulan ini)': 'Electricity Comparison (this month)',
        'Pemakaian listrik (kWh)': 'Electricity usage (kWh)',

        // Header tabel
        'N. Ruangan': 'Room Name',
        'Jml AC': 'AC Count',
        'Jml Lampu': 'Lamp Count',
        'RASIO': 'RATIO'
    };

    var pola = [
        [/^Perbandingan konsumsi dan efisiensi energi per ruangan, Oktober (\d+)$/,
            'Comparison of energy consumption and efficiency per room, October $1']
    ];

    function terjemah(teks) {
        if (kamus[teks]) return kamus[teks];

        for (var i = 0; i < pola.length; i++) {
            if (pola[i][0].test(teks)) return teks.replace(pola[i][0], pola[i][1]);
        }

        return teks;
    }

    function semua() {

        // Teks biasa
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        var node;

        while ((node = walker.nextNode())) {
            var induk = node.parentNode.nodeName;
            if (induk === 'SCRIPT' || induk === 'STYLE') continue;

            var asli = node.nodeValue;
            var bersih = asli.replace(/\s+/g, ' ').trim();
            if (!bersih) continue;

            var hasil = terjemah(bersih);
                      if (hasil !== bersih) {
                node.nodeValue = hasil;
            }
        }

               // Header tabel yang teksnya terpecah (misalnya "Jml<br>AC")
        document.querySelectorAll('th').forEach(function (th) {
            // innerText mengubah <br> menjadi spasi, jadi "Jml<br>AC" terbaca "Jml AC"
            var teks = th.innerText.replace(/\s+/g, ' ').trim();
            if (kamus[teks]) {
                th.textContent = kamus[teks];
            }
        });

        // Nama aplikasi di sidebar
        var brand = document.querySelector('.brand-text');
        if (brand && brand.textContent.indexOf('Sistem') !== -1) {
            brand.innerHTML = 'Electricity Usage<br>System';
        }

        // Atribut title & aria-label
        document.querySelectorAll('[title], [aria-label]').forEach(function (el) {
            ['title', 'aria-label'].forEach(function (attr) {
                var nilai = el.getAttribute(attr);
                if (nilai && kamus[nilai]) el.setAttribute(attr, kamus[nilai]);
            });
        });

        document.title = 'Analysis - Electricity Usage System';
    }

    semua();

    // Terjemahkan lagi kalau tabel/isi halaman digambar ulang oleh JS
    new MutationObserver(semua).observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true
    });

})();

// ==========================================
// KONFIRMASI KELUAR
// ==========================================
(function () {

    // CSS kotak konfirmasi (disisipkan lewat JS)
    var style = document.createElement('style');
    style.textContent = `
        .lo-overlay {
            position: fixed; inset: 0; z-index: 9999;
            display: none; align-items: center; justify-content: center;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(4px);
        }
        .lo-overlay.show { display: flex; }
        .lo-box {
            font-size: 16px;
            background: #fff; border-radius: 1.25em;
            width: min(92vw, 24em); padding: 1.7em 1.6em 1.5em;
            text-align: center; font-family: 'Inter', Arial, sans-serif;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
        }
        body.font-small  .lo-box { font-size: 14px; }
        body.font-medium .lo-box { font-size: 16px; }
        body.font-large  .lo-box { font-size: 18px; }
        .lo-icon {
            width: 4em; height: 4em; border-radius: 50%;
            background: #fee2e2; margin: 0 auto 1em;
            display: flex; align-items: center; justify-content: center;
        }
        .lo-icon svg {
            width: 1.9em; height: 1.9em; fill: none; stroke: #dc2626;
            stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
        }
        .lo-title { margin: 0 0 0.45em; font-size: 1.25em; font-weight: 800; color: #0f2a44; }
        .lo-text { margin: 0 0 1.3em; font-size: 0.9em; line-height: 1.6; color: #64748b; }
        .lo-actions { display: flex; gap: 0.7em; }
        .lo-actions button {
            flex: 1; padding: 0.8em 0.6em; border-radius: 0.7em;
            font-size: 0.95em; font-weight: 700; cursor: pointer;
            font-family: inherit;
        }
        .lo-cancel { background: #fff; color: #0f2a44; border: 1px solid #e2e8f0; }
        .lo-confirm { background: #dc2626; color: #fff; border: 1px solid #dc2626; }
    `;
    document.head.appendChild(style);

    // Teks sesuai bahasa
    function teks() {
        var inggris = document.documentElement.lang === 'en';
        return inggris ? {
            title: 'Log out of your account?',
            text: 'You are about to log out of the Electricity Consumption System. Make sure your work has been saved.',
            cancel: 'Cancel',
            confirm: 'Yes, Log Out'
        } : {
            title: 'Keluar dari akun?',
            text: 'Anda akan keluar dari Sistem Konsumsi Listrik. Pastikan pekerjaan Anda sudah tersimpan.',
            cancel: 'Batal',
            confirm: 'Ya, Keluar'
        };
    }

    // Buat kotak
    var overlay = document.createElement('div');
    overlay.className = 'lo-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
        <div class="lo-box">
            <div class="lo-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <path d="M16 17l5-5-5-5"/>
                    <path d="M21 12H9"/>
                </svg>
            </div>
            <h3 class="lo-title"></h3>
            <p class="lo-text"></p>
            <div class="lo-actions">
                <button type="button" class="lo-cancel"></button>
                <button type="button" class="lo-confirm"></button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    var tujuan = '../auth/login.php';

    function buka(href) {
        var t = teks();
        tujuan = href || tujuan;

        overlay.querySelector('.lo-title').textContent = t.title;
        overlay.querySelector('.lo-text').textContent = t.text;
        overlay.querySelector('.lo-cancel').textContent = t.cancel;
        overlay.querySelector('.lo-confirm').textContent = t.confirm;

        overlay.classList.add('show');
        overlay.querySelector('.lo-cancel').focus();
    }

    function tutup() {
        overlay.classList.remove('show');
    }

    overlay.querySelector('.lo-cancel').addEventListener('click', tutup);

    overlay.querySelector('.lo-confirm').addEventListener('click', function () {
        window.location.href = tujuan;
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) tutup();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') tutup();
    });

    // Pasang ke semua tombol Keluar
    document.querySelectorAll('.logout').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            buka(el.getAttribute('href'));
        });
    });

})();