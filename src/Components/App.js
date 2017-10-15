import React from "react"
import axios from "axios"
import styled from "styled-components"

import VideoUpload from "./VideoUpload"
import VideoPreview from "./VideoPreview"


// See styled-components documentation for further api info
const Container = styled.div`


`

const UploadButton = styled.button`


`

export default class App extends React.Component {
    constructor(props){
        super(props);

        let defaultState = {
            accepted: [],
            rejected: []
        }

        props.appState ? this.state = props.appState : this.state = defaultState

        this.updateState = this.updateState.bind(this)
        this.uploadVideoFile = this.uploadVideoFile.bind(this)
    }

    updateState(newState){
        this.setState(newState)
    }

    uploadVideoFile(){
        if(this.state.accepted && (this.state.accepted.length > 0) ){
            

            console.log(this.state.accepted)

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
                app.setState(response.data);
                
    
            }).catch(function(error){
    
                //////console.log("Single Post Fail: 😡",error.response);
    
            });
    

        }
    }


    render(){

        let disabledFlag = "disabled"

        if(this.state.accepted && (this.state.accepted.length > 0) ){
            disabledFlag = ""
        }
        return (
        <Container>

            <VideoUpload accepted={this.state.accepted} rejected={this.state.rejected} updateState={this.updateState} />
            <UploadButton className={"btn btn-md btn-primary "+disabledFlag} onClick={this.uploadVideoFile} disabledFlag>Submit Video</UploadButton> 

            <VideoPreview accepted={this.state.accepted} rejected={this.state.rejected} />
            

        </Container>);
    }
}
