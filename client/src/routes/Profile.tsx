import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

//import lettuce from '../assets/lettuce.png'
import './Profile.css'; // Import CSS for styling

import { useUserContext } from '../UserContext';

// Get server url
const PORT = process.env.REACT_APP_PORT || 5050;
const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

// Define a TypeScript interface for the component props
// ---------- UI Function for Profile Summary Card --------------------------
interface ProfileSummaryProps {
  refreshProfile: number
}

// const UploadImage : 

const ProfileSummary: React.FC<ProfileSummaryProps> = ({refreshProfile}) => {

  // START UPLOAD PICTURE
  //const [profileImage, setProfileImage] = useState<string>(imageUrl || lettuce); // State to handle profile image
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<String>(' ');
  const [profileImage, setProfileImage] = useState<string>(''); // State to handle profile image

  //const [imageFile, setImageFile] = useState<File | null>(null); // Store the image file itself so that it can be sent to the server

  // Effect to set the initial image if imageUrl is not provided
  // useEffect(() => {
  //   if (!imageUrl) {
  //     setProfileImage(lettuce);
  //   }
  // }, [imageUrl]);

  //effect to retrieve user profile from backend
  const { user } = useUserContext();

  const fetchUserProfile = async () => {
    try {
      // Fetch user profile details based on the user ID
      const profileResponse = await fetch(`http://localhost:6969/user/${user?.id}`);

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log(profileData);
        if (profileData.pfp) {
          setProfileImage(profileData.pfp);
        }

        if (profileData.username) {
          setUsername(profileData.username);
        }

        if (profileData.bio) {
          setBio(profileData.bio);
        } 
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (err) {
      console.error('error fetching user profile:', err)
    }
  }
  
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, refreshProfile]);

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
    const url = `http://localhost:${PORT}/user/pfp/${user?.id}`;
  
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
          <h2 className="profile-name">{username}</h2>
          <h2 className="profile-bio">{bio}</h2>
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
            <span className="summary-value">200</span> spent
          </p>
          <p className="summary-item">
            <span className="summary-value">300</span> paid back
          </p>
          <p className="summary-item">
            <span className="summary-value">15</span> items bought
          </p>
          <p className="summary-item">
            <span className="summary-value">150</span> owed
          </p>
        </div>
      </div>
    </div>
  );
};

