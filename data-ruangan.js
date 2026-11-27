// ===== Constants =====
const ROWS_PER_PAGE = 5;

// ===== Language =====
function getLang() {
    try {
        const saved = JSON.parse(localStorage.getItem('pengaturanAdmin'));
        if (saved && saved.bahasa) {
            return /^id/i.test(String(saved.bahasa).trim()) ? 'id' : 'en';
        }
    } catch (error) {}
    
    try {
        const bagian = document.querySelectorAll('th, #sidebar, label');
        let teks = '';
        for (let i = 0; i < bagian.length; i++) {
            teks += ' ' + bagian[i].textContent;
        }
        if (/Room Name|AC Count|Lamp Count|Room Data/i.test(teks)) return 'en';
    } catch (error) {}

    return 'id';
}

const TEXT = {
    en: {
        noData: 'No data found',
        roomRequired: 'Room name is required',
        roomExists: 'Room name already exists',
        acLabel: 'Number of ACs',
        lampLabel: 'Number of lamps',
        required: ' is required',
        wholeNumber: ' must be a whole number, minimum 0',
        editRoom: 'Edit Room',
        addRoom: 'Add New Room',
        added: 'Room added successfully.',
        updated: 'Room updated successfully.',
        deleted: 'Room deleted successfully.',
        deleteTitle: 'Delete data?',
        deleteAsk: 'Delete room "{name}"?',
        cancel: 'Cancel',
        yesDelete: 'Yes, Delete',
        edit: 'Edit',
        del: 'Delete'
    },
    id: {
        noData: 'Data tidak ditemukan',
        roomRequired: 'Nama ruangan wajib diisi',
        roomExists: 'Nama ruangan sudah ada',
        acLabel: 'Jumlah AC',
        lampLabel: 'Jumlah lampu',
        required: ' wajib diisi',
        wholeNumber: ' harus berupa angka bulat, minimal 0',
        editRoom: 'Edit Ruangan',
        addRoom: 'Tambah Ruangan Baru',
        added: 'Ruangan berhasil ditambahkan.',
        updated: 'Data ruangan berhasil diperbarui.',
        deleted: 'Ruangan berhasil dihapus.',
        deleteTitle: 'Hapus data?',
        deleteAsk: 'Hapus ruangan "{name}"?',
        cancel: 'Batal',
        yesDelete: 'Ya, Hapus',
        edit: 'Edit',
        del: 'Hapus'
    }
};

function t(key) {
    return TEXT[getLang()][key];
}

// ===== Room names in both languages =====
const ROOM_NAMES = [
    { en: 'Classroom',     id: 'R. Kelas' },
    { en: 'Computer Room', id: 'R. Komputer' },
    { en: 'Lecturer Room', id: 'R. Dosen' },
    { en: 'Admin Office',  id: 'R. T.U' },
    { en: 'JT1 Room',      id: 'R. JT1' },
    { en: 'Meeting Room',  id: 'R. Rapat' },
    { en: 'Laboratory',    id: 'R. Lab' },
    { en: 'Seminar Room',  id: 'R. Seminar' },
    { en: 'Library',       id: 'R. Perpustakaan', alias: ['R. Perpustakan', 'Ruang Perpustakaan', 'Perpustakaan'] },
    { en: 'Prayer Room',   id: 'R. Musholla' },
    { en: 'Teacher Room',  id: 'R. Guru',  alias: ['Ruang Guru'] },
    { en: 'General Room',  id: 'R. Umum',  alias: ['Ruang Umum'] },
    { en: 'Room',          id: 'Ruang' }
];

function normalizeText(text) {
    return String(text).toLowerCase().replace(/[\s.]/g, '');
}

const ROOM_LOOKUP = {};
ROOM_NAMES.forEach(function (entry, index) {
    [entry.en, entry.id].concat(entry.alias || []).forEach(function (n) {
        ROOM_LOOKUP[normalizeText(n)] = index;
    });
});

function displayName(name) {
    try {
        const raw = String(name).trim();
        const lower = raw.toLowerCase();

        // Jika bahasa aktif adalah Inggris, terjemahkan langsung secara mutlak
        if (getLang() === 'en') {
            if (lower.includes('lab komputer 1') || lower.includes('laboratorium komputer 1')) return 'Computer Lab 1';
            if (lower.includes('lab komputer 2') || lower.includes('laboratorium komputer 2')) return 'Computer Lab 2';
            if (lower.includes('lab komputer') || lower.includes('laboratorium komputer')) return 'Computer Lab';
            if (lower.includes('perpustakaan') || lower.includes('perpus')) return 'Library';
            if (lower.includes('kelas')) return 'Classroom';
            if (lower.includes('dosen')) return 'Lecturer Room';
            if (lower.includes('rapat')) return 'Meeting Room';
        }

        const index = ROOM_LOOKUP[normalizeText(name)];
        return index === undefined ? name : ROOM_NAMES[index][getLang()];
    } catch (e) {
        return name;
    }
}

