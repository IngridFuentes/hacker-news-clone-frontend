import React from 'react';
import { Link } from 'react-router-dom';

const Submit = () => {

    return(
        <div>
            <div>
                <h1 className="submit">Submit</h1>
            </div>
        <form>
            <div>
            <p>Title:</p>
                <input
                type="text"
                id="title"
                />
            </div>
            <div>
                <p>URL</p>
                <input
                type="text"
                id="url"
                />
            </div>
            <div>
                <p>Text</p>
                <input
                type="text"
                id="txtbox"
                
                />
            </div>
            <br/>
            <Link to="/newest">
            <button>Submit</button>
            </Link>
        </form>
        </div>
    )
}

export default Submit;