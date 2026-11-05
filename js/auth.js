// Autentikasi sederhana berbasis localStorage (hanya untuk tugas/demo, bukan keamanan sungguhan)
const KUNCI_AKUN = "pohonin_akun";
const KUNCI_LOGIN = "pohonin_login";

function ambilAkun() {
    try { return JSON.parse(localStorage.getItem(KUNCI_AKUN)) || []; }
    catch (e) { return []; }
}

function sudahLogin() {
    return localStorage.getItem(KUNCI_LOGIN) !== null;
}

// Penjaga halaman: body yang punya data-wajib-login="true" hanya bisa dibuka setelah login
document.addEventListener("DOMContentLoaded", function () {
    if (document.body.dataset.wajibLogin === "true" && !sudahLogin()) {
        location.replace("Login.html");
        return;
    }
    pasangTampilkanPassword();
    pasangFormLogin();
    pasangFormSignup();
});

function tampilkanPesan(teks, sukses) {
    const el = document.getElementById("pesan");
    if (!el) return;
    el.textContent = teks;
    el.style.color = sukses ? "#15803d" : "#b91c1c";
}

function emailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function pasangTampilkanPassword() {
    const cek = document.getElementById("lihatPw");
    const pw = document.getElementById("pw");
    if (!cek || !pw) return;
    cek.addEventListener("change", function () {
        pw.type = cek.checked ? "text" : "password";
    });
}

function pasangFormSignup() {
    const form = document.getElementById("formSignup");
    if (!form) return;
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const nama = form.nama.value.trim();
        const email = form.email.value.trim().toLowerCase();
        const pw = form.pw.value;

        if (!emailValid(email)) return tampilkanPesan("Format email tidak valid.");
        if (pw.length < 6) return tampilkanPesan("Password minimal 6 karakter.");

        const akun = ambilAkun();
        if (akun.some(function (a) { return a.email === email; })) {
            return tampilkanPesan("Email sudah terdaftar. Silakan login.");
        }
        akun.push({ nama: nama, email: email, pw: pw });
        localStorage.setItem(KUNCI_AKUN, JSON.stringify(akun));
        tampilkanPesan("Akun berhasil dibuat! Mengarahkan ke halaman login...", true);
        setTimeout(function () { location.href = "Login.html"; }, 1200);
    });
}

function pasangFormLogin() {
    const form = document.getElementById("formLogin");
    if (!form) return;
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = form.email.value.trim().toLowerCase();
        const pw = form.pw.value;

        if (!emailValid(email)) return tampilkanPesan("Format email tidak valid.");

        const cocok = ambilAkun().find(function (a) {
            return a.email === email && a.pw === pw;
        });
        if (!cocok) return tampilkanPesan("Email atau password salah.");

        localStorage.setItem(KUNCI_LOGIN, JSON.stringify({ nama: cocok.nama, email: cocok.email }));
        location.href = "beranda.html";
    });
}
