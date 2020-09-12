import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import db from '../firebase';
// import { render } from '@testing-library/react';
// import functions from '../functions/index';

    const New = () => {
        // const [posts, setPosts] = useState([]);
        // const [input, setInput] = useState('');
        // useEffect(() => {
        //     //this code fires when the app.js loads
        //     db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        //       // console.log(snapshot.docs.map(doc => doc.data().todo));
        //       setPosts(snapshot.docs.map(doc =>({id: doc.id, post: doc.data().post })))
        //     })
        //   }, []);

        // const callFirebaseFunction = event => {
        //     const callableReturnMessage = firebase.functions().httpsCallable('returnMessage');
        
        //     callableReturnMessage().then((result) => {
        //       console.log(result.data.output);
        //     }).catch((error) => {
        //       console.log(`error: ${JSON.stringify(error)}`);
        //     });
        // }
        // var output = functions.updateUpVote()
        // console.log(output)
        var getPosts = firebase.functions().httpsCallable('getPosts');
        getPosts().then(post => { 
        //     {posts.map( function(post, index) {
        //         return <p key={index}>{post} </p>  
          
        //   })
        //   }
            console.log(post);
        })
        .catch(error => {
            console.log("Error while getting posts", error)
        })
        
            return(
                <div> 
                    something
                    {/* <ul>
                        {posts.map( function(data, index) {
                              return <p key={index}>{data} </p>  
                        
                        })
                        }
                    </ul> */}
                </div>
            )

}

export default New;