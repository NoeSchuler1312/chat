import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
} from 'firebase/firestore'
import dayjs from 'dayjs'

const firebaseConfig = {
  apiKey: 'AIzaSyCCmJAAByoF5V4JCP9Bw86Amm1UA2s6-Qw',
  authDomain: 'eikon-chat.firebaseapp.com',
  projectId: 'eikon-chat',
  storageBucket: 'eikon-chat.appspot.com',
  messagingSenderId: '285018621277',
  appId: '1:285018621277:web:95bb02e3470a6c0a4494b4',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const messagesContainer = document.querySelector('[data-messages]')

const q = query(collection(db, 'messages'), orderBy('time', 'desc'), limit(20))
onSnapshot(q, (querySnapshot) => {
  const messages = []
  querySnapshot.forEach((doc) => {
    messages.push(doc.data())
  })
  const messagesHTML = messages.map((message) => {
    return `<div class="message">
      <div class="message-time">${dayjs(message.time.toDate()).format(
        'HH:mm:ss'
      )}</div>
      <div class="message-user">${message.author}</div>
      <div class="message-text">${message.text}</div>
    </div>`
  })

  messagesContainer.innerHTML = messagesHTML.join('')
})

const form = document.querySelector('[data-form]')

form.addEventListener('submit', function (event) {
  event.preventDefault()
  const author = form.querySelector('[name=author]').value
  const text = form.querySelector('[name=text]').value

  addDoc(collection(db, 'messages'), {
    author,
    text,
    time: new Date(),
  })
})
