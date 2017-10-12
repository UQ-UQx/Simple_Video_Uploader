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
            accepted: [],
            rejected: []
        }

        props.appState ? this.state = props.appState : this.state = defaultState

        this.updateState = this.updateState.bind(this)
    }

    updateState(newState){
        this.setState(newState)
    }


    render(){

        
        return (
        <Container>

            <VideoUpload accepted={this.state.accepted} rejected={this.state.rejected} updateState={this.updateState} />
            <VideoPreview accepted={this.state.accepted} rejected={this.state.rejected} />

        </Container>);
    }
}
