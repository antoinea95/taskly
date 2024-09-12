type LoaderType = {
  color: string;
  size: string;
};

export const Loader = ({ data }: { data: LoaderType }) => {
  return (
    <div
      className="animate-spin inline-block border-[2px] border-current border-t-transparent rounded-full"
      role="status"
      aria-label="loading"
      style={{
        width: data.size,
        height: data.size,
        borderColor: data.color,
        borderTopColor: 'transparent', // pour l'effet de spin
      }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};