export function Light({ isServerLive }: { isServerLive: boolean }) {
  const loading =
    "bg-orange-500 border-orange-600 shadow-orange-500 shadow-[0px_3px_55px_20px] animate-pulse-fast";
  const live =
    "bg-green-500 border-green-600 shadow-green-500 shadow-[0px_3px_55px_20px]";

  const lightStyle = () => {
    if (isServerLive) {
      return live;
    } else {
      return loading;
    }
  };

  return (
    <div
      className={`${lightStyle()} -mt-[3px] h-5 w-4 rounded-t-full hover:cursor-pointer transition-all`}
    ></div>
  );
}
