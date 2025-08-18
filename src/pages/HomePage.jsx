import React, { useEffect, useState } from 'react';




import { setTodo,addTodo,updateTodo,deleteTodo } from '../features/todo/todoSlice';

import { useSelector,useDispatch } from 'react-redux';

import { getTodoTask,addTodoTask,editTodoTask,deleteTodoTask } from '../services/todoServices';

const HomePage = () => {

    const {user}=useSelector((state)=>state.auth)
    const {todos}=useSelector((state)=>state.todos)

    const dispatch=useDispatch();


    const [task,setTask]=useState('')
    const [description,setDescription]=useState("");


    useEffect(()=>{
        const fetchTodo=async()=>{
            const data=await getTodoTask();
            dispatch(setTodo(data))
        };
        fetchTodo();
    },[dispatch]);



    const handleAddTask = async ()=>{
        
        const newTask= await addTodoTask({task,description,status:"pending"});

        dispatch(addTodo(newTask))

        setTask("")
        setDescription("")
    }

    const handleDelete = async (id)=>{
        await deleteTodoTask(id)
        dispatch(deleteTodo(id))
    }

    const  handleStatus = async (todo)=>{
        const  updated = await editTodoTask(todo._id,{
            ...todo,
            status:todo.status=="pending" ? "completed" : "pending"
        })

        dispatch(updateTodo(updated))
    }



return (
  <div className="bg-black min-h-screen flex justify-center items-start pt-10">
    <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl mb-4 text-center">Welcome, {user?.name}</h1>

      {/** Task adding */}
      <div className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-600"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-600"
        />
        <button
          onClick={handleAddTask}
          className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded font-semibold"
        >
          Add Task
        </button>
      </div>

      {/** Task list */}
      <div className="flex flex-col gap-4">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="p-4 bg-gray-800 rounded flex justify-between items-center"
          >
            <div>
              <h3
                className={`text-lg font-semibold ${
                  todo.status === "completed" ? "line-through" : ""
                }`}
              >
                {todo.task}
              </h3>
              <p>{todo.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatus(todo)}
                className={`px-3 py-1 rounded ${
                  todo.status === "pending" ? "bg-green-600" : "bg-yellow-600"
                }`}
              >
                {todo.status}
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="px-3 py-1 rounded bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


}

export default HomePage;
