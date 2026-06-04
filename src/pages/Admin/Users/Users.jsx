import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdPersonOutline } from "react-icons/md";

const Users = ({ url, token }) => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${url}/api/user/list`, { headers: { token } });
            if (response.data.success) {
                setUsers(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching users", error);
            toast.error("Error fetching users");
        }
    }

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token])

    return (
        <div className='animate-fadeIn'>
            <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h3 className='text-2xl font-black text-gray-800 mb-1'>All Users</h3>
                    <p className='text-sm text-gray-500'>View and manage registered users</p>
                </div>
                <button onClick={fetchUsers} className='w-fit px-6 py-2 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-xl font-bold transition-all border border-gray-100'>
                    Refresh Users
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className='text-left text-xs font-bold text-gray-400 uppercase tracking-widest px-6'>
                            <th className='pb-2 pl-6'>User</th>
                            <th className='pb-2'>Email</th>
                            <th className='pb-2'>Role</th>
                            <th className='pb-2'>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className='bg-gray-50/50 hover:bg-white transition-all group'>
                                <td className='py-4 pl-6 rounded-l-3xl border-y border-l border-transparent'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600'>
                                            <MdPersonOutline size={24} />
                                        </div>
                                        <p className='font-bold text-gray-700'>{user.name}</p>
                                    </div>
                                </td>
                                <td className='py-4 border-y border-transparent text-gray-600'>{user.email}</td>
                                <td className='py-4 border-y border-transparent'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {user.role || 'user'}
                                    </span>
                                </td>
                                <td className='py-4 pr-6 rounded-r-3xl border-y border-r border-transparent font-mono text-xs text-gray-400'>{user._id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {users.map((user, index) => (
                    <div key={index} className='bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex items-center gap-4'>
                        <div className='w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0'>
                            <MdPersonOutline size={28} />
                        </div>
                        <div className='flex-1'>
                            <p className='font-bold text-gray-800'>{user.name}</p>
                            <p className='text-sm text-gray-500 mb-1'>{user.email}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                {user.role || 'user'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Users
