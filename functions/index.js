const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const FieldValue = admin.firestore.FieldValue;
const { firebaseConfig } = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// const functions = require('firebase-functions');

exports.returnMessage = functions.https.onCall((data, context) => {
    return {
        output: "the firebase function has been run"
      }
});

// edit post, takes in userID, old postTitle, new postTitle.
// if old postTitle is not in db, return false,
// if new postTitle is already in db, return false,
// if old postTitle does not exist in user's posts, return false.
// else replace old postTitle with new postTitle, return true.
exports.editPost = functions.https.onCall( async (data, context) => {
    const userID = data.userID;
    const oldPostTitle = data.oldPostTitle;
    const newPostTitle = data.newPostTitle;
    const currentTime = new Date();

    // query post document with the same title as oldPostTitle, if there isn't, return false.
    let oldPostSnapShot = await admin.firestore().collection('posts').where('title', '==', oldPostTitle).get();
    if(oldPostSnapShot._size === 0) return `false`;

    // get postID 
    let postID = '';
    oldPostSnapShot.forEach( doc => {
        postID = doc.id;
    });

    // query post document with the same title as newPostTitle, if there is, return false.
    let newPostSnapShot = await admin.firestore().collection('posts').where('title', '==', newPostTitle).get();
    if(newPostSnapShot._size !== 0) return `false`;

    let userDoc = await admin.firestore().collection('users').doc(userID).get();

    // if user's posts doesn't have current post, retruen false
    if(!(userDoc.data().posts.includes(postID))) return `false`;

    // at this point, we have verified that we can edit the post title.
    
    // replace old post title with new post title
    // we don't have to change anything in the user's posts since we are storing post ID instead of post title in the array.
    // even if we change the post title, the document id for the post will not be changed.
    await admin.firestore().collection('posts').doc(postID).update({
        title: newPostTitle,
        date: currentTime
    })

    return `true`;
});




// delete story post, takes in userID, postTitle, 
// if post title is not in db, return false,
// if post title is not in user's posts, return false,
// else delete postID from user's posts, and delete postID from posts collection.
exports.deletePost = functions.https.onCall( async (data, context) => {
    const userID = data.userID;
    const postTitle = data.postTitle;

    // query post document with the same title as postTitle, if there isn't, return false.
    let querySnapShot = await admin.firestore().collection('posts').where('title', '==', postTitle).get();
    if(querySnapShot._size === 0) return `false`;

    let userDoc = await admin.firestore().collection('users').doc(userID).get();

    // get postID 
    let postID = '';
    querySnapShot.forEach( doc => {
        postID = doc.id;
    });

    // if user's posts doesn't have current post, retruen false
    if(!(userDoc.data().posts.includes(postID))) return `false`;

    // at this point, we have verified that post title is in db and post title is in user's posts.

    // find post index in user's posts
    let postIndex = 0;
    let userPosts = userDoc.data().posts;
    for(let i = 0; i < userPosts.length; i++){
        if(userPosts[i] === postID){
            postIndex = i;
            break;
        }
    }
    userPosts.splice(postIndex, 1);
    

    // update user's posts
    await admin.firestore().collection('users').doc(userID).update({
        posts: userPosts
    })

    // delete post document from posts collection
    await admin.firestore().collection('posts').doc(postID).delete();

    // EXTRA, find all users that liked the post and delete it from likedPosts
    let likedPostUsers = await admin.firestore().collection('users').where('likedPosts', "array-contains", postID).get();
    
    // for each user, delete postID in likedPosts array.
    likedPostUsers.forEach( async (doc) => {
        console.log(doc);
        let userLikedPosts = doc.data().likedPosts;
        for(let i = 0; i < userLikedPosts.length; i++){
            if(postID === userLikedPosts[i]) {
                userLikedPosts.splice(i, 1);
                break;
            }
        }
        
        await admin.firestore().collection('users').doc(doc.id).update({
            likedPosts : userLikedPosts
        });
    });

    return `true`;

});



// verify if post title is unique, and haven't been created
// if have, return false,
// else insert post and return true.
exports.verifyPost = functions.https.onCall( async (data, context) => {
    const userID = data.userID;
    const postTitle = data.postTitle;
    const url = data.url;
    const currentTime = new Date();

    // query post document with the same title as postTitle, if there is, return false.
    let querySnapShot = await admin.firestore().collection('posts').where('title', '==', postTitle).get();
    if(querySnapShot._size !== 0) return `false`;

    // at this point, we have verified that postTitle is unique and haven't been created.
    // we need to add append postTitle to firebase.
    let postID = '';
    const userRef = await admin.firestore().collection('users').doc(userID);
    const docRef = await admin.firestore().collection('posts').add({
        comments: [],
        numComments: 0,
        owner: userRef,
        time: currentTime,
        title: postTitle,
        upvotes: 0,
        url: url
    });

    // get autogenreated post ID
    postID = docRef.id;
    
    const userDoc = await admin.firestore().collection('users').doc(userID).get();
    
    // append postID to user's posts and update. return true at last.
    let userPosts = userDoc.data().posts;
    userPosts.push(postID);
    await admin.firestore().collection('users').doc(userID).update({
        posts: userPosts
    });

    return `true`;

});




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



