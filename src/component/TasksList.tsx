/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable padding-line-between-statements */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-magic-numbers */
/* eslint-disable prefer-const */
import React, { ChangeEvent, useState, useEffect } from 'react';

import dayjs from 'dayjs';
import { collection, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';

import { dataBase } from '../firebase';

type firebaseStateType = {
  completed: boolean;
  descr: string;
  file: string;
  id: string;
  timestamp: any;
  deadline: any;
  title: string;
};

export const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<firebaseStateType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(dataBase, 'ToDoList'), snapshot => {
      let list: firebaseStateType[] = [];

      snapshot.docs.forEach(
        (doc: any) => {
          list.push({ id: doc.id, ...doc.data() });
          setTasks(list);
          setLoading(false);
        },
        (error: string) => console.log(error),
      );

      return () => {
        unsub();
      };
    });
  }, []);

  const handleChangeID = (id: string) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setTasks(
        tasks.map(task =>
          task.id === id ? { ...task, [e.target.name]: e.target.value } : { ...task },
        ),
      );
    };
    return handleChange;
  };

  const handleEdit = async (
    task: firebaseStateType,
    title: string,
    descr: string,
    id: string,
  ) => {
    try {
      await updateDoc(doc(dataBase, 'ToDoList', task.id), { title: title, descr: descr });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleComplete = async (task: firebaseStateType) => {
    await updateDoc(doc(dataBase, 'ToDoList', task.id), { completed: !task.completed });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(dataBase, 'ToDoList', id));
      setTasks(tasks.filter((task: firebaseStateType) => task.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const transforDate = (time: any) => {
    return dayjs(time).format('DD.MM.YY');
  };
  const deadlineDate = (dedline: any, timeCreate: any) => {
    return dayjs(Date.parse(dedline) - timeCreate).format('DD');
  };

  return (
    <div className="list">
      {tasks &&
        tasks.map((task: firebaseStateType) => (
          <div className="task" key={task.id}>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChangeID(task.id)}
              onKeyDown={e => {
                if (e.keyCode === 13) handleEdit(task, task.title, task.descr, task.id);
              }}
              className="task_title"
            />
            <input
              type="text"
              name="descr"
              value={task.descr}
              onChange={handleChangeID(task.id)}
              onKeyDown={e => {
                if (e.keyCode === 13) handleEdit(task, task.title, task.descr, task.id);
              }}
              className="task_descr"
            />
            <img src={task.file} alt="img" className="task_img" />

            <p className="task_time-start">{transforDate(task.timestamp)}</p>
            <p className="task_time-finish">{transforDate(task.deadline)}</p>
            <p className="task_time-deadline">
              deadline {deadlineDate(task.deadline, task.timestamp)}
            </p>

            <button
              type="button"
              onClick={() => toggleComplete(task)}
              className="task_done"
            >
              Done
            </button>
            <button
              type="button"
              onClick={() => handleEdit(task, task.title, task.descr, task.id)}
              className="task_edit"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(task.id)}
              className="task_del"
            >
              Del
            </button>
          </div>
        ))}
    </div>
  );
};
