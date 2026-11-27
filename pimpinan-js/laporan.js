/* =================================
   BAHASA
================================= */

const isEn = (function () {
    var data = {};
    try {
        data = JSON.parse(localStorage.getItem('pengaturanPimpinan')) || {};
    } catch (e) {}

    var b = String(data.bahasa || data.language || data.lang || '').toLowerCase();
    return (b === 'en' || b.indexOf('eng') === 0 || b.indexOf('ing') === 0);
})();

const kamus = {
    'Laporan Konsumsi Listrik': 'Electricity Consumption Report',
    'Rekapitulasi pemakaian listrik berdasarkan ruangan dan periode':
        'Summary of electricity usage by room and period',
    'Bulan': 'Month',
    'Tahun': 'Year',
    'Semua Bulan': 'All Months',
    'Semua Status': 'All Statuses',
    'Okt': 'Oct',
    'Sep': 'Sep',
    'Agu': 'Agu',
    'Des': 'Dec',
    'Nama Ruangan': 'Room Name',
    'Tampilkan': 'Show',
    'Cetak PDF': 'Print PDF',
    'NORMAL': 'NORMAL',
    'BOROS': 'WASTEFUL',
    'HEMAT': 'SAVING',
    'Tidak ada data laporan yang sesuai.': 'No matching report data found.',
    'Laporan berhasil ditampilkan.': 'Report displayed successfully.',

    // Nama ruangan
    'R. Kelas A': 'Classroom A',
    'L. Komputer': 'Computer Lab',
    'R. Dosen': 'Lecturers Room',
    'R. T.U': 'Admin Office',

    // Menu & header
    'Laporan': 'Reports',
    'Analisis': 'Analysis',
    'Keluar': 'Logout',
    'Pimpinan': 'Leader',
    'Edit Profil': 'Edit Profile',
    'Pengaturan': 'Settings'
};

const T = text => (isEn && kamus[text]) ? kamus[text] : text;

/* =================================
   DATA LAPORAN
================================= */

const sample = [
    {id:1, month:'Okt', year:'2026', room:'R. Kelas A', kwh:800, status:'NORMAL'},
    {id:2, month:'Okt', year:'2026', room:'L. Komputer', kwh:1200, status:'BOROS'},
    {id:3, month:'Okt', year:'2026', room:'R. Dosen', kwh:150, status:'HEMAT'},
    {id:4, month:'Okt', year:'2026', room:'R. T.U', kwh:200, status:'HEMAT'},
    {id:5, month:'Sep', year:'2026', room:'R. Kelas A', kwh:750, status:'NORMAL'},
    {id:6, month:'Sep', year:'2026', room:'L. Komputer', kwh:1100, status:'BOROS'},
    {id:7, month:'Agu', year:'2026', room:'R. Dosen', kwh:180, status:'HEMAT'},
    {id:8, month:'Agu', year:'2026', room:'R. T.U', kwh:250, status:'HEMAT'}
];

let reports;

try {
    reports = JSON.parse(
        localStorage.getItem('laporan-pimpinan-konsumsi-listrik')
    ) || sample;
} catch (error) {
    reports = sample;
}

let page = 1;
const perPage = 4;

// Penanda apakah tombol Tampilkan sudah pernah diklik
let isFiltered = false;
let activeFilter = {
    month: '',
    year: '',
    status: ''
};

const $ = id => document.getElementById(id);

const formatNumber = number =>
    Number(number).toLocaleString(isEn ? 'en-US' : 'id-ID');

/* =================================
   NOTIFIKASI
================================= */

function notify(message) {
    const notice = $('notice');

    if (!notice) return;

    notice.textContent = message;
    notice.style.display = 'block';

    clearTimeout(window.noticeTimer);

    window.noticeTimer = setTimeout(() => {
        notice.style.display = 'none';
    }, 2500);
}

/* =================================
   FILTER DATA
================================= */

