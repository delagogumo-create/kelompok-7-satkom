document.addEventListener('DOMContentLoaded', function () {
    // ===== Elemen =====
    const formLogin = document.getElementById('loginForm');
    if (!formLogin) return;

    const inputUsername = document.getElementById('username');
    const inputPassword = document.getElementById('password');
    const tombolMata = document.getElementById('togglePassword');
    const ikonMata = document.querySelector('.eye-icon');
    const tombolMasuk = formLogin.querySelector('button[type="submit"]');

    const JEDA_PROSES = 400;          
    const LAMA_BANNER_KELUAR = 2000;  

    const IKON_MATA_TERBUKA = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    `;
    const IKON_MATA_TERCORET = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    `;

    // ===== Gaya banner & animasi error =====
    const gayaTambahan = document.createElement('style');
    gayaTambahan.textContent = `
        .banner-sukses {
            position: fixed; top: 16px; left: 50%; transform: translateX(-50%) translateY(-20px);
            z-index: 2000; max-width: calc(100% - 32px); padding: 12px 22px; border-radius: 10px;
            background: #dcfce7; border: 1px solid #86efac; color: #166534; font: 600 14px/1.4 Inter, Arial, sans-serif;
            box-shadow: 0 8px 22px rgba(15, 42, 67, .15); opacity: 0; transition: opacity .2s ease, transform .2s ease;
        }
        .banner-sukses.tampil { opacity: 1; transform: translateX(-50%) translateY(0); }
        @keyframes tombolDenyut { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.98); opacity: .85; } }
        @keyframes tombolPutar { to { transform: rotate(360deg); } }
        .btn.memproses { cursor: progress; animation: tombolDenyut .8s ease-in-out infinite; }
        .btn.memproses::before {
            content: ""; display: inline-block; width: 14px; height: 14px; margin-right: 8px; vertical-align: -2px;
            border: 2px solid rgba(255, 255, 255, .45); border-top-color: #fff; border-radius: 50%; animation: tombolPutar .7s linear infinite;
        }
        @keyframes errorGetar { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-7px); } 40% { transform: translateX(7px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
        .input-wrap.bergerak { animation: errorGetar .4s ease; }
    `;
    document.head.appendChild(gayaTambahan);

    let timerBanner = null;
    function tampilkanBanner(pesan, lamaMs) {
        let banner = document.getElementById('bannerSukses');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'bannerSukses';
            banner.className = 'banner-sukses';
            document.body.appendChild(banner);
        }
        banner.textContent = pesan;
        requestAnimationFrame(() => banner.classList.add('tampil'));
        clearTimeout(timerBanner);
        timerBanner = setTimeout(() => banner.classList.remove('tampil'), lamaMs);
    }

    function tampilkanPesanTitipan() {
        const pesan = sessionStorage.getItem('pesanFlash');
        if (!pesan) return;
        sessionStorage.removeItem('pesanFlash');
        tampilkanBanner(pesan, LAMA_BANNER_KELUAR);
    }

    function tampilkanError(idElemen, pesan) {
        const el = document.getElementById(idElemen);
        if (el) el.textContent = pesan;
    }

    function tandaiInvalid(input, invalid) {
        if (!input) return;
        const wrap = input.closest('.input-wrap');
        if (wrap) wrap.classList.toggle('invalid', invalid);
    }

    function bersihkanError() {
        tampilkanError('errorUsername', '');
        tampilkanError('errorPassword', '');
        tampilkanError('errorUmum', '');
        tandaiInvalid(inputUsername, false);
        tandaiInvalid(inputPassword, false);
    }

    function gerakkanError() {
        formLogin.querySelectorAll('.input-wrap.invalid').forEach(el => {
            el.classList.remove('bergerak');
            void el.offsetWidth;
            el.classList.add('bergerak');
        });
    }

    function togglePassword() {
        const sedangTersembunyi = inputPassword.type === 'password';
        inputPassword.type = sedangTersembunyi ? 'text' : 'password';
        if (ikonMata) ikonMata.innerHTML = sedangTersembunyi ? IKON_MATA_TERCORET : IKON_MATA_TERBUKA;
    }

    function validasiLogin() {
        let valid = true;
        bersihkanError();

        if (inputUsername.value.trim() === '') {
            tampilkanError('errorUsername', 'Username wajib diisi');
            tandaiInvalid(inputUsername, true);
            valid = false;
        }

        if (inputPassword.value.trim() === '') {
            tampilkanError('errorPassword', 'Kata sandi wajib diisi');
            tandaiInvalid(inputPassword, true);
            valid = false;
        }

        return valid;
    }

    let sedangMemproses = false;
    function setLoading(status) {
        sedangMemproses = status;
        if (tombolMasuk) {
            tombolMasuk.classList.toggle('memproses', status);
            tombolMasuk.setAttribute('aria-busy', status ? 'true' : 'false');
            tombolMasuk.textContent = status ? 'MEMPROSES...' : 'MASUK';
        }
    }

    async function prosesLogin(event) {
        event.preventDefault();
        if (sedangMemproses) return;

        if (!validasiLogin()) {
            gerakkanError();
            return;
        }

        setLoading(true);
        const waktuMulai = Date.now();

        try {
            const formData = new FormData(formLogin);
            const response = await fetch('login.php', {
                method: 'POST',
                body: formData
            });

            const textResponse = await response.text();
            let hasil;
            try {
                hasil = JSON.parse(textResponse);
            } catch (e) {
                console.error("Respon Server Bukan JSON:", textResponse);
                throw new Error("Format respons server tidak valid");
            }

            const sisaWaktu = Math.max(0, JEDA_PROSES - (Date.now() - waktuMulai));

            setTimeout(() => {
                if (!hasil || hasil.status !== 'sukses') {
                    tampilkanError('errorUmum', (hasil && hasil.pesan) ? hasil.pesan : 'Username atau kata sandi salah');
                    tandaiInvalid(inputUsername, true);
                    tandaiInvalid(inputPassword, true);
                    setLoading(false);
                    gerakkanError();
                    return;
                }

                sessionStorage.setItem('pengguna', JSON.stringify(hasil.pengguna));
                window.location.href = hasil.redirect;
            }, sisaWaktu);

        } catch (error) {
            setLoading(false);
            tampilkanError('errorUmum', 'Gagal terhubung ke server atau terjadi kesalahan.');
            gerakkanError();
        }
    }

    if (tombolMata) tombolMata.addEventListener('click', togglePassword);
    if (formLogin) formLogin.addEventListener('submit', prosesLogin);
    if (inputUsername) inputUsername.addEventListener('input', bersihkanError);
    if (inputPassword) inputPassword.addEventListener('input', bersihkanError);

    tampilkanPesanTitipan();
});