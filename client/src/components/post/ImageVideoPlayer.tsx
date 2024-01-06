const ImageVideoPlayer = ({ src }: { src?: string | undefined }) => {
  if (!src) {
    return <></>;
  }

  return (
    <div className=" pt-[10px] max-w-full">
      {src?.includes("video") ? (
        <video src={src} height={400} width={400} controls />
      ) : (
        <img
          className="max-w-[100%] h-[300px] min-h-[200px] object-cover rounded-[10px]"
          src={src}
        />
      )}
    </div>
  );
};

export default ImageVideoPlayer;