//export default ProfileSummary (hardcoded for now. comes from server later);
// const profileProps = {
//    name: "Lettuce the Great",
//    joinedDate: "9/17/2024",
//    imageUrl: "",
//    spent: 500,
//    paidBack: 200,
//    itemsBought: 15,
//    amountOwed: 3000000,
// };


 // ---------- UI Function for Profile Setting --------------------------
 interface ProfileSettingsProps {
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  bio: string | undefined;
  setRefreshProfile: (value: number) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  id,
  username,
  email,
  password,
  bio,
  setRefreshProfile
}) => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(email);
  const [displayUsername, setDisplayUsername] = useState(username);
  const [displayPassword, setDisplayPassword] = useState(password);
  const [displayBio, setDisplayBio] = useState(bio);


  const [tempName, setTempName] = useState(email);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempPassword, setTempPassword] = useState(password);
  const [tempBio, setTempBio] = useState(bio);

  // state variable to track whether input fields are editable
  const [isEditing, setIsEditing] = useState(false);

  //update disply fields when props state change
  useEffect(() => {
    setDisplayName(email || '');
    setDisplayUsername(username || '');
    setDisplayPassword(password || '');
    setDisplayBio(bio || '');


    setTempName(email || '');
    setTempUsername(username || '');
    setTempPassword(password || '');
    setDisplayBio(bio || '');

  }, [email, username, password, bio]);

  // Event handler function for the button click
  const handleChangeNameClick = async () => {
      setDisplayName(tempName);
      alert(`${tempName} has been changed successfully`);
  
      const url = `http://localhost:${PORT}/user/${user?.id}`;

      try {
        console.log("email", displayName)
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: tempName, 
          }),
        });
    
        if (response.ok) {
          console.log('email updated successfully!');
          setRefreshProfile((prev) => prev + 1);
        } else {
          console.error('Failed to update email.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };
  const handleChangeUserNameClick = async () => {
    console.log("temp username", tempUsername)
    //if (isEditing == true) {
      setDisplayUsername(tempUsername);
      alert(`${tempUsername} has been changed successfully`);
    //}

    const url = `http://localhost:${PORT}/user/${user?.id}`;

    try {
      console.log("display username", displayUsername)
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: tempUsername, 
        }),
      });
  
      if (response.ok) {
        console.log('Username updated successfully!');
        setRefreshProfile((prev) => prev + 1);
      } else {
        console.error('Failed to update username.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  /*const handleChangePasswordClick = () => {
    if (isEditing == true) {
      alert(`${displayPassword} has been changed successfully`);
    }
  };*/
  // handles validation
  const handleChangePasswordClick = async () => {
    setDisplayPassword(tempPassword);
    alert("Password has been changed successfully");
      
    const url = `http://localhost:${PORT}/user/${user?.id}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: tempPassword, 
        }),
      });
  
      if (response.ok) {
        console.log('password updated successfully!');
        setRefreshProfile((prev) => prev + 1);
      } else {
        console.error('Failed to update password.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChangeBioClick = async () => {
    setDisplayPassword(tempBio);
    alert("Bio has been changed successfully");
      
    const url = `http://localhost:${PORT}/user/${user?.id}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: tempBio, 
        }),
      });
  
      if (response.ok) {
        console.log('bio updated successfully!');
        setRefreshProfile((prev) => prev + 1);
      } else {
        console.error('Failed to update bio.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Helper function to validate password
  const isValidPassword = (password: string): boolean => {
    // Check for minimum length of 12 characters
    const isLongEnough = password.length >= 12;
  
    // Check for at least one alphabet (case insensitive)
    const hasAlphabet = /[a-zA-Z]/.test(password);

    // Check for at least one number
    const hasNumber = /[0-9]/.test(password);

    return isLongEnough && hasAlphabet && hasNumber;
  };

  // Event handler to toggle edit mode or display mode
  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
    if (!isEditing) {
      setTempName(displayName);
      setTempUsername(displayUsername);
      setTempPassword(displayPassword);
      setTempBio(displayBio);
    }
  }

  const deleteAccount = () => {
    fetch(`${SERVER_URL}/user/${id}`, {
      method: "DELETE",
    })
    .then(() => {
      localStorage.removeItem("token");
      navigate("/signup");
    });
  }

  return (
    <div className="profile-settings-container">
      {/* Header Section */}
      <div className="profile-header">
        <h2>Profile</h2>
        <div className="profile-actions">
          <button className="delete-account" onClick={deleteAccount}>DELETE ACCOUNT</button>
          <button className="edit-profile" onClick={handleEditClick}> 
            {isEditing ? "DISPLAY PROFILE" : "EDIT PROFILE"}</button>
        </div>
      </div>

      {/* Profile Fields Section */}
      <div className="profile-fields">
        {/* Display Name */}
        <div className="profile-row">
          <label className="profile-label">Email</label>
          <input type="text" className="profile-input"
              value = {isEditing ? tempName : displayName}
              readOnly = {!isEditing} // doesn't allow users to change text field
              onChange={(e) => setTempName(e.target.value)} />
           {isEditing && (
              <button className="change-button" onClick={handleChangeNameClick}>CHANGE EMAIL</button>
           )}
        </div>

        {/* Username */}
        <div className="profile-row">
          <label className="profile-label">Username</label>
          <input type="text" className="profile-input"
              value = {isEditing ? tempUsername : displayUsername}
              readOnly = {!isEditing} // doesn't allow users to change text field
              onChange={(e) => setTempUsername(e.target.value)} />
          {isEditing && (
          <button className="change-button" onClick={handleChangeUserNameClick}>CHANGE USERNAME</button>
          )}
        </div>

        {/* Password */}
        <div className="profile-row">
          <label className="profile-label">Password</label>
          {/* Change input type based on isEditing state 
           type="password": This input type is specifically designed to hide user input, showing only a series of * */}
          <input type={isEditing ? "text" : "password"} // Use "password" type when not editing
              className="profile-input"
              value = {isEditing ? tempPassword : displayPassword}
              readOnly = {!isEditing} // doesn't allow users to change text field
              onChange={(e) => setTempPassword(e.target.value)} />
          {isEditing && (
          <button className="change-button" onClick={handleChangePasswordClick}>CHANGE PASSWORD</button>
          )}
        </div>

        {/* Bio */}
        <div className="profile-row">
          <label className="profile-label">Bio</label>
          {/* Change input type based on isEditing state 
           type="password": This input type is specifically designed to hide user input, showing only a series of * */}
          <input type={isEditing ? "text" : "bio"} // Use "password" type when not editing
              className="profile-input"
              value = {isEditing ? tempBio : displayBio}
              readOnly = {!isEditing} // doesn't allow users to change text field
              onChange={(e) => setTempBio(e.target.value)} />
          {isEditing && (
          <button className="change-button" onClick={handleChangeBioClick}>CHANGE BIO</button>
          )}
        </div>
      </div>
    </div>
  );
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
  const { user } = useUserContext();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [bio, setBio] = useState<string>('');


  const [refreshProfile, setRefreshProfile] = useState<number>(0);

  useEffect(() => {
    // Fetch user profile details after the user is available
    const fetchUserProfile = async () => {
      if (!user) return; // Ensure user is available

      try {
        const profileResponse = await fetch(`http://localhost:6969/user/${user?.id}`);

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('profile data', profileData);

          if (profileData.username) setUsername(profileData.username);
          if (profileData.email) setEmail(profileData.email);
          if (profileData.password) setPassword(profileData.password);
          if (profileData.bio) setBio(profileData.bio); // You may want to handle password securely
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (err) {
        console.error('error fetching user profile:', err);
      }
    };

    // Trigger fetch when user is available
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, refreshProfile]);

  // if (!user) return <div>Loading...</div>;

  const profileSettingsProps = {
    id: user?.id,
    username: username,
    email: email,
    password: password,
    bio: bio,
    setRefreshProfile
  }
  
  return (
    <div>
      {/* <ProfileSummary {...profileProps} /> */}
      <ProfileSummary refreshProfile={refreshProfile} />
      <ProfileSettings {...profileSettingsProps} />
      <Settings/>
    </div>
  );
};

export default Profile

