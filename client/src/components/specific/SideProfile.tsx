import React from 'react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Settings2 } from 'lucide-react'
import { Profile } from '../../interfaces/interface'
import axios from 'axios'
import { URL } from '../../../constants'

const SideProfile = React.forwardRef<HTMLImageElement>((_,ref) => {
  const [profile, setProfile] = useState<Profile | null>(null)

  const getProfile = async () => {
    const user = await axios.get(`${URL}/users/account/profile`, { withCredentials: true })
    
    axios.get(`${URL}/users/profile/${user.data.data.username}`, { withCredentials: true })
         .then(res => setProfile(res.data.data))         
  }

  useEffect(() => {
    getProfile();
  }, [])

  if(!profile) return <div>Loading...</div>
  
  return (
    <div>
      <div className='w-full flex justify-center items-center'>
        <Avatar className='w-32 h-32 m-3'>
            <AvatarImage ref={ref} src={profile?.profilePicture}/>
            <AvatarFallback className='aspect-square'>U</AvatarFallback>
        </Avatar>
      </div>
      <div className='flex flex-col items-center space-y-2'>
        <div>{profile?.name}</div>
        <div>Posts: {profile?.posts}</div>
        <div>Followers: {profile?.followers}</div>
        <div>Following: {profile?.following}</div>
      </div>
      <div className='flex flex-col items-center my-5'>
        <Button>
            Edit Profile
            <Settings2/>
        </Button>
      </div>
    </div>
  )
})

export default SideProfile
