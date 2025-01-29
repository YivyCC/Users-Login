import BlockBtn from './BlockBtn.jsx'
import UnblockBtn from './UnblockBtn.jsx'
import DeleteBtn from './DeleteBtn.jsx'
import ErrorMsg from './ErrorMsg.jsx'
import axios from 'axios'
import { useState } from 'react'

function Toolbar({usersData, setTableData, loggedUserEmail, setIsLoggedIn}) {
  const [error, setIsError] = useState({ msg: '', open: false });

  // Handle closing the error message
  const handleCloseError = () => {
    setIsError({ ...error, open: false });
  };

  // Check if the logged-in user is blocked
  const checkIfUserBlockedDeleted = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${loggedUserEmail}`);

      const loggedInUser = response.data;
      if (loggedInUser.isblocked) {
        setIsError({msg: 'Your account has been blocked. Redirecting you to the login page.', open: true});
        setIsLoggedIn(false); // Redirect to the login page
        updateIsActiveOffline(loggedUserEmail);
        return true; // User is blocked
      }
    } catch (error) {
      setIsError({msg: 'Your account has been deleted. Redirecting you to the login page.', open: true});
      setIsLoggedIn(false);
      console.error("You were deleted", error.response || error);
      return true; // If there's an error, assume the user was not found, hence deleted.
    }
    return false;
  };

  // Send a request to update 'isActive' and 'last_login_time' in the database
  const updateIsActiveOffline = async (email) => {
    try {
      const response = await axios.put("http://localhost:3000/api/updateIsActiveOffline", {
        email,
      });

      // if (response.data.success) {
      //   alert("User status changed to offline");
      // } else {
      //   console.error("Failed to update user status");
      // }
    } catch (err) {
      console.error("Error updating user details:", err);
    }
  };  

  // Handle block, unblock, delete actions
  const handleAction = async (action) => {
    // Check if user is blocked before proceeding with the action
    const isBlockedDeleted = await checkIfUserBlockedDeleted();
    if (isBlockedDeleted) {
      return; // If blocked, stop further execution
    }
    try {
      const response = await axios.post("http://localhost:3000/api/bulk-action", {
        action,
        users: usersData,
      });

      if (response.data.success) {
        setIsError({msg: `${action} successful for selected user(s)!`, open: true});
        
        // Update tableData without refetching
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
          }).filter((user) => user !== null); // Remove deleted users
        });

      } else {
        alert(`Failed to ${action} users.`);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      setIsError({msg: "An error occurred while performing the action.", open: true});
    }
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
