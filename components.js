const HALAMAN_LOGIN = '../auth/login.php';
const HALAMAN_LOGOUT = '../auth/logout.php';
const DAFTAR_PERAN = ['admin', 'operator', 'pimpinan'];

// ===== Kunci pengaturan sesuai peran halaman (pengaturanAdmin, dst.) =====
function kunciPengaturan() {
    const cocok = window.location.pathname.match(/\/pages\/(admin|operator|pimpinan)\//);
    if (!cocok) return null;
    return 'pengaturan' + cocok[1].charAt(0).toUpperCase() + cocok[1].slice(1);
}

function bacaPengaturan() {
    const kunci = kunciPengaturan();
    if (!kunci) return {};

    try {
        return JSON.parse(localStorage.getItem(kunci)) || {};
    } catch (error) {
        return {};
    }
}

// ===== Tema (terang / gelap) dan ukuran huruf =====
function terapkanTema() {
    const data = bacaPengaturan();

    document.body.classList.toggle('dark-theme', data.tema === 'gelap');

    const kelasHuruf = {
        kecil: 'font-small',
        sedang: 'font-medium',
        besar: 'font-large'
    };

    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(kelasHuruf[data.huruf] || 'font-medium');
}

// =====================================================
// BAHASA (Indonesia / English)
// =====================================================
const BULAN_PENUH_EN = {
    Januari: 'January', Februari: 'February', Maret: 'March', April: 'April',
    Mei: 'May', Juni: 'June', Juli: 'July', Agustus: 'August',
    September: 'September', Oktober: 'October', November: 'November', Desember: 'December'
};

const BULAN_SINGKAT_EN = {
    Jan: 'Jan', Feb: 'Feb', Mar: 'Mar', Apr: 'Apr', Mei: 'May', Jun: 'Jun',
    Jul: 'Jul', Agu: 'Aug', Sep: 'Sep', Okt: 'Oct', Nov: 'Nov', Des: 'Dec'
};

function bulanPenuhEn(teks) {
    return teks.replace(/\b(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\b/g,
        function (m) { return BULAN_PENUH_EN[m]; });
}

function bulanSingkatEn(teks) {
    return teks.replace(/\b(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)(?=-\d{4})/g,
        function (m) { return BULAN_SINGKAT_EN[m]; });
}

// Kamus: teks Indonesia (persis) -> English
const KAMUS_EN = {
    // Judul halaman
    'Sistem Konsumsi Listrik': 'Electricity Consumption System',
    'Dashboard Admin': 'Admin Dashboard',
    'Dashboard Operator': 'Operator Dashboard',
    'Dashboard Pimpinan': 'Leader Dashboard',
    'Pengaturan Admin': 'Admin Settings',
    'Pengaturan Operator': 'Operator Settings',
    'Pengaturan Pimpinan': 'Leader Settings',
    'Laporan (Admin)': 'Reports (Admin)',
    'Laporan (Pimpinan)': 'Reports (Leader)',

    // Sidebar dan menu
    'Sistem Konsumsi': 'Electricity Consumption',
    'Listrik': 'System',
    'Dashboard': 'Dashboard',
    'Data Ruangan': 'Room Data',
    'Data Tagihan': 'Billing Data',
    'Edit User': 'Edit Users',
    'Laporan': 'Reports',
    'Analisis': 'Analysis',
    'Keluar': 'Logout',
    'Edit Profil': 'Edit Profile',
    'Pengaturan': 'Settings',
    'Pimpinan': 'Leader',

    // Dashboard
    'Total Pemakaian': 'Total Usage',
    'Akumulasi dari seluruh ruangan': 'Accumulated from all rooms',
    'Total Rata-rata': 'Total Average',
    'Rata-rata pemakaian terhadap batas ruangan': 'Average usage against room limit',
    'Grafik Bulanan': 'Monthly Chart',
    'Pemakaian listrik per bulan (kWh)': 'Electricity usage per month (kWh)',
    'Mei': 'May',
    'Agu': 'Aug',
    'Okt': 'Oct',
    'Des': 'Dec',

    // Data Ruangan
    'Tambah Ruangan Baru': 'Add New Room',
    'Pencarian': 'Search',
    'Nama Ruangan': 'Room Name',
    'Jml AC': 'AC Count',
    'Jml Lampu': 'Lamp Count',
    'Aksi': 'Action',
    'Data tidak ditemukan': 'No data found',
    'Edit Ruangan': 'Edit Room',
    'Jumlah AC': 'Number of ACs',
    'Jumlah Lampu': 'Number of Lamps',
    'Nama ruangan wajib diisi': 'Room name is required',
    'Nama ruangan sudah ada': 'Room name already exists',
    'Jumlah AC wajib diisi': 'Number of ACs is required',
    'Jumlah AC harus berupa angka bulat, minimal 0': 'Number of ACs must be a whole number, minimum 0',
    'Jumlah lampu wajib diisi': 'Number of lamps is required',
    'Jumlah lampu harus berupa angka bulat, minimal 0': 'Number of lamps must be a whole number, minimum 0',
    'Ruangan berhasil ditambahkan.': 'Room added successfully.',
    'Data ruangan berhasil diperbarui.': 'Room data updated successfully.',
    'Ruangan berhasil dihapus.': 'Room deleted successfully.',
    'Data ruangan berhasil dihapus.': 'Room data deleted successfully.',
    'Edit': 'Edit',
    'Hapus': 'Delete',

    // Data Tagihan
    'Pilih Ruangan': 'Select Room',
    'Bulan': 'Month',
    'Pemakaian': 'Usage',
    'Semua Ruangan': 'All Rooms',
    'Semua Bulan': 'All Months',
    'Semua Pemakaian': 'All Usage',
    'Di bawah 500 kWh': 'Below 500 kWh',
    '1000 kWh ke atas': '1000 kWh and above',
    'SIMPAN DAN ANALISIS': 'SAVE AND ANALYZE',
    'Tanggal Bulan': 'Billing Month',
    'N. Ruangan': 'Room',
    'STATUS': 'STATUS',
    'AKSI': 'ACTION',
    'Boros': 'Wasteful',
    'Hemat': 'Efficient',
    'Tidak ada data tagihan yang cocok.': 'No matching billing data.',
    'Edit Data Tagihan': 'Edit Billing Data',
    'Pemakaian (kWh)': 'Usage (kWh)',
    'Pemakaian wajib diisi': 'Usage is required',
    'Pemakaian harus berupa angka bulat, minimal 0': 'Usage must be a whole number, minimum 0',
    'Data tagihan berhasil diperbarui.': 'Billing data updated successfully.',
    'Data tagihan berhasil dihapus.': 'Billing data deleted successfully.',
    'Tidak ada data yang cocok dengan filter.': 'No data matches the filter.',
    'Data sesuai filter berhasil ditampilkan.': 'Data matching the filter is displayed.',

    // Laporan
    'Tahun': 'Year',
    'Semua Status': 'All Statuses',
    'Tampilkan': 'Show',
    'Cetak PDF': 'Print PDF',

    // Tombol umum
    'Batal': 'Cancel',
    'Simpan': 'Save',
    'Tutup': 'Close',

    // Kotak konfirmasi keluar
    'Keluar dari akun?': 'Log out of your account?',
    'Anda akan keluar dari Sistem Konsumsi Listrik. Pastikan pekerjaan Anda sudah tersimpan.':
        'You are about to log out of the Electricity Consumption System. Make sure your work has been saved.',
    'Ya, Keluar': 'Yes, Log Out',
    'Berhasil keluar.': 'Logged out successfully.',

    // Halaman Pengaturan
    'Atur bahasa dan tampilan aplikasi': 'Set the language and appearance of the app',
    'Bahasa': 'Language',
    'Tema': 'Theme',
    'Pilih warna tampilan aplikasi': "Choose the app's color scheme",
    'Terang': 'Light',
    'Gelap': 'Dark',
    'Ukuran Huruf': 'Font Size',
    'Atur besar teks agar nyaman dibaca': 'Adjust text size for comfortable reading',
    'Kecil': 'Small',
    'Sedang': 'Medium',
    'Besar': 'Large',
    'Sidebar terbuka otomatis': 'Sidebar opens automatically',
    'Tampilkan menu samping secara penuh saat halaman dibuka': 'Show the side menu fully when the page opens',
    'Simpan Pengaturan': 'Save Settings',
    'Pengaturan berhasil disimpan': 'Settings saved successfully'
};

// Aturan untuk teks yang berubah-ubah (angka, bulan, nama)
const ATURAN_EN = [
    [/^contoh: (.+)$/, function (m) { return 'example: ' + m[1]; }],
    [/^(\d+) data ditemukan\.$/, function (m) { return m[1] + ' data found.'; }],
    [/^(\d+) data ditemukan\.$/, function (m) { return m[1] + ' data found.'; }],
    [/^Ringkasan pemakaian listrik seluruh ruangan, (.+)$/, function (m) {
        return 'Summary of electricity usage across all rooms, ' + bulanPenuhEn(m[1]);
    }],
    [/^(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)-(\d{4})$/, function (m) {
        return BULAN_SINGKAT_EN[m[1]] + '-' + m[2];
    }],
    [/^Hapus ruangan "(.*)"\?$/, function (m) { return 'Delete room "' + m[1] + '"?'; }],
    [/^Hapus data tagihan (.*) \((.*)\)\?$/, function (m) {
        return 'Delete billing data ' + m[1] + ' (' + bulanSingkatEn(m[2]) + ')?';
    }],
    [/^Apakah Anda yakin ingin keluar\?$/, function () { return 'Are you sure you want to log out?'; }]
];

const ATRIBUT_TERJEMAH = ['placeholder', 'title', 'aria-label'];

let bahasaAktif = 'id';
let sudahPernahTerjemah = false;
let pengamatBahasa = null;
let judulAsli = null;

const catatanTeks = new WeakMap();      // simpul teks -> { asli, hasil }
const catatanAtribut = new WeakMap();   // elemen -> { namaAtribut: { asli, hasil } }

function terjemahkanTeks(teks) {
    const rapat = teks.replace(/\s+/g, ' ').trim();
    if (!rapat) return teks;

    let hasil = Object.prototype.hasOwnProperty.call(KAMUS_EN, rapat) ? KAMUS_EN[rapat] : undefined;

    if (hasil === undefined) {
        for (let i = 0; i < ATURAN_EN.length; i++) {
            const cocok = rapat.match(ATURAN_EN[i][0]);
            if (cocok) {
                hasil = ATURAN_EN[i][1](cocok);
                break;
            }
        }
    }

    if (hasil === undefined) return teks;

    const awal = teks.match(/^\s*/)[0];
    const akhir = teks.match(/\s*$/)[0];
    return awal + hasil + akhir;
}

function ubahSimpulTeks(simpul) {
    const induk = simpul.parentNode;
    if (induk && (induk.nodeName === 'SCRIPT' || induk.nodeName === 'STYLE')) return;

    let catatan = catatanTeks.get(simpul);

    // Teks baru yang bukan hasil kerja kita: jadikan teks asli
    if (!catatan || (simpul.nodeValue !== catatan.hasil && simpul.nodeValue !== catatan.asli)) {
        catatan = { asli: simpul.nodeValue, hasil: simpul.nodeValue };
        catatanTeks.set(simpul, catatan);
    }

    if (bahasaAktif === 'en') {
        catatan.hasil = terjemahkanTeks(catatan.asli);
        simpul.nodeValue = catatan.hasil;
    } else {
        simpul.nodeValue = catatan.asli;
    }
}

function ubahAtribut(elemen) {
    ATRIBUT_TERJEMAH.forEach(function (nama) {
        if (!elemen.hasAttribute(nama)) return;

        let peta = catatanAtribut.get(elemen);
        if (!peta) {
            peta = {};
            catatanAtribut.set(elemen, peta);
        }

        const sekarang = elemen.getAttribute(nama);
        let catatan = peta[nama];

        if (!catatan || (sekarang !== catatan.hasil && sekarang !== catatan.asli)) {
            catatan = { asli: sekarang, hasil: sekarang };
            peta[nama] = catatan;
        }

        if (bahasaAktif === 'en') {
            catatan.hasil = terjemahkanTeks(catatan.asli);
            elemen.setAttribute(nama, catatan.hasil);
        } else {
            elemen.setAttribute(nama, catatan.asli);
        }
    });
}

function terjemahkanSimpul(akar) {
    if (akar.nodeType === 3) {
        ubahSimpulTeks(akar);
        return;
    }
    if (akar.nodeType !== 1) return;

    ubahAtribut(akar);

    const jalan = document.createTreeWalker(akar, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let simpul;

    while ((simpul = jalan.nextNode())) {
        if (simpul.nodeType === 3) {
            ubahSimpulTeks(simpul);
        } else {
            ubahAtribut(simpul);
        }
    }
}

function terjemahkanJudul() {
    if (judulAsli === null) judulAsli = document.title;

    document.title = bahasaAktif === 'en'
        ? judulAsli.split(' - ').map(terjemahkanTeks).join(' - ')
        : judulAsli;
}

// Dipanggil saat halaman dibuka dan setiap pengaturan bahasa disimpan
function terapkanBahasa() {
    bahasaAktif = bacaPengaturan().bahasa === 'en' ? 'en' : 'id';

    document.documentElement.lang = bahasaAktif;

    if (bahasaAktif === 'en') {
        sudahPernahTerjemah = true;
    } else if (!sudahPernahTerjemah) {
        return;
    }

    terjemahkanSimpul(document.body);
    terjemahkanJudul();

    // Terjemahkan juga teks yang muncul belakangan (tabel, pesan, kotak dialog)
    if (!pengamatBahasa) {
        pengamatBahasa = new MutationObserver(function (daftar) {
            if (bahasaAktif !== 'en') return;

            daftar.forEach(function (mutasi) {
                mutasi.addedNodes.forEach(terjemahkanSimpul);
            });
        });
        pengamatBahasa.observe(document.body, { childList: true, subtree: true });
    }
}

// Kotak konfirmasi bawaan browser (confirm) juga ikut diterjemahkan
const confirmAsli = window.confirm.bind(window);
window.confirm = function (pesan) {
    return confirmAsli(bahasaAktif === 'en' ? terjemahkanTeks(String(pesan)) : pesan);
};

// =====================================================
// PEMBERITAHUAN (pengganti alert bawaan browser)
// Semua alert("...") di halaman mana pun otomatis memakai kotak ini.
// =====================================================
const antrianPemberitahuan = [];
let pemberitahuanTampil = false;

function pasangGayaPemberitahuan() {
    if (document.getElementById('pbGaya')) return;

    const gaya = document.createElement('style');
    gaya.id = 'pbGaya';
    gaya.textContent = `
        .pb-latar {
            position: fixed;
            inset: 0;
            z-index: 5000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(15, 23, 42, .55);
            backdrop-filter: blur(3px);
            opacity: 0;
            transition: opacity .18s ease;
        }
        .pb-latar.tampil { opacity: 1; }

        .pb-kotak {
            width: 100%;
            max-width: 380px;
            padding: 28px 26px 22px;
            border-radius: 18px;
            background: #fff;
            text-align: center;
            font-family: Inter, Arial, sans-serif;
            box-shadow: 0 24px 60px rgba(15, 23, 42, .3);
            transform: translateY(14px) scale(.96);
            transition: transform .25s cubic-bezier(.2, .9, .3, 1.2);
        }
        .pb-latar.tampil .pb-kotak { transform: translateY(0) scale(1); }

        .pb-ikon {
            width: 64px;
            height: 64px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #fef3c7;
            color: #d97706;
        }
        .pb-ikon.berhasil {
            background: #dcfce7;
            color: #16a34a;
        }
        .pb-ikon svg {
            width: 30px;
            height: 30px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .pb-kotak h3 {
            margin: 0 0 8px;
            color: #0f172a;
            font-size: 19px;
            font-weight: 800;
        }
        .pb-teks {
            margin: 0 0 22px;
            color: #64748b;
            font-size: 14px;
            line-height: 1.55;
            white-space: pre-line;
            word-break: break-word;
        }

        .pb-ok {
            width: 100%;
            height: 42px;
            border: none;
            border-radius: 10px;
            background: #2563eb;
            color: #fff;
            font-family: inherit;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
        }
        .pb-ok:hover { background: #1d4ed8; }
        .pb-ok:focus-visible { outline: 3px solid rgba(37, 99, 235, .35); outline-offset: 2px; }

        /* Tema gelap */
        body.dark-theme .pb-kotak {
            background: #13243b;
            border: 1px solid #2a3b52;
            box-shadow: 0 24px 60px rgba(0, 0, 0, .55);
        }
        body.dark-theme .pb-kotak h3 { color: #e5edf7; }
        body.dark-theme .pb-teks { color: #94a3b8; }
        body.dark-theme .pb-ikon { background: rgba(217, 119, 6, .18); color: #fbbf24; }
        body.dark-theme .pb-ikon.berhasil { background: rgba(22, 163, 74, .2); color: #4ade80; }
    `;
    document.head.appendChild(gaya);
}

function bukaPemberitahuanBerikutnya() {
    if (antrianPemberitahuan.length === 0) {
        pemberitahuanTampil = false;
        return;
    }

    pemberitahuanTampil = true;

    const pesan = antrianPemberitahuan.shift();
    const berhasil = /berhasil|sukses|success/i.test(pesan);

    pasangGayaPemberitahuan();

    const ikon = berhasil
        ? '<circle cx="12" cy="12" r="10"/><path d="M8 12.5l3 3 5-6"/>'
        : '<circle cx="12" cy="12" r="10"/><path d="M12 7v6"/><path d="M12 16.5v.5"/>';

    const latar = document.createElement('div');
    latar.className = 'pb-latar';
    latar.innerHTML =
        '<div class="pb-kotak" role="alertdialog" aria-modal="true" ' +
             'aria-labelledby="pbJudul" aria-describedby="pbTeks">' +
            '<div class="pb-ikon' + (berhasil ? ' berhasil' : '') + '">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true">' + ikon + '</svg>' +
            '</div>' +
            '<h3 id="pbJudul">' + (berhasil ? 'Berhasil' : 'Pemberitahuan') + '</h3>' +
            '<p class="pb-teks" id="pbTeks"></p>' +
            '<button type="button" class="pb-ok">OK</button>' +
        '</div>';
    latar.querySelector('.pb-teks').textContent = pesan;

    const tombolOk = latar.querySelector('.pb-ok');
    let sudahTutup = false;

    function tutup() {
        if (sudahTutup) return;
        sudahTutup = true;

        document.removeEventListener('keydown', tekanTombol, true);
        latar.classList.remove('tampil');

        setTimeout(function () {
            latar.remove();
            bukaPemberitahuanBerikutnya();
        }, 180);
    }

    function tekanTombol(e) {
        if (e.key === 'Escape' || e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            tutup();
        } else if (e.key === 'Tab') {
            // Fokus tetap di tombol OK selama kotak terbuka
            e.preventDefault();
            tombolOk.focus();
        }
    }

    tombolOk.addEventListener('click', tutup);
    latar.addEventListener('click', function (e) {
        if (e.target === latar) tutup();
    });
    document.addEventListener('keydown', tekanTombol, true);

    document.body.appendChild(latar);

    // Fokus diberikan setelah kode halaman selesai (supaya tidak direbut kolom isian)
    requestAnimationFrame(function () {
        latar.classList.add('tampil');
        tombolOk.focus();
    });
}

function tampilkanPemberitahuan(pesan) {
    antrianPemberitahuan.push(String(pesan));
    if (!pemberitahuanTampil) bukaPemberitahuanBerikutnya();
}

window.alert = function (pesan) {
    if (!document.body) return;
    tampilkanPemberitahuan(pesan === undefined ? '' : pesan);
};

function jalankanTemaDanBahasa() {
    terapkanTema();
    terapkanBahasa();

    // Perubahan dari tab lain langsung ikut berlaku
    window.addEventListener('storage', function (e) {
        if (e.key && e.key.indexOf('pengaturan') === 0) {
            terapkanTema();
            terapkanBahasa();
        }
    });
}

// =====================================================
// SESI PENGGUNA
// =====================================================
function ambilPengguna() {
    try {
        return JSON.parse(sessionStorage.getItem('pengguna'));
    } catch (error) {
        return null;
    }
}

function peranHalamanIni() {
    return DAFTAR_PERAN.find(function (peran) {
        return window.location.pathname.includes('/pages/' + peran + '/');
    });
}

// Belum login atau salah peran -> kembali ke login
function lindungiHalaman() {
    const pengguna = ambilPengguna();

    if (!pengguna || pengguna.peran !== peranHalamanIni()) {
        window.location.replace(HALAMAN_LOGIN);
        return false;
    }
    return true;
}

// ===== Nama pengguna di pojok kanan atas =====
function tampilkanNamaPengguna() {
    const label = document.getElementById('namaPengguna');
    const pengguna = ambilPengguna();
    if (!label || !pengguna) return;

    label.textContent = pengguna.peran.charAt(0).toUpperCase() + pengguna.peran.slice(1);
}

function aktifkanDropdownProfil() {
    const tombol = document.getElementById('profileBtn');
    const menu = document.getElementById('profileMenu');
    if (!tombol || !menu) return;

    function setTerbuka(terbuka) {
        menu.hidden = !terbuka;
        tombol.setAttribute('aria-expanded', terbuka ? 'true' : 'false');
    }

    // Ganti huruf "v" polos dengan ikon panah
    tombol.querySelectorAll('*').forEach(function (el) {
        if (el.children.length === 0 && el.textContent.trim().toLowerCase() === 'v') {
            el.innerHTML =
                '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" ' +
                'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
                'stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
        }
    });

    // Fase capture: berjalan lebih dulu dan mengalahkan handler ganda milik halaman
    document.addEventListener('click', function (e) {
        if (tombol.contains(e.target)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            setTerbuka(menu.hidden);
            return;
        }

        if (!menu.contains(e.target)) {
            setTerbuka(false);
        }
    }, true);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setTerbuka(false);
    });
}

// ===== Sidebar =====
function aktifkanSidebar() {
    const tombol = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    if (!tombol || !sidebar) return;

    tombol.addEventListener('click', function () {
        const tertutup = sidebar.classList.toggle('collapsed');
        tombol.setAttribute('aria-expanded', tertutup ? 'false' : 'true');
    });
}

// ===== Kotak konfirmasi keluar =====
function tampilkanKonfirmasiKeluar(saatYa) {
    if (document.getElementById('kkLatar')) return;

    if (!document.getElementById('kkGaya')) {
        const gaya = document.createElement('style');
        gaya.id = 'kkGaya';
        gaya.textContent = `
            .kk-latar {
                position: fixed;
                inset: 0;
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                background: rgba(15, 23, 42, .55);
                backdrop-filter: blur(3px);
                opacity: 0;
                transition: opacity .2s ease;
            }
            .kk-latar.tampil { opacity: 1; }

            .kk-kotak {
                width: 100%;
                max-width: 380px;
                padding: 28px 26px 22px;
                border-radius: 18px;
                background: #fff;
                text-align: center;
                font-family: Inter, Arial, sans-serif;
                box-shadow: 0 24px 60px rgba(15, 23, 42, .3);
                transform: translateY(14px) scale(.96);
                transition: transform .25s cubic-bezier(.2, .9, .3, 1.2);
            }
            .kk-latar.tampil .kk-kotak { transform: translateY(0) scale(1); }

            .kk-ikon {
                width: 64px;
                height: 64px;
                margin: 0 auto 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: #fee2e2;
                color: #dc2626;
            }
            .kk-ikon svg {
                width: 30px;
                height: 30px;
                fill: none;
                stroke: currentColor;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
            }

            .kk-kotak h3 {
                margin: 0 0 8px;
                color: #0f172a;
                font-size: 19px;
                font-weight: 800;
            }
            .kk-kotak p {
                margin: 0 0 22px;
                color: #64748b;
                font-size: 13.5px;
                line-height: 1.55;
            }

            .kk-aksi {
                display: flex;
                gap: 10px;
            }
            .kk-aksi button {
                flex: 1;
                height: 42px;
                border-radius: 10px;
                font-family: inherit;
                font-size: 13.5px;
                font-weight: 700;
                cursor: pointer;
            }
            .kk-batal {
                border: 1px solid #cbd5e1;
                background: #fff;
                color: #334155;
            }
            .kk-batal:hover { background: #f1f5f9; }
            .kk-ya {
                border: none;
                background: #dc2626;
                color: #fff;
            }
            .kk-ya:hover { background: #b91c1c; }
        `;
        document.head.appendChild(gaya);
    }

    const latar = document.createElement('div');
    latar.id = 'kkLatar';
    latar.className = 'kk-latar';
    latar.innerHTML = `
        <div class="kk-kotak" role="alertdialog" aria-modal="true"
             aria-labelledby="kkJudul" aria-describedby="kkTeks">
            <div class="kk-ikon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <path d="m16 17 5-5-5-5M21 12H9"/>
                </svg>
            </div>
            <h3 id="kkJudul">Keluar dari akun?</h3>
            <p id="kkTeks">Anda akan keluar dari Sistem Konsumsi Listrik. Pastikan pekerjaan Anda sudah tersimpan.</p>
            <div class="kk-aksi">
                <button type="button" class="kk-batal">Batal</button>
                <button type="button" class="kk-ya">Ya, Keluar</button>
            </div>
        </div>
    `;
    document.body.appendChild(latar);

    requestAnimationFrame(function () {
        latar.classList.add('tampil');
    });

    function tekanTombol(e) {
        if (e.key === 'Escape') tutup();
    }

    function tutup() {
        document.removeEventListener('keydown', tekanTombol);
        latar.classList.remove('tampil');
        setTimeout(function () { latar.remove(); }, 200);
    }

    latar.querySelector('.kk-batal').addEventListener('click', tutup);

    latar.querySelector('.kk-ya').addEventListener('click', function () {
        this.disabled = true;
        saatYa();
    });

    // Klik area gelap di luar kotak -> tutup
    latar.addEventListener('click', function (e) {
        if (e.target === latar) tutup();
    });

    document.addEventListener('keydown', tekanTombol);
    latar.querySelector('.kk-batal').focus();
}

// ===== Logout =====
function aktifkanLogout() {
    const tombolKeluar = document.querySelector('.logout, #logout');
    if (!tombolKeluar) return;

    tombolKeluar.addEventListener('click', function (e) {
        e.preventDefault();

        tampilkanKonfirmasiKeluar(function () {
            sessionStorage.removeItem('pengguna');
            sessionStorage.setItem('pesanFlash', 'Berhasil keluar.');
            window.location.href = HALAMAN_LOGOUT;
        });
    });
}

// =====================================================
// TERJEMAHAN TAMBAHAN: HALAMAN EDIT PROFIL
// =====================================================
Object.assign(KAMUS_EN, {
    'Ulangi kata sandi baru': 'Repeat new password',
    'Simpan Kata Sandi': 'Save Password',
    'Konfirmasi Kata Sandi Baru': 'Confirm New Password',
    'Minimal 8 karakter': 'Minimum 8 characters',
    'Gunakan kombinasi huruf besar, kecil, angka, dan simbol': 'Use a combination of uppercase, lowercase, numbers, and symbols',
    'Simpan Foto': 'Save Photo',
    'Simpan Perubahan': 'Save Changes',
    'Perbarui data akun dan kata sandi Anda': 'Update your account data and password',
    'Email': 'Email',
    'Jabatan': 'Position',
    'Administrator': 'Administrator',
    'Hapus data?': 'Delete data?',
    'Di bawah 500': 'Below 500',
    '1.000 ke atas': '1,000 and above',
    '1000 ke atas': '1,000 and above',
    'Di bawah 500 kWh': 'Below 500 kWh',
    '500–999 kWh': '500–999 kWh',
    'Sistem Konsumsi': 'Electricity Usage',
    'Ganti foto profil, username, dan kata sandi akun Anda': 'Change your profile photo, username, and account password',
    'Halaman pengaturan belum tersedia.': 'The settings page is not available yet.',
    'Foto diganti, tetapi gagal disimpan di browser.': 'Photo changed, but it could not be saved in the browser.',
    'Ya, Hapus': 'Yes, Delete',
    'Tindakan ini tidak dapat dibatalkan.': 'This action cannot be undone.',
    'Hapus data tagihan?': 'Delete billing data?',
    'Ganti Username': 'Change Username',
    'Username Saat Ini': 'Current Username',
    'Username Baru': 'New Username',
    '4–20 karakter': '4–20 characters',
    'Huruf, angka, titik, dan garis bawah (_)': 'Letters, numbers, dots, and underscores (_)',
    'Kata Sandi (untuk konfirmasi)': 'Password (for confirmation)',
    'Masukkan kata sandi Anda': 'Enter your password',
    'Simpan Username': 'Save Username',
    'Ganti Kata Sandi': 'Change Password',
    'Kata Sandi Lama': 'Old Password',
    'Masukkan kata sandi lama': 'Enter your old password',
    'Kata Sandi Baru': 'New Password',
    'Konfirmasi Kata Sandi': 'Confirm Password',
    'Kata Sandi': 'Password',
    'Ganti Foto': 'Change Photo',
    'Format JPG atau PNG, maksimal 2 MB': 'JPG or PNG format, maximum 2 MB'
});

// ===== Terjemahan pesan di halaman Edit Profil (kolom merah, notifikasi, pop-up) =====
Object.assign(KAMUS_EN, {
    // Ganti username
    'Username baru wajib diisi.': 'New username is required.',
    'Username harus 4–20 karakter: huruf, angka, titik, atau garis bawah.':
        'Username must be 4–20 characters: letters, numbers, dots, or underscores.',
    'Username baru tidak boleh sama dengan username saat ini.':
        'New username must be different from the current username.',
    'Kata sandi wajib diisi.': 'Password is required.',
    'Username 4–20 karakter: huruf, angka, titik, atau garis bawah.':
        'Username 4–20 characters: letters, numbers, dots, or underscores.',
    'Username dapat digunakan.': 'Username is available.',
    'Username berhasil diganti.': 'Username changed successfully.',

    // Ganti kata sandi
    'Kata sandi lama wajib diisi.': 'Old password is required.',
    'Kata sandi baru wajib diisi.': 'New password is required.',
    'Kata sandi baru minimal 8 karakter.': 'New password must be at least 8 characters.',
    'Kata sandi baru tidak boleh sama dengan kata sandi lama.':
        'New password must be different from the old password.',
    'Konfirmasi kata sandi wajib diisi.': 'Password confirmation is required.',
    'Konfirmasi kata sandi tidak sesuai.': 'Password confirmation does not match.',
    'Kata sandi tidak sama.': 'Passwords do not match.',
    'Kata sandi cocok.': 'Passwords match.',
    'Kata sandi berhasil diganti.': 'Password changed successfully.',

    // Foto profil
    'Silakan pilih gambar JPG atau PNG.': 'Please choose a JPG or PNG image.',
    'Ukuran foto maksimal 2 MB.': 'Maximum photo size is 2 MB.',
    'Foto profil berhasil diganti.': 'Profile photo changed successfully.',
    'Foto diganti, tetapi gagal disimpan di browser.': 'Photo changed, but failed to save in the browser.',
    'Foto profil berhasil dihapus.': 'Profile photo deleted successfully.',
    'Hapus foto profil?': 'Delete profile photo?',
    'Foto profil akan dikembalikan ke gambar bawaan.': 'The profile photo will be reset to the default image.',

    // Pop-up keluar
    'Anda harus masuk kembali untuk mengakses sistem.': 'You will need to log in again to access the system.'
});

// Kekuatan kata sandi: "Kekuatan: Kuat" -> "Strength: Strong"
ATURAN_EN.push([/^Kekuatan: (.+)$/, function (m) {
    var tingkat = {
        'Sangat lemah': 'Very weak',
        'Lemah': 'Weak',
        'Cukup': 'Fair',
        'Kuat': 'Strong',
        'Sangat kuat': 'Very strong'
    };
    return 'Strength: ' + (tingkat[m[1]] || m[1]);
}]);

// Tombol keluar dengan kotak konfirmasi sendiri.
// Menimpa kode keluar milik halaman itu supaya tidak muncul konfirmasi bawaan browser.
function aktifkanLogoutPaksa() {
    document.addEventListener('click', function (e) {
        const pemicu = e.target.closest(
            '.logout, #logout, [data-logout], #btnKeluar, #tombolKeluar, .btn-keluar, a, button'
        );
        if (!pemicu) return;

        const cocokSelektor = pemicu.matches(
            '.logout, #logout, [data-logout], #btnKeluar, #tombolKeluar, .btn-keluar'
        );
        const teks = pemicu.textContent.trim().toLowerCase();
        const cocokTeks = teks === 'keluar' || teks === 'logout';

        if (!cocokSelektor && !cocokTeks) return;
        if (pemicu.closest('#kkLatar')) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        tampilkanKonfirmasiKeluar(function () {
            sessionStorage.removeItem('pengguna');
            sessionStorage.setItem('pesanFlash', 'Berhasil keluar.');
            window.location.href = HALAMAN_LOGOUT;
        });
    }, true);
}

// =====================================================
// TERJEMAHAN TAMBAHAN: POP-UP HAPUS
// =====================================================
Object.assign(KAMUS_EN, {
    'Hapus data tagihan?': 'Delete billing data?',
    'Hapus ruangan?': 'Delete room?',
    'Ya, Hapus': 'Yes, Delete'
});

ATURAN_EN.push(
    [/^Data tagihan (.*) \((.*)\) akan dihapus\. Tindakan ini tidak dapat dibatalkan\.$/, function (m) {
        return 'Billing data ' + m[1] + ' (' + bulanSingkatEn(m[2]) + ') will be deleted. This action cannot be undone.';
    }],
    [/^Ruangan "(.*)" akan dihapus dari daftar\. Tindakan ini tidak dapat dibatalkan\.$/, function (m) {
        return 'Room "' + m[1] + '" will be removed from the list. This action cannot be undone.';
    }]
);

// =====================================================
// TERJEMAHAN TAMBAHAN: DASHBOARD OPERATOR
// =====================================================
Object.assign(KAMUS_EN, {
    // Judul dan subjudul
    'Input pemakaian listrik per ruangan dan pantau riwayatnya': 'Input electricity usage per room and track its history',
    'Input Pemakaian Listrik': 'Electricity Usage Input',
    'Riwayat Input Pemakaian': 'Usage Input History',

    // Form
    'Ruangan': 'Room',
    'Pilih ruangan': 'Select room',
    'Pilih bulan': 'Select month',
    'Masukkan angka': 'Enter a number',

    // Tabel
    'Tanggal': 'Date',
    'Belum ada riwayat input': 'No input history yet',

    // Pesan validasi dan notifikasi
    'Harap lengkapi semua kolom.': 'Please fill in all fields.',
    'Pemakaian tidak boleh kurang dari 0.': 'Usage cannot be less than 0.',
    'Data pemakaian listrik berhasil disimpan!': 'Electricity usage data saved successfully!',

    // Aksesibilitas
    'Sidebar Navigasi': 'Navigation Sidebar',
    'Buka atau tutup sidebar': 'Open or close sidebar'
});

// "Oktober 2026" -> "October 2026"
ATURAN_EN.push(
    [/^(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember) (\d{4})$/, function (m) {
        return BULAN_PENUH_EN[m[1]] + ' ' + m[2];
    }]
);

// =====================================================
// TERJEMAHAN TAMBAHAN: KOTAK PEMBERITAHUAN
// =====================================================
Object.assign(KAMUS_EN, {
    'Pemberitahuan': 'Notice',
    'Berhasil': 'Success'
});

// =====================================================
// TERJEMAHAN TAMBAHAN: NAMA RUANGAN
// =====================================================
Object.assign(KAMUS_EN, {
    'R. Perpustakaan': 'Library Room',
    'R. Perpustakan': 'Library Room',     // ejaan seperti di data saat ini
    'Ruang Perpustakaan': 'Library Room'
});

// =====================================================
// TERJEMAHAN TAMBAHAN: PESAN LOGIN
// =====================================================
Object.assign(KAMUS_EN, {
    'Berhasil login': 'Logged in successfully'
});

// =====================================================
// JALANKAN
// =====================================================
// Halaman Pengaturan, Data Ruangan operator, dan Edit Profil punya kode
// sidebar/dropdown sendiri, jadi di sana hanya tema, bahasa, dan keluar yang diurus.
const alamatHalaman = window.location.pathname;
const halamanPengaturan = /\/pengaturan\.php$/.test(alamatHalaman);
const ruanganOperator = /\/pages\/operator\/data-ruangan\.php$/.test(alamatHalaman);
const halamanEditProfil = /\/edit-profil\.php$/.test(alamatHalaman);

if (halamanPengaturan) {
    aktifkanLogoutPaksa();
    jalankanTemaDanBahasa();
} else if (ruanganOperator) {
    aktifkanLogout();
    jalankanTemaDanBahasa();
} else if (halamanEditProfil) {
    aktifkanLogoutPaksa();
    jalankanTemaDanBahasa();
} else if (lindungiHalaman()) {
    tampilkanNamaPengguna();
    aktifkanDropdownProfil();
    aktifkanSidebar();
    aktifkanLogoutPaksa();
    jalankanTemaDanBahasa();
}

// ===== Tampilkan isi halaman setelah semua skrip selesai menyusun tampilan =====
function tandaiHalamanSiap() {
    document.body.classList.add('siap');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tandaiHalamanSiap);
} else {
    tandaiHalamanSiap();
}

