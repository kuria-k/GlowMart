// // components/NewsletterPopup.jsx
// // Requires: react-hot-toast
// // Uses Anthropic API + Gmail MCP to send real confirmation emails

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';

// const SENDER_EMAIL = 'me'; // Gmail MCP sends from your connected Gmail

// const sendRealEmail = async (toEmail) => {
//   const response = await fetch('https://api.anthropic.com/v1/messages', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       model: 'claude-sonnet-4-20250514',
//       max_tokens: 1000,
//       mcp_servers: [
//         {
//           type: 'url',
//           url: 'https://gmail.mcp.claude.com/mcp',
//           name: 'gmail-mcp',
//         },
//       ],
//       messages: [
//         {
//           role: 'user',
//           content: `Send a welcome email to ${toEmail} using Gmail. 

// Subject: Welcome! Here's your 10% off 🎉

// Body (HTML):
// <!DOCTYPE html>
// <html>
// <body style="font-family: Georgia, serif; background: #0a0a0a; color: #fff; padding: 40px; max-width: 600px; margin: 0 auto;">
//   <div style="text-align: center; margin-bottom: 32px;">
//     <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 4px; color: #f8e8ff; text-transform: uppercase; margin: 0;">Welcome to the Community</h1>
//     <div style="width: 60px; height: 1px; background: linear-gradient(90deg, #c084fc, #f472b6); margin: 20px auto;"></div>
//   </div>

//   <p style="color: #d1b7e8; font-size: 16px; line-height: 1.8; text-align: center;">
//     You're officially part of something beautiful. As a thank you for joining, here's your exclusive discount:
//   </p>

//   <div style="background: linear-gradient(135deg, rgba(192,132,252,0.15), rgba(244,114,182,0.15)); border: 1px solid rgba(192,132,252,0.3); border-radius: 16px; padding: 32px; text-align: center; margin: 32px 0;">
//     <p style="color: #c4b5fd; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 12px;">Your Exclusive Code</p>
//     <p style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #f8e8ff; margin: 0; font-family: monospace;">BEAUTY10</p>
//     <p style="color: #a78bfa; font-size: 13px; margin: 12px 0 0; letter-spacing: 1px;">10% OFF YOUR FIRST ORDER</p>
//   </div>

//   <p style="color: #9d7ab8; font-size: 13px; text-align: center; line-height: 1.8;">
//     Use this code at checkout. Valid for 30 days. Cannot be combined with other offers.
//   </p>

//   <div style="border-top: 1px solid rgba(192,132,252,0.2); margin-top: 40px; padding-top: 24px; text-align: center;">
//     <p style="color: #6b5080; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">With love,<br/>The Beauty Team</p>
//   </div>
// </body>
// </html>

// Send it now as an HTML email.`,
//         },
//       ],
//     }),
//   });

//   if (!response.ok) {
//     const err = await response.json().catch(() => ({}));
//     throw new Error(err?.error?.message || 'Failed to send email');
//   }

//   const data = await response.json();
//   return data;
// };

// // Floating orbs background
// const Orbs = () => (
//   <div className="orbs-container" aria-hidden="true">
//     <div className="orb orb-1" />
//     <div className="orb orb-2" />
//     <div className="orb orb-3" />
//   </div>
// );

// const NewsletterPopup = ({ isOpen, onClose }) => {
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       requestAnimationFrame(() => setVisible(true));
//     } else {
//       setVisible(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || loading) return;
//     setLoading(true);

//     try {
//       await sendRealEmail(email);
//       localStorage.setItem('newsletterShown', 'true');
//       setSubmitted(true);
//       toast.success('Check your inbox — magic incoming ✨', { duration: 5000 });
//       setTimeout(() => onClose(), 4000);
//     } catch (err) {
//       console.error(err);
//       toast.error('Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

//         .nl-backdrop {
//           position: fixed; inset: 0; z-index: 9998;
//           background: rgba(5, 3, 12, 0.72);
//           backdrop-filter: blur(8px);
//           opacity: 0; transition: opacity 0.4s ease;
//         }
//         .nl-backdrop.visible { opacity: 1; }

//         .nl-card-wrap {
//           position: fixed; inset: 0; z-index: 9999;
//           display: flex; align-items: center; justify-content: center;
//           pointer-events: none;
//         }

