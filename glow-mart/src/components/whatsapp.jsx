// components/WhatsAppButton.jsx - Always visible version
import React, { useState, useEffect } from 'react';

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // WhatsApp configuration
  const whatsappNumber = "254704040171"; // Kenya format without leading 0
  const whatsappMessage = "Hello Glowmart! I have a question about your products. Could you please assist me?";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  
  // Show tooltip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes whatsappPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
            transform: scale(1);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .whatsapp-float {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
          animation: slideInRight 0.3s ease-out;
        }
        
        .whatsapp-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #25D366, #128C7E);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          position: relative;
        }
        
        .whatsapp-button:hover {
          transform: scale(1.1) translateY(-5px);
          box-shadow: 0 8px 30px rgba(37, 211, 102, 0.4);
        }
        
        .whatsapp-button.pulse {
          animation: whatsappPulse 1.5s ease-in-out;
        }
        
        .whatsapp-icon {
          width: 32px;
          height: 32px;
          fill: white;
        }
        
        /* Tooltip */
        .whatsapp-tooltip {
          position: absolute;
          right: 75px;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          color: #1a1714;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          font-family: 'Jost', sans-serif;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid #f0e7db;
          animation: tooltipFadeIn 0.3s ease-out;
          z-index: 1001;
          letter-spacing: 0.3px;
        }
        
        .whatsapp-tooltip::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid white;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
        }
        
        .whatsapp-tooltip::before {
          content: '';
          position: absolute;
          right: -7px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 7px solid #f0e7db;
          border-top: 7px solid transparent;
          border-bottom: 7px solid transparent;
          z-index: -1;
        }
        
        /* Badge for unread messages (optional) */
        .whatsapp-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4444;
          color: white;
          font-size: 10px;
          font-weight: bold;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Jost', sans-serif;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .whatsapp-float {
            bottom: 20px;
            right: 20px;
          }
          
          .whatsapp-button {
            width: 50px;
            height: 50px;
          }
          
          .whatsapp-icon {
            width: 26px;
            height: 26px;
          }
          
          .whatsapp-tooltip {
            display: none;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .whatsapp-tooltip {
            background: #2c2c2c;
            color: #e8ddd3;
            border-color: #4a4a4a;
          }
          
          .whatsapp-tooltip::after {
            border-left-color: #2c2c2c;
          }
          
          .whatsapp-tooltip::before {
            border-left-color: #4a4a4a;
          }
        }
      `}</style>
      
      <div className="whatsapp-float">
        {/* Tooltip */}
        {showTooltip && (
          <div className="whatsapp-tooltip">
            💬 Chat with us on WhatsApp!
          </div>
        )}
        
        {/* WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`whatsapp-button ${isHovered ? 'pulse' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Chat on WhatsApp"
        >
          <svg 
            className="whatsapp-icon" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12.032 2.004c-5.524 0-10 4.476-10 10 0 1.764.46 3.5 1.336 5.02l-1.44 4.988 5.136-1.324c1.464.796 3.12 1.224 4.832 1.224 5.524 0 10-4.476 10-10s-4.476-10-10-10zm0 18.392c-1.484 0-2.932-.4-4.192-1.152l-.3-.176-3.048.784.808-2.972-.196-.312c-.856-1.32-1.308-2.856-1.308-4.44 0-4.584 3.728-8.312 8.312-8.312s8.312 3.728 8.312 8.312-3.728 8.312-8.312 8.312zm4.56-6.228c-.248-.124-1.464-.724-1.692-.804-.228-.084-.392-.124-.56.124-.168.248-.652.804-.8.968-.148.164-.296.184-.544.06-.248-.124-1.048-.388-1.996-1.236-.736-.66-1.236-1.476-1.38-1.724-.144-.248-.016-.384.108-.508.108-.108.248-.28.372-.42.124-.14.164-.24.248-.4.084-.16.04-.3-.02-.42-.06-.12-.56-1.352-.764-1.848-.2-.484-.404-.412-.556-.416-.144-.004-.308-.004-.476-.004-.168 0-.44.064-.672.324-.232.26-.884.864-.884 2.104 0 1.24.904 2.436 1.032 2.604.124.168 1.78 2.728 4.316 3.824.604.26 1.072.416 1.44.532.604.192 1.152.164 1.584.1.484-.072 1.464-.596 1.672-1.176.208-.58.208-1.076.144-1.18-.064-.104-.236-.168-.484-.292z"/>
          </svg>
          
          {/* Optional: Badge for unread messages */}
          {/* <span className="whatsapp-badge">1</span> */}
        </a>
      </div>
    </>
  );
};

export default WhatsAppButton;