import React, { useRef } from 'react'
import Navbar from '../shared/Navbar'
import SideProfile from '../specific/SideProfile'
import { useWidth } from '../../hooks/use-mobile'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

const AppLayout = (WrappedComponent: React.ComponentType) => {
    
    const LayoutComponent = () => {
        const width = useWidth();
        const profilePictureRef = useRef<HTMLImageElement>(null);

        const layoutFinder = () => {
            if(width == null) return '';
            if(width > 1280) return '1fr 6fr 1fr';
            if(width > 768)  return '1fr 6fr';
        };

        if(width == null) return <div>Loading...</div>;
        
        return (
            <div className="flex flex-col h-screen overflow-hidden">
                <div
                    className="grid flex-grow"
                    style={{
                        gridTemplateColumns: layoutFinder(),
                    }}
                >
                    <div className="h-full">
                        {
                            (width > 768) ? (
                                <Navbar/>
                            ) : (
                                <div className='relative flex justify-between p-2'>
                                    <div className='flex space-x-2'>
                                        <div>
                                            <Sheet key={"left"}>
                                              <SheetTrigger>
                                                <Button size={"icon"} variant={"outline"}><HamburgerMenuIcon/></Button>
                                              </SheetTrigger>
                                              <SheetContent side={"left"}>
                                                <Navbar/>
                                              </SheetContent>
                                            </Sheet>
                                        </div>
                                        <div className='text-3xl'>
                                            LOGO
                                        </div>
                                    </div>
                                    <div className='flex justify-center items-center cursor-pointer'>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger>
                                            <Avatar className='w-12 h-12'>
                                              <AvatarImage src={profilePictureRef?.current?.src}/>
                                              <AvatarFallback className='aspect-square'>A</AvatarFallback>
                                            </Avatar>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent className='mr-2'>
                                              <SideProfile ref={profilePictureRef}/>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="h-full border border-l-2 border-r-2 overflow-hidden">
                        <WrappedComponent/>
                    </div>
                    {
                        width > 1280 ? (
                            <div className="h-full">
                                <SideProfile/>
                            </div>
                        ) : (
                            <div className='flex justify-center absolute top-2 right-2 items-center cursor-pointer'>
                                <DropdownMenu>
                                  <DropdownMenuTrigger>
                                    <Avatar className='w-12 h-12'>
                                      <AvatarImage/>
                                      <AvatarFallback className='aspect-square'>A</AvatarFallback>
                                    </Avatar>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className='mr-2'>
                                      <SideProfile/>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    };

    return LayoutComponent;
}

export default AppLayout
