import React, {useEffect, useState, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Image
} from 'react-native';
import {  
    BORDERRADIUS,
    COLORS,
    FONTFAMILY,
    FONTSIZE,
    SPACING
} from '../theme/theme';
import {
  apikey,
  latestAnnoucement,
} from '../api/apicalls';
import InputHeader from '../components/InputHeader';
import CategoryHeader from '../components/CategoryHeader';

const {width, height} = Dimensions.get('window');

const currentWeekNumber = () => {

    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  
    const weekNumber = Math.ceil(days / 7);
    return weekNumber;
};
  
const currentYear = () => {

    const currentDate = new Date();  
    return currentDate.getFullYear();
};

const getLatestAnnouncementList = async (limit: number, offset: number, sort: string) => {
    try {
      let options = {
        method: 'GET',
        headers: {
          'xc-token': apikey
        }
      };
  
      let response = await fetch(latestAnnoucement(offset, limit, sort), options);
      let json = await response.json();

      //console.log(json.list[0].PosterImg);
  
      return json.list;
    } catch (error) {
      console.error(
        ' Something went wrong in getNowPlayingMoviesList Function',
        error,
      );
    }
};

const AnnouncementScreen = ({navigation}: any) => {

    const [latestAnnouncementList, setLatestAnnouncementList] = useState<any[]>([]);
    const [latestAnnoucementPosterList, setlatestAnnoucementPosterList] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
          var weekNumber = currentWeekNumber(); 
          var year = currentYear();
          
          const query = `-Date`;
    
          let tempAnnouncementList = await getLatestAnnouncementList(1, 0, query);
          setLatestAnnouncementList([...tempAnnouncementList]);
          if(tempAnnouncementList.length > 0) {
            setlatestAnnoucementPosterList([...tempAnnouncementList[0].PosterImg]);
          }
        })();
    }, []);

    if (latestAnnoucementPosterList == undefined && latestAnnoucementPosterList == null)
    {
        return (
            <ScrollView
                style={styles.container}
                bounces={false}
                contentContainerStyle={styles.scrollViewContainer}>
                <StatusBar hidden />
            
                {/* <View style={styles.InputHeaderContainer}>
                <InputHeader searchFunction={searchMoviesFunction} />
                </View> */}
            
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={'large'} color={COLORS.Orange} />
                </View>
            </ScrollView>
        );
    }    

    return (
        <ScrollView style={styles.container} bounces={false}>
            <StatusBar hidden />
            <CategoryHeader title={'Announcement'} />

            {latestAnnoucementPosterList?.map((item, index) => {
                return (
                    // <View style={[
                    //     styles.container,
                    //     {margin: SPACING.space_12},
                    //     {marginLeft: SPACING.space_36},
                    //     {marginRight: SPACING.space_36},
                    //     {maxWidth: width * 0.7}
                    //   ]}>
                        <Image
                            key={index}
                            style={[
                                styles.cardImage,
                                {margin: SPACING.space_12},
                                {marginLeft: SPACING.space_36},
                                {marginRight: SPACING.space_36},
                                {width: width * 0.8}]}
                            source={{uri: item.signedUrl}}
                        />

                    // </View>
                );
            })}
        </ScrollView>
    );
    

};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: COLORS.Black,
    },
    scrollViewContainer: {
        flex: 1,
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
    cardImage: {
        aspectRatio: 2 / 3,
        borderRadius: BORDERRADIUS.radius_20,
    },
});

export default AnnouncementScreen;