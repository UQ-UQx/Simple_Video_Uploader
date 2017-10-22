import React, { Component } from 'react'
import { clearFix } from 'polished'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import uuid from 'uuid'


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


`



export default class Entries extends Component{
    constructor(props){
        super(props)

        
    }


    render(){

        let entriesList = this.props.entries.map((entry)=>{
            return (<TableRow key={uuid.v4()}>
                <TableCell>{entry.user_id}</TableCell>
                <TableCell>
                    <Player
                        playsInline
                        src={"../public/videos/"+entry.course_id+"/"+entry.lti_id+"/"+entry.filename}
                    />
                </TableCell>
            </TableRow>)
        })

        

        return(<Container>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Id</TableHead>
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