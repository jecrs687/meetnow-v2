import {
    FaHome, FaUser, FaMapSigns, FaFire, FaPlus
} from 'react-icons/fa'
import { ROUTES } from './ROUTES'
export const NAVBAR = [
    {
        icon: FaHome,
        label: 'Home',
        url: ROUTES.HOME()
    },
    {
        icon: FaMapSigns,
        label: 'Maps',
        url: ROUTES.MAP()
    },
    {
        icon: FaFire,
        label: 'Trending',
        url: ROUTES.FIRE()
    },
    {
        icon: FaPlus,
        label: 'Create',
        url: ROUTES.PLACE("clxn1y8ft00011392bhy3q6ul")
    },
    {
        icon: FaUser,
        label: 'Profile',
        url: ROUTES.PROFILE()
    },

]