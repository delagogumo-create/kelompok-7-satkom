// =====================================================
// EDIT PROFIL PIMPINAN
// Halaman ini punya kode sidebar, dropdown, dan tombol Keluar sendiri,
// jadi diatur di file ini.
// =====================================================

// ===== Proteksi halaman: harus login sebagai pimpinan =====
try {
    const pengguna = JSON.parse(sessionStorage.getItem('pengguna'));
    if (!pengguna || pengguna.peran !== 'pimpinan') throw new Error();
} catch (error) {
    window.location.replace('../auth/login.php');
}

// ===== Ikon mata =====
const IKON_MATA =
    '<svg class="i" viewBox="0 0 24 24">' +
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
    '<circle cx="12" cy="12" r="3"/>' +
    '</svg>';

const IKON_MATA_CORET =
    '<svg class="i" viewBox="0 0 24 24">' +
    '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>' +
    '<path d="M1 1l22 22"/>' +
    '</svg>';

// ===== Ikon notifikasi dan pop-up =====
const IKON_TOAST_OK =
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l3 3 5-6"/></svg>';
const IKON_TOAST_ERROR =
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>';
const IKON_POPUP_HAPUS =
    '<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/><path d="M10 11v6M14 11v6"/>';

// ===== Gaya notifikasi dan pop-up hapus =====
const gayaProfil = document.createElement('style');
gayaProfil.textContent = `
    .toast-profil {
        position: fixed;
        top: 18px;
        left: 50%;
        z-index: 4000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: calc(100% - 32px);
        padding: 12px 20px;
        border-radius: 12px;
        background: #dcfce7;
        border: 1px solid #86efac;
        color: #166534;
        font: 600 14px/1.4 Inter, Arial, sans-serif;
        box-shadow: 0 10px 26px rgba(15, 42, 67, .18);
        opacity: 0;
        transform: translateX(-50%) translateY(-24px);
        transition: opacity .25s ease, transform .25s ease;
        pointer-events: none;
    }
    .toast-profil.tampil {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    .toast-profil.error {
        background: #fee2e2;
        border-color: #fca5a5;
        color: #991b1b;
    }
    .toast-profil svg {
        width: 22px;
        height: 22px;
        flex: none;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .popup-back {
        position: fixed;
        inset: 0;
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: rgba(15, 42, 67, .55);
        backdrop-filter: blur(3px);
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease;
    }
    .popup-back.tampil {
        opacity: 1;
        pointer-events: auto;
    }
    .popup-kotak {
        width: 100%;
        max-width: 380px;
        padding: 28px 26px 22px;
        border-radius: 16px;
        background: #fff;
        text-align: center;
        font-family: Inter, Arial, sans-serif;
        box-shadow: 0 20px 50px rgba(15, 42, 67, .3);
        transform: translateY(14px) scale(.96);
        transition: transform .22s ease;
    }
    .popup-back.tampil .popup-kotak {
        transform: translateY(0) scale(1);
    }
    .popup-ikon {
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
    .popup-ikon svg {
        width: 30px;
        height: 30px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .popup-judul {
        margin: 0 0 8px;
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
    }
    .popup-teks {
        margin: 0 0 22px;
        font-size: 14px;
        line-height: 1.5;
        color: #64748b;
    }
    .popup-aksi {
        display: flex;
        gap: 10px;
    }
    .popup-aksi button {
        flex: 1;
        padding: 12px 0;
        border: 0;
        border-radius: 10px;
        font: 600 14px Inter, Arial, sans-serif;
        cursor: pointer;
        transition: transform .15s ease, background .15s ease;
    }
    .popup-aksi button:active {
        transform: scale(.97);
    }
    .popup-batal {
        background: #f1f5f9;
        color: #334155;
    }
    .popup-batal:hover {
        background: #e2e8f0;
    }
    .popup-ya {
        background: #dc2626;
        color: #fff;
    }
    .popup-ya:hover {
        background: #b91c1c;
    }
`;
document.head.appendChild(gayaProfil);

