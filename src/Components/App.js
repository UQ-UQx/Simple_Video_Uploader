import React from "react"
import axios from "axios"
import styled from "styled-components"

import VideoUpload from "./VideoUpload"
import VideoPreview from "./VideoPreview"

import {Icon} from "react-fa"


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

export default class App extends React.Component {
    constructor(props){
        super(props);

        let defaultState = {
            accepted: [],
            rejected: [],
            submitting:false,
            submitted:false
        }

        props.appState ? this.state = {...defaultState, ...props.appState} : this.state = defaultState

        this.updateState = this.updateState.bind(this)
        this.uploadVideoFile = this.uploadVideoFile.bind(this)
        this.handleImageReset = this.handleImageReset.bind(this)
    }

    handleImageReset(){

        this.setState({

              accepted:[],
              rejected:[]  
        })

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

                app.setState({...app.state, ...response.data, submitting:false
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
            console.log("red")
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
                Clear <Icon  name="times"/>
                </Button>
            )
            buttonsContainer = (
                <ButtonsContainer>
                    <Button className={"btn btn-md btn-primary "+disabledFlag} onClick={this.uploadVideoFile} disabledFlag>{submitButtonMessage}</Button> 
                    {removeImageContent}
                </ButtonsContainer>
            )
            
        }

        if(this.state.src != ""){
            console.log("FDSHFJKDLs",this.state.src != "")
            
            buttonsContainer = ""
            submissionDetails = (
                <div>
                <SubmissionDetailsTitle>Your Submission ID:</SubmissionDetailsTitle>
                
                            <SubmissionDetails>
                                 {this.state.submission_id}
                            </SubmissionDetails>
                </div>
            )
        }


        return (
        <Container>

            <VideoUpload src={this.state.src} accepted={this.state.accepted} rejected={this.state.rejected} updateState={this.updateState} />
            {buttonsContainer}
            {submissionDetails}
            

        </Container>);
    }
}
