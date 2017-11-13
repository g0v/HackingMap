// Initialize firebase
import Firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'

const FirebaseApp = Firebase.initializeApp({
  apiKey: 'AIzaSyBt4bk9EhaxpYaZygrEfRUPYUUuzgnnEiM',
  authDomain: 'g0v-hackingmap.firebaseapp.com',
  databaseURL: 'https://g0v-hackingmap.firebaseio.com',
  projectId: 'g0v-hackingmap',
  storageBucket: 'g0v-hackingmap.appspot.com',
  messagingSenderId: '614284673952',
})

// Firebase Realtime Database
const db = FirebaseApp.database()

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = FirebaseApp.storage()

// Firebase Auth
// TODO: add signInWithGoogle, signOut...

export { db, storage }
