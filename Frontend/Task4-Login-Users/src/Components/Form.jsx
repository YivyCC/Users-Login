import ErrorMsg from "./ErrorMsg.jsx";
import Button from "./Button.jsx";
import { useState } from "react";
import axios from "axios";


function Form({ onLoginSuccess }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setIsError] = useState({ msg: '', open: false });
  // const baseApiUrl = import.meta.env.VITE_API_URL;

  const clientAxios = axios.create({
    baseURL: `https://users-login-tu6t.onrender.com/api`,
  });

  // Handle form submission for Register or Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      firstName,
      lastName,
      email,
      password,
      isActive,
    };

    try {
      if (isRegistered) {
        await handleLogin(userData);
      } else {
        await handleRegister(userData);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await clientAxios.post(`/registerNewUser`, userData);
      alert('User registered:', response.data);
      setIsRegistered(true); // Switch to login after successful registration
    } catch (err) {
      console.error('Error registering user:', err);
      setIsError({msg: 'This email address is already registered. Please use a different one or try logging in.', open: true});
    }
  };

  const checkIfUserBlocked = async () => {
    // try {
      const response = await clientAxios.get(`/users/${email}`);
      if (response.status === 200) {
        console.log("Response is OK:", response.data);
      } else {
        console.log("Unexpected response:", response.status, response.data);
      }
      const loggedInUser = response.data;
      if (loggedInUser.isblocked) {
        setIsError({msg: 'Your account is blocked. Wait until you are unblocked or register a new account.', open: true});
        return true; // User is blocked
      } else return false;
    // } catch (error) {
    //   console.error("Error fetching user data when retrieving email:", error.response || error);
    //   return true; // If there's an error, return true to stop further execution
    // }
  }; 

  // Login the user
  const handleLogin = async () => {
    const isBlocked = await checkIfUserBlocked();
    if (isBlocked) {
      return;
    }
    try {
      const response = await clientAxios.post(`/login`, {
        email,
        password,
      });

      if (response.data.success) {
        onLoginSuccess(email, response.data.user.name); // Notify App.jsx that login was successful
        await updateLoginDetails(email);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setIsError({msg: 'The email or password you entered is incorrect. Please try again.', open: true});
    }
  };

  // Send a request to update 'isActive' and 'last_login_time' in the database
  const updateLoginDetails = async (email) => {
    try {
      const response = await axios.put(`${baseApiUrl}/updateLoginDetails`, {
        email,
      });
    } catch (err) {
      console.error("Error updating user details:", err);
      setIsError({msg: 'Error updating user details.', open: true});
    }
  };

  // Handle closing the error message
  const handleCloseError = () => {
    setIsError({ ...error, open: false });
  };

  return (
    <main className="flex justify-center place-items-center w-full h-full box-border">
      <form
      className="box-border flex flex-col gap-10 w-8/10 max-w-md lg:w-7/10 xl:max-w-lg h-5/10 text-white p-5"
      method="POST"
      onSubmit={handleSubmit}
      >
        <ErrorMsg msg={error.msg} open={error.open} onClose={handleCloseError} />
        {isRegistered ? (
          <>
            <h2 className="text-4xl">Welcome back!</h2>
            <p className="text-gray-400">Don't have an account?{' '}
              <a className="text-emerald-400 cursor-pointer hover:underline" onClick={() => { setIsRegistered(false); }}>Register</a>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl">Create an account</h2>
            <p className="text-gray-400">Already have an account?{' '}
              <a className="text-emerald-400 cursor-pointer hover:underline" onClick={() => { setIsRegistered(true); }}>Log in</a>
            </p>
            <div className="flex justify-between">
              <input
                type="text"
                placeholder="First Name"
                required
                className="border border-transparent rounded-sm outline-0 bg-gray-600 focus:border text-white focus:border-emerald-200 box-border p-2 focus:text-white w-5/11"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="border border-transparent rounded-sm outline-0 bg-gray-600 focus:border text-white focus:border-emerald-200 box-border p-2 focus:text-white w-5/11"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          className="border border-transparent rounded-sm outline-0 bg-gray-600 focus:border text-white focus:border-emerald-200 box-border p-2 focus:text-white w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          minLength={1}
          required
          className="border border-transparent rounded-sm outline-0 bg-gray-600 focus:border text-white focus:border-emerald-200 box-border p-2 focus:text-white w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button content={isRegistered ? "Log in" : "Create account"} />
      </form>
    </main>
  );
}

export default Form;