// ===== Gaya pesan merah per kolom =====
const gayaValidasi = document.createElement('style');
gayaValidasi.textContent = `
    .form-card .field small.pesan-kolom {
        display: none;
        margin-top: 6px;
        color: #dc2626;
        font: 400 13px/1.3 "Segoe UI", Arial, sans-serif;
    }
    .form-card .field.invalid small.pesan-kolom { display: block; }

    /* Pesan bantuan di bawah kolom disembunyikan selama kolomnya salah */
    .form-card .field.invalid .field-msg { display: none; }

    .form-card .field.invalid input { border-color: #dc2626 !important; }

    body.dark-theme .form-card .field small.pesan-kolom { color: #f87171; }
    body.dark-theme .form-card .field.invalid input { border-color: #f87171 !important; }
`;
document.head.appendChild(gayaValidasi);

// ===== Notifikasi singkat (hilang sendiri setelah 3 detik) =====
let timerToast = null;

function tampilkanToast(pesan, isError) {
    let toast = document.getElementById('toastProfil');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastProfil';
        toast.className = 'toast-profil';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
    }

    toast.classList.toggle('error', !!isError);
    toast.innerHTML = (isError ? IKON_TOAST_ERROR : IKON_TOAST_OK) + '<span></span>';
    toast.querySelector('span').textContent = pesan;

    requestAnimationFrame(function () {
        toast.classList.add('tampil');
    });

    clearTimeout(timerToast);
    timerToast = setTimeout(function () {
        toast.classList.remove('tampil');
    }, 3000);
}

// ===== Pesan error merah per kolom =====
// Penanda: fokus yang datang dari kode (bukan dari pengguna)
let fokusDariKode = false;

function tampilkanError(el, teks) {
    const field = el.closest('.field');
    field.classList.add('invalid');
    field.querySelector('.pesan-kolom').textContent = teks;
}

function bersihkanError(el) {
    el.closest('.field').classList.remove('invalid');
}

function bersihkanSemuaError(daftar) {
    daftar.forEach(bersihkanError);
}

function fokuskan(el) {
    fokusDariKode = true;
    el.focus();
    fokusDariKode = false;
}

// Siapkan elemen pesan di bawah tiap kolom
function siapkanKolom(daftar) {
    daftar.forEach(function (el) {
        const pesan = document.createElement('small');
        pesan.className = 'pesan-kolom';
        pesan.setAttribute('role', 'alert');
        el.closest('.field').appendChild(pesan);

        // Pesan hilang begitu kolom diisi atau diklik
        el.addEventListener('input', function () { bersihkanError(el); });
        el.addEventListener('focus', function () {
            if (!fokusDariKode) bersihkanError(el);
        });
    });
}

// ===== Pop-up konfirmasi hapus foto =====
const popupBack = document.createElement('div');
popupBack.className = 'popup-back';
popupBack.innerHTML =
    '<div class="popup-kotak" role="dialog" aria-modal="true">' +
        '<div class="popup-ikon"><svg viewBox="0 0 24 24"></svg></div>' +
        '<h3 class="popup-judul"></h3>' +
        '<p class="popup-teks"></p>' +
        '<div class="popup-aksi">' +
            '<button type="button" class="popup-batal">Batal</button>' +
            '<button type="button" class="popup-ya"></button>' +
        '</div>' +
    '</div>';
document.body.appendChild(popupBack);

const popupIkon = popupBack.querySelector('.popup-ikon svg');
const popupJudul = popupBack.querySelector('.popup-judul');
const popupTeks = popupBack.querySelector('.popup-teks');
const popupBatal = popupBack.querySelector('.popup-batal');
const popupYa = popupBack.querySelector('.popup-ya');
let aksiPopup = null;

function tutupPopup() {
    popupBack.classList.remove('tampil');
    aksiPopup = null;
}

function tampilkanKonfirmasi(opsi) {
    popupIkon.innerHTML = opsi.ikon;
    popupJudul.textContent = opsi.judul;
    popupTeks.textContent = opsi.pesan;
    popupYa.textContent = opsi.tombolYa;
    aksiPopup = opsi.onYa;
    popupBack.classList.add('tampil');
    popupBatal.focus();
}

