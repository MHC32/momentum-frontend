import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../redux/slices/authSlice'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  // ✅ REDIRECTION IMMÉDIATE après succès
  useEffect(() => {
    if (isSuccess) {
      navigate('/dashboard', { replace: true })
    }
  }, [isSuccess, navigate])

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await dispatch(login(formData))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-momentum-light-2 to-momentum-accent rounded-2xl mb-4">
            <span className="text-3xl font-bold text-momentum-dark">M</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-momentum-light-2 to-momentum-light-3 bg-clip-text text-transparent">
            Momentum
          </h1>
          <p className="text-gray-400 mt-2">Connecte-toi à ton compte</p>
        </div>

        <div className="glass-card p-8">
          {isError && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              {message || "Erreur de connexion"}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="input-field"
                placeholder="ton@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                className="input-field"
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mb-4 disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div className="text-center">
              <p className="text-gray-400">
                Pas de compte?{' '}
                <Link to="/register" className="text-momentum-light-2 hover:underline">
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login