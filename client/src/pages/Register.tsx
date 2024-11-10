import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input, PasswordInput } from '../components/ui/input'
import { Button } from '../components/ui/button'
import axios from 'axios';

import { URL }from '../../constants.ts';

const Register = () => {
    const [userData, setUserData] = useState({
        name: "",
        username: "",
        email: "",
        password:""
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async () => {
        const res = await axios.post(`${URL}/users/register`, userData);
        console.log(res.data);
    }
 
  return (
    <div className="flex justify-center items-center h-screen">
        <Card className="xl:w-[30%] lg:w-[40%] md:w-[45%]">
            <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-3xl">Register</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="text-lg space-y-1 flex flex-col items-start">
                    <label className="pl-1" htmlFor="name">Name</label>
                    <Input onChange={handleChange} id="name" placeholder="Enter Name"/>
                </div>
                <div className="text-lg space-y-1 flex flex-col items-start">
                    <label className="pl-1" htmlFor="username">Username</label>
                    <Input onChange={handleChange} id="username" placeholder="Enter Username"/>
                </div>
                <div className="text-lg space-y-1 flex flex-col items-start">
                    <label className="pl-1" htmlFor="email">Email</label>
                    <Input onChange={handleChange} id="email" type="email" placeholder="Enter email"/>
                </div>
                <div className="text-lg space-y-1 flex flex-col items-start">
                    <label className="pl-1" htmlFor="password">Password</label>
                    <PasswordInput onChange={handleChange} id="password" placeholder="Enter Password"/>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} size={"fullg"}>Register</Button>
            </CardFooter>
        </Card>
    </div>
  )
}

export default Register
