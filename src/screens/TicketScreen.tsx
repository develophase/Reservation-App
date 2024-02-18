import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
  ScrollView
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import AppHeader from '../components/AppHeader';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import {
  apikey, 
  getEventTicketBookedByUser,
} from '../api/apicalls';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import QRCode from 'react-native-qrcode-svg';

const TicketScreen = ({navigation, route}: any) => {
  const [ticketData, setTicketData] = useState<any>(route.params);
  const [ticketQRref, setTicketQRref] = useState<any>({});

  console.log(ticketData);

  if (ticketData !== route.params && route.params != undefined) {
    setTicketData(route.params);
  }

  if (ticketData == undefined || ticketData == null) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.appHeaderContainer}>
          <AppHeader
            name="close"
            header={'My Tickets'}
            action={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}>

      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
          <AppHeader
            name="close"
            header={'My Tickets'}
            action={() => navigation.goBack()}
          />
      </View>
      <View style={styles.ticketContainer}>
        <View
          style={styles.ticketBGImage}>
          <Image
            source={require('../assets/image/god.png')}
            style={styles.cardImage}
          />
          <View style={[styles.qrContainer, {position: 'absolute', bottom: 100 }]}>
            <QRCode
              value={`${ticketData?.code}`}
              getRef={(c) => setTicketQRref(c)}
              size={200}/>
          </View>
          <LinearGradient
            colors={[COLORS.OrangeRGBA0, COLORS.Orange]}
            style={styles.linearGradient}>
            <View
              style={[
                styles.blackCircle,
                {position: 'absolute', bottom: -40, left: -40},
              ]}></View>
            <View
              style={[
                styles.blackCircle,
                {position: 'absolute', bottom: -40, right: -40},
              ]}></View>
          </LinearGradient>
        </View>
        <View style={styles.linear}></View>

        <View style={styles.ticketFooter}>
          <View
            style={[
              styles.blackCircle,
              {position: 'absolute', top: -40, left: -40},
            ]}></View>
          <View
            style={[
              styles.blackCircle,
              {position: 'absolute', top: -40, right: -40},
            ]}></View>
          <View style={styles.ticketDateContainer}>
            <CustomIcon name="clock" style={styles.clockIcon} />
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>{ticketData?.date}</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>{ticketData?.time}</Text>
            </View>
          </View>
          <View style={styles.ticketSeatContainer}>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subheading}>Event</Text>
              <Text style={styles.subtitle}>{ticketData?.eventcode}</Text>
            </View>
            {/* <View style={styles.subtitleContainer}>
              <Text style={styles.subheading}>Ordered By</Text>
              <Text style={styles.subtitle}>{ticketData?.name}</Text>
            </View> */}
            <View style={styles.subtitleContainer}>
              <Text style={styles.subheading}>Seat</Text>
              <Text style={styles.subtitle}>{ticketData?.num}</Text>
            </View>
          </View>
        </View>
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
  cardImage: {
    top: 10,
    width: '100%',
    height: 135,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    zIndex: 5
  },
  qrContainer : {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    zIndex: 5
  },
  ticketContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketBGImage: {
    alignSelf: 'center',
    width: 300,
    aspectRatio: 200 / 300,
    borderTopLeftRadius: BORDERRADIUS.radius_25,
    borderTopRightRadius: BORDERRADIUS.radius_25,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  linearGradient: {
    height: '100%',
  },
  linear: {
    borderTopColor: COLORS.Black,
    borderTopWidth: 3,
    width: 300,
    alignSelf: 'center',
    backgroundColor: COLORS.Orange,
    borderStyle: 'dashed',
  },
  ticketFooter: {
    backgroundColor: COLORS.Orange,
    width: 300,
    alignItems: 'center',
    paddingBottom: SPACING.space_36,
    alignSelf: 'center',
    borderBottomLeftRadius: BORDERRADIUS.radius_25,
    borderBottomRightRadius: BORDERRADIUS.radius_25,
  },
  ticketDateContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.space_10,
  },
  ticketSeatContainer: {
    flexDirection: 'row',
    gap: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.space_10,
  },
  dateTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  subheading: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.White,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  clockIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    paddingBottom: SPACING.space_10,
  },
  barcodeImage: {
    height: 50,
    aspectRatio: 158 / 52,
  },
  blackCircle: {
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: COLORS.Black,
  },
});

export default TicketScreen;
