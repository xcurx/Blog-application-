import axios from 'axios';
import { cn } from '../../lib/utils'
import { logout } from '../../store/authSlice';
import { Button } from '../ui/button'
import { useDispatch } from 'react-redux';
import { URL } from '../../../constants';
import { Bell, BellDot, SearchIcon, } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { useEffect, useState } from 'react';
import { User } from '../../interfaces/interface';

const Navbar = ({ className }:{ className?:string}) => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    const res = await axios.post(`${URL}/users/logout`, {}, { withCredentials: true });
    console.log(res);
    dispatch(logout());
  }

  return (
    <div className={cn("flex flex-col p-2", className)}>
        <div className='text-4xl text-center p-5'>
          LOGO
        </div>
           
        <div className='flex flex-col m-2'>
            <DiaglogComponent/>

            <Button className='w-full flex items-center justify-start' variant={"ghost"}>
             {Math.random()>0.5? <Bell/> : <BellDot/>}
              Notifications
            </Button>
        </div>

        <div>
            <Button className='w-full my-2 flex items-center justify-center' variant={"secondary"} size={"lg"}>
              Create a Post
            </Button>
        </div>
 
        <div className='w-full my-2 flex justify-center'>
          <Button onClick={logoutHandler}>Logout</Button>
        </div>
    </div>
  )
}

const DiaglogComponent = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [search, setSearch] = useState('');

  const searchHandler = async () => {
    const res = await axios.get(`${URL}/users/search?query=${search}`, { withCredentials: true });
    if(res.status !== 200) return;
    setUsers(res.data?.data);
  }

  useEffect(() => {
    searchHandler();
  }, [search]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button className='w-full flex items-center justify-start' variant={"ghost"}>
          <SearchIcon/>
          Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center'>Search</DialogTitle>
        </DialogHeader>
        <div>
          <Input placeholder='Search' onChange={(e) => {setSearch(e.target.value)}}/>
        </div>
        <ScrollArea className='h-80 w-full p-2'>
          {
            users?.map((user, i) => (
              <UserList user={user} key={i}/>
            ))
          }
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

const UserList = ({user}:{user:User}) => {
  return (
    <div className='flex items-center justify-between mt-2'>
      <div className='flex items-center space-x-3'>
        <Avatar>
          <AvatarImage src={user.profilePicture}/>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
            {user.username}
        </div>
      </div>
      <div>
        <Button size={"sm"}>Follow</Button>
      </div>
    </div>
  )
}

export default Navbar
