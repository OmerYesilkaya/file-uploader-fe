"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token in localStorage
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // TODO: Implement actual login logic
    console.log("Login attempt:", { email, password })

    // Mock successful login
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: email,
      avatar: "/placeholder.svg?height=40&width=40",
    }
    const mockToken = "mock-jwt-token-" + Date.now()

    setUser(mockUser)
    setToken(mockToken)
    localStorage.setItem("token", mockToken)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const signup = async (name: string, email: string, password: string) => {
    // TODO: Implement actual signup logic
    console.log("Signup attempt:", { name, email, password })

    // Mock successful signup
    const mockUser = {
      id: "1",
      name: name,
      email: email,
      avatar: "/placeholder.svg?height=40&width=40",
    }
    const mockToken = "mock-jwt-token-" + Date.now()

    setUser(mockUser)
    setToken(mockToken)
    localStorage.setItem("token", mockToken)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
