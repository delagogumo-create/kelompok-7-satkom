(function () {
    // ===== Konstanta =====
    const BARIS_PER_HALAMAN = 3;
    const BATAS_HEMAT = 500;
    const BATAS_BOROS = 1000;
    const TAHUN_FILTER = 2026;
    const URUTAN_BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    // ===== Terjemahan nama ruangan =====
    const TERJEMAHAN_RUANG = {
        'kelas':        'Classroom',
        'komputer':     'Computer Room',
        'dosen':        'Lecturer Room',
        'guru':         'Teacher Room',
        'tu':           'Administration Office',
        'rapat':        'Meeting Room',
        'lab':          'Lab Room',
        'seminar':      'Seminar Room',
        'perpustakaan': 'Library',
        'perpus':       'Library',
        'musholla':     'Prayer Room',
        'umum':         'General Room',
        'kantor':       'Office',
        'gudang':       'Storage Room',
        'jt1':          'JT1 Room'
    };

    const TERJEMAHAN_LAB = {
        'komputer':   'Computer',
        'bahasa':     'Language',
        'fisika':     'Physics',
        'kimia':      'Chemistry',
        'biologi':    'Biology',
        'jaringan':   'Network',
        'multimedia': 'Multimedia'
    };

    const TEKS_LOKAL = {
        kosongTabel:  ['Tidak ada data yang cocok.', 'No matching data.'],
        kosongFilter: ['Tidak ada data yang cocok dengan filter.', 'No data matches the filter.']
    };

    // ===== Data dari Database PHP =====
    const dataTagihan = Array.isArray(window.DATA_TAGIHAN_DB) ? window.DATA_TAGIHAN_DB : [];

    // ===== Elemen =====
    const badanTabel = document.getElementById('billRows');
    const formFilter = document.getElementById('filterForm');
    const filterRuangan = document.getElementById('roomFilter');
    const filterBulan = document.getElementById('monthFilter');
    const filterPemakaian = document.getElementById('usageFilter');
    const tombolBack = document.getElementById('backBtn');
    const tombolNext = document.getElementById('nextBtn');
    const infoHalaman = document.getElementById('pageCount');
    const toast = document.getElementById('toast');

    // ===== State =====
    let hasilFilter = dataTagihan.slice();
    let halamanSekarang = 1;
    let timerToast = null;

    // ===== Pengecekan Bahasa Pasti dari localStorage =====
    function bahasaAktif() {
        try {
            const data = JSON.parse(localStorage.getItem('pengaturanAdmin')) || {};
            const b = String(data.bahasa || '').toLowerCase();
            if (b === 'en' || b.indexOf('eng') === 0 || b.indexOf('ing') === 0) {
                return 'en';
            }
        } catch (e) {}

        try {
            const bagian = document.querySelectorAll('th, #sidebar, label');
            let teks = '';
            for (let i = 0; i < bagian.length; i++) {
                teks += ' ' + bagian[i].textContent;
            }
            if (/Billing Month|Billing Data|Room Data|Select Room/i.test(teks)) return 'en';
        } catch (e) {}

        return 'id';
    }

    function teksLokal(kunci) {
        return TEKS_LOKAL[kunci][bahasaAktif() === 'en' ? 1 : 0];
    }

    function normalisasiTeks(teks) {
        return String(teks).toLowerCase().replace(/[\s.]/g, '');
    }

    function namaRuanganTampil(nama) {
        try {
            let teks = String(nama).trim();
            
            if (bahasaAktif() === 'en') {
                const lower = teks.toLowerCase();
                if (lower.includes('lab komputer 1') || lower.includes('laboratorium komputer 1')) return 'Computer Lab 1';
                if (lower.includes('lab komputer 2') || lower.includes('laboratorium komputer 2')) return 'Computer Lab 2';
                if (lower.includes('lab komputer') || lower.includes('laboratorium komputer')) return 'Computer Lab';
                if (lower.includes('perpustakaan') || lower.includes('perpus')) return 'Library';
            }

            return nama;
        } catch (error) {
            return nama;
        }
    }

    function terjemahkanPilihanRuangan() {
        try {
            Array.from(filterRuangan.options).forEach(function (pilihan) {
                if (pilihan.dataset.asli === undefined) {
                    pilihan.dataset.asli = pilihan.value;
                    pilihan.value = pilihan.dataset.asli;
                }
                if (pilihan.dataset.asli === '') return;

                const teks = namaRuanganTampil(pilihan.dataset.asli);
                if (pilihan.textContent !== teks) pilihan.textContent = teks;
            });
        } catch (error) {}
    }

    function isiPilihanBulan() {
        filterBulan.innerHTML = '<option value="">Semua Bulan</option>' +
            URUTAN_BULAN.map(function (bulan) {
                const nilai = bulan + '-' + TAHUN_FILTER;
                return '<option value="' + nilai + '">' + nilai + '</option>';
            }).join('');
    }

    function hitungStatus(kwh) {
        if (kwh < BATAS_HEMAT) return 'Hemat';
        if (kwh < BATAS_BOROS) return 'Normal';
        return 'Boros';
    }

    function cocokPemakaian(kwh, pilihan) {
        if (pilihan === 'low') return kwh < BATAS_HEMAT;
        if (pilihan === 'medium') return kwh >= BATAS_HEMAT && kwh < BATAS_BOROS;
        if (pilihan === 'high') return kwh >= BATAS_BOROS;
        return true;
    }

    function terapkanFilter() {
        const ruangan = filterRuangan.value;
        const bulan = filterBulan.value;
        const pemakaian = filterPemakaian.value;

        hasilFilter = dataTagihan.filter(function (tagihan) {
            const cocokRuangan = ruangan === '' || tagihan.ruangan === ruangan;
            const cocokBulan = bulan === '' || tagihan.bulan === bulan;
            return cocokRuangan && cocokBulan && cocokPemakaian(tagihan.kwh, pemakaian);
        });

        halamanSekarang = 1;
        tampilkanTabel();
    }

    function buatBaris(tagihan) {
        const status = hitungStatus(tagihan.kwh);
        const baris = document.createElement('tr');
        baris.innerHTML = '<td></td><td></td><td></td><td><span class="badge"></span></td>';

        baris.children[0].textContent = tagihan.bulan;
        baris.children[1].textContent = namaRuanganTampil(tagihan.ruangan);
        baris.children[2].textContent = formatAngka(tagihan.kwh) + ' kWh';

        const lencana = baris.querySelector('.badge');
        
        // Perbaikan kelas dan teks lencana status agar warna birunya muncul kembali
        if (bahasaAktif() === 'en') {
            if (status === 'Hemat') { 
                lencana.textContent = 'Saving'; 
                lencana.className = 'badge hemat'; 
            } else if (status === 'Boros') { 
                lencana.textContent = 'Wasteful'; 
                lencana.className = 'badge boros'; 
            } else { 
                lencana.textContent = 'Normal'; 
                lencana.className = 'badge normal'; 
            }
        } else {
            lencana.textContent = status;
            lencana.classList.add(status.toLowerCase());
        }

        return baris;
    }

    function tampilkanBarisKosong() {
        badanTabel.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px;">' + teksLokal('kosongTabel') + '</td></tr>';
    }

    function tampilkanTabel() {
        const totalHalaman = Math.max(1, Math.ceil(hasilFilter.length / BARIS_PER_HALAMAN));
        const awal = (halamanSekarang - 1) * BARIS_PER_HALAMAN;
        const tampil = hasilFilter.slice(awal, awal + BARIS_PER_HALAMAN);

        badanTabel.innerHTML = '';
        if (tampil.length === 0) {
            tampilkanBarisKosong();
        } else {
            tampil.forEach(function (tagihan) {
                badanTabel.appendChild(buatBaris(tagihan));
            });
        }

        infoHalaman.textContent = halamanSekarang + ' / ' + totalHalaman;
        tombolBack.disabled = halamanSekarang <= 1;
        tombolNext.disabled = halamanSekarang >= totalHalaman;
    }

    function halamanSebelumnya() {
        if (halamanSekarang > 1) { halamanSekarang--; tampilkanTabel(); }
    }

    function halamanBerikutnya() {
        const totalHalaman = Math.ceil(hasilFilter.length / BARIS_PER_HALAMAN);
        if (halamanSekarang < totalHalaman) { halamanSekarang++; tampilkanTabel(); }
    }

    formFilter.addEventListener('submit', function(e) {
        e.preventDefault();
        terapkanFilter();
    });

    tombolBack.addEventListener('click', halamanSebelumnya);
    tombolNext.addEventListener('click', halamanBerikutnya);

    [filterRuangan, filterBulan, filterPemakaian].forEach(function (pilihan) {
        pilihan.addEventListener('change', terapkanFilter);
    });

    isiPilihanBulan();
    tampilkanTabel();
    terjemahkanPilihanRuangan();
})();