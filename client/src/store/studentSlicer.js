import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { config } from "../../config"
import { getCookie } from "@/lib/helper"
const initialState = {
    data: [],
    status: "idle"
}

const studentSlicer = createSlice({
    name: "students",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStudents.fulfilled, (state, action) => {
                state.data = action.payload
                state.status = "fulfilled"
            })
            .addCase(getStudents.pending, (state, action) => {
                state.status = "loading"
            })
            .addCase(getStudents.rejected, (state, action) => {
                state.status = "error"
            })
    }
})
export const { } = studentSlicer.actions
export default studentSlicer.reducer

export const getStudents = createAsyncThunk("students/get", async (search = null) => {
    console.log("🚀 ~ getStudents ~ search:", search)
    try {
        const response = await fetch(`${config.apiBaseUrl}/students${search ? `?search=${search}` : ""}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": getCookie("token")
                },
            }
        );
        let data = await response.json();
        console.log("🚀 ~ getStudents ~ data:", data)
        return data.data
    } catch (error) {
        console.error("🚀 ~ getStudents ~ error:", error)
    }

})