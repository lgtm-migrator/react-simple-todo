import * as firebase from 'firebase'
let database;
const EMAIL = 'taweesoft@gmail.com'
const PASS = 'todotest'
import sectionModel from './models/section'
import todoModel from './models/todo'
import {loadSections} from 'actions/todo'
import _ from 'lodash'
import {validateSections} from 'reducers/todo'

export const init = () => {
  let config = {
    apiKey: "AIzaSyDrKBbsdJUXMwaavXUKoYYPAec4DdtpYHw",
    authDomain: "guilloutran.firebaseapp.com",
    databaseURL: "https://guilloutran.firebaseio.com",
    storageBucket: "guilloutran.appspot.com",
    messagingSenderId: "215528013483",
  };
  firebase.initializeApp(config);
  firebase.auth().signInWithEmailAndPassword(EMAIL, PASS)
    .then(message => {
      console.log('Signin successful');
    })
    .catch(function(error) {
      console.log('Signin failed');
    });
	database = firebase.database()
}

// retrieve from firebase
// return promise object
export const getSectionsDB = () => {
  return database.ref('/').once('value')
}

// get specified section
export const getTodoDB = (sectionId) => {
  return database.ref(`/${sectionId}`).once('value')
}

// add new section
export const addSection = (name) => {
  let key = database.ref('/').push().key
  let model = sectionModel(key, name, firebase.database.ServerValue.TIMESTAMP)
  return database.ref('/'+ key).set(model)
}

// add new todo item into specified section
export const addTodoItem = (id, name) => {
  return new Promise((resolve, reject) => {
    database.ref(`/${id}`).once('value').then((todo) => {
      let todos = todo.val().todos || []
      let key = database.ref(`/${id}`).push().key
      todos.push(todoModel(key, name, firebase.database.ServerValue.TIMESTAMP))
      database.ref(`/${id}/todos`).set(todos)
        .then( res => {resolve(res)})
        .catch( error => {reject(error)})
    })
  })
}

export const listening = (store) => {
  database.ref('/').on('value', (snapshot) => {
    store.dispatch(loadSections())
  })
}
