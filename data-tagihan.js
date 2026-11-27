document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("tableBodyTagihan");
    const filterRuangan = document.getElementById("filterRuangan");
    const filterBulan = document.getElementById("filterBulan");
    const btnSimpanAnalisis = document.getElementById("btnSimpanAnalisis");

    // ==========================================
    // 1. FITUR LIVE FILTERING (Pencarian & Filter)
    // ==========================================
    function filterTable() {
        const keywordRuangan = filterRuangan.value.toLowerCase();
        const keywordBulan = filterBulan.value.toLowerCase();
        const rows = tableBody.getElementsByTagName("tr");

        for (let row of rows) {
            const colBulan = row.cells[0].textContent.toLowerCase();
            const colRuangan = row.cells[1].textContent.toLowerCase();

            const matchRuangan = keywordRuangan === "" || colRuangan.includes(keywordRuangan);
            const matchBulan = keywordBulan === "" || colBulan.includes(keywordBulan);

            if (matchRuangan && matchBulan) {
                row.style.display = ""; // Tampilkan baris
            } else {
                row.style.display = "none"; // Sembunyikan baris
            }
        }
    }

    if (filterRuangan) filterRuangan.addEventListener("change", filterTable);
    if (filterBulan) filterBulan.addEventListener("input", filterTable);

    // ==========================================
    // 2. SIMPAN DAN ANALISIS (Rule-Based Status)
    // ==========================================
    if (btnSimpanAnalisis) {
        btnSimpanAnalisis.addEventListener("click", function () {
            const ruanganVal = document.getElementById("inputRuangan").value.trim();
            const bulanVal = document.getElementById("inputBulan").value.trim();
            const kwhVal = parseFloat(document.getElementById("inputKwh").value);

            // Validasi Form
            if (!ruanganVal || !bulanVal || isNaN(kwhVal)) {
                alert("Harap lengkapi Nama Ruangan, Bulan, dan Jumlah kWh terlebih dahulu!");
                return;
            }

            // Logika Analisis Otomatis Status Listrik
            let statusText = "Normal";
            let statusClass = "normal";

            if (kwhVal > 1000) {
                statusText = "Boros";
                statusClass = "boros";
            } else if (kwhVal < 500) {
                statusText = "Hemat";
                statusClass = "hemat";
            }

            // Buat elemen baris baru secara dinamis (DOM Manipulation)
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${bulanVal}</td>
                <td>${ruanganVal}</td>
                <td>${kwhVal} kWh</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn-edit" title="Edit">✏️</button>
                    <button class="btn-delete" title="Hapus">🗑️</button>
                </td>
            `;

            tableBody.appendChild(newRow);

            // Kosongkan input form setelah disimpan
            document.getElementById("inputRuangan").value = "";
            document.getElementById("inputBulan").value = "";
            document.getElementById("inputKwh").value = "";

            alert(`Data berhasil disimpan! Hasil Analisis Status: ${statusText}`);
        });
    }

    // ==========================================
    // 3. TOMBOL AKSI: HAPUS & EDIT (Event Delegation)
    // ==========================================
    tableBody.addEventListener("click", function (e) {
        const target = e.target;
        const row = target.closest("tr");

        // Fungsi Tombol Hapus
        if (target.classList.contains("btn-delete") || target.closest(".btn-delete")) {
            if (confirm("Apakah Anda yakin ingin menghapus data tagihan ini?")) {
                row.remove();
                alert("Data tagihan berhasil dihapus.");
            }
        }

        // Fungsi Tombol Edit
        if (target.classList.contains("btn-edit") || target.closest(".btn-edit")) {
            const bulan = row.cells[0].textContent;
            const ruangan = row.cells[1].textContent;
            const kwh = row.cells[2].textContent.replace(" kWh", "");

            // Masukkan data lama kembali ke form input untuk diperbarui
            document.getElementById("inputBulan").value = bulan;
            document.getElementById("inputRuangan").value = ruangan;
            document.getElementById("inputKwh").value = kwh;

            // Hapus baris lama agar nanti tersimpan sebagai data baru / ter-update
            row.remove();
            alert("Data ditarik ke form input. Silakan ubah datanya lalu klik 'SIMPAN DAN ANALISIS'.");
        }
    });

    // ==========================================
    // 4. NAVIGASI PAGINATION (Back & Next)
    // ==========================================
    const btnBack = document.getElementById("btnBack");
    const btnNext = document.getElementById("btnNext");
    const pageInfo = document.getElementById("pageInfo");
    
    let currentPage = 1;
    const maxPage = 3;

    if (btnNext) {
        btnNext.addEventListener("click", function () {
            if (currentPage < maxPage) {
                currentPage++;
                pageInfo.textContent = `${currentPage} / ${maxPage}`;
                // Di sini nanti bisa diintegrasikan pemuatan data halaman berikutnya
            } else {
                alert("Anda sudah berada di halaman terakhir.");
            }
        });
    }

    if (btnBack) {
        btnBack.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                pageInfo.textContent = `${currentPage} / ${maxPage}`;
            } else {
                alert("Anda sudah berada di halaman pertama.");
            }
        });
    }
});