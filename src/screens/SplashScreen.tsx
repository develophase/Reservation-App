// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image
} from 'react-native';
import {
    BORDERRADIUS,
    COLORS,
    FONTFAMILY,
    FONTSIZE,
    SPACING,
  } from '../theme/theme';
import EncryptedStorage from 'react-native-encrypted-storage';
import { apikey, getAccountsByParams } from '../api/apicalls';
import LottieView from "lottie-react-native";

const SplashScreen = ({navigation}: any) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      EncryptedStorage.getItem('login_user').then((value) =>
        navigation.replace(
          value === null ? 'SignOutNavigator' : 'SignInNavigator'
        ),
      );
    }, 7000);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation.json')}
        style={{ 
          width: '50%', 
          height: '50%'
        }}
        autoPlay={true}
        loop={false}>
      </LottieView>
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <Image
  //       source={require('../assets/image/god.png')}
  //       style={{width: '90%', resizeMode: 'contain', margin: 30}}
  //     />
  //     <ActivityIndicator
  //       animating={animating}
  //       color="#FFFFFF"
  //       size="large"
  //       style={styles.activityIndicator}
  //     />
  //   </View>
  // );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Black,
    // width:'100%', 
    // height:'100%'
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});