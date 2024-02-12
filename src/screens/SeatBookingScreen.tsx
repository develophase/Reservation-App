import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import { 
  apikey, 
  bookedSeatByEventIds, 
  createBookedSeat
} from '../api/apicalls';
import LinearGradient from 'react-native-linear-gradient';
import AppHeader from '../components/AppHeader';
import CustomIcon from '../components/CustomIcon';
import EncryptedStorage from 'react-native-encrypted-storage';

const getBookedSeat = async (eventId: number, row: number, col: number) => {
  try {
    let options = {
      method: 'GET',
      headers: {
        'xc-token': apikey
      }
    };

    let query = `(EventsId,eq,${eventId})`;

    let response = await fetch(bookedSeatByEventIds(0, (row * col), query), options);
    let json = await response.json();

    return json.list;

  } catch (error) {
    console.error('Something Went wrong in getMoviesDetails Function', error);
  }
};

const checkAvailableSeat = async (eventId: number, row: number, col: number) => {
  try {
    let options = {
      method: 'GET',
      headers: {
        'xc-token': apikey
      }
    };

    let query = `(EventsId,eq,${eventId})`;

    let response = await fetch(bookedSeatByEventIds(0, (row * col), query), options);
    let json = await response.json();

    return json.list;

  } catch (error) {
    console.error('Something Went wrong in getMoviesDetails Function', error);
  }
};

const checkAvailability = async (bookedSeat: any[], planToBook: any[], row: number, col: number) => {
  let booked =
  bookedSeat.map((key: any) => {
    return [...key.Num.split(",")];
  });

  let seatBooked = "";
  let columnArray = [];

  for (let i = 0; i < booked.length; i++) {
      let cout = booked[i].join();
      cout = i + 1 >= booked.length ? cout : cout + ",";
      seatBooked = seatBooked + cout
  }

  let seatBookedAll = seatBooked.split(",");

  for (let i = 0; i < planToBook.length; i++) {
    let seatTaken = seatBookedAll.filter((val) => val == planToBook[i]);
    if(seatTaken.length != 0) {
      columnArray.push(planToBook[i])
    } 
  }

  return columnArray;
};

const generateSeats = async (bookedSeat: any[], row: number, col: number) => {
  let numRow = row;
  let numColumn = col;
  let rowArray = [];
  let start = 1;
  let booked =
  bookedSeat.map((key: any) => {
    return [...key.Num.split(",")];
  });

  let seatBooked = "";

  for (let i = 0; i < booked.length; i++) {
      let cout = booked[i].join();
      cout = i + 1 >= booked.length ? cout : cout + ",";
      seatBooked = seatBooked + cout
  }

  let seatBookedAll = seatBooked.split(",");

  for (let i = 0; i < numRow; i++) {
    let columnArray = [];
    for (let j = 0; j < numColumn; j++) {
      let seatTaken = seatBookedAll.filter((val) => val == start.toString());

      let seatObject = {
        number: start,
        taken: seatTaken.length != 0 ? true : false,
        selected: false,
      };

      columnArray.push(seatObject);
      start++;
    }
    rowArray.push(columnArray);
  }

  return rowArray;
};

const bookSeats = async (eventId: number, eventCode: string, bookedSeat: any, userLogin: any) => {
  try {

    const numSplit = bookedSeat.join(",");
    console.log(userLogin);

    let payload = {
      "EventsId": eventId,
      "AccountsName": `${userLogin.Name}`,
      "ReservationDate": `${new Date()}`,
      "Status": 1,
      "ReservationCode": `${eventId}/${eventCode}/${userLogin.Id}`,
      "QrCode": `${eventId}/${eventCode}/${userLogin.Id}`,
      "Num": `${numSplit}`,
      "ArrivalDate": `${new Date()}`,
      "AccountsId": userLogin.Id
    }

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

    let response = await fetch(createBookedSeat(), options);
    let json = await response.json();

    return json;

  } catch (error) {
    console.error('Something Went wrong in getMoviesDetails Function', error);
  }
};

