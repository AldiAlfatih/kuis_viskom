'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  setActiveUser,
  getAllUsers,
  deleteUser,
  validateNIM,
  validatePassword,
  hashPassword,
  verifyPassword,
  getActiveUser,
} from '@/lib/quiz-engine';
import type { UserProfile } from '@/lib/quiz-engine';

type Tab = 'new' | 'existing';

// ===== Password Input Component =====
function PasswordField({
  label, value, onChange, placeholder, error, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; hint?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 6 }}>
        {label} <span style={{ color: 'var(--color-wrong)' }}>*</span>
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          className="input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={64}
          style={{ paddingRight: 44, borderColor: error ? 'var(--color-wrong)' : undefined }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)',
            padding: 4, display: 'flex', alignItems: 'center',
          }}
          title={show ? 'Sembunyikan' : 'Tampilkan'}
        >
          {show ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
      {error && <div style={{ fontSize: '0.8125rem', color: 'var(--color-wrong)', marginTop: 5 }}>{error}</div>}
      {hint && !error && <div style={{ fontSize: '0.78rem', color: 'var(--color-text-4)', marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

// ===== Strength Indicator =====
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum   = /\d/.test(password);
  const hasSpec  = /[^a-zA-Z0-9]/.test(password);
  const score = (len >= 8 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpec ? 1 : 0);

  const levels = [
    { label: 'Lemah',  color: 'var(--color-wrong)' },
    { label: 'Cukup',  color: 'var(--color-diff-medium)' },
    { label: 'Kuat',   color: 'var(--color-correct)' },
    { label: 'Sangat Kuat', color: 'var(--color-correct)' },
  ];
  const level = levels[Math.min(score, 3)];

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score - 1 ? level.color : 'var(--color-border)',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      <div style={{ fontSize: '0.75rem', color: level.color, fontWeight: 500 }}>{level.label}</div>
    </div>
  );
}

// ===== Main Login Page =====
export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('new');
  const [existingUsers, setExistingUsers] = useState<UserProfile[]>([]);

  // Form registrasi
  const [nim, setNim]         = useState('');
  const [name, setName]       = useState('');
  const [password, setPassword]   = useState('');
  const [password2, setPassword2] = useState('');
  const [nimError,  setNimError]  = useState('');
  const [nameError, setNameError] = useState('');
  const [pwError,   setPwError]   = useState('');
  const [pw2Error,  setPw2Error]  = useState('');
  const [loading,   setLoading]   = useState(false);

  // Form login (user lama)
  const [loginNim,    setLoginNim]    = useState('');
  const [loginPw,     setLoginPw]     = useState('');
  const [loginError,  setLoginError]  = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (getActiveUser()) { router.replace('/'); return; }
    const users = getAllUsers();
    setExistingUsers(users);
    if (users.length > 0) setTab('existing');
  }, [router]);

  // ===== REGISTRASI =====
  async function handleRegister() {
    const nimErr  = validateNIM(nim);
    const nameErr = name.trim().length < 2 ? 'Nama minimal 2 karakter.' : '';
    const pwErr   = validatePassword(password);
    const pw2Err  = password !== password2 ? 'Password tidak cocok.' : '';
    setNimError(nimErr ?? '');
    setNameError(nameErr);
    setPwError(pwErr ?? '');
    setPw2Error(pw2Err);
    if (nimErr || nameErr || pwErr || pw2Err) return;

    // Cek NIM sudah terdaftar
    const existing = getAllUsers().find(u => u.nim === nim.trim());
    if (existing) {
      setNimError('NIM ini sudah terdaftar. Silakan masuk.');
      setTab('existing');
      return;
    }

    setLoading(true);
    const passwordHash = await hashPassword(password);
    const profile: UserProfile = {
      nim: nim.trim(),
      name: name.trim(),
      registeredAt: new Date().toISOString(),
      passwordHash,
    };
    setActiveUser(profile);
    router.push('/');
  }

  // ===== LOGIN USER LAMA =====
  function handleSelectUser(user: UserProfile) {
    setSelectedUser(user);
    setLoginNim(user.nim);
    setLoginPw('');
    setLoginError('');
  }

  function handleBackToList() {
    setSelectedUser(null);
    setLoginPw('');
    setLoginError('');
  }

  async function handleLogin() {
    if (!selectedUser) return;
    if (!loginPw) { setLoginError('Masukkan password.'); return; }
    setLoginLoading(true);
    const ok = await verifyPassword(loginPw, selectedUser.passwordHash);
    setLoginLoading(false);
    if (!ok) {
      setLoginError('Password salah.');
      return;
    }
    setActiveUser(selectedUser);
    router.push('/');
  }

  function handleDelete(nim: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Hapus data NIM ${nim}? Seluruh riwayat latihan akan hilang secara permanen.`)) return;
    deleteUser(nim);
    setExistingUsers(prev => prev.filter(u => u.nim !== nim));
    if (selectedUser?.nim === nim) setSelectedUser(null);
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', width: 58, height: 58, background: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-lg)', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            CNN Quiz Trainer
          </h1>
          <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem' }}>
            Latihan kuis CNN — Pengolahan Citra Digital
          </p>
        </div>

        {/* Tab switcher */}
        {existingUsers.length > 0 && (
          <div style={{ display: 'flex', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 18, gap: 4 }}>
            {(['new', 'existing'] as Tab[]).map(t => (
              <button key={t} onClick={() => { setTab(t); setSelectedUser(null); }}
                style={{
                  flex: 1, padding: '9px 0', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  borderRadius: 'calc(var(--radius-md) - 2px)',
                  background: tab === t ? 'var(--color-surface)' : 'transparent',
                  boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                  fontSize: '0.875rem', fontWeight: tab === t ? 600 : 400,
                  color: tab === t ? 'var(--color-text)' : 'var(--color-text-3)',
                  transition: 'all 0.15s ease',
                }}
              >
                {t === 'new' ? 'Daftar Baru' : `Masuk (${existingUsers.length})`}
              </button>
            ))}
          </div>
        )}

        {/* ===== REGISTRASI ===== */}
        {tab === 'new' && (
          <div className="card animate-fade-in" style={{ padding: '28px 28px 32px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 22, color: 'var(--color-text)' }}>
              Registrasi Mahasiswa
            </h2>

            {/* NIM */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 6 }}>
                NIM <span style={{ color: 'var(--color-wrong)' }}>*</span>
              </label>
              <input
                type="text" inputMode="numeric" pattern="\d*" className="input input-mono"
                value={nim}
                onChange={e => { setNim(e.target.value.replace(/\D/g, '')); setNimError(''); }}
                placeholder="9–10 digit angka" maxLength={10} autoFocus
                style={{ borderColor: nimError ? 'var(--color-wrong)' : undefined, letterSpacing: nim ? '0.1em' : undefined }}
              />
              {nimError
                ? <div style={{ fontSize: '0.8125rem', color: 'var(--color-wrong)', marginTop: 5 }}>{nimError}</div>
                : <div style={{ fontSize: '0.78rem', color: 'var(--color-text-4)', marginTop: 5 }}>{nim.length}/10 digit</div>
              }
            </div>

            {/* Nama */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 6 }}>
                Nama Lengkap <span style={{ color: 'var(--color-wrong)' }}>*</span>
              </label>
              <input
                type="text" className="input" value={name}
                onChange={e => { setName(e.target.value); setNameError(''); }}
                placeholder="Nama sesuai KRS" maxLength={60}
                style={{ borderColor: nameError ? 'var(--color-wrong)' : undefined }}
              />
              {nameError && <div style={{ fontSize: '0.8125rem', color: 'var(--color-wrong)', marginTop: 5 }}>{nameError}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 6 }}>
              <PasswordField
                label="Password" value={password}
                onChange={v => { setPassword(v); setPwError(''); }}
                placeholder="Minimal 6 karakter" error={pwError}
                hint="Gunakan kombinasi huruf dan angka."
              />
              <PasswordStrength password={password} />
            </div>

            {/* Konfirmasi Password */}
            <div style={{ marginBottom: 24 }}>
              <PasswordField
                label="Konfirmasi Password" value={password2}
                onChange={v => { setPassword2(v); setPw2Error(''); }}
                placeholder="Ulangi password" error={pw2Err}
              />
            </div>

            <button
              onClick={handleRegister} disabled={loading}
              className="btn btn-primary btn-full" style={{ padding: '12px' }}
            >
              {loading ? 'Memproses...' : 'Daftar & Mulai Latihan →'}
            </button>

            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-4)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
              Password dienkripsi di browser. Tidak ada server.
              <br/>Jika lupa password, data tidak dapat dipulihkan.
            </p>
          </div>
        )}

        {/* ===== LOGIN — PILIH USER ===== */}
        {tab === 'existing' && !selectedUser && (
          <div className="card animate-fade-in" style={{ padding: '24px 24px 28px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 18, color: 'var(--color-text)' }}>
              Pilih Akun
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {existingUsers.map(user => (
                <div key={user.nim} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => handleSelectUser(user)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      border: '1.5px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface)', cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'Inter, sans-serif', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary-muted)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-light)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-2)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--color-surface)';
                    }}
                  >
                    <span style={{
                      width: 38, height: 38, background: 'var(--color-primary-light)', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)',
                      flexShrink: 0, textTransform: 'uppercase',
                    }}>
                      {user.name[0]}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-4)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                        NIM: {user.nim}
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: 'var(--color-text-4)', fontSize: '0.8rem' }}>→</div>
                  </button>
                  <button
                    onClick={e => handleDelete(user.nim, e)} className="btn btn-ghost btn-sm"
                    title="Hapus akun" style={{ padding: '10px', color: 'var(--color-text-4)', flexShrink: 0 }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19,6l-1,14a2,2,0,0,1-2,2H8A2,2,0,0,1,6,20L5,6"/>
                      <path d="M10,11v6M14,11v6"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== LOGIN — MASUKKAN PASSWORD ===== */}
        {tab === 'existing' && selectedUser && (
          <div className="card animate-fade-in" style={{ padding: '28px 28px 32px' }}>
            {/* Back button */}
            <button
              onClick={handleBackToList}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)', fontSize: '0.875rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', padding: 0 }}
            >
              ← Kembali
            </button>

            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, padding: '14px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
              <span style={{
                width: 44, height: 44, background: 'var(--color-primary)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', flexShrink: 0,
              }}>
                {selectedUser.name[0]}
              </span>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>{selectedUser.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-4)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                  NIM: {selectedUser.nim}
                </div>
              </div>
            </div>

            {/* Password input */}
            <div style={{ marginBottom: 20 }}>
              <PasswordField
                label="Password" value={loginPw}
                onChange={v => { setLoginPw(v); setLoginError(''); }}
                placeholder="Masukkan password" error={loginError}
              />
            </div>

            <button
              onClick={handleLogin} disabled={loginLoading}
              className="btn btn-primary btn-full" style={{ padding: '12px' }}
            >
              {loginLoading ? 'Memeriksa...' : 'Masuk →'}
            </button>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-text-4)', marginTop: 20, lineHeight: 1.6 }}>
          Data tersimpan lokal di browser ini · Tidak ada koneksi ke server
        </p>
      </div>
    </div>
  );
}
