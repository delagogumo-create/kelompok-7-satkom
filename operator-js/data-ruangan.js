(function () {
    var BARIS_PER_HALAMAN = 5;

    var TERJEMAHAN_NAMA = {
        'rkelas': 'Classroom', 'ruangkelas': 'Classroom',
        'rkomputer': 'Computer Room', 'ruangkomputer': 'Computer Room',
        'rdosen': 'Lecturer Room', 'ruangdosen': 'Lecturer Room',
        'rguru': 'Teacher Room', 'ruangguru': 'Teacher Room',
        'rtu': 'Administration Office', 'ruangtu': 'Administration Office',
        'rjt1': 'JT1 Room', 'rrapat': 'Meeting Room', 'ruangrapat': 'Meeting Room',
        'rlab': 'Lab Room', 'ruanglab': 'Lab Room', 'rseminar': 'Seminar Room',
        'ruangseminar': 'Seminar Room', 'rperpustakaan': 'Library',
        'ruangperpustakaan': 'Library', 'rperpus': 'Library', 'perpustakaan': 'Library',
        'rmusholla': 'Prayer Room', 'ruangmusholla': 'Prayer Room'
    };

    var DICT = {
        id: {
            dashboard: "Dashboard", dataRuangan: "Data Ruangan", dataTagihan: "Data Tagihan",
            keluar: "Keluar", editProfil: "Edit Profil", pengaturan: "Pengaturan",
            pencarianPlaceholder: "Pencarian", thNo: "No", thNamaRuangan: "Nama Ruangan",
            thAc: "Jml AC", thLampu: "Jml Lampu", thAksi: "Aksi",
            btnBack: "Back", btnNext: "Next", kosonta: "Data tidak ditemukan",
            hapusJudul: "Hapus ruangan?", hapusBatal: "Batal", hapusYa: "Ya, Hapus",
            toastUbah: "Data ruangan berhasil diperbarui.", toastHapus: "Data ruangan berhasil dihapus.",
            tombolHapus: "Hapus", modalEditTitle: "Edit Ruangan", labelNamaRuangan: "Nama Ruangan",
            labelAc: "Jumlah AC", labelLampu: "Jumlah Lampu", btnBatal: "Batal", btnSimpan: "Simpan",
            namaWajib: "Nama ruangan wajib diisi", namaAda: "Nama ruangan sudah ada",
            acWajib: "Jumlah AC wajib diisi", acAngka: "Jumlah AC harus berupa angka bulat, minimal 0",
            lampuWajib: "Jumlah lampu wajib diisi", lampuAngka: "Jumlah lampu harus berupa angka bulat, minimal 0"
        },
        en: {
            dashboard: "Dashboard", dataRuangan: "Room Data", dataTagihan: "Billing Data",
            keluar: "Logout", editProfil: "Edit Profile", pengaturan: "Settings",
            pencarianPlaceholder: "Search", thNo: "No", thNamaRuangan: "Room Name",
            thAc: "AC Count", thLampu: "Lamp Count", thAksi: "Action",
            btnBack: "Back", btnNext: "Next", kosonta: "No data found",
            hapusJudul: "Delete room?", hapusBatal: "Cancel", hapusYa: "Yes, Delete",
            toastUbah: "Room data updated successfully.", toastHapus: "Room data deleted successfully.",
            tombolHapus: "Delete", modalEditTitle: "Edit Room", labelNamaRuangan: "Room Name",
            labelAc: "Number of ACs", labelLampu: "Number of Lamps", btnBatal: "Cancel", btnSimpan: "Save",
            namaWajib: "Room name is required", namaAda: "Room name already exists",
            acWajib: "Number of ACs is required", acAngka: "Number of ACs must be a whole number, minimum 0",
            lampuWajib: "Number of lamps is required", lampuAngka: "Number of lamps must be a whole number, minimum 0"
        }
    };

    function getLang() {
        try {
            var saved = JSON.parse(localStorage.getItem('pengaturanAdmin') || localStorage.getItem('pengaturanOperator') || '{}');
            if (saved && saved.bahasa) {
                return /^id/i.test(String(saved.bahasa).trim()) ? 'id' : 'en';
            }
        } catch (e) {}
        return 'id';
    }

    function t(kunci) {
        var lang = getLang();
        return (DICT[lang] && DICT[lang][kunci]) ? DICT[lang][kunci] : (DICT['id'][kunci] || kunci);
    }

    function applyTranslations() {
        var lang = getLang();
        document.querySelectorAll('[data-i18n]').forEach(el => {
            var key = el.getAttribute('data-i18n');
            if (DICT[lang][key]) el.textContent = DICT[lang][key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            var key = el.getAttribute('data-i18n-placeholder');
            if (DICT[lang][key]) el.placeholder = DICT[lang][key];
        });
    }

    var IKON_EDIT = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="M14 7l3 3"/></svg>';
    var IKON_HAPUS = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/><path d="M10 11v6M14 11v6"/></svg>';

    var badanTabel = document.querySelector('#tabelRuangan tbody');
    var inputCari = document.getElementById('cari');
    var tombolBack = document.getElementById('btnBack');
    var tombolNext = document.getElementById('btnNext');
    var infoHalaman = document.getElementById('pageInfo');
    var toast = document.getElementById('pesanSukses');

    var modal = document.getElementById('modalEdit');
    var formEdit = document.getElementById('formEdit');
    var inputNama = document.getElementById('inNama');
    var inputAC = document.getElementById('inAc');
    var inputLampu = document.getElementById('inLampu');
    var pesanError = document.getElementById('modalError');
    var tombolBatal = document.getElementById('btnBatal');

    var daftarRuangan = Array.isArray(window.DATA_RUANGAN_DB) ? window.DATA_RUANGAN_DB : [];
    var halamanSekarang = 1;
    var idSedangDiedit = null;
    var namaAwalTampil = '';
    var timerToast = null;

    var pesanKolom = new Map();
    [inputNama, inputAC, inputLampu].forEach(function (input) {
        var el = document.createElement('small');
        el.className = 'pesan-kolom';
        el.setAttribute('role', 'alert');
        input.insertAdjacentElement('afterend', el);
        pesanKolom.set(input, el);
    });

    function setErrorKolom(input, pesan) {
        var el = pesanKolom.get(input);
        el.textContent = pesan;
        el.classList.toggle('tampil', pesan !== '');
        input.classList.toggle('invalid', pesan !== '');
    }

    function bersihkanSemuaError() {
        [inputNama, inputAC, inputLampu].forEach(function (input) { setErrorKolom(input, ''); });
        pesanError.textContent = '';
        pesanError.hidden = true;
    }

    function tampilkanToast(pesan) {
        if (!toast) return;
        toast.textContent = pesan;
        toast.style.display = 'block';
        clearTimeout(timerToast);
        timerToast = setTimeout(function () { toast.style.display = 'none'; }, 2400);
    }

    function escapeHtml(teks) {
        return String(teks).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function normalisasiTeks(teks) {
        return String(teks).toLowerCase().replace(/[\s.]/g, '');
    }

    function namaTampil(ruangan) {
        if (getLang() !== 'en') return ruangan.nama;
        var kunci = normalisasiTeks(ruangan.nama);
        return TERJEMAHAN_NAMA[kunci] || ruangan.nama;
    }

    function ambilHasilFilter() {
        var kata = normalisasiTeks(inputCari.value);
        return daftarRuangan.filter(function (r) {
            return normalisasiTeks(r.nama).indexOf(kata) !== -1 ||
                   normalisasiTeks(namaTampil(r)).indexOf(kata) !== -1 ||
                   String(r.ac).indexOf(kata) !== -1 ||
                   String(r.lampu).indexOf(kata) !== -1;
        });
    }

    function buatBaris(ruangan, nomor) {
        return '<tr>' +
            '<td>' + nomor + '</td>' +
            '<td>' + escapeHtml(namaTampil(ruangan)) + '</td>' +
            '<td>' + ruangan.ac + '</td>' +
            '<td>' + ruangan.lampu + '</td>' +
            '<td>' +
                '<span class="actions">' +
                    '<button class="edit" type="button" data-id="' + ruangan.id + '" title="Edit">' + IKON_EDIT + '</button>' +
                    '<button class="del" type="button" data-id="' + ruangan.id + '" title="' + t('tombolHapus') + '">' + IKON_HAPUS + '</button>' +
                '</span>' +
            '</td>' +
        '</tr>';
    }

    function tampilkanTabel() {
        var hasil = ambilHasilFilter();
        var totalHalaman = Math.max(1, Math.ceil(hasil.length / BARIS_PER_HALAMAN));
        if (halamanSekarang > totalHalaman) halamanSekarang = totalHalaman;

        var awal = (halamanSekarang - 1) * BARIS_PER_HALAMAN;
        var tampil = hasil.slice(awal, awal + BARIS_PER_HALAMAN);

        if (tampil.length === 0) {
            badanTabel.innerHTML = '<tr class="baris-kosong"><td colspan="5">' + t('kosonta') + '</td></tr>';
        } else {
            badanTabel.innerHTML = tampil.map(function (r) {
                return buatBaris(r, daftarRuangan.indexOf(r) + 1);
            }).join('');
        }

        infoHalaman.textContent = halamanSekarang + ' / ' + totalHalaman;
        tombolBack.disabled = halamanSekarang <= 1;
        tombolNext.disabled = halamanSekarang >= totalHalaman;
    }

    function validasiForm() {
        var valid = true;
        var pertama = null;
        function salah(input, pesan) {
            setErrorKolom(input, pesan);
            valid = false;
            if (!pertama) pertama = input;
        }

        var nama = inputNama.value.trim();
        if (nama === '') salah(inputNama, t('namaWajib'));
        else setErrorKolom(inputNama, '');

        if (inputAC.value.trim() === '') salah(inputAC, t('acWajib'));
        else if (!/^[0-9]+$/.test(inputAC.value.trim())) salah(inputAC, t('acAngka'));
        else setErrorKolom(inputAC, '');

        if (inputLampu.value.trim() === '') salah(inputLampu, t('lampuWajib'));
        else if (!/^[0-9]+$/.test(inputLampu.value.trim())) salah(inputLampu, t('lampuAngka'));
        else setErrorKolom(inputLampu, '');

        if (pertama) pertama.focus();
        return valid;
    }

    function bukaModalEdit(ruangan) {
        idSedangDiedit = ruangan.id;
        bersihkanSemuaError();
        namaAwalTampil = namaTampil(ruangan);
        inputNama.value = namaAwalTampil;
        inputAC.value = ruangan.ac;
        inputLampu.value = ruangan.lampu;
        modal.hidden = false;
        inputNama.focus();
    }

    function tutupModal() {
        modal.hidden = true;
        idSedangDiedit = null;
        namaAwalTampil = '';
        formEdit.reset();
        bersihkanSemuaError();
    }

    formEdit.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (idSedangDiedit === null || !validasiForm()) return;

        var fd = new FormData();
        fd.append('aksi', 'edit');
        fd.append('id', idSedangDiedit);
        fd.append('nama', inputNama.value.trim());
        fd.append('ac', inputAC.value);
        fd.append('lampu', inputLampu.value);

        try {
            var res = await fetch('data-ruangan.php', { method: 'POST', body: fd });
            var json = await res.json();
            if (json.status === 'sukses') {
                tampilkanToast(t('toastUbah'));
                setTimeout(() => location.reload(), 1000);
            } else {
                alert(json.pesan);
            }
        } catch (err) {
            alert('Gagal terhubung ke server');
        }
    });

    // Pop-up Hapus
    var popupHapus = document.createElement('div');
    popupHapus.className = 'hapus-back';
    popupHapus.innerHTML = '<div class="hapus-kotak" role="alertdialog"><h3 class="hapus-judul"></h3><p class="hapus-teks"></p><div class="hapus-aksi"><button type="button" class="hapus-batal"></button><button type="button" class="hapus-ya"></button></div></div>';
    document.body.appendChild(popupHapus);
    var ruanganAkanDihapus = null;

    function hapusRuangan(ruangan) {
        ruanganAkanDihapus = ruangan;
        popupHapus.querySelector('.hapus-judul').textContent = t('hapusJudul');
        popupHapus.querySelector('.hapus-batal').textContent = t('hapusBatal');
        popupHapus.querySelector('.hapus-ya').textContent = t('hapusYa');
        popupHapus.querySelector('.hapus-teks').textContent = getLang() === 'en' ? 'The room "' + namaTampil(ruangan) + '" will be removed.' : 'Ruangan "' + namaTampil(ruangan) + '" akan dihapus.';
        popupHapus.classList.add('tampil');
    }

    popupHapus.querySelector('.hapus-batal').addEventListener('click', () => popupHapus.classList.remove('tampil'));
    popupHapus.querySelector('.hapus-ya').addEventListener('click', async () => {
        popupHapus.classList.remove('tampil');
        if (!ruanganAkanDihapus) return;

        var fd = new FormData();
        fd.append('aksi', 'hapus');
        fd.append('id', ruanganAkanDihapus.id);

        try {
            var res = await fetch('data-ruangan.php', { method: 'POST', body: fd });
            var json = await res.json();
            if (json.status === 'sukses') {
                tampilkanToast(t('toastHapus'));
                setTimeout(() => location.reload(), 1000);
            } else {
                alert(json.pesan);
            }
        } catch (err) {
            alert('Gagal terhubung ke server');
        }
    });

    badanTabel.addEventListener('click', function (event) {
        var tombol = event.target.closest('button[data-id]');
        if (!tombol) return;
        var id = Number(tombol.dataset.id);
        var ruangan = daftarRuangan.find(r => r.id === id);
        if (!ruangan) return;

        if (tombol.classList.contains('edit')) bukaModalEdit(ruangan);
        else if (tombol.classList.contains('del')) hapusRuangan(ruangan);
    });

    tombolBatal.addEventListener('click', tutupModal);
    inputCari.addEventListener('input', () => { halamanSekarang = 1; tampilkanTabel(); });
    tombolBack.addEventListener('click', () => { if (halamanSekarang > 1) { halamanSekarang--; tampilkanTabel(); } });
    tombolNext.addEventListener('click', () => { halamanSekarang++; tampilkanTabel(); });

    window.addEventListener('storage', () => { applyTranslations(); tampilkanTabel(); });

    applyTranslations();
    tampilkanTabel();
})();