// ===== POPUP BERHASIL (centang hijau) =====
function tampilkanPopupBerhasil(teks) {
    if (document.getElementById('pbLatar')) {
        document.getElementById('pbLatar').remove();
    }

    if (!document.getElementById('pbGaya')) {
        const gaya = document.createElement('style');
        gaya.id = 'pbGaya';
        gaya.textContent = `
            .pb-latar {
                position: fixed;
                inset: 0;
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                background: rgba(15, 23, 42, .55);
                backdrop-filter: blur(3px);
                opacity: 0;
                transition: opacity .2s ease;
            }
            .pb-latar.tampil { opacity: 1; }

            .pb-kotak {
                width: 100%;
                max-width: 380px;
                padding: 32px 26px 26px;
                border-radius: 18px;
                background: #fff;
                text-align: center;
                font-family: Inter, Arial, sans-serif;
                box-shadow: 0 24px 60px rgba(15, 23, 42, .3);
                transform: translateY(14px) scale(.96);
                transition: transform .25s cubic-bezier(.2, .9, .3, 1.2);
            }
            .pb-latar.tampil .pb-kotak { transform: translateY(0) scale(1); }

            .pb-ikon {
                width: 72px;
                height: 72px;
                margin: 0 auto 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: #dcfce7;
                color: #16a34a;
            }
            .pb-ikon svg {
                width: 36px;
                height: 36px;
                fill: none;
                stroke: currentColor;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-dasharray: 30;
                stroke-dashoffset: 30;
                transition: stroke-dashoffset .4s ease .15s;
            }
            .pb-latar.tampil .pb-ikon svg { stroke-dashoffset: 0; }

            .pb-kotak h3 {
                margin: 0 0 8px;
                color: #0f172a;
                font-size: 20px;
                font-weight: 800;
            }
            .pb-kotak p {
                margin: 0 0 24px;
                color: #64748b;
                font-size: 13.5px;
                line-height: 1.55;
            }

            .pb-ok {
                width: 100%;
                height: 44px;
                border: none;
                border-radius: 10px;
                background: #2563eb;
                color: #fff;
                font-family: inherit;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
            }
            .pb-ok:hover { background: #1d4ed8; }
        `;
        document.head.appendChild(gaya);
    }

    const latar = document.createElement('div');
    latar.id = 'pbLatar';
    latar.className = 'pb-latar';
    latar.innerHTML = `
        <div class="pb-kotak" role="alertdialog" aria-modal="true"
             aria-labelledby="pbJudul" aria-describedby="pbTeks">
            <div class="pb-ikon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5"/>
                </svg>
            </div>
            <h3 id="pbJudul">Berhasil</h3>
            <p id="pbTeks"></p>
            <button type="button" class="pb-ok">OK</button>
        </div>
    `;
    latar.querySelector('#pbTeks').textContent = teks;
    document.body.appendChild(latar);

    requestAnimationFrame(function () {
        latar.classList.add('tampil');
    });

    function tekanTombol(e) {
        if (e.key === 'Escape') tutup();
    }

    function tutup() {
        document.removeEventListener('keydown', tekanTombol);
        latar.classList.remove('tampil');
        setTimeout(function () { latar.remove(); }, 200);
    }

    latar.querySelector('.pb-ok').addEventListener('click', tutup);

    latar.addEventListener('click', function (e) {
        if (e.target === latar) tutup();
    });

    document.addEventListener('keydown', tekanTombol);
    latar.querySelector('.pb-ok').focus();
}

