type LoaderType = {
    color: string,
    size: string
}



export const Loader = ({data} : {data:LoaderType}) => {
  return (
    <div
      className={`animate-spin inline-block size-${data.size} border-[2px] border-current border-t-transparent text-${data.color} rounded-full`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
