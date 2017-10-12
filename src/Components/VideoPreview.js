import React, { Component } from 'react'
import { clearFix } from 'polished'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import uuid from 'uuid'
import { Player } from 'video-react';



import "../../node_modules/video-react/dist/video-react.css"; // import css for video player


const Container = styled.div`
    width:100%;
    height:100px;
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

        if(this.props.accepted && (this.props.accepted.length > 0)){
           player = (<Player
            playsInline
            poster="/assets/poster.png"
            src={this.props.accepted[0].preview}
            />)
        }

        return(<Container>
            This is a component for VideoPreview

            
            {player}
        </Container>)
    }
}

VideoPreview.PropTypes = {

}

VideoPreview.defaultProps = {

}