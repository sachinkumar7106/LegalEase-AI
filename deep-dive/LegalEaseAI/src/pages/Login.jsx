import { useState } from 'react';
import { useAuth } from '../contexts/useAuth.js';
import { Button } from '../components/ui/Button';

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

  return (
    <div className="min-h-screen flex text-foreground font-sans items-center justify-center p-6 bg-background bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.08),transparent_50%)]">
      <div className="w-full max-w-[460px] bg-card/90 border border-border rounded-[20px] p-9 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="font-serif text-[38px] font-semibold bg-gradient-to-br from-primary to-primary/80 bg-clip-text text-transparent inline-block">
            LegalEase
          </div>
          <div className="text-sm text-muted-foreground mt-2 font-medium">
            {isSignup ? 'Create an account to save your work in MongoDB' : 'Sign in to continue to your workspace'}
          </div>
        </div>

        <div className="flex gap-2 mb-8 p-1.5 bg-background border border-border rounded-xl">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {isSignup && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3.5 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/60"
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3.5 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/60"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3.5 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/60"
          />

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="mt-2 w-full text-[15px] font-semibold h-12 rounded-xl"
          >
            {loading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create account' : 'Log in')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isSignup ? (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-primary/90 hover:text-primary font-medium transition-colors"
            >
              Already have an account? Sign in
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-primary/90 hover:text-primary font-medium transition-colors"
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
