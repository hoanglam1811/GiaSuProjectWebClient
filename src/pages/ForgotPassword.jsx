import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRequestOtp, handleResetPassword, handleVerifyOtp } from '../services/ApiServices/AuthorizeServices';
import { Button, Input, Typography } from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showBackToLogin, setShowBackToLogin] = useState(false);
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/');
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    setMessage("OTP sent to email");
    const response = await handleRequestOtp(email);
    if (response.success) {
      setStep(2);
      setMessage(response.message);
      setError("");
    } else {
      setError(response.message);
      setMessage("");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const response = await handleVerifyOtp(email, otp);
    if (response.success) {
      setStep(3);
      setMessage(response.message);
      setError("");
    } else {
      setError(response.message);
      setMessage("");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const response = await handleResetPassword(email, otp, newPassword);
    if (response.success) {
      setMessage("Password reset successfully. You can now log in.");
      setError("");
      setShowBackToLogin(true);
    } else {
      setError(response.message);
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center w-full my-5">
      <div className="items-center ml-9 mt-5 mb-5">
        <Typography style={{ fontWeight: "bold", marginLeft: "50px" }} variant="h4" color="blue-gray">
          Forgot Password
        </Typography>
        {step === 1 && (
          <form onSubmit={requestOtp} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <Input
              crossOrigin=""
              size="md"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{ marginLeft: "90px" }}
              className="ml-8 mb-3 !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Button type="submit" className="mt-6" fullWidth variant="contained">
              Request OTP
            </Button>
            {error && <div className="text-red-500">{error}</div>}
            {message && <div className="text-green-500">{message}</div>}
          </form>
        )}
        {step === 2 && (
          <form onSubmit={verifyOtp} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <Input
              crossOrigin=""
              size="md"
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              style={{ marginLeft: "90px" }}
              className=" !border-t-blue-gray-200 mb-3 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Button type="submit" className="mt-6" fullWidth variant="contained">
              Verify OTP
            </Button>
            {error && <div className="text-red-500">{error}</div>}
            {message && <div className="text-green-500">{message}</div>}
          </form>
        )}
        {step === 3 && (
          <form onSubmit={resetPassword} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <Input
              crossOrigin=""
              size="md"
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              type="password"
              style={{ marginLeft: "90px" }}
              className=" !border-t-blue-gray-200 mb-3 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Button type="submit" className="mt-6" fullWidth variant="contained">
              Reset Password
            </Button>
            {error && <div className="text-red-500">{error}</div>}
            {message && <div className="text-green-500">{message}</div>}
            <div className='ml-28'>
            {showBackToLogin && (
              <Button onClick={handleBackToLogin} className="mt-4" color="primary" variant="outlined">
                Back to Login
              </Button>
            )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
