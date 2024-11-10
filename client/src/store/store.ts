import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

const store = configureStore({
    reducer:{
        auth
    }
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;