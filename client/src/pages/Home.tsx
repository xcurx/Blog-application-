import axios from 'axios';
import { URL } from "../../constants";
import AppLayout from '../components/layout/AppLayout';
import Post from '../components/shared/Post';
import { ScrollArea } from '../components/ui/scroll-area';
import React, { useEffect, useState } from 'react';

import { Post as PostType } from '../interfaces/interface';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/shared/Loader';

const HomeComp = () => {
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const navigate = useNavigate();
 
    const homePosts = async () => {
        const res = await axios.get(`${URL}/posts/home`, { withCredentials: true });
        setPosts(res.data.data);
    }

    useEffect(() => {
      homePosts();
    }, []);

  return (
    <ScrollArea style={{ height: '100vh' }} className='my-0'>
        {
            posts != null && posts?.length > 0 
                ? posts.map((post, index) => (
                    <Post 
                     key={index} 
                     post={post} 
                     onClick={() => navigate(`post/${post._id}`)}
                     onMouseEnter={(e:React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#121212'}
                     onMouseLeave={(e:React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0)'}
                    />
                ))
                : <Loader height='h-screen'/>
        }
    </ScrollArea>
  )
}

const Home = AppLayout(HomeComp);
export default Home;
