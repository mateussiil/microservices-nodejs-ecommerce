import { FormEventHandler, useState } from "react";
import { useAuth } from '../provider/AuthProvider';
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const errorEmail = false;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const user = await login(credentials);

    if(!!user) navigate('/');
  }
  
  return (
    <div className="bg-white">
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
            <div className="">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                onChange={e => {
                  const email = e.target.value;
                  setCredentials(cred => {
                    return {...cred, email }
                  })
                }}
                id="email"
                className={`${errorEmail ? 'focus:border-red-400' : 'focus:border-purple-400'} rounded-md border ${errorEmail ? 'border-red-600' : 'border-slate-600'} w-full p-2.5 py-3 px-4 text-gray-900 outline-none transition placeholder:text-slate-400`}
                placeholder="email@example.com"
                type="email"
                required
              />
            </div>
            <div className="">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                onChange={e => {
                  const password = e.target.value;
                  setCredentials(cred => {
                    return { ...cred, password }
                  })
                }}
                className="focus:border-purple-400 rounded-md border border-slate-600 w-full p-2.5 py-3 px-4 text-gray-900 outline-none transition placeholder:text-slate-400"
                placeholder="••••••••"
                type="password"
                id="password"
                required
              />
            </div>
            <button
              // className="mr-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 border border-slate-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Sign in to your account
            </button>
            <p className="text-sm font-light text-gray-500">
              Don’t have an account yet? {''}
              <a
                href="/auth/signup"
                className="font-medium text-primary-600 hover:underline">
                Sign up here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div >
  )
}

export default SignIn;