// =====================================================
// PESAN HIJAU DI ATAS (tanpa kotak, tanpa tombol OK)
// =====================================================
let timerPesanSimpan = null;

function pasangGayaPesanSimpan() {
    if (document.getElementById('psGaya')) return;

    const gaya = document.createElement('style');
    gaya.id = 'psGaya';
    gaya.textContent = `
        .pesan-simpan {
            position: fixed;
            top: 22px;
            left: 50%;
            z-index: 4000;
            display: flex;
            align-items: center;
            gap: 9px;
            color: #16a34a;
            font: 800 15px/1.4 Inter, Arial, sans-serif;
            text-shadow: 0 1px 0 #fff, 0 0 12px #fff, 0 0 12px #fff;
            opacity: 0;
            transform: translateX(-50%) translateY(-18px);
            transition: opacity .3s ease, transform .45s cubic-bezier(.2, 1.3, .4, 1);
            pointer-events: none;
        }
        .pesan-simpan.tampil {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        .pesan-simpan svg {
            width: 22px;
            height: 22px;
            fill: none;
            stroke: currentColor;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 30;
            stroke-dashoffset: 30;
        }
        .pesan-simpan.tampil svg {
            stroke-dashoffset: 0;
            transition: stroke-dashoffset .45s ease .15s;
        }
        body.dark-theme .pesan-simpan {
            text-shadow: 0 1px 0 #0b1726, 0 0 12px #0b1726, 0 0 12px #0b1726;
        }
    `;
    document.head.appendChild(gaya);
}

