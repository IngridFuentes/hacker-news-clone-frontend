import React from 'react';
import functions from '../functions/index';

// const New = () => {

    const New = event =>{
        const callFirebaseFunction = event => {
            const callableReturnMessage = firebase.functions().httpsCallable('returnMessage');
        
            callableReturnMessage().then((result) => {
              console.log(result.data.output);
            }).catch((error) => {
              console.log(`error: ${JSON.stringify(error)}`);
            });
        }
        // var output = functions.updateUpVote()
        // console.log(output)
    

    return(
        <div> NEWSSSSSSS</div>
    )
}

export default New;