popupBatal.addEventListener('click', tutupPopup);

popupYa.addEventListener('click', function () {
    const jalankan = aksiPopup;
    tutupPopup();
    if (jalankan) jalankan();
});

popupBack.addEventListener('click', function (event) {
    if (event.target === popupBack) tutupPopup();
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') tutupPopup();
});

// ===== Dropdown profil =====
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');

profileBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    profileMenu.hidden = !profileMenu.hidden;
    profileBtn.setAttribute('aria-expanded', profileMenu.hidden ? 'false' : 'true');
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

// ===== Menu Pengaturan (halaman belum tersedia) =====
// Hapus blok ini kalau pages/pimpinan/pengaturan.php sudah dibuat.
const menuPengaturan = document.getElementById('menuPengaturan');
if (menuPengaturan) {
    menuPengaturan.addEventListener('click', function (event) {
        event.preventDefault();
        tampilkanToast('Halaman pengaturan belum tersedia.', true);
    });
}

// ===== Hamburger sidebar =====
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', function () {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    menuBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
});

// ===== Lihat / sembunyikan kata sandi (ikon mata) =====
document.querySelectorAll('.toggle-pass').forEach(function (btn) {
    btn.addEventListener('click', function () {
        const input = document.getElementById(btn.dataset.target);
        const show = input.type === 'password';

        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? IKON_MATA_CORET : IKON_MATA;
        btn.setAttribute(
            'aria-label',
            show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
        );
    });
});

// ===== Ganti foto profil =====
const photoInput = document.getElementById('photoInput');
const avatarLg = document.getElementById('avatarLg');
const topAvatar = document.getElementById('topAvatar');
const btnRemovePhoto = document.getElementById('btnRemovePhoto');
const photoMsg = document.getElementById('photoMsg');

const defaultAvatarLg = avatarLg.innerHTML;
const defaultTopAvatar = topAvatar.innerHTML;

// ----- Penyimpanan foto (per pengguna, di browser) -----
function kunciFoto() {
    try {
        const p = JSON.parse(sessionStorage.getItem('pengguna'));
        return 'fotoProfil_' + (p && p.username ? p.username : 'pimpinan');
    } catch (error) {
        return 'fotoProfil_pimpinan';
    }
}

function ambilFotoTersimpan() {
    try {
        return localStorage.getItem(kunciFoto());
    } catch (error) {
        return null;
    }
}

function simpanFoto(dataUrl) {
    try {
        localStorage.setItem(kunciFoto(), dataUrl);
        return true;
    } catch (error) {
        return false;
    }
}

function hapusFotoTersimpan() {
    try {
        localStorage.removeItem(kunciFoto());
    } catch (error) {
        // abaikan
    }
}

// Perkecil foto (maks. 300 px) supaya muat di penyimpanan browser
function kecilkanFoto(dataUrl, selesai) {
    const img = new Image();

    img.onload = function () {
        const maks = 300;
        const skala = Math.min(1, maks / Math.max(img.width, img.height));
        const kanvas = document.createElement('canvas');
        kanvas.width = Math.round(img.width * skala);
        kanvas.height = Math.round(img.height * skala);

        const ctx = kanvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, kanvas.width, kanvas.height);
        ctx.drawImage(img, 0, 0, kanvas.width, kanvas.height);

        selesai(kanvas.toDataURL('image/jpeg', 0.85));
    };

    img.onerror = function () { selesai(dataUrl); };
    img.src = dataUrl;
}

function pasangFoto(src) {
    [avatarLg, topAvatar].forEach(function (el) {
        el.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Foto profil Pimpinan';
        el.appendChild(img);
    });
}

// Tulisan di bawah foto dikosongkan, pesan tampil sebagai notifikasi di atas
function showPhotoMsg(text, isError) {
    photoMsg.textContent = '';
    photoMsg.className = 'photo-msg';
    tampilkanToast(text, isError);
}

// Saat halaman dibuka: tampilkan foto yang sudah tersimpan
const fotoTersimpan = ambilFotoTersimpan();
if (fotoTersimpan) {
    pasangFoto(fotoTersimpan);
    btnRemovePhoto.hidden = false;
}

