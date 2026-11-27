document.addEventListener("DOMContentLoaded", function () {

    const SEMUA_WAJIB = true;

    const PESAN = {
        namaWajib:    { id: "Nama lengkap wajib diisi.",                     en: "Full name is required." },
        emailWajib:   { id: "Email wajib diisi.",                            en: "Email is required." },
        emailFormat:  { id: "Format email tidak valid.",                     en: "Invalid email format." },
        telpWajib:    { id: "Nomor telepon wajib diisi.",                    en: "Phone number is required." },
        telpFormat:   { id: "Nomor telepon harus berupa angka, 8–15 digit.", en: "Phone number must be 8–15 digits." },
        sandiWajib:   { id: "Kata sandi baru wajib diisi.",                  en: "New password is required." },
        sandiMin:     { id: "Kata sandi baru minimal 8 karakter.",           en: "New password must be at least 8 characters." },
        konfirmWajib: { id: "Konfirmasi kata sandi wajib diisi.",            en: "Password confirmation is required." },
        konfirmCocok: { id: "Konfirmasi kata sandi tidak cocok.",            en: "Password confirmation does not match." }
    };

    function bahasaAktif() {
        let bhs = "";
        try {
            const p = JSON.parse(localStorage.getItem("pengaturanAdmin") || "{}");
            bhs = p.bahasa || p.language || p.lang || "";
        } catch (e) { /* abaikan */ }

        if (!bhs) {
            bhs = localStorage.getItem("bahasa") ||
                  localStorage.getItem("lang") ||
                  document.documentElement.lang ||
                  "en";
        }

        bhs = String(bhs).toLowerCase();
        return (bhs.startsWith("id") || bhs.includes("indo")) ? "id" : "en";
    }

    function t(kunci) {
        return PESAN[kunci][bahasaAktif()];
    }

    const form = document.getElementById("profileForm");
    const inputNama = document.getElementById("nama");
    const inputEmail = document.getElementById("email");
    const inputTelp = document.getElementById("telp");
    const inputPasswordBaru = document.getElementById("passwordBaru");
    const inputKonfirmasiSandi = document.getElementById("konfirmasiSandi");
    const inputFoto = document.getElementById("gantiFoto");
    const btnBatal = document.querySelector(".btn-batal");

    form.setAttribute("novalidate", "");

    const gaya = document.createElement("style");
    gaya.textContent = `
        .form-card .field small.pesan-kolom {
            display: none;
            margin-top: 6px;
            color: #dc2626 !important;
            font: 600 12.5px/1.3 Inter, Arial, sans-serif;
        }
        .form-card .field.invalid small.pesan-kolom { 
            display: block !important; 
        }
        .form-card .field.invalid input { 
            border-color: #dc2626 !important; 
        }

        /* Modal Notifikasi Sukses */
        .notif-latar {
            position: fixed;
            inset: 0;
            z-index: 4000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(15, 23, 42, .55);
            backdrop-filter: blur(3px);
            opacity: 0;
            transition: opacity .2s ease;
        }
        .notif-latar.tampil { opacity: 1; }
        .notif-kotak {
            width: 100%;
            max-width: 380px;
            padding: 28px 26px 22px;
            border-radius: 18px;
            background: #fff;
            text-align: center;
            font-family: Inter, Arial, sans-serif;
            box-shadow: 0 24px 60px rgba(15, 23, 42, .3);
            transform: translateY(14px) scale(.96);
            transition: transform .25s cubic-bezier(.2, .9, .3, 1.2);
        }
        .notif-latar.tampil .notif-kotak { transform: translateY(0) scale(1); }
        .notif-ikon {
            width: 64px;
            height: 64px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #dcfce7;
            color: #16a34a;
        }
        .notif-ikon svg {
            width: 32px;
            height: 32px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        .notif-kotak h3 {
            margin: 0 0 8px;
            color: #0f172a;
            font-size: 19px;
            font-weight: 800;
        }
        .notif-kotak p {
            margin: 0 0 22px;
            color: #64748b;
            font-size: 13.5px;
            line-height: 1.55;
        }
        .notif-aksi button {
            width: 100%;
            height: 42px;
            border: none;
            border-radius: 10px;
            background: #16a34a;
            color: #fff;
            font: 700 13.5px Inter, Arial, sans-serif;
            cursor: pointer;
            transition: background .15s ease;
        }
        .notif-aksi button:hover { background: #15803d; }
    `;
    document.head.appendChild(gaya);

    const daftarKolom = [
        inputNama, inputEmail, inputTelp, inputPasswordBaru, inputKonfirmasiSandi
    ].filter(Boolean);

    let fokusDariKode = false;

    function tampilkanError(el, teks) {
        const field = el.closest(".field");
        if (!field) return;
        field.classList.add("invalid");
        const small = field.querySelector(".pesan-kolom");
        if (small) small.textContent = teks;
    }

    function bersihkanError(el) {
        const field = el.closest(".field");
        if (!field) return;
        field.classList.remove("invalid");
        const small = field.querySelector(".pesan-kolom");
        if (small) small.textContent = "";
    }

    daftarKolom.forEach(function (el) {
        el.addEventListener("input", function () { bersihkanError(el); });
        el.addEventListener("focus", function () {
            if (!fokusDariKode) bersihkanError(el);
        });
    });

    function validasiForm() {
        let pertama = null;

        function salah(el, teks) {
            tampilkanError(el, teks);
            if (!pertama) pertama = el;
        }

        daftarKolom.forEach(bersihkanError);

        if (inputNama.value.trim() === "") {
            salah(inputNama, t("namaWajib"));
        }

        const email = inputEmail.value.trim();
        if (email === "") {
            salah(inputEmail, t("emailWajib"));
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            salah(inputEmail, t("emailFormat"));
        }

        const telp = inputTelp.value.replace(/[\s-]/g, "");
        if (telp === "") {
            salah(inputTelp, t("telpWajib"));
        } else if (!/^\+?[0-9]{8,15}$/.test(telp)) {
            salah(inputTelp, t("telpFormat"));
        }

        const baru = inputPasswordBaru.value;
        const konfirmasi = inputKonfirmasiSandi.value;

        if (SEMUA_WAJIB || baru !== "" || konfirmasi !== "") {
            if (baru === "") {
                salah(inputPasswordBaru, t("sandiWajib"));
            } else if (baru.length < 8) {
                salah(inputPasswordBaru, t("sandiMin"));
            }

            if (konfirmasi === "") {
                salah(inputKonfirmasiSandi, t("konfirmWajib"));
            } else if (baru !== "" && baru !== konfirmasi) {
                salah(inputKonfirmasiSandi, t("konfirmCocok"));
            }
        }

        return pertama;
    }

    // Modal Sukses Kustom
    function tampilkanModalSukses(pesan, saatOk) {
        const latar = document.createElement("div");
        latar.className = "notif-latar";
        latar.innerHTML =
            '<div class="notif-kotak" role="alertdialog" aria-modal="true">' +
                '<div class="notif-ikon">' +
                    '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>' +
                '</div>' +
                '<h3>Berhasil!</h3>' +
                '<p>' + pesan + '</p>' +
                '<div class="notif-aksi">' +
                    '<button type="button" class="notif-ok">OK</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(latar);

        requestAnimationFrame(function () {
            latar.classList.add("tampil");
        });

        const tombolOk = latar.querySelector(".notif-ok");
        tombolOk.focus();

        tombolOk.addEventListener("click", function () {
            latar.classList.remove("tampil");
            setTimeout(function () {
                latar.remove();
                if (saatOk) saatOk();
            }, 200);
        });
    }

    const btnGantiFoto = document.getElementById("btnGantiFoto");
    const avatarLg = document.querySelector(".avatar-lg");

    function tampilkanFoto(wadah, src) {
        if (!wadah) return;
        let img = wadah.querySelector("img");
        if (!img) {
            img = document.createElement("img");
            img.alt = "Foto Profil";
            img.style.cssText = "width:100%;height:100%;border-radius:50%;object-fit:cover;";
            wadah.appendChild(img);
        }
        img.src = src;
        const svg = wadah.querySelector("svg");
        if (svg) svg.style.display = "none";
    }

    if (btnGantiFoto && inputFoto) {
        btnGantiFoto.addEventListener("click", function () {
            inputFoto.click();
        });

        inputFoto.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (!file) return;

            if (!["image/jpeg", "image/png"].includes(file.type)) {
                alert("Format foto harus JPG atau PNG!");
                inputFoto.value = "";
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran foto terlalu besar! Maksimal 2 MB.");
                inputFoto.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = function (ev) {
                tampilkanFoto(avatarLg, ev.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const kolomSalah = validasiForm();
        if (kolomSalah) {
            fokusDariKode = true;
            kolomSalah.focus();
            fokusDariKode = false;
            return;
        }

        const passwordBaru = inputPasswordBaru.value;
        const formData = new FormData();

        formData.append("nama_lengkap", inputNama.value.trim());
        formData.append("email", inputEmail.value.trim());
        formData.append("no_telepon", inputTelp.value.trim());
        if (passwordBaru) formData.append("kata_sandi_baru", passwordBaru);
        if (inputFoto && inputFoto.files[0]) {
            formData.append("foto", inputFoto.files[0]);
        }

        try {
            const response = await fetch("edit-user.php", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan perubahan ke server.");
            }

            const hasil = await response.json();

            if (hasil.status === "sukses") {
                tampilkanModalSukses(hasil.pesan || "Profil berhasil diperbarui!", function () {
                    location.reload();
                });
            } else {
                alert(hasil.pesan || "Terjadi kesalahan.");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Gagal terhubung ke server database.");
        }
    });

    function tampilkanKonfirmasiBatal(saatYa) {
        if (document.getElementById("btLatar")) return;

        const latar = document.createElement("div");
        latar.id = "btLatar";
        latar.className = "bt-latar";
        latar.innerHTML =
            '<div class="bt-kotak" role="alertdialog" aria-modal="true">' +
                '<div class="bt-ikon">' +
                    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7v6"/><path d="M12 16.5v.5"/></svg>' +
                '</div>' +
                '<h3>Batalkan perubahan?</h3>' +
                '<p>Perubahan yang belum disimpan akan hilang.</p>' +
                '<div class="bt-aksi">' +
                    '<button type="button" class="bt-kembali">Kembali</button>' +
                    '<button type="button" class="bt-ya">Ya, Batalkan</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(latar);

        requestAnimationFrame(function () {
            latar.classList.add("tampil");
        });

        function tutup() {
            latar.classList.remove("tampil");
            setTimeout(function () { latar.remove(); }, 200);
        }

        latar.querySelector(".bt-kembali").addEventListener("click", tutup);
        latar.querySelector(".bt-ya").addEventListener("click", function () {
            saatYa();
        });

        latar.addEventListener("click", function (e) {
            if (e.target === latar) tutup();
        });
    }

    if (btnBatal) {
        btnBatal.addEventListener("click", function (event) {
            event.preventDefault();
            tampilkanKonfirmasiBatal(function () {
                location.reload();
            });
        });
    }
});