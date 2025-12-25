import { useState } from "react";
import { getToken } from "../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../context/userContext";

function ProfileEditpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = getToken();
  const navigate = useNavigate();
  const { id } = useParams();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      email,
      password,
    };
    const response = await fetch(
      `${import.meta.env.VITE_URL}/profile-edit/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      }
    );
    const data = await response.json();
    if (response.ok) {
      alert(`${data.message}`);
      setUser(data.result);
      navigate("/profile");
    } else {
      alert(`${data.message}`);
      console.log(`Error : ${data.result}`);
    }

    setEmail("");
    setPassword("");
  };

  const getProfileData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/profile/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setEmail(data.result.email);
        setPassword(data.result.password);
      } else {
        alert(`${data.message}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getProfileData();
      return;
    }
    console.log("fetch profile");
  }, [id]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>
          {" "}
          <FontAwesomeIcon icon={faUserEdit} /> Profile Info
        </h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className=" input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" type="submit">
          <FontAwesomeIcon icon={faEdit} /> Update Profile
        </button>
      </form>
    </div>
  );
}

export default ProfileEditpage;
