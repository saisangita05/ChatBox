import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Alert,
  Modal,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import TextInputBox from "../reusableComponents/TextInputBox";
import RoundedButton from "../reusableComponents/RoundedButton";
import axios from "axios";
import Lottie from "lottie-react-native"; // Expo version

const Signup = ({ navigation }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // mobile number validation
  const isValidMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile) && mobile.length == 10;
  };

  // password validation
  const isValidPassword = (password) => {
    return password.length >= 5;
  };

  const openImageSelectModal = () => {
    setModalVisible(true);
  };

  const selectImage = (img) => {
    setImage(img);
    setModalVisible(false);
  };

  //handle register
  const handleRegister = () => {
    if (!name || !mobile || !password || !confPassword) {
      Alert.alert("All fields are required");
      return;
    }
    if (!isValidMobile(mobile)) {
      Alert.alert("Enter correct mobile number");
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert("Password should be minimum of 5 digit");
      return;
    }

    if (password !== confPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    const user = {
      name: name,
      mobile: mobile,
      password: password,
      image: image,
    };

    axios
      .post("http://192.168.150.145:3000/register", user)
      .then((response) => {
        // console.log(response);
        Alert.alert("Registration Successful");
        navigation.navigate("login");
        setName("");
        setMobile("");
        setPassword("");
        setImage("");
      })
      .catch((error) => {
        console.error("Registration Error", error);
        Alert.alert(
          "Registration Error",
          error.response?.data?.message || error.message
        );
      });
  };

  let inputUserNameProps = {
    width: 320,
    height: 50,
    borderRadius: 10,
    borderColor: "#3c3c3c",
    borderWidth: 3,
    backgroundColor: "white",
    textAlign: "left",
    fontSize: 15,
    fontWeight: "200",
    placeholder: "Username",
    secureTextEntry: false,
    keyboardType: "default",
    placeholderTextColor: "grey",
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

  let inputConfPasswordProps = {
    width: 320,
    height: 50,
    borderRadius: 10,
    borderColor: "#3c3c3c",
    borderWidth: 3,
    backgroundColor: "white",
    textAlign: "left",
    fontSize: 15,
    fontWeight: "200",
    placeholder: "Confirm Password",
    secureTextEntry: true,
    keyboardType: "default",
    placeholderTextColor: "grey",
  };

  let loginBtnObj = {
    bgColor: "#8200a6",
    textColor: "white",
    width: 320,
    height: 50,
    text: "Register",
    logo: "",
  };

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/free-vector/purple-fluid-background_53876-99561.jpg?w=360&t=st=1721930571~exp=1721931171~hmac=3007a9432853002b5d1d9ee0b06666067a3bfdc6989a6fabab6158864383449d",
      }}
      resizeMode="cover"
      style={styles.bg}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.animationContainer}>
            <Lottie
              source={require("../assets/animations/Animation - 1721927523538.json")}
              autoPlay
              loop
              style={{
                marginTop: 20,
                width: 150,
                height: 150,
              }}
            />
          </View>

          <View style={styles.loginContainer}>
            <View style={{ marginBottom: 30}}>
              <Pressable onPress={openImageSelectModal}>
                <Image
                  style={{ width: 65, height: 65, borderRadius: 25 }}
                  source={{
                    uri: image
                      ? image
                      : "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />
              </Pressable>
            </View>
            <View style={{ marginBottom: 20 }}>
              <TextInputBox
                textInputProps={inputUserNameProps}
                value={name}
                setValue={setName}
              />
            </View>

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

            <View style={{ marginBottom: 20 }}>
              <TextInputBox
                textInputProps={inputConfPasswordProps}
                value={confPassword}
                setValue={setConfPassword}
              />
            </View>

            <View style={{ top: 10 }}>
              <RoundedButton
                onPressFunction={handleRegister}
                btnObj={loginBtnObj}
              />
            </View>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Choose an Avatar</Text>
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      selectImage(
                        "https://img.freepik.com/free-photo/3d-rendering-cute-cartoon-boy-sitting-bar-counter_1142-55398.jpg?ga=GA1.1.1929705956.1708626574&semt=ais_user"
                      )
                    }
                  >
                    <Image
                      source={{
                        uri: "https://img.freepik.com/free-photo/3d-rendering-cute-cartoon-boy-sitting-bar-counter_1142-55398.jpg?ga=GA1.1.1929705956.1708626574&semt=ais_user",
                      }}
                      style={styles.modalImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      selectImage(
                        "https://img.freepik.com/free-photo/portrait-young-woman-wearing-glasses-3d-rendering_1142-43632.jpg?ga=GA1.1.1929705956.1708626574&semt=ais_user"
                      )
                    }
                  >
                    <Image
                      source={{
                        uri: "https://img.freepik.com/free-photo/portrait-young-woman-wearing-glasses-3d-rendering_1142-43632.jpg?ga=GA1.1.1929705956.1708626574&semt=ais_user",
                      }}
                      style={styles.modalImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  animationContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  loginContainer: {
    width: "100%",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalImage: {
    width: 100,
    height: 100,
    margin: 10,
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
