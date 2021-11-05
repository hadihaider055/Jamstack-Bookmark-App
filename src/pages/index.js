import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import DataComponent from "../components/data";
import ErrorComponent from "../components/error";
import LoadingComponent from "../components/loading";
import LoaderSvg from "../components/loaderSvg";

const Home = () => {
  const [bookmarkData, setBookmarkData] = useState({
    id: "",
    title: "",
    url: "",
    description: "",
  });
  const [toggleBtn, setToggleBtn] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);

  const [createBookmark] = useMutation(ADD_BOOKMARK);
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK);
  const [editBookmark] = useMutation(EDIT_BOOKMARK);

  const addBookmark = async (e) => {
    e.preventDefault();

    if (toggleBtn === false) {
      setBtnDisable(true);
      const data = await createBookmark({
        variables: {
          title: bookmarkData.title,
          url: bookmarkData.url,
          description: bookmarkData.description,
        },
        refetchQueries: [{ query: GET_BOOKMARKS }],
      });
      if (data) setBtnDisable(false);
    } else {
      setBtnDisable(true);
      const data = await editBookmark({
        variables: {
          id: bookmarkData.id,
          title: bookmarkData.title,
          url: bookmarkData.url,
          description: bookmarkData.description,
        },
        refetchQueries: [{ query: GET_BOOKMARKS }],
      });
      if (data) setBtnDisable(false);
    }
    setBookmarkData({
      title: "",
      url: "",
      description: "",
    });
    setToggleBtn(false);
  };

  const handleDelete = (id) => {
    deleteBookmark({
      variables: { id },
      refetchQueries: [{ query: GET_BOOKMARKS }],
    });
  };

  const handleEdit = (bookmark) => {
    setBookmarkData({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
    });
    setToggleBtn(true);
  };

  const { loading, error, data } = useQuery(GET_BOOKMARKS);

  if (loading) return <LoadingComponent />;

  if (error) return <ErrorComponent />;

  return (
    <>
      <div className="flex justify-between  mx-auto h-screen w-screen mt-10 md:mt-0 flex-wrap">
        <div className="shadow-lg p-10 bg-white h-110 mt-24 mx-auto">
          <h1 className="text-center text-4xl font-pacifico m-3">
            Bookmark App
          </h1>
          <div className="mt-10 mx-auto text-center">
            <form onSubmit={addBookmark}>
              <input
                type="text"
                className="border block w-72 p-2 rounded-sm border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 shadow-sm my-2 bg-transparent font-montserrat tracking-wider"
                placeholder="Title"
                onChange={(e) =>
                  setBookmarkData({ ...bookmarkData, title: e.target.value })
                }
                value={bookmarkData.title}
              />
              <input
                type="url"
                className="border block w-72 p-2 rounded-sm border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 shadow-sm my-2 bg-transparent font-montserrat tracking-wider"
                placeholder="Url"
                onChange={(e) =>
                  setBookmarkData({ ...bookmarkData, url: e.target.value })
                }
                value={bookmarkData.url}
              />
              <textarea
                className="border block w-72 p-2 rounded-sm border-purple-700 focus:outline-none focus:ring-1 h-24 resize-none focus:ring-purple-700 shadow-sm my-2 bg-transparent font-montserrat tracking-wider"
                placeholder="Description"
                onChange={(e) =>
                  setBookmarkData({
                    ...bookmarkData,
                    description: e.target.value,
                  })
                }
                value={bookmarkData.description}
              />
              <button
                type="submit"
                className=" block w-72 p-2 rounded-sm bg-purple-700 text-white hover:bg-purple-800 hover:shadow-lg transition-all duration-500 ease-in-out  focus:outline-none focus:ring-1 focus:ring-purple-700 shadow-sm my-2 bg-transparent font-montserrat tracking-wider"
                disabled={btnDisable}
              >
                {toggleBtn ? "Edit" : "Create"}
                {btnDisable ? <LoaderSvg /> : ""}
              </button>
            </form>
          </div>
        </div>
        <div className="border border-gray-300 mt-32 h-96 rounded-lg"></div>
        <DataComponent
          data={data}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </div>
    </>
  );
};

export default Home;

const GET_BOOKMARKS = gql`
  {
    bookmarks {
      id
      title
      description
      url
    }
  }
`;

const ADD_BOOKMARK = gql`
  mutation createBookmark(
    $title: String!
    $url: String!
    $description: String!
  ) {
    createBookmark(title: $title, url: $url, description: $description) {
      title
      description
      url
    }
  }
`;

const DELETE_BOOKMARK = gql`
  mutation deleteBookmark($id: ID!) {
    deleteBookmark(id: $id) {
      id
    }
  }
`;

const EDIT_BOOKMARK = gql`
  mutation editBookmark(
    $id: ID!
    $title: String!
    $url: String!
    $description: String!
  ) {
    editBookmark(id: $id, title: $title, url: $url, description: $description) {
      id
      title
      description
      url
    }
  }
`;
