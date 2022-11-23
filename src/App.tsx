import React from 'react';

import './css/main.css';

import { AddTasks } from './component/AddTasks';
import { TasksList } from './component/TasksList';

export const App: React.FC = () => {
  return (
    <div className="todo">
      <h1>ToDo</h1>
      <AddTasks />
      <TasksList />
    </div>
  );
};
