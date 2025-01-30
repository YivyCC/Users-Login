import BlockBtn from './BlockBtn.jsx'
import UnblockBtn from './UnblockBtn.jsx'
import DeleteBtn from './DeleteBtn.jsx'
import ErrorMsg from './ErrorMsg.jsx'
import axios from 'axios'
import { useState } from 'react'

function Toolbar({usersData, setTableData, loggedUserEmail, setIsLoggedIn}) {
  const [error, setIsError] = useState({ msg: '', open: false });
  const baseApiUrl = `https://users-login-tu6t.onrender.com/api`;

  // Handle block, unblock, delete actions
  const handleAction = async (action) => {
    // Check if user is blocked before proceeding with any action
    const isBlockedDeleted = await checkIfUserBlockedDeleted();
    if (isBlockedDeleted) {
      return;
    }
    try {
      const response = await axios.post(`${baseApiUrl}/bulk-action`, {
        action,
        users: usersData,
      });

      if (response.data.success) {
        setIsError({msg: `${action} successful for selected user(s)!`, open: true});
        
        // Update tableData without re-fetching
        setTableData((prevData) => {
          return prevData.map((user) => {
            if (usersData.includes(user.email)) {
              // Update the affected user's status based on the action
              if (action === "block") {
                return { ...user, isblocked: true };
              } else if (action === "unblock") {
                return { ...user, isblocked: false };
              } else if (action === "delete") {
                return null; // Set to null to filter it out later
              }
            }
            return user;
          }).filter((user) => user !== null); // Remove deleted users (null)
        });

      } else {
        setIsError({msg: `Failed to ${action} users.`, open: true});
      }
    } catch (error) {
      console.error("Error performing action:", error);
      setIsError({msg: `Failed to ${action} users.`, open: true});
    }
  };

  // Check if the logged-in user is blocked
  const checkIfUserBlockedDeleted = async () => {
    try {
      const response = await axios.get(`${baseApiUrl}/users/${loggedUserEmail}`);

      const loggedInUser = response.data;
      if (loggedInUser.isblocked) {
        setIsError({msg: 'Your account has been blocked. Redirecting you to the login page.', open: true});
        setTimeout(() => {
          setIsLoggedIn(false); // Notify Table.jsx to notify App.jsx to redirect to the login page
        }, 5000);
        updateIsActiveOffline(loggedUserEmail);
        return true;
      }
    } catch (error) {
      setIsError({msg: 'Your account has been deleted. Redirecting you to the login page.', open: true});
      setIsLoggedIn(false);
      console.error("You were deleted", error.response || error);
      return true; // If there's an error, assume the user was not found, hence deleted.
    }
    return false;
  };

  // Send a request to update 'isActive' and 'last_login_time' in the database if user gets logged out
  const updateIsActiveOffline = async (email) => {
    try {
      const response = await axios.put(`${baseApiUrl}/updateIsActiveOffline`, {
        email,
      });
    } catch (err) {
      console.error("Error updating user details:", err);
    }
  };  

  // Handle closing the error message
  const handleCloseError = () => {
    setIsError({ ...error, open: false });
  };

  return (
    <nav className='flex flex-col gap-5 w-max overflow-x-auto'>
      <aside>
        <ErrorMsg msg={error.msg} open={error.open} onClose={handleCloseError} />
      </aside>
      <span className='flex gap-5 h-10 mb-2 w-full'>
        <BlockBtn triggerAction={handleAction} />
        <UnblockBtn triggerAction={handleAction} />
        <DeleteBtn triggerAction={handleAction} />
      </span>
    </nav>
  )
}

export default Toolbar
