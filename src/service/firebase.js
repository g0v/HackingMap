// Initialize firebase
import Firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import config from '../config/firebase.config.js'

const FirebaseApp = Firebase.initializeApp(config)

// Firebase Realtime Database
const db = FirebaseApp.database()

// Firebase Auth
// TODO: add signInWithGoogle, signOut...

export { db }
