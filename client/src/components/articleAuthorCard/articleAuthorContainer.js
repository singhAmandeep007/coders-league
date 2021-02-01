import { connect } from 'react-redux';

import { setUserFollowing } from './../../redux/user/userActions';
import ArticleAuthorCard from './articleAuthorCard';

const mapStateToProps = state => {
   return {
      userFollowing: state.userReducer.userFollowing
   }
}
const mapDispatchToProps = dispatch => ({

   setUserFollowing: (userId) => {
      dispatch(setUserFollowing(userId))
   }

})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleAuthorCard);