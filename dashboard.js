(function () {

    /* =================================
       BAHASA
    ================================= */

    function bacaBahasa() {
        var data = {};
        try {
            data = JSON.parse(localStorage.getItem('pengaturanPimpinan')) || {};
        } catch (e) {}

        var b = String(data.bahasa || data.language || data.lang || '').toLowerCase();
        return (b === 'en' || b.indexOf('eng') === 0 || b.indexOf('ing') === 0) ? 'en' : 'id';
    }

    var bahasa = bacaBahasa();
    document.documentElement.lang = bahasa;

    if (bahasa === 'en') {

        // Kamus: tulisan Indonesia -> Inggris (harus sama persis dengan di HTML)
        var kamus = {
            'Pimpinan': 'Leader',
            'Dashboard Pimpinan': 'Leader Dashboard',
            'Laporan': 'Reports',
            'Analisis': 'Analysis',
            'Keluar': 'Logout',
            'Edit Profil': 'Edit Profile',
            'Pengaturan': 'Settings',
            'Total Pemakaian Listrik': 'Total Electricity Usage',
            'Efisiensi Rata-rata': 'Average Efficiency',
            'Perbandingan per Ruangan': 'Comparison per Room',
            'Pemakaian listrik (kWh)': 'Electricity usage (kWh)',
            'Buka atau tutup sidebar': 'Open or close sidebar',
            'Grafik batang pemakaian listrik per ruangan': 'Bar chart of electricity usage per room'
        };

        // Tulisan yang berisi angka/bulan
        var pola = [
            [/^Peringatan: (\d+) ruang Boros$/, 'Warning: $1 wasteful rooms'],
            [/^Ringkasan konsumsi dan efisiensi energi gedung kampus, Oktober (\d+)$/,
                'Summary of campus building energy consumption and efficiency, October $1']
        ];

        function terjemah(teks) {
            if (kamus[teks]) return kamus[teks];
            for (var i = 0; i < pola.length; i++) {
                if (pola[i][0].test(teks)) return teks.replace(pola[i][0], pola[i][1]);
            }
            return teks;
        }

        // Kalimat peringatan (ada link di tengah)
        var alertP = document.querySelector('.alert p');
        if (alertP) {
            alertP.innerHTML =
                'See efficiency recommendations in the ' +
                '<a href="analisis.php" id="linkAnalisis">Analysis</a> menu.';
        }

        // Nama aplikasi di sidebar
        var brand = document.querySelector('.brand-text');
        if (brand) brand.innerHTML = 'Electricity Usage<br>System';

        // Ganti semua teks biasa
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        var node;
        while ((node = walker.nextNode())) {
            var parent = node.parentNode.nodeName;
            if (parent === 'SCRIPT' || parent === 'STYLE') continue;

            var asli = node.nodeValue;
            var bersih = asli.trim();
            if (!bersih) continue;

            var hasil = terjemah(bersih);
            if (hasil !== bersih) {
                node.nodeValue = asli.replace(bersih, hasil);
            }
        }

        // Ganti atribut title dan aria-label
        document.querySelectorAll('[title], [aria-label]').forEach(function (el) {
            ['title', 'aria-label'].forEach(function (attr) {
                var nilai = el.getAttribute(attr);
                if (nilai && kamus[nilai]) el.setAttribute(attr, kamus[nilai]);
            });
        });

        document.title = 'Leader Dashboard - Electricity Usage System';
    }

    /* =================================
       DROPDOWN PROFIL
    ================================= */

    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');

    function setProfileOpen(open) {
        profileMenu.hidden = !open;
        profileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    profileBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        setProfileOpen(profileMenu.hidden);
    });

    document.addEventListener('click', function (event) {
        if (!profileMenu.contains(event.target) && !profileBtn.contains(event.target)) {
            setProfileOpen(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setProfileOpen(false);
        }
    });

    /* =================================
       HAMBURGER SIDEBAR
    ================================= */

    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');

    menuBtn.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');

        menuBtn.setAttribute(
            'aria-expanded',
            sidebar.classList.contains('collapsed') ? 'false' : 'true'
        );
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