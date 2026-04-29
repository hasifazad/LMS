import axios from "axios"

export let fetchData: any = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "x-organization-id": "org1db"
    }
})



// // Create an Axios instance
// const api = axios.create({
//     baseURL: 'http://localhost:3000',  // Include cookies in requests
//     withCredentials: true
// });

// // Add request interceptor to include the access token in every request
// api.interceptors.request.use((config) => {
//     const accessToken = localStorage.getItem('access');
//     if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error)
// });

// // Add response interceptor to handle token expiration
// api.interceptors.response.use(
//     (response) => {
//         return response
//     },  // If the response is successful, just return it
//     async (error) => {

//         if (error.response && error.response.status === 401) {
//             console.log('hellooo');// If token is expired, refresh the access token
//             try {
//                 const refreshResponse = await axios.get('http://localhost:3000/refresh', { withCredentials: true });
//                 console.log(refreshResponse);

//                 const newAccessToken = refreshResponse.data.access;

//                 // Save the new access token
//                 localStorage.setItem('access', newAccessToken);

//                 // Retry the original request with the new access token
//                 error.config.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return axios(error.config);
//             } catch (refreshError) {
//                 // Handle refresh token failure (e.g., redirect to login)
//                 console.error('Unable to refresh token:', refreshError);
//                 // Optional: Redirect to login page or logout the user
//                 return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// export default api



