import { motion } from "framer-motion";
import { AiFillStar, AiOutlineWarning } from "react-icons/ai";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { BiHeart, BiRocket } from "react-icons/bi";
import { RiWifiOffLine } from "react-icons/ri";

const ComingSoonPage = ({
  icon = <AiFillStar className="w-12 h-12 text-white" />,
  title = "Coming Soon!",
  subtitle = "We're working hard to bring you something amazing.",
  emoji = "✨",
  progress = 0,
  bgColors = { from: "blue-50", via: "pink-50", to: "green-50" },
  iconColors = { from: "blue-400", to: "green-400" },
  titleColors = { from: "purple-600", to: "purple-600" },
  accentColor = "indigo",
  statusCard = {
    icon: <HiOutlineEmojiHappy className="w-5 h-5 text-yellow-500" />,
    text: "Stay Tuned!",
  },
}) => {
  // Enhanced Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.6,
      },
    },
  };

  const floatingAnimation = {
    y: [0, -12, 0],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-${bgColors.from} via-${bgColors.via} to-${bgColors.to} flex items-center justify-center p-6`}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-lg w-full"
      >
        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 text-center overflow-hidden relative"
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            scale: 1.02,
            transition: { duration: 0.15, ease: "easeOut" },
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background Decoration */}
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          ></motion.div>
          <motion.div
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          ></motion.div>

          {/* Icon Container */}
          <motion.div variants={itemVariants} className="relative mb-8">
            <motion.div
              animate={floatingAnimation}
              whileHover={{
                scale: 1.15,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.4, ease: "easeInOut" },
              }}
              className={`w-24 h-24 mx-auto mb-2 flex items-center justify-center rounded-full bg-gradient-to-r from-${iconColors.from} to-${iconColors.to} shadow-lg transition-transform duration-300`}
            >
              {icon || <AiFillStar className="w-12 h-12 text-white" />}
            </motion.div>

            {/* Floating stars */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.8],
                rotate: [0, 360, 720],
                y: [0, -10, -20, -30],
              }}
              transition={{
                delay: 0.5,
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 right-1/4 w-6 h-6 text-yellow-400"
            >
              <AiFillStar className="w-full h-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1.1, 0.9],
                rotate: [0, -360, -720],
                y: [0, 5, 10, 15],
              }}
              transition={{
                delay: 1.2,
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-2 left-1/4 w-4 h-4 text-pink-400"
            >
              <AiFillStar className="w-full h-full" />
            </motion.div>
          </motion.div>

          {/* Title with gradient */}
          <motion.h1
            variants={itemVariants}
            className={`text-3xl font-bold mb-3 bg-gradient-to-r from-${titleColors.from} to-${titleColors.to} inline-block text-transparent bg-clip-text`}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-slate-600 text-lg mb-8 leading-relaxed"
          >
            {subtitle} <span className="text-2xl">{emoji}</span>
          </motion.p>

          {/* Enhanced Status Cards */}
          <motion.div variants={itemVariants} className="space-y-4 mb-8">
            <motion.div
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.2)",
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-xl p-4 cursor-pointer"
            >
              <motion.div
                className="flex items-center justify-center space-x-3"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <AiOutlineWarning className="w-5 h-5 text-yellow-600" />
                </motion.div>
                <span className="text-yellow-700 font-medium">
                  Feature Under Construction
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.2)",
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-xl p-4 cursor-pointer"
            >
              <motion.div
                className="flex items-center justify-center space-x-3"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <RiWifiOffLine className="w-5 h-5 text-red-600" />
                </motion.div>
                <span className="text-red-700 font-medium">
                  API Integration Pending
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)",
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-xl p-4 cursor-pointer"
            >
              <motion.div
                className="flex items-center justify-center space-x-3"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <BiRocket className="w-5 h-5 text-blue-600" />
                </motion.div>
                <span className="text-blue-700 font-medium">
                  Launching Very Soon
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div variants={itemVariants} className="mb-10">
            <motion.div
              className="bg-white/30 backdrop-blur-sm rounded-full h-3 w-full mb-3 overflow-hidden"
              animate={pulseAnimation}
            >
              <motion.div
                initial={{ width: 0, x: "-100%" }}
                animate={{
                  width: `${progress}%`,
                  x: 0,
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  delay: 0.5,
                }}
                className={`bg-gradient-to-r from-${iconColors.from} to-${iconColors.to} h-full rounded-full`}
              ></motion.div>
            </motion.div>
            <motion.p
              className="text-sm text-slate-600 font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {progress}% Complete
            </motion.p>
          </motion.div>

          {/* Status Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              y: -3,
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/50 backdrop-blur-md p-5 rounded-xl border border-white/40 shadow-lg transition-all duration-300"
          >
            <motion.div
              className="flex items-center justify-center mb-3"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {statusCard.icon}
              </motion.div>
              <motion.span
                className={`ml-2 font-semibold text-lg text-${accentColor}-600`}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {statusCard.text}
              </motion.span>
            </motion.div>
            <motion.p
              className="text-slate-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              More exciting features are on the way. Thanks for your support!
            </motion.p>

            {/* Hearts */}
            <motion.div
              className="flex items-center justify-center mt-4 space-x-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <BiHeart className="w-5 h-5 text-pink-400" />
              </motion.div>
              <motion.span
                className="text-xs text-slate-500"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Made with love
              </motion.span>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -15, 15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
              >
                <BiHeart className="w-5 h-5 text-pink-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage;
