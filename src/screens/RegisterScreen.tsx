// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  Dimensions,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  StatusBar
} from 'react-native';
import {
    apikey,
    getAccountsByParams,
    registerUser
} from '../api/apicalls';
import {
    BORDERRADIUS,
    COLORS,
    FONTFAMILY,
    FONTSIZE,
    SPACING,
} from '../theme/theme';
import CategoryHeader from '../components/CategoryHeader';

import Loader from '../components/Loader';

const {width, height} = Dimensions.get('window');

const RegisterScreen = ({navigation}: any) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');

    const registerAccount = async (phoneNumber: string, password: string, email: string, name: string) => {
        
        try {
            let payload = {
                Name: name,
                Email: email,
                Phone: phoneNumber,
                Password: password,
                Username: name
            };

            let options = {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'xc-token': apikey
                },
                body: JSON.stringify(payload)
            };

            let response = await fetch(registerUser(), options);
            let json = await response.json();
        
            return json;

        } catch (error) {
            console.error('Something Went wrong in getMoviesDetails Function', error);
        }
    };

    const getAccount = async (offset: number, limit: number, phoneNumber: string) => {
        try {
          let options = {
            method: 'GET',
            headers: {
              'xc-token': apikey
            }
          };
    
          let query = `(Phone,eq,${phoneNumber})`;

          console.log(query);
      
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

    const handleSubmit = async () => {
        setErrortext('');
        if (!phone) {
            setErrortext('Please fill Phone Number');
            return;
        }
        if (!password) {
            setErrortext('Please fill Password');
            return;
        }
        if (!email) {
            setErrortext('Please fill Email');
            return;
        }
        if (!name) {
            setErrortext('Please fill Name');
            return;
        }
        //Show Loader
        setLoading(true);

        try {
            await getAccount(0, 1, phone)
                .then(async (available) => {
                    console.log(available);
                    if (available.length == 0) {
                        await registerAccount(phone, password, email, name)
                            .then(async (response) => {
                                console.log(response);
                                if(response?.id) {
                                    setLoading(false);
                                    ToastAndroid.showWithGravity(
                                      'Register Success',
                                      ToastAndroid.SHORT,
                                      ToastAndroid.BOTTOM,
                                    );
                                    navigation.goBack();
                                }
                            });
                    } else {
                        setLoading(false);
                        setErrortext('Phone Number Already Registered');
                    }
                });
        }
        catch (error) {
            setLoading(false);
            ToastAndroid.showWithGravity(
                'Register Failed',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            console.error(
              'Something went Wrong while storing in BookSeats Functions',
              error,
            );
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

            <CategoryHeader title={'Register'} />
            <View style={{alignItems: 'center'}}>
                <Image
                    source={require('../assets/image/god.png')}
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

                <View style={styles.SectionStyle}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={email => setEmail(email)}
                        textContentType='emailAddress'
                        autoComplete='email'
                        value={email}
                        placeholder="Email"
                        placeholderTextColor={COLORS.WhiteRGBA32}
                    />
                </View>

                <View style={styles.SectionStyle}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={name => setName(name)}
                        value={name}
                        placeholder="Name"
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
                    onPress={() => handleSubmit()}>
                        <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>   
        </ScrollView>
        </View>
    );
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
    }
});


export default RegisterScreen;