const SeatBookingScreen = ({navigation, route}: any) => {
  const [twoDSeatArray, setTwoDSeatArray] = useState<any[][]>([]);
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [bookedSeat, setBookedSeat] = useState<any[]>([]);
  const [userLogin, setUserLogin] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    const session = await EncryptedStorage.getItem('login_user');
    if(session !== null && session !== undefined) {
      const userLoginTemp = await JSON.parse(session);
      setUserLogin(userLoginTemp);
      await getBookedSeat(route.params.eventid, route.params.row, route.params.col)
        .then(async (bookedSeatByEventId) => {
            setBookedSeat(bookedSeatByEventId);
            await generateSeats(bookedSeatByEventId, route.params.row, route.params.col)
              .then(async (seat) => {
                setTwoDSeatArray(seat);
                setIsLoading(false);
              });
        });
    }
  };

  useEffect(() => {
    // (async () => {
    //   const session = await EncryptedStorage.getItem('login_user');
    //   if(session !== null && session !== undefined) {
    //     const userLoginTemp = await JSON.parse(session);
    //     setUserLogin(userLoginTemp);
    //     await getBookedSeat(route.params.eventid, route.params.row, route.params.col)
    //       .then(async (bookedSeatByEventId) => {
    //           setBookedSeat(bookedSeatByEventId);
    //           await generateSeats(bookedSeatByEventId, route.params.row, route.params.col)
    //             .then(async (seat) => {
    //               setTwoDSeatArray(seat);
    //               setIsLoading(false);
    //             });
    //       });
    //   }
    // })();
    refresh();
  }, []);

  const selectSeat = (index: number, subindex: number, num: number) => {
    if (!twoDSeatArray[index][subindex].taken) {
      let array: any = [...selectedSeat];
      let temp = [...twoDSeatArray];

      if (!array.includes(num)) {
        if (array.length < 5) {
          temp[index][subindex].selected = !temp[index][subindex].selected;
          array.push(num);
          setSelectedSeat(array);
        }
      } else {
        temp[index][subindex].selected = !temp[index][subindex].selected;
        const tempindex = array.indexOf(num);
        if (tempindex > -1) {
          array.splice(tempindex, 1);
          setSelectedSeat(array);
        }
      }
  
      setTwoDSeatArray(temp);
    }
  };

  const BookSeats = async () => {
    if (
      selectedSeat.length !== 0
    ) {
      try {
        setIsLoading(true);
        await checkAvailableSeat(route.params.eventid, route.params.row, route.params.col)
          .then(async (available) => {
            if (available.length == 0) {
              await bookSeats(route.params.eventid, route.params.code, selectedSeat, userLogin)
                .then(async (response) => {
                  //console.log(response);
                  if(response?.id) {
                    setIsLoading(false);
                    ToastAndroid.showWithGravity(
                      'Seat Booking Success',
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM,
                    );
                    navigation.goBack({refresh: true});
                  }
                })
            } else {
              await checkAvailability(available, selectedSeat, route.params.row, route.params.col)
                .then(async (respone) => {

                  if(respone.length == 0) {
                    await bookSeats(route.params.eventid, route.params.code, selectedSeat, userLogin)
                      .then(async (response) => {
                        if(response?.id) {
                          setIsLoading(false);
                          ToastAndroid.showWithGravity(
                            'Seat Booking Success',
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                          );
                          navigation.goBack({refresh: true});
                        }
                      })
                  } else {
                    
                    setIsLoading(false);
                    refresh();
                    ToastAndroid.showWithGravity(
                      `Seat ${respone.join()} Is Not Available`,
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                    );
                  }
                })
            }
          })
      } catch (error) {
        console.error(
          'Something went Wrong while storing in BookSeats Functions',
          error,
        );
      }
    } else {
      ToastAndroid.showWithGravity(
        'Please Select Seats',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={true}>
      <StatusBar hidden />
      <View>
        <ImageBackground
          source={
            require('../assets/image/prayer.jpg')
          }
          style={styles.ImageBG}>
          <LinearGradient
            colors={[COLORS.BlackRGB10, COLORS.Black]}
            style={styles.linearGradient}>
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={''}
                action={() => navigation.goBack()}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.screenText}>Screen this side</Text>
      </View>

      { isLoading ? 
        (
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
        ) : 
        (
          <View style={styles.scrollViewContainer}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
              <View style={styles.seatContainer}>
                <View style={styles.containerGap20}>
                  {twoDSeatArray?.map((item, index) => {
                    return (
                      <View key={index} style={styles.seatRow}>
                        {item?.map((subitem, subindex) => {
                          return (
                            <TouchableOpacity
                              key={subitem.number}
                              onPress={() => {
                                selectSeat(index, subindex, subitem.number);
                              }}>
                              <CustomIcon
                                name="seat"
                                style={[
                                  styles.seatIcon,
                                  subitem.taken ? {color: COLORS.Grey} : {},
                                  subitem.selected ? {color: COLORS.Orange} : {},
                                ]}
                              />
                              <Text style={styles.seatText}>{subitem.number}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
                <View style={styles.seatRadioContainer}>
                  <View style={styles.radioContainer}>
                    <CustomIcon name="radio" style={styles.radioIcon} />
                    <Text style={styles.radioText}>Available</Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <CustomIcon
                      name="radio"
                      style={[styles.radioIcon, {color: COLORS.Grey}]}
                    />
                    <Text style={styles.radioText}>Taken</Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <CustomIcon
                      name="radio"
                      style={[styles.radioIcon, {color: COLORS.Orange}]}
                    />
                    <Text style={styles.radioText}>Selected</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.buttonPriceContainer}>
              <TouchableOpacity onPress={BookSeats}>
                <Text style={styles.buttonText}>Book Seat</Text>
              </TouchableOpacity>
            </View>
          </View> 
        )
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  scrollViewContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ImageBG: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: '100%',
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  screenText: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA15,
  },
  seatContainer: {
    marginVertical: SPACING.space_20,
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  seatRow: {
    flexDirection: 'row',
    gap: SPACING.space_20,
    justifyContent: 'center',
  },
  seatIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  seatRadioContainer: {
    flexDirection: 'row',
    marginTop: SPACING.space_36,
    marginBottom: SPACING.space_10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  radioContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  radioIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  radioText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  seatText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    textAlign: 'center',
    color: COLORS.White,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  dateContainer: {
    width: SPACING.space_10 * 7,
    height: SPACING.space_10 * 10,
    borderRadius: SPACING.space_10 * 10,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  dayText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  OutterContainer: {
    marginVertical: SPACING.space_24,
  },
  timeContainer: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  buttonPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_24,
    paddingBottom: SPACING.space_24,
  },
  priceContainer: {
    alignItems: 'center',
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Grey,
  },
  price: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
    backgroundColor: COLORS.Orange,
  },
});

export default SeatBookingScreen;
