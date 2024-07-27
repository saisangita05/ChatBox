import axios from "axios";
import React, { useContext, useEffect, useState,useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "../AuthContext";

const ChatListScreen = ({ navigation }) => {


  const { userId } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  // useEffect(() => {
  //   if (userId) {
  //     getUser();
  //   }
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [userId])
  );

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://192.168.150.145:3000/user/${userId}`
      );
      setChats(response.data);
    } catch (error) {
      console.log("Error fetching user", error);
    }
  },[userId]);

  const renderItem = ({ item }) => {
    // if (item.type === "knowMore") {
    //   return (
    //     <View style={styles.knowMoreContainer}>
    //       <Text style={styles.knowMoreText}>Know More</Text>
    //     </View>
    //   );
    // }
    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() => navigation.navigate("chatscreen",{receiverId: item._id,name: item.name,image:item.image})}
      >
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatMessage}>Hello</Text>
        </View>
        {/* <Text style={styles.chatTime}>{Date.now()}</Text> */}
        <Text style={styles.chatTime}>2:17 AM</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.chatsList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // marginTop: StatusBar.currentHeight,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#d6eaff",
  },
  chatsList: {
    padding: 20,
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chatMessage: {
    fontSize: 14,
    color: "#888",
  },
  chatTime: {
    fontSize: 12,
    color: "#888",
  },
  addIcon: {
    paddingLeft: 30,
    paddingTop: 10,
  },
  knowMoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  knowMoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
});

export default ChatListScreen;
