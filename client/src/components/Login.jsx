import React from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Login = () => {

    const { 
        setShowLogin, 
        axios, 
        setToken, 
        navigate, 
        setUser, 
        setIsOwner 
    } = useAppContext()

    const [state, setState] = React.useState("login")
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault()

            let url = ''

            //  API routing
            if (state === "login") {
                url = '/api/user/login'
            } else {
                url = '/api/user/register'
            }

            const { data } = await axios.post(url, {
                name,
                email,
                password
            })

            if (data.success) {

                // Save token
                localStorage.setItem('token', data.token)

                // Set axios header
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

                // Update token
                setToken(data.token)

                setUser(data.user)
                setIsOwner(data.user.role === 'owner')

                toast.success(
                    state === "login"
                        ? "Login Successful"
                        : "Account Created Successfully"
                )

                setShowLogin(false)

                if (data.user.role === 'owner') {
                    navigate('/owner')
                } else {
                    navigate('/')
                }

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (
        <div
            onClick={() => setShowLogin(false)}
            className='fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center text-sm text-gray-600 bg-black/50'
        >

            <form
                onSubmit={onSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
            >

                <p className="text-2xl font-medium m-auto">
                    <span className="text-blue-600">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>

                {state === "register" && (
                    <div className="w-full">
                        <p className="mb-1">Name</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="type here"
                            className="border border-gray-200 rounded w-full p-2 outline-blue-600"
                            type="text"
                            required
                        />
                    </div>
                )}

                <div className="w-full">
                    <p className="mb-1">Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 outline-blue-600"
                        type="email"
                        required
                    />
                </div>

                <div className="w-full">
                    <p className="mb-1">Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 outline-blue-600"
                        type="password"
                        required
                    />
                </div>

                {state === "register" ? (
                    <p>
                        Already have account?{" "}
                        <span
                            onClick={() => {
                                setState("login")
                                setName("")
                                setEmail("")
                                setPassword("")
                            }}
                            className="text-blue-600 cursor-pointer"
                        >
                            click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create an account?{" "}
                        <span
                            onClick={() => {
                                setState("register")
                                setName("")
                                setEmail("")
                                setPassword("")
                            }}
                            className="text-blue-600 cursor-pointer"
                        >
                            click here
                        </span>
                    </p>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 transition-all text-white w-full py-2.5 rounded-md cursor-pointer font-medium"
                >
                    {state === "register" ? "Create Account" : "Login"}
                </button>

            </form>
        </div>
    )
}

export default Login