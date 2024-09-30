import React from 'react';

import lettuce from '../assets/lettuce.png'
import './Profile.css'; // Import CSS for styling
import Layout from "../Layout";

// Define a TypeScript interface for the component props
// ---------- UI Function for Profile Summary Card --------------------------
interface ProfileSummaryProps {
  name: string;
  joinedDate: string;
  //imageUrl: string;
  spent: number;
  paidBack: number;
  itemsBought: number;
  amountOwed: number;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  name,
  joinedDate,
  //imageUrl,
  spent,
  paidBack,
  itemsBought,
  amountOwed,
}) => {
  return (
    <div className="profile-summary-card">
      {/* Profile Image and Information Section */}
      <div className="profile-section">
        <img className="profile-image" src={lettuce} alt="logo"  />
        <div className="profile-info">
          <h2 className="profile-name">{name}</h2>
          <p className="profile-joined">Joined {joinedDate}</p>
        </div>
      </div>

      {/* Payment Summary Section */}
      <div className="payment-summary">
        <h3 className="summary-title">Payment Summary</h3>
        <div className="summary-details">
          <p className="summary-item">
            <span className="summary-value">${spent}</span> spent
          </p>
          <p className="summary-item">
            <span className="summary-value">${paidBack}</span> paid back
          </p>
          <p className="summary-item">
            <span className="summary-value">{itemsBought}</span> items bought
          </p>
          <p className="summary-item">
            <span className="summary-value">${amountOwed}</span> owed
          </p>
        </div>
      </div>
    </div>
  );
};

//export default ProfileSummary;
const profileProps = {
   name: "Lettuce the Great",
   joinedDate: "9/17/2024",
   //imageUrl: "lettuce",
   spent: 500,
   paidBack: 200,
   itemsBought: 15,
   amountOwed: 3000000,
 };


 // ---------- UI Function for Profile Setting --------------------------
 interface ProfileSettingsProps {
  name: string;
  username: string;
  password: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  name,
  username,
  password
}) => {
  return (
    <div className="profile-settings-container">
      {/* Header Section */}
      <div className="profile-header">
        <h2>Profile</h2>
        <div className="profile-actions">
          <button className="delete-account">DELETE ACCOUNT</button>
          <button className="edit-profile">EDIT PROFILE</button>
        </div>
      </div>

      {/* Profile Fields Section */}
      <div className="profile-fields">
        {/* Display Name */}
        <div className="profile-row">
          <label className="profile-label">Display Name</label>
          <label className="profile-input">{name}</label>
          <button className="change-button">CHANGE NAME</button>
        </div>

        {/* Username */}
        <div className="profile-row">
          <label className="profile-label">Username</label>
          <label className="profile-input">{username}</label>
          <button className="change-button">CHANGE USERNAME</button>
        </div>

        {/* Password */}
        <div className="profile-row">
          <label className="profile-label">Password</label>
          <label className="profile-input">{password}</label>
          <button className="change-button">CHANGE PASSWORD</button>
        </div>
      </div>
    </div>
  );
};

const settingsProps = {
  name: "Lettuce the Great",
  username: "@lettuce",
  password: "*************"
};

const Profile: React.FC = () => {
  return (
    <Layout>
      <div>
        <ProfileSummary {...profileProps} />
        <ProfileSettings {...settingsProps} />
      </div>
    </Layout>
    
  );
};

export default Profile