// creates comment
// gets passed username, text and post title
exports.addComment = functions.https.onCall(async (data, context) => {
        
    const text = data.text;
    const time = admin.firestore.FieldValue.serverTimestamp();
    const post = data.post;
    const username = data.username;
    var status = false;
    
    //get post from post title    
    snapshot = await admin.firestore().collection('posts').where("title","==",post).get();

    //if snapshot is empty, post does not exist
    if(snapshot.empty){
        return false;
    } 
    else{
        //update post db to add comment to list of comments
        snapshot.forEach(async doc => { 

            data = doc.data();

            //update comments db with comment and text
            const comment = await admin.firestore().collection('comments').add({
                user: username,
                text: text,
                time: time,
                post: doc.id
            })

            c = data.comments; //comment array

            //increment number of comments on post
            num = data.numComments;
            num +=1;
            
            // push comment id onto array "/comments/{commentID}"
            ref = "/comments/";
            ref += comment.id;
            c.push(ref);
            
            //update document in post db
            await admin.firestore().collection('posts').doc(doc.id).update({comments: c, numComments: num});
            functions.logger.log("Updated post db with new comment");
            status = true;
        });

        return true;
    }
})


//delete comment
//takes commentID and deletes comment from comment db
//deletes comment from array in post db
exports.deleteComment = functions.https.onCall(async (data, context) => {
var commentID = "/comments/"
commentID += data.commentID;
const username = data.username;

//confirm user is the owner of the comment
const commentSnapshot = await admin.firestore().collection('comments').doc(data.commentID).get();
const commentOwner = commentSnapshot.data().user;
if(commentOwner !== username){
    return "Comment does not belog to user";
}


//delete comment
await admin.firestore().collection('comments').doc(data.commentID).delete()
.then(()=>{
    functions.logger.log("Comment deleted successfully");
    return true;
})
.catch(error =>{
    functions.logger.log("Error deleting comment: ", error);
})

//find post with comment id
const snapshot = await admin.firestore().collection('posts').where("comments","array-contains",commentID).get();
snapshot.forEach(async doc =>{
    functions.logger.log("Found comment reference in posts db");

    commentArray = doc.data().comments;
    numComments = doc.data().numComments;
    numComments -=1;
    //delete comment from array
    for(let i = 0; i < commentArray.length; i++){
        if(commentID === commentArray[i]){
            commentArray.splice(i,1);
            break;
        }
    }
    //update post db with new comment array
    await admin.firestore().collection('posts').doc(doc.id).update({
        comments: commentArray,
        numComments: numComments,
    });
});

return "Success";

})


// edit comment
//takes commentID, username, and text to update comment in db
exports.editComment = functions.https.onCall(async (data, context) => {
const commentID = data.commentID;
const text = data.text;
const time = admin.firestore.FieldValue.serverTimestamp();
const username = data.username;

//confirm user is the owner of the comment
const commentSnapshot = await admin.firestore().collection('comments').doc(data.commentID).get();
const commentOwner = commentSnapshot.data().user;
if(commentOwner !== username){
    return "Comment does not belog to user";
}


if(text === ""){
    return false; //trying to update with the empty string
}
else{
    await admin.firestore().collection('comments').doc(commentID).update({
        text: text,
        time: time,
    });
    return true; //comment edited successfully
}
})

// will return object of all comments belonging to post
// Takes post title as argument
exports.getComments = functions.https.onCall(async (data, context) =>{
    const post = data.post;

    const postSnapshot = await admin.firestore().collection('posts').where("title","==",post).limit(1).get();

    var comments = [];
    var postID = "";

    // find post id given post title
    postSnapshot.forEach(doc => {
        postID = doc.id;
    })

    // query comment selection where post = postID
    const commentSnapshot = await admin.firestore().collection('comments')
    .where('post','==',postID)
    .get();
    
    if (commentSnapshot.empty){
        functions.logger.log("No comments found for postID: ", postID);
    }
    commentSnapshot.forEach(doc=>{
        var comment = doc.data();
        comments.push(comment);
    })

    //returns JSON string of comment objects {text, time, post, user}
    return JSON.stringify(comments);
})


//will return array of all posts
exports.getPosts = functions.https.onCall(async (data, context) =>{

    var posts = [];

    const postSnapShot = await admin.firestore().collection('posts').orderBy('time','desc').get();

    if (postSnapShot.empty){
        functions.logger.log("No posts found");
    }
    
    
    postSnapShot.forEach(doc=>{

        var post = doc.data();
        var owner = post.owner.id;
        var url = post.url;
        var numComments = post.numComments;
        var title = post.title;
        var upvotes = post.upvotes;
        var time = post.time;
        var postID = doc.id;

        var data = {
            owner: owner,
            url: url,
            numComments: numComments,
            title: title,
            time: time,
            upvotes: upvotes,
            postID: postID
        };
        posts.push(data);
    })
    
    //returns array of comment objets {text, time, post, user}
    return posts;
})