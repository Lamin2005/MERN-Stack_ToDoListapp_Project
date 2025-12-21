import { useState } from "react";
import "../assets/global.css";
import { useNavigate } from "react-router-dom";

export default function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem("email", email);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/forgotpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`${data.message}`);
        navigate("/verify-otp");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const Back = () => {
    setLoading(false);
    navigate("/auth?mode?signin");
    return;
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>🔒Forgot Password</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <button className="login-btn" type="submit">
          {loading ? "Sending OTP code..." : "Get OTP"}
        </button>
        <button className="login-btn" onClick={Back}>
          Back
        </button>
      </form>
    </div>
  );
}
