import { useState } from "react"
import Form from "./Components/Form.jsx"
import Table from "./Components/Table.jsx"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserEmail, setloggedUserEmail] = useState('');
  const [loggedUserName, setloggedUserName] = useState('');

  const handleLoginSuccess = (email, name) => {
    setIsLoggedIn(true);
    setloggedUserEmail(email);
    setloggedUserName(name);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Table loggedUserEmail={loggedUserEmail} loggedUserName={loggedUserName} setIsLoggedIn={setIsLoggedIn} />
        </>
      ) : (
        <div className="flex w-full h-screen box-border">
          <main className="flex place-content-center place-items-center bg-gray-700 w-full lg:w-1/2 h-full">
            <Form onLoginSuccess={handleLoginSuccess} />
          </main>
          <aside className="bg-gray-200 hidden lg:flex h-full place-items-center place-content-center w-1/2 relative">
            <div className="w-60 h-60 bg-gradient-to-tr from-cyan-500 to-emerald-500 rounded-full animate-bounce" />
            <div className="w-full h-1/2 bg-white/10 backdrop-blur-lg absolute bottom-0" />
          </aside>
        </div>
      )}
    </>
  )
}

export default App