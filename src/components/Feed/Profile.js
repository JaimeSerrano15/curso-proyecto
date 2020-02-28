import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import NavFeed from './NavFeed';
import MyPost from './MyPost';

class Profile extends Component{
    constructor(props){
        super(props);


        //localStorage.getItem('token') && this.props.history.push('/');

        this.state = {
            myPosts : [],
            username : "",
            token : localStorage.getItem('token'),
        }
    }

    likeHandler = index => {
        let postsAux = [...this.state.myPosts];
    
        const config = {
            method: "PUT",
            headers: {
                'Content-type': 'Application/json',
                authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify(postsAux[index])
        }
    
        /* fetch('https://reactcourseapi.herokuapp.com/post/', config)
            .then(res => {this.fetchData()}) */
    
            fetch('https://reactcourseapi.herokuapp.com/post/like', config)
            .then(res => {this.fetchUserData()})
            
    }

    deleteHandler = index => {
        let postsAux = [...this.state.myPosts];

        const config = {
            method : "DELETE",
            headers: {
                'Content-type': 'Application/json',
                authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify(postsAux[index]._id),
        }

        fetch('https://reactcourseapi.herokuapp.com/post', config)
        .then(res => {this.fetchUserData()})
    }

    fetchUserData = () => {
        let config = {
            method: "GET",
            headers: {
                'Content-type': 'Application/json',
                authorization: `Bearer ${this.state.token}`
            }
        }

        fetch('https://reactcourseapi.herokuapp.com/user/', config)
            .then(res => res.json())
            .then(data => {
                console.log(data.user.posts);
                this.setState({
                    myPosts : data.user.posts || ''
                })   
            })
    }

    fetchUsername = () => {
        let config = {
            method: "GET",
            headers: {
                'Content-type': 'Application/json',
                authorization: `Bearer ${this.state.token}`
            }
        }
    
        fetch('https://reactcourseapi.herokuapp.com/user/name', config)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    username: data.username || ''
                })
    
            })
    }

    componentDidMount(){
        this.fetchUserData();
        this.fetchUsername();
    }

    render(){

        const myPostsComponents = this.state.myPosts.map((post,index) => {

            return(<MyPost id={post.id} key={index} name={this.state.username} likes={post.likes} title={post.title} text={post.text} image={post.image} onClick = {() => this.deleteHandler(index)} />);
        });

        return(
            <>
                <NavFeed username={this.state.username} />
                <div className="container">
                    <h1 className="display-3">ReactFeed</h1>
                    <h2>My Posts</h2>

                    <div className="user-btns">
                    <button onClick={()=>{this.props.history.push('/newpost')}} type="button" className="btn btn-outline-info">Nuevo Post</button>
                    </div>
                    <br/>
                    <div className="posts">
                        {myPostsComponents}
                    </div>
                </div>
            </>
        );
    }

}

export default withRouter(Profile);