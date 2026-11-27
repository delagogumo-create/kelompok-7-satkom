(function () {
  const BARIS_PER_HALAMAN = 5;
  const BATAS_HEMAT = 500;
  const BATAS_BOROS = 1000;

  // ===== KAMUS TERJEMAHAN =====
  const KAMUS_RUANGAN = {
    'kelas': 'Classroom', 'komputer': 'Computer', 'dosen': 'Lecturer',
    'guru': 'Teacher', 'tu': 'Administration Office', 'rapat': 'Meeting',
    'lab': 'Lab', 'seminar': 'Seminar', 'perpustakaan': 'Library',
    'musholla': 'Prayer', 'umum': 'General', 'jt1': 'JT1'
  };

  const TANPA_AKHIRAN = { 'Classroom': true, 'Library': true, 'Administration Office': true };

  const KAMUS_BULAN = {
    'januari': 'January', 'februari': 'February', 'maret': 'March',
    'april': 'April', 'mei': 'May', 'juni': 'June', 'juli': 'July',
    'agustus': 'August', 'september': 'September', 'oktober': 'October',
    'november': 'November', 'desember': 'December'
  };

  const STATUS_EN = { 'Hemat': 'Efficient', 'Normal': 'Normal', 'Boros': 'Wasteful' };

  const DICT = {
    id: {
      dashboard: "Dashboard", dataRuangan: "Data Ruangan", dataTagihan: "Data Tagihan",
      keluar: "Keluar", editProfil: "Edit Profil", pengaturan: "Pengaturan",
      dashOperatorTitle: "Dashboard Operator",
      dashOperatorSub: "Input pemakaian listrik per ruangan dan pantau riwayatnya",
      inputListrikTitle: "Input Pemakaian Listrik",
      labelRuangan: "Ruangan", pilihRuangan: "Pilih ruangan",
      labelBulan: "Bulan", pilihBulan: "Pilih bulan",
      labelKwh: "Pemakaian (kWh)", placeholderKwh: "Masukkan angka",
      btnSimpan: "Simpan", riwayatTitle: "Riwayat Input Pemakaian",
      thTanggal: "Tanggal", thRuangan: "Ruangan", thKwh: "Pemakaian (kWh)", thStatus: "Status",
      btnBack: "Back", btnNext: "Next",
      wajib: "Harap lengkapi semua kolom.", negatif: "Pemakaian tidak boleh kurang dari 0.",
      kosong: "Belum ada riwayat input"
    },
    en: {
      dashboard: "Dashboard", dataRuangan: "Room Data", dataTagihan: "Billing Data",
      keluar: "Logout", editProfil: "Edit Profile", pengaturan: "Settings",
      dashOperatorTitle: "Operator Dashboard",
      dashOperatorSub: "Input room electricity usage and monitor history",
      inputListrikTitle: "Input Electricity Usage",
      labelRuangan: "Room", pilihRuangan: "Select room",
      labelBulan: "Month", pilihBulan: "Select month",
      labelKwh: "Usage (kWh)", placeholderKwh: "Enter number",
      btnSimpan: "Save", riwayatTitle: "Usage Input History",
      thTanggal: "Date", thRuangan: "Room", thKwh: "Usage (kWh)", thStatus: "Status",
      btnBack: "Back", btnNext: "Next",
      wajib: "Please fill in all fields.", negatif: "Usage cannot be less than 0.",
      kosong: "No input history yet"
    }
  };

  function getLang() {
    try {
      const saved = JSON.parse(localStorage.getItem('pengaturanAdmin') || localStorage.getItem('pengaturanOperator') || '{}');
      if (saved && saved.bahasa) {
        return /^id/i.test(String(saved.bahasa).trim()) ? 'id' : 'en';
      }
    } catch (e) {}
    return 'id';
  }

  function t(kunci) {
    const lang = getLang();
    return (DICT[lang] && DICT[lang][kunci]) ? DICT[lang][kunci] : (DICT['id'][kunci] || kunci);
  }

  function applyTranslations() {
    const lang = getLang();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (DICT[lang][key]) el.textContent = DICT[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (DICT[lang][key]) el.placeholder = DICT[lang][key];
    });
  }

  function terjemahkanRuangan(nama) {
    const teks = String(nama).trim();
    const m = teks.match(/^(ruang|laboratorium|lab|r|l)(?:\.\s*|\s+)(\S+)\s*(.*)$/i);
    if (!m) return teks;
    const awalan = m[1].toLowerCase();
    const kataInti = m[2].toLowerCase().replace(/\./g, '');
    let inti = KAMUS_RUANGAN[kataInti];
    if (!inti && kataInti.indexOf('perpus') === 0) inti = 'Library';
    if (!inti) return teks;
    const sisa = m[3] ? ' ' + m[3] : '';
    if (TANPA_AKHIRAN[inti]) return inti + sisa;
    const jenis = (awalan === 'l' || awalan === 'lab' || awalan === 'laboratorium') ? 'Lab' : 'Room';
    return inti + ' ' + jenis + sisa;
  }

  function terjemahkanBulan(teks) {
    return String(teks).replace(/[A-Za-z]+/g, function (kata) {
      return KAMUS_BULAN[kata.toLowerCase()] || kata;
    });
  }

  function namaRuanganTampil(nama) {
    return getLang() === 'en' ? terjemahkanRuangan(nama) : nama;
  }

  function namaStatusTampil(status) {
    return getLang() === 'en' ? STATUS_EN[status] : status;
  }

  // ===== GAYA PESAN ERROR & TOAST =====
  const gayaOperator = document.createElement('style');
  gayaOperator.textContent = `
    .operator-form { position: relative; padding-bottom: 22px; }
    .operator-form .field { position: relative; }
    .operator-form .field small.pesan-kolom {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      color: #dc2626;
      font-size: 13px !important;
      font-weight: 400 !important;
    }
    .operator-form .field.invalid small.pesan-kolom { display: block; }
    .operator-form .field.invalid select,
    .operator-form .field.invalid input { border-color: #dc2626; }

    .toast-operator {
      position: fixed; top: 18px; left: 50%; z-index: 4000;
      display: flex; align-items: center; gap: 10px; padding: 12px 20px;
      border-radius: 12px; background: #dcfce7; border: 1px solid #86efac; color: #166534;
      font: 600 14px Inter, Arial, sans-serif; box-shadow: 0 10px 26px rgba(15, 42, 67, .18);
      opacity: 0; transform: translateX(-50%) translateY(-24px); transition: opacity .25s ease, transform .25s ease;
      pointer-events: none;
    }
    .toast-operator.tampil { opacity: 1; transform: translateX(-50%) translateY(0); }
    .toast-operator svg { width: 22px; height: 22px; stroke: currentColor; fill: none; stroke-width: 2; }
  `;
  document.head.appendChild(gayaOperator);

  function tampilkanToast(pesan) {
    let toast = document.getElementById('toastOperator');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastOperator';
      toast.className = 'toast-operator';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l3 3 5-6"/></svg><span>' + pesan + '</span>';
    toast.classList.add('tampil');
    setTimeout(() => toast.classList.remove('tampil'), 3000);
  }

  // ===== DATA DARI DATABASE =====
  const dataRiwayat = Array.isArray(window.DATA_RIWAYAT_DB) ? window.DATA_RIWAYAT_DB : [];

  const form = document.getElementById('inputForm');
  const selRuangan = document.getElementById('ruangan');
  const selBulan = document.getElementById('bulan');
  const inKwh = document.getElementById('kwh');
  const badanTabel = document.getElementById('tabelRiwayat');
  const tombolBack = document.getElementById('btnBack');
  const tombolNext = document.getElementById('btnNext');
  const infoHalaman = document.getElementById('infoHalaman');

  let halamanSekarang = 1;
  let fokusDariKode = false;

  [selRuangan, selBulan, inKwh].forEach(el => {
    const pesan = document.createElement('small');
    pesan.className = 'pesan-kolom';
    el.closest('.field').appendChild(pesan);
    el.addEventListener('input', () => el.closest('.field').classList.remove('invalid'));
    el.addEventListener('change', () => el.closest('.field').classList.remove('invalid'));
    el.addEventListener('focus', () => { if (!fokusDariKode) el.closest('.field').classList.remove('invalid'); });
  });

  function hitungStatus(kwh) {
    if (kwh < BATAS_HEMAT) return 'Hemat';
    if (kwh < BATAS_BOROS) return 'Normal';
    return 'Boros';
  }

  function formatAngka(n) {
    return Number(n).toLocaleString(getLang() === 'id' ? 'id-ID' : 'en-US');
  }

  function perbaruiDropdown() {
    const en = getLang() === 'en';
    Array.from(selRuangan.options).forEach(opt => {
      if (opt.value !== '') opt.textContent = en ? terjemahkanRuangan(opt.value) : opt.value;
    });
    Array.from(selBulan.options).forEach(opt => {
      if (opt.value !== '') opt.textContent = en ? terjemahkanBulan(opt.value) : opt.value;
    });
  }

  function buatBaris(item) {
    const status = hitungStatus(item.kwh);
    const baris = document.createElement('tr');
    baris.innerHTML = '<td></td><td></td><td></td><td><span class="badge"></span></td>';
    baris.children[0].textContent = item.tanggal;
    baris.children[1].textContent = namaRuanganTampil(item.ruangan);
    baris.children[2].textContent = formatAngka(item.kwh);

    const lencana = baris.querySelector('.badge');
    lencana.textContent = namaStatusTampil(status);
    lencana.classList.add(status.toLowerCase());
    return baris;
  }

  function tampilkanTabel() {
    const totalHalaman = Math.max(1, Math.ceil(dataRiwayat.length / BARIS_PER_HALAMAN));
    if (halamanSekarang > totalHalaman) halamanSekarang = totalHalaman;

    const awal = (halamanSekarang - 1) * BARIS_PER_HALAMAN;
    const tampil = dataRiwayat.slice(awal, awal + BARIS_PER_HALAMAN);

    badanTabel.innerHTML = '';
    if (tampil.length === 0) {
      badanTabel.innerHTML = '<tr class="baris-kosong"><td colspan="4" style="text-align:center; padding:20px;">' + t('kosong') + '</td></tr>';
    } else {
      tampil.forEach(item => badanTabel.appendChild(buatBaris(item)));
    }

    infoHalaman.textContent = halamanSekarang + ' / ' + totalHalaman;
    tombolBack.disabled = halamanSekarang <= 1;
    tombolNext.disabled = halamanSekarang >= totalHalaman;
  }

  tombolBack.addEventListener('click', () => { if (halamanSekarang > 1) { halamanSekarang--; tampilkanTabel(); } });
  tombolNext.addEventListener('click', () => {
    if (halamanSekarang < Math.ceil(dataRiwayat.length / BARIS_PER_HALAMAN)) { halamanSekarang++; tampilkanTabel(); }
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const ruangan = selRuangan.value;
    const bulan = selBulan.value;
    const kwh = inKwh.value;

    let errEl = null;
    if (ruangan === '') { selRuangan.closest('.field').classList.add('invalid'); selRuangan.closest('.field').querySelector('.pesan-kolom').textContent = t('wajib'); errEl = errEl || selRuangan; }
    if (bulan === '') { selBulan.closest('.field').classList.add('invalid'); selBulan.closest('.field').querySelector('.pesan-kolom').textContent = t('wajib'); errEl = errEl || selBulan; }
    if (kwh === '') { inKwh.closest('.field').classList.add('invalid'); inKwh.closest('.field').querySelector('.pesan-kolom').textContent = t('wajib'); errEl = errEl || inKwh; }
    else if (Number(kwh) < 0) { inKwh.closest('.field').classList.add('invalid'); inKwh.closest('.field').querySelector('.pesan-kolom').textContent = t('negatif'); errEl = errEl || inKwh; }

    if (errEl) {
      fokusDariKode = true; errEl.focus(); fokusDariKode = false;
      return;
    }

    const fd = new FormData();
    fd.append('ruangan', ruangan);
    fd.append('bulan', bulan);
    fd.append('kwh', kwh);

    try {
      const res = await fetch('dashboard.php', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.status === 'sukses') {
        tampilkanToast(t('sukses'));
        setTimeout(() => location.reload(), 1200);
      } else {
        alert(json.pesan);
      }
    } catch (err) {
      alert('Gagal terhubung ke server');
    }
  });

  window.addEventListener('storage', () => { applyTranslations(); perbaruiDropdown(); tampilkanTabel(); });

  applyTranslations();
  perbaruiDropdown();
  tampilkanTabel();
})();