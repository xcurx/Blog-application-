import { startTransition, useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import axios from 'axios'
import { URL } from '../../constants'
import { Post as PostType, Comment as CommentType } from '../interfaces/interface'
import Post from '../components/shared/Post'
import Comment from '../components/shared/Comment'
import { useWidth } from '../hooks/use-mobile'
import { ScrollArea } from '../components/ui/scroll-area'
import { useParams } from 'react-router-dom'
import Loader from '../components/shared/Loader'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'

const PostPageComp = () => {
  const {postId} = useParams()
  const [post, setPost] = useState<PostType | null>(null)
  const [comments, setComments] = useState<CommentType[] | null>(null)
  const [comment, setComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
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

  const handleComment = () => {setIsCommenting(!isCommenting)}

  const handleCommentSubmit = async () => {
    try {
      if(comment.trim() === '') return
      
      const res = await axios.post(`${URL}/posts/comment`, { postId, content:comment }, { withCredentials: true })
      if (res.status === 200) {
        getComments()
        setComment('')
        setIsCommenting(false)
      }
    } catch (err) {
      console.log(err)
    }
  };

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
          <div className='w-full'>
            {
              !isCommenting? 
              (<div 
                className='w-full rounded-3xl border-muted border text-base my-6 px-3 py-2 bg-[#101010]'
                onClick={handleComment}
               >
                  Comment
               </div>) : (
               <div className='my-6'>
                  <Textarea onChange={(e) => setComment(e.target.value)}/>
                  <div className='w-full flex space-x-2 justify-end my-2'>
                    <Button variant={"destructive"} onClick={handleComment}>Cancel</Button>
                    <Button onClick={handleCommentSubmit}>Comment</Button>
                  </div>
               </div>
              )
            }
          </div>
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
