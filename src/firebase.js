import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase config — these values are safe to include in client-side code.
// Security is enforced entirely by Firestore rules (see firestore.rules).
const firebaseConfig = {
  apiKey:            "AIzaSyCTNM3mGMJDb_FKGQxosGWHCiAKUYc3w1M",
  authDomain:        "guess-half-the-mean.firebaseapp.com",
  projectId:         "guess-half-the-mean",
  storageBucket:     "guess-half-the-mean.firebasestorage.app",
  messagingSenderId: "732091624132",
  appId:             "1:732091624132:web:5c1c6b1767f174ab203791",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
