import { startTransition, useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import axios from 'axios'
import { URL } from '../../constants'
import { Post as PostType, Comment as CommentType } from '../interfaces/post'
import Post from '../components/shared/Post'
import Comment from '../components/shared/Comment'
import { useWidth } from '../hooks/use-mobile'
import { ScrollArea } from '../components/ui/scroll-area'
import { useParams } from 'react-router-dom'
import Loader from '../components/shared/Loader'

const PostPageComp = () => {
  const {postId} = useParams()
  const [post, setPost] = useState<PostType | null>(null)
  const [comments, setComments] = useState<CommentType[] | null>(null)
  const [loading, setLoading] = useState(true)
  const width = useWidth()

  const getPost = async () => {
    try {
      const res = await axios.get(`${URL}/posts/${postId}`, { withCredentials: true })
      setPost(res.data?.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const getComments = async () => {
    try {
      const res = await axios.get(`${URL}/posts/comments/${postId}`, { withCredentials: true })
      setComments(res.data?.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    startTransition(() => {
      getPost();
      getComments();
    })
  }, [])

  if(loading) return <Loader height='h-screen'/>
  
  if(post === null) return (<div className="flex justify-center items-center h-screen w-full"> 
                              <span>Post not found</span>
                            </div>)

  return (
    <ScrollArea style={{ height: '100vh' }} className='bg-[#101010] h-full w-full p-1'>
        <Post post={post} />
        <div 
         className='mx-auto px-6 mt-3'
         style={{
          maxWidth: "700px",
          width: width && width < 700 ? width : "auto",
         }}
        >
          {
              comments && comments?.length > 0 && 
              comments.map((reply, index) => (
                  <Comment key={index} comment={reply} indent={0}/>
              ))
          }
        </div>
    </ScrollArea>
  )
}

const PostPage = AppLayout(PostPageComp)
export default PostPage