document.getElementById('btnChoosePhoto').addEventListener('click', function () {
    photoInput.click();
});

photoInput.addEventListener('change', function () {

    const file = this.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showPhotoMsg('Silakan pilih gambar JPG atau PNG.', true);
        this.value = '';
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showPhotoMsg('Ukuran foto maksimal 2 MB.', true);
        this.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        kecilkanFoto(event.target.result, function (hasil) {
            pasangFoto(hasil);
            btnRemovePhoto.hidden = false;

            if (simpanFoto(hasil)) {
                showPhotoMsg('Foto profil berhasil diganti.', false);
            } else {
                showPhotoMsg('Foto diganti, tetapi gagal disimpan di browser.', true);
            }
        });
    };

    reader.readAsDataURL(file);

});

btnRemovePhoto.addEventListener('click', function () {
    tampilkanKonfirmasi({
        ikon: IKON_POPUP_HAPUS,
        judul: 'Hapus foto profil?',
        pesan: 'Foto profil akan dikembalikan ke gambar bawaan.',
        tombolYa: 'Ya, Hapus',
        onYa: function () {
            avatarLg.innerHTML = defaultAvatarLg;
            topAvatar.innerHTML = defaultTopAvatar;
            photoInput.value = '';
            btnRemovePhoto.hidden = true;
            hapusFotoTersimpan();
            showPhotoMsg('Foto profil berhasil dihapus.', false);
        }
    });
});

// ===== Ganti username =====
const usernameForm = document.getElementById('usernameForm');
const usernameLama = document.getElementById('usernameLama');
const usernameBaru = document.getElementById('usernameBaru');
const usernamePass = document.getElementById('usernamePass');
const usernameHelp = document.getElementById('usernameHelp');
const usernameRegex = /^[A-Za-z0-9._]{4,20}$/;
const usernameHelpDefault = usernameHelp.textContent;

const kolomUsername = [usernameBaru, usernamePass];
siapkanKolom(kolomUsername);

usernameBaru.addEventListener('input', function () {
    const v = this.value.trim();

    if (!v) {
        usernameHelp.textContent = usernameHelpDefault;
        usernameHelp.className = 'field-msg';
    } else if (!usernameRegex.test(v)) {
        usernameHelp.textContent = 'Username 4–20 karakter: huruf, angka, titik, atau garis bawah.';
        usernameHelp.className = 'field-msg error';
    } else {
        usernameHelp.textContent = 'Username dapat digunakan.';
        usernameHelp.className = 'field-msg ok';
    }
});

usernameForm.addEventListener('reset', function () {
    usernameHelp.textContent = usernameHelpDefault;
    usernameHelp.className = 'field-msg';
    bersihkanSemuaError(kolomUsername);
});

usernameForm.addEventListener('submit', function (event) {

    event.preventDefault();
    bersihkanSemuaError(kolomUsername);

    let pertama = null;

    function salah(el, teks) {
        tampilkanError(el, teks);
        if (!pertama) pertama = el;
    }

    const usernameDiisi = usernameBaru.value.trim();

    if (usernameDiisi === '') {
        salah(usernameBaru, 'Username baru wajib diisi.');
    } else if (!usernameRegex.test(usernameDiisi)) {
        salah(usernameBaru, 'Username harus 4–20 karakter: huruf, angka, titik, atau garis bawah.');
    } else if (usernameDiisi.toLowerCase() === usernameLama.value.toLowerCase()) {
        salah(usernameBaru, 'Username baru tidak boleh sama dengan username saat ini.');
    }

    if (usernamePass.value === '') {
        salah(usernamePass, 'Kata sandi wajib diisi.');
    }

    if (pertama) {
        fokuskan(pertama);
        return;
    }

    usernameLama.value = usernameDiisi;
    document.querySelector('.profile-card .role').textContent = '@' + usernameDiisi;
    usernameForm.reset();
    tampilkanToast('Username berhasil diganti.', false);

});