function tampilkanPesanSimpan(teks) {
    pasangGayaPesanSimpan();

    let pesan = document.getElementById('pesanSimpan');

    if (!pesan) {
        pesan = document.createElement('div');
        pesan.id = 'pesanSimpan';
        pesan.className = 'pesan-simpan';
        pesan.setAttribute('role', 'status');
        document.body.appendChild(pesan);
    }

    pesan.classList.remove('tampil');
    void pesan.offsetWidth;

    pesan.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' +
        '<span></span>';
    pesan.querySelector('span').textContent = teks;

    requestAnimationFrame(function () {
        pesan.classList.add('tampil');
    });

    clearTimeout(timerPesanSimpan);
    timerPesanSimpan = setTimeout(function () {
        pesan.classList.remove('tampil');
    }, 2200);
}

// =====================================================
// BANNER BERHASIL LOGIN (muncul di dashboard setelah masuk)
// Tampilannya sama dengan banner hijau yang dulu di halaman login.
// =====================================================
let timerBannerLogin = null;

function pasangGayaBannerLogin() {
    if (document.getElementById('blGaya')) return;

    const gaya = document.createElement('style');
    gaya.id = 'blGaya';
    gaya.textContent = `
        .banner-sukses {
            position: fixed;
            top: 16px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            z-index: 4000;
            max-width: calc(100% - 32px);
            padding: 12px 22px;
            border-radius: 10px;
            background: #dcfce7;
            border: 1px solid #86efac;
            color: #166534;
            font: 600 14px/1.4 Inter, Arial, sans-serif;
            box-shadow: 0 8px 22px rgba(15, 42, 67, .15);
            opacity: 0;
            transition: opacity .2s ease, transform .2s ease;
            pointer-events: none;
        }
        .banner-sukses.tampil {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;
    document.head.appendChild(gaya);
}

function tampilkanBannerLogin(teks, lamaMs) {
    pasangGayaBannerLogin();

    let banner = document.getElementById('bannerSukses');

    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'bannerSukses';
        banner.className = 'banner-sukses';
        banner.setAttribute('role', 'status');
        document.body.appendChild(banner);
    }

    banner.textContent = teks;

    requestAnimationFrame(function () {
        banner.classList.add('tampil');
    });

    clearTimeout(timerBannerLogin);
    timerBannerLogin = setTimeout(function () {
        banner.classList.remove('tampil');
    }, lamaMs);
}

function tampilkanPesanLogin() {
    const pesan = sessionStorage.getItem('pesanLogin');
    if (!pesan) return;

    sessionStorage.removeItem('pesanLogin');   // hanya tampil sekali

    const teks = bahasaAktif === 'en' ? terjemahkanTeks(pesan) : pesan;

    // Jeda singkat supaya dashboard selesai tampil dulu
    setTimeout(function () {
        tampilkanBannerLogin(teks, 2000);
    }, 300);
}

tampilkanPesanLogin();

// =====================================================
// HALAMAN PENGATURAN: kartu memenuhi lebar halaman (semua peran)
// =====================================================
if (/\/pengaturan\.php$/.test(window.location.pathname)) {
    const gayaPengaturan = document.createElement('style');
    gayaPengaturan.textContent = `
        #settingsForm,
        .settings-card,
        .settings-form,
        .form-card,
        .card {
            width: 100% !important;
            max-width: none !important;
        }
    `;
    document.head.appendChild(gayaPengaturan);
}