import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'

import { auth, db } from "../firebase/config"
import { Avatar, Icon, Button, Overlay, SearchBar, ListItem } from "react-native-elements"


const ChatsScreen = () => {

    const [chats, setChats] = useState([])
    const [visible, setVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("")
    const [foundUsers, setFoundUsers] = useState([])

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const findUsers = () => {
        console.log("searching for user: " + searchTerm)
        db.collection("users")
            .where("displayName", ">=", searchTerm)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return { id, ...data }
                })
                setFoundUsers(users)
            })
    }

    const newChat = (user) => {
        // user to begin chatting with
        console.log(user)
        //now we navigat to a new chat, passing user.id
        //we also create new chat collection for the users involved.
        //but that would be duplicating no? shittttt
    }


    return (<View>
        <Text>This is the chats screen, all your chats are here!</Text>
        <Button title="new chat" onPress={toggleOverlay} />
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}
            overlayStyle={{ width: "80%", height: "80%", }}
        >
            <Text>Who do you want to chat with?</Text>
            <SearchBar
                placeholder="Search for a user"
                onChangeText={(search) => { setSearchTerm(search) }}
                value={searchTerm}
                searchIcon={{ type: "font-awesome", name: "search" }}
                onSubmitEditing={() => findUsers()}
            />
            <FlatList
                data={foundUsers}

                numColumns={1}
                horizontal={false}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={() => newChat(item)}>
                            <ListItem bottomDivider>
                                <Avatar source={{ uri: item.photoUrl }} />
                                <ListItem.Content>
                                    <ListItem.Title>{item.displayName}</ListItem.Title>
                                    <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron type="MaterialIcons" name="group-add" size={44} />
                            </ListItem>
                        </TouchableOpacity>
                    )
                }
                }
            />




        </Overlay>
    </View>


    )
}


export default ChatsScreen