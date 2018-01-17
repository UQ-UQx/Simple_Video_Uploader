import React, { Component } from 'react'
import { clearFix } from 'polished'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import uuid from 'uuid'

import {Icon} from 'react-fa'


import { detect } from "detect-browser"

import { Player } from 'video-react';

import "../../../node_modules/video-react/dist/video-react.css"; // import css for video player

const Container = styled.div`
    width:100%;
    background-color:#FFFAD0;
    ${ clearFix() }
`

const Table = styled.table`
    table-layout: fixed;
    width:100%;
    
`
const TableHeader = styled.thead`

`
const TableBody = styled.tbody`

`
const TableHead = styled.th`

    text-align:center;
    background-color:darkgrey;
    color:white;
    border:1px solid black;

`
const TableRow = styled.tr`


`
const TableCell = styled.td`
   text-align:center;


`

const DownloadButtonContainer = styled.div`

    width:100%;
   text-align:center;
   padding-top:50px;
    

`

const HTMLVideo = styled.video`

    width:100%;
    height:auto;

`
const UnsupportedMessage = styled.div`

padding: 70px 0;
border: 3px solid black;
background-color:darkgrey;
text-align: center;

`


export default class Entries extends Component{
    constructor(props){
        super(props)

        this.state = {
            browser:detect()
        };

        
    }
   
    render(){

        let chrome = (<UnsupportedMessage>
            

                        <p>Unfortunately video playback is not supported in this browser</p>
                        <p>Supported Browsers: Firefox, Safari, Edge</p>
                        <p>Please use either a supported browser (see above) or use the download button on the left to download the video</p>
            
                    </UnsupportedMessage>)
            
        
            
        let entriesList = this.props.entries.map((entry)=>{
            let link = "../public/videos/"+entry.course_id+"/"+entry.lti_id+"/"+entry.filename
            return (<TableRow key={uuid.v4()}>
                <TableCell>
                    <Icon name="id-card-o" /> Submission ID: {entry.user_id}
                    <DownloadButtonContainer>
                        <a href={link} download><Icon name="download" size="2x" /> Download Video</a>
                    </DownloadButtonContainer>
                    
                </TableCell>
                <TableCell>
                
                
                    {this.state.browser.name === "chrome" ? chrome:(<HTMLVideo controls>
                <source src={link} type="video/mp4" />
                Your browser does not support the video tag. 
                Please use the download button on the left to watch the video.
                (Please ensure you are using the latest version of Google Chrome, Mozilla Firefox or Microsoft Edge)
        </HTMLVideo>)}

                </TableCell>
            </TableRow>)
        })

        

        return(<Container>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Submission Id</TableHead>
                        <TableHead>Video</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entriesList}
                </TableBody>
            </Table>

            
        </Container>)
    }
}

Entries.PropTypes = {

}

Entries.defaultProps = {

}