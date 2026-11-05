const HARGA_POHON = 10000;   // Rp10.000 = 1 pohon
const MIN_DONASI = 10000;

const input = document.getElementById("jumlah");
const info = document.getElementById("infoPohon");
const kartuNominal = document.querySelectorAll(".nominal");
const tombolLanjut = document.getElementById("btnLanjut");

function rupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
}

// Perbarui teks info pohon dan sorotan kartu sesuai nilai input
function perbaruiTampilan() {
    const jumlah = Number(input.value);
    kartuNominal.forEach(function (k) {
        k.classList.toggle("aktif", Number(k.dataset.nominal) === jumlah);
    });

    if (!jumlah || jumlah < MIN_DONASI) {
        info.textContent = "Minimal donasi " + rupiah(MIN_DONASI);
        info.classList.add("salah");
        return false;
    }
    info.classList.remove("salah");
    info.textContent = rupiah(jumlah) + " = " + Math.floor(jumlah / HARGA_POHON) + " pohon";
    return true;
}

// Klik salah satu kartu nominal
kartuNominal.forEach(function (k) {
    k.addEventListener("click", function () {
        input.value = k.dataset.nominal;
        perbaruiTampilan();
    });
});

// Ketik nominal sendiri
input.addEventListener("input", perbaruiTampilan);

// Tombol Lanjutkan: simpan riwayat donasi lalu kembali ke beranda
tombolLanjut.addEventListener("click", function () {
    if (!perbaruiTampilan()) return;

    const jumlah = Number(input.value);
    let riwayat = [];
    try { riwayat = JSON.parse(localStorage.getItem("pohonin_donasi")) || []; } catch (e) {}
    riwayat.push({
        jumlah: jumlah,
        pohon: Math.floor(jumlah / HARGA_POHON),
        tanggal: new Date().toISOString()
    });
    localStorage.setItem("pohonin_donasi", JSON.stringify(riwayat));

    info.classList.remove("salah");
    info.textContent = "Terima kasih! Donasi " + rupiah(jumlah) + " akan menjadi " +
        Math.floor(jumlah / HARGA_POHON) + " pohon.";
    tombolLanjut.disabled = true;
    setTimeout(function () { location.href = "beranda.html"; }, 2000);
});

// Tombol x menutup halaman donasi
document.getElementById("tutup").addEventListener("click", function () {
    location.href = "beranda.html";
});

perbaruiTampilan();
