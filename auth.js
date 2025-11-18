const API_BASE = "http://127.0.0.1:8010";

async function sendOTP() {
    const email = document.getElementById("auth-email").value;

    document.getElementById("otp-section").classList.add("hidden");

    const res = await fetch(`${API_BASE}/v1/auth/email/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
        alert("OTP sent! Check email.");
        document.getElementById("otp-section").classList.remove("hidden");
    } else {
        alert("Error: " + data.detail);
    }
}

async function verifyOTP() {
    const email = document.getElementById("auth-email").value;
    const otp = document.getElementById("auth-otp").value;

    const res = await fetch(`${API_BASE}/v1/auth/email/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
    });

    const data = await res.json();

    if (data.access_token) {
        localStorage.setItem("tinko_token", data.access_token);
        alert("Logged in successfully!");
        closeAuthModal();
    } else {
        alert("Error: " + data.detail);
    }
}

async function getProfile() {
    const token = localStorage.getItem("tinko_token");

    const res = await fetch(`${API_BASE}/v1/profile/me`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
}


// Modal Controls
function openAuthModal() {
    document.getElementById("auth-modal").classList.remove("hidden");
}
function closeAuthModal() {
    document.getElementById("auth-modal").classList.add("hidden");
}
