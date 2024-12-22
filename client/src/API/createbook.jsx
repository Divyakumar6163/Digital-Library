import axios from "axios";
// import { store } from "./../store/store";
// import * as bookactions from "./../store/actions/bookinfoactions";
import { ToLink } from "../App";
import { notify } from "../store/utils/notify";
// import { useNavigate } from "react-router";

export const createbook = async (bookinfo) => {
  // console.log(bookinfo)
  const chaptersObject = bookinfo.reduce((acc, chapter, index) => {
    acc[`chapter${index + 1}`] = chapter;
    return acc;
  }, {});
  console.log(chaptersObject);
};
export const deleteBook = async (bookId) => {
  console.log(bookId);
  try {
    const response = await axios.delete(`${ToLink}/deletebook/${bookId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status === 200) {
      console.log("success", "Book deleted successfully");
      return true;
    } else {
      console.log("error", "Failed to delete book");
      return false;
    }
  } catch (error) {
    console.error(
      "Error occurred while deleting book:",
      error.response ? error.response.data : error.message
    );
    console.log("error", "Failed to delete book");
    return false;
  }
};

export const updatePublish = async (bookID, data) => {
  try {
    const response = await axios.patch(
      `${ToLink}/publishbook/${bookID}`,
      { ispublished: data },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      console.log("Book published successfully", response.data);
      return true;
    } else {
      console.error("Failed to publish book", response.data);
      return false;
    }
  } catch (error) {
    console.error(
      "Error occurred while publishing book:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};

export const updateChapters = async (bookID, updatedChapters) => {
  console.log(updatedChapters);
  try {
    const response = await axios.patch(
      `${ToLink}/updatebook/${bookID}`,
      { chapters: updatedChapters, modifiedDate: Date.now() }
      // {
      //     headers: {
      //         'Content-Type': 'application/json',
      //         'Authorization': `Bearer ${localStorage.getItem('token')}`
      //     }
      // }
    );

    if (response.status === 200) {
      console.log("Chapters updated successfully", response.data);
      return true;
    } else {
      console.error("Failed to update chapters:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error occurred while updating chapters:", error);
    return false;
  }
};
export const updateIntro = async (bookID, updatedIntro, accessToken) => {
  const { collaborators, coAuthors, reviewers, ...filteredBookDetails } =
    updatedIntro;
  console.log(updatedIntro.image);
  if (updatedIntro.image) {
    try {
      const formData = new FormData();
      formData.append("image", updatedIntro.image);
      const uploadResponse = await axios.post(`${ToLink}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const image = await uploadResponse.data.fileUrl;
      updatedIntro.image = image;
      const response = await axios.patch(
        `${ToLink}/updateintro/${bookID}`,
        updatedIntro
        // {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${localStorage.getItem('token')}`
        //     }
        // }
      );
      const payload = {
        emails: updatedIntro.collaborators,
        bookid: bookID,
      };
      const sendcollabinviteResponse = await axios.post(
        `${ToLink}/invitecollaborators`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Intro updated successfully", response.data);
        return true;
      } else {
        console.error("Failed to update Intro:", response.data);
        return false;
      }
    } catch (error) {
      console.error("Error occurred while updating intro:", error);
      return false;
    }
  } else {
    try {
      const response = await axios.patch(
        `${ToLink}/updateintro/${bookID}`,
        updatedIntro
        // {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${localStorage.getItem('token')}`
        //     }
        // }
      );
      const payload = {
        emails: updatedIntro.collaborators,
        bookid: bookID,
      };
      const sendinviteResponse = await axios.post(
        `${ToLink}/invitecollaborators`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Intro updated successfully", response.data);
        return true;
      } else {
        console.error("Failed to update Intro:", response.data);
        return false;
      }
    } catch (error) {
      console.error("Error occurred while updating intro:", error);
      return false;
    }
  }
};
export const getbookbyID = async (bookID) => {
  try {
    const response = await axios.get(`${ToLink}/book/${bookID}`);
    if (response.status === 200) {
      console.log(
        "Book fetched successfully",
        response.data.data.book.chapters
      );
      return response.data.data.book;
    } else {
      console.error("Failed to fetch book:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error occurred while fetching book:", error);
    return null;
  }
};

export const createBook = async (imageFile, bookdata, accessToken) => {
  console.log(bookdata);
  const { collaborators, coAuthors, reviewers, ...filteredBookDetails } =
    bookdata;
  if (!imageFile) {
    bookdata.image =
      "https://res.cloudinary.com/ddgyxhpwx/image/upload/v1731611566/CloudinaryDemo/No%20Image.jpg.jpg";
    try {
      const createResponse = await axios.post(
        `${ToLink}/createbook`,
        filteredBookDetails,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const payload = {
        emails: bookdata.collaborators,
        bookid: createResponse.data.data.books._id,
      };
      const sendinviteResponse = await axios.post(
        `${ToLink}/invitecollaborators`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(createResponse.data.data.books);
      const id = createResponse.data.data.books._id;
      // notify("Book created!");
      return id;
    } catch (error) {
      console.error("There was an error:", error);
      // notify("Error while creating book");
      return null;
    }
  } else {
    console.log(imageFile);
    const formData = new FormData();
    formData.append("image", imageFile);
    console.log(formData);

    try {
      const uploadResponse = await axios.post(`${ToLink}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const bookinfo = {
        ...filteredBookDetails,
        image: uploadResponse.data.fileUrl,
      };
      console.log(bookinfo);
      console.log(accessToken);
      const createResponse = await axios.post(
        `${ToLink}/createbook`,
        bookinfo,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const payload = {
        emails: bookdata.collaborators,
        bookid: createResponse.data.data.books._id,
      };
      const sendinviteResponse = await axios.post(
        `${ToLink}/invitecollaborators`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(createResponse.data.data.books);
      const id = createResponse.data.data.books._id;
      // notify("Book created!");
      return id;
    } catch (error) {
      console.error("There was an error:", error);
      // notify("Error while creating book");
      return null;
    }
  }
};

export const accept = async (invitelink, accessToken, route) => {
  try {
    console.log(`${ToLink}/${route}`);
    console.log(invitelink);
    const response = await axios.post(
      `${ToLink}/acceptcollab`,
      { InviteLink: invitelink },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      console.log("Collaboration accepted successfully:", response.data);
      return response.data;
    } else {
      console.error("Failed to accept collaboration:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error occurred while accepting invite:", error.message);
    return false;
  }
};

export const remove = async (payload, accessToken, route) => {
  try {
    if (!payload || !payload.mailId || !payload.bookid) {
      console.error("Invalid payload: Missing required fields");
      return false;
    }

    const response = await axios.post(`${ToLink}/removecollab`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      console.log("Collaborator removed successfully:", response.data.message);
      return true;
    } else {
      console.error("Failed to remove collaborator:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("Error occurred while removing collaborator:", error.message);
    return false;
  }
};
export const getbookinfo = async (InviteLink) => {
  try {
    if (!InviteLink) {
      console.error("Invalid payload: Missing required fields");
      return false;
    }
    const response = await axios.post(`${ToLink}/getbookinfoytoken`, {
      InviteLink: InviteLink,
    });
    if (response.status === 200) {
      return response.data.booktitle;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
export const decline = async (payload, accessToken, route) => {
  console.log("dsf");
  try {
    if (!payload || !payload.InviteLink) {
      console.error("Invalid payload: Missing required fields");
      return false;
    }

    const response = await axios.post(`${ToLink}/${route}`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 200) {
      console.log("Invitation declined successfully:", response.data.message);
      return true;
    } else {
      console.error("Failed to decline invitation:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("Error occurred while declining invitation:", error.message);
    return false;
  }
};
