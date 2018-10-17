import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {
    facebookAuthProvider,
    githubAuthProvider,
    googleAuthProvider,
    twitterAuthProvider
} from "helper/firebase";
import {Auth} from "aws-amplify"
import {
    SIGNIN_FACEBOOK_USER,
    SIGNIN_GITHUB_USER,
    SIGNIN_GOOGLE_USER,
    SIGNIN_TWITTER_USER,
    SIGNIN_USER,
    SIGNOUT_USER,
    SIGNUP_USER,
    VERIFY_USER,
    VERIFY_SUCCESS
} from "constants/ActionTypes";
import {showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess,verifySuccess} from "actions/Auth";
import {
    userFacebookSignInSuccess,
    userGithubSignInSuccess,
    userGoogleSignInSuccess,
    userTwitterSignInSuccess
} from "../actions/Auth";

const createUserWithEmailPasswordRequest = async (email, password,profile,name,phone_number) =>
  await Auth.signUp({
    username:email,
    password,
    attributes: {
        email,          
        phone_number, 
        name,
        profile   
    },
    validationData: []  
    })
    .then(data => {return data})
    .catch(err => {return err});


const verifyWithCode = async (code,email) =>
  await Auth.confirmSignUp(email, code)
  .then(data => {return data})
  .catch(err =>  {return err});

const signInUserWithEmailPasswordRequest = async (email, password) =>
    await Auth.signIn(email, password)
    .then(user => {return user})
    .catch(err => {return err});

const signOutRequest = async () =>
  await Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));


const signInUserWithFacebookRequest = async () =>{}

const signInUserWithGithubRequest = async () =>{}

const signInUserWithTwitterRequest = async () =>{}

function* createUserWithEmailPassword({payload}) {
    const {email, password,profile,name,phone_number} = payload;
    try {
     const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password,profile,name,phone_number);
     console.log(signUpUser);
     if (!signUpUser.userSub) {
        yield put(showAuthMessage(signUpUser.message));
     } else {
         //localStorage.setItem('user_id', signUpUser.userSub);
       yield put(userSignUpSuccess());
     }
    }
    catch (error) {
     yield put(showAuthMessage(error));
   }
}

// function* signInUserWithGoogle() {
//     try {
//         const signUpUser = yield call(signInUserWithGoogleRequest);
//         if (signUpUser.message) {
//             yield put(showAuthMessage(signUpUser.message));
//         } else {
//             localStorage.setItem('user_id', signUpUser.user.uid);
//             yield put(userGoogleSignInSuccess(signUpUser.user.uid));
//         }
//     } catch (error) {
//         yield put(showAuthMessage(error));
//     }
// }



function* signInUserWithEmailPassword({payload}) {
    const {email, password} = payload;
     try {
         const signInUser = yield call(signInUserWithEmailPasswordRequest, email, password);
        if (signInUser.message) {
            yield put(showAuthMessage(signInUser.message));
         } else {
            //localStorage.setItem('user_id', email);
             yield put(userSignInSuccess(email));
         }
     } catch (error) {
         yield put(showAuthMessage(error));
    }
}
function* verifyUserWithCode({payload}) {
    const {code,email} = payload;
    const verify = yield call(verifyWithCode, code,email);
    if(verify==="SUCCESS"){
    yield put(verifySuccess())
    }
    else{
    yield put(showAuthMessage(verify.message))
    }
}
function* signOut() {
    try {
        const signOutUser = yield call(signOutRequest);
        if (signOutUser === undefined) {
            localStorage.removeItem('user_id');
            yield put(userSignOutSuccess(signOutUser));
        } else {
            yield put(showAuthMessage(signOutUser.message));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

export function* createUserAccount() {
    yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

// export function* signInWithGoogle() {
//     yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
// }

export function* verifyUser() {
    yield takeEvery(VERIFY_USER, verifyUserWithCode);
}

export function* signInUser() {
    yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
    yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
    yield all([fork(signInUser),
        fork(createUserAccount),
        //fork(signInWithGoogle),
        fork(signOutUser),
        fork(verifyUser)]);
}