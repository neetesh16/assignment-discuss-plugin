import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import NotificationSystem from 'react-notification-system';
import Login from './Login.jsx'
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import Sidebar from 'components/Sidebar/Sidebar';

import {style} from "variables/Variables.jsx";

import appRoutes from 'routes/app.jsx';
import axios from 'axios'
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies'
import {
    Grid, Row, Col,
    FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import {Card} from 'components/Card/Card.jsx';
import {FormInputs} from 'components/FormInputs/FormInputs.jsx';
import {UserCard} from 'components/UserCard/UserCard.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';
class App extends Component {
    constructor(props){
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.socialLoginSuccess = this.socialLoginSuccess.bind(this);
        this.handleSocialLoginFailure = this.handleSocialLoginFailure.bind(this);
    }

    componentDidMount(){
        this.setState({});

    }
    componentDidUpdate(e){
        if(window.innerWidth < 993 && e.history.location.pathname !== e.location.pathname && document.documentElement.className.indexOf('nav-open') !== -1){
            document.documentElement.classList.toggle('nav-open');
        }
    }

    socialLoginSuccess(user){
        var obj = {provider:user._provider,profile:user._profile,token:user._token};
        axios.post('/user', obj)
            .then(function (response) {
                bake_cookie("XAuthToken", response.data.XAuthToken);
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSocialLoginFailure(data){
        console.log(data);
    }
    render() {
        var jwtCookie = read_cookie("XAuthToken");
        console.log(jwtCookie);
        if(jwtCookie!==undefined && jwtCookie!=="" && jwtCookie.length>0){
            return (

                <div className="wrapper">

                    <Sidebar {...this.props} />
                    <div id="main-panel" className="main-panel">
                        <Header {...this.props}/>
                        <Switch>
                            {
                                appRoutes.map((prop,key) => {
                                    if(prop.redirect)
                                        return (
                                            <Redirect from={prop.path} to={prop.to} key={key}/>
                                        );
                                    return (
                                        <Route path={prop.path} component={prop.component} key={key}/>
                                    );
                                })
                            }
                        </Switch>

                    </div>
                </div>
            );
        }else{
            return(
                <div>
                    <Grid fluid>
                        <Row>
                            <br/>
                            <br/>
                            <br/><br/>

                            <Col md={4}></Col>
                            <Col md={4}>
                                <UserCard
                                    bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                                    name="Discuss Dashboard"
                                    description={
                                        <span>
                                            <br/>
                                            <br/>
                                            <br/>
                                            <br/>
                                    <Login
                                        bsStyle="primary"
                                        provider='facebook'
                                        appId='987788391359360'
                                        onLoginSuccess={(user) => this.socialLoginSuccess(user)}
                                        onLoginFailure={(err) => this.handleSocialLoginFailure(err)}
                                    >
                        Login with Facebook
                    </Login>

                    <Login
                        provider='google'
                        appId='110630413711-6jh6f9ukpdcui8l0rhnpua97n6gntdie.apps.googleusercontent.com'
                        onLoginSuccess={(user) => this.socialLoginSuccess(user)}
                        onLoginFailure={(err) => this.handleSocialLoginFailure(err)}
                    >
                        Login with Google
                    </Login>
                                    </span>
                                    }

                                />
                            </Col>

                        </Row>
                    </Grid>>

                </div>
            );

        }


    }
}

export default App;
