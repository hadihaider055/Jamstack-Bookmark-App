import React from "react";
import swal from "sweetalert";

const EditAlert = () => {
  swal("Write something here:", {
    content: "input",
  }).then((value) => {
    swal(`You typed: ${value}`);
  });
  return <div></div>;
};

export default EditAlert;
