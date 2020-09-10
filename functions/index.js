const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const FieldValue = admin.firestore.FieldValue;
const { firebaseConfig } = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// verify upvote
exports.verifyUpVote = functions.https.onCall( async (data, context) => {
    const userID = data.userID;
    const postTitle = data.postTitle;

    // query post document with the same title as postTitle.
    let querySnapShot = await admin.firestore().collection('posts').where('title', '==', postTitle).get();
    let storyDocID = '';
    querySnapShot.forEach( doc => {
        storyDocID = doc.id;
        console.log(storyDocID);
    });

    // get the user using userID
    const doc = await admin.firestore().collection('users').doc(userID).get();

    // if likedPost contains postID return true, else false.
    if(doc.data().likedPosts.includes(storyDocID)){
        return `true`;
    } else {
        return `false`;
    }
})

// update upvote based on method passed in
exports.updateUpVote = functions.https.onCall( async (data, context) => {
    const userID = data.userID;
    const postTitle = data.postTitle;
    const method = data.method;

    // get document for user, get all the fields from the document.
    const userDocument = await admin.firestore().collection('users').doc(userID).get();
    const userDoc = await admin.firestore().collection('users').doc(userID);

    // get likedPosts array.
    let userLikedPosts = userDocument.data().likedPosts;
    if(method === 'increment'){

        // query Posts collection to gather all documents that have field title equal to postTitle.
        let storyDocID = '';
        let querySnapShot = await admin.firestore().collection('posts').where('title', '==', postTitle).get();

        // should only loop once and so we push the post ID onto likedPost
        querySnapShot.forEach( doc => {
            storyDocID = doc.id;
            userLikedPosts.push(storyDocID);
        });

        // get post document using postID, 
        const storyDoc = await admin.firestore().collection('posts').doc(storyDocID);

        // update upvote count and likedPosts.
        await storyDoc.update({
            upvotes: FieldValue.increment(1)
        })
        await userDoc.update({
            likedPosts: userLikedPosts
        });
        
    } else if(method === 'decrement'){
        // query the Posts collection to gather all documents that have field title equal to postTitle.
        let querySnapShot = await admin.firestore().collection('posts').where('title', '==', postTitle).get();
        let storyDocID = '';

        // should only get one document back so we just loop this once.
        querySnapShot.forEach( doc => {
            storyDocID = doc.id;
            
        });

        // find the index using the ID we just got
        let postIndex = 0;
        for(let i = 0; i < userLikedPosts.length; i++){
            if(storyDocID === userLikedPosts[i]) {
                postIndex = i;
                break;
            }
        }

        // get the document using the ID for updating.
        const storyDoc = await admin.firestore().collection('posts').doc(storyDocID);

        // remove post from the array.
        userLikedPosts.splice(postIndex, 1);

        // update in firebase.
        await userDoc.update({
            likedPosts: userLikedPosts
        });
        await storyDoc.update({
            upvotes: FieldValue.increment(-1)
        });
    }
    return `true`;
});


//signup
exports.register = functions.https.onCall(async (data, context) => {
    const email = data.email;
    const password = data.password;
    const username = data.username;
    var status = "";

    //check if username exists before creating a new user
    const snapshot = await admin.firestore().collection('users').doc(username).get();
    if (snapshot.exists) {
        functions.logger.log("User exists");
        status = "User exists";
    } else {
        functions.logger.log("Creating user now");

        //creates user
        const cred = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: username
        });

        const user = await admin.firestore().collection('users').doc(username).set({
            likedPosts: [],
            posts: [],
        });

        status = "User added successfully";

        return {
            status: status,
            user: cred
        };
    }

    return {status: status};
})