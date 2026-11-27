// =====================================================
// EDIT PROFIL (Koneksi Database MySQL)
// =====================================================

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

const IKON_TOAST_OK =
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l3 3 5-6"/></svg>';
const IKON_TOAST_ERROR =
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>';
const IKON_POPUP_HAPUS =
    '<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/><path d="M10 11v6M14 11v6"/>';

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

const gayaValidasi = document.createElement('style');
gayaValidasi.textContent = `
    .form-card .field small.pesan-kolom {
        display: none;
        margin-top: 6px;
        color: #dc2626;
        font: 400 13px/1.3 "Segoe UI", Arial, sans-serif;
    }
    .form-card .field.invalid small.pesan-kolom { display: block; }
    .form-card .field.invalid .field-msg { display: none; }
    .form-card .field.invalid input { border-color: #dc2626 !important; }
`;
document.head.appendChild(gayaValidasi);

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

function siapkanKolom(daftar) {
    daftar.forEach(function (el) {
        const pesan = document.createElement('small');
        pesan.className = 'pesan-kolom';
        pesan.setAttribute('role', 'alert');
        el.closest('.field').appendChild(pesan);

        el.addEventListener('input', function () { bersihkanError(el); });
        el.addEventListener('focus', function () {
            if (!fokusDariKode) bersihkanError(el);
        });
    });
}

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
popupBack.addEventListener('click', function (e) {
    if (e.target === popupBack) tutupPopup();
});

// Toggle password
document.querySelectorAll('.toggle-pass').forEach(function (btn) {
    btn.addEventListener('click', function () {
        const input = document.getElementById(btn.dataset.target);
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? IKON_MATA_CORET : IKON_MATA;
    });
});

// Ganti foto profil
const photoInput = document.getElementById('photoInput');
const avatarLg = document.getElementById('avatarLg');
const topAvatar = document.getElementById('topAvatar');
const btnRemovePhoto = document.getElementById('btnRemovePhoto');
const photoMsg = document.getElementById('photoMsg');

function pasangFoto(src) {
    [avatarLg, topAvatar].forEach(function (el) {
        el.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Foto profil';
        img.style.cssText = 'width:100%;height:100%;border-radius:50%;object-fit:cover;';
        el.appendChild(img);
    });
}

document.getElementById('btnChoosePhoto').addEventListener('click', function () {
    photoInput.click();
});

photoInput.addEventListener('change', async function () {
    const file = this.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        tampilkanToast('Format foto harus JPG atau PNG', true);
        this.value = '';
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        tampilkanToast('Ukuran foto maksimal 2 MB', true);
        this.value = '';
        return;
    }

    const formData = new FormData();
    formData.append('aksi', 'ganti_foto');
    formData.append('foto', file);

    try {
        const res = await fetch('edit-profil.php', { method: 'POST', body: formData });
        const hasil = await res.json();
        if (hasil.status === 'sukses') {
            pasangFoto(hasil.url);
            btnRemovePhoto.hidden = false;
            tampilkanToast(hasil.pesan, false);
        } else {
            tampilkanToast(hasil.pesan, true);
        }
    } catch (err) {
        tampilkanToast('Gagal mengunggah foto ke server', true);
    }
});

btnRemovePhoto.addEventListener('click', function () {
    tampilkanKonfirmasi({
        ikon: IKON_POPUP_HAPUS,
        judul: 'Hapus foto profil?',
        pesan: 'Foto profil akan dikembalikan ke gambar bawaan.',
        tombolYa: 'Ya, Hapus',
        onYa: async function () {
            const formData = new FormData();
            formData.append('aksi', 'hapus_foto');
            try {
                const res = await fetch('edit-profil.php', { method: 'POST', body: formData });
                const hasil = await res.json();
                if (hasil.status === 'sukses') {
                    location.reload();
                } else {
                    tampilkanToast(hasil.pesan, true);
                }
            } catch (err) {
                tampilkanToast('Gagal menghapus foto', true);
            }
        }
    });
});

// Ganti username
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
        usernameHelp.textContent = 'Username valid.';
        usernameHelp.className = 'field-msg ok';
    }
});

usernameForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    bersihkanSemuaError(kolomUsername);

    let pertama = null;
    function salah(el, teks) {
        tampilkanError(el, teks);
        if (!pertama) pertama = el;
    }

    const uBaru = usernameBaru.value.trim();
    if (uBaru === '') salah(usernameBaru, 'Username baru wajib diisi.');
    else if (!usernameRegex.test(uBaru)) salah(usernameBaru, 'Format username tidak valid.');

    if (usernamePass.value === '') salah(usernamePass, 'Kata sandi wajib diisi.');

    if (pertama) {
        fokuskan(pertama);
        return;
    }

    const formData = new FormData();
    formData.append('aksi', 'ganti_username');
    formData.append('username_baru', uBaru);
    formData.append('password_konfirmasi', usernamePass.value);

    try {
        const res = await fetch('edit-profil.php', { method: 'POST', body: formData });
        const hasil = await res.json();
        if (hasil.status === 'sukses') {
            tampilkanToast(hasil.pesan, false);
            setTimeout(() => location.reload(), 1500);
        } else {
            tampilkanToast(hasil.pesan, true);
        }
    } catch (err) {
        tampilkanToast('Gagal terhubung ke server', true);
    }
});

// Ganti kata sandi
const passwordForm = document.getElementById('passwordForm');
const inputLama = document.getElementById('lama');
const baru = document.getElementById('baru');
const konfirmasi = document.getElementById('konfirmasi');
const strength = document.getElementById('strength');
const strengthText = document.getElementById('strengthText');
const confirmText = document.getElementById('confirmText');

const kolomPassword = [inputLama, baru, konfirmasi];
siapkanKolom(kolomPassword);

passwordForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    bersihkanSemuaError(kolomPassword);

    let pertama = null;
    function salah(el, teks) {
        tampilkanError(el, teks);
        if (!pertama) pertama = el;
    }

    if (inputLama.value === '') salah(inputLama, 'Kata sandi lama wajib diisi.');
    if (baru.value === '') salah(baru, 'Kata sandi baru wajib diisi.');
    else if (baru.value.length < 8) salah(baru, 'Kata sandi minimal 8 karakter.');

    if (konfirmasi.value === '') salah(konfirmasi, 'Konfirmasi kata sandi wajib diisi.');
    else if (baru.value !== konfirmasi.value) salah(konfirmasi, 'Konfirmasi kata sandi tidak sesuai.');

    if (pertama) {
        fokuskan(pertama);
        return;
    }

    const formData = new FormData();
    formData.append('aksi', 'ganti_password');
    formData.append('password_lama', inputLama.value);
    formData.append('password_baru', baru.value);

    try {
        const res = await fetch('edit-profil.php', { method: 'POST', body: formData });
        const hasil = await res.json();
        if (hasil.status === 'sukses') {
            tampilkanToast(hasil.pesan, false);
            passwordForm.reset();
        } else {
            tampilkanToast(hasil.pesan, true);
        }
    } catch (err) {
        tampilkanToast('Gagal terhubung ke server', true);
    }
});