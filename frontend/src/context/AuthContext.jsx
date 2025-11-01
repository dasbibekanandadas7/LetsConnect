import React, { createContext } from 'react'
export const authDataContext=createContext()

function AuthContext({children}) {
    const serverurl="http://localhost:8000"
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