function filteredReports() {
    const search = $('search').value.trim().toLowerCase();

    return reports.filter(report => {
        // Jika tombol Tampilkan belum pernah diklik, tampilkan semua data secara default
        if (!isFiltered) {
            return true;
        }

        const matchMonth = !activeFilter.month || report.month === activeFilter.month;
        const matchYear = !activeFilter.year || report.year === activeFilter.year;
        const matchStatus = !activeFilter.status || report.status.toUpperCase() === activeFilter.status.toUpperCase();
        
        const rowText = `${report.room} ${T(report.room)} ${report.month} ${T(report.month)} ${report.year} ${report.kwh} ${report.status} ${T(report.status)}`.toLowerCase();
        const matchSearch = rowText.includes(search);

        return matchMonth && matchYear && matchStatus && matchSearch;
    });
}

/* =================================
   TAMPILKAN DATA
================================= */

function render() {
    const list = filteredReports();

    const totalPages = Math.max(
        1,
        Math.ceil(list.length / perPage)
    );

    if (page > totalPages) {
        page = totalPages;
    }

    const start = (page - 1) * perPage;

    const displayed = list.slice(
        start,
        start + perPage
    );

    if (displayed.length > 0) {

        $('rows').innerHTML = displayed.map((report, index) => `
            <tr>
                <td>${start + index + 1}</td>
                <td>${T(report.room)}</td>
                <td>${formatNumber(report.kwh)} kWh</td>
                <td>
                    <span class="status ${report.status.toLowerCase()}">
                        ${T(report.status)}
                    </span>
                </td>
            </tr>
        `).join('');

    } else {

        $('rows').innerHTML = `
            <tr>
                <td colspan="4" class="empty">
                    ${T('Tidak ada data laporan yang sesuai.')}
                </td>
            </tr>
        `;

    }

    $('pageCount').textContent =
        `${page} / ${totalPages}`;

    $('back').disabled = page <= 1;
    $('next').disabled = page >= totalPages;
}

/* =================================
   TOMBOL TAMPILKAN
================================= */

$('showBtn').addEventListener('click', () => {
    isFiltered = true; // Tandai bahwa tombol Tampilkan sudah diklik
    activeFilter.month = $('month').value;
    activeFilter.year = $('year').value;
    activeFilter.status = $('statusFilter').value;

    page = 1;
    render();

    var pesan = T('Laporan berhasil ditampilkan.');

    if (typeof tampilkanPesanSimpan === 'function') {
        tampilkanPesanSimpan(pesan);
    } else {
        notify(pesan);
    }
});

/* =================================
   PENCARIAN
================================= */

$('search').addEventListener('input', () => {
    page = 1;
    render();
});

/* =================================
   PAGINATION
================================= */

$('back').addEventListener('click', () => {
    if (page > 1) {
        page--;
        render();
    }
});

$('next').addEventListener('click', () => {
    const totalPages = Math.max(
        1,
        Math.ceil(filteredReports().length / perPage)
    );

    if (page < totalPages) {
        page++;
        render();
    }
});

/* =================================
   CETAK PDF
================================= */

$('pdfBtn').addEventListener('click', () => {
    window.print();
});

/* =================================
   HAMBURGER SIDEBAR
================================= */

(function () {
    var menuBtn = document.getElementById('menuBtn');
    var sidebar = document.getElementById('sidebar');

    if (!menuBtn || !sidebar) return;

    menuBtn.addEventListener('click', function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        sidebar.classList.toggle('collapsed');

        menuBtn.setAttribute(
            'aria-expanded',
            sidebar.classList.contains('collapsed') ? 'false' : 'true'
        );
    }, true);
})();

/* =================================
   DROPDOWN PROFIL
================================= */

(function () {
    var profileBtn = document.getElementById('profileBtn');
    var profileMenu = document.getElementById('profileMenu');

    if (!profileBtn || !profileMenu) return;

    function setProfileMenu(open) {
        profileMenu.hidden = !open;
        profileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    profileBtn.addEventListener('click', function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        setProfileMenu(profileMenu.hidden);
    }, true);

    document.addEventListener('click', function (event) {
        if (!profileMenu.contains(event.target) && !profileBtn.contains(event.target)) {
            setProfileMenu(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setProfileMenu(false);
        }
    });
})();

/* =================================
   DATA AWAL
================================= */

render();