// ===== Ganti kata sandi =====
const passwordForm = document.getElementById('passwordForm');
const inputLama = document.getElementById('lama');
const baru = document.getElementById('baru');
const konfirmasi = document.getElementById('konfirmasi');
const strength = document.getElementById('strength');
const strengthText = document.getElementById('strengthText');
const confirmText = document.getElementById('confirmText');
const strengthDefault = strengthText.textContent;

const kolomPassword = [inputLama, baru, konfirmasi];
siapkanKolom(kolomPassword);

function hitungKekuatan(p) {
    let skor = 0;
    if (p.length >= 8) skor++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) skor++;
    if (/\d/.test(p)) skor++;
    if (/[^A-Za-z0-9]/.test(p)) skor++;
    return skor;
}

function cekKonfirmasi() {
    if (!konfirmasi.value) {
        confirmText.textContent = '';
        confirmText.className = 'field-msg';
    } else if (konfirmasi.value !== baru.value) {
        confirmText.textContent = 'Kata sandi tidak sama.';
        confirmText.className = 'field-msg error';
    } else {
        confirmText.textContent = 'Kata sandi cocok.';
        confirmText.className = 'field-msg ok';
    }
}

baru.addEventListener('input', function () {
    const labels = ['Sangat lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat'];
    const skor = this.value ? hitungKekuatan(this.value) : 0;

    strength.dataset.level = this.value ? skor : 0;
    strengthText.textContent = this.value ? 'Kekuatan: ' + labels[skor] : strengthDefault;
    cekKonfirmasi();
});

konfirmasi.addEventListener('input', cekKonfirmasi);

passwordForm.addEventListener('reset', function () {
    strength.dataset.level = 0;
    strengthText.textContent = strengthDefault;
    confirmText.textContent = '';
    confirmText.className = 'field-msg';
    bersihkanSemuaError(kolomPassword);

    document.querySelectorAll('#passwordForm .toggle-pass').forEach(function (b) {
        document.getElementById(b.dataset.target).type = 'password';
        b.innerHTML = IKON_MATA;
        b.setAttribute('aria-label', 'Tampilkan kata sandi');
    });
});

passwordForm.addEventListener('submit', function (event) {

    event.preventDefault();
    bersihkanSemuaError(kolomPassword);

    let pertama = null;

    function salah(el, teks) {
        tampilkanError(el, teks);
        if (!pertama) pertama = el;
    }

    // Kata sandi lama
    if (inputLama.value === '') {
        salah(inputLama, 'Kata sandi lama wajib diisi.');
    }

    // Kata sandi baru
    if (baru.value === '') {
        salah(baru, 'Kata sandi baru wajib diisi.');
    } else if (baru.value.length < 8) {
        salah(baru, 'Kata sandi baru minimal 8 karakter.');
    } else if (inputLama.value !== '' && baru.value === inputLama.value) {
        salah(baru, 'Kata sandi baru tidak boleh sama dengan kata sandi lama.');
    }

    // Konfirmasi
    if (konfirmasi.value === '') {
        salah(konfirmasi, 'Konfirmasi kata sandi wajib diisi.');
    } else if (baru.value !== '' && baru.value !== konfirmasi.value) {
        salah(konfirmasi, 'Konfirmasi kata sandi tidak sesuai.');
    }

    if (pertama) {
        fokuskan(pertama);
        return;
    }

    passwordForm.reset();
    tampilkanToast('Kata sandi berhasil diganti.', false);

});

// ===== Keluar =====
document.getElementById('logout').addEventListener('click', function (event) {
    event.preventDefault();
});

