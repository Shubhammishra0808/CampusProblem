import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, User, Phone, Building, ArrowRight, CheckCircle2, LogIn, ArrowLeft, Sparkles } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    rollNumber: '',
    phone: '',
    hostelBlock: '',
    roomNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Auto redirect to Login page on registration
  useEffect(() => {
    let timer;
    if (registeredUser && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (registeredUser && countdown === 0) {
      navigate('/login', {
        state: {
          registeredEmail: registeredUser.email || formData.email,
          registeredRole: registeredUser.role || formData.role,
          successMessage: registeredUser.role === 'teammember'
            ? 'Team Member registration submitted! Your account is pending admin approval. You can sign in once approved.'
            : '🎉 Registration successful! Please log in with your email and password.'
        }
      });
    }
    return () => clearTimeout(timer);
  }, [registeredUser, countdown, navigate, formData]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Set autoLogin=false so registration does not bypass the login screen
      const data = await register(formData, false);
      if (data && data.user) {
        setRegisteredUser(data.user);
        setCountdown(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login', {
      state: {
        registeredEmail: registeredUser?.email || formData.email,
        registeredRole: registeredUser?.role || formData.role,
        successMessage: '🎉 Registration successful! Please log in with your email and password.'
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1120] p-4 sm:p-6 lg:p-8 relative transition-colors duration-300">
      
      {/* Top Floating Back to Sign In Link */}
      <div className="absolute top-6 left-6 hidden sm:block">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#151e32] text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-brand-500 transition"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      <div className="page-animate max-w-xl w-full bg-white dark:bg-[#151e32] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-8 relative">

        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Create CampusFix Account</h1>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  by Team Shubham
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Join your engineering college problem solver portal</p>
            </div>
          </div>

          <Link
            to="/login"
            className="sm:hidden text-xs font-bold text-brand-600 hover:underline"
          >
            Sign In
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. yourname@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="student">🧑‍🎓 Student</option>
                <option value="faculty">🎓 Faculty Member</option>
                <option value="staff">🛠️ Maintenance Staff</option>
                <option value="hod">🏛️ Department Head (HOD)</option>
                <option value="teammember">⚡ Team Member (Superior Authority - Admin Approval Required)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone (For OTP Login)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                maxLength={10}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          {formData.role === 'teammember' && (
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold">Superior Team Member Role Selected</p>
                <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-0.5">
                  Team Members possess higher administrative powers than faculty (supervising tickets & assigning staff). For security, this account requires direct approval by the Campus Administrator before login is activated.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Roll / Emp ID</label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="22CS045"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hostel Block</label>
              <input
                type="text"
                name="hostelBlock"
                value={formData.hostelBlock}
                onChange={handleChange}
                placeholder="Boys Hostel 1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Room No.</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="BH-302"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <span>Already registered with an account?</span>
          <Link to="/login" className="font-extrabold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Login Page</span>
          </Link>
        </div>

      </div>

      {/* ================= POST-REGISTRATION SUCCESS MODAL ================= */}
      {registeredUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-8 border border-slate-200 dark:border-slate-700 shadow-2xl text-center space-y-6">
            
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              {registeredUser.role === 'teammember' ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
                    <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    Team Member Request Submitted (Pending Approval)
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    Registration Received, {registeredUser.name}!
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Your <span className="font-bold text-purple-600">Core Team Member</span> account has been created and is waiting for direct approval by the Campus Administrator.
                  </p>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Account Created Successfully!
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    Welcome, {registeredUser.name}!
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Your <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{registeredUser.role}</span> account ({registeredUser.email}) has been registered with CampusFix.
                  </p>
                </>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/60 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{registeredUser.department}</span>
              </div>
              {registeredUser.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile Phone:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">+91 {registeredUser.phone}</span>
                </div>
              )}
              {registeredUser.role === 'teammember' && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                  <span>Status:</span>
                  <span>Pending Admin Approval</span>
                </div>
              )}
            </div>

            {/* Automatic Redirect Banner & Action Button */}
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-300 text-xs font-bold flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Redirecting to Login page in <span className="font-extrabold text-brand-600 dark:text-brand-400 text-sm">{countdown}</span> seconds...</span>
              </div>

              <button
                type="button"
                onClick={handleGoToLogin}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                <LogIn className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Go to Login Page Now</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Register;
