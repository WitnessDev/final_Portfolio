import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Lock, Mail, ArrowLeft, ShieldCheck, AlertCircle, KeyRound, LogIn } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToPublic: () => void;
}

const AUTHORIZED_ADMIN_EMAIL = 'honestygeorge35@gmail.com';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToPublic }) => {
  const [email, setEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const targetAdminUid = import.meta.env.VITE_ADMIN_UID;

    setLoading(true);

    try {
      // Authenticate via Firebase Auth
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      } catch (signInErr: any) {
        // If user account is not registered yet in Firebase Auth, create it for the master admin
        if ((signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') && cleanEmail === AUTHORIZED_ADMIN_EMAIL) {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          } catch (createErr: any) {
            throw signInErr; // rethrow initial signin error
          }
        } else {
          throw signInErr;
        }
      }

      // Check UID restriction if configured
      if (targetAdminUid && userCredential.user.uid !== targetAdminUid) {
        await auth.signOut();
        setError(`Access Denied: User UID (${userCredential.user.uid}) is not authorized.`);
        return;
      }

      onLoginSuccess();
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect password or credentials entered. Access denied.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Admin account not found in Firebase Auth.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const targetAdminUid = import.meta.env.VITE_ADMIN_UID;

      if (targetAdminUid && result.user.uid !== targetAdminUid) {
        await auth.signOut();
        setError(`Access Denied: Logged-in Google account (${result.user.email}) UID does not match authorized admin UID.`);
      } else if (result.user.email?.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL && !targetAdminUid) {
        await auth.signOut();
        setError(`Access Denied: Logged-in Google account (${result.user.email}) is not authorized.`);
      } else {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0E] text-white flex flex-col justify-center items-center px-4 py-12 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0D0D0E]/90 to-[#0D0D0E] pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToPublic}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-[#EED98A] transition cursor-pointer font-mono"
        >
          <ArrowLeft size={16} />
          <span>Public Website</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-sm p-6 sm:p-8 relative z-10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#EED98A]/10 border border-[#EED98A]/30 flex items-center justify-center mx-auto text-[#EED98A]">
            <ShieldCheck size={24} />
          </div>
          <p className="text-[10px] font-mono tracking-widest text-[#EED98A] uppercase font-bold">
            HONESTY VISUALS CMS
          </p>
          <h2 className="text-2xl font-display font-bold text-white">
            Master Admin Portal
          </h2>
          <p className="text-xs text-neutral-400">
            Protected CMS portal for <span className="text-[#EED98A] font-mono font-bold">{AUTHORIZED_ADMIN_EMAIL}</span>
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Mail size={13} className="text-[#EED98A]" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="honestygeorge35@gmail.com"
              className="w-full bg-neutral-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-[#EED98A] transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Lock size={13} className="text-[#EED98A]" />
              <span>Admin Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-neutral-950 border border-white/15 rounded p-3 text-xs text-white focus:outline-none focus:border-[#EED98A] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EED98A] text-[#0D0D0E] font-bold text-xs uppercase tracking-widest py-3.5 rounded hover:bg-white transition flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
          >
            {loading ? (
              <span className="inline-block animate-pulse">Authenticating Master Credentials...</span>
            ) : (
              <>
                <KeyRound size={16} /> Enter Dashboard
              </>
            )}
          </button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-neutral-900 px-3 text-[10px] font-mono text-neutral-500 uppercase">
            OR
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-neutral-950 border border-white/15 hover:border-white/30 text-white font-bold text-xs uppercase tracking-wider py-3 rounded transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn size={15} className="text-[#EED98A]" />
          <span>Sign In with Google</span>
        </button>

        <div className="pt-4 border-t border-white/10 text-center text-[11px] text-neutral-500 font-mono">
          🔒 Protected access only for {AUTHORIZED_ADMIN_EMAIL}.
        </div>
      </div>
    </div>
  );
};


