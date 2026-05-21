import { useEffect } from "react"
import { useLocation } from "react-router-dom"

function Scroll(){
    const {hash} = useLocation()
    useEffect(()=>{
        if(hash){
            const el = document.getElementById(hash.replace('#',""))
            if(el){
                el.scrollIntoView({behavior:'smooth'})
            }
        }
    },[hash])
    return <></>
}

export default Scroll