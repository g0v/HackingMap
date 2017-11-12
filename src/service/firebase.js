import Firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

// Initialize Firebase
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

// Firebase Auth
const auth = FirebaseApp.auth()
const signInOptions = [
  Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  // firebase.auth.GithubAuthProvider.PROVIDER_ID,
]

export { db, auth, signInOptions }
