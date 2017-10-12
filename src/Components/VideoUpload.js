import React, { Component } from 'react'
import { clearFix } from 'polished'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import styled, {css} from 'styled-components'
import uuid from 'uuid'

import "../Stylesheets/Dropzone.scss"


const Container = styled.div`
    width:100%;
    min-height:100px;
    ${ clearFix() }
`

export default class VideoUpload extends Component{
    render(){
        return(<Container>
            Upload Video:
            <Dropzone
                accept="video/*"
                onDrop={(accepted, rejected) => { 
                    console.log(accepted, rejected)
                    this.props.updateState({ accepted, rejected }); 
                }}
                className="video-dropzone"
                
            >
                Drag and Drop
            </Dropzone>
        </Container>)
    }
}

VideoUpload.PropTypes = {

}

VideoUpload.defaultProps = {

}