import { ChangeEvent, FormEvent, useState } from "react";
import { useUserStore } from "../../store/userStore";

export const Form = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({
    email: "",
    name: "",
    password: "",
  });
  const {createUser, logInUser, logOutUser} = useUserStore();


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser(user.email, user.password, user.name);
  };

  const handleLogIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logInUser(user.email, user.password);
  };

  return (
    <div className="flex flex-col items-center justify-between">
      <form
        onSubmit={isLogin ? handleLogIn : handleSignIn}
        className="flex flex-col items-center justify-between"
      >
        {!isLogin && (
          <div className="flex flex-col w-fit my-4 min-w-[400px]">
            <label htmlFor="name" className="font-bold text-sm">
              Pseudo
            </label>
            <input
              className="border-2 border-blue-900 rounded mt-2 px-1 h-8"
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
            />
          </div>
        )}

        <div className="flex flex-col w-fit my-4 min-w-[400px]">
          <label htmlFor="email" className="font-bold text-sm">
            Email
          </label>
          <input
            className="border-2 border-blue-900 rounded mt-2 px-1 h-8"
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-fit my-4 min-w-[400px]">
          <label htmlFor="password" className="font-bold text-sm">
            Password
          </label>
          <input
            className="border-2 border-blue-900 rounded mt-2 px-1 h-8"
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-900 text-white px-4 py-3 rounded-lg w-fit"
        >
          {isLogin ? "Se connecter" : "Créer un compte"}
        </button>
      </form>
      <div className="flex items-center justify-center">
      <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="px-4 py-3 text-sm font-bold m-2"
        >
          Se connecter
        </button>
        <p className="font-bold text-sm m-2 uppercase">ou</p>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="px-4 py-3 font-bold text-sm m-2"
        >
          S'inscrire
        </button>
      </div>
    </div>
  );
};
