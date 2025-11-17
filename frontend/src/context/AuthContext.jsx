import React, { createContext } from 'react'
export const authDataContext=createContext()

function AuthContext({children}) {
    const serverurl="https://letsconnect-fullstack-backend.onrender.com"
    const value={
       serverurl
    }
  return (
          <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>         
  )
}

export default AuthContext
