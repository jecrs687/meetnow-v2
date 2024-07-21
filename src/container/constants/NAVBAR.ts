import {
    FaHome, FaUser, FaMapSigns, FaFire, FaPlus
} from 'react-icons/fa'
import { ROUTES } from './ROUTES'
import { MdGroups2 } from 'react-icons/md'
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
        icon: MdGroups2,
        label: 'Groups',
        url: ROUTES.GROUPS()
    },
    {
        icon: FaUser,
        label: 'Profile',
        url: ROUTES.PROFILE()
    },

]