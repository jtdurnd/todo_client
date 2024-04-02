import { useState, useEffect, useRef } from "react"
import axios from 'axios'
import './Home.css'

export default function Home(){
  const [todos,setTodos] = useState([])
  const [task,setTask] = useState("")

  const inputRef = useRef()

  useEffect(() => {
    async function getData(){
      const result = await axios.get('http://localhost:3001/get')
      setTodos(result.data)
      inputRef.current.focus()  
    }
    getData()
  },[])

  const handleAdd = async () => {
    await axios.post('http://localhost:3001/add',{task:task})
    const result = await axios.get('http://localhost:3001/get')
    // console.log(result)
    setTodos(result.data) 
    inputRef.current.value = ""
    inputRef.current.focus()
  }

  const handleEdit = async (id) => {
    await axios.put('http://localhost:3001/update/'+id)
    const result = await axios.get('http://localhost:3001/get')
    setTodos(result.data)  
  }

  const handleDelete = async (id) => {
    await axios.delete('http://localhost:3001/delete/'+id)
    const result = await axios.get('http://localhost:3001/get')
    setTodos(result.data)  
  }

  return(
    <div className="home">
      <h2>Todo List</h2>
      <div className="create_form">
      <input type="text" placeholder="Enter Task" 
            onChange={(e) => setTask(e.target.value)}
            ref={inputRef}/>
      <button onClick={handleAdd}>Add</button>
      </div>
      {
        todos.length === 0
        ?
        <div><h2>No Record</h2></div>
        :
        todos.map(todo => (
          <div className="task" key = {todo._id}>
            <input type="checkbox" 
                  onChange={ () => handleEdit(todo._id)}
                  checked={todo.done ? "checked" : ""}/>
            <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
            <div>
              <button onClick={() => handleDelete(todo._id)}> Delete </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}
