import React, {useMemo, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {AppIcon, AppStyles} from '../styles/styles';
import {Configuration} from '../config';
// import {Table} from '../components/Table';
import axios from 'axios';
import {Table, TableWrapper, Row} from 'react-native-table-component';

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Home',
    headerLeft: () => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}>
          {navigation.state.params && navigation.state.params.menuIcon ? (
            <FastImage
              style={styles.userPhoto}
              resizeMode={FastImage.resizeMode.cover}
              source={{uri: navigation.state.params.menuIcon}}
            />
          ) : (
            <FastImage
              style={styles.userPhoto}
              resizeMode={FastImage.resizeMode.cover}
              source={AppIcon.images.defaultUser}
            />
          )}
        </TouchableOpacity>
      );
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      columns: null,
      data: null,
      tableHead: [
        'Head',
        'Head2',
        'Head3',
        'Head4',
        'Head5',
        'Head6',
        'Head7',
        'Head8',
        'Head9',
      ],
      widthArr: [40, 60, 80, 100, 120, 140, 160, 180, 200],
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      menuIcon: this.props.user.profileURL,
    });
  }

  render() {

    const state = this.state;
    const tableData = [];
    for (let i = 0; i < 30; i += 1) {
      const rowData = [];
      for (let j = 0; j < 9; j += 1) {
        rowData.push(`${i}${j}`);
      }
      tableData.push(rowData);
    }
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Welcome {this.props.user.email}</Text>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                <Row
                  data={state.tableHead}
                  widthArr={state.widthArr}
                  style={styles.header}
                  textStyle={styles.text}
                />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                  {tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={state.widthArr}
                      style={[
                        styles.row,
                        index % 2 && {backgroundColor: '#F7F6E7'},
                      ]}
                      textStyle={styles.text}
                    />
                  ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: Configuration.home.listing_item.offset,
  },
  title: {
    fontFamily: AppStyles.fontName.bold,
    fontWeight: 'bold',
    color: AppStyles.color.title,
    fontSize: 25,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
  },
});

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);
