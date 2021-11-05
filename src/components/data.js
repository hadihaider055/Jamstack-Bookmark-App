import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";

const DataComponent = ({ data, handleDelete, handleEdit }) => {
  return (
    <>
      <div className="p-10 mx-auto h-110 mt-12 ">
        <h1 className="text-center text-4xl font-pacifico mb-6">
          Bookmark List
        </h1>
        <div className="h-96 md:overflow-scroll md:overflow-x-hidden">
          <ul>
            {data.bookmarks.map((bookmark) => (
              <li
                className="leading-10 mt-4 bg-white cursor-pointer hover:shadow-md shadow-sm transition-all duration-500 ease-in-out p-4 rounded-md w-96 flex items-center justify-between"
                key={bookmark.id}
              >
                <div className="w-64 ">
                  <p className="font-nunito font-semibold tracking-wider text-xl">
                    {bookmark.title}
                  </p>
                  <a
                    className="font-opensans text-blue-800 text-sm tracking-wider underline"
                    href={bookmark.url}
                    target="_blank"
                    title="Click to visit!"
                  >
                    {bookmark.url}
                  </a>
                  <p className="font-opensans text-black text-sm tracking-wider">
                    {bookmark.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <AiOutlineDelete
                    className="text-2xl text-red-500 mx-1"
                    title="Delete Bookmark"
                    onClick={() => handleDelete(bookmark.id)}
                  />
                  <FiEdit
                    className="text-xl text-green-600 mx-1"
                    title="Edit Bookmark"
                    onClick={() => handleEdit(bookmark)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default DataComponent;
