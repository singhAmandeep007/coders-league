import { connect } from 'react-redux';

import { updatePassword } from './../../redux/user/userActions';

import UpdateUserPassword from './updateUserPassword';

const mapStateToProps = state => {
   return {
      isFetching: state.userReducer.isFetching,
      userMessage: state.userReducer.userMessage
   }
}
const mapDispatchToProps = dispatch => ({
   updatePassword: (data) => {
      dispatch(updatePassword(data))
   }

})

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserPassword);