import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { getDashboardTasks, editTodoTask } from '../services/todoServices';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [dashboardData, setDashboardData] = useState({
        assignedByMe: [],
        assignedToMe: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingIds, setUpdatingIds] = useState(new Set());

    useEffect(() => {
        if (!isAuthenticated || !token) {
            navigate('/auth');
            return;
        }
    }, [isAuthenticated, token, navigate]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isAuthenticated || !token) return;
            
            try {
                setLoading(true);
                setError('');
                const data = await getDashboardTasks();
                setDashboardData(data);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
                setError(error.message || 'Failed to fetch dashboard data');
                toast.error(error.message || 'Failed to fetch dashboard data');
                
                if (error.message.includes('token') || error.message.includes('unauthorized')) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuthenticated, token]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth');
        toast.info('Logged out successfully');
    };

    const handleStatusUpdate = async (taskId, currentStatus) => {
        try {
            setUpdatingIds(prev => new Set([...prev, taskId]));
            setError('');
            
            const newStatus = currentStatus === "pending" ? "completed" : "pending";
            
            
            const task = [...dashboardData.assignedByMe, ...dashboardData.assignedToMe]
                .find(t => t._id === taskId);
                
            if (!task) {
                throw new Error('Task not found');
            }
            
            await editTodoTask(taskId, {
                ...task,
                status: newStatus
            });
            
            const updatedData = await getDashboardTasks();
            setDashboardData(updatedData);
            
            toast.success(`Task marked as ${newStatus}`);
        } catch (error) {
            console.error('Status update error:', error);
            setError(error.message || 'Failed to update task status');
            toast.error(error.message || 'Failed to update task status');
        } finally {
            setUpdatingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const TaskCard = ({ task, showAssignInfo = false }) => (
        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start mb-3">
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
                </div>
                
                <button
                    onClick={() => handleStatusUpdate(task._id, task.status)}
                    disabled={updatingIds.has(task._id)}
                    className={`ml-4 px-3 py-1 rounded text-sm font-semibold transition-colors ${
                        updatingIds.has(task._id)
                            ? "bg-gray-600 cursor-not-allowed"
                            : task.status === "pending" 
                                ? "bg-yellow-600 hover:bg-yellow-700" 
                                : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {updatingIds.has(task._id) 
                        ? "..." 
                        : task.status === "pending" 
                            ? "Pending" 
                            : "Done"
                    }
                </button>
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span>Created: {formatDate(task.createdAt)}</span>
                {showAssignInfo && task.assignedTo && (
                    <span>• Assigned to: {task.assignedTo.name}</span>
                )}
                {showAssignInfo && task.assignedBy && (
                    <span>• Assigned by: {task.assignedBy.name}</span>
                )}
                {task.user && task.user.name && (
                    <span>• Owner: {task.user.name}</span>
                )}
            </div>
        </div>
    );

    const TimelineSection = ({ title, tasks, showAssignInfo, emptyMessage }) => (
        <div className="mb-8">
            <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <span className="ml-3 bg-indigo-600 text-white px-2 py-1 rounded-full text-sm">
                    {tasks.length}
                </span>
            </div>
            
            {tasks.length === 0 ? (
                <div className="text-center text-gray-400 py-8 bg-gray-800 rounded-lg">
                    <p>{emptyMessage}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <TaskCard 
                            key={task._id} 
                            task={task} 
                            showAssignInfo={showAssignInfo}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="bg-black min-h-screen flex justify-center items-center">
                <div className="text-white text-xl">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {user?.name || 'User'}!</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to="/home"
                            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white font-semibold transition-colors"
                        >
                            My Tasks
                        </Link>
                        <Link
                            to="/assign"
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold transition-colors"
                        >
                            Assign Tasks
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                
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

               
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-indigo-400">
                            {dashboardData.assignedByMe.length}
                        </div>
                        <div className="text-gray-300 text-sm">Assigned by Me</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-400">
                            {dashboardData.assignedToMe.length}
                        </div>
                        <div className="text-gray-300 text-sm">Assigned to Me</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                            {[...dashboardData.assignedByMe, ...dashboardData.assignedToMe]
                                .filter(task => task.status === 'pending').length}
                        </div>
                        <div className="text-gray-300 text-sm">Pending</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">
                            {[...dashboardData.assignedByMe, ...dashboardData.assignedToMe]
                                .filter(task => task.status === 'completed').length}
                        </div>
                        <div className="text-gray-300 text-sm">Completed</div>
                    </div>
                </div>

                
                <div className="space-y-8">
                    <TimelineSection 
                        title="Tasks Assigned by Me"
                        tasks={dashboardData.assignedByMe}
                        showAssignInfo={true}
                        emptyMessage="You haven't assigned any tasks yet. Go to your tasks and assign them to team members!"
                    />
                    
                    <TimelineSection 
                        title="Tasks Assigned to Me"
                        tasks={dashboardData.assignedToMe}
                        showAssignInfo={true}
                        emptyMessage="No tasks have been assigned to you yet."
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;