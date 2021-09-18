import React, { useState, useEffect } from 'react'
import { Image, View, StyleSheet } from "react-native"
import { Button, Text, Input } from "react-native-elements"

import Spacer from "../components/Spacer"

import { auth } from "../firebase/config"

const LandingScreen = ({ navigation }) => {

    const [currentUser, setCurrentUser] = useState("")

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(function (user) {
            if (user) {
                //navigation.replace('Chat');
                setCurrentUser(user.displayName)
            } else {
                //prevent back button after user logs out
                navigation.canGoBack() && navigation.popToTop()
                setCurrentUser(null)
            }
        });
        return unsubscribe;
    }, [])

    const signOut = () => {
        auth.signOut().then(() => {
            // Sign-out successful.
            navigation.replace("Login");
        }).catch((error) => {
            // An error happened.
        });
    }

    return (<View style={styles.container}>
        <Image style={{ width: 120, height: 120, marginLeft: "auto", marginRight: "auto" }} source={require('../assets/logo.png')} />
        <Text h2 style={styles.title}>What's the craic?</Text>
        <Text h4 style={styles.subtitle}>An Irish Messaging service</Text>
        {currentUser ? <Button title={`Continue as @${currentUser}`}
            onPress={() => navigation.navigate("Chats")} />
            : <Button title="Sign in" onPress={() => navigation.replace("Login")} />}

        {currentUser ? <Button type="clear" title="Switch account" onPress={signOut} /> : null}

    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "25%",
        padding: "5%"
    },
    button: {
        margin: 20
    },
    title: {
        textAlign: "center",
        marginTop: 40
    },
    subtitle: {
        marginTop: 10,
        marginBottom: 90,
        color: "grey",
        textAlign: "center"
    }

})


export default LandingScreen

