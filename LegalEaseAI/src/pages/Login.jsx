import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let result;
    if (isLoginMode) {
      result = await login(email, password);
    } else {
      result = await register(email, password);
    }

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    const result = await googleLogin(credentialResponse.credential);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const loginColors = {
    gold: '#C9A84C',
    goldLight: '#E4C47A',
    goldDim: '#8B6F2E',
    textMuted: '#7B859E',
    textDim: '#4A5268',
    surface: '#111520',
    border: '#1E2535',
    danger: '#E05252'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 32px',
      maxWidth: '400px',
      margin: '0 auto',
      background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)',
      fontFamily: "'DM Sans', sans-serif",
      color: loginColors.textMuted
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '36px',
        fontWeight: '600',
        background: `linear-gradient(135deg, ${loginColors.goldLight}, ${loginColors.gold})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '12px',
        textAlign: 'center'
      }}>
        LegalEase ⚖️
      </div>
      <div style={{
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '36px',
        maxWidth: '280px'
      }}>
        Secure access to your AI legal platform
      </div>

      <div style={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Log In Failed')}
          theme="filled_black"
          shape="rectangular"
          text="continue_with"
        />
      </div>

      <div style={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '10px 0 24px',
        color: loginColors.textDim,
        fontSize: '12px'
      }}>
        <span style={{flex: 1, height: '1px', background: loginColors.border}}></span>
        <span style={{margin: '0 10px'}}>OR</span>
        <span style={{flex: 1, height: '1px', background: loginColors.border}}></span>
      </div>

      <form style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }} onSubmit={handleSubmit}>
        {error && (
          <div style={{
            background: `rgba(224,82,82,0.15)`,
            border: `1px solid ${loginColors.danger}`,
            color: loginColors.danger,
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email address"
          style={{
            width: '100%',
            padding: '14px 16px',
            background: loginColors.surface,
            border: `1.5px solid ${loginColors.border}`,
            borderRadius: '10px',
            color: '#fff',
            fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif"
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          style={{
            width: '100%',
            padding: '14px 16px',
            background: loginColors.surface,
            border: `1.5px solid ${loginColors.border}`,
            borderRadius: '10px',
            color: '#fff',
            fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif"
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button 
          type="submit" 
          style={{
            padding: '14px',
            background: loginColors.gold,
            color: '#1a1200',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: "'DM Sans', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
          disabled={loading}
        >
          {loading ? 'Processing...' : (isLoginMode ? 'Log In' : 'Sign Up')}
        </button>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '12px',
          color: loginColors.textMuted
        }}>
          <span>{isLoginMode ? "Don't have an account?" : "Already have an account?"}</span>
          <button 
            type="button" 
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }} 
            style={{ 
              background: 'none', border: 'none', color: loginColors.gold, cursor: 'pointer', marginLeft: '6px', fontFamily: "'DM Sans', sans-serif" 
            }}
          >
            {isLoginMode ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
