import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";
import axios from "axios";

// Async thunk for subscribe to newsletter API request
export const subscribeToNewsletter = createAsyncThunk(
  "news/subscribe",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/v1/news/subscribe", {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to subscribe for news letters!"
      );
    }
  }
);

// Async thunk for unsubscribe from newsletter API request
export const unsubscribeFromNewsletter = createAsyncThunk(
  "news/unsubscribe",
  async (subscribedToken, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("v1/news/unsubscribe", {
        token: subscribedToken,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message ||
          "Failed to unsubscribe from news letters!"
      );
    }
  }
);

// Async thunk for fetch newsletters with filters
export const fetchNewsletters = createAsyncThunk(
  "news/fetchNewsltters",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("v1/news/", {
        params: filters,
      });
      console.log("fetch all news letter - slice : ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch news letters!"
      );
    }
  }
);

// Async thunk for publish a new newsletter
export const publishNewsletter = createAsyncThunk(
  "news/publishNewsletter",
  async ({ title, body, image }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("v1/news/publish", {
        title,
        body,
        image,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to publish news letter!"
      );
    }
  }
);

// Async thunk for upload image and get URL from cloudinary
export const uploadImage = createAsyncThunk(
  "news/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      // Ensure file is provided
      if (!file) {
        return rejectWithValue("No file selected for upload.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_NEWS_PRESET
      ); // Assuming this value is in your .env
      formData.append("public_id", `news/${file.name}`); // Save under 'news' folder

      // Log FormData content for debugging
      console.log("FormData being sent: ", formData);

      // Send request to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return response.data.secure_url; // Return the URL after upload
    } catch (error) {
      console.error("Error uploading image: ", error);
      return rejectWithValue(
        error.response?.data?.message || "Image upload failed."
      );
    }
  }
);

// Initital state
const initialState = {
  newsletters: [],
  totalNews: 0,
  status: "idle",
  isSubscribed: false,
  imageUrl: "",
  error: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    resetImageUrl: (state) => {
      state.imageUrl = "";
    },
    resetNewsStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // for subscribe
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.status = "subscribe-loading";
        state.isSubscribed = false;
        state.error = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state) => {
        state.status = "subscribe-success";
        state.isSubscribed = true;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.status = "subscribe-error";
        state.isSubscribed = false;
        state.error = action.payload;
      })

      //for unsubscribe
      .addCase(unsubscribeFromNewsletter.pending, (state) => {
        state.status = "unsubscribe-loading";
        state.error = null;
      })
      .addCase(unsubscribeFromNewsletter.fulfilled, (state) => {
        state.status = "unsubscribe-success";
        state.isSubscribed = false;
      })
      .addCase(unsubscribeFromNewsletter.rejected, (state, action) => {
        state.status = "unsubscribe-error";
        state.error = action.payload;
      })

      // for fetch news letters
      .addCase(fetchNewsletters.pending, (state) => {
        state.status = "fetch-news-loading";
        state.error = null;
      })
      .addCase(fetchNewsletters.fulfilled, (state, action) => {
        state.status = "fetch-news-success";
        state.newsletters = action.payload;
        state.totalNews = action.payload.totalNews;
      })
      .addCase(fetchNewsletters.rejected, (state, action) => {
        state.status = "fetch-news-error";
        state.isLoading = false;
        state.error = action.payload;
      })

      // for publish news letter
      .addCase(publishNewsletter.pending, (state) => {
        state.status = "publish-news-loading";
        state.error = null;
      })
      .addCase(publishNewsletter.fulfilled, (state) => {
        state.status = "publish-news-success";
      })
      .addCase(publishNewsletter.rejected, (state, action) => {
        state.status = "publish-news-error";
        state.error = action.payload;
      })

      // for upload letter banner image to cloudinary
      .addCase(uploadImage.pending, (state) => {
        state.status = "uploadImage-news-loading";
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = "uploadImage-news-success";
        state.imageUrl = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = "uploadImage-news-error";
        state.error = action.payload;
      });
  },
});

export const { resetImageUrl, resetNewsStatus } = newsSlice.actions;

export default newsSlice.reducer;
