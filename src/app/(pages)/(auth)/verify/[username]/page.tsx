import React from "react";

type Props = {
  params: { username: string };
};

export default function page({ params: { username } }: Props) {
  console.log(" ---------------------------------------------");
  console.log("file: page.tsx:8  page  username => ", username);
  console.log(" ---------------------------------------------");

  return <div>page</div>;
}
