import { createSlice, configureStore } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: null
    },
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setUser } = userSlice.actions

export const store = configureStore({
    reducer: {
        user: userSlice.reducer
    }
})

