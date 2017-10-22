import React, { Component } from 'react'
import { clearFix } from 'polished'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import uuid from 'uuid'
import { Player } from 'video-react';



import "../../node_modules/video-react/dist/video-react.css"; // import css for video player


const Container = styled.div`
    width:100%;
    background-color:#FFFAD0;
    ${ clearFix() }
`

export default class VideoPreview extends Component{
    constructor(props){
        super(props)
    }


    render(){

        let player = "Please Upload a Video"
        console.log(this.props)

        if((this.props.accepted && (this.props.accepted.length > 0)) || this.props.src){
           player = (<Player
            playsInline
            src={this.props.src? "../public/videos/"+this.props.src:this.props.accepted[0].preview}
            />)
        }

        return(<Container>

            
            {player}
        </Container>)
    }
}

VideoPreview.PropTypes = {

}

VideoPreview.defaultProps = {

}