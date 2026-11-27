// ===== HAMBURGER SIDEBAR =====
const menuBtn = document.getElementById('menuBtn');

menuBtn.addEventListener('click', function () {
    document.body.classList.toggle('nav-collapsed');
});

// ===== DROPDOWN PROFIL =====
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');

profileBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    profileMenu.hidden = !profileMenu.hidden;
});

document.addEventListener('click', function (event) {
    if (!profileBtn.contains(event.target) && !profileMenu.contains(event.target)) {
        profileMenu.hidden = true;
    }
});

// ===== TOMBOL KELUAR (dengan konfirmasi) =====
const tombolKeluar = document.getElementById('logout');

tombolKeluar.addEventListener('click', function (event) {
    event.preventDefault();


});

// ===== PENGATURAN OPERATOR =====
const settingsForm = document.getElementById('settingsForm');
const storageKey = 'pengaturanOperator';

function applySettings(data) {

    document.body.classList.toggle('dark-theme', data.tema === 'gelap');

    if (typeof terapkanBahasa === 'function') terapkanBahasa();

    document.body.classList.remove(
        'font-small',
        'font-medium',
        'font-large'
    );

    const fontClass = {
        kecil: 'font-small',
        sedang: 'font-medium',
        besar: 'font-large'
    };

    document.body.classList.add(
        fontClass[data.huruf] || 'font-medium'
    );

    document.body.classList.toggle(
        'nav-collapsed',
        data.sidebarOtomatis === false
    );

}

// ===== MEMUAT PENGATURAN =====
function loadSettings() {

    const defaults = {
        bahasa: 'id',
        tema: 'terang',
        huruf: 'sedang',
        sidebarOtomatis: true
    };

    let data = defaults;

    try {

        const saved = localStorage.getItem(storageKey);

        if (saved) {
            data = {
                ...defaults,
                ...JSON.parse(saved)
            };
        }

    } catch (error) {
        console.error('Gagal membaca pengaturan:', error);
    }

    document.getElementById('bahasa').value = data.bahasa;

    const temaInput = document.querySelector(
        `input[name="tema"][value="${data.tema}"]`
    );

    if (temaInput) {
        temaInput.checked = true;
    }

    const hurufInput = document.querySelector(
        `input[name="huruf"][value="${data.huruf}"]`
    );

    if (hurufInput) {
        hurufInput.checked = true;
    }

    document.getElementById('sidebarOtomatis').checked =
        data.sidebarOtomatis !== false;

    applySettings(data);

}

// ===== SIMPAN PENGATURAN =====
settingsForm.addEventListener('submit', function (event) {

    event.preventDefault();

    const temaChecked = document.querySelector(
        'input[name="tema"]:checked'
    );

    const hurufChecked = document.querySelector(
        'input[name="huruf"]:checked'
    );

    const data = {
        bahasa: document.getElementById('bahasa').value,
        tema: temaChecked ? temaChecked.value : 'terang',
        huruf: hurufChecked ? hurufChecked.value : 'sedang',
        sidebarOtomatis: document.getElementById('sidebarOtomatis').checked
    };

    localStorage.setItem(storageKey, JSON.stringify(data));

    applySettings(data);

    alert('Pengaturan Operator berhasil disimpan.');

});

// ===== TOMBOL BATAL =====
settingsForm.addEventListener('reset', function () {
    setTimeout(loadSettings, 0);
});

// ===== JALANKAN SAAT HALAMAN DIBUKA =====
loadSettings();

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