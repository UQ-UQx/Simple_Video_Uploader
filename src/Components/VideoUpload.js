import React, { Component } from 'react'
import { clearFix } from 'polished'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import styled, {css} from 'styled-components'
import uuid from 'uuid'

import "../Stylesheets/Dropzone.scss"
import VideoPreview from "./VideoPreview"
import {Icon} from "react-fa"


const Container = styled.div`
    width:100%;
    min-height:100px;
    ${ clearFix() }
`

const DropzoneContentContainer = styled.div`
    width: 100%;
    position: relative;
    height:150px;
`

const DropzoneContent = styled.div`
    height:0px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    z-index: 0;
    width:80%;
    text-align: center;

`

const DropzoneContentItem = styled.div`

    padding:5px;
    text-align: center;
    font-weight: bold;

`



export default class VideoUpload extends Component{

    render(){
        let disabledFlag = "disabled"

        if(!this.props.past_deadline){
            disabledFlag = ""
        }
        
        let dropzoneContent = (
            
            <DropzoneContentContainer>
                <DropzoneContent>
                    <DropzoneContentItem> <Icon size="3x" name="cloud-upload"/> </DropzoneContentItem>
                    <DropzoneContentItem>Drag and drop your video here or use the button below</DropzoneContentItem>
                    <DropzoneContentItem>
                        <button className={"btn btn-default "+disabledFlag} onClick={(event)=>{
                            if(!this.props.past_deadline){
                                this.refs.video_dropzone.open()
                            } 

                        }}>Browse</button>
                    </DropzoneContentItem>
                </DropzoneContent>
            </DropzoneContentContainer>

        )

        if((this.props.accepted && (this.props.accepted.length > 0)) || this.props.src){
            dropzoneContent = <VideoPreview src={this.props.src} accepted={this.props.accepted} rejected={this.props.rejected} />
                
        }



        return(
        <Container>

                <Dropzone
                    accept="video/*"
                    onDrop={(accepted, rejected) => { 
                        console.log(accepted, rejected)
                        if(!this.props.past_deadline){
                            this.props.updateState({ accepted, rejected }); 
                            
                        }
                        
                    }}
                    disableClick={true}
                    className="video-dropzone"
                    multiple={false}
                    ref="video_dropzone"

                >

                {dropzoneContent}


            </Dropzone>
        </Container>)
    }
}

VideoUpload.PropTypes = {

}

VideoUpload.defaultProps = {

}