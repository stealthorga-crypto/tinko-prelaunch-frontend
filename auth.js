// auth.js

const API_BASE = "https://tinko-clean-backend.onrender.com"; 
// change if you deploy backend somewhere else

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");

const emailInput = document.getElementById("login_email");
const otpInput = document.getElementById("otp_code");
const loginMessage = document.getElementById("loginMessage");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const resendOtp = document.getElementById("resendOtp");

function setMessage(msg, isError = false) {
  if (!loginMessage) return;
  loginMessage.textContent = msg;
  loginMessage.className = isError
    ? "text-sm text-red-400 mt-2"
    : "text-sm text-emerald-300 mt-2";
}

// SEND OTP
if (sendOtpBtn) {
  sendOtpBtn.addEventListener("click", async () => {
    const email = (emailInput?.value || "").trim();

    if (!email) {
      alert("Enter a valid email");
      return;
    }

    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent = "Sending...";

    try {
      const res = await fetch(`${API_BASE}/v1/auth/auth/otp/send`, {
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
      console.error(err);
      setMessage("Backend unreachable. Check API.", true);
    } finally {
      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = "Send OTP";
    }
  });
}

// VERIFY OTP
if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener("click", async () => {
    const otp = (otpInput?.value || "").trim();
    const email = (emailInput?.value || "").trim();

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = "Verifying...";

    try {
      const res = await fetch(`${API_BASE}/v1/auth/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      if (res.ok) {
        setMessage("Login successful! Redirecting...");
        // TODO: change to your real dashboard route
        window.location.href = "/dashboard.html";
      } else {
        setMessage("Invalid OTP. Please try again.", true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Backend unreachable. Check API.", true);
    } finally {
      verifyOtpBtn.disabled = false;
      verifyOtpBtn.textContent = "Verify OTP";
    }
  });
}

// RESEND OTP
if (resendOtp) {
  resendOtp.addEventListener("click", () => {
    if (sendOtpBtn) {
      sendOtpBtn.click();
    }
  });
}
