import { useAuth } from "@src/hooks/auth";

function LoggedIn() {
  const { logout } = useAuth();

  return (
    <div className="container">
      <h1>Internet Identity Client</h1>
      <h2>You are authenticated!</h2>
      <p>To see how a canister views you, click this button!</p>
      <button id="logout" onClick={logout}>
        log out
      </button>
    </div>
  );
}

export default LoggedIn;