// Initialize firebase
import Firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import config from '../config/firebase.config.js'

const FirebaseApp = Firebase.initializeApp(config)
const db = FirebaseApp.database()

export default db
