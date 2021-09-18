import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { auth, db } from "../firebase/config"
import { Avatar, Icon, Button, Overlay } from "react-native-elements"


const ChatsScreen = () => {

    const [chats, setChats] = useState([])
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    return (<View>
        <Text>This is the chats screen, all your chats are here!</Text>
        <Button title="new chat" onPress={toggleOverlay} />
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <Text>Hello from Overlay!</Text>
        </Overlay>
    </View>


    )
}

export default ChatsScreen