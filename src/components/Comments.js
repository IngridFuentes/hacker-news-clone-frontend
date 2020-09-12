import React from 'react';
import firebase from 'firebase';

const Comments = () => {
    var addComment = firebase.functions().httpsCallable('addComment');
        addComment().then(comment => { 
            console.log(comment);
        }
        )
        .catch(error => {
            console.log("Error while adding comment", error)
        })

    return(
        <div> NEW COMMENTSSSSSSSS</div>
    )
}

export default Comments;