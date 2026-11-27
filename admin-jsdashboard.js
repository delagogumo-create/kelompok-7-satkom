// ===== Data dari PHP & Database =====
const BATAS_SUMBU_Y = 2000;
const dataBulanan = Array.isArray(window.DATA_BULANAN_DB) ? window.DATA_BULANAN_DB : [];

function formatRibuan(angka) {
    if (typeof formatAngka === 'function') {
        return formatAngka(angka);
    }
    return Number(angka || 0).toLocaleString('id-ID');
}

// ===== Kartu ringkasan (per bulan) =====
function tampilkanRingkasan(item) {
    if (!item) return;
    const elTotal = document.getElementById('totalPemakaian');
    const elRata = document.getElementById('rataRata');
    const elSub = document.querySelector('.sub');

    if (elTotal) elTotal.textContent = formatRibuan(item.kwh);
    if (elRata) elRata.textContent = item.persen + '%';
    if (elSub) {
        elSub.textContent =
            'Ringkasan pemakaian listrik seluruh ruangan, ' + item.namaLengkap + ' ' + (item.tahun || 2026);
    }
}

// ===== Grafik =====
function buatBatang(item, indeks, indeksAktif) {
    const tinggi = Math.min((Number(item.kwh) / BATAS_SUMBU_Y) * 100, 100);
    const kelasAktif = indeks === indeksAktif ? ' current' : '';

    return `
        <div class="bar-col" data-indeks="${indeks}" style="cursor:pointer">
            <div class="bar${kelasAktif}" style="height:${tinggi}%">
                <span class="val">${formatRibuan(item.kwh)}</span>
            </div>
        </div>
    `;
}

function tampilkanGrafik(indeksAktif) {
    const wadahBars = document.querySelector('.bars');
    const wadahXAxis = document.querySelector('.x-axis');
    if (!wadahBars || !wadahXAxis) return;

    if (dataBulanan.length === 0) {
        wadahBars.innerHTML = '';
        wadahXAxis.innerHTML = '';
        return;
    }

    wadahBars.innerHTML = dataBulanan.map(function (item, indeks) {
        return buatBatang(item, indeks, indeksAktif);
    }).join('');

    wadahXAxis.innerHTML = dataBulanan.map(function (item) {
        return '<span>' + item.bulan + '</span>';
    }).join('');
}

// ===== Pilih bulan =====
function pilihBulan(indeks) {
    if (dataBulanan.length === 0) return;
    tampilkanRingkasan(dataBulanan[indeks]);
    tampilkanGrafik(indeks);
}

function aktifkanKlikBatang() {
    const wadahBars = document.querySelector('.bars');
    if (!wadahBars) return;

    wadahBars.addEventListener('click', function (e) {
        const kolom = e.target.closest('.bar-col');
        if (!kolom) return;
        pilihBulan(Number(kolom.dataset.indeks));
    });
}

// ===== Jalankan =====
if (dataBulanan.length > 0) {
    pilihBulan(dataBulanan.length - 1);
}
aktifkanKlikBatang();
