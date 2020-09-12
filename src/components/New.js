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
        } else{
            this.addHandlers();
        }
    }

    addHandlers = () => {
        var elements = document.getElementsByClassName("vote");

        console.log("Length of elements on page: ",elements.length);

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', e =>{
                
                    const target = e.target;
                    const postTitle = target.value;
                    console.log("Liking post ",postTitle," by user: ",this.state.userID);
                });
        }
    }


    allPosts = () => {    
        var getPosts = firebase.functions().httpsCallable('getPosts');
    
        getPosts().then(posts => { 
            // console.log(posts);
            const user = firebase.auth().currentUser;

            if (user){
                const username = user.displayName;
                this.setState({userID: username});
            }
            
            
            let html = "";
            var x = document.getElementById('posts');
            
            //add list object for each post
            posts.data.forEach(post=>{
                var title = post.title;
                var url = post.url;
                var time = post.time;
                var owner = post.owner;
                var numComments = post.numComments;
                var upvotes = post.upvotes;
                const li =`
                    <li>
                        <div><a href="${url}">
                            ${title}</a>&ensp;- Post made by ${owner} - ${url} | ${numComments} comments
                        </div>
                        <div><button id="${title}" class="vote" value="${title}">Like</button>${upvotes} points</div>
                    </li>
                    `;
                html += li;
            })

            

            /*
            for (const btn of document.querySelectorAll('.vote')) {
                btn.addEventListener('click', e => {
                    // e.preventDefault();
                    console.log("Even listener");
                    const target = e.target;
                    const postTitle = target.value;
                    console.log("Liking post ",postTitle," by user: ",this.state.userID);
                 
                });
            }
            */

            x.innerHTML = html;

            console.log(posts);
        })
        .catch(error => {
            console.log("Error while getting posts", error)
        })
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