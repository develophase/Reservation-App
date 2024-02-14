import React, {useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  FlatList,
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
import CategoryHeader from '../components/CategoryHeader';
import {
  apikey,
  getAccountsByParams,
} from '../api/apicalls';
import Loader from '../components/Loader';

const {width, height} = Dimensions.get('window');

const LoginScreen = ({navigation}: any) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');

    const getAccount = async (offset: number, limit: number, phoneNumber: string, password: string) => {
        try {
          let options = {
            method: 'GET',
            headers: {
              'xc-token': apikey
            }
          };
    
          let query = `(Phone,eq,${phoneNumber})~and(Password,eq,${password})`;
      
          let response = await fetch(getAccountsByParams(offset, limit, query), options);
          let json = await response.json();
          
          return json.list;
    
        } catch (error) {
          console.error(
            'Something went wrong in getNowPlayingMoviesList Function',
            error,
          );
        }
    };
    
    const handleChangePhone = (phone: string) => {
        let reg = /^(0|08|08[0-9]{1,12})$/
        if(reg.test(phone)){
          setPhone(phone);
        }
    };

    const handleSubmit = async (phone: string, password: string) => {
        const phoneNumber = phone;
        const passwordEncrypted = password;

        setErrortext('');
        if (!phoneNumber) {
            setErrortext('Please fill Phone Number');
            return;
        }
        if (!passwordEncrypted) {
            setErrortext('Please fill Password');
            return;
        }
        setLoading(true);
        
        const result = await getAccount(0, 1, phoneNumber, passwordEncrypted);
        if (result != null && result != undefined) {
            if(result.length > 0) {
                await EncryptedStorage.setItem(
                    'login_user',
                    JSON.stringify(result[0])
                ).then(() => {
                    setLoading(false);
                    navigation.replace('SignInNavigator');
                });
            } else {
                setErrortext('User Not Found');
                setLoading(false);
            }
        } else {
            setErrortext('Please Check Your Connection');
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainBody}>
            <Loader loading={loading} />
            <ScrollView
                style={styles.container}
                bounces={false}
                contentContainerStyle={styles.scrollViewContainer}>
                <StatusBar hidden />

                <CategoryHeader title={'Login'} />
                <View style={{alignItems: 'center'}}>
                    <Image
                        source={require('../assets/image/cross.png')}
                        style={{
                        width: '50%',
                        height: 100,
                        resizeMode: 'contain',
                        margin: 30,
                        }}
                    />
                </View>
                <View style={styles.textInputContainer}>
                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.textInput}
                            keyboardType="numeric"
                            onChangeText={phoneNumber => handleChangePhone(phoneNumber)}
                            value={phone}
                            placeholder="Phone Number"
                            placeholderTextColor={COLORS.WhiteRGBA32}
                        />
                    </View>

                    <View style={styles.SectionStyle}>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={password => setPassword(password)}
                            value={password}
                            secureTextEntry={true}
                            placeholder="Password"
                            placeholderTextColor={COLORS.WhiteRGBA32}
                        />
                    </View>
                    {errortext != '' ? (
                        <Text style={styles.errorTextStyle}>
                            {errortext}
                        </Text>
                    ) : null}
                    <TouchableOpacity
                        style={styles.buttonBG}
                        onPress={() => handleSubmit(phone, password)}>
                            <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <Text
                        style={styles.registerTextStyle}
                        onPress={() => navigation.push('Register')}>
                        New Here ? Register
                    </Text>
                </View>   
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
         backgroundColor: COLORS.Black,
    },
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#307ecc',
        alignContent: 'center',
    },
    SectionStyle: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: COLORS.WhiteRGBA15,
        borderRadius: BORDERRADIUS.radius_25,
        paddingHorizontal: SPACING.space_24,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    registerTextStyle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    scrollViewContainer: {
        flex: 1,
    },
    textInputContainer : {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    InputHeaderContainer: {
        marginHorizontal: SPACING.space_36,
        marginTop: SPACING.space_28,
    },
    containerGap36: {
        gap: SPACING.space_36,
    },
    inputBox: {
        display: 'flex',
        paddingVertical: SPACING.space_10,
        paddingHorizontal: SPACING.space_24,
        borderWidth: 2,
        borderColor: COLORS.WhiteRGBA15,
        borderRadius: BORDERRADIUS.radius_25,
        flexDirection: 'row',
    },
    textInput: {
        width: '90%',
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
    buttonBG: {
        alignItems: 'center',
        marginVertical: SPACING.space_24,
    },
    buttonText: {
        borderRadius: BORDERRADIUS.radius_25 * 2,
        paddingHorizontal: SPACING.space_24,
        paddingVertical: SPACING.space_10,
        backgroundColor: COLORS.Orange,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
        color: COLORS.White,
    },
});

export default LoginScreen;
  