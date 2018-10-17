import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
import {
    hideMessage,
    showAuthLoader,
    showAuthMessage,
    userSignUp,
    verifyUser
} from 'actions/Auth';

const roles = [
  {
    value: 'Borrower',
    label: 'Borrower',
  },
  {
    value: 'Lender',
    label: 'Lender',
  },
  {
    value: 'Admin',
    label: 'Admin',
  },
];



class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            profile: 'Borrower',
            phoneno:'',
            code:''
        }
    }

    componentDidUpdate() {
        if (this.props.showMessage) {
            setTimeout(() => {
                this.props.hideMessage();
            }, 3000);
        }
        if (this.props.authUser !== null) {
            this.props.history.push('/app/dashboard/default');
        }
        if(this.props.success){
            this.props.history.push('/signin')
        }

    }
    
    click=()=>{
        const {
            name,
            email,
            password,
            profile,
            phone_number,
            code
        } = this.state;
        const {showMessage, loader, alertMessage} = this.props;
        if(name&&email&&password&&profile&&phone_number){
            var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
            if(!re.test(email))
            {
              this.props.showAuthMessage("Enter a validphone EmailID")
            }            
            else{
		        if(phone_number.length===13){
		        this.props.showAuthLoader();
		        this.props.userSignUp({email,name,password,profile,phone_number})
		        }
                else{
		        	this.props.showAuthMessage("Enter a validphone Phone no.")
		        }
		    }
        }
        else{
           this.props.showAuthMessage("Enter all the details")
        }
    }
    verify=()=>{
    	const {code,email}=this.state;
    	if(code){
    		this.props.verifyUser({code,email});
    	}
    }


    render() {
        const {
            name,
            email,
            password,
            profile,
            phone_number,
            code
        } = this.state;
        const {showMessage, loader, alertMessage} = this.props;
        if(!this.props.verify_User){
        return (
            <div
                className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
                <div className="app-login-main-content">
                    <div className="app-logo-content d-flex align-items-center justify-content-center">
                        <Link className="logo-lg" to="/" title="Jambo">
                            <img src="http://via.placeholder.com/177x65" alt="jambo" title="jambo"/>
                        </Link>
                    </div>

                    <div className="app-login-content">
                        <div className="app-login-header">
                            <h1>Sign Up</h1>
                        </div>

                        <div className="mb-4">
                            <h2><IntlMessages id="appModule.createAccount"/></h2>
                        </div>

                        <div className="app-login-form">
                            <form method="post" action="/">
                                <TextField
                                    type="text"
                                    label="Name"
                                    onChange={(event) => this.setState({name: event.target.value})}
                                    fullWidth
                                    defaultValue={name}
                                    margin="normal"
                                    className="mt-0 mb-2"
                                />

                                <TextField
                                    type="email"
                                    onChange={(event) => this.setState({email: event.target.value})}
                                    label={<IntlMessages id="appModule.email"/>}
                                    fullWidth
                                    defaultValue={email}
                                    margin="normal"
                                    className="mt-0 mb-2"
                                />

                                <TextField
                                    type="password"
                                    onChange={(event) => this.setState({password: event.target.value})}
                                    label={<IntlMessages id="appModule.password"/>}
                                    fullWidth
                                    defaultValue={password}
                                    margin="normal"
                                    className="mt-0 mb-4"
                                />

                                <TextField
                                    label="Phone number"
                                    type="number"
                                    onChange={(event) => this.setState({phone_number: "+91"+event.target.value})}
                                    InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                    }}
                                    margin="normal"
                                    style={{ margin: 1 }}
                                    className="mt-0 mb-4"
                                />
                                <TextField
                                    select
                                    label="Role"
                                    value={this.state.profile}
                                    onChange={(event)=>{this.setState({profile: event.target.value})}}
                                    helperText="Please select your Role"
                                    margin="normal"
                                    className="mt-0 mb-4"
                                >
                                    {roles.map(option => (
                                 <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                 </MenuItem>
                                    ))}
                                </TextField>

                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                    <Button variant="raised" onClick={this.click} color="primary">
                                        <IntlMessages
                                            id="appModule.regsiter"/>
                                    </Button>
                                    <Link to="/signin">
                                        <IntlMessages id="signUp.alreadyMember"/>
                                    </Link>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>

                {
                    loader &&
                    <div className="loader-view">
                        <CircularProgress/>
                    </div>
                }
                {showMessage && NotificationManager.error(alertMessage)}
                <NotificationContainer/>
            </div>
        )
      }
      else{
      	return(
           <div
                className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
                <div className="app-login-main-content">
                    <div className="app-logo-content d-flex align-items-center justify-content-center">
                            <img src="http://via.placeholder.com/177x65" alt="jambo" title="jambo"/>
                    </div>

                    <div className="app-login-content">
                        <div className="app-login-header">
                            <h1>Verification of Your account</h1>
                        </div>

                        
                        <div className="app-login-form">
                            <form method="post" action="/">
                                <TextField
                                    type="number"
                                    label="code"
                                    onChange={(event) => this.setState({code: event.target.value})}
                                    fullWidth
                                    defaultValue={code}
                                    margin="normal"
                                    className="mt-0 mb-2"
                                />
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                    <Button variant="raised" onClick={this.verify} color="primary">
                                        Verify
                                    </Button>
                                      
                                </div>

                            </form>
                        </div>
                    </div>

                </div>

                {
                    loader &&
                    <div className="loader-view">
                        <CircularProgress/>
                    </div>
                }
                {showMessage && NotificationManager.error(alertMessage)}
                <NotificationContainer/>
            </div>
      		)
      }

  }
}

const mapStateToProps = ({auth}) => {
    const {loader, alertMessage, showMessage, authUser,verify_User,success} = auth;
    return {loader, alertMessage, showMessage, authUser,verify_User,success}
};

export default connect(mapStateToProps, {
    hideMessage,
    showAuthLoader,
    showAuthMessage,
    userSignUp,
    verifyUser
})(SignUp);
