import { connect } from "react-redux";

import { login, forgotPassword } from "./../../redux/user/userActions";
import LoginPage from "./loginPage";

const mapStateToProps = (state) => {
  return {
    isFetching: state.userReducer.isFetching,
    userMessage: state.userReducer.userMessage,
  };
};
const mapDispatchToProps = (dispatch) => ({
  login: (email, password) => {
    dispatch(login(email, password));
  },
  forgotPassword: (email) => {
    dispatch(forgotPassword(email));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
