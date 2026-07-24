import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import axiosClient from "../src/utils/axiosClient.js";

const registerUser=createAsyncThunk(
    "auth/register",
    async (userData, {rejectWithValue})=>{
        try{
        const response=await axiosClient.post("/user/register",userData);
        return response.data.result;
        }
        catch(err){
           return rejectWithValue(err);
        }
    }
);

const loginUser=createAsyncThunk(
    "auth/login",
    async (userData, {rejectWithValue})=>{
        try{
        const response=await axiosClient.post("/user/login", userData);
        return response.data.result;
        }
        catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

const authenticateUser=createAsyncThunk(
    "auth/authenticate",
    async (_, {rejectWithValue})=>{
        try{
            const {data}=await axiosClient.get("/user/authenticate");
            return data.result;
        }
        catch(err){
            return rejectWithValue(err);
        }
    }
);

const logoutUser=createAsyncThunk(
    "/auth/logout",
    async (_, {rejectWithValue})=>{
        try{
            await axiosClient.post("/user/logout");
            return null;
        }
        catch(err){
            return rejectWithValue(err);
        }
    }
);

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticate:false,
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending, (state)=>{
            state.loading=true,
            state.error=false
        })
        .addCase(registerUser.fulfilled, (state,action)=>{
            state.user=action.payload,
            state.isAuthenticate=true,
            state.loading=false
        })
        .addCase(registerUser.rejected, (state,action)=>{
            state.error=action.payload?.message || "Something went wrong...",
            state.loading=false,
            state.isAuthenticate=false,
            state.user=null
        })

        .addCase(loginUser.pending, (state)=>{
            state.loading=true,
            state.error=false
        })
        .addCase(loginUser.fulfilled, (state,action)=>{
            state.user=action.payload,
            state.isAuthenticate=true,
            state.loading=false
        })
        .addCase(loginUser.rejected , (state,action)=>{
            state.error=action.payload?.message || "Something went wrong...",
            state.loading=false,
            state.user=null,
            state.isAuthenticate=false
        })


        .addCase(authenticateUser.pending, (state)=>{
            state.loading=true,
            state.error=false
        })
        .addCase(authenticateUser.fulfilled, (state,action)=>{
            state.user=action.payload,
            state.isAuthenticate=true,
            state.loading=false
        })
        .addCase(authenticateUser.rejected , (state,action)=>{
            state.error=action.payload?.message || "Something went wrong...",
            state.loading=false,
            state.user=null,
            state.isAuthenticate=false
        })

        .addCase(logoutUser.pending, (state)=>{
            state.loading=true,
            state.error=false
        })
        .addCase(logoutUser.fulfilled ,(state)=>{
            state.isAuthenticate=false,
            state.loading=false,
            state.user=null
        })
        .addCase(logoutUser.rejected , (state,action)=>{
            state.error=action.payload?.message || "Something went wrong...",
            state.loading=false,
            state.user=null,
            state.isAuthenticate=false
        });
    }
});

export {authenticateUser,registerUser,loginUser,logoutUser};
export default authSlice.reducer;