// ===== Elemen =====
const formReset = document.getElementById('resetForm');
const inputIdentitas = document.getElementById('identity');
const pesanError = document.getElementById('errorMsg');
const blokSukses = document.getElementById('successBlock');
const teksIntro = document.querySelector('.intro');
const tombolKirim = formReset.querySelector('button[type="submit"]');

// ===== Pesan error =====
function tampilkanError(pesan) {
    pesanError.textContent = pesan;
    pesanError.classList.add('show');
    inputIdentitas.classList.add('invalid');
}

function sembunyikanError() {
    pesanError.classList.remove('show');
    inputIdentitas.classList.remove('invalid');
}

// ===== Validasi =====
function formatEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validasiIdentitas() {
    const nilai = inputIdentitas.value.trim();

    if (nilai === '') {
        tampilkanError('Harap masukkan username atau email Anda.');
        return false;
    }

    // Kalau mengandung @, anggap email dan cek formatnya
    if (nilai.includes('@') && !formatEmailValid(nilai)) {
        tampilkanError('Format email tidak valid.');
        return false;
    }

    return true;
}

// ===== Tampilan sukses =====
function tampilkanSukses() {
    formReset.style.display = 'none';
    teksIntro.style.display = 'none';
    blokSukses.classList.add('show');
}

// ===== Proses kirim ke PHP & Database =====
async function prosesReset(event) {
    event.preventDefault();
    sembunyikanError();

    if (!validasiIdentitas()) return;

    const teksAsli = tombolKirim.textContent;
    tombolKirim.disabled = true;
    tombolKirim.textContent = 'MEMPROSES...';

    try {
        const formData = new FormData(formReset);
        const response = await fetch('lupa-password.php', {
            method: 'POST',
            body: formData
        });
        const hasil = await response.json();

        if (hasil.status !== 'sukses') {
            tampilkanError(hasil.pesan || 'Username atau email tidak terdaftar.');
            tombolKirim.disabled = false;
            tombolKirim.textContent = teksAsli;
            return;
        }

        tampilkanSukses();
    } catch (error) {
        tampilkanError('Gagal terhubung ke server.');
        tombolKirim.disabled = false;
        tombolKirim.textContent = teksAsli;
    }
}

// ===== Pasang event =====
formReset.addEventListener('submit', prosesReset);
inputIdentitas.addEventListener('input', sembunyikanError);