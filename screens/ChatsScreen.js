import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'

import { auth, db } from "../firebase/config"
import { Avatar, Icon, Button, Overlay, SearchBar, ListItem, Input } from "react-native-elements"
import { NavigationContainer } from "@react-navigation/native"

import firebase from "firebase"

const ChatsScreen = ({ navigation }) => {

    const [chats, setChats] = useState([])
    const [visible, setVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("")
    const [foundUsers, setFoundUsers] = useState([])

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    useEffect(() => {

        const findExistingChats = async () => {
            //find all chat ids involving user
            const userSnapshot = await db.collection("users").doc(`${auth.currentUser.uid}`).collection("chats").get()
            let foundChats = userSnapshot.docs.map(doc => {
                const id = doc.id
                const data = doc.data()
                return ({ key: id, ...data }) //add key here because of RN requirement, otherwise key extractor needed.
            })
            setChats(foundChats)
            const chatSnapshot = await db.collection("chats").doc()

        }

        findExistingChats()

    }, [])




    const findUsers = () => {
        db.collection("users")
            .where("displayName", ">=", searchTerm)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return { key: id, ...data }
                })
                setFoundUsers(users)
            })
    }

    const newChat = (user) => {
        // user to begin chatting with
        const currentUser = {
            id: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        }
        const otherUser = {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL ? user.photoURL : "https://www.trackergps.com/canvas/images/icons/avatar.jpg"
        }

        db.collection('chats').add({ //add generates new chat document and id
            created: firebase.firestore.FieldValue.serverTimestamp() // when new chat was created
        })
            .then(async (docRef) => {

                const newChatId = docRef.id
                const batch = db.batch()
                //RESET
                batch.set(db.collection("chats").doc(newChatId).collection("participants").doc(`${auth.currentUser.uid}`), currentUser)
                batch.set(db.collection("chats").doc(newChatId).collection("participants").doc(`${user.id}`), otherUser)

                batch.set(db.collection('users').doc(`${auth.currentUser.uid}`).collection("chats").doc(`${newChatId}`), { created: firebase.firestore.FieldValue.serverTimestamp(), id: newChatId })

                batch.set(db.collection('users').doc(`${user.id}`).collection("chats").doc(`${newChatId}`), { created: firebase.firestore.FieldValue.serverTimestamp(), id: newChatId })

                batch.set(db.collection('users').doc(`${auth.currentUser.uid}`).collection("chats").doc(`${newChatId}`).collection("participants").doc(`${user.id}`), otherUser)
                batch.set(db.collection('users').doc(`${user.id}`).collection("chats").doc(`${newChatId}`).collection("participants").doc(`${auth.currentUser.uid}`), currentUser)

                await batch.commit()
                toggleOverlay()
                navigation.navigate("Chat", { chatId: newChatId })
            })
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
                renderItem={({ item, index }) => {
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
        <FlatList
            data={chats}
            numColumns={1}
            horizontal={false}
            renderItem={({ item }) => {
                console.log(item)
                return (
                    <TouchableOpacity >
                        <ListItem bottomDivider>
                            <Avatar source={{ uri: "https://www.trackergps.com/canvas/images/icons/avatar.jpg" }} />
                            <ListItem.Content>
                                <ListItem.Title>Chat with XYZ</ListItem.Title>
                                <ListItem.Subtitle>started xyz</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron type="MaterialIcons" name="group-add" size={44} />
                        </ListItem>
                    </TouchableOpacity>
                )
            }
            }
        />

    </View>
    )
}


export default ChatsScreen