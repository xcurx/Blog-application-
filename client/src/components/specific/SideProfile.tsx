import React, { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Camera, Settings2 } from 'lucide-react'
import { Profile } from '../../interfaces/interface'
import axios from 'axios'
import { URL } from '../../../constants'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const SideProfile = React.forwardRef<HTMLImageElement>((_,ref) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [changeProfile, setChangeProfile] = useState<File | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)

  const getProfile = async () => {
    const user = await axios.get(`${URL}/users/account/profile`, { withCredentials: true })
    
    axios.get(`${URL}/users/profile/${user.data.data.username}`, { withCredentials: true })
         .then(res => setProfile(res.data.data))         
  }

  const openChangeHandler = useCallback(() => setAlertOpen(!alertOpen), [alertOpen])

  const handleChangeProfile = async () => {
    if(changeProfile === null) return;

    const formData = new FormData()
    formData.append('profilePic', changeProfile)
    await axios.patch(`${URL}/users/account/avatar`, formData, { withCredentials: true })
    getProfile()
    setAlertOpen(false)
  };

  useEffect(() => {
    getProfile();
  }, [profile])

  useEffect(() => {
    if(changeProfile) openChangeHandler()
  }, [changeProfile, openChangeHandler])

  if(!profile) return <div>Loading...</div>
  
  return (
    <div>
      <div className='relative w-full flex justify-center items-center'>
        <Avatar className='w-32 h-32 m-3'>
            <AvatarImage ref={ref} src={profile?.profilePicture}/>
            <AvatarFallback className='aspect-square'>U</AvatarFallback>
        </Avatar>
        <div className='absolute bottom-4 right-10 bg-muted-foreground p-1 rounded-full'>
          <Camera/>
          <input 
           type='file' 
           accept='image/*' 
           className='h-full w-full absolute top-0 left-0 opacity-0 pointer-events-auto'
           onChange={(e) => setChangeProfile(e.target.files?.[0] || null)}
          />
        </div>
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

      <AlertDialog open={alertOpen} onOpenChange={openChangeHandler}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change profile picture?</AlertDialogTitle>
            <VisuallyHidden.Root>
              <AlertDialogDescription>
                //TODO - display image
              </AlertDialogDescription>
            </VisuallyHidden.Root>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangeProfile}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
})

export default SideProfile
