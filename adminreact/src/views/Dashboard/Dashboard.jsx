import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col,Table,Button } from 'react-bootstrap';
import axios from 'axios'

import {Card} from 'components/Card/Card.jsx';
import {StatsCard} from 'components/StatsCard/StatsCard.jsx';
import {Tasks} from 'components/Tasks/Tasks.jsx';
import {Modals} from 'components/Modals/Modals.jsx';
import {thArray, tdArray} from 'variables/Variables.jsx';
import {read_cookie} from "sfcookies";



class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            editData:{
                _id:"",
                website:""
            }
        }
        this.delta = this.delta.bind(this);
        this.savePlugin = this.savePlugin.bind(this);
        this.copyCode = this.copyCode.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    delta(data) {
        this.setState({
            list : data,
            lgShow: false,
            editData:{
                website:"",
                _id:""
            }
        });



    }

    showModal(data){


        // console.log(this.state.editData);
        this.setState({ editData: data ,lgShow: true })
    }

    copyCode(data){
        var url = "http://localhost:3001/plugin?apiKey="+data._id;
        var script = '<script src="'+url+'"></script>\n' +
            '<div id="discuss-main">\n' +
            '</div>';

        var textField = document.createElement('textarea')
        textField.innerText = script
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove();
        alert("Code Copied To Clipboard.");
    }

    deletePlugin(data){
        var self = this;
        axios.post('/users/deletePlugin',data,{headers:{"x-auth-token":read_cookie("XAuthToken")}})
            .then(function (response) {
                if(response.data.response===1){
                    alert("Deleted");
                    self.handleTableData();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    savePlugin(){
        var self = this;
        axios.post('/users/savePlugin',this.state.editData,{headers:{"x-auth-token":read_cookie("XAuthToken")}})
            .then(function (response) {
                console.log(response);
                if(response.data.response===1){
                    alert("Saved");
                    self.handleTableData();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        this.setState({ lgShow: false });
    }
    handleChange = (event) => {
        var obj = this.state.editData;
        obj.website = event.target.value;
        this.setState({ editData :obj });
    };
    hideModal(){
        this.setState({ lgShow: false });
    }
    handleTableData(){
        var self = this;
        axios.get('/users/getPluginList',{headers:{"x-auth-token":read_cookie("XAuthToken")}})
            .then(function (data) {


                self.delta(data.data.response);
                console.log(self.state);
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
                                <Modals  show={this.state.lgShow} onSave={this.savePlugin} onChange={(event)=>this.handleChange(event)} onHide={this.hideModal} data={this.state.editData}/>
                                <Button className="pull-right"
                                    bsStyle="primary"
                                    onClick={() => this.setState({ lgShow: true })}
                                >
                                    Add New Plugin
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
                                                        <tr key={key._id}>

                                                            <td>{key.website}</td>
                                                            <td>{key._id}</td>
                                                            <td><Button bsStyle="primary" bsSize="sm" onClick={()=>this.showModal(key)}>Edit</Button></td>
                                                            <td><Button bsStyle="danger" bsSize="sm" onClick={()=>this.deletePlugin(key)}>Delete</Button></td>
                                                            <td><Button bsStyle="info" bsSize="sm"  onClick={()=>this.copyCode(key)}>Copy Code</Button></td>
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

export default Dashboard;