function roomKey(name) {
    const index = ROOM_LOOKUP[normalizeText(name)];
    return index === undefined ? normalizeText(name) : 'k' + index;
}

function storedName(name) {
    const index = ROOM_LOOKUP[normalizeText(name)];
    return index === undefined ? name : ROOM_NAMES[index].id;
}

const ICON_EDIT = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="M14 7l3 3"/></svg>';
const ICON_DELETE = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/><path d="M10 11v6M14 11v6"/></svg>';

// ===== Elements =====
const roomTable = document.getElementById('tabelRuangan');
const searchInput = document.getElementById('cari');
const addButton = document.getElementById('btnTambah');
const backButton = document.getElementById('btnBack');
const nextButton = document.getElementById('btnNext');
const pageInfo = document.getElementById('infoHalaman');
const successMessage = document.getElementById('pesanSukses');

const modal = document.getElementById('modalRuangan');
const modalTitle = document.getElementById('judulModal');
const roomForm = document.getElementById('formRuangan');
const nameInput = document.getElementById('namaRuangan');
const acInput = document.getElementById('jumlahAC');
const lampInput = document.getElementById('jumlahLampu');
const cancelButton = document.getElementById('btnBatal');
const saveButton = roomForm.querySelector('.btn-simpan');

// ===== State (Diambil dari Database via PHP) =====
let roomList = Array.isArray(window.DATA_RUANGAN_DB) ? window.DATA_RUANGAN_DB : [];
let currentPage = 1;
let editingId = null;
let messageTimer = null;

// ===== Utils =====
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ===== Filter =====
function getFilteredRooms() {
    const keyword = normalizeText(searchInput.value);

    return roomList.filter(function (r) {
        return normalizeText(displayName(r.name)).includes(keyword) ||
               normalizeText(r.name).includes(keyword) ||
               String(r.ac).includes(keyword) ||
               String(r.lamps).includes(keyword);
    });
}

// ===== Table rendering =====
function buildRow(room, number) {
    return `
        <tr>
            <td>${number}</td>
            <td>${escapeHtml(displayName(room.name))}</td>
            <td>${room.ac}</td>
            <td>${room.lamps}</td>
            <td>
                <span class="actions">
                    <button class="edit" type="button" data-id="${room.id}" aria-label="${t('edit')}">${ICON_EDIT}</button>
                    <button class="del" type="button" data-id="${room.id}" aria-label="${t('del')}">${ICON_DELETE}</button>
                </span>
            </td>
        </tr>
    `;
}

function renderTable() {
    const results = getFilteredRooms();
    const totalPages = Math.max(1, Math.ceil(results.length / ROWS_PER_PAGE));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const visible = results.slice(start, start + ROWS_PER_PAGE);

    if (visible.length === 0) {
        roomTable.innerHTML =
            '<tr class="baris-kosong"><td colspan="5">' + t('noData') + '</td></tr>';
    } else {
        roomTable.innerHTML = visible.map(function (r) {
            return buildRow(r, roomList.indexOf(r) + 1);
        }).join('');
    }

    pageInfo.textContent = currentPage + ' / ' + totalPages;
    backButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
}

// ===== Success message =====
function showMessage(text) {
    successMessage.textContent = text;
    successMessage.classList.add('tampil');

    clearTimeout(messageTimer);
    messageTimer = setTimeout(function () {
        successMessage.classList.remove('tampil');
    }, 3000);
}

// ===== Form error messages =====
function setError(errorId, input, message) {
    document.getElementById(errorId).textContent = message;
    input.classList.toggle('invalid', message !== '');
}

function clearFormErrors() {
    setError('errorNama', nameInput, '');
    setError('errorAC', acInput, '');
    setError('errorLampu', lampInput, '');
}

// ===== Validation =====
function nameAlreadyExists(name) {
    const key = roomKey(name);

    return roomList.some(function (r) {
        return r.id !== editingId && roomKey(r.name) === key;
    });
}

