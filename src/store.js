import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
//Reducers
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";

const firebaseConfig = {
  apiKey: "AIzaSyAGBb7MSmO349RdszDiKSMRDxVbj1dxpR0",
  authDomain: "reactclientpanel-d609b.firebaseapp.com",
  databaseURL: "https://reactclientpanel-d609b.firebaseio.com",
  projectId: "reactclientpanel-d609b",
  storageBucket: "reactclientpanel-d609b.appspot.com",
  messagingSenderId: "38762077626"
};

//react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true
};

//Init firebase instance
firebase.initializeApp(firebaseConfig);
// Init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

//Check for settings and local storage
if (localStorage.getItem("settings") == null) {
  //Default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };
  // Set to localStorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

//Create initial state
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

//Create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(reactReduxFirebase(firebase))
);

export default store;
