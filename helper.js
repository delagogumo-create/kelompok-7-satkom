// Format angka ribuan gaya Indonesia: 1590 -> "1.590"
function formatAngka(angka) {
    return angka.toLocaleString('id-ID');
}

// Jumlah semua nilai dalam array
function hitungTotal(daftarAngka) {
    return daftarAngka.reduce(function (jumlah, nilai) {
        return jumlah + nilai;
    }, 0);
}

// Rata-rata semua nilai dalam array
function hitungRataRata(daftarAngka) {
    if (daftarAngka.length === 0) return 0;
    return hitungTotal(daftarAngka) / daftarAngka.length;
}
// Format jadi Rupiah: 50000 -> "Rp 50.000"
function formatRupiah(angka) {
    if (angka === null || angka === undefined || isNaN(angka)) return "Rp 0";
    return "Rp " + Number(angka).toLocaleString('id-ID');
}

// Cek email valid atau tidak: "andi@gmail.com" -> true, "andi@" -> false
function validasiEmail(email) {
    if (!email) return false;
    const pola = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pola.test(email);
}

// Cek input kosong atau tidak: "" -> true, "andi" -> false
function isKosong(teks) {
    if (teks === null || teks === undefined) return true;
    return String(teks).trim() === "";
}

// Format tanggal: "2026-11-11" -> "11 November 2026"
function formatTanggal(tanggal) {
    if (!tanggal) return "-";
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
// ==========================================
// PENGATURAN GLOBAL (tema, huruf, bahasa, sidebar)
// ==========================================
(function () {
    const KEY = (function () {
        const cocok = window.location.pathname.match(/\/pages\/(admin|operator|pimpinan)\//);
        return cocok
            ? 'pengaturan' + cocok[1].charAt(0).toUpperCase() + cocok[1].slice(1)
            : 'pengaturanAdmin';
    })();
    const DEFAULT = { bahasa: 'id', tema: 'terang', huruf: 'sedang', sidebarOtomatis: true };
    const UKURAN = { kecil: 14, sedang: 16, besar: 18 };
    
    // ---------- Kamus Indonesia -> Inggris (tambahkan pasangan lain di sini) ----------
    const KAMUS = {
        
        // Menu & umum
        'Dashboard': 'Dashboard', 'Data Ruangan': 'Room Data', 'Data Tagihan': 'Billing Data',
        'Edit User': 'Edit User', 'Edit Profil': 'Edit Profile', 'Laporan': 'Reports',
        'Pengaturan': 'Settings', 'Keluar': 'Log Out', 'Admin': 'Admin',
        'Sistem Konsumsi Listrik': 'Electricity Consumption System',
        'Batal': 'Cancel', 'Simpan': 'Save', 'Cari': 'Search', 'Tambah': 'Add',
        'Edit': 'Edit', 'Hapus': 'Delete', 'Aksi': 'Actions',
        // Halaman Pengaturan
        'Atur bahasa dan tampilan aplikasi': 'Set the language and appearance of the app',
        'Bahasa': 'Language', 'Bahasa Indonesia': 'Indonesian', 'Bahasa Inggris': 'English',
        'Tema': 'Theme', 'Pilih warna tampilan aplikasi': 'Choose the app color theme',
        'Terang': 'Light', 'Gelap': 'Dark',
        'Ukuran Huruf': 'Font Size', 'Atur besar teks agar nyaman dibaca': 'Adjust text size for comfortable reading',
        'Kecil': 'Small', 'Sedang': 'Medium', 'Besar': 'Large',
        'Sidebar terbuka otomatis': 'Sidebar opens automatically',
        'Tampilkan menu samping secara penuh saat halaman dibuka': 'Show the full side menu when the page opens',
        'Simpan Pengaturan': 'Save Settings',
        'Pengaturan Admin berhasil disimpan.': 'Admin settings saved successfully.',
        // Edit User / Edit Profil
        'Perbarui data akun dan kata sandi Anda': 'Update your account data and password',
        'Informasi Akun': 'Account Information', 'Nama Lengkap': 'Full Name', 'Email': 'Email',
        'No. Telepon': 'Phone Number', 'Jabatan': 'Position', 'Administrator': 'Administrator',
        'Masukkan Kata Sandi': 'Enter Password', 'Kata Sandi Baru': 'New Password',
        'Konfirmasi Kata Sandi': 'Confirm Password', 'Ganti Foto': 'Change Photo',
        'Format JPG atau PNG, maksimal 2 MB': 'JPG or PNG format, maximum 2 MB',
        'Simpan Perubahan': 'Save Changes',
        'Masukkan nama lengkap': 'Enter full name', 'Masukkan nomor telepon': 'Enter phone number',
        'Minimal 8 karakter': 'Minimum 8 characters', 'Ulangi kata sandi baru': 'Repeat new password',
        // Data Ruangan
        'Nama Ruangan': 'Room Name', 'Jml AC': 'AC Count', 'Jml Lampu': 'Lamp Count',
        // Pop-up keluar
        'Keluar dari akun?': 'Log out of your account?',
        'Anda harus masuk kembali untuk mengakses sistem.': 'You will need to log in again to access the system.',
        'Ya, Keluar': 'Yes, Log Out'
    };

    // ---------- Baca / simpan ----------
    function normalisasi(o) {
        o = o || {};
        return {
            bahasa: /^en|english|inggris/i.test(String(o.bahasa)) ? 'en' : 'id',
            tema: o.tema === 'gelap' ? 'gelap' : 'terang',
            huruf: UKURAN[o.huruf] ? o.huruf : 'sedang',
            sidebarOtomatis: o.sidebarOtomatis !== false
        };
    }
    function muat() {
        try { return normalisasi(JSON.parse(localStorage.getItem(KEY))); }
        catch (e) { return Object.assign({}, DEFAULT); }
    }
    function simpan(p) { localStorage.setItem(KEY, JSON.stringify(normalisasi(p))); }

    // ---------- CSS mode gelap ----------
    const G = ':root[data-tema="gelap"]';
    const style = document.createElement('style');
    style.textContent = `
    ${G} { color-scheme: dark; }
    ${G} body { background:#0b1220 !important; color:#e5e7eb; }
    ${G} main, ${G} [class*="content"], ${G} [class*="wrapper"], ${G} [class*="container"] { background:#0b1220 !important; }
    ${G} .topbar, ${G} header { background:#111827 !important; border-color:#1f2937 !important; }
    ${G} [class*="card"], ${G} [class*="panel"], ${G} [class*="box"], ${G} section,
    ${G} table, ${G} .keluar-kotak { background:#111827 !important; border-color:#1f2937 !important; }
    ${G} h1, ${G} h2, ${G} h3, ${G} h4, ${G} label, ${G} th, ${G} td,
    ${G} strong, ${G} b, ${G} .keluar-judul { color:#f3f4f6 !important; }
    ${G} p, ${G} small, ${G} .keluar-teks { color:#9ca3af !important; }
    ${G} input, ${G} select, ${G} textarea { background:#0f172a !important; color:#e5e7eb !important; border-color:#334155 !important; }
    ${G} input:disabled { background:#1e293b !important; color:#94a3b8 !important; }
    ${G} input::placeholder { color:#64748b; }
    ${G} th, ${G} td, ${G} hr { border-color:#1f2937 !important; }
    ${G} [class*="segment"], ${G} [class*="seg-"] { background:#1e293b !important; }
    ${G} .btn-batal, ${G} .keluar-batal { background:#1e293b !important; color:#e5e7eb !important; border-color:#334155 !important; }
    ${G} #profileMenu { background:#111827 !important; border-color:#1f2937 !important; }
    `;
    document.head.appendChild(style);

    // ---------- Bahasa ----------
    let bahasaAktif = 'id';
    const asli = new WeakMap();

    function kumpulTeks(root) {
        if (root.nodeType === 3) return [root];
        if (root.nodeType !== 1) return [];
        const hasil = [];
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(n) {
                const p = n.parentNode;
                if (!p || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(p.nodeName)) return NodeFilter.FILTER_REJECT;
                return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });
        while (w.nextNode()) hasil.push(w.currentNode);
        return hasil;
    }

    function proses(root) {
        kumpulTeks(root).forEach(function (n) {
            if (!asli.has(n)) asli.set(n, n.nodeValue);
            const awal = asli.get(n);
            const kunci = awal.trim();
            n.nodeValue = (bahasaAktif === 'en' && KAMUS[kunci]) ? awal.replace(kunci, KAMUS[kunci]) : awal;
        });
        if (root.nodeType === 1) {
            const daftar = root.matches('[placeholder]') ? [root] : [];
            root.querySelectorAll('[placeholder]').forEach(function (e) { daftar.push(e); });
            daftar.forEach(function (e) {
                if (e.dataset.phAsli === undefined) e.dataset.phAsli = e.getAttribute('placeholder');
                const k = e.dataset.phAsli;
                e.setAttribute('placeholder', (bahasaAktif === 'en' && KAMUS[k]) ? KAMUS[k] : k);
            });
        }
    }

    function terapkanBahasa(b) {
        bahasaAktif = b;
        document.documentElement.lang = b;
        if (document.body) proses(document.body);
    }

    function t(teks) { return (bahasaAktif === 'en' && KAMUS[teks]) ? KAMUS[teks] : teks; }

    // ---------- Tema + huruf + bahasa (boleh dipakai untuk pratinjau) ----------
    function terapkanTampilan(p) {
        const h = document.documentElement;
        h.setAttribute('data-tema', p.tema);
        h.setAttribute('data-huruf', p.huruf);
        h.style.fontSize = UKURAN[p.huruf] + 'px';

        if (document.body) {
            document.body.classList.toggle('dark-theme', p.tema === 'gelap');
            document.body.classList.remove('font-small', 'font-medium', 'font-large');
            document.body.classList.add({ kecil: 'font-small', sedang: 'font-medium', besar: 'font-large' }[p.huruf]);
        }
        terapkanBahasa(p.bahasa);
    }

    function terapkanSidebar(p) {
        if (document.body) document.body.classList.toggle('nav-collapsed', p.sidebarOtomatis === false);
    }

    function terapkan(p) { terapkanTampilan(p); terapkanSidebar(p); }

    // ---------- Jalan otomatis di setiap halaman ----------
    const awal = muat();
    document.documentElement.setAttribute('data-tema', awal.tema);
    document.documentElement.style.fontSize = UKURAN[awal.huruf] + 'px';

    function mulai() {
        terapkan(awal);
        // terjemahkan juga konten yang dibuat lewat JavaScript (misal pop-up keluar, tabel)
        new MutationObserver(function (daftar) {
            if (bahasaAktif !== 'en') return;
            daftar.forEach(function (m) { m.addedNodes.forEach(proses); });
        }).observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mulai);
    else mulai();

    window.Pengaturan = { muat: muat, simpan: simpan, terapkan: terapkan, terapkanTampilan: terapkanTampilan, t: t };
})();