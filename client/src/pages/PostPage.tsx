import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import axios from 'axios'
import { URL } from '../../constants'
import { Post as PostType } from '../interfaces/post'
import Post from '../components/shared/Post'
import sampleComment from '../sample'
import Comment from '../components/shared/Comment'
import { useWidth } from '../hooks/use-mobile'

const PostPageComp = () => {
  const [post, setPost] = useState<PostType | null>(null)
  const [loading, setLoading] = useState(true)
  const width = useWidth()

  const getPost = async () => {
    try {
      const res = await axios.get(`${URL}/posts/66c071ab80fe8756f70e2df9`, { withCredentials: true })
      setPost(res.data?.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPost();
  }, [])

  console.log(post);

  if(loading) return (<div className="flex justify-center items-center h-screen w-full">
                            <span className='loader'></span>
                        </div>)
  
  if(post === null) return (<div className="flex justify-center items-center h-screen w-full"> 
                              <span>Post not found</span>
                            </div>)

  return (
    <div className='bg-[#101010] h-full w-full p-1'>
        <Post post={post} />
        <div 
         className='mx-auto px-6 mt-3'
         style={{
          maxWidth: "700px",
          width: width && width < 700 ? width : "auto",
         }}
        >
          {
              sampleComment.length > 0 && 
              sampleComment.map((reply, index) => (
                  <Comment key={index} sample={reply} indent={0}/>
              ))
          }
        </div>
    </div>
  )
}

const PostPage = AppLayout(PostPageComp)
export default PostPage
