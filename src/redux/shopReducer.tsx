import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchGetProps, fetchPostProps } from "../types";

const initialState = {
    postStatus: 0,
    search: '',
    cartCount: 0,
    itemInfo: {
        isLoading: true,
        hasError: false,
        data: {
            id: 0,
            category: 0,
            title: '',
            images: [],
            sku: '',
            manufacturer: '',
            color: '',
            material: '',
            reason: '',
            season: '',
            heelSize: '',
            price: 0,
            oldPrice: 0,
            sizes: []
        }
    },
    topSales: {
        isLoading: true,
        hasError: false,
        data: []
    },
    categories: {
        isLoading: true,
        hasError: false,
        data: []
    },
    items: {
        isLoading: true,
        hasError: false,
        data: []
    },
    moreItems: {
        isDataOver: false,
        isLoading: false,
        hasError: false,
        data: [],
    }
}


export const fetchGetData = createAsyncThunk(
    'fetchGetData',
    async (props: fetchGetProps, { rejectWithValue }) => {
        try {
            const responce = await fetch(
                `${process.env.REACT_APP_URL + props.url}`)
                .then((responce) => responce.json());
            return responce;
        } catch (e) {
            throw rejectWithValue(e)
        }
    }
)

export const fetchPostData = createAsyncThunk(
    'fetchPostData',
    async (props: fetchPostProps, { rejectWithValue }) => {
        try {
            const responce = await fetch(
                `${process.env.REACT_APP_URL + props.url}`, {
                method: "POST",
                body: JSON.stringify(props.body)
            })
                .then((responce) => responce.status);
            return responce
        } catch (e) {
            throw rejectWithValue(e)
        }
    }
)

export const shopReducer = createSlice({
    name: 'shopReducer',
    initialState: initialState,
    reducers: {
        changeCategory: (state) => {
            state.moreItems.isDataOver = false;
        },
        setSearch: (state, action) => {
            state.search = action.payload
        },
        addItemToCart: (state) => {
            state.cartCount = state.cartCount + 1
        },
        removeItemToCart: (state) => {
            state.cartCount = state.cartCount - 1
        },
        setCartCount: (state, action) => {
            state.cartCount = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGetData.pending, (state, action) => {
            state[action.meta.arg.type].isLoading = true;
        })
        builder.addCase(fetchGetData.fulfilled, (state, action) => {
            state[action.meta.arg.type].isLoading = false;
            state[action.meta.arg.type].hasError = false;
            state[action.meta.arg.type].data = action.payload;

            if (action.meta.arg.type === 'moreItems') {
                state.items.data.push(...state.moreItems.data)
                if (state[action.meta.arg.type].data.length < 6) {
                    state.moreItems.isDataOver = true
                }
            }
        })
        builder.addCase(fetchGetData.rejected, (state, action) => {
            state[action.meta.arg.type].isLoading = false;
            state[action.meta.arg.type].hasError = true;
        })
        builder.addCase(fetchPostData.pending, (state, action) => {
            state.postStatus = 102;
        })
        builder.addCase(fetchPostData.fulfilled, (state, action) => {
            state.postStatus = 204
        })
        builder.addCase(fetchPostData.rejected, (state, action) => {
            state.postStatus = 500
        })
    }
})

export const { changeCategory, setSearch, addItemToCart, removeItemToCart, setCartCount } = shopReducer.actions