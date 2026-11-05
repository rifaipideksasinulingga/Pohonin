// Tambah proyek baru cukup dengan menambah objek di array ini
const DATA_PROYEK = [
    { nama: "Hutan Lindung Sungailiat", lokasi: "Kepulauan Bangka Belitung", foto: "image/sungailiat.jpg", terkumpul: 7250, target: 10000 },
    { nama: "Restorasi Hutan Gambut",   lokasi: "Kalimantan Timur",          foto: "image/gambut.jpg",     terkumpul: 5400, target: 10000 },
    { nama: "Hutan Lindung Bukit X",    lokasi: "Sumatera Selatan",          foto: "image/bukit-x.jpg",    terkumpul: 3100, target: 10000 }
];

const wadah = document.getElementById("daftarProyek");
const kosong = document.getElementById("kosong");
const cari = document.getElementById("cariProyek");
const filterLokasi = document.getElementById("filterLokasi");
const filterStatus = document.getElementById("filterStatus");

function hitung(p) {
    const persen = Math.round(p.terkumpul / p.target * 100);
    // Status diturunkan dari progres: >= 70% dianggap hampir selesai
    const status = persen >= 70 ? "Hampir Selesai" : "Konservasi Aktif";
    return { persen: persen, status: status };
}

function buatKartu(p) {
    const h = hitung(p);
    return `
    <article class="kartu">
        <div class="kartu-foto">
            <img src="${p.foto}" alt="${p.nama}">
            <span class="kartu-label">${h.status}</span>
        </div>
        <div class="kartu-isi">
            <div>
                <div class="kartu-lokasi"><img src="image/geo-alt-fill.svg" alt=""><span>${p.lokasi}</span></div>
                <h3 class="kartu-judul">${p.nama}</h3>
            </div>
            <div class="kartu-progres">
                <div class="progres-info">
                    <span>${p.terkumpul.toLocaleString("id-ID")} / ${p.target.toLocaleString("id-ID")} pohon</span>
                    <span class="progres-persen">${h.persen}%</span>
                </div>
                <div class="progres-bar"><div class="progres-isi" style="width:${h.persen}%"></div></div>
                <button class="kartu-tombol" onclick="location.href='donasi.html'">Dukung Sekarang</button>
            </div>
        </div>
    </article>`;
}

function tampilkan() {
    const kata = cari.value.trim().toLowerCase();
    const hasil = DATA_PROYEK.filter(function (p) {
        const cocokNama = p.nama.toLowerCase().includes(kata);
        const cocokLokasi = filterLokasi.value === "" || p.lokasi === filterLokasi.value;
        const cocokStatus = filterStatus.value === "" || hitung(p).status === filterStatus.value;
        return cocokNama && cocokLokasi && cocokStatus;
    });
    wadah.innerHTML = hasil.map(buatKartu).join("");
    kosong.hidden = hasil.length > 0;
}

// Isi dropdown lokasi dari data (tanpa duplikat)
Array.from(new Set(DATA_PROYEK.map(function (p) { return p.lokasi; }))).forEach(function (lokasi) {
    filterLokasi.insertAdjacentHTML("beforeend", `<option value="${lokasi}">${lokasi}</option>`);
});

cari.addEventListener("input", tampilkan);
filterLokasi.addEventListener("change", tampilkan);
filterStatus.addEventListener("change", tampilkan);
tampilkan();
