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
/**
 * Components output tasks
 * @component
 * Вывод списка задач
 */
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

  /**
   * Fucntion для ввода событий в формы
   * @param id идентифокатор задачи
   * @returns handleChange функцию обработчик
   */
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

  /**
   * Fucntion асинхронная для изменения загаловка или описания задачи
   * @param task  задача  ввиде объекта firebaseStateType
   * @param title  загаловок ввиде строки
   * @param descr  описание ввиде строки
   * @param id  индентификационный номер задачи ввиде строки
   */
  const handleEdit = async (
    task: firebaseStateType,
    title: string,
    descr: string,
    id: string,
  ) => {
    try {
      await updateDoc(doc(dataBase, 'ToDoList', task.id), { title, descr });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Fucntion асинхронная для отметки выполненой задачи
   * @param task задача  ввиде объекта firebaseStateType
   */

  const toggleComplete = async (task: firebaseStateType) => {
    await updateDoc(doc(dataBase, 'ToDoList', task.id), { completed: !task.completed });
  };

  /**
   * Fucntion асинхронная для удаления задачи
   * @param id индентификационный номер задачи ввиде строки
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(dataBase, 'ToDoList', id));
      setTasks(tasks.filter((task: firebaseStateType) => task.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Fucntion для преобразования времени в требуемый формат
   * @param time  время  ввиде числа
   * @returns  дату ввиде строки
   */
  const transforDate = (time: number) => {
    return dayjs(time).format('DD.MM.YY');
  };

  /**
   * Fucntion для преобразования времени в требуемый формат
   * @param dedline дата к которой необходимо закончить задачу ввиде строки
   * @returns возвращает количество оставшихся дней
   */
  const deadlineDate = (dedline: string) => {
    let deadtime = dayjs(Date.parse(dedline) - Date.now()).format('DD');

    return Date.parse(dedline) <= Date.now() ? '00' : deadtime;
  };

  return (
    <div className="list">
      {tasks &&
        tasks
          .sort(
            (first: firebaseStateType, last: firebaseStateType) =>
              last.timestamp - first.timestamp,
          )
          .map((task: firebaseStateType) => (
            <div className="task" key={task.id}>
              <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChangeID(task.id)}
                onKeyDown={e => {
                  if (e.keyCode === 13) handleEdit(task, task.title, task.descr, task.id);
                }}
                className={`task_title  ${task.completed ? 'task-complite' : ''}`}
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

              <p className="task_time task_time-start">
                от: {transforDate(task.timestamp)}
              </p>
              <p
                className={`task_time task_time-finish ${
                  Date.parse(task.deadline) <= Date.now() || task.completed
                    ? 'task_time-end'
                    : ''
                }`}
              >
                до: {transforDate(task.deadline)}
              </p>
              <p className="task_time task_time-deadline">
                осталось {deadlineDate(task.deadline)} дней
              </p>
              <button
                type="button"
                onClick={() => toggleComplete(task)}
                className="task_btn task_done"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => handleEdit(task, task.title, task.descr, task.id)}
                className="task_btn task_edit"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                className="task_btn task_del"
              >
                Del
              </button>
            </div>
          ))}
    </div>
  );
};
