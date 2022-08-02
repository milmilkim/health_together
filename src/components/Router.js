import { Route } from 'react-router-dom';
import Contents from 'routes/Contents';
import Home from 'routes/Home';
import LoginPage from 'routes/LoginPage';
import ScrollToTop from './ScrollToTop';
import Messages from 'routes/Messages';
import WritePost from 'routes/WritePost';
import Post from 'routes/Post';
import Myprofile from 'routes/Myprofile';
import Category from 'routes/Category';
import SearchPost from 'routes/SearchPost';
import UpdatePost from 'routes/UpdataPost';
import userProfile from 'routes/UserProfile';

const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Route exact path="/" exact component={Home} />
      <Route exact path="/contents" component={Contents} />
      <Route exact path="/loginpage" component={LoginPage} />
      <Route exact path="/writepost" component={WritePost} />
      <Route exact path="/messages/:chatId" component={Messages} />
      <Route exact path="/messages" component={Messages} />
      <Route exact path="/myprofile/:id" component={Myprofile} />
      <Route exact path="/myprofile" component={Myprofile} />
      <Route exact path="/userprofile/:email" component={userProfile} />
      <Route exact path="/post/:idx" component={Post} />
      <Route exact path="/category/:category" component={Category} />
      <Route exact path="/searchpost" component={SearchPost} />
      <Route exact path="/update/:idx" component={UpdatePost} />
    </>
  );
};

export default AppRouter;
