import React from "react"
import axios from "axios"
import styled from "styled-components"

import VideoUpload from "./VideoUpload"
import VideoPreview from "./VideoPreview"


// See styled-components documentation for further api info
const Container = styled.div`


`

export default class App extends React.Component {
    constructor(props){
        super(props);

        let defaultState = {
            
        }

        props.appState ? this.state = props.appState : this.state = defaultState

    }



    render(){

        
        return (
        <Container>
            
            <VideoUpload />
            <VideoPreview />

        </Container>);
    }
}
