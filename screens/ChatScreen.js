import React, { useCallback, useState, useLayoutEffect, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar, Icon } from "react-native-elements"
import { GiftedChat } from 'react-native-gifted-chat'

import { auth, db } from "../firebase/config"



const ChatScreen = (props) => {

    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            // title: value === '' ? 'No title' : value,
            headerLeft: () => (
                <View style={{ marginLeft: 10 }}>
                    <Icon
                        type="Feather" name="chevron-left" size={42} onPress={() => props.navigation.goBack()}

                    />
                </View>
            ),
            title: <Text style={{ fontWeight: "bold" }}>{props.route.params.name}</Text>,

        });


    }, [props.navigation]);

    const signOut = () => {
        auth.signOut().then(() => {
            // Sign-out successful.
            props.navigation.replace("Login");
        }).catch((error) => {
            // An error happened.
        });
    }


    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').doc(props.route.params.chatId).collection('messages').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
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



        db.collection('chats').doc(props.route.params.chatId).collection('messages').add({
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
            placeholder={`Message ${props.route.params.name}...`}
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