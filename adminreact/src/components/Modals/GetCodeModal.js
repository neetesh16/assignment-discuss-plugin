import React, { Component } from 'react';
import { Modal, Grid, Row, Col,FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

import {Card} from 'components/Card/Card.jsx';
import {FormInputs} from 'components/FormInputs/FormInputs.jsx';
import {UserCard} from 'components/UserCard/UserCard.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';

export class GetCodeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : this.props.data
        }

    }
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data })
    }
    render() {

        var website = [{
            label : "Website Url",
            type : "text",
            bsClass : "form-control",
            placeholder : "Enter the Website Url for Plugin",
            defaultValue : this.state.data.website
        }]

        var clientid = [{
            label : "Client Id (disabled)",
            type : "text",
            bsClass : "form-control",
            placeholder : "Company",
            value : this.state.data._id,
            disabled : true,
            onChange:this.props.onChange
        }]

        return (
            <Modal
                {...this.props}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Add Or Edit New Site</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col md={12}>
                                <Card
                                    title="Edit Profile"
                                    content={
                                        <form>
                                            <FormInputs

                                                ncols = {["col-md-12"]}
                                                proprieties = {website}
                                            />


                                            <FormInputs
                                                ncols = {["col-md-12" ]}
                                                proprieties = {clientid}
                                            />

                                            <div className="clearfix"></div>
                                        </form>
                                    }
                                />
                            </Col>


                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                    <Button bsStyle="success" onClick={this.props.onSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default GetCodeModal;