import { useMediaQuery } from 'react-responsive';

export const Desktop = ({ children }) => {
   const isDesktop = useMediaQuery({ minWidth: 768 })
   return isDesktop ? children : null
}
export const Mobile = ({ children }) => {
   const isMobile = useMediaQuery({ maxWidth: 767 })
   return isMobile ? children : null
}

