import React, { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

type Props = {
    children?: ReactNode,
    redirect?: string,
    user: boolean
}

const Protected = ({ children, redirect="/login", user}: Props) => {  
    if(!user) return <Navigate to={redirect} replace/>

    return (
        children? children : <Outlet/>
    )
}

export default Protected
