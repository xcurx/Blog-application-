import axios from 'axios';
import { URL } from "../../constants";
import AppLayout from '../components/layout/AppLayout';
import Post from '../components/shared/Post';
import { ScrollArea } from '../components/ui/scroll-area';
import { useEffect, useState } from 'react';

import { Post as PostType } from '../interfaces/post';

const HomeComp = () => {
    const [posts, setPosts] = useState<PostType[] | null>(null);
 
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
                    <Post key={index} post={post}/>
                ))
                : (<div className="flex justify-center items-center h-full w-full">
                  <span className="loader"></span>
                  </div>)
        }
    </ScrollArea>
  )
}

const Home = AppLayout(HomeComp);
export default Home;