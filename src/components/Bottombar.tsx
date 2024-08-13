import React from "react";

const Bottombar = () => {
  return (
    <div className="bg-[#363636] text-[#BDBDBD] p-2 flex items-center border-b-0 border border-[#595858]">
      <span className="mr-2">
        cart <img src="/poly.svg" className="inline" />{" "}
      </span>
      <span className="mr-2">
        cart_routes.py <img src="/poly.svg" className="inline" />{" "}
      </span>
      <span>POST /carts/{"{cart_id}"}</span>
    </div>
  );
};

export default Bottombar;
