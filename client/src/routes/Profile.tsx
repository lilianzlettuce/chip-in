import React, { useState, useEffect} from 'react';

import lettuce from '../assets/lettuce.png'
import './Profile.css'; // Import CSS for styling
import Layout from "../Layout";

// Define a TypeScript interface for the component props
// ---------- UI Function for Profile Summary Card --------------------------
interface ProfileSummaryProps {
  name: string;
  joinedDate: string;
  imageUrl: string;
  spent: number;
  paidBack: number;
  itemsBought: number;
  amountOwed: number;
}

// const UploadImage : 

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  name,
  joinedDate,
  imageUrl,
  spent,
  paidBack,
  itemsBought,
  amountOwed,
}) => {

  // START UPLOAD PICTURE
  //const [profileImage, setProfileImage] = useState<string>(imageUrl || lettuce); // State to handle profile image
  const [profileImage, setProfileImage] = useState<string>(imageUrl); // State to handle profile image

  //const [imageFile, setImageFile] = useState<File | null>(null); // Store the image file itself so that it can be sent to the server

  // Effect to set the initial image if imageUrl is not provided
  // useEffect(() => {
  //   if (!imageUrl) {
  //     setProfileImage(lettuce);
  //   }
  // }, [imageUrl]);

  //effect to retrieve user profile from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:6969/user/6702f13dee75c86e8e01f9bd`);
        if (response.ok) {
          const data = await response.json();
          if (data.pfp) {
            setProfileImage(data.pfp);
          }
        } else {
          console.error('failed to fetch user profile')
        }
      } catch (err) {
        console.error('error fetching user profile:', err)
      }
    }

    fetchUserProfile();
  });

  // Handler to update the image preview when a new image is uploaded
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageString = reader.result as string;
        setProfileImage(reader.result as string); // Update profile image state with uploaded image
        handleSubmit(imageString);
      };
      reader.readAsDataURL(file);

      //setImageFile(file); // Store the actual file in state
      // TBD:  Set the ImageFile for now, send the updated image to the server
       // Pass the file object to handleSubmit directly
    }
  };

  //send image to server
  const handleSubmit = async (base64String: string) => {
    const userId = '6702f13dee75c86e8e01f9bd'; // Hardcoded user ID for now
    const url = `http://localhost:6969/user/pfp/${userId}`;
  
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pfp: base64String, 
        }),
      });
  
      if (response.ok) {
        console.log('Profile picture updated successfully!');
      } else {
        console.error('Failed to update profile picture.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  // send to server
  // const handleSubmit = async (file: File | null) => {
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('file', file); // Attach the file to the form data
  
  //     try {
  //       const response = await fetch('your-server-endpoint/upload', {
  //         method: 'POST',
  //         body: formData,
  //       });
  //       if (response.ok) {
  //         console.log('Image uploaded successfully!');
  //       } else {
  //         console.error('Failed to upload image.');
  //       }
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //     }
  //   } else {
  //     console.warn('No image file selected.');
  //   }
  // };

  // END UPLOAD PICTURE

  return (
    <div className="profile-summary-card">
      {/* Profile Image and Information Section */}
      <div className="profile-section">
        {/*<img className="profile-image" src={lettuce} alt="logo"  />*/}
        <img className="profile-image" src={profileImage} alt="Profile"  />
        <div className="profile-info">
          <h2 className="profile-name">{name}</h2>
          <p className="profile-joined">Joined {joinedDate}</p>
          {/* UPLOAD IMAGE HERE */}
          {/* Update Picture Button and Hidden File Input */}
          <button
            className="upload-button"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            Update Picture
          </button>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }} // Hide the native file input
            onChange={handleImageUpload}
          />
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

//export default ProfileSummary (hardcoded for now. comes from server later);
const profileProps = {
   name: "Lettuce the Great",
   joinedDate: "9/17/2024",
   imageUrl: "",
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
  
  const [displayName, setDisplayName] = useState(name);
  const [displayUsername, setDisplayUsername] = useState(username);
  const [displayPassword, setDisplayPassword] = useState(password);

  //const [tempName, setTempName] = useState(displayName);
  //const [tempUsername, setTempUsername] = useState(displayUsername);
  //const [tempPassword, setTempPassword] = useState(displayPassword);
  // state variable to track whether input fields are editable
  const [isEditing, setIsEditing] = useState(false);

  // Event handler function for the button click
  const handleChangeNameClick = () => {
    //setSavedName(tempName);
    if (isEditing == true) {
      alert(`${displayName} has been changed successfully`);
    }
  };
  const handleChangeUserNameClick = () => {
    if (isEditing == true) {
      alert(`${displayUsername} has been changed successfully`);
    }
  };
  const handleChangePasswordClick = () => {
    if (isEditing == true) {
      alert(`${displayPassword} has been changed successfully`);
    }
  };

  // Event handler to toggle edit mode or display mode
  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
  }

  return (
    <div className="profile-settings-container">
      {/* Header Section */}
      <div className="profile-header">
        <h2>Profile</h2>
        <div className="profile-actions">
          <button className="delete-account">DELETE ACCOUNT</button>
          <button className="edit-profile" onClick={handleEditClick}> 
            {isEditing ? "DISPLAY PROFILE" : "EDIT PROFILE"}</button>
        </div>
      </div>

      {/* Profile Fields Section */}
      <div className="profile-fields">
        {/* Display Name */}
        <div className="profile-row">
          <label className="profile-label">Display Name</label>
          <input type="text" className="profile-input"
              value = {displayName}
              readOnly = {!isEditing} // doesn't allow users to change text field
              onChange={(e) => setDisplayName(e.target.value)} />
           {isEditing && (
              <button className="change-button" onClick={handleChangeNameClick}>CHANGE NAME</button>
           )}
        </div>

        {/* Username */}
        <div className="profile-row">
          <label className="profile-label">Username</label>
          <input type="text" className="profile-input"
              value = {displayUsername}
              readOnly = {!isEditing} // doesn't allow users to change text field
              onChange={(e) => setDisplayUsername(e.target.value)} />
          {isEditing && (
          <button className="change-button" onClick={handleChangeUserNameClick}>CHANGE USERNAME</button>
          )}
        </div>

        {/* Password */}
        <div className="profile-row">
          <label className="profile-label">Password</label>
          <input type="text" className="profile-input"
              value = {displayPassword}
              readOnly = {!isEditing} // doesn't allow users to change text field
              onChange={(e) => setDisplayPassword(e.target.value)} />
          {isEditing && (
          <button className="change-button" onClick={handleChangePasswordClick}>CHANGE PASSWORD</button>
          )}
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


// ---------- UI Function for Notification Settings --------------------------
const Settings: React.FC = () => {
  // State to track switch states
  const [householdAlerts, setHouseholdAlerts] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);

  // Toggle function for switches
  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prevState) => !prevState);
  };

  return (
    <div className="settings-container">
      {/* Settings Header */}
      <div className="settings-header">
        <h2>Settings</h2>
 
      </div>

      {/* Notifications Section */}
      <div className="notifications-section">
        <h3>Notifications</h3>
        <div className="notification-row">
          <div className="notification-item">
            <label className="notification-label">Household Alerts</label>
            <div className="toggle-container">
              <span className="toggle-label">ON</span>
              <input
                type="checkbox"
                className="toggle-switch"
                checked={householdAlerts}
                onChange={() => handleToggle(setHouseholdAlerts)}
              />
              <span className="toggle-label">OFF</span>
            </div>
          </div>
          <div className="notification-item">
            <label className="notification-label">Payment Reminders</label>
            <div className="toggle-container">
              <span className="toggle-label">ON</span>
              <input
                type="checkbox"
                className="toggle-switch"
                checked={paymentReminders}
                onChange={() => handleToggle(setPaymentReminders)}
              />
              <span className="toggle-label">OFF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  return (
    <Layout>
      <div>
        <ProfileSummary {...profileProps} />
        <ProfileSettings {...settingsProps} />
        <Settings/>
      </div>
    </Layout>
    
  );
};

export default Profile

