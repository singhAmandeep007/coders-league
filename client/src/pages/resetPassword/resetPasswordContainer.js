import { connect } from 'react-redux';

import { resetPassword } from './../../redux/user/userActions';

import ResetPasswordPage from './resetPassword';

const mapStateToProps = state => {
   return {
      isFetching: state.userReducer.isFetching,
      userMessage: state.userReducer.userMessage
   }
}
const mapDispatchToProps = dispatch => ({
   resetPassword: (resetToken, password, passwordConfirm) => {
      dispatch(resetPassword(resetToken, password, passwordConfirm))
   }

})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);