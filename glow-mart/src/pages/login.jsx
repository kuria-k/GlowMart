// // pages/Auth.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Navbar from "../components/navbar";
// import Footer from "../components/footer";
// import MK from "../assets/untitled.png";

// function Auth() {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     firstName: '',
//     lastName: '',
//     agreeToTerms: false,
//     receiveNewsletter: true
//   });
//   const [errors, setErrors] = useState({});
//   const [loginError, setLoginError] = useState('');

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//     // Clear login error when user types
//     if (loginError) {
//       setLoginError('');
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     }

//     if (!isLogin) {
//       if (!formData.firstName) {
//         newErrors.firstName = 'First name is required';
//       }
//       if (!formData.lastName) {
//         newErrors.lastName = 'Last name is required';
//       }
//       if (formData.password !== formData.confirmPassword) {
//         newErrors.confirmPassword = 'Passwords do not match';
//       }
//       if (!formData.agreeToTerms) {
//         newErrors.agreeToTerms = 'Please agree to the terms to continue';
//       }
//     }

//     return newErrors;
//   };

//   const handleLogin = (email, password) => {
//     // Hard-coded credentials
//     const adminCredentials = {
//       username: 'kamauadmin',
//       password: 'kama2026',
//       email: 'admin@glowmart.com'
//     };

//     const buyerCredentials = {
//       username: 'buyer2026',
//       password: 'b@2026',
//       email: 'buyer@example.com'
//     };

//     // Check if login matches admin
//     if ((email === adminCredentials.email || email === adminCredentials.username) && 
//         password === adminCredentials.password) {
//       // Store user info in localStorage/session
//       localStorage.setItem('user', JSON.stringify({
//         role: 'admin',
//         username: 'kamauadmin',
//         isAuthenticated: true
//       }));
//       navigate('/admin/dashboard');
//       return true;
//     }
    
//     // Check if login matches buyer
//     if ((email === buyerCredentials.email || email === buyerCredentials.username) && 
//         password === buyerCredentials.password) {
//       // Store user info in localStorage/session
//       localStorage.setItem('user', JSON.stringify({
//         role: 'buyer',
//         username: 'buyer2026',
//         isAuthenticated: true
//       }));
//       navigate('/home');
//       return true;
//     }

//     return false;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (isLogin) {
//       // Login logic
//       const loginSuccessful = handleLogin(formData.email, formData.password);
//       if (!loginSuccessful) {
//         setLoginError('Invalid username/email or password');
//       }
//     } else {
//       // Signup logic
//       const newErrors = validateForm();
      
//       if (Object.keys(newErrors).length === 0) {
//         // Submit form
//         console.log('Signup form submitted:', formData);
//         // Here you would make API call to your backend
//         // After successful signup, you might want to auto-login or redirect to login
//         alert('Account created successfully! Please sign in.');
//         setIsLogin(true); // Switch to login view
//         // Clear form
//         setFormData({
//           email: '',
//           password: '',
//           confirmPassword: '',
//           firstName: '',
//           lastName: '',
//           agreeToTerms: false,
//           receiveNewsletter: true
//         });
//       } else {
//         setErrors(newErrors);
//       }
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-white flex">
//         {/* Left Side - Branding */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] flex-col justify-between p-16 relative overflow-hidden">
//           {/* Decorative Elements */}
//           <div className="absolute top-20 right-20 w-64 h-64 bg-[#b89b7b]/5 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#d4c4b0]/10 rounded-full blur-3xl"></div>
          
//           <div className="relative z-10">
//             <Link to="/" className="flex items-center space-x-3 group">
//               <div className="w-14 h-14 bg-gradient-to-br from-[#b89b7b] to-[#9b7a5a] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
//                 <img src={MK} alt="" className="h-20 w-[200px] rounded-2xl" />
//               </div>
//             </Link>
//           </div>

//           <div className="relative z-10 space-y-8 max-w-md">
//             <div className="space-y-2">
//               <span className="text-[#b89b7b] text-sm tracking-[0.3em] font-light">WELLNESS JOURNEY</span>
//               <blockquote className="text-4xl font-light text-[#2c2c2c] leading-tight">
//                 "Nourish your body,<br />
//                 <span className="italic text-[#b89b7b]">glow from within</span>"
//               </blockquote>
//             </div>
            
