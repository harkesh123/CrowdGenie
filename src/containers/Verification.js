import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    verifyUser,
    hideMessage,
    showAuthLoader
} from "actions/Auth";

class Verify extends React.Component {
    constructor() {
        super();
        this.state = {
            code: ''
        }
    }

    componentDidUpdate() {
        if (this.props.showMessage) {
            setTimeout(() => {
                this.props.hideMessage();
            }, 100);
        }
        if (this.props.authUser !== null) {
            this.props.history.push('/');
        }
       if(this.props.success){
            this.props.history.push('/signin')
        }
        if(this.props.verify_User===false){
            this.props.history.push('/signup')
        }
        console.log(this.props.verify_Userer)
    }

    render() {
        const {code} = this.state;
        const {showMessage, loader, alertMessage} = this.props;
        return (
            <div
                className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
                <div className="app-login-main-content">


                    <div className="app-login-content">
                        <div className="app-login-header mb-4">
                            <h1>Verify</h1>
                        </div>

                        <div className="app-login-form">
                            <form>
                                <fieldset>
                                    <TextField
                                        label="Code"
                                        fullWidth
                                        onChange={(event) => this.setState({code: event.target.value})}
                                        defaultValue={code}
                                        margin="normal"
                                        style={{ margin: 3 }}
                                        className="mt-1 my-sm-3"
                                    />
                                    <div className="mb-3 d-flex align-items-center justify-content-between">
                                        <Button onClick={() => {
                                            //this.props.showAuthLoader();
                                            console.log(this.state.code)
                                            this.props.verifyUser({code});
                                        }} variant="raised" color="primary">
                                            Verify
                                        </Button>

                                        
                                    </div>

                                    
                                </fieldset>
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
                {showMessage && console.log(alertMessage)}
                {/*<NotificationContainer/>*/}
            </div>
        );
    }
}

const mapStateToProps = ({auth}) => {
    const {loader, alertMessage, showMessage, authUser,success,verify_User} = auth;
    return {loader, alertMessage, showMessage, authUser,success,verify_User}
};

export default connect(mapStateToProps, {
    verifyUser,
    hideMessage,
    showAuthLoader
     })(Verify);
