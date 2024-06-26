
import { Header } from './Headers/Header'
import { Footer } from './Footers/Footer'

export const Layout=({children})=>{

  return(
    <>
    <Header/>
     {children}
    <Footer/>
    
    </>
  )
}
