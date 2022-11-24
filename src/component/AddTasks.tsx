/* eslint-disable no-unused-expressions */

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { dataBase, getStorageFirebase } from '../firebase';

export const initialState = {
  title: '',
  descr: '',
  file: '',
  completed: false,
};
export type InitialStateType = typeof initialState;

/**
 * Components add new task
 * @component
 * Добавляем заголовок, описание, фотографию, дату окончания задачи
 */
export const AddTasks: React.FC = () => {
  const [data, setData] = useState<InitialStateType>(initialState);
  // destructuring data
  const { title, descr } = data;
  const [files, setFiles] = useState<any>(null);
  const [deadlineTime, setDeadlineTime] = useState();

  useEffect(() => {
    files && uploadFiles();
  }, [files]);

  /**
   * Function submit
   * @param e FormEvent используется для событий onSubmit
   * функция асинхронная, для размещения в storege
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addDoc(collection(dataBase, 'ToDoList'), {
      ...data,
      timestamp: Date.now(),
      deadline: deadlineTime,
    });
    setData(initialState);
    setFiles(null);
  };

  /**
   * Function для ввода событий в формы
   * @param e ChangeEvent<HTMLInputElement>
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  /**
   * Function для загрузки файлов в Storege
   */
  const uploadFiles = () => {
    const storegeRef = ref(getStorageFirebase, files.name);
    const uploadTask = uploadBytesResumable(storegeRef, files);

    uploadTask.on(
      'state_changed',
      null,
      error => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(getDownloadURL => {
          setData((item: any) => ({ ...item, file: getDownloadURL }));
        });
      },
    );
  };

  return (
    <div className="todo__add-task">
      <form className="todo__add-task_form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={title}
          placeholder="Задача"
          onChange={handleChange}
          className="task_input"
          required
        />
        <input
          type="text"
          name="descr"
          value={descr}
          placeholder="Описание"
          onChange={handleChange}
          className="task_input"
        />
        <div>
          <label htmlFor="file" className="file-upload">
            Загрузить{' '}
            <input
              type="file"
              id="file"
              onChange={(e: any) => setFiles(e.target.files[0])}
            />
            <div className={files ? `upload` : `upload-no`}>✓</div>
          </label>
          <label htmlFor="date" className="date_label">
            Дата окончания
            <input
              type="date"
              id="date"
              onChange={(e: any) => setDeadlineTime(e.target.value)}
              className="date"
              required
            />
          </label>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};