// ==========================================
// POP-UP KONFIRMASI KELUAR
// ==========================================
(function () {
    const HALAMAN_LOGIN = '../auth/login.php';
    const PESAN_KELUAR = 'Berhasil keluar.';

    const gayaKeluar = document.createElement('style');
    gayaKeluar.textContent = `
        .keluar-back {
            position: fixed;
            inset: 0;
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(15, 42, 67, .55);
            backdrop-filter: blur(3px);
            opacity: 0;
            pointer-events: none;
            transition: opacity .2s ease;
        }
        .keluar-back.tampil {
            opacity: 1;
            pointer-events: auto;
        }
        .keluar-kotak {
            width: 100%;
            max-width: 380px;
            padding: 28px 26px 22px;
            border-radius: 16px;
            background: #fff;
            text-align: center;
            font-family: Inter, Arial, sans-serif;
            box-shadow: 0 20px 50px rgba(15, 42, 67, .3);
            transform: translateY(14px) scale(.96);
            transition: transform .22s ease;
        }
        .keluar-back.tampil .keluar-kotak {
            transform: translateY(0) scale(1);
        }
        .keluar-ikon {
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
        .keluar-ikon svg {
            width: 30px;
            height: 30px;
            stroke: currentColor;
            fill: none;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        .keluar-judul {
            margin: 0 0 8px;
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
        }
        .keluar-teks {
            margin: 0 0 22px;
            font-size: 14px;
            line-height: 1.5;
            color: #64748b;
        }
        .keluar-aksi {
            display: flex;
            gap: 10px;
        }
        .keluar-aksi button {
            flex: 1;
            padding: 12px 0;
            border: 0;
            border-radius: 10px;
            font: 600 14px Inter, Arial, sans-serif;
            cursor: pointer;
            transition: transform .15s ease, background .15s ease;
        }
        .keluar-aksi button:active {
            transform: scale(.97);
        }
        .keluar-batal {
            background: #f1f5f9;
            color: #334155;
        }
        .keluar-batal:hover {
            background: #e2e8f0;
        }
        .keluar-ya {
            background: #dc2626;
            color: #fff;
        }
        .keluar-ya:hover {
            background: #b91c1c;
        }
    `;
    document.head.appendChild(gayaKeluar);

    const popup = document.createElement('div');
    popup.className = 'keluar-back';
    popup.innerHTML = `
        <div class="keluar-kotak" role="dialog" aria-modal="true" aria-labelledby="keluarJudul">
            <div class="keluar-ikon">
                <svg viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
            </div>
            <h3 class="keluar-judul" id="keluarJudul">Keluar dari akun?</h3>
            <p class="keluar-teks">Anda harus masuk kembali untuk mengakses sistem.</p>
            <div class="keluar-aksi">
                <button type="button" class="keluar-batal">Batal</button>
                <button type="button" class="keluar-ya">Ya, Keluar</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);

    const btnBatal = popup.querySelector('.keluar-batal');
    const btnYa = popup.querySelector('.keluar-ya');

    function buka() {
        popup.classList.add('tampil');
        btnBatal.focus();
    }

    function tutup() {
        popup.classList.remove('tampil');
    }

    function keluar() {
        sessionStorage.removeItem('pengguna');
        sessionStorage.setItem('pesanFlash', PESAN_KELUAR);   // ditampilkan oleh login.js
        window.location.href = HALAMAN_LOGIN;
    }

    function cariTombolKeluar(target) {
        const pemicu = target.closest('#btnKeluar, #tombolKeluar, .btn-keluar, .logout, [data-logout], a, button');
        if (!pemicu || popup.contains(pemicu)) return null;

        if (pemicu.matches('#btnKeluar, #tombolKeluar, .btn-keluar, .logout, [data-logout]')) return pemicu;
        if (pemicu.textContent.trim().toLowerCase() === 'keluar') return pemicu;
        return null;
    }

    // Fase capture: berjalan lebih dulu, jadi confirm() lama tidak ikut jalan
    document.addEventListener('click', function (e) {
        if (!cariTombolKeluar(e.target)) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        buka();
    }, true);

    btnBatal.addEventListener('click', tutup);
    btnYa.addEventListener('click', keluar);

    popup.addEventListener('click', function (e) {
        if (e.target === popup) tutup();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') tutup();
    });
})();
// ==========================================
// PERBAIKAN LINK PENGATURAN
// ==========================================
document.addEventListener('click', function (e) {

    var link = e.target.closest('.dropdown a, #profileMenu a, #user-dropdown a');
    if (!link) return;

    var teks = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();

    if (teks === 'settings' || teks === 'pengaturan') {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.href = 'pengaturan.php';
    }

}, true);