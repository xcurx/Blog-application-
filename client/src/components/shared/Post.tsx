import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import moment from 'moment'
import { Button } from '../ui/button'
import { ArrowUpIcon } from 'lucide-react'
import { ChatBubbleIcon } from '@radix-ui/react-icons'

import { Post as PostType } from '../../interfaces/interface'
import { useWidth } from '../../hooks/use-mobile'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { memo } from 'react'

const Post = ({ post, ...props }: { post: PostType, [key: string]: unknown }) => {
    const width = useWidth();

  return (
    <div 
     className='mx-auto mt-2 px-6 rounded-xl'
     style={{
        maxWidth: "700px",
        width: width && width < 700 ? width : "auto",
     }}
     {...props}
    >
        <div className='flex space-x-3 items-center'>
            <div>
                <Avatar>
                    <AvatarImage src={post.account.profilePicture} alt={post.account.username}/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
            <div>
                <Badge 
                 className='bg-muted text-white hover:text-black'
                >
                    {post.account.username}
                </Badge>
            </div>
            <div className='text-xs'>
                { moment(`${post.createdAt}`).fromNow() }
            </div>
        </div>
                
        <div className='pt-3 font-extrabold'>
            {post.title}
        </div>

        <div className='py-4 rounded-xl flex flex-col space-y-2'>
            <Carousel>
              <CarouselContent>
                {post.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img src={image} alt={post.title} className='rounded-xl w-full h-96 object-cover'/>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {
                post.images.length > 1 && (
                    <>
                        <CarouselPrevious onClick={(e:React.MouseEvent) => {e.stopPropagation()}}/>
                        <CarouselNext onClick={(e:React.MouseEvent) => e.stopPropagation()}/>
                    </>
                )
              }
            </Carousel>
        </div>
        
        <div className='flex space-x-3'>
            <div className='bg-muted px-1 flex justify-center items-center rounded-3xl'>
                <Button variant={"link"} size={"icon"} className=''>
                    <ArrowUpIcon/>
                </Button>
                <Button variant={"link"} size={"icon"} className=''>
                    {post.upvotes}
                </Button>
            </div>
            <div className='bg-muted px-1 flex justify-center items-center rounded-3xl'>
                <Button variant={"link"} size={"icon"} className=''>
                    <ChatBubbleIcon/>
                </Button>
                <Button variant={"link"} size={"icon"} className=''>
                    {post.comments}
                </Button>
            </div>
        </div>

        <hr className='my-5'/>
    </div>
  )
}

export default memo(Post)
