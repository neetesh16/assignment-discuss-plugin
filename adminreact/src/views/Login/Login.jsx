import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col,Table,Button } from 'react-bootstrap';
import axios from 'axios'

import {Card} from 'components/Card/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';
import {Tasks} from 'components/Tasks/Tasks.jsx';
import {Modals} from 'components/Modals/Modals.jsx';
import {thArray, tdArray} from 'variables/Variables.jsx';



class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [{
                id:1,
                website:"http:google.com",
                clientid:"0 Rice"
            },{
                id:2,
                website:"http:1.com",
                clientid:"1 Rice"
            },{
                id:3,
                website:"http:2.com",
                clientid:"2 Rice"
            },{
                id:4,
                website:"http:3.com",
                clientid:"3 Rice"
            }],
            editData:{
                id:"",
                website:"",
                clientid:""
            }
        }
        this.delta = this.delta.bind(this);
        this.savePlugin = this.savePlugin.bind(this);
        this.showModal = this.showModal.bind(this);

    }

    delta(data) {
        this.setState({
            list : data,
            lgShow: false,
            editData:{
                id:"",
                website:"",
                clientid:""
            }
        });


    }

    showModal(data){


        // console.log(this.state.editData);
        this.setState({ editData: data ,lgShow: true })
    }
    savePlugin(){

        this.setState({ lgShow: false });
    }
    handleTableData(){
        var self = this;
        axios.get('/getData')
            .then(function (response) {

                self.delta(response.data.data);

            })
            .catch(function (error) {
                console.log(error);
            });
    }
    componentDidMount(){
        this.handleTableData();
    }
    render() {

        return (
            <div className="content">
                <div className="content">

                    <Grid fluid>
                        <Row>

                            <Col md={12}>
                                <Modals  show={this.state.lgShow} onHide={this.savePlugin} data={this.state.editData}/>
                                <Button
                                    bsStyle="primary"
                                    onClick={() => this.setState({ lgShow: true })}
                                >
                                    Add New
                                </Button>

                                <Card
                                    title="Create New Plugin"
                                    category="Generate Code And Paste into Website"
                                    ctTableFullWidth ctTableResponsive
                                    content={
                                        <Table striped hover>
                                            <thead>
                                            <tr>
                                                {
                                                    thArray.map((prop, key) => {
                                                        return (
                                                            <th key={key}>{prop}</th>
                                                        );
                                                    })
                                                }
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.list.map(( key) => {
                                                    return (
                                                        <tr key={key.id}>

                                                            <td>{key.website}</td>
                                                            <td>{key.clientid}</td>
                                                            <td><Button bsStyle="primary" bsSize="sm" onClick={()=>this.showModal(key)}>Edit</Button></td>
                                                            <td><Button bsStyle="danger" bsSize="sm">Delete</Button></td>
                                                            <td><Button bsStyle="info" bsSize="sm">Get Code</Button></td>
                                                        </tr>
                                                    )
                                                })
                                            }

                                            </tbody>
                                        </Table>

                                    }
                                />
                            </Col>



                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default Login;
