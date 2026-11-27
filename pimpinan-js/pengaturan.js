(function () {
    // ===== DROPDOWN PROFIL =====
    var profileBtn = document.getElementById('profileBtn');
    var profileMenu = document.getElementById('profileMenu');

    profileBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        profileMenu.hidden = !profileMenu.hidden;
        profileBtn.setAttribute('aria-expanded', String(!profileMenu.hidden));
    });

    document.addEventListener('click', function (event) {
        if (!profileMenu.contains(event.target) && !profileBtn.contains(event.target)) {
            profileMenu.hidden = true;
            profileBtn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            profileMenu.hidden = true;
            profileBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // ===== HAMBURGER SIDEBAR =====
    var menuBtn = document.getElementById('menuBtn');
    var sidebar = document.getElementById('sidebar');

    menuBtn.addEventListener('click', function () {
        var collapsed = sidebar.classList.toggle('collapsed');
        menuBtn.setAttribute('aria-expanded', String(!collapsed));
    });

    // ===== ELEMEN FORM =====
    var settingsForm = document.getElementById('settingsForm');
    var bahasa = document.getElementById('bahasa');
    var sidebarOtomatis = document.getElementById('sidebarOtomatis');

    // ===== MENERAPKAN PENGATURAN =====
    function applySettings(data) {
        document.body.classList.toggle('dark-theme', data.tema === 'gelap');

        if (typeof terapkanBahasa === 'function') terapkanBahasa();

        document.body.classList.remove('font-small', 'font-medium', 'font-large');

        var fontClass = {
            kecil: 'font-small',
            sedang: 'font-medium',
            besar: 'font-large'
        };

        document.body.classList.add(fontClass[data.huruf] || 'font-medium');

        var isCollapsed = data.sidebarOtomatis === false;
        sidebar.classList.toggle('collapsed', isCollapsed);
        menuBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
    }

    // ===== MEMUAT PENGATURAN =====
    function loadSettings() {
        var saved = localStorage.getItem('pengaturanPimpinan');

        var defaultSettings = {
            bahasa: 'id',
            tema: 'terang',
            huruf: 'sedang',
            sidebarOtomatis: true
        };

        var data = Object.assign({}, defaultSettings);

        if (saved) {
            try {
                data = Object.assign({}, defaultSettings, JSON.parse(saved));
            } catch (error) {
                console.error('Data pengaturan tidak valid:', error);
            }
        }

        bahasa.value = data.bahasa;

        var temaInput = document.querySelector(
            'input[name="tema"][value="' + data.tema + '"]'
        );
        if (temaInput) temaInput.checked = true;

        var hurufInput = document.querySelector(
            'input[name="huruf"][value="' + data.huruf + '"]'
        );
        if (hurufInput) hurufInput.checked = true;

        sidebarOtomatis.checked = data.sidebarOtomatis !== false;

        applySettings(data);
    }

    // ===== SIMPAN PENGATURAN =====
    settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var temaTerpilih = document.querySelector('input[name="tema"]:checked');
        var hurufTerpilih = document.querySelector('input[name="huruf"]:checked');

        var data = {
            bahasa: bahasa.value,
            tema: temaTerpilih ? temaTerpilih.value : 'terang',
            huruf: hurufTerpilih ? hurufTerpilih.value : 'sedang',
            sidebarOtomatis: sidebarOtomatis.checked
        };

        localStorage.setItem('pengaturanPimpinan', JSON.stringify(data));

        applySettings(data);

        alert('Pengaturan berhasil disimpan.');
    });

    // ===== TOMBOL BATAL =====
    settingsForm.addEventListener('reset', function () {
        setTimeout(function () {
            loadSettings();
        }, 0);
    });

        // ===== KONFIRMASI KELUAR =====
    var logoutLink = document.getElementById('logout');

    function prosesKeluar() {
        sessionStorage.removeItem('pengguna');
        sessionStorage.setItem('pesanFlash', 'Berhasil keluar.');
        window.location.href = (typeof HALAMAN_LOGIN !== 'undefined')
            ? HALAMAN_LOGIN
            : '../auth/login.php';
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();

            // Pakai kotak konfirmasi yang sama dengan admin dan operator (dari components.js)
            if (typeof tampilkanKonfirmasiKeluar === 'function') {
                tampilkanKonfirmasiKeluar(prosesKeluar);
            } else {
                prosesKeluar();
            }
        });
    }

    // ===== JALANKAN SAAT HALAMAN DIBUKA =====
    loadSettings();
})();
// ==========================================
// SINKRONKAN TEMA (html mengikuti body)
// ==========================================
(function () {

    function sinkron() {
        var gelap = document.body.classList.contains('dark-theme');
        document.documentElement.classList.toggle('dark-theme', gelap);
    }

    new MutationObserver(sinkron).observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    sinkron();

})();