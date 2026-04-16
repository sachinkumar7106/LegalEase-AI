import { useState } from 'react';
import { useAuth } from '../contexts/useAuth.js';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const isSignup = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = isSignup
      ? await signup(name, email, password)
      : await login(email, password);

    if (!result.success) {
      setError(result.error || 'Something went wrong');
    }

    setLoading(false);
  };

  const colors = {
    gold: '#C9A84C',
    goldLight: '#E4C47A',
    text: '#E8E9EE',
    textMuted: '#7B859E',
    textDim: '#4A5268',
    surface: '#111520',
    border: '#1E2535',
    borderMid: '#2A3349',
    danger: '#E05252',
    bg: '#0B0E14',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      background: `radial-gradient(circle at top, rgba(201,168,76,0.08), transparent 42%), linear-gradient(180deg, #0B0E14 0%, #0E121A 100%)`,
      color: colors.text,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(17,21,32,0.92)',
        border: `1px solid ${colors.border}`,
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '38px',
            fontWeight: 600,
            background: `linear-gradient(135deg, ${colors.goldLight}, ${colors.gold})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            LegalEase
          </div>
          <div style={{ fontSize: '14px', color: colors.textMuted, marginTop: '8px' }}>
            {isSignup ? 'Create an account to save your work in MongoDB' : 'Sign in to continue to your workspace'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', padding: '4px', background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '12px' }}>
          <button
            type='button'
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              background: mode === 'login' ? colors.gold : 'transparent',
              color: mode === 'login' ? '#1a1200' : colors.textMuted,
              fontWeight: 600,
            }}
          >
            Sign in
          </button>
          <button
            type='button'
            onClick={() => setMode('signup')}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              background: mode === 'signup' ? colors.gold : 'transparent',
              color: mode === 'signup' ? '#1a1200' : colors.textMuted,
              fontWeight: 600,
            }}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {error && (
            <div style={{
              background: 'rgba(224,82,82,0.12)',
              border: `1px solid ${colors.danger}`,
              color: colors.danger,
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          {isSignup && (
            <input
              type='text'
              placeholder='Full name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                color: colors.text,
                outline: 'none',
                fontSize: '14px',
              }}
            />
          )}

          <input
            type='email'
            placeholder='Email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              color: colors.text,
              outline: 'none',
              fontSize: '14px',
            }}
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              color: colors.text,
              outline: 'none',
              fontSize: '14px',
            }}
          />

          <button
            type='submit'
            disabled={loading}
            style={{
              marginTop: '6px',
              padding: '14px',
              background: colors.gold,
              color: '#1a1200',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create account' : 'Log in')}
          </button>
        </form>

        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '13px', color: colors.textMuted }}>
          {isSignup ? (
            <button
              type='button'
              onClick={() => setMode('login')}
              style={{ background: 'none', border: 'none', color: colors.goldLight, cursor: 'pointer', padding: 0 }}
            >
              Already have an account? Sign in
            </button>
          ) : (
            <button
              type='button'
              onClick={() => setMode('signup')}
              style={{ background: 'none', border: 'none', color: colors.goldLight, cursor: 'pointer', padding: 0 }}
            >
              New here? Create an account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
