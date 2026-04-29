import React, { useState } from 'react'
import { fetchData } from '../axios/fetchData'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/store';
// import { setUser } from '../redux/store'


const LoginPage: React.FC = () => {




    let [data, setData] = useState({
        email: '',
        password: ''
    })

    let [code, setCode] = useState('')
    let [isOrgCode, setIsOrgCode] = useState(false)



    const getValue = (e: any) => {

        let { value, name } = e.target

        setData({
            ...data,
            [name]: value
        })



    }

    function next() {
        setIsOrgCode(true)
    }

    function getOrgCode(e: any) {
        let { value } = e.target
        setCode(value)
    }

    let navigate = useNavigate()
    let dispatch = useDispatch()

    const sendData = async (e: any) => {
        e.preventDefault()

        



        let result = await fetchData.post('/staff/login-password', data)

        try {
            if (true) {
     
                dispatch(setUser(result.data.data))

                localStorage.setItem('token', result.data.token)

                navigate('/')
            } else {

            }
        } catch (error) {
            console.log(error);

        }
    }



    return (
        <div className='flex justify-center align-middle items-center h-svh'>

            {
                isOrgCode ?
                    <form action="" className='border-2 rounded-3xl p-6 w-96'>
                        <div className='text-center'>
                            <h1 className='text-2xl font-semibold'>LOGIN</h1>
                        </div>

                        <div className='w-full my-3'>
                            <p className='ms-1 text-gray-500'>Email</p>
                            <input type="email" name="email" id="email" onChange={getValue}
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder=""
                                value={data.email}

                            />
                        </div>
                        <div className='w-full my-3'>
                            <p className='ms-1 text-gray-500'>Password</p>
                            <input type="password" name="password" id="password" onChange={getValue}
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder=""
                                value={data.password}

                            />
                        </div>
                        <div className='w-full mt-7'>
                            <button onClick={sendData} className='w-full border-2
                 border-black p-2 rounded-lg bg-white text-black 
                 hover:bg-black hover:text-white'>LOGIN</button>
                        </div>

                    </form>
                    :
                    <form action="" className='border-2 rounded-3xl p-6 w-96'>

                        <div className='text-center'>
                            <h1 className='text-2xl font-semibold'>ENTER ORGANISATION CODE</h1>
                        </div>

                        <div className='w-full my-3'>
                            <p className='ms-1 text-gray-500'></p>
                            <input type="text" name="org-code" id="org-code" onChange={getOrgCode}
                                className="border-2 w-full p-2 rounded-lg focus:border-black"
                                placeholder=""
                                value={code}

                            />
                        </div>

                        <div className='w-full mt-7'>
                            <button onClick={next} className='w-full border-2
                 border-black p-2 rounded-lg bg-white text-black 
                 hover:bg-black hover:text-white'>SEND</button>
                        </div>

                    </form>
            }

        </div>
    )
}

export default LoginPage