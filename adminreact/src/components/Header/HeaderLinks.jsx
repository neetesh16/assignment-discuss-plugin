import React, {Component} from 'react';
import { NavItem, Nav, NavDropdown, MenuItem } from 'react-bootstrap';

import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies'
class HeaderLinks extends Component{
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
    }
    logout(){

        delete_cookie("XAuthToken");
        window.location.reload();
    }
    render(){

        return (
            <div>

                <Nav pullRight>

                    <NavItem eventKey={3} href="#" onClick={this.logout}>Log Out</NavItem>
                </Nav>
            </div>
        );
    }
}

export default HeaderLinks;
