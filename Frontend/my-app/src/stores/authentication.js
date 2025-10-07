import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    portId: null,
    token: null,
    isLoggedIn: false,
    isAdmin: false,
    isSystemAdmin: false,
    userProfilePhoto: null,
    userId: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            const user = action.payload
            const { token, isAdmin, userProfilePhoto, portId, userId, isSystemAdmin } = action.payload;
            state.portId = portId;
            state.token = token;
            state.isLoggedIn = true;
            state.isAdmin = isAdmin;
            state.isSystemAdmin = isSystemAdmin;
            state.userProfilePhoto = userProfilePhoto;
            state.userId = userId;
            if (user.role === 'portAdmin' && user.port_id) {
                state.adminPortId = user.port_id;
            }
            else if (user.role === 'systemAdmin') {
                state.adminPortId = null;
            }
            else {
                state.adminPortId = null;
            }

        },
        setLogout: (state) => {
            state.portId = null;
            state.token = null;
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.isSystemAdmin = false;
            state.userProfilePhoto = null;
            state.userId = null
        },
    },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;