//         .nl-card {
//           position: relative;
//           width: 100%; max-width: 440px; margin: 0 16px;
//           background: rgba(255,255,255,0.05);
//           border: 1px solid rgba(255,255,255,0.12);
//           border-radius: 28px;
//           backdrop-filter: blur(40px) saturate(1.8);
//           -webkit-backdrop-filter: blur(40px) saturate(1.8);
//           box-shadow:
//             0 0 0 1px rgba(192,132,252,0.15),
//             0 32px 80px rgba(0,0,0,0.6),
//             inset 0 1px 0 rgba(255,255,255,0.12),
//             inset 0 -1px 0 rgba(192,132,252,0.08);
//           pointer-events: all;
//           transform: translateY(32px) scale(0.97);
//           opacity: 0;
//           transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease;
//           overflow: hidden;
//         }
//         .nl-card.visible {
//           transform: translateY(0) scale(1);
//           opacity: 1;
//         }

//         .nl-top-glow {
//           position: absolute; top: 0; left: 50%; transform: translateX(-50%);
//           width: 280px; height: 2px;
//           background: linear-gradient(90deg, transparent, #c084fc, #f472b6, #c084fc, transparent);
//           border-radius: 2px;
//         }

//         .nl-inner { padding: 48px 40px 40px; }

//         .nl-icon-wrap {
//           width: 72px; height: 72px; margin: 0 auto 24px;
//           background: linear-gradient(135deg, rgba(192,132,252,0.2), rgba(244,114,182,0.2));
//           border: 1px solid rgba(192,132,252,0.3);
//           border-radius: 20px;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 32px;
//           box-shadow: 0 0 32px rgba(192,132,252,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
//           animation: float 4s ease-in-out infinite;
//         }
//         @keyframes float {
//           0%,100% { transform: translateY(0); }
//           50% { transform: translateY(-6px); }
//         }

//         .nl-headline {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 32px; font-weight: 300; font-style: italic;
//           color: #f8e8ff;
//           text-align: center; margin: 0 0 8px;
//           line-height: 1.2;
//           letter-spacing: 0.5px;
//         }
//         .nl-sub {
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13px; font-weight: 300;
//           color: rgba(200,180,230,0.7);
//           text-align: center; margin: 0 0 32px;
//           letter-spacing: 0.3px; line-height: 1.6;
//         }

//         .nl-badge {
//           display: flex; align-items: center; justify-content: center; gap: 8px;
//           background: rgba(192,132,252,0.12);
//           border: 1px solid rgba(192,132,252,0.25);
//           border-radius: 100px; padding: 8px 20px;
//           margin: 0 auto 28px; width: fit-content;
//         }
//         .nl-badge-dot {
//           width: 6px; height: 6px; border-radius: 50%;
//           background: #c084fc;
//           box-shadow: 0 0 8px #c084fc;
//           animation: pulse 2s ease-in-out infinite;
//         }
//         @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
//         .nl-badge-text {
//           font-family: 'DM Sans', sans-serif;
//           font-size: 11px; font-weight: 500; letter-spacing: 2px;
//           text-transform: uppercase; color: #c084fc;
//         }

//         .nl-input-wrap { position: relative; margin-bottom: 12px; }
//         .nl-input {
//           width: 100%; padding: 15px 20px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.12);
//           border-radius: 14px;
//           font-family: 'DM Sans', sans-serif; font-size: 14px;
//           color: #f0e8ff; outline: none;
//           transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
//           box-sizing: border-box;
//         }
//         .nl-input::placeholder { color: rgba(180,160,210,0.45); }
//         .nl-input:focus {
//           border-color: rgba(192,132,252,0.5);
//           background: rgba(192,132,252,0.07);
//           box-shadow: 0 0 0 3px rgba(192,132,252,0.1);
//         }

//         .nl-btn {
//           width: 100%; padding: 16px;
//           background: linear-gradient(135deg, #9333ea, #db2777);
//           border: none; border-radius: 14px; cursor: pointer;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13px; font-weight: 500; letter-spacing: 2px;
//           text-transform: uppercase; color: #fff;
//           position: relative; overflow: hidden;
//           transition: opacity 0.2s, transform 0.15s;
//           box-shadow: 0 4px 24px rgba(147,51,234,0.35);
//         }
//         .nl-btn::before {
//           content: '';
//           position: absolute; inset: 0;
//           background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
//           pointer-events: none;
//         }
//         .nl-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 32px rgba(147,51,234,0.45); }
//         .nl-btn:active:not(:disabled) { transform: translateY(0); }
//         .nl-btn:disabled { opacity: 0.6; cursor: not-allowed; }

