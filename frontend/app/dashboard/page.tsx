import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center flex-col flex-wrap">
        <Image
          src={"/dashboard.svg"}
          className=""
          alt="Dashboard Background flex-wrap flex"
          height={800}
          width={800}
        />
      </div>
    </>
  );
}
