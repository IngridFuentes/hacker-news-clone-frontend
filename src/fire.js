import firebase from 'firebase';
// {/* <script> */}
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCBu21x40bK7i7H4nvYN_N9G8PcJ5Mv1AY",
    authDomain: "fir-champlain.firebaseapp.com",
    databaseURL: "https://fir-champlain.firebaseio.com",
    projectId: "fir-champlain",
    storageBucket: "fir-champlain.appspot.com",
    messagingSenderId: "36411061139",
    appId: "1:36411061139:web:f5f408e4cae1a910db2e66"
  };
  // Initialize Firebase
  var fire = firebase.initializeApp(firebaseConfig);
// </script>
export default fire;