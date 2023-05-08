import { FirebaseApp, initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  Database,
  getDatabase,
  get,
  child,
  ref,
  set,
  remove,
  onChildAdded,
} from 'firebase/database';
import { conf } from '../config';

class DatabaseServise {
  app: FirebaseApp;
  db: Database;
  initSkip = true;
  constructor() {
    try {
      this.app = initializeApp({
        ...conf.firebase,
      });
      const auth = getAuth();
      const email = conf.authFirebase.email ?? '';
      const password = conf.authFirebase.password ?? '';
      signInWithEmailAndPassword(auth, email, password).catch((error) => {
        const { code, message } = error;
        console.log(`${code} - ${message}`);
      });
      this.db = getDatabase(this.app);
      console.log('Successfully');
    } catch (e) {
      console.log('Application works without database!');
    }
  }

  getUsers(): Promise<ICollection<IUser>> {
    return new Promise((resolve) => {
      get(child(ref(this.db), 'users'))
        .then((snapshot) => resolve(snapshot.val()))
        .catch((error) => console.log(error));
    });
  }

  setUserListener(user: IUser): Promise<void> {
    return new Promise((resolve) => {
      set(ref(this.db, 'users' + '/' + user.id), user)
        .then(() => resolve())
        .catch((error) => console.log(error));
    });
  }

  updateAds(cb: (data: IAd) => void) {
    onChildAdded(ref(this.db, 'ads'), (snapshot) => {
      const data: IAd = snapshot.val();
      setTimeout(() => {
        this.initSkip = false;
      });
      if (this.initSkip) {
        return;
      }
      cb(data);
    });
  }

  getSavedAds(): Promise<ICollection<IAd>> {
    return new Promise((resolve) => {
      get(child(ref(this.db), 'ads'))
        .then((snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val() || {});
          } else {
            console.log('Not data available!');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  setNewAd(ad: IAd): Promise<any> {
    return new Promise((resolve, reject) => {
      set(ref(this.db, 'ads' + '/' + ad.id), ad)
        .then(() => resolve(''))
        .catch((error) => reject(error));
    });
  }

  removeOldAd(id: string): Promise<any> {
    return new Promise((resolve) => {
      resolve(remove(child(ref(this.db, 'ads'), id)));
    });
  }
}

const db = new DatabaseServise();
export default db;

export interface IUser {
  id: number;
  is_bot: boolean;
  username: string;
  first_name: string;
}

export interface ICollection<T> {
  [key: string]: T;
}

export interface IAd {
  title: string;
  id: string;
  price: string;
  url: string;
  createAd: string;
}
