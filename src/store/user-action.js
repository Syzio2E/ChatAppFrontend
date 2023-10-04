import { userActions } from "./user-redux";
import axios from "axios";
import { toast } from "react-toastify";


export const addUsers = (obj) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("https://3.109.133.91:8000/login", obj,{headers:{'Content-Type':'application/json'}});
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("id", response.data.id);
        dispatch(
          userActions.login({
            token: token,
            username: response.data.username,
            id: response.data.id,
          })
        );
        // Return the response data
        return response.status;
       
      } else if (response.status === 400) {
        throw new Error("Password is incorrect");
      } else if (response.status === 404) {
        throw new Error("Email doesn't Exists");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred. Please try again later.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Return an error object
      return { error: errorMessage };
    }
  };
};


export const newUser = (obj) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("https://3.109.133.91:8000", obj,{headers:{'Content-Type':'application/json'}});
      if (response.status === 201) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("id", response.data.id);
        dispatch(
          userActions.login({
            token: token,
            username: response.data.username,
            id: response.data.id,
          })
        );
        // Return the response data
        return response.status;
      } else if (response.status === 409) {
        throw new Error("Email already Exists");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred. Please try again later.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Return an error object
      return { error: errorMessage };
    }
  };
};

// logout actioncreator
export const onUserLogout = (token) => {
  return async (dispatch) => {
    try{
         await axios.put('https://3.109.133.91:8000/logout',null,{headers:{Authorization:token}})
        dispatch(userActions.logout())
    }catch(err){
        const errorMessage =
        err.response?.data?.message || 'An error occurred while logging out.';
        toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000, // 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
    
    }
   
  };
};
