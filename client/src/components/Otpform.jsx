import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpForm({ onSubmit, onResend }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert("Please enter 6 digit OTP");
      return;
    }

    const email = localStorage.getItem("email");

    const response = await fetch(`${import.meta.env.VITE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`${data.message}`);
      navigate("/reset-password");
    } else if (response.status === 400) {
      alert(`${data.message}`);
    } else {
      console.log(`Error ${data.message}`);
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setOtp("");
    navigate("/forgotpassword");
  };

  return (
    <div className="otp-container">
      <h2>🔐 OTP Verification</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength="6"
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        <button type="submit">Verify OTP</button>
      </form>

      {timeLeft > 0 ? (
        <p className="timer">
          OTP expires in <b>00:{timeLeft.toString().padStart(2, "0")}</b>
        </p>
      ) : (
        <button className="resend" onClick={handleResend}>
          Get Back OTP
        </button>
      )}
    </div>
  );
}
