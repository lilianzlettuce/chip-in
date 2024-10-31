import React, { useState, useEffect, ChangeEvent } from 'react';
import bcrypt from 'bcryptjs';
import { useNavigate } from "react-router-dom";

import './Profile.css'; // Import CSS for styling

import { useUserContext } from '../UserContext';
import { Confirm } from '../components/Confirm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPencil, faUser } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

// Get server url
const PORT = process.env.REACT_APP_PORT || 5050;
const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

const defaultPFP = "data:image/jpeg;base64,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"

// Define a TypeScript interface for the component props
// ---------- UI Function for Profile Summary Card --------------------------
interface ProfileSummaryProps {
  refreshProfile: number
}

// const UploadImage : 

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ refreshProfile }) => {

  // START UPLOAD PICTURE
  //const [profileImage, setProfileImage] = useState<string>(imageUrl || lettuce); // State to handle profile image
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<String>(' ');
  const [profileImage, setProfileImage] = useState<string>(defaultPFP); // State to handle profile image

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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
        setAlertMessage("Profile picture updated successfully!");
        setIsAlertOpen(true);
        console.log('Profile picture updated successfully!');
      } else {
        setAlertMessage("Failed to update profile picture. Please recheck image size.");
        setIsAlertOpen(true);
        console.error('Failed to update profile picture.');

      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  // END UPLOAD PICTURE


  return (
    <div className="profile-summary-card">
      {/* Profile Image and Information Section */}
      <div className="profile-section">
        {/*<img className="profile-image" src={lettuce} alt="logo"  />*/}
        <img className="profile-image" src={profileImage} alt="Profile" />
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

      {/* Confirmation popup */}
      {isAlertOpen && (
        <div className="alert-modal">
          <div className="alert-modal-content">
            <p>{alertMessage}</p>
            <button onClick={() => setIsAlertOpen(false)}>Close</button>
          </div>
        </div>
      )}

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
  setRefreshProfile: React.Dispatch<React.SetStateAction<number>>;
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

  // Toggle confirmation modal for account deletion
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const openModal = () => setShowConfirmDelete(true);
  const closeModal = () => setShowConfirmDelete(false);

  // Alert modal
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Success modal
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);


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
    // alert(`${tempName} has been changed successfully`);
    setIsSuccessOpen(true);
    setSuccessMessage(`${tempName} has been changed successfully`);

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
    try {
      console.log("display username", displayUsername)
      const uniqueChkresponse = await fetch(`http://localhost:${PORT}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (uniqueChkresponse.ok) {
        const AllUsersData = await uniqueChkresponse.json();
        console.log('All users data', AllUsersData);

        const userexists = AllUsersData.find((user: { username: string }) => user.username === tempUsername);
        if (userexists) {
          console.log('error, ${tempUsername} exists');
          // alert(`Error: ${tempUsername} username already exists, please choose a different username`);
          setIsAlertOpen(true);
          setAlertMessage(`${tempUsername} username already exists, please choose a different username`);
          return;
        }
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (err) {
      console.error('error fetching user profile:', err);
    }

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
        console.log('Username ${tempUsername} updated successfully!');
        // alert(`Username ${tempUsername} updated successfully!`);
        setIsSuccessOpen(true);
        setSuccessMessage(`Username ${tempUsername} updated successfully!`);
        setDisplayUsername(tempUsername);
        setRefreshProfile((prev) => prev + 1);
      } else {
        console.error('Failed to update username.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePasswordInputClick = () => {
    if (isEditing) {
      setIsPasswordModalOpen(true);
    }
  };

  const handleVerifyCurrentPassword = async (currentPassword: string): Promise<boolean> => {
    try {
      const verifyResponse = await fetch(`http://localhost:${PORT}/auth/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user?.id, password: currentPassword }),
      });

      const verifyData = await verifyResponse.json();
      return verifyData.success === true; // Ensure this returns a boolean (true or false)
    } catch (error) {
      console.error("Error verifying password:", error);
      return false; // Return false on error
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const response = await fetch(`http://localhost:${PORT}/user/${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: hashedPassword,
        }),
      });

      if (response.ok) {
        setIsSuccessOpen(true);
        setSuccessMessage("Password has been changed.");
        setRefreshProfile((prev) => prev + 1);
      } else {
        console.error("Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleChangePasswordClick = () => {
    if (!tempPassword) {
      setIsAlertOpen(true);
      setAlertMessage("Password cannot be empty.");
      return;
    }

    setIsPasswordModalOpen(true);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
    setAlertMessage('');
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage('');
  };

  const handleChangeBioClick = async () => {
    setDisplayPassword(tempBio);
    setIsSuccessOpen(true);
    setSuccessMessage("Bio has been changed successfully")

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

  const isValidPassword = (password: string): boolean => {
    // Check for minimum length of 12 characters
    const isLongEnough = password.length >= 6 && password.length <= 25;

    // Check for at least one Upper case alphabet 
    const hasUpperAlphabet = /[A-Z]/.test(password);

    // Check for at least one Lower case alphabet 
    const hasLowerAlphabet = /[a-z]/.test(password);

    // Check for at least one number
    const hasNumber = /[0-9]/.test(password);

    const hasNoSpaces = !password.includes(' ');

    return isLongEnough && hasUpperAlphabet && hasLowerAlphabet && hasNumber && hasNoSpaces;
  };

  /*// Helper function to validate password
  const isValidPassword = (password: string): boolean => {
    // Check for minimum length of 12 characters
    const isLongEnough = password.length >= 12;
  
    // Check for at least one alphabet (case insensitive)
    const hasAlphabet = /[a-zA-Z]/.test(password);

    // Check for at least one number
    const hasNumber = /[0-9]/.test(password);

    return isLongEnough && hasAlphabet && hasNumber;
  };*/

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
      <div className="w-full text-lg text-left font-medium flex items-center justify-between gap-2 py-2 pb-4 border-solid border-gray-300 border-b-2">
        <div className="flex items-center gap-2">
          Profile
          <FontAwesomeIcon icon={faUser} className="fa-regular text-lg" />
        </div>

        <div className="profile-actions">
          <button className="pf-btn" onClick={handleEditClick}>
            {isEditing ?
              <span className="flex items-center gap-2">
                DISPLAY PROFILE
              </span>
              :
              <span className="flex items-center gap-2">
                EDIT PROFILE
                <FontAwesomeIcon icon={faPencil} className="fa-regular text-lg" />
              </span>
            }
          </button>
          <button className="pf-btn" onClick={openModal}>
            DELETE ACCOUNT
            <FontAwesomeIcon icon={faTrashAlt} className="fa-regular text-lg" />
          </button>
          <Confirm
            show={showConfirmDelete}
            onClose={closeModal}
            onConfirm={deleteAccount}
            message="Are you sure you want to delete your account?">
          </Confirm>
        </div>
      </div>

      {/* Profile Fields Section */}
      <div className="profile-fields">
        {/* Display Name */}
        <div className="profile-row">
          <label className="profile-label">Email</label>
          <input type="text" className="profile-input"
            value={isEditing ? tempName : displayName}
            readOnly={!isEditing} // doesn't allow users to change text field
            onChange={(e) => setTempName(e.target.value)} />
          {isEditing && (
            <button className="change-button" onClick={handleChangeNameClick}>CHANGE EMAIL</button>
          )}

          {/* confirmation popup */}
          {isSuccessOpen && (
            <div className="alert-modal">
              <div className="alert-modal-content">
                <h3>Success!</h3>
                <p>{successMessage}</p>
                <button onClick={closeSuccess}>Close</button>
              </div>
            </div>
          )}
        </div>

        {/* Username */}
        <div className="profile-row">
          <label className="profile-label">Username</label>
          <input type="text" className="profile-input"
            value={isEditing ? tempUsername : displayUsername}
            readOnly={!isEditing} // doesn't allow users to change text field
            onChange={(e) => setTempUsername(e.target.value)} />
          {isEditing && (
            <button className="change-button" onClick={handleChangeUserNameClick}>CHANGE USERNAME</button>
          )}

          {/* confirmation popup */}
          {isAlertOpen && (
            <div className="alert-modal">
              <div className="alert-modal-content">
                <h3>Error!</h3>
                <p>{alertMessage}</p>
                <button onClick={closeAlert}>Close</button>
              </div>
            </div>
          )}

          {/* confirmation popup */}
          {isSuccessOpen && (
            <div className="alert-modal">
              <div className="alert-modal-content">
                <h3>Success!</h3>
                <p>{successMessage}</p>
                <button onClick={closeSuccess}>Close</button>
              </div>
            </div>
          )}

        </div>

        {/* Password */}
        <div className="profile-row">
          <label className="profile-label">Password</label>
          {/* Change input type based on isEditing state 
           type="password": This input type is specifically designed to hide user input, showing only a series of * */}
          <input
            type={isEditing ? "text" : "password"}
            className="profile-input"
            value={isEditing ? tempPassword : displayPassword}
            readOnly={!isEditing}
            onClick={handlePasswordInputClick}
            onChange={(e) => setTempPassword(e.target.value)}
          />
          {isEditing && (
            <button className="change-button" onClick={handleChangePasswordClick}>
              CHANGE PASSWORD
            </button>
          )}

          <PasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            onVerify={handleVerifyCurrentPassword}
            onUpdatePassword={handleUpdatePassword}
          />

          {/* confirmation popup */}
          {isAlertOpen && (
            <div className="alert-modal">
              <div className="alert-modal-content">
                <h3>Error!</h3>
                <p>{alertMessage}</p>
                <button onClick={closeAlert}>Close</button>
              </div>
            </div>
          )}

          {/* confirmation popup */}
          {isSuccessOpen && (
            <div className="alert-modal">
              <div className="alert-modal-content">
                <h3>Success!</h3>
                <p>{successMessage}</p>
                <button onClick={closeSuccess}>Close</button>
              </div>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="profile-row">
          <label className="profile-label">Bio</label>
          {/* Change input type based on isEditing state 
           type="password": This input type is specifically designed to hide user input, showing only a series of * */}
          <input type={isEditing ? "text" : "bio"} // Use "password" type when not editing
            className="profile-input"
            value={isEditing ? tempBio : displayBio}
            readOnly={!isEditing} // doesn't allow users to change text field
            onChange={(e) => setTempBio(e.target.value)} />
          {isEditing && (
            <button className="change-button" onClick={handleChangeBioClick}>CHANGE BIO</button>
          )}

          {/* confirmation popup */}
          {isSuccessOpen && (
            <div className="alert-modal">
              <div className="alert-modal-content">
                <h3>Success!</h3>
                <p>{successMessage}</p>
                <button onClick={closeSuccess}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// PasswordModal Component
interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (currentPassword: string) => Promise<boolean>;
  onUpdatePassword: (newPassword: string) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onVerify, onUpdatePassword }) => {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleVerify = async () => {
    const verified = await onVerify(currentPassword);
    setIsVerified(verified);

    if (!verified) {
      setErrorMessage("Current password is incorrect.");
    } else {
      setCurrentPassword("");
      setErrorMessage("");
    }
  };


  const handlePasswordUpdate = () => {
    if (isValidPassword(newPassword)) {
      onUpdatePassword(newPassword);
      setNewPassword("");
      onClose();
      setErrorMessage("");
    } else {
      setErrorMessage("Password must be at least 6 and at most 25 characters long, contain at least one uppercase and one lowercase letter, one number, and no spaces.");
    }
  };

  const isValidPassword = (password: string): boolean => {
    return (
      password.length >= 6 &&
      password.length <= 25 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      !/\s/.test(password)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{isVerified ? "Enter New Password" : "Enter Current Password"}</h3>

        {!isVerified ? (
          <>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="modal-input"
            />
            <button onClick={handleVerify} className="modal-button verify-button">
              Verify
            </button>
          </>
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="modal-input"
            />
            <button onClick={handlePasswordUpdate} className="modal-button update-button">
              Update Password
            </button>
          </>
        )}

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <button onClick={onClose} className="modal-button cancel-button">
          Cancel
        </button>
      </div>
    </div>

  );
};


// ---------- UI Function for Notification Settings --------------------------
const Settings: React.FC = () => {
  const { user, updateUser } = useUserContext();

  // Currently user selected notif value
  const [expirationNotif, setExpirationNotif] = useState<string>();
  const [paymentNotif, setPaymentNotif] = useState<string>();

  // Popup modal
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Update display fields when props state change
  useEffect(() => {
    // Default selected values to current user notif settings
    setExpirationNotif(user?.preferences.expirationNotif);
    setPaymentNotif(user?.preferences.paymentNotif);
  }, [user]);

  // handle closing successful edits
  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupMessage('');
  };

  // Event handler function for the button click
  const handleSubmit = async () => {
    let newPrefs = {
      expirationNotif: expirationNotif,
      paymentNotif: paymentNotif
    };

    try {
      const response = await fetch(`http://localhost:${PORT}/user/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: newPrefs
        }),
      });

      if (response.ok) {
        console.log('user preferences updated successfully!');
        setIsPopupOpen(true);
        setPopupMessage("Settings successfully updated!");

        updateUser();
      } else {
        setIsPopupOpen(true);
        setPopupMessage("Sorry, there's been an error processing your request. Please try again later.");
        console.error('Failed to update email.');
      }
    } catch (error) {
      console.error('Error:', error);

      setIsPopupOpen(true);
      setPopupMessage("Sorry, there's been an error processing your request. Please try again later.");
    }
  };

  // Handler to update the state when the user selects a different option
  const handleSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.name == "expiration") {
      setExpirationNotif(event.target.value);
    } else {
      setPaymentNotif(event.target.value);
    }
  };

  return (
    <div className="settings-container">
      <div className="w-full text-lg text-left font-medium flex items-center justify-between gap-2 py-2 pb-4 border-solid border-gray-300 border-b-2">
        <div className="flex items-center gap-2">
          Settings
          <FontAwesomeIcon icon={faGear} className="fa-regular text-lg" />
        </div>
        <button className="pf-btn" onClick={handleSubmit}>
          SAVE CHANGES
          <FontAwesomeIcon icon={faFloppyDisk} className="fa-regular text-lg" />
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-4 p-4">
        <h3 className="text-left font-medium">Notifications</h3>
        <div className="flex justify-between">
          <div className="flex w-fit items-center justify-between gap-2 bg-navy p-4 px-6 rounded-md text-white">
            <label>Expiration notifications:</label>
            <div className="w-fit bg-navy p-1 rounded-md text-white border-solid border-2 border-white">
              <select name="expiration" value={expirationNotif} onChange={handleSelectionChange}
                className="bg-transparent block py-1 px-2">
                <option value="all">All</option>
                <option value="relevant">Relevant</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="flex w-fit items-center justify-between gap-2 bg-navy p-4 px-6 rounded-md text-white">
            <label>Payment notifications:</label>
            <div className="w-fit bg-navy p-1 rounded-md text-white border-solid border-2 border-white">
              <select name="payment" value={paymentNotif} onChange={handleSelectionChange}
                className="bg-transparent block py-1 px-2">
                <option value="all">All</option>
                <option value="relevant">Relevant</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="alert-modal text-lg font-medium">
          <div className="alert-modal-content">
            <h3 className="mb-4">{popupMessage}</h3>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
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
      <Settings />
    </div>
  );
};

export default Profile

function setIsPasswordModalOpen(arg0: boolean) {
  throw new Error('Function not implemented.');
}
