import { useTheme } from "@/utils/helpers/hooks/useThemeContext";

type LoaderType = {
  color: string;
  size: string;
};

export const Loader = ({ data }: { data: LoaderType }) => {

  const {theme} = useTheme();

  return (
    <div
      className="animate-spin inline-block border-[2px] border-current border-t-transparent rounded-full"
      role="status"
      aria-label="loading"
      style={{
        width: data.size,
        height: data.size,
        borderColor: !theme ? data.color : data.color === "white" ? "dark" : "white",
        borderTopColor: 'transparent', // pour l'effet de spin
      }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};