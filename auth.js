const step2 = document.getElementById("step2");
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
