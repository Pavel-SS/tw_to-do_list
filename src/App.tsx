import React from 'react';
import './App.css';
import { AddTasks } from './component/task/AddTasks';
import { TasksList } from './component/task/TasksList';

export const App: React.FC = () => {
  return (
    <div>
      <h1>ToDo</h1>
      <AddTasks />
      <TasksList/>
    </div>
  )
}

