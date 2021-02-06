import React from 'react';
import Link from "next/link";
import {useFetchUser} from "../utils/user";

const Nav = () => {

  const {user, loading} = useFetchUser();
  //console.log(user, loading);

  return (
    <ul className="flex grid grid-cols-4">
      <div className="col-span-1 flex justify-start">
        <li className="mr-6">
          <Link href="/">
            <div className="inline-flex cursor-pointer">
              <img className="sm:h-10 h-8 pr-1" src="/logo.png" alt="Logo"/>
              <a className="p-2 text-center block hover:to-blue-700 sm:visible invisible" href="">Prism</a>
            </div>
          </Link>
        </li>
      </div>

      <div className="col-span-3 flex justify-end">
        {user
          ? (<li className="sm:mr-6">
            <Link href="/saved-articles">
              <a href="" className="p-2 text-center block hover:to-blue-700 text-blue-500">
                Saved Article
              </a>
            </Link>
          </li>)
          : null}
        <li className="sm:mr-6">
          <Link href="/bundles">
            <a href="" className="p-2 text-center block hover:to-blue-700 text-blue-500">
              Bundles
            </a>
          </Link>
        </li>
        <li className="sm:mr-6">
          <Link href="/feeds">
            <a href="" className="p-2 text-center block hover:to-blue-700 text-blue-500">
              Feeds
            </a>
          </Link>
        </li>
        {
          user && !loading
            ? (<li className="sm:mr-6">
              <Link href="/api/logout">
                <a href="" className="p-2 text-center block hover:to-blue-700 text-blue-500">
                  Logout
                </a>
              </Link>
            </li>)
            : (<li className="sm:mr-6"><Link href="/api/login">
              <a href="" className="p-2 text-center block hover:to-blue-700 text-blue-500">
                Login
              </a>
            </Link>
            </li>)
        }
      </div>
    </ul>
  );
};

export default Nav;