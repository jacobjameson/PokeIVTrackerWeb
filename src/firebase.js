import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey:            "AIzaSyCTNM3mGMJDb_FKGQxosGWHCiAKUYc3w1M",
  authDomain:        "guess-half-the-mean.firebaseapp.com",
  databaseURL:       "https://guess-half-the-mean-default-rtdb.firebaseio.com",
  projectId:         "guess-half-the-mean",
  storageBucket:     "guess-half-the-mean.firebasestorage.app",
  messagingSenderId: "732091624132",
  appId:             "1:732091624132:web:5c1c6b1767f174ab203791",
}

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)