//         .nl-spinner {
//           display: inline-block; width: 14px; height: 14px;
//           border: 2px solid rgba(255,255,255,0.3);
//           border-top-color: #fff; border-radius: 50%;
//           animation: spin 0.7s linear infinite;
//           vertical-align: middle; margin-right: 8px;
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .nl-legal {
//           font-family: 'DM Sans', sans-serif;
//           font-size: 10px; letter-spacing: 0.3px;
//           color: rgba(150,120,180,0.5);
//           text-align: center; margin-top: 20px; line-height: 1.6;
//         }

//         .nl-close {
//           position: absolute; top: 18px; right: 18px;
//           width: 32px; height: 32px; border-radius: 50%;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.1);
//           color: rgba(200,180,230,0.6);
//           font-size: 14px; cursor: pointer;
//           display: flex; align-items: center; justify-content: center;
//           transition: background 0.2s, color 0.2s;
//         }
//         .nl-close:hover { background: rgba(255,255,255,0.1); color: #f8e8ff; }

//         /* Success state */
//         .nl-success { text-align: center; padding: 12px 0; }
//         .nl-success-icon {
//           font-size: 56px; margin-bottom: 20px;
//           display: block;
//           animation: pop 0.5s cubic-bezier(0.16,1.5,0.3,1);
//         }
//         @keyframes pop { 0%{transform:scale(0);} 100%{transform:scale(1);} }
//         .nl-success-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 30px; font-weight: 300; font-style: italic;
//           color: #f8e8ff; margin: 0 0 8px;
//         }
//         .nl-success-sub {
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13px; color: rgba(200,180,230,0.65);
//           margin: 0; line-height: 1.6;
//         }
//         .nl-code-chip {
//           display: inline-block;
//           background: rgba(192,132,252,0.15);
//           border: 1px solid rgba(192,132,252,0.3);
//           border-radius: 8px; padding: 8px 18px;
//           font-family: monospace; font-size: 18px; letter-spacing: 4px;
//           color: #e9d5ff; margin: 20px 0 0;
//         }

//         .orbs-container {
//           position: fixed; inset: 0; z-index: 9997; pointer-events: none;
//           overflow: hidden;
//         }
//         .orb {
//           position: absolute; border-radius: 50%;
//           filter: blur(80px); opacity: 0.4;
//           animation: drift 12s ease-in-out infinite;
//         }
//         .orb-1 {
//           width: 400px; height: 400px;
//           background: radial-gradient(circle, #7c3aed, transparent 70%);
//           top: -100px; left: -100px;
//           animation-delay: 0s;
//         }
//         .orb-2 {
//           width: 350px; height: 350px;
//           background: radial-gradient(circle, #db2777, transparent 70%);
//           bottom: -80px; right: -80px;
//           animation-delay: -4s;
//         }
//         .orb-3 {
//           width: 250px; height: 250px;
//           background: radial-gradient(circle, #4f46e5, transparent 70%);
//           bottom: 20%; left: 30%;
//           animation-delay: -8s;
//         }
//         @keyframes drift {
//           0%,100% { transform: translate(0,0) scale(1); }
//           33% { transform: translate(30px,-20px) scale(1.05); }
//           66% { transform: translate(-20px,30px) scale(0.95); }
//         }
//       `}</style>

//       <Orbs />

//       <div className={`nl-backdrop ${visible ? 'visible' : ''}`} onClick={onClose} />

//       <div className="nl-card-wrap">
//         <div className={`nl-card ${visible ? 'visible' : ''}`}>
//           <div className="nl-top-glow" />

//           <button className="nl-close" onClick={onClose} aria-label="Close">✕</button>

//           <div className="nl-inner">
//             {!submitted ? (
//               <>
//                 <div className="nl-icon-wrap">💌</div>

//                 <div className="nl-badge">
//                   <div className="nl-badge-dot" />
//                   <span className="nl-badge-text">Exclusive Members Only</span>
//                 </div>

//                 <h2 className="nl-headline">Unlock Your Beauty Ritual</h2>
//                 <p className="nl-sub">
//                   Join thousands who wake up to curated beauty secrets,<br />
//                   first-access drops, and an instant 10% off — just for you.
//                 </p>

//                 <form onSubmit={handleSubmit}>
//                   <div className="nl-input-wrap">
//                     <input
//                       type="email"
//                       className="nl-input"
//                       placeholder="your@email.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       disabled={loading}
//                     />
//                   </div>

//                   <button type="submit" className="nl-btn" disabled={loading}>
//                     {loading && <span className="nl-spinner" />}
//                     {loading ? 'Sending your gift…' : 'Claim My 10% Off →'}
//                   </button>
//                 </form>

//                 <p className="nl-legal">
//                   No spam. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.
//                 </p>
//               </>
//             ) : (
//               <div className="nl-success">
//                 <span className="nl-success-icon">✨</span>
//                 <h2 className="nl-success-title">Welcome to the Club</h2>
//                 <p className="nl-success-sub">
//                   Your 10% off code is on its way to <strong style={{ color: '#c084fc' }}>{email}</strong>.
//                   <br />Check your inbox — it arrives in seconds.
//                 </p>
//                 <div className="nl-code-chip">BEAUTY10</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NewsletterPopup;