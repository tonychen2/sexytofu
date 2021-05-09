import React, {Component} from "react";
import  "regenerator-runtime";

import {List, ListItem, ListItemText, ListItemIcon} from "@material-ui/core";

export default function Summary(props) {
    return (
        <List>
            <ListItem>
                {/*<ListItemIcon></ListItemIcon>*/}
                <ListItemText>{props.driveEq} miles driving</ListItemText>
            </ListItem>
        </List>
    )
}