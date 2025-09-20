import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, update, remove, push, child, onValue } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Observable } from 'rxjs';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ProductForm } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  db: any;
  storage: any;
  
  constructor() {
    this.setupFirebase();
    this.db = getDatabase();
    this.storage = getStorage();
  }

  setupFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyD9TqoEigVY1jZ-HaVZj3c9TKLbjZ8F-Vg",
      authDomain: "ikeabot-31638.firebaseapp.com",
      databaseURL: "https://ikeabot-31638-default-rtdb.firebaseio.com/",
      projectId: "ikeabot-31638",
      storageBucket: "ikeabot-31638.firebasestorage.app",
      messagingSenderId: "305342270246",
      appId: "1:305342270246:web:1575c941dafc1802e40fe7",
      measurementId: "G-6BEV47ZSS0"
    };
    
    initializeApp(firebaseConfig);
    const auth = getAuth(initializeApp(firebaseConfig));
  }

  createObject(path: string, data: any) {
    return set(ref(this.db, path), data);
  }

  async readObject(path: string, key: string): Promise<string> {
    return get(child(ref(this.db), `${path}/${key}`)).then((snapshot) => {
      if (snapshot.exists()) return snapshot.val();
    });
  }

  updateObject(path: string, key: string, data: any) {
    update(ref(this.db, `${path}/${key}`), data);
  }

  deleteObject(path: string, key: string) {
    remove(ref(this.db, `${path}/${key}`));
  }

  async readList(path: string): Promise<any[]> {
    const snapshot = await get(ref(this.db, path));
    const list: any[] = [];
    snapshot.forEach(childSnapshot => {
      list.push(childSnapshot.val());
    });
    return list;
  }

  addToList(path: string, data: any) {
    console.log('Adding to Firebase:', path, data);
    return push(ref(this.db, path), data).key;
  }

  removeFromList(path: string, key: string) {
    remove(ref(this.db, `${path}/${key}`));
  }

  getDataContinuously(field: string): Observable<[]> {
    return new Observable((observer) => {
      onValue(ref(this.db, field), (data) => {
        if (data.valueOf() != null)
          observer.next(data.val());
      });
    });
  }

  reset() {
    remove(ref(this.db, '/'));
  }

  uploadImage(file: File, filePath: string): Promise<string> {
    const fileRef = storageRef(this.storage, filePath);
    return uploadBytes(fileRef, file).then(snapshot => {
      return getDownloadURL(snapshot.ref);
    });
  }

  registerUser(email: string, password: string): Promise<any> {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  signInUser(email: string, password: string): Promise<any> {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  resetPassword(email: string): Promise<void> {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email);
  }

  deleteMessage(key: string): void {
    const confirmDelete = confirm("Are you sure you want to delete this message?");
    if (confirmDelete) {
      remove(ref(this.db, `/messages/${key}`));
    }
  }

  resetMessages(): void {
    remove(ref(this.db, '/messages'));
  }
}