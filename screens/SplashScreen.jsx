import React, { useEffect } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import {zoomIn} from "react-native-animatable";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("login");
    }, 4000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={{
          from: {
            rotate: "0deg",
            scale: 1,
          },
          to: {
            rotate: "720deg",
            scale: 2,
          },
        }}
        duration={3000}
        easing="ease-out"
        iterationCount={1}
        style={styles.logoContainer}
      >
        <Image source={require("../assets/chatlogo1.png")} style={styles.logo} />
      </Animatable.View>
      <Animatable.View style={{ paddingTop: 80 }}
      animation="zoomIn"
      duration={3000}
        easing="ease-out"
        iterationCount={1}
      >
        
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 50 }}>CHATBOX</Text>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8de1fc",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default SplashScreen;
