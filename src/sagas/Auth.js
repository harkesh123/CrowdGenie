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
    SIGNUP_USER
} from "constants/ActionTypes";
import {showAuthMessage, userSignInSuccess, userSignOutSuccess, userSignUpSuccess} from "actions/Auth";
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
        email,          // optional
        phone_number, 
        name,
        profile  // optional - E.164 number convention
        // other custom attributes 
    },
    validationData: []  //optional
    })
    .then(data => data)
    .catch(err => err);

// After retrieveing the confirmation code from the user
// Auth.confirmSignUp(username, code, {
//     // Optional. Force user confirmation irrespective of existing alias. By default set to True.
//     forceAliasCreation: true    
// }).then(data => console.log(data))
//   .catch(err => console.log(err));


const signInUserWithEmailPasswordRequest = async (email, password) =>
    await Auth.signIn(email, password)
    .then(user => user.sub)
    .catch(err => err);

const signOutRequest = async () =>{}


const signInUserWithGoogleRequest = async () =>{}

const signInUserWithFacebookRequest = async () =>{}

const signInUserWithGithubRequest = async () =>{}

const signInUserWithTwitterRequest = async () =>{}

function* createUserWithEmailPassword({payload}) {
    const {email, password,profile,name,phone_number} = payload;
    if(!(email&&password&&profile&&name&&phone_number)){
        
        yield put(showAuthMessage("Enter all the details"));
    }
    else{
        try {
        const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password,profile,name,phone_number);
        console.log(signUpUser);
        if (!signUpUser.userSub) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.userSub);
            yield put(userSignUpSuccess(signUpUser.userSub));
        }
    }
       catch (error) {
        console.log(error)
        yield put(showAuthMessage(error));
    }
    }

}

function* signInUserWithGoogle() {
    try {
        const signUpUser = yield call(signInUserWithGoogleRequest);
        if (signUpUser.message) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.user.uid);
            yield put(userGoogleSignInSuccess(signUpUser.user.uid));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}


function* signInUserWithFacebook() {
    try {
        const signUpUser = yield call(signInUserWithFacebookRequest);
        if (signUpUser.message) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.user.uid);
            yield put(userFacebookSignInSuccess(signUpUser.user.uid));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}


function* signInUserWithGithub() {
    try {
        const signUpUser = yield call(signInUserWithGithubRequest);
        if (signUpUser.message) {
            yield put(showAuthMessage(signUpUser.message));
        } else {
            localStorage.setItem('user_id', signUpUser.user.uid);
            yield put(userGithubSignInSuccess(signUpUser.user.uid));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}


function* signInUserWithTwitter() {
    try {
        const signUpUser = yield call(signInUserWithTwitterRequest);
        if (signUpUser.message) {
            if (signUpUser.message.length > 100) {
                yield put(showAuthMessage('Your request has been canceled.'));
            } else {
                yield put(showAuthMessage(signUpUser.message));
            }
        } else {
            localStorage.setItem('user_id', signUpUser.user.uid);
            yield put(userTwitterSignInSuccess(signUpUser.user.uid));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

function* signInUserWithEmailPassword({payload}) {
    const {email, password} = payload;
    try {
        const signInUser = yield call(signInUserWithEmailPasswordRequest, email, password);
        if (signInUser.message) {
            yield put(showAuthMessage(signInUser.message));
        } else {
            localStorage.setItem('user_id', signInUser.user.uid);
            yield put(userSignInSuccess(signInUser.user.uid));
        }
    } catch (error) {
        yield put(showAuthMessage(error));
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

export function* signInWithGoogle() {
    yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
}

export function* signInWithFacebook() {
    yield takeEvery(SIGNIN_FACEBOOK_USER, signInUserWithFacebook);
}

export function* signInWithTwitter() {
    yield takeEvery(SIGNIN_TWITTER_USER, signInUserWithTwitter);
}

export function* signInWithGithub() {
    yield takeEvery(SIGNIN_GITHUB_USER, signInUserWithGithub);
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
        fork(signInWithGoogle),
        fork(signInWithFacebook),
        fork(signInWithTwitter),
        fork(signInWithGithub),
        fork(signOutUser)]);
}