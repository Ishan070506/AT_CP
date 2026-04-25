import { motion } from "framer-motion";

export const TypingBubble = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="inline-flex items-center gap-2 rounded-[24px] rounded-bl-md border border-white/60 bg-white/75 px-4 py-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/10"
  >
    <span className="text-sm text-muted">MindBridge AI is typing</span>
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-2 w-2 rounded-full bg-lavender"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1,
            delay: index * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </motion.div>
);
