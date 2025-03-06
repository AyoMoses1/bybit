import { cn } from "@/lib/utils";

const Loader = ({
  divClassName,
  parentClassName,
  beadCount = 5,
}: {
  divClassName?: string;
  parentClassName?: string;
  beadCount?: number;
}) => {
  return (
    <div className={cn("grid w-full p-6", parentClassName)}>
      <div className="loader">
        {Array.from({ length: beadCount }).map((_, index) => (
          <div
            key={`bead${_}-${index}`}
            style={{ animationDelay: `${index * 0.2}s` }}
            className={cn(
              "m-2 inline-block size-4 scale-0 animate-bead rounded-full",
              divClassName,
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
