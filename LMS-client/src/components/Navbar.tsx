import { useSelector } from 'react-redux'
import logo from '../assets/futuralabs-logo.png'
import { useNavigate } from 'react-router-dom'
import DropDown from './DropDown'
import ThemeToggle from './ThemeToggle'



let Navbar: React.FC = () => {

  let user = useSelector((state: any) => state.user.value)

  let navigate = useNavigate()
  return (
    <>
      <nav data-aos="fade-down">

        <div className="flex flex-row justify-between border-2 rounded-xl p-3 items-cente">
          <div className="">
            <img src={logo} alt="futuralabs_logo" className='w-32 sm:w-40' />
          </div>
          {/* <div className="w-full sm:flex-[3] text-center">
            <input className="border border-black focus:outline-none px-3 rounded-lg h-9 w-4/5 sm:2/3" type="search" placeholder="Search" />
          </div> */}
          <div className="flex gap-4 justify-center md:justify-end">
            {
              user ?
                // <div className='flex items-center gap-2 border border-purple-500 p-1 rounded-lg w-32 justify-center'>
                //   <img className="size-9 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""></img>
                //   <h1 className='font-semibold text-lg'>{user?.firstName}</h1>
                // </div>
                <DropDown user={user} />
                :
                null
            }

            {/* <div>
              <ThemeToggle />
            </div> */}

          </div>



        </div>

      </nav>
    </>
  )
}

export default Navbar