function validateName() {
    const name = nameInput.value.trim();

    if (name === '') {
        setError('errorNama', nameInput, t('roomRequired'));
        return false;
    }
    if (nameAlreadyExists(name)) {
        setError('errorNama', nameInput, t('roomExists'));
        return false;
    }
    return true;
}

function validateCount(input, errorId, label) {
    const value = input.value.trim();

    if (value === '') {
        setError(errorId, input, label + t('required'));
        return false;
    }
    if (!/^[0-9]+$/.test(value)) {
        setError(errorId, input, label + t('wholeNumber'));
        return false;
    }
    return true;
}

function validateForm() {
    clearFormErrors();

    const results = [
        validateName(),
        validateCount(acInput, 'errorAC', t('acLabel')),
        validateCount(lampInput, 'errorLampu', t('lampLabel'))
    ];

    return results.every(Boolean);
}

// ===== Modal =====
function openModal(room) {
    clearFormErrors();
    editingId = room ? room.id : null;

    modalTitle.textContent = room ? t('editRoom') : t('addRoom');
    nameInput.value = room ? displayName(room.name) : '';
    acInput.value = room ? room.ac : '';
    lampInput.value = room ? room.lamps : '';

    modal.hidden = false;
    nameInput.focus();
}

function closeModal() {
    modal.hidden = true;
    editingId = null;
    roomForm.reset();
    clearFormErrors();
}

// ===== Save ke PHP & MySQL =====
async function handleSave(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const namaSimpan = storedName(nameInput.value.trim());
    const acSimpan = Number(acInput.value);
    const lampuSimpan = Number(lampInput.value);

    const formData = new FormData();
    formData.append('aksi', editingId === null ? 'tambah' : 'edit');
    if (editingId !== null) formData.append('id', editingId);
    formData.append('nama_ruangan', namaSimpan);
    formData.append('jumlah_ac', acSimpan);
    formData.append('jumlah_lampu', lampuSimpan);

    saveButton.disabled = true;

    try {
        const response = await fetch('data-ruangan.php', {
            method: 'POST',
            body: formData
        });
        const hasil = await response.json();

        if (hasil.status !== 'sukses') {
            setError('errorNama', nameInput, hasil.pesan || t('roomExists'));
            saveButton.disabled = false;
            return;
        }

        if (editingId === null) {
            roomList.push(hasil.data);
            showMessage(t('added'));
        } else {
            roomList = roomList.map(function (r) {
                return r.id === editingId ? hasil.data : r;
            });
            showMessage(t('updated'));
        }

        closeModal();
        renderTable();
    } catch (error) {
        alert('Gagal terhubung ke server.');
    } finally {
        saveButton.disabled = false;
    }
}

// ===== Delete confirmation pop-up =====
let confirmPopup = null;
let onConfirm = null;

function createConfirmPopup() {
    const style = document.createElement('style');
    style.textContent = `
        .konfirmasi-back {
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
        .konfirmasi-back.tampil {
            opacity: 1;
            pointer-events: auto;
        }
        .konfirmasi-kotak {
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
        .konfirmasi-back.tampil .konfirmasi-kotak {
            transform: translateY(0) scale(1);
        }
        .konfirmasi-ikon {
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
        .konfirmasi-ikon svg {
            width: 30px;
            height: 30px;
            stroke: currentColor;
            fill: none;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        .konfirmasi-judul {
            margin: 0 0 8px;
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
        }
        .konfirmasi-teks {
            margin: 0 0 22px;
            font-size: 14px;
            line-height: 1.5;
            color: #64748b;
            word-break: break-word;
        }
        .konfirmasi-aksi {
            display: flex;
            gap: 10px;
        }
        .konfirmasi-aksi button {
            flex: 1;
            padding: 12px 0;
            border: 0;
            border-radius: 10px;
            font: 600 14px Inter, Arial, sans-serif;
            cursor: pointer;
            transition: transform .15s ease, background .15s ease;
        }
        .konfirmasi-aksi button:active {
            transform: scale(.97);
        }
        .konfirmasi-batal {
            background: #f1f5f9;
            color: #334155;
        }
        .konfirmasi-batal:hover {
            background: #e2e8f0;
        }
        .konfirmasi-ya {
            background: #dc2626;
            color: #fff;
        }
        .konfirmasi-ya:hover {
            background: #b91c1c;
        }
    `;
    document.head.appendChild(style);

    const el = document.createElement('div');
    el.className = 'konfirmasi-back';
    el.innerHTML = `
        <div class="konfirmasi-kotak" role="dialog" aria-modal="true" aria-labelledby="konfirmasiJudul">
            <div class="konfirmasi-ikon">
                <svg viewBox="0 0 24 24">
                    <path d="M3 6h18"/>
                    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/>
                    <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/>
                    <path d="M10 11v6M14 11v6"/>
                </svg>
            </div>
            <h3 class="konfirmasi-judul" id="konfirmasiJudul"></h3>
            <p class="konfirmasi-teks"></p>
            <div class="konfirmasi-aksi">
                <button type="button" class="konfirmasi-batal"></button>
                <button type="button" class="konfirmasi-ya"></button>
            </div>
        </div>
    `;
    document.body.appendChild(el);

    const cancelConfirmButton = el.querySelector('.konfirmasi-batal');
    const yesConfirmButton = el.querySelector('.konfirmasi-ya');

    function close() {
        el.classList.remove('tampil');
        onConfirm = null;
    }

    cancelConfirmButton.addEventListener('click', close);

    yesConfirmButton.addEventListener('click', function () {
        const run = onConfirm;
        close();
        if (run) run();
    });

    el.addEventListener('click', function (e) {
        if (e.target === el) close();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && el.classList.contains('tampil')) close();
    });

    return {
        el: el,
        title: el.querySelector('.konfirmasi-judul'),
        text: el.querySelector('.konfirmasi-teks'),
        cancelButton: cancelConfirmButton,
        yesButton: yesConfirmButton
    };
}

