import axios from "axios";



const API = axios.create({
    baseURL:"http://localhost:4000/todo",
    headers:{
        "Content-Type":"application/json"
    }
});



const getTodoTask=async ()=>{
    const res=await API.get("/",{
        headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
    });
    return res.data
}

const addTodoTask=async()=>{
    const res=await API.post("/",{
        headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
    });
    return res.data
}


const editTodoTask=async ()=>{
    const res = await API.put("/",{
        headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
    });
    return res.data
}

const deleteTodoTask=async()=>{
    const res = await API.delete("/",{
        headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
    });
    return res.data
}



export {getTodoTask,addTodoTask,editTodoTask,deleteTodoTask}