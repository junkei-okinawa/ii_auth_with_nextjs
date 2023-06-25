import { useAuth } from '@src/hooks/auth'
import LoggedIn from '@src/ui/components/Auth/LoggedIn'
import LoggedOut from '@src/ui/components/Auth/LoggedOut'

function Page() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <h1>Internet Identity Auth Test App</h1>
      <p>{isAuthenticated ? "Authenticated" : "Not authenticated"}</p>
      <hr />
      {isAuthenticated ? <LoggedIn /> : <LoggedOut />}
    </>
  )
}

export default Page;