import { Home } from "./pages/Home";
import { Header } from "./components/ui/Header";
import { AuthForm } from "./components/Connection/AuthForm";
import { useAuth } from "./firebase/authHook";

function App() {
  const {currentUser} = useAuth();

  return (
       <main className="w-screen h-screen">
       { currentUser ? <>
          <Header />
          <Home />
        </> : <AuthForm />}
      </main>
  );
}

export default App;
