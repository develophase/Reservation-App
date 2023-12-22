import React, {useEffect, useState, useRef} from 'react';
import {Text, View, StyleSheet, StatusBar, Image, ScrollView, TouchableOpacity} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import AppHeader from '../components/AppHeader';
import SettingComponent from '../components/SettingComponent';
import EncryptedStorage from 'react-native-encrypted-storage';

const UserAccountScreen = ({navigation}: any) => {
  const [userLogin, setUserLogin] = useState<any>({});

  const logoutApp = async () => {
    try {
      await EncryptedStorage.removeItem("login_user")
        .then(() => {
          navigation.replace('SignOutNavigator');
        })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await EncryptedStorage.getItem('login_user')
      .then (async (session) => {
        if(session !== null && session !== undefined) {
          setUserLogin(JSON.parse(session));
        }
      });
    })();
  }, []);


  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header={'My Profile'}
          action={() => navigation.goBack()}
        />
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/image/cross.png')}
          style={styles.avatarImage}
        />
        <Text style={styles.avatarText}>{userLogin.Name}</Text>
      </View>

      <View style={styles.profileContainer}>
       <TouchableOpacity
          style={styles.button}>
          <SettingComponent
            icon="user"
            heading="Account"
            subheading="View Profile"
            subtitle="Detail"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => { 
            logoutApp();
          }}>
          <SettingComponent
            icon="close"
            heading="Logout"
            subheading="From"
            subtitle="App"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  profileContainer: {
    alignItems: 'center',
    padding: SPACING.space_36,
  },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 80,
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    marginTop: SPACING.space_16,
    color: COLORS.White,
  },
  button: {
    width: '100%'
  }
});

export default UserAccountScreen;
