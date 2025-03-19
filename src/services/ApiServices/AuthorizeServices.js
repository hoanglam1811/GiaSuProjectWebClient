import axios from "axios";
import getEndpoint from "../getEndpoint";

export async function LoginService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/Login`, credentials);
    return response.data;
}

export async function CheckEmailExist(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/CheckEmailExist`, credentials);
    return response.data;
}

export async function RequestOtpService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/request-otp`, credentials, {
      withCredentials: true
    });
    return response.data;
}

export async function VerifyOtpService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/verify-otp`, credentials,{
        withCredentials: true
    });
    return response.data;
}

export async function RegisterStudentService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/RegisterStudent`, credentials ,{
        withCredentials: true
    });
    return response.data;
}

export async function RegisterTutorService(credentials) {
    const response = await axios.post(`${getEndpoint()}/api/Authentication/RegisterTutor`, credentials ,{
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export async function handleRequestOtp(email) {
    try {
      const response = await axios.post(`${getEndpoint()}/api/Authentication/RequestOtp`, { email },{ 
        headers: { "bypass-tunnel-reminder": "true" } ,
        withCredentials: true,
      } );
      return { success: true, message: "OTP sent to your email.", data: response.data };
    } catch (error) {
      return { success: false, message: "Failed to send OTP. Please try again.", error };
    }
  }
  
  export async function handleVerifyOtp(email, otp) {
    try {
      const response = await axios.post(`${getEndpoint()}/api/Authentication/VerifyOtp`, { email, otp }, { 
        headers: { "bypass-tunnel-reminder": "true" } ,
        withCredentials: true,
      } );
      return { success: true, message: "OTP verified. You can now reset your password.", data: response.data };
    } catch (error) {
      return { success: false, message: "Invalid OTP. Please try again.", error };
    }
  }
  
  export async function handleResetPassword(email, otp, newPassword) {
    try {
      const response = await axios.post(`${getEndpoint()}/api/Authentication/ResetPassword`, { email, otp, newPassword }, { 
        headers: { "bypass-tunnel-reminder": "true" } ,
        withCredentials: true,
      } );
      return { success: true, message: "Password reset successfully. You can now log in.", data: response.data };
    } catch (error) {
      return { success: false, message: "Failed to reset password. Please try again.", error };
    }
  }

