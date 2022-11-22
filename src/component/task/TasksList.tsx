import { collection, deleteDoc,updateDoc, doc, onSnapshot } from 'firebase/firestore';
import React, { ChangeEvent, useState, useEffect } from 'react'
import { dataBase } from '../../firebase';

type firebaseStateType = {
  completed: boolean
  descr: string
  file: string
  id: string
  timestamp: any
  title: string
}

export const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<firebaseStateType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true)
    const unsub = onSnapshot(collection(dataBase, 'ToDoList'), (snapshot) => {
      let list:firebaseStateType[] = [];
      snapshot.docs.forEach((doc:any) => {
        list.push({id:doc.id, ...doc.data()})
        setTasks(list);
        setLoading(false);
      }, (error:string) => console.log(error))
      return () => {unsub()};
    }) 
  },[])

  const handleChangeID = (id:string) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setTasks(tasks.map(task => task.id === id ? 
        {...task, [e.target.name]: e.target.value}:
        {...task}
      ))
    }
    return handleChange
  }

  const handleEdit = async (task:firebaseStateType, title:string, id: string) => {
    try{
        await updateDoc(doc(dataBase, 'ToDoList', task.id), { title: title })
    }catch(error){
      console.log(error)
    }
  };

  const toggleComplete = async (task:firebaseStateType) => {
    await updateDoc(doc(dataBase, 'ToDoList', task.id), { completed: !task.completed });
  };

  const handleDelete = async(id: string) => {
    try{
      await deleteDoc(doc(dataBase, 'ToDoList', id));
      setTasks(tasks.filter((task:firebaseStateType)=> task.id !== id))
    }catch(error){
      console.log(error)
    }
  }

  const transforDate = (dateCreate:any) => {
    let date = dateCreate.toDate();
    
    return date.toString()
  }

  return (
    <div>
      {tasks && tasks.map((task:firebaseStateType)=>(
        <div key={task.id}>
          <br />
          <input 
            type="text"
            name='title'
            value={task.title}
            onChange={handleChangeID(task.id)}
            onKeyDown={e => {
              if( e.keyCode === 13) 
                handleEdit(task,task.title, task.id)
            }}
          />
          {/* <p>{transforDate(task.timestamp)}</p> */}
          <p>{task.descr}</p>
          <img src={task.file} alt="img"/>
          <p>{task.id}</p>
          <button onClick={()=>toggleComplete(task)}>Done</button>
          <button onClick={()=>handleEdit(task,task.title , task.id)}>Edit</button>
          <button onClick={()=>handleDelete(task.id)}>Del</button>
        </div>
      ))}
    </div>
  )
}


