import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
import TextInputBox from "../reusableComponents/TextInputBox";
import RoundedButton from "../reusableComponents/RoundedButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import LottieView from "lottie-react-native";
import Lottie from "lottie-react-native"; // Expo version
import { ImageBackground } from "react-native";

const Login = ({ navigation }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken, userId } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      setMobile("");
      setPassword("");
      navigation.navigate("bottomtabs");
    }
  }, [token, navigation]);

  const handleSubmit = () => {
    const user = { mobile: mobile, password: password };

    axios
      .post("http://192.168.150.145:3000/login", user)
      .then((response) => {
        const token = response.data.token;
        console.log("yess");
        AsyncStorage.setItem("authToken", token);
        setToken(token);
      })
      .catch((error) => {
        Alert.alert("Fill all the credentials properly!");
      });
  };

  let inputMobileProps = {
    width: 320,
    height: 50,
    borderRadius: 10,
    borderColor: "#3c3c3c",
    borderWidth: 3,
    backgroundColor: "white",
    textAlign: "left",
    fontSize: 15,
    fontWeight: "200",
    placeholder: "Mobile Number",
    secureTextEntry: false,
    keyboardType: "phone-pad",
    placeholderTextColor: "grey",
  };

  let inputPasswordProps = {
    width: 320,
    height: 50,
    borderRadius: 10,
    borderColor: "#3c3c3c",
    borderWidth: 3,
    backgroundColor: "white",
    textAlign: "left",
    fontSize: 15,
    fontWeight: "200",
    placeholder: "Password",
    secureTextEntry: true,
    keyboardType: "default",
    placeholderTextColor: "grey",
  };

  let loginBtnObj = {
    bgColor: "#3552e6",
    textColor: "white",
    width: 320,
    height: 50,
    text: "Login ",
    logo: "",
  };

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/free-vector/blue-fluid-background-frame_53876-99019.jpg?size=626&ext=jpg&ga=GA1.1.603093256.1720510283&semt=ais_user",
      }}
      resizeMode="cover"
      style={styles.bg}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.animationContainer}>
          <Lottie
            source={require("../assets/animations/Animation - 1721926950006.json")}
            autoPlay
            loop
            style={{
              width: 200,
              height: 200,
            }}
          />
        </View>
        {/* <Animatable.View
          animation="flipInX"
          duration={1000}
          easing="ease-in"
          iterationCount={1}
          style={styles.logoContainer}
        >
          <Image
            source={require("../assets/chatlogo1.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Chatbox</Text>
        </Animatable.View> */}

        <View style={styles.loginContainer}>
          <View style={{ marginBottom: 20 }}>
            <TextInputBox
              textInputProps={inputMobileProps}
              value={mobile}
              setValue={setMobile}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <TextInputBox
              textInputProps={inputPasswordProps}
              value={password}
              setValue={setPassword}
            />
          </View>

          <View style={{ top: 10 }}>
            <RoundedButton
              btnObj={loginBtnObj}
              onPressFunction={handleSubmit}
            />
          </View>

          <View style={styles.registerText}>
            <Text style={{ color: "grey" }}>DONT HAVE AN ACCOUNT </Text>

            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
              <Text style={{ color: "black" }}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  topContainer: {
    // backgroundColor: 'yellow',
  },
  logo: {
    width: 100,
    height: 100,
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  logoContainer: {
    // backgroundColor: 'white',
    flexDirection: "row",
    justifyContent: "center",
    flexDirection: "coloumn",
    alignItems: "center",
    top: 100,
  },
  animationContainer: {
    flex:1,
    alignItems:"center",
    marginTop:80,
    justifyContent:"flex-start"
  },
  container: {
    flex: 1,
    paddingTop: 30,
    top: 40,
    // backgroundColor: 'white'
  },
  logoText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#20B2AA",
    marginTop: 12,
    fontWeight: "500",
  },
  loginContainer: {
    flex: 1,
    // backgroundColor: 'white',
    // top: "2%",
    marginBottom:150,
    alignItems: "center",
  },
  registerText: {
    flexDirection: "row",
    top: 50,
  },
});
