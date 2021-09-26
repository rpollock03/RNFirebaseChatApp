import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'

import { auth, db } from "../firebase/config"
import { Avatar, Icon, Button, Overlay, SearchBar, ListItem, Input, Header } from "react-native-elements"
import { NavigationContainer } from "@react-navigation/native"

import {
    useFonts,
    LeckerliOne_400Regular
} from '@expo-google-fonts/leckerli-one'


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
                return ({ id, key: id, ...data }) //add key here because of RN requirement, otherwise key extractor needed.
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
                    return { id, key: id, ...data }


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

                batch.set(db.collection("chats").doc(newChatId).collection("participants").doc(`${auth.currentUser.uid}`), currentUser)
                batch.set(db.collection("chats").doc(newChatId).collection("participants").doc(`${user.id}`), otherUser)

                //add details of who the chat is with for efficient database retrieval of users chats. Can update later with a number of people in chat for purposes of adding "and others" for example
                batch.set(db.collection('users').doc(`${auth.currentUser.uid}`).collection("chats").doc(`${newChatId}`), { created: firebase.firestore.FieldValue.serverTimestamp(), chatId: newChatId, noOfParticipants: 1, withId: user.id, withDisplayName: user.displayName, withEmail: user.email, withPhotoURL: user.photoURL ? user.photoURL : "https://www.trackergps.com/canvas/images/icons/avatar.jpg" })

                batch.set(db.collection('users').doc(`${user.id}`).collection("chats").doc(`${newChatId}`), { created: firebase.firestore.FieldValue.serverTimestamp(), chatId: newChatId, noOfParticipants: 1, withId: auth.currentUser.uid, withDisplayName: auth.currentUser.displayName, withEmail: auth.currentUser.email, withPhotoURL: auth.currentUser.photoURL })

                await batch.commit()
                toggleOverlay()
                navigation.navigate("Chat", { chatId: newChatId })
            })
    }


    return (<View>
        <Header
            leftComponent={<Icon type="MaterialIcons" name="person-outline" size={36} color="#fff" containerStyle={{ marginTop: 14 }} />}
            centerComponent={{ text: 'hmu', style: { color: '#fff', fontSize: 40, fontFamily: "LeckerliOne_400Regular" } }}
            rightComponent={<Icon type="MaterialIcons" name="person-search" size={36} color="#fff" containerStyle={{ marginTop: 14 }} onPress={toggleOverlay} />}
            containerStyle={{
                backgroundColor: "#ffb347",
                justifyContent: 'space-around',

            }}
        />

        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}
            overlayStyle={{ width: "90%", height: "90%", borderRadius: 20 }}

        >
            <SearchBar
                placeholder="Search for a user"
                onChangeText={(search) => { setSearchTerm(search) }}
                value={searchTerm}
                lightTheme
                round
                containerStyle={{ borderRadius: 20 }}
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

                return (

                    < TouchableOpacity onPress={() => navigation.navigate("Chat", { chatId: item.id })}>
                        <ListItem bottomDivider>
                            <Avatar source={{ uri: item.withPhotoURL }} />
                            <ListItem.Content>
                                <ListItem.Title>@{item.withDisplayName}</ListItem.Title>
                                <ListItem.Subtitle>{new Date(item.created.seconds * 1000).toString().substr(0, 15)}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron type="MaterialIcons" name="message" size={44} />
                        </ListItem>
                    </TouchableOpacity>
                )
            }
            }
        />

    </View >
    )
}


export default ChatsScreen