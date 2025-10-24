import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import clsx from "clsx";

const buttonVariants = ({ variant = "default", size = "default" }) => {
  const base =
    "inline-flex items-center justify-center cursor-pointer rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-1";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-500",
    muted: "bg-gray-300 text-gray-800",
    destructive: "bg-red-600 text-white hover:bg-red-500",
    outline: "border border-gray-300 bg-white hover:bg-gray-100",
    secondary: "bg-green-600 text-white hover:bg-green-500",
    ghost: "bg-transparent hover:bg-gray-100",
  };
  const sizeClasses = {
    default: "h-10 px-4 text-base",
    sm: "h-8 px-3 text-sm",
    md: "h-12 px-5 text-lg",
    lg: "h-14 px-6 text-xl",
  };
  return clsx(base, variantClasses[variant], sizeClasses[size]);
};

export function CopyButton({
  content,
  className,
  size,
  variant,
  delay = 3000,
  onClick,
  onCopy,
  isCopied: isCopiedProp,
  onCopyChange,
  ...props
}) {
  const [localIsCopied, setLocalIsCopied] = useState(isCopiedProp || false);

  useEffect(() => {
    setLocalIsCopied(isCopiedProp || false);
  }, [isCopiedProp]);

  const handleIsCopied = useCallback(
    (copied) => {
      setLocalIsCopied(copied);
      onCopyChange?.(copied);
    },
    [onCopyChange]
  );

  const handleCopy = useCallback(
    (e) => {
      if (localIsCopied) return;
      if (content) {
        navigator.clipboard
          .writeText(content)
          .then(() => {
            handleIsCopied(true);
            setTimeout(() => handleIsCopied(false), delay);
            onCopy?.(content);
          })
          .catch((err) => console.error("Error copying text", err));
      }
      onClick?.(e);
    },
    [localIsCopied, content, delay, onClick, onCopy, handleIsCopied]
  );

  const Icon = localIsCopied ? Check : Copy;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx(buttonVariants({ variant, size }), className)}
      onClick={handleCopy}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={localIsCopied ? "check" : "copy"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Icon />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}