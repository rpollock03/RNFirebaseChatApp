import React, { useState, useEffect } from 'react'
import { Image, View, StyleSheet, ActivityIndicator } from "react-native"
import { Button, Text, Input } from "react-native-elements"

import Spacer from "../components/Spacer"

import {
    useFonts,
    LeckerliOne_400Regular
} from '@expo-google-fonts/leckerli-one'


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

    let [fontsLoaded, error] = useFonts({
        LeckerliOne_400Regular
    })

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" />
    } else return (<View style={styles.container}>
        <Text style={styles.title}>hmu</Text>
        <Text h4 style={styles.subtitle}>Welcome to hit me up</Text>
        <View style={styles.buttonCont}>
            {currentUser ? <Button title={`Continue as @${currentUser}`}
                onPress={() => navigation.navigate("Chats")} />
                : <Button title="Sign in" onPress={() => navigation.replace("Login")} />}

            {currentUser ? <Button type="clear" title="Switch account" onPress={signOut} /> : null}
        </View>
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
        color: "#ffb347",
        marginTop: 40,
        fontSize: 100,
        fontFamily: "LeckerliOne_400Regular"
    },
    subtitle: {
        color: "grey",
        textAlign: "center",
    },
    buttonCont: {
        marginTop: "auto",
        marginBottom: "25%"
    }

})


export default LandingScreen

