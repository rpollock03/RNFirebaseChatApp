import React, { useCallback, useState, useLayoutEffect, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar, Icon } from "react-native-elements"
import { GiftedChat } from 'react-native-gifted-chat'

import { auth, db } from "../firebase/config"

const ChatScreen = ({ navigation }) => {

    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            // title: value === '' ? 'No title' : value,
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Avatar
                        rounded
                        source={{
                            uri: auth?.currentUser?.photoURL,
                        }}
                    />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 10
                }}
                    onPress={signOut}
                >
                    <Icon type="AntDesign" name="logout" size={24} color="black" />
                </TouchableOpacity>
            )
        });
    }, [navigation]);

    const signOut = () => {
        auth.signOut().then(() => {
            // Sign-out successful.
            navigation.replace("Login");
        }).catch((error) => {
            // An error happened.
        });
    }

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
            }))
        ));
        return unsubscribe;
    }, [])


    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

        const {
            _id,
            createdAt,
            text,
            user,
        } = messages[0]

        db.collection('chats').add({
            _id,
            createdAt,
            text,
            user
        })
    }, [])

    return (
        <GiftedChat
            showAvatarForEveryMessage={true}
            showUserAvatar={true}
            renderAvatarOnTop
            messages={messages}
            avatarSize={50}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
            user={{
                _id: auth?.currentUser?.email,
                name: auth?.currentUser?.displayName,
                avatar: auth?.currentUser?.photoURL
            }}
        />
    )
}


export default ChatScreen