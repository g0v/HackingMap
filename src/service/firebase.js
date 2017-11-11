// Initialize firebase
import Firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'
import config from '../config/firebase.config.js'

const FirebaseApp = Firebase.initializeApp(config)

// Firebase Realtime Database
const db = FirebaseApp.database()

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = FirebaseApp.storage()

// Firebase Auth
// TODO: add signInWithGoogle, signOut...

export { db, storage }
