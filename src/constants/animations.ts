import { Variants } from "framer-motion";

export const formVariants: Variants = {
  enter: (direction: number) => ({
    position: "absolute",
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    zIndex: 0,
  }),
  center: {
    position: "relative",
    x: 0,
    opacity: 1,
    zIndex: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    position: "absolute",
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    zIndex: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};