//             <div className="border-l-2 border-[#b89b7b]/30 pl-6 py-2">
//               <p className="text-[#6b6b6b] text-sm leading-relaxed">
//                 Join thousands of women who have transformed their wellness routine 
//                 with our science-backed supplements and clean beauty products.
//               </p>
//             </div>

//             <div className="flex items-center space-x-6 pt-4">
//               <div>
//                 <div className="flex items-center space-x-1">
//                   {[1,2,3,4,5].map((star) => (
//                     <svg key={star} className="w-4 h-4 fill-current text-amber-400" viewBox="0 0 20 20">
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <p className="text-xs text-[#6b6b6b] mt-1">Trusted by 2k+ People</p>
//               </div>
//             </div>
//           </div>

//           <div className="relative z-10 grid grid-cols-3 gap-4">
//             <div className="text-center">
//               <div className="text-2xl font-light text-[#2c2c2c]">200+</div>
//               <div className="text-xs text-[#b89b7b] tracking-wide">Clean Products</div>
//             </div>
//             <div className="text-center border-x border-[#b89b7b]/20">
//               <div className="text-2xl font-light text-[#2c2c2c]">100%</div>
//               <div className="text-xs text-[#b89b7b] tracking-wide">Cruelty-Free</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-light text-[#2c2c2c]">24/7</div>
//               <div className="text-xs text-[#b89b7b] tracking-wide">Wellness Support</div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Auth Form */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//           <div className="max-w-md w-full">
//             {/* Header */}
//             <div className="text-center mb-10">
//               <h2 className="text-3xl font-light text-[#2c2c2c] mb-2">
//                 {isLogin ? 'Welcome Back' : 'Begin Your Journey'}
//               </h2>
//               <p className="text-sm text-[#6b6b6b]">
//                 {isLogin 
//                   ? 'Sign in to access your wellness dashboard' 
//                   : 'Create an account to get personalized recommendations'}
//               </p>
//             </div>

//             {/* Toggle */}
//             <div className="flex p-1 bg-[#faf7f2] rounded-full mb-8">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsLogin(true);
//                   setLoginError('');
//                   setErrors({});
//                 }}
//                 className={`flex-1 py-3 text-sm tracking-wide rounded-full transition-all ${
//                   isLogin 
//                     ? 'bg-white text-[#2c2c2c] shadow-sm' 
//                     : 'text-[#6b6b6b] hover:text-[#2c2c2c]'
//                 }`}
//               >
//                 SIGN IN
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsLogin(false);
//                   setLoginError('');
//                   setErrors({});
//                 }}
//                 className={`flex-1 py-3 text-sm tracking-wide rounded-full transition-all ${
//                   !isLogin 
//                     ? 'bg-white text-[#2c2c2c] shadow-sm' 
//                     : 'text-[#6b6b6b] hover:text-[#2c2c2c]'
//                 }`}
//               >
//                 CREATE ACCOUNT
//               </button>
//             </div>

//             {/* Login Error Message */}
//             {loginError && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-xs text-red-600 text-center">{loginError}</p>
//               </div>
//             )}

