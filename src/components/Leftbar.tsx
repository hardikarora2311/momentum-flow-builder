import React from "react";

const Leftbar = () => {
  return (
    <div className="w-16 bg-[#363636] flex flex-col items-center py-5">
      <img src="/logo.svg" alt="logo" className="cursor-pointer" />
      <div className="flex flex-col justify-between items-center h-full pt-10">
        <div className="text-white space-y-10 text-2xl ">
          <img src="/menu.svg" className="cursor-pointer" />
          <img src="/history.svg" className="cursor-pointer" />
          <img src="/stack.svg" className="cursor-pointer" />
          <img src="/git.svg" className="cursor-pointer" />
        </div>
        <img src="/profile.svg" className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Leftbar;
