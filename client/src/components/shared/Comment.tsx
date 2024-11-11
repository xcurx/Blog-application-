import moment from "moment"
import { Comment as CommentType } from "../../interfaces/post"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button";
import { ArrowUpIcon } from "lucide-react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { URL } from "../../../constants";
import { Textarea } from "../ui/textarea";

const Comment = ({comment, indent=0}:{comment:CommentType, indent?:number}) => {  
    const [replies, setReplies] = useState<CommentType[] | null>(null);
    const [reply, setReply] = useState<string>("");
    const [replyOpen, setReplyOpen] = useState<boolean>(false);

    const getReplies = async () => {
        if(comment.isReplyToComment){
            const replies = await axios.get(`${URL}/posts/replies/${comment._id}`, { withCredentials: true });
            setReplies(replies.data?.data);
        }
    }

    const handleReply = () => { setReplyOpen(!replyOpen) }
    const handleReplySubmit = async () => {
        if(reply.trim() === "") return;

        const res = await axios.post(`${URL}/posts/comment`, 
                                      { content: reply, postId: comment.post, commentId: comment._id }, 
                                      { withCredentials: true });
        if(res.status === 200){
            setReplies([...(replies || []), res.data.data]);
            setReply("");
            setReplyOpen(false);
        }
    }

    useEffect(() => {
        getReplies();
    }, [comment, replies])

    // console.log(comment);

  return (
    <div style={{marginBottom: indent==0? "1rem":"0"}}>

      <div className="flex w-full">
        <div className="h-0.5" style={{width:`${indent}px`}}></div>
        <div className="flex-1">
            <div className="flex space-x-3 items-center">
              <div>
                <Avatar>
                  <AvatarImage src={comment.commentedBy.profilePicture} alt={comment.commentedBy.username}/>
                  <AvatarFallback>{comment.commentedBy.username[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-xs">
                {comment.commentedBy.username} 
              </div>
              <div className='text-xs'>
                {moment(`${comment.createdAt}`).fromNow()}
              </div>
            </div>
            
            <div className="ml-12 flex flex-col">
                <div className="mx-1">{comment.content}</div>
                <div className="flex">
                    <Button size={"icon"} variant={"ghost"}><ArrowUpIcon/></Button>
                    <Button 
                     variant={"ghost"} 
                     className="flex items-center"
                     onClick={handleReply}
                    >
                        <ChatBubbleIcon/>Reply
                    </Button>
                </div>
                {
                    replyOpen && (
                        <div className="w-full space-y-1 mt-1">
                            <Textarea 
                             className="w-full"
                             onChange={(e) => setReply(e.target.value)} 
                            />
                            <div className="flex justify-end my-2 space-x-2">
                                <Button onClick={handleReply} variant={"destructive"}>Cancel</Button>
                                <Button 
                                 onClick={handleReplySubmit}
                                >
                                    Reply
                                </Button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
      </div>

      <div className="mt-2">
        {
          comment?.replies?.length > 0 ?
          comment.replies.map((reply, index) => (
              <Comment key={index} comment={reply} indent={indent+35}/>
          )) :
          replies && replies?.length > 0 && 
            replies.map((reply, index) => (
                <Comment key={index} comment={reply} indent={indent+35}/>
            ))
        }
      </div>
    </div>
  )
}

export default Comment
