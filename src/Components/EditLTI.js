import React, { Component } from 'react'
import { clearFix } from 'polished'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import uuid from 'uuid'

import InputMoment from "input-moment"

import DatePicker from 'react-datepicker'
import moment from "moment"
import {tz} from "moment-timezone"

import 'react-datepicker/dist/react-datepicker.css'
import 'input-moment/dist/input-moment.css'

const Container = styled.div`
    width:100%;
    min-height:100px;
    background-color:#FFFAD0;
    ${ clearFix() }

    margin-bottom:10px;
    border:2px solid red;
`

const Title = styled.div`

    width:100%;
    height:30px;
    padding:5px;
    text-align:center;
    background-color:black;
    color:white;
    font-weight:bold;

`

const StyledDatePicker = styled(DatePicker).attrs({
   
})`


`

export default class EditLTI extends Component{



    render(){

        console.log(this.props.m.tz());
        return(<Container>
            <Title>Edit LTI Options (Visible To Instructors Only)</Title>
            <div className="form-horizontal edit-page-form">
                    {/* <div className="form-group">
                        <label className="col-sm-2 control-label">Max Upload Attempts</label>
                        <div className="col-sm-10">
                            <input 
                                min={1}
                                type="number" 
                                className="form-control" 
                                name="temp_activity_title" 
                                placeholder="Number of Attempts" 
                                value={this.props.max_attempts}
                                onChange={(e)=>{
                                    this.props.updateState({
                                        max_attempts:e.target.value
                                    })
                                }}
                            />
                        </div>
                    </div> */}
                    <div className="form-group">
                        <label className="col-sm-2 control-label">Due Date 
                            <br/>(Uploads will be disabled after this Date) 
                            <br/><br/>Timezone: {this.props.m.tz()}
                        </label>
                        <div className="col-sm-3"><label 
                                type="text" 
                                className="form-control" 
                                placeholder={this.props.m.format("LLL")}
                                value={this.props.m.format("LLL")}
                        >{this.props.m.format("LLL")}</label></div>
                        <div className="col-sm-7">
                        <InputMoment
                            moment={this.props.m}
                            onChange={(m)=>{
                                this.props.updateState({
                                    m
                                })
                            }}
                            minStep={1} // default
                            hourStep={1} // default
                            prevMonthIcon="ion-ios-arrow-left" // default
                            nextMonthIcon="ion-ios-arrow-right" // default
                        />
                        </div>
                        
                        
                        
                    </div>
            </div>
            <button className="btn btn-md btn-primary" onClick={this.props.updateLTI}>Update LTI</button>
        </Container>)
    }
}

EditLTI.PropTypes = {

}

EditLTI.defaultProps = {

}