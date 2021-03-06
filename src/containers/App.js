import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import {Redirect, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl'
import 'react-notifications/lib/notifications.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'styles/jumbo.css'
import indigoTheme from './themes/indigoTheme';
import cyanTheme from './themes/cyanTheme';
import orangeTheme from './themes/orangeTheme';
import amberTheme from './themes/amberTheme';
import pinkTheme from './themes/pinkTheme';
import blueTheme from './themes/blueTheme';
import purpleTheme from './themes/purpleTheme';
import greenTheme from './themes/greenTheme';
import darkTheme from './themes/darkTheme';
import AppLocale from '../lngProvider';
import {
    AMBER,
    BLUE,
    CYAN,
    DARK_AMBER,
    DARK_BLUE,
    DARK_CYAN,
    DARK_DEEP_ORANGE,
    DARK_DEEP_PURPLE,
    DARK_GREEN,
    DARK_INDIGO,
    DARK_PINK,
    DEEP_ORANGE,
    DEEP_PURPLE,
    GREEN,
    INDIGO,
    PINK
} from 'constants/ThemeColors';

import MainApp from 'app/index';
import AdminApp from "app/admin";
import LenderApp from "app/lender";
import BorrowerApp from "app/borrower";

import SignIn from './SignIn';
import SignUp from './SignUp';
import {setInitUrl} from '../actions/Auth';
import RTL from 'util/RTL';
import asyncComponent from 'util/asyncComponent';
import { Auth } from 'aws-amplify';

const RestrictedRoute = ({component: Component, ...rest, authUser}) =>
    <Route
        {...rest}
        render={props =>
            authUser
                ? <Component {...props} />
                : <Redirect
                    to={{
                        pathname: '/signin',
                        state: {from: props.location}
                    }}
                />}
    />;

class App extends Component {
	
async componentWillMount() {
        if (this.props.initURL === '') {
            this.props.setInitUrl(this.props.history.location.pathname);
        }
        if(this.props.authUser){
        let user =await Auth.currentAuthenticatedUser()
        console.log(user)
        this.props.history.push('/'+user.attributes.profile);
        }
    }
        // switch(user.attributes.profile)
        // {
        // 	case "Lender":  {console.log("lender");
        // 	                  break;}
        // 	case "Borrower":  {<Redirect to={'/Borrower/dashboard/default'}/>;
        // 	                      break;}
        // 	case "Admin":  {console.log("Admin");
        //                          break;}
        // 	default: {console.log("error");
        //                 break;}
       // }

    getColorTheme(themeColor, applyTheme) {
        switch (themeColor) {
            case INDIGO: {
                applyTheme = createMuiTheme(indigoTheme);
                break;
            }
            case CYAN: {
                applyTheme = createMuiTheme(cyanTheme);
                break;
            }
            case AMBER: {
                applyTheme = createMuiTheme(amberTheme);
                break;
            }
            case DEEP_ORANGE: {
                applyTheme = createMuiTheme(orangeTheme);
                break;
            }
            case PINK: {
                applyTheme = createMuiTheme(pinkTheme);
                break;
            }
            case BLUE: {
                applyTheme = createMuiTheme(blueTheme);
                break;
            }
            case DEEP_PURPLE: {
                applyTheme = createMuiTheme(purpleTheme);
                break;
            }
            case GREEN: {
                applyTheme = createMuiTheme(greenTheme);
                break;
            }
            case DARK_INDIGO: {
                applyTheme = createMuiTheme(indigoTheme);
                break;
            }
            case DARK_CYAN: {
                applyTheme = createMuiTheme(cyanTheme);
                break;
            }
            case DARK_AMBER: {
                applyTheme = createMuiTheme(amberTheme);
                break;
            }
            case DARK_DEEP_ORANGE: {
                applyTheme = createMuiTheme(orangeTheme);
                break;
            }
            case DARK_PINK: {
                applyTheme = createMuiTheme(pinkTheme);
                break;
            }
            case DARK_BLUE: {
                applyTheme = createMuiTheme(blueTheme);
                break;
            }
            case DARK_DEEP_PURPLE: {
                applyTheme = createMuiTheme(purpleTheme);
                break;
            }
            case DARK_GREEN: {
                applyTheme = createMuiTheme(greenTheme);
                break;
            }
        }
        return applyTheme;
    }
    
     

    render() {
        const {match, location, themeColor, isDarkTheme, locale, authUser, initURL, isDirectionRTL} = this.props;
        let applyTheme = createMuiTheme(purpleTheme);
        if (isDarkTheme) {
            applyTheme = createMuiTheme(darkTheme)
        } else {
            applyTheme = this.getColorTheme(themeColor, applyTheme);
        }
       if (location.pathname === '/') {
            if (authUser === null) {
                return ( <Redirect to={'/signin'}/> );
            } else if (initURL === '' || initURL === '/' || initURL === '/signin') {
                return ( <Redirect to={'/app'}/> );
            } else {
                return ( <Redirect to={initURL}/> );
            }
            console.log(authUser)
        }
        if (isDirectionRTL) {
            applyTheme.direction = 'rtl';
            document.body.classList.add('rtl')
        } else {
            document.body.classList.remove('rtl');
            applyTheme.direction = 'ltr';
        }

        const currentAppLocale = AppLocale[locale.locale];
        return (
            <MuiThemeProvider theme={applyTheme}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <IntlProvider
                        locale={currentAppLocale.locale}
                        messages={currentAppLocale.messages}>
                        <RTL>
                            <div className="app-main">
                                <Switch>
                                    <Route path={'/app'} component={MainApp}/>
                                    <RestrictedRoute path={`${match.url}lender`} authUser={authUser}
                                                     component={LenderApp}/>
                                    <RestrictedRoute path={`${match.url}borrower`} authUser={authUser}
                                                     component={BorrowerApp}/>
                                    <RestrictedRoute path={`${match.url}admin`} authUser={authUser}
                                                     component={AdminApp}/>                                  	                                
                                    <Route path='/signin' component={SignIn}/>
                                    <Route path='/signup' component={SignUp}/>

                                    <Route
                                        component={asyncComponent(() => import('app/routes/extraPages/routes/404'))}/>
                                </Switch>
                            </div>
                        </RTL>
                    </IntlProvider>
                </MuiPickersUtilsProvider>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = ({settings, auth}) => {
    const {themeColor, sideNavColor, darkTheme, locale, isDirectionRTL} = settings;
    const {authUser, initURL} = auth;
    return {themeColor, sideNavColor, isDarkTheme: darkTheme, locale, isDirectionRTL, authUser, initURL}
};

export default connect(mapStateToProps, {setInitUrl})(App);
