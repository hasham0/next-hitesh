"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "../ui/button";

type Props = {};

const Navbar = ({}: Props) => {
  const { data: session } = useSession();
  const user: User = session?.user.email;

  return (
    <div>
      <nav className="bg-gray-900 p-4 text-white shadow-md md:p-6">
        <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
          <a href="#" className="mb-4 text-xl font-bold md:mb-0">
            True Feedback
          </a>
          {session ? (
            <>
              <span className="mr-4">
                Welcome, {user.username || user.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="w-full bg-slate-100 text-black md:w-auto"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                className="w-full bg-slate-100 text-black md:w-auto"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
