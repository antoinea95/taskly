import { useEffect } from "react";
import { AuthForm } from "./components/Connection/AuthForm";
import { useAuthStore } from "./store/authStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { Home } from "./pages/Home";
import { Loader } from "./components/ui/loader";
import { Header } from "./components/ui/Header";

function App() {
  // get auth state
  const {user} = useAuthStore();


  // Keeping user logged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        useAuthStore.setState({
          user: user ? user : null,
          status: user ? 'success' : null,
          error: null
        })
    });

    return () => unsubscribe();

  }, [])


  return (
    <main className="w-screen h-screen">
    {!user ? (
        <AuthForm />
      ) : (
        <>
        <Header />
        <Home/>
        </>

      )}
    </main>
  );
}

export default App;