import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function ShopifyLogin() {
  const navigate = useNavigate();
  const [shopDomain, setShopDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!shopDomain) {
        throw new Error('Please enter your shop domain');
      }

      // Ensure the shop domain ends with .myshopify.com
      let formattedShop = shopDomain.trim().toLowerCase();
      if (!formattedShop.includes('.myshopify.com')) {
        formattedShop = formattedShop.replace('.myshopify.com', '') + '.myshopify.com';
      }

      // Redirect to Shopify OAuth
      window.location.href = `/auth?shop=${formattedShop}`;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="gradient-overlay"></div>
      <div className="floating-accent"></div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <img 
                src="/logos/splitfinrow.png" 
                alt="Splitfin" 
                className="logo-image"
              />
            </div>
            <h2 className="login-title">Connect Your Shopify Store</h2>
            <p className="login-subtitle">Enter your Shopify store domain to get started</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <span>{error}</span>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="shop" className="form-label">Shop Domain</label>
              <div className="input-container">
                <input
                  id="shop"
                  type="text"
                  placeholder="yourstore.myshopify.com"
                  value={shopDomain}
                  onChange={e => setShopDomain(e.target.value)}
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>
              <p className="form-help">Enter your shop domain (e.g., yourstore or yourstore.myshopify.com)</p>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="button-loader">
                    <span>⟳</span>
                  </div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>Connect to Shopify</span>
                  <svg className="button-arrow" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="help-text">
              This will redirect you to Shopify to authorize the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}