//             {/* Demo Credentials Hint */}
//             {isLogin && (
//               <div className="mb-4 p-3 bg-[#faf7f2] border border-[#b89b7b]/20 rounded-lg">
//                 <p className="text-xs text-[#6b6b6b] text-center">
//                   <span className="font-medium text-[#b89b7b]">Demo:</span> Admin: kamauadmin / kama2026 | Buyer: buyer2026 / b@2026
//                 </p>
//               </div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {!isLogin && (
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs tracking-wide text-[#2c2c2c] mb-2">
//                       FIRST NAME
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       className={`w-full px-5 py-3 border ${
//                         errors.firstName ? 'border-red-500' : 'border-[#f0e7db]'
//                       } bg-white text-[#2c2c2c] focus:outline-none focus:border-[#b89b7b] transition-colors rounded-lg`}
//                       placeholder="Jane"
//                     />
//                     {errors.firstName && (
//                       <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-xs tracking-wide text-[#2c2c2c] mb-2">
//                       LAST NAME
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       className={`w-full px-5 py-3 border ${
//                         errors.lastName ? 'border-red-500' : 'border-[#f0e7db]'
//                       } bg-white text-[#2c2c2c] focus:outline-none focus:border-[#b89b7b] transition-colors rounded-lg`}
//                       placeholder="Smith"
//                     />
//                     {errors.lastName && (
//                       <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <label className="block text-xs tracking-wide text-[#2c2c2c] mb-2">
//                   EMAIL ADDRESS OR USERNAME
//                 </label>
//                 <input
//                   type="text"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full px-5 py-3 border ${
//                     errors.email ? 'border-red-500' : 'border-[#f0e7db]'
//                   } bg-white text-[#2c2c2c] focus:outline-none focus:border-[#b89b7b] transition-colors rounded-lg`}
//                   placeholder="jane@example.com or username"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-xs text-red-500">{errors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-xs tracking-wide text-[#2c2c2c] mb-2">
//                   PASSWORD
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full px-5 py-3 border ${
//                     errors.password ? 'border-red-500' : 'border-[#f0e7db]'
//                   } bg-white text-[#2c2c2c] focus:outline-none focus:border-[#b89b7b] transition-colors rounded-lg`}
//                   placeholder="••••••••"
//                 />
//                 {errors.password && (
//                   <p className="mt-1 text-xs text-red-500">{errors.password}</p>
//                 )}
//               </div>

//               {!isLogin && (
//                 <div>
//                   <label className="block text-xs tracking-wide text-[#2c2c2c] mb-2">
//                     CONFIRM PASSWORD
//                   </label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className={`w-full px-5 py-3 border ${
//                       errors.confirmPassword ? 'border-red-500' : 'border-[#f0e7db]'
//                     } bg-white text-[#2c2c2c] focus:outline-none focus:border-[#b89b7b] transition-colors rounded-lg`}
//                     placeholder="••••••••"
//                   />
//                   {errors.confirmPassword && (
//                     <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
//                   )}
//                 </div>
//               )}

//               {!isLogin && (
//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="checkbox"
//                       name="agreeToTerms"
//                       checked={formData.agreeToTerms}
//                       onChange={handleChange}
//                       className="w-5 h-5 rounded border-[#f0e7db] text-[#b89b7b] focus:ring-[#b89b7b]"
//                     />
//                     <label className="text-sm text-[#6b6b6b]">
//                       I agree to the{' '}
//                       <a href="#" className="text-[#b89b7b] hover:underline">Terms</a>
//                       {' '}and{' '}
//                       <a href="#" className="text-[#b89b7b] hover:underline">Privacy Policy</a>
//                     </label>
//                   </div>
                  
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="checkbox"
//                       name="receiveNewsletter"
//                       checked={formData.receiveNewsletter}
//                       onChange={handleChange}
//                       className="w-5 h-5 rounded border-[#f0e7db] text-[#b89b7b] focus:ring-[#b89b7b]"
//                     />
//                     <label className="text-sm text-[#6b6b6b]">
//                       Send me wellness tips and exclusive offers
//                     </label>
//                   </div>
//                 </div>
//               )}
              
//               {errors.agreeToTerms && (
//                 <p className="text-xs text-red-500">{errors.agreeToTerms}</p>
//               )}

//               {isLogin && (
//                 <div className="text-right">
//                   <a href="#" className="text-sm text-[#b89b7b] hover:underline">
//                     Forgot password?
//                   </a>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 className="w-full py-4 bg-gradient-to-r from-[#2c2c2c] to-[#3a3a3a] text-white text-sm tracking-wide rounded-lg hover:from-[#b89b7b] hover:to-[#9b7a5a] transition-all duration-300 shadow-lg hover:shadow-xl"
//               >
//                 {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
//               </button>
//             </form>

//             {/* Social Login */}
//             <div className="relative my-8">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-[#f0e7db]"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-[#6b6b6b]">Or continue with</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 type="button"
//                 className="py-3 border border-[#f0e7db] text-[#2c2c2c] hover:border-[#b89b7b] hover:bg-[#faf7f2] transition-all rounded-lg flex items-center justify-center space-x-2"
//               >
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path
//                     fill="currentColor"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 <span className="text-sm">Google</span>
//               </button>
//               <button
//                 type="button"
//                 className="py-3 border border-[#f0e7db] text-[#2c2c2c] hover:border-[#b89b7b] hover:bg-[#faf7f2] transition-all rounded-lg flex items-center justify-center space-x-2"
//               >
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
//                 </svg>
//                 <span className="text-sm">Facebook</span>
//               </button>
//             </div>

//             {/* Sign Up Link for Login View */}
//             {isLogin && (
//               <p className="text-center text-sm text-[#6b6b6b] mt-6">
//                 Don't have an account?{' '}
//                 <button
//                   type="button"
//                   onClick={() => setIsLogin(false)}
//                   className="text-[#b89b7b] hover:underline font-medium"
//                 >
//                   Sign up free
//                 </button>
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//       <br /><br /><br /><br /><br />
//       <Footer/>
//     </>
//   );
// }

// export default Auth;


// pages/Auth.jsx - Updated for JWT authentication
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import MK from "../assets/untitled.png";
import { login, isAuthenticated, getUser, checkAuth } from '../api';

function Auth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in on component mount
  useEffect(() => {
    // Check if user has valid token
    if (isAuthenticated()) {
      const user = getUser();
      if (user?.is_superuser) {
        navigate('/admin/dashboard');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (loginError) setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username required';
    if (!formData.password) newErrors.password = 'Password required';
    return newErrors;
  };

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await login(username, password);
      
      console.log('Login successful:', response);
      
      // After successful login, get user info
      const token = localStorage.getItem('access_token');
      if (token) {
        const userResponse = await fetch('http://localhost:8000/api/user/me/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('User data:', userData);
          
          // Update user info in localStorage
          localStorage.setItem('user', JSON.stringify({
            username: userData.username,
            is_superuser: userData.is_superuser,
            user_id: userData.id,
            isAuthenticated: true
          }));
          
          if (userData.is_superuser) {
            navigate('/admin/dashboard');
          } else {
            setLoginError('Access denied. Admin privileges required.');
            // Clear tokens if not admin
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
          }
        } else {
          setLoginError('Failed to fetch user information');
        }
      } else if (response.is_superuser) {
        // Fallback for backward compatibility
        navigate('/admin/dashboard');
      } else {
        setLoginError('Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('Login error details:', error);
      
      if (error.response?.status === 401) {
        setLoginError('Invalid username or password');
      } else if (error.response?.status === 400) {
        setLoginError(error.response.data?.detail || 'Invalid request');
      } else if (error.response?.data?.detail) {
        setLoginError(error.response.data.detail);
      } else if (error.message === 'Network Error') {
        setLoginError('Cannot connect to server. Please check if backend is running on http://localhost:8000');
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      handleLogin(formData.username, formData.password);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white to-[#fefaf5] flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] flex-col justify-center items-center p-16 relative overflow-hidden">
          {/* Background watermark */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <img src={MK} alt="FlowMart" className="w-3/4 h-auto" />
          </div>

          {/* Foreground content */}
          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-4xl font-semibold text-[#2c2c2c]">
              Admin Portal
            </h2>
            <p className="text-[#9b7a5a] text-lg font-medium">
              Authorized personnel only. Please log in with your admin credentials.
            </p>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 mt-4">
              <p className="text-sm text-[#b89b7b] italic">
                Secure access ensures smooth management of your inventory, orders, and payments.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-2xl mb-6">
                <svg className="w-10 h-10 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-4xl font-light text-[#2c2c2c] mb-3">Admin Login</h2>
              <p className="text-sm text-[#6b6b6b]">Enter your superuser credentials</p>
            </div>

            {loginError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                <p className="text-sm text-red-800">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#b89b7b]/40 group-focus-within:text-[#b89b7b] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-[#f0e7db] focus:border-[#b89b7b] bg-white rounded-xl focus:outline-none transition-all duration-200"
                    placeholder="Enter your username"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
                {errors.username && <p className="mt-2 text-xs text-red-500 animate-fadeIn">{errors.username}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-[#b89b7b]/40 group-focus-within:text-[#b89b7b] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6-4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10 4v-4m-8 4v-4m-2 8h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3.5 border-2 border-[#f0e7db] focus:border-[#b89b7b] bg-white rounded-xl focus:outline-none transition-all duration-200"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#b89b7b]/60 hover:text-[#b89b7b] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-xs text-red-500 animate-fadeIn">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#2c2c2c] to-[#3a3a3a] text-white font-semibold rounded-xl hover:from-[#b89b7b] hover:to-[#9b7a5a] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>AUTHENTICATING...</span>
                  </span>
                ) : (
                  'ACCESS DASHBOARD'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-700 text-center">
                  Use your superuser credentials created with{' '}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">python manage.py createsuperuser</code>
                </p>
              </div>
            )}

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-[#f0e7db] text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-[#6b6b6b]">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6-4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10 4v-4m-8 4v-4m-2 8h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" />
                  </svg>
                  <span>Secure Login</span>
                </span>
                <span className="w-px h-3 bg-[#f0e7db]"></span>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Superuser Only</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default Auth;