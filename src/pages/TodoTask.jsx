import { useEffect, useState } from "react";
import { getAllUsers } from "../services/api";
import { getUserTasks, assignTask } from '../services/todoServices';
import { toast } from 'react-toastify'; 

const TodoTask = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error(error);
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
                console.error(error);
            }
        };
        fetchTasks();
    }, []);

    const handleAssign = async (taskId) => {
        if (!selectedUser) {
            toast.info("select a user to assign ")
            return;
        }

        setLoading(true);
        try {
            await assignTask(taskId, selectedUser);
            const updatedTasks = await getUserTasks();
            setTasks(updatedTasks);
            setSelectedTask(null);
            setSelectedUser("");
            toast.success("Task assigned successfully!")
        } catch (error) {
            console.error("Assignment error:", error);
            toast.error('Failed to assign')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "black",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px"
        }}>
            <div style={{ width: "100%", maxWidth: "700px", textAlign: "center" }}>
                <h1 style={{ marginBottom: "20px" }}>Task Assignment</h1>

                <div style={{ marginBottom: "25px"}}>
                    <h2 style={{ marginBottom: "10px" }}>Available Users</h2>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                        {users.map((user) => (
                            <div
                                key={user._id}
                                style={{
                                    padding: "6px 12px",
                                    border: "1px solid #444",
                                    borderRadius: "5px",
                                    background: "#222",
                                    fontSize: "14px"
                                }}
                            >
                                {user.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 style={{ marginBottom: "10px" }}>My Tasks</h2>
                    {tasks.length === 0 ? (
                        <p>No tasks available</p>
                    ) : (
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {tasks.map((task) => (
                                <li
                                    key={task._id}
                                    style={{
                                        padding: "12px",
                                        border: "1px solid #444",
                                        borderRadius: "5px",
                                        marginBottom: "10px",
                                        background: "#1a1a1a",
                                        fontSize: "14px",
                                        textAlign: "left"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <strong>{task.task}</strong>
                                            {task.description && <p style={{ margin: "4px 0", color: "#aaa", fontSize: "13px" }}>{task.description}</p>}
                                            <small style={{ color: "#bbb", fontSize: "12px" }}>
                                                Status: {task.status} | Created: {new Date(task.createdAt).toLocaleDateString()}
                                            </small>
                                            {task.assignedTo && (
                                                <p style={{ margin: "4px 0", color: "#4da6ff", fontSize: "13px" }}>
                                                    Assigned to: {task.assignedTo.name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            {selectedTask === task._id ? (
                                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                    <select
                                                        value={selectedUser}
                                                        onChange={(e) => setSelectedUser(e.target.value)}
                                                        style={{ padding: "4px", fontSize: "13px" }}
                                                    >
                                                        <option value="">Select User</option>
                                                        {users.map((user) => (
                                                            <option key={user._id} value={user._id}>
                                                                {user.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => handleAssign(task._id)}
                                                        disabled={loading}
                                                        style={{
                                                            background: "#040605",
                                                            color: "white",
                                                            padding: "4px 8px",
                                                            border: "none",
                                                            borderRadius: "3px",
                                                            fontSize: "13px",
                                                            cursor: loading ? "not-allowed" : "pointer"
                                                        }}
                                                    >
                                                        {loading ? "Assigning..." : "Confirm"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTask(null);
                                                            setSelectedUser("");
                                                        }}
                                                        style={{
                                                            background: "#6c757d",
                                                            color: "white",
                                                            padding: "4px 8px",
                                                            border: "none",
                                                            borderRadius: "3px",
                                                            fontSize: "13px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedTask(task._id)}
                                                    style={{
                                                        background: "yellow",
                                                        color: "black",
                                                        padding: "6px 12px",
                                                        border: "none",
                                                        borderRadius: "3px",
                                                        fontSize: "13px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Assign
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoTask;
