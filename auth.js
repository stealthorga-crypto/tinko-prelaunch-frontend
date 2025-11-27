// --------------------------------
// CONFIGURATION & CONSTANTS
// --------------------------------
const API_BASE = (() => {
  const hostname = window.location.hostname;

  // If accessing via mobile (IP address), use laptop's IP
  // But if hostname is empty (file://) or localhost, use local backend
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
    return "http://127.0.0.1:8000";
  }

  // Otherwise (e.g. deployed on Vercel/Render), use the cloud backend
  return 'https://tinko-clean-backend.onrender.com';
})();

const PROFILE_URL = `${API_BASE}/v1/customer/profile`;

console.log('Using API Base:', API_BASE);

// --------------------------------
// DOM ELEMENTS
// --------------------------------
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const emailInput = document.getElementById("login_email");
const otpInput = document.getElementById("otp_code");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const resendOtp = document.getElementById("resendOtp");
const loginMessage = document.getElementById("loginMessage");

// --------------------------------
// MESSAGE HELPER
// --------------------------------
function setMessage(msg, isError = false) {
  if (loginMessage) {
    loginMessage.textContent = msg;
    loginMessage.style.color = isError ? "#f87171" : "#34d399";
  }
}

// --------------------------------
// SEND OTP
// --------------------------------
if (sendOtpBtn) {
  sendOtpBtn.addEventListener("click", async () => {
    const email = emailInput?.value.trim();
    if (!email) return alert("Enter a valid email");

    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent = "Sending...";

    try {
      const res = await fetch(`${API_BASE}/v1/auth/email/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setMessage("OTP sent to your email.");
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
      } else {
        setMessage("Failed to send OTP. Please try again.", true);
      }
    } catch (err) {
      console.error("SEND OTP ERROR:", err);
      setMessage("Backend unreachable. Check API.", true);
    } finally {
      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = "Send OTP";
    }
  });
}

// --------------------------------
// VERIFY OTP
// --------------------------------
if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener("click", async () => {
    const otp = otpInput?.value.trim();
    const email = emailInput?.value.trim();

    if (!otp) return alert("Enter OTP");

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = "Verifying...";

    try {
      const res = await fetch(`${API_BASE}/v1/auth/email/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();
      console.log("Verify OTP Response:", data);

      const accessToken = data.access_token;

      if (accessToken) {
        setMessage("Login successful! Redirecting...");
        await handlePostLoginRedirect(accessToken);
      } else {
        setMessage("Login failed: no token received.", true);
      }
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err);
      setMessage("Backend unreachable. Check API.", true);
    } finally {
      verifyOtpBtn.disabled = false;
      verifyOtpBtn.textContent = "Verify OTP";
    }
  });
}

// --------------------------------
// RESEND OTP
// --------------------------------
if (resendOtp) {
  resendOtp.addEventListener("click", () => {
    if (sendOtpBtn) sendOtpBtn.click();
  });
}

// --------------------------------
// REDIRECT AFTER LOGIN
// --------------------------------
async function handlePostLoginRedirect(token) {
  try {
    localStorage.setItem("tinko_access_token", token);

    const res = await fetch(PROFILE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    if (res.ok) {
      window.location.href = "dashboard/index.html";
    } else if (res.status === 404) {
      window.location.href = "dashboard/onboarding.html";
    } else {
      window.location.href = "dashboard/index.html";
    }
  } catch (err) {
    console.error("POST LOGIN REDIRECT ERROR:", err);
    window.location.href = "dashboard/index.html";
  }
}
