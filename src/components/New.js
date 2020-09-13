import React, { Component, useState, useEffect } from 'react';
import firebase from 'firebase';
import db from '../firebase';
import { render } from '@testing-library/react';

class New extends Component { 
    constructor() {
        super();
        this.state = {
          postTitle: '',
          userID: '',
          redirect: false,
          allPostsCalled: false
        };
    }

    upvotes = (e) =>{
        e.preventDefault();
        const target = e.target;
        const postTitle = target.value;
        console.log("Liking post ",postTitle," by user: ",this.state.userID);
    }
    
    allPostsHandler = () =>{
        if(!this.state.allPostsCalled){
            this.allPosts();
            this.setState({allPostsCalled: true});
        } 
    }
    onSubmit = (e) =>{
        e.preventDefault();
        console.log("Made a comment");
    }

    addHandlers = () => {
        
        var elements = document.getElementsByClassName("vote");
        // console.log(elements)
        console.log("Length of elements on page: ",elements.length);

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', function(e){
                    const target = e.target;
                    const postTitle = target.value;
                    console.log("Liking post ",postTitle," by user: ",this.state.userID);
                });
        }

    }

    allPosts = async () => {    
        var getPosts = firebase.functions().httpsCallable('getPosts');
        
        let posts = await getPosts();
        const user = firebase.auth().currentUser;
        var username = '';
            
        if (user){
            username = user.displayName;
            this.setState({userID: username});
        }
            
        let html = "";
        var x = document.getElementById('posts');
            
        //add list object for each post

        for(let i = 0; i < posts.data.length; i++){
            let post = posts.data[i];
            var title = post.title;
            var url = post.url;
            var time = post.time;
            var owner = post.owner;
            var numComments = post.numComments;
            var upvotes = post.upvotes;
            var postID = post.postID;

            //var getComments = firebase.functions().httpsCallable('getComments');
            //var commentArray = await getComments({post: title});
            var commentHTML = "";

            var commentSnapshot = await firebase.firestore().collection('comments').where("post","==",postID).get();

            commentSnapshot.forEach(doc =>{
                var comment = doc.data().text;
                var commentOwner = doc.data().user;
                console.log(comment);
                commentHTML += "<li>" + commentOwner+" | "+comment + "</li>";
            })
            console.log("Comments: ", commentHTML);

            var deleteHTML = '';
            if(username === owner){
                deleteHTML = `<button class="delete" value="${title}">Delete Post</button>`;
            }

            const li =`
                    <li>
                        <div><a href="${url}">
                            ${title}</a>&ensp;- by ${owner} - ${url} | ${numComments} comments
                            ${deleteHTML}
                        </div>
                        <div><button id="${title}" class="vote" value="${title}">Like</button>${upvotes} points</div>
                        <ul>${commentHTML}</ul>
                        </li>
                    `;
                html += li;
        }
            
        x.innerHTML = html;

        //setup like button event handler
        var elements = document.getElementsByClassName("vote");
        console.log("Length of elements on page: ",elements.length);
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', async function(e){
                    const target = e.target;
                    const postTitle = target.value;
                    var verifyUpVote = firebase.functions().httpsCallable('verifyUpVote');
                    var updateUpVote = firebase.functions().httpsCallable('updateUpVote');
                    const d = {
                        userID: username,
                        postTitle: postTitle
                    };
                    if(!username){
                        alert('you must be signed in to like the post');
                        return;
                    }
                    let verify = await verifyUpVote(d);

                    if(verify.data === 'false'){
                        console.log("Liking post: ",postTitle);
                        await updateUpVote({
                            userID: username,
                            postTitle: postTitle,
                            method: "increment"
                        });
                    } else{
                        console.log("Unliking post: ",postTitle);
                        await updateUpVote({
                            userID: username,
                            postTitle: postTitle,
                            method: "decrement"
                        });
                    }
                    
                    console.log("Liking post ",postTitle," by user: ",username);
            });
        }


        //set up delete button even handlers
        var deleteButton = document.getElementsByClassName("delete");
        console.log("Length of delete buttons on page: ", deleteButton.length);

        for (var i = 0; i < deleteButton.length; i++) {
            deleteButton[i].addEventListener('click', async function (e) {
                const target = e.target;
                const postTitle = target.value;
                var deletePost = firebase.functions().httpsCallable('deletePost');
                const d = {
                    userID: username,
                    postTitle: postTitle
                };

                let verify = await deletePost(d);

                console.log("Deleting post ", postTitle, " by user: ", username);
            });

        }

        console.log(posts);
        }

        render() {
            return(
                <div> 
                    
                <ul id="posts"></ul>
                {this.allPostsHandler()}
                </div>
                )
        }
}

export default New;