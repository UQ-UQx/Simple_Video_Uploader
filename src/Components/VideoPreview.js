import React, { Component } from 'react'
import { clearFix } from 'polished'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import uuid from 'uuid'

const Container = styled.div`
    width:100%;
    height:100px;
    background-color:#FFFAD0;
    ${ clearFix() }
`

export default class VideoPreview extends Component{
    render(){
        return(<Container>
            This is a component for VideoPreview
            
        </Container>)
    }
}

VideoPreview.PropTypes = {

}

VideoPreview.defaultProps = {

}