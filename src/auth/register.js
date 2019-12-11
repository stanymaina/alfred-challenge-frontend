import React from 'react';
import {AsyncStorage, StyleSheet, Text, TextInput, View} from 'react-native';
import Button from 'react-native-button';
import {AppStyles} from '../styles/styles';
import firebase from 'react-native-firebase';
import axios from 'react-native-axios';

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fullname: 'Carl Stanley',
      phone: '0712345678',
      email: 'dev1@localhost.com',
      password: 'Try3his.',
      confirm_password: 'Try3his.',
    };

    const adapter = axios.create({
      baseURL: `http://127.0.0.1:89`,
      headers: {
        Referer: 'http://127.0.0.1:89',
      },
    });

    adapter.defaults.headers.common['Authorization'] = 'Bearer test';
  }

  componentDidMount() {
    /*
    **
    this.authSubscription = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        loading: false,
        user
      });
    });
    **
    */
  }

  componentWillUnmount() {
    // this.authSubscription();
  }

  onRegister = () => {
    const {fullname , email, phone, password, confirm_password} = this.state;

    const {navigation} = this.props;
    const data = {
      fullname: fullname,
      phone: phone,
      email: email,
      password: password,
      confirm_password: confirm_password,
    };
    axios
      .post(
        'https://challenge-101.herokuapp.com/api/auth/register',
        data,
        {
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(function(user) {
        console.info(user.data);
        AsyncStorage.setItem('@loggedInUserID:access_token', user.data.token);
        const userdata = user.data.user;
        navigation.dispatch({type: 'Login', user: userdata});
      })
      .catch(function(error) {
        console.info(error);
        const {code, message} = error;
        alert(message);
      });

    /*.then(response => {
        console.log(response.data);
        
        AsyncStorage.setItem(
          "@loggedInUserID:access_token",
          response.data.token
        );
        /*dispatch({
        type: FOUND_USER,
        data: response.data[0]
      })*/
    /* })
      .catch(error => {
        console.log(error);
        alert(error);
        /*dispatch({
        type: ERROR_FINDING_USER
      })*/
    /*});*/
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, styles.leftTitle]}>Create new account</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Full Name"
            onChangeText={text => this.setState({fullname: text})}
            value={this.state.fullname}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Phone Number"
            onChangeText={text => this.setState({phone: text})}
            value={this.state.phone}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="E-mail Address"
            onChangeText={text => this.setState({email: text})}
            value={this.state.email}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={text => this.setState({password: text})}
            value={this.state.password}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={text => this.setState({confirm_password: text})}
            value={this.state.confirm_password}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Button
          containerStyle={[styles.facebookContainer, {marginTop: 50}]}
          style={styles.facebookText}
          onPress={() => this.onRegister()}>
          Sign Up
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  placeholder: {
    fontFamily: AppStyles.fontName.text,
    color: 'red',
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  facebookContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
});

export default SignupScreen;
