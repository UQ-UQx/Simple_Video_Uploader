import React from "react"
import axios from "axios"
import styled from "styled-components"

import VideoUpload from "./VideoUpload"
import VideoPreview from "./VideoPreview"
import EditLTI from "./EditLTI"

import {Icon} from "react-fa"

import moment from "moment"
import {tz} from "moment-timezone"


// See styled-components documentation for further api info
const Container = styled.div`


`

const Button = styled.button`

   margin:5px;

`

const ButtonsContainer = styled.div`

    margin-top:20px;
    text-align: center;

`
const SubmissionDetailsTitle = styled.div`
    margin-top:20px;
    text-align:center;
    font-weight:bold;
    background-color:black;
    padding:5px;
    color:white;
`

const SubmissionDetails = styled.div`
    text-align:center;
    
    padding:10px;
    background-color:#31691F;
    color:white;
    font-weight:bold;
`

const SubmissionDeadlineMessage = styled.div`
    text-align:center;
    
    padding:10px;
    background-color:red;
    color:white;
    font-weight:bold;
    
`

export default class App extends React.Component {
    constructor(props){
        super(props);

        let defaultState = {
            accepted: [],
            rejected: [],
            submitting:false,
            submitted:false,
            due_date:null,
            max_attempts:1,
            m:moment().tz("utc"),
            due:null,
            max:null,
            src:null,
            past_deadline:false
        }

        props.appState ? this.state = {...defaultState, ...props.appState} : this.state = defaultState

        this.updateState = this.updateState.bind(this)
        this.uploadVideoFile = this.uploadVideoFile.bind(this)
        this.handleImageReset = this.handleImageReset.bind(this)
        this.updateLTI = this.updateLTI.bind(this)
    }

    updateLTI(){

        this.setState({
            due:this.state.due_date,
            max:this.state.max_attempts
        })

    }

    handleImageReset(){

        if(this.state.src && (this.state.src !== "")){

            console.log("WHY ARE YOU RUNNING!!", this.state.src, (this.state.src !== ""))
            const postData = new FormData();

            postData.append('action', "remove_video");

            postData.append('user_id', $LTI_userID);
            postData.append('lti_id', $LTI_resourceID);

            postData.append('src', this.state.src)
            postData.append('lti_grade_url', $LTI_grade_url);
            postData.append('lti_consumer_key', $LTI_consumer_key);
            postData.append('result_sourcedid', $LTI_result_sourcedid);
    
    
            axios.post('../public/api/api.php', postData)
            .then((response)=>{
    
                this.setState({
                    src:null,
                    submission_id:null,
                    submitted:false,
                    accepted:[],
                    rejected:[] 
                });
                
    
            }).catch(function(error){
    
                //////console.log("Single Post Fail: 😡",error.response);
    
            });

        }else{
            this.setState({
                accepted:[],
                rejected:[]  
            })
        }
       

    }
    updateState(newState){
        this.setState(newState)
    }

    uploadVideoFile(){
        if(this.state.accepted && (this.state.accepted.length > 0) ){
            

            this.setState({
                submitting:true
            })

            var app = this;
            const postData = new FormData();
            postData.append('file', this.state.accepted[0]);
            postData.append('action', "submit_video");

            postData.append('user_id', $LTI_userID);
            postData.append('lti_id', $LTI_resourceID);
            postData.append('course_id', $LTI_courseID);
    
            postData.append('lti_grade_url', $LTI_grade_url);
            postData.append('lti_consumer_key', $LTI_consumer_key);
            postData.append('result_sourcedid', $LTI_result_sourcedid);
    
    
            axios.post('../public/api/api.php', postData)
            .then(function(response){
    
                //////console.log("Single Post Success: 😃",response)
                        //this.setState({"selected_page":"map_page"})

                app.setState({...app.state, ...response.data, submitting:false, submitted:true
                });
                
    
            }).catch(function(error){
    
                //////console.log("Single Post Fail: 😡",error.response);
    
            });
    

        }
    }


    render(){

        let disabledFlag = "disabled"
        let submitButtonMessage = "Submit Video"
        let removeImageContent = ""
        let buttonsContainer = (
            <ButtonsContainer>
                <Button className={"btn btn-md btn-primary "+disabledFlag} onClick={this.uploadVideoFile} disabledFlag>Submit Video</Button> 
                {removeImageContent}
            </ButtonsContainer>
        )
        let submissionDetails = ""

        console.log(this.state)

        if(this.state.accepted && (this.state.accepted.length > 0)){
            console.log("red", this.state.submitting)
            if(this.state.submitting){
                disabledFlag = "disabled"
                submitButtonMessage = (<div>Submitting <Icon spin name="spinner"/></div>)
                
            }else{
                disabledFlag = ""                
            }
            removeImageContent = (
                <Button className={"btn btn-md btn-danger "+disabledFlag}
                    onClick={this.handleImageReset}
                    disabledFlag
                >
                Remove Video <Icon  name="times"/>
                </Button>
            )
            buttonsContainer = (
                <ButtonsContainer>
                    <Button className={"btn btn-md btn-primary "+disabledFlag} onClick={this.uploadVideoFile} disabledFlag>{submitButtonMessage}</Button> 
                    {removeImageContent}
                </ButtonsContainer>
            )
            
        }

        if(this.state.src && (this.state.src != "")){
            console.log("FDSHFJKDLs",this.state.src != "")

            
            removeImageContent = (
                <Button className={"btn btn-md btn-danger "}
                    onClick={this.handleImageReset}
                    
                >
                Remove Video <Icon  name="times"/>
                </Button>
            )
            buttonsContainer = (
                <ButtonsContainer>
                    {removeImageContent}
                </ButtonsContainer>
            )
            
         
            submissionDetails = (
                <div>
                <SubmissionDetailsTitle>Your Submission ID:</SubmissionDetailsTitle>
                
                            <SubmissionDetails>
                                 {this.state.submission_id}
                            </SubmissionDetails>
                </div>
            )
        }

        if(this.state.past_deadline){
            buttonsContainer = (<SubmissionDeadlineMessage>

                Activity is past deadline, new submissions or changes are no longer accepted.

            </SubmissionDeadlineMessage>)

        }

       
        return (
        <Container>

         {/*    <EditLTI
                m={this.state.m}
                due_date={this.state.due_date}
                max_attempts={this.state.max_attempts}
                updateState={this.updateState}
                updateLTI={this.updateLTI}
            /> */}

            <VideoUpload past_deadline={this.state.past_deadline} src={this.state.src} accepted={this.state.accepted} rejected={this.state.rejected} updateState={this.updateState} />
            {buttonsContainer}
            {submissionDetails}
            

        </Container>);
    }
}
