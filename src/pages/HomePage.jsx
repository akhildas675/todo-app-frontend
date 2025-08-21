import React, { useEffect, useState } from 'react';
import { setTodo, addTodo, updateTodo, deleteTodo } from '../features/todo/todoSlice';
import { logout } from '../features/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getTodoTask, addTodoTask, editTodoTask, deleteTodoTask } from '../services/todoServices';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const HomePage = () => {
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const { todos } = useSelector((state) => state.todos);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    
    //task add delete update and edit 
    const [addingTask, setAddingTask] = useState(false);
    const [deletingIds, setDeletingIds] = useState(new Set());
    const [updatingIds, setUpdatingIds] = useState(new Set());
    
    const [editingId, setEditingId] = useState(null);
    const [editTask, setEditTask] = useState('');
    const [editDescription, setEditDescription] = useState('');
    
    useEffect(() => {
        if (!isAuthenticated || !token) {
            navigate('/auth');
            return;
        }
    }, [isAuthenticated, token, navigate]);

    useEffect(() => {
        const fetchTodos = async () => {
            if (!isAuthenticated || !token) return;
            
            try {
                setError('');
                const data = await getTodoTask();
                dispatch(setTodo(data));

            } catch (error) {
                console.error('Fetch todos error:', error);
                setError(error.message || 'Failed to fetch todos');
                toast.error(error.message || 'Failed to fetch todos');
                
                if (error.message.includes('token') || error.message.includes('unauthorized')) {
                    handleLogout();
                }
            } 
        };

        fetchTodos();
    }, [dispatch, isAuthenticated, token, navigate]);

    const handleAddTask = async () => {
        if (!task.trim()) {
            setError('Task is required');
            toast.error('Task is required');
            return;
        }

        try {
            setAddingTask(true);
            setError('');
            
            const newTask = await addTodoTask({
                task: task.trim(),
                description: description.trim(),
                status: "pending"
            });
            
            dispatch(addTodo(newTask));
            setTask('');
            setDescription('');
            
            toast.success('Task added successfully');
        } catch (error) {
            console.error('Add task error:', error);
            setError(error.message || 'Failed to add task');
            toast.error(error.message || 'Failed to add task'); 
            if (error.message.includes('token') || error.message.includes('unauthorized')) {
                handleLogout();
            }
        } finally {
            setAddingTask(false);
        }
    };

    const handleEdit = (todo) => {
        setEditingId(todo._id);
        setEditTask(todo.task);
        setEditDescription(todo.description || '');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTask('');
        setEditDescription('');
    };

    const handleSaveEdit = async (id) => {
        if (!editTask.trim()) {
            setError('Task is required');
            toast.error('Task is required');
            return;
        }

        try {
            setUpdatingIds(prev => new Set([...prev, id]));
            setError('');
            
            const updatedTodo = await editTodoTask(id, {
                task: editTask.trim(),
                description: editDescription.trim()
            });

            dispatch(updateTodo(updatedTodo));
            setEditingId(null);
            setEditTask('');
            setEditDescription('');
       
            toast.success('Task updated successfully');
        } catch (error) {
            console.error('Edit task error:', error);
            setError(error.message || 'Failed to edit task');
            toast.error(error.message || 'Failed to edit task');
            
            if (error.message.includes('token') || error.message.includes('unauthorized')) {
                handleLogout();
            }
        } finally {
            setUpdatingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            setDeletingIds(prev => new Set([...prev, id]));
            setError('');
            
            await deleteTodoTask(id);
            dispatch(deleteTodo(id));
          
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error('Delete task error:', error);
            setError(error.message || 'Failed to delete task');
            toast.error(error.message || 'Failed to delete task'); 
            
            if (error.message.includes('token') || error.message.includes('unauthorized')) {
                handleLogout();
            }
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleStatus = async (todo) => {
        try {
            setUpdatingIds(prev => new Set([...prev, todo._id]));
            setError('');
            
            const updated = await editTodoTask(todo._id, {
                ...todo,
                status: todo.status === "pending" ? "completed" : "pending"
            });

            dispatch(updateTodo(updated));
            
            if (updated.status === "completed") {
                toast.success('Task marked as completed');
            } else {
                toast.info('Task marked as pending');
            }
        } catch (error) {
            console.error('Update status error:', error);
            setError(error.message || 'Failed to update task status');
            toast.error(error.message || 'Failed to update task status');
            
            if (error.message.includes('token') || error.message.includes('unauthorized')) {
                handleLogout();
            }
        } finally {
            setUpdatingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(todo._id);
                return newSet;
            });
        }
    };

    const handleLogout = () => {
        dispatch(logout()); 
        navigate('/auth');
        toast.info('Logged out successfully');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !addingTask) {
            handleAddTask();
        }
    };

    const handleEditKeyPress = (e, id) => {
        if (e.key === 'Enter') {
            handleSaveEdit(id);
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    return (
        <div className="bg-black min-h-screen flex justify-center items-start pt-10">
            <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg text-white">
                {error && (
                    <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm">
                        {error}
                        <button 
                            onClick={() => setError('')} 
                            className="ml-2 font-bold"
                        >
                            ×
                        </button>
                    </div>
                )}

            
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-semibold transition-colors"
                    >
                        Logout
                    </button>
                </div>

             
                <div className="flex flex-col gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Add task..."
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="p-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
                        disabled={addingTask}
                        maxLength={100}
                    />
                    <input
                        type="text"
                        placeholder="Add description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="p-2 rounded bg-gray-800 border border-gray-600 focus:border-indigo-500 focus:outline-none"
                        disabled={addingTask}
                        maxLength={200}
                    />
                    <button
                        onClick={handleAddTask}
                        disabled={addingTask || !task.trim()}
                        className={`p-2 rounded font-semibold transition-colors ${
                            addingTask || !task.trim()
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {addingTask ? 'Adding...' : 'Add Task'}
                    </button>
                </div>

             
                <div className="flex gap-2 mb-6">
                    <Link
                        to='/assign'
                        className="flex-1 text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition-colors"
                    >
                        Assign Tasks
                    </Link>
                    <Link
                        to='/dashboard'
                        className="flex-1 text-center py-2 px-3 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold transition-colors"
                    >
                        Dashboard
                    </Link>
                </div>
                
              
                <div className="mb-4 text-sm text-gray-400 text-center">
                    Total: {todos.length} | 
                    Pending: {todos.filter(t => t.status === 'pending').length} | 
                    Completed: {todos.filter(t => t.status === 'completed').length}
                </div>

                
                <div className="flex flex-col gap-4">
                    {todos.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                            <p>No tasks yet. Please add a task!</p>
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <div
                                key={todo._id}
                                className="p-4 bg-gray-800 rounded transition-opacity"
                                style={{ 
                                    opacity: deletingIds.has(todo._id) ? 0.5 : 1 
                                }}
                            >
                                {editingId === todo._id ? (
                                   
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={editTask}
                                            onChange={(e) => setEditTask(e.target.value)}
                                            onKeyPress={(e) => handleEditKeyPress(e, todo._id)}
                                            className="p-2 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:outline-none text-white"
                                            maxLength={100}
                                            autoFocus
                                        />
                                        <input
                                            type="text"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            onKeyPress={(e) => handleEditKeyPress(e, todo._id)}
                                            placeholder="Description (optional)"
                                            className="p-2 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:outline-none text-white"
                                            maxLength={200}
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleSaveEdit(todo._id)}
                                                disabled={updatingIds.has(todo._id) || !editTask.trim()}
                                                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                                                    updatingIds.has(todo._id) || !editTask.trim()
                                                        ? 'bg-gray-600 cursor-not-allowed'
                                                        : 'bg-green-600 hover:bg-green-700'
                                                }`}
                                            >
                                                {updatingIds.has(todo._id) ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-3 py-1 rounded text-sm font-semibold bg-gray-600 hover:bg-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            Press Enter to save, Escape to cancel
                                        </div>
                                    </div>
                                ) : (
                                    
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1 mr-4">
                                            <h3
                                                className={`text-lg font-semibold ${
                                                    todo.status === "completed" 
                                                        ? "line-through text-gray-400" 
                                                        : "text-white"
                                                }`}
                                            >
                                                {todo.task}
                                            </h3>
                                            {todo.description && (
                                                <p className={`text-sm ${
                                                    todo.status === "completed" 
                                                        ? "text-gray-500" 
                                                        : "text-gray-300"
                                                }`}>
                                                    {todo.description}
                                                </p>
                                            )}
                                            {todo.createdAt && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Created: {new Date(todo.createdAt).toLocaleDateString()}
                                                </p>
                                            )}
                                            {todo.assignedTo && (
                                                <p className="text-xs text-blue-400 mt-1">
                                                    Assigned to: {todo.assignedTo.name}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => handleStatus(todo)}
                                                disabled={updatingIds.has(todo._id)}
                                                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                                                    updatingIds.has(todo._id)
                                                        ? "bg-gray-600 cursor-not-allowed"
                                                        : todo.status === "pending" 
                                                            ? "bg-yellow-600 hover:bg-yellow-700" 
                                                            : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >
                                                {updatingIds.has(todo._id) 
                                                    ? "..." 
                                                    : todo.status === "pending" 
                                                        ? "Pending" 
                                                        : "Done"
                                                }
                                            </button>
                                            
                                            <button
                                                onClick={() => handleEdit(todo)}
                                                className="px-3 py-1 rounded text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            
                                            <button
                                                onClick={() => handleDelete(todo._id)}
                                                disabled={deletingIds.has(todo._id)}
                                                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                                                    deletingIds.has(todo._id)
                                                        ? "bg-gray-600 cursor-not-allowed"
                                                        : "bg-red-600 hover:bg-red-700"
                                                }`}
                                            >
                                                {deletingIds.has(todo._id) ? "..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;