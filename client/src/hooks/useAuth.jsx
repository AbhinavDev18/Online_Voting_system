import { useState, useEffect, createContext, useContext } from 'react'
import api from '../api/api'

const AuthContext = createContext()

export function AuthProvider({ children }){
    const auth = useProvideAuth()
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

function useProvideAuth(){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetch = async()=>{
            try{
                const res = await api.get('/admin/me')
                setUser(res.data.user)
            }catch(err){
                try{
                    const res2 = await api.get('/voter/me')
                    if (res2.data.voter) setUser(res2.data.voter)
                    else setUser(null)
                }catch(_){
                    setUser(null)
                }
            }finally{ setLoading(false) }
        }
        fetch()
    },[])

    const logout = async()=>{
        try{ await api.get('/voter/logout') }catch{};
        try{ await api.get('/admin/logout') }catch{};
        setUser(null)
    }

    return { user, setUser, loading, logout }
}
