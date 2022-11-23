/* eslint-disable prettier/prettier */
/* eslint-disable padding-line-between-statements */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCn2PWnimaeL1otlthpU-m68jiI_ZHRisM',
  authDomain: 'tw-todolist.firebaseapp.com',
  projectId: 'tw-todolist',
  storageBucket: 'tw-todolist.appspot.com',
  messagingSenderId: '329569768091',
  appId: '1:329569768091:web:5e1f135c82dfc14c7aec3e',
  measurementId: 'G-NY9BMSVZW4',
};

const app = initializeApp(firebaseConfig);
export const dataBase = getFirestore(app);
export const getStorageFirebase = getStorage(app);
