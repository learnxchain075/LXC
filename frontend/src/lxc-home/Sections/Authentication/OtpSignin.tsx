import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticationStyleWrapper from './Authentication.style';
import AuthRightSection from './AuthRightSection';
import AuthFormWrapper from './AuthFormWrapper';
import { requestOtp, loginWithOtp } from '../../../services/authService';
import AppConfig from '../../../config/config';
import { jwtDecode } from 'jwt-decode';

const OtpSignin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!email.trim()) {
        toast.error('Email is required');
        return;
      }
      await requestOtp(email);
      setOtpSent(true);
      toast.success('OTP sent');
    } catch (err: any) {
      toast.error(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const code = otp.join('');
      if (code.length !== 4) {
        toast.error('Enter valid OTP');
        return;
      }
      const res = await loginWithOtp(email, code);
      localStorage.setItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY, res.data.accessToken);
      localStorage.setItem(AppConfig.LOCAL_STORAGE_REFRESH_TOKEN_KEY, res.data.refreshToken);
      const decoded: any = jwtDecode(res.data.accessToken);
      localStorage.setItem('schoolId', decoded.schoolId);
      localStorage.setItem('userId', decoded.userId);
      toast.success('Login Successful');
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <AuthenticationStyleWrapper>
      <ToastContainer />
      <AuthFormWrapper>
        <h2>OTP Login</h2>
        {!otpSent ? (
          <form onSubmit={handleSend}>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="form-primary-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <NavLink to="/sign-in" className="auth-link">Login with Password</NavLink>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="otp-box d-flex mb-4">
              {otp.map((d, i) => (
                <input
                  key={i}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  maxLength={1}
                />
              ))}
            </div>
            <button type="submit" className="form-primary-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </AuthFormWrapper>
      <AuthRightSection />
    </AuthenticationStyleWrapper>
  );
};

export default OtpSignin;
