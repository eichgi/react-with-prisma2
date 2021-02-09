import React from 'react';
import {User} from '@prisma/client';
import {Question} from "./svg";

const ProfilePic = ({author}: { author: User }) => {
  return (
    <>
      {author.picture
        ? (
          <div>
            <img src={author.picture} alt="author picture" className="rounded-full p-0.5 w-8 border-2 border-gray-300"/>
          </div>
        )
        : (<Question className="w-6 h-6 text-gray-500"/>)}
        <p>{author.nickname}</p>
    </>
  );
};

export default ProfilePic;