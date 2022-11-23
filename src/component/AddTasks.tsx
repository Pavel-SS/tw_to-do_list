/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
/* eslint-disable padding-line-between-statements */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { dataBase, getStorageFirebase } from './../firebase';

export const initialState = {
  title: '',
  descr: '',
  file: '',
  completed: false,
};
export type InitialStateType = typeof initialState;

export const AddTasks: React.FC = () => {
  const [data, setData] = useState<InitialStateType>(initialState);
  // destructuring data
  const { title, descr } = data;
  const [files, setFiles] = useState<any>(null);
  const [deadlineTime, setDeadlineTime] = useState();

  useEffect(() => {
    files && uploadFiles();
  }, [files]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addDoc(collection(dataBase, 'ToDoList'), {
      ...data,
      timestamp: Date.now(),
      deadline: deadlineTime,
    });
    setData(initialState);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

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
          <label className="custom-file-upload">
            Custom Upload
            <input type="file" onChange={(e: any) => setFiles(e.target.files[0])} />
          </label>
          <label className="custom-date_label">
            Дата окончания
            <input
              type="date"
              onChange={(e: any) => setDeadlineTime(e.target.value)}
              className="custom-date"
              required
            />
          </label>
        </div>
        <button>Add</button>
      </form>
    </div>
  );
};