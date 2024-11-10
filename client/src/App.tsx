import { lazy, Suspense, useEffect, useState} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./store/store";
import { useDispatch } from "react-redux";
import axios from "axios";
import { URL } from "../constants";
import { setUser } from "./store/authSlice";
import './style.css';
import Loader from "./components/shared/Loader";

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Protected = lazy(() => import('./components/layout/Protected'));
const PostPage = lazy(() => import('./pages/PostPage'));

function App() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const res = await axios.get(`${URL}/users/account/profile`, {
        withCredentials: true,
      });
      dispatch(setUser(!!res.data?.data));
      return res.data;
    } catch (error) {
      console.error('Cannot get user:', error);
    } finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    getProfile();
  }, [user, dispatch]);
  
  if (loading) return (<div className="flex justify-center items-center h-screen w-full">
                          <span className="loader"></span>
                      </div>)

  return (
    <BrowserRouter>
        <Routes>
          <Route element={<Protected user={user} redirect="/login"/>} path="/">
            <Route path="/" element={
              <Suspense fallback={<Loader/>}>
                <Home/>
              </Suspense>
            }/>
            <Route path="/post/:postId" element={
              <Suspense fallback={<Loader/>}>
                <PostPage/>
              </Suspense>
            }/>
          </Route>

          <Route path="/register" element={
            <Suspense fallback={<Loader/>}>
              <Protected user={!user} redirect="/"><Register/></Protected>
            </Suspense>
          }/>
          <Route path="/login" element={
            <Suspense fallback={<Loader/>}>
              <Protected user={!user} redirect="/"><Login/></Protected>
            </Suspense>
          }/>
          <Route path="*" element={
            <Suspense fallback={<Loader/>}>
              <Home/>
            </Suspense>
          }/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
