import React from 'react';
import {withRouter} from 'react-router-dom';
import { Component } from 'react';
import NavFeed from './Feed/NavFeed';

const initState = {
    title: "",
    text: "",
    image: "",
    errorFlag: false,
    username: "",
}

const token = localStorage.getItem("token");

class newPost extends Component {
    constructor(props){
        super(props);

        this.state = {
            ...initState,
        }
    }

    fetchUsername = () => {
        let config = {
            method: "GET",
            headers: {
                'Content-type': 'Application/json',
                authorization: `Bearer ${token}`
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

    changeHandler = (event) => {
        this.setState({
            [event.target.id]: event.target.value,
        })
    }

    submitHandler = (event) => {
        event.preventDefault();

        const npost = {
            title: this.state.title,
            text: this.state.text,
            image: this.state.image,
        }

        let config = {
            method : 'POST',
            headers: {
                authorization: `Bearer ${token}`,
                'Content-type': 'Application/json'
            },
            body : JSON.stringify(npost),
        };

        fetch('https://reactcourseapi.herokuapp.com/post', config)
            .then(res => {
                if(res.ok){
                    res.json()
                    .then(data => {
                        this.setState({
                            ...initState,
                        })
                    })
                }else{
                    this.setState({
                        errorFlag: true,
                    })
                }
            })
    }

    componentDidMount(){
        this.fetchUsername();
    }

    render(){
        return(
            <>
                <NavFeed username={this.state.username}/>
                <div className="full-centered">
				<div className = "jumbotron">
                <h1 className="display-3">Nuevo Post</h1>
	
					<form onSubmit={this.submitHandler}>
						<div className="form-group">
							<label>Título: 
								<input
									className="form-control" 
									type = "text" 
									id = "title" 
									onChange = {this.changeHandler}
									value = {this.state.title}/>
							</label>
			
							<label>Texto: 
								<input 
									className="form-control"
									type = "text" 
									id = "text" 
									onChange = {this.changeHandler}
									value = {this.state.text}/>
							</label>
			
							<label>Link de la imagen: 
								<input
									className="form-control" 
									type = "text" 
									id = "image" 
									onChange = {this.changeHandler}
									value = {this.state.image}/>
							</label>
						</div>

						<div className="user-btns">
							<button onClick={()=>{this.props.history.push('/profile')}} type="button" className="btn btn-outline-info">Perfil</button>
							<button className="btn btn-primary" type="submit">Subir Post</button>
						</div>
					</form>
					{this.state.errorFlag && 
						<div className="alert alert-dismissible alert-danger">
	  						<strong>Oh snap!</strong> Hubo un error en la creación de un nuevo post.
						</div>
					}
				</div>
			</div>
            </>
        );
    }
}

export default withRouter(newPost);