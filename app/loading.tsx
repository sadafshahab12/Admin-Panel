import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen space-x-2">
      <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-0 animate-fadeInOut"></div>
      <div className="w-5 h-5 rounded-full bg-slate-800 opacity-0 animate-fadeInOut200"></div>
      <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-0 animate-fadeInOut400"></div>
    </div>
  );
};

export default Loading;
