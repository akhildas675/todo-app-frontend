import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { getAllUsers } from "../services/api";
import { getUserTasks, assignTask } from '../services/todoServices';
import { toast } from 'react-toastify'; 

const TodoTask = () => {
    const { token, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAuthenticated || !token) {
            navigate('/auth');
            return;
        }
    }, [isAuthenticated, token, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Fetch users error:", error);
                setError("Failed to load users");
                toast.error("Failed to load users");
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getUserTasks();
                setTasks(data);
            } catch (error) {
                console.error("Fetch tasks error:", error);
                setError("Failed to load tasks");
                toast.error("Failed to load tasks");
                
                if (error.message && (error.message.includes('token') || error.message.includes('unauthorized'))) {
                    handleLogout();
                }
            }
        };
        fetchTasks();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth');
        toast.info('Logged out successfully');
    };

    const handleAssign = async (taskId) => {
        if (!selectedUser) {
            toast.info("Please select a user to assign the task to");
            return;
        }

        setLoading(true);
        try {
            await assignTask(taskId, selectedUser);
            const updatedTasks = await getUserTasks();
            setTasks(updatedTasks);
            setSelectedTask(null);
            setSelectedUser("");
            setError("");
            toast.success("Task assigned successfully!");
        } catch (error) {
            console.error("Assignment error:", error);
            setError(error.message || "Failed to assign task");
            toast.error(error.message || 'Failed to assign task');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="bg-black min-h-screen">
            <div className="container mx-auto px-4 py-6 max-w-4xl">

                {error && (
                    <div className="bg-red-600 text-white p-3 rounded mb-6 text-sm">
                        {error}
                        <button 
                            onClick={() => setError('')} 
                            className="ml-2 font-bold"
                        >
                            ×
                        </button>
                    </div>
                )}
     
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Task Assignment</h1>
                        <p className="text-gray-400">Assign your tasks to team members</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to="/home"
                            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white font-semibold transition-colors"
                        >
                            My Tasks
                        </Link>
                        <Link
                            to="/dashboard"
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold transition-colors"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

              

            
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        Available Users
                        <span className="ml-3 bg-indigo-600 text-white px-2 py-1 rounded-full text-sm">
                            {users.length}
                        </span>
                    </h2>
                    {users.length === 0 ? (
                        <div className="text-center text-gray-400 py-8 bg-gray-800 rounded-lg">
                            <p>No users available</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    className="p-3 bg-gray-800 rounded-lg border border-gray-700 text-center"
                                >
                                    <div className="text-white font-medium">{user.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

             
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        My Tasks
                        <span className="ml-3 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                            {tasks.length}
                        </span>
                    </h2>
                    
                    {tasks.length === 0 ? (
                        <div className="text-center text-gray-400 py-8 bg-gray-800 rounded-lg">
                            <p>No tasks available to assign</p>
                            <Link 
                                to="/home"
                                className="inline-block mt-3 text-indigo-400 hover:text-indigo-300 underline"
                            >
                                Create your first task
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-semibold ${
                                                task.status === "completed" 
                                                    ? "line-through text-gray-400" 
                                                    : "text-white"
                                            }`}>
                                                {task.task}
                                            </h3>
                                            
                                            {task.description && (
                                                <p className={`text-sm mt-1 ${
                                                    task.status === "completed" 
                                                        ? "text-gray-500" 
                                                        : "text-gray-300"
                                                }`}>
                                                    {task.description}
                                                </p>
                                            )}
                                            
                                            <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
                                                <span className={`px-2 py-1 rounded ${
                                                    task.status === "completed" 
                                                        ? "bg-green-600 text-white" 
                                                        : "bg-yellow-600 text-white"
                                                }`}>
                                                    {task.status}
                                                </span>
                                                <span>Created: {formatDate(task.createdAt)}</span>
                                                {task.assignedTo && (
                                                    <span className="text-blue-400">
                                                        Assigned to: {task.assignedTo.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="ml-4">
                                            {selectedTask === task._id ? (
                                                <div className="flex flex-col gap-2 min-w-[200px]">
                                                    <select
                                                        value={selectedUser}
                                                        onChange={(e) => setSelectedUser(e.target.value)}
                                                        className="p-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-indigo-500 focus:outline-none"
                                                    >
                                                        <option value="">Select User</option>
                                                        {users.map((user) => (
                                                            <option key={user._id} value={user._id}>
                                                                {user.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAssign(task._id)}
                                                            disabled={loading || !selectedUser}
                                                            className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-colors ${
                                                                loading || !selectedUser
                                                                    ? "bg-gray-600 cursor-not-allowed"
                                                                    : "bg-green-600 hover:bg-green-700"
                                                            }`}
                                                        >
                                                            {loading ? "Assigning..." : "Confirm"}
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTask(null);
                                                                setSelectedUser("");
                                                            }}
                                                            className="flex-1 py-2 px-3 bg-gray-600 hover:bg-gray-700 rounded text-sm font-semibold transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedTask(task._id)}
                                                    disabled={task.assignedTo}
                                                    className={`py-2 px-4 rounded text-sm font-semibold transition-colors ${
                                                        task.assignedTo
                                                            ? "bg-gray-600 cursor-not-allowed text-gray-400"
                                                            : "bg-yellow-600 hover:bg-yellow-700 text-black"
                                                    }`}
                                                >
                                                    {task.assignedTo ? "Already Assigned" : "Assign"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoTask;