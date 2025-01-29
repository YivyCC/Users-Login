import axios from 'axios';
import Toolbar from './Toolbar';
import { useEffect, useState } from 'react';

function Table({loggedUserEmail, loggedUserName, setIsLoggedIn}) {
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(()=>{
        const fetchData = async () =>{
            try{
                const response = await axios.get('http://localhost:3000/api/users');
                setTableData(response.data);
            } catch (err){
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    function lastSeen(lastLoginTimeDB){
        if (lastLoginTimeDB === null) return 'Never';
        const currentTime = new Date();
        const lastLoginTime = new Date(lastLoginTimeDB);
        const timeDifference = currentTime - lastLoginTime;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const years = Math.floor(days / 365);

        if (years > 0) {
            return years <= 1 ? `${years} year ago` : `${years} years ago`;
        } else if (days > 0) {
            return days <= 1 ? `${days} day ago` : `${days} days ago`;
        } else if (hours > 0) {
            return hours <= 1 ? `${hours} hour ago` : `${hours} hours ago`;
        } else if (minutes > 0) {
            return minutes <= 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
        } else {
            return seconds <= 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
        }
    }

    const [selectedUsers, setSelectedUsers] = useState([]); // Store selected user emails
    const [selectAll, setSelectAll] = useState(false);
    // Handle selecting/deselecting individual users
    const handleCheckboxChange = (userEmail) => {
        setSelectedUsers((prevSelected) =>
        prevSelected.includes(userEmail)
            ? prevSelected.filter((email) => email !== userEmail) // Deselect if already selected
            : [...prevSelected, userEmail] // Select if not selected
        );
    };

    // Handle select all checkbox
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedUsers([]); // Deselect all if already selected
        } else {
            setSelectedUsers(tableData.map((user) => user.email)); // Select all users by their emails
        }
        setSelectAll(!selectAll);
    };

    // Implement sorting
    const sortedTableData = [...tableData].sort((a, b) => {
        if (sortConfig.key === null) return 0;
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
        }
        setSortConfig({ key, direction });
    };


    return (
        <>
        <main className='flex flex-col gap-10 p-5 dark:bg-gray-700 w-full box-border overflow-auto'>
            <header className='flex justify-end place-items-center self-end max-w-4/10'>               
                <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 transition-all duration-300 ease-in-out"><span className="text-gray-900 dark:text-white">Hello,</span> {loggedUserName}<span className="text-gray-900 dark:text-white">!</span> 
                </h1>
            </header>
            {error && <div className='alert alert-error'>{error}</div>}

            <div className="overflow-x-auto shadow-md sm:rounded-lg box-border">
                <Toolbar usersData={selectedUsers} setTableData={setTableData} loggedUserEmail={loggedUserEmail} setIsLoggedIn={setIsLoggedIn} />
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input id="checkbox-all" 
                                    type="checkbox" checked={selectAll} 
                                    onChange={handleSelectAllChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"></input>
                                    <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>
                            Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('email')}>
                                Email {sortConfig.key === 'email' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('last_login_time')}>
                                Last Seen {sortConfig.key === 'last_login_time' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('isblocked')}>
                                Status {sortConfig.key === 'isblocked' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTableData.map((user) => (
                            <tr key={user.email} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id={`checkbox-${user.email}`}
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.email)}
                                            onChange={() => handleCheckboxChange(user.email)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                        />
                                        <label htmlFor={`checkbox-${user.email}`} className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {user.name}
                                </th>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.isactive ? 'Connected' : lastSeen(user.last_login_time)}</td>
                                <td className="px-6 py-4">{user.isblocked ? 'Blocked' : 'Active'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>

        </>
    )
}

export default Table;
