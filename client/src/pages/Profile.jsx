import { NavLink } from "react-router-dom";
import "../assets/global.css";
import { useUser } from "../context/userContext";

function Profile() {
  const { user } = useUser();
  if (!user) {
    return;
  }

  const img = "https://i.pravatar.cc/120";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="avatar-box">
          <img src={img} alt="avatar" className="avatar" />
        </div>

        <h2 className="profile-name">{user.name}</h2>

        <p className="profile-email">{user.email}</p>

        <p className="profile-joined">
          Joined: <span>{user.createAt}</span>
        </p>

        <NavLink
          to={`/profile-edit/${user._id}`}
          className="edit-btn"
          style={{ textDecoration: "none" }}
        >
          Edit Profile
        </NavLink>
      </div>
    </div>
  );
}

export default Profile;
