import { useEffect } from "react";
import { Form } from "./components/Connection/Form";
import { useUserStore } from "./store/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";

function App() {
  const { user, status, logOutUser} = useUserStore();

  useEffect(() => {
    console.log('exe')
    useUserStore.setState({status: 'loading'});
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        useUserStore.setState({
          user: user ? user : null,
          status: user ? 'success' : null,
          error: null
        })
    });

    return () => unsubscribe();

  }, [])


  return (
    <main className="w-screen h-screen flex items-center justify-center">
      {status === "loading" ? (
        <p>Loading...</p> // Afficher un indicateur de chargement pendant que l'état est en cours de détermination
      ) : !user ? (
        <Form />
      ) : (
        <div className="flex flex-col">
        <p>Welcome, {user.displayName}</p>
        <button onClick={logOutUser} className="bg-blue-200">Déconnexion</button>
        </div>

      )}
    </main>
  );
}

export default App;