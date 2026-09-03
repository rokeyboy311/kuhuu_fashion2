import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'Min 2 characters'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-surface-muted)' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: '#fff', padding: '2.5rem', border: '1px solid var(--color-border)' }}>
        <Link
          to="/"
          className="text-display"
          style={{ display: 'block', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '2rem' }}
        >
          Kuhuu
        </Link>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, marginBottom: '0.5rem', textAlign: 'center' }}>
          Create Account
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
          Join the Kuhuu community
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label" htmlFor="reg-first-name">First Name</label>
              <input {...register('firstName')} type="text" id="reg-first-name" className={`input ${errors.firstName ? 'error' : ''}`} placeholder="Jane" />
              {errors.firstName && <p className="field-error">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="reg-last-name">Last Name</label>
              <input {...register('lastName')} type="text" id="reg-last-name" className={`input ${errors.lastName ? 'error' : ''}`} placeholder="Doe" />
              {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="reg-email">Email</label>
            <input {...register('email')} type="email" id="reg-email" className={`input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="reg-phone">Phone (optional)</label>
            <input {...register('phone')} type="tel" id="reg-phone" className="input" placeholder="+91 XXXXX XXXXX" />
          </div>

          <div>
            <label className="label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPwd ? 'text' : 'password'}
                id="reg-password"
                className={`input ${errors.password ? 'error' : ''}`}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                id="reg-toggle-pwd"
                style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
            id="register-submit-btn"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-text-primary)', textDecoration: 'underline' }}>
              Sign in
            </Link>
          </p>
        </div>

        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '1rem' }}>
          By creating an account you agree to our{' '}
          <Link to="/terms" style={{ textDecoration: 'underline' }}>Terms</Link> and{' '}
          <Link to="/privacy-policy" style={{ textDecoration: 'underline' }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