function showConfirm(message, onAgree) {
    if (!confirmPopup) confirmPopup = createConfirmPopup();

    confirmPopup.title.textContent = t('deleteTitle');
    confirmPopup.text.textContent = message;
    confirmPopup.cancelButton.textContent = t('cancel');
    confirmPopup.yesButton.textContent = t('yesDelete');

    onConfirm = onAgree;
    confirmPopup.el.classList.add('tampil');
    confirmPopup.cancelButton.focus();
}

// ===== Edit and delete ke PHP & MySQL =====
function handleTableClick(event) {
    const button = event.target.closest('button[data-id]');
    if (!button) return;

    const id = Number(button.dataset.id);
    const room = roomList.find(function (r) { return r.id === id; });
    if (!room) return;

    if (button.classList.contains('edit')) {
        openModal(room);
        return;
    }

    const message = t('deleteAsk').replace('{name}', displayName(room.name));

    showConfirm(message, async function () {
        const formData = new FormData();
        formData.append('aksi', 'hapus');
        formData.append('id', id);

        try {
            const response = await fetch('data-ruangan.php', {
                method: 'POST',
                body: formData
            });
            const hasil = await response.json();

            if (hasil.status === 'sukses') {
                roomList = roomList.filter(function (r) { return r.id !== id; });
                renderTable();
                showMessage(t('deleted'));
            } else {
                alert(hasil.pesan || 'Gagal menghapus ruangan.');
            }
        } catch (error) {
            alert('Gagal terhubung ke server.');
        }
    });
}

// ===== Attach events =====
addButton.addEventListener('click', function () { openModal(null); });
cancelButton.addEventListener('click', closeModal);
roomForm.addEventListener('submit', handleSave);

roomForm.noValidate = true;

const formErrorStyle = document.createElement('style');
formErrorStyle.textContent = `
    #errorNama, #errorAC, #errorLampu {
        color: #dc2626;
        font-size: 13px;
        margin-top: 4px;
    }
    #formRuangan .invalid {
        border-color: #dc2626 !important;
    }
`;
document.head.appendChild(formErrorStyle);

roomTable.addEventListener('click', handleTableClick);

searchInput.addEventListener('input', function () {
    currentPage = 1;
    renderTable();
});

backButton.addEventListener('click', function () {
    currentPage--;
    renderTable();
});

nextButton.addEventListener('click', function () {
    currentPage++;
    renderTable();
});

modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
});

errorPairs = [
    { input: nameInput, errorId: 'errorNama' },
    { input: acInput,   errorId: 'errorAC' },
    { input: lampInput, errorId: 'errorLampu' }
];

errorPairs.forEach(function (pair) {
    pair.input.addEventListener('input', function () {
        setError(pair.errorId, pair.input, '');
    });
});

window.addEventListener('storage', renderTable);
window.addEventListener('languagechange', renderTable);
window.addEventListener('pageshow', renderTable);

// ===== Run =====
renderTable();