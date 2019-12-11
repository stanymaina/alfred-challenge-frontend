import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator
} from "react-native";
import Button from "react-native-button";
import { AppStyles } from "../styles/styles";
import firebase from "react-native-firebase";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import { AsyncStorage } from "react-native";
import axios from 'react-native-axios';
const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken } = FBSDK;

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: 'dev1@localhost.com',
      password: 'Try3his.'
    };
    GoogleSignin.configure({
      webClientId:
        "706061484183-l0l58dds4kg329fh1trbiha1ci5rqm5n.apps.googleusercontent.com"
    });
  }

  onPressLogin = () => {
    const { email, password } = this.state;
    const { navigation } = this.props;
    if (email.length <= 0 || password.length <= 0) {
      alert("Please fill out the required fields.");
      return;
    }
    const data = {
      email: email,
      password: password
    };
    console.info(data);
    axios.post('https://challenge-101.herokuapp.com/api/auth/login', data,{
      headers: {
        Accept: 'application/json',
      }
    })
    .then(function(user) {
      console.info(user.data)
      if (user.data) {
        AsyncStorage.setItem("@loggedInUserID:id", user.data.user.id);
        AsyncStorage.setItem("@loggedInUserID:key", user.data.user.email);
        AsyncStorage.setItem("@loggedInUserID:password", data.password);
        navigation.dispatch({ type: "Login", user: user.data.user });
      } else {
        alert("User does not exist. Please try again.");
      }
      AsyncStorage.setItem(
        "@loggedInUserID:access_token",
        user.data.token
      );
      const userdata = user.data.user
      navigation.dispatch({ type: "Login", user: userdata });
    })
    .catch(function(error) {
      console.log(error)
      const { code, message } = error;
      alert(message);
    });
  };

  onPressFacebook = () => {
    /* LoginManager.logInWithReadPermissions([
      "public_profile",
      "user_friends",
      "email"
    ]).then(
      result => {
        if (result.isCancelled) {
          alert("Whoops!", "You cancelled the sign in.");
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const credential = firebase.auth.FacebookAuthProvider.credential(
              data.accessToken
            );
            const accessToken = data.accessToken;
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(result => {
                var user = result.user;
                AsyncStorage.setItem(
                  "@loggedInUserID:facebookCredentialAccessToken",
                  accessToken
                );
                AsyncStorage.setItem("@loggedInUserID:id", user.uid);
                var userDict = {
                  id: user.uid,
                  fullname: user.displayName,
                  email: user.email,
                  profileURL: user.photoURL
                };
                var data = {
                  ...userDict,
                  appIdentifier: "rn-android-universal-listings"
                };
                firebase
                  .firestore()
                  .collection("users")
                  .doc(user.uid)
                  .set(data);
                this.props.navigation.dispatch({
                  type: "Login",
                  user: userDict
                });
              })
              .catch(error => {
                alert("Please try again! " + error);
              });
          });
        }
      },
      error => {
        Alert.alert("Sign in error", error);
      }
    ); */
    console.log("attempt facebook sign in")
  };

  onPressGoogle = () => {
    this.setState({ loading: true });
    GoogleSignin.signIn()
      .then(data => {
        console.log("data", data);
        // Create a new Firebase credential with the token
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken
        );
        // Login with the credential
        const accessToken = data.idToken;
        AsyncStorage.setItem(
          "@loggedInUserID:googleCredentialAccessToken",
          accessToken
        );
        return firebase.auth().signInWithCredential(credential);
      })
      .then(result => {
        this.setState({ loading: false });
        var user = result.user;
        AsyncStorage.setItem("@loggedInUserID:id", user.uid);
        var userDict = {
          id: user.uid,
          fullname: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        var data = {
          ...userDict,
          appIdentifier: "rn-android-universal-listings"
        };
        console.log("data", data);
        firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .set(data);
        this.props.navigation.dispatch({
          type: "Login",
          user: userDict
        });
      })
      .catch(error => {
        const { code, message } = error;
        this.setState({ loading: false }, () => {
          alert(error);
        });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, styles.leftTitle]}>Sign In</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="E-mail or phone number"
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => this.onPressLogin()}
        >
          Log in
        </Button>
        <Text style={styles.or}>OR</Text>
        <Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() => this.onPressFacebook()}
        >
          Login with Facebook
        </Button>
        {this.state.loading ? (
          <ActivityIndicator
            style={{ marginTop: 30 }}
            size="large"
            animating={this.state.loading}
            color={AppStyles.color.tint}
          />
        ) : (
          <GoogleSigninButton
            style={styles.googleContainer}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={this.onPressGoogle}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  or: {
    fontFamily: AppStyles.fontName.main,
    color: "black",
    marginTop: 40,
    marginBottom: 10
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: "bold",
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20
  },
  leftTitle: {
    alignSelf: "stretch",
    textAlign: "left",
    marginLeft: 20
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: "center",
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30
  },
  loginText: {
    color: AppStyles.color.white
  },
  placeholder: {
    fontFamily: AppStyles.fontName.text,
    color: "red"
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text
  },
  facebookContainer: {
    width: 192,
    backgroundColor: AppStyles.color.facebook,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30
  },
  facebookText: {
    color: AppStyles.color.white
  },
  googleContainer: {
    width: 192,
    height: 48,
    marginTop: 30
  },
  googleText: {
    color: AppStyles.color.white
  }
});

export default LoginScreen;
