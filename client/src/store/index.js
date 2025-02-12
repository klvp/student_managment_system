import { configureStore } from "@reduxjs/toolkit";
import studentSlicer from './studentSlicer'

const store = configureStore({
    reducer: {
        students: studentSlicer,
    }
})

export default store