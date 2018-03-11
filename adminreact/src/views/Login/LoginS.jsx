import React, { Component } from 'react';
import SocialLogin from 'react-social-login'

const Login = ({ children, triggerLogin, ...props }) => (
    <button onClick={triggerLogin} {...props}>
        { children }
    </button>
)
export default SocialLogin(Login)
