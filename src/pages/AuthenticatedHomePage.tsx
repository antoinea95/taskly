import { HomeSkeleton } from '@/components/skeletons.tsx';
import { useAuth } from '@/firebase/authHook.tsx';
import { redirect } from 'react-router-dom';
import LazyHomePage from './LazyHomePage';


function AuthenticatedHomePage(){
  const { currentUser, isLoading } = useAuth();

  // Si l'utilisateur est en cours de chargement, affichez un écran de chargement
  if (isLoading) {
    return <HomeSkeleton />;
  }

  // Si l'utilisateur n'est pas authentifié, vous pouvez gérer cela ici (par exemple, rediriger)
  if (!currentUser) {
    redirect("/login"); // Rediriger vers une page de connexion ou autre
  }

  return <LazyHomePage />;
};

export default AuthenticatedHomePage;

