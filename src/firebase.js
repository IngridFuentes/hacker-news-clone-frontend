import firebase from 'firebase';
// {/* <script> */}
  // Your web app's Firebase configuration

  const firebaseApp = firebase.initializeApp( {
    apiKey: "AIzaSyCBu21x40bK7i7H4nvYN_N9G8PcJ5Mv1AY",
    authDomain: "fir-champlain.firebaseapp.com",
    databaseURL: "https://fir-champlain.firebaseio.com",
    projectId: "fir-champlain",
    storageBucket: "fir-champlain.appspot.com",
    messagingSenderId: "36411061139",
    appId: "1:36411061139:web:f5f408e4cae1a910db2e66"
  });

  /*
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCBu21x40bK7i7H4nvYN_N9G8PcJ5Mv1AY",
    authDomain: "fir-champlain.firebaseapp.com",
    databaseURL: "https://fir-champlain.firebaseio.com",
    projectId: "fir-champlain",
    storageBucket: "fir-champlain.appspot.com",
    messagingSenderId: "36411061139",
    appId: "1:36411061139:web:f5f408e4cae1a910db2e66"
  });
  */

  // Initialize Firebase
//  firebase.initializeApp(firebaseConfig);
// </script>
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
export default { db, auth};