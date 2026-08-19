import { Menu } from "lucide-react"

const Navbar=({onMenuClick})=>{

    return(

        <nav className="flex items-center border-b bg-white px-4 sm:px-6 h-16">

            <button type="button" onClick={onMenuClick} className="mr-3 p-2 rounded-md hover:bg-gray-100 lg:hidden">
                <Menu size={22}/>
            </button>

            <h1 className="text-lg font-semibold text-gray-800">
                Bank Account Management
            </h1>

        </nav>

    )
}

export default Navbar;