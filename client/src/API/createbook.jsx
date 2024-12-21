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
    } 
    else {
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
  const { collaborators, coAuthors, reviewers, ...filteredBookDetails } = updatedIntro;
  console.log(updatedIntro.image);
  if (updatedIntro.image){
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
        bookid: bookID
      };
      const sendcollabinviteResponse = await axios.post(
        `${ToLink}/invitecollaborators`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      const sendcoauthorbinviteResponse = await axios.post(
        `${ToLink}/invitecoauthor`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      const sendreviewerinviteResponse = await axios.post(
        `${ToLink}/invitereviewer`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
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
        bookid: bookID
      };
      const sendinviteResponse = await axios.post(
        `${ToLink}/invitecollaborators`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
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
  const { collaborators, coAuthors, reviewers, ...filteredBookDetails } = bookdata;

  try {
    // Set default image if none is provided
    if (!imageFile) {
      bookdata.image =
        "https://res.cloudinary.com/ddgyxhpwx/image/upload/v1731611566/CloudinaryDemo/No%20Image.jpg.jpg";
    } else {
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadResponse = await axios.post(`${ToLink}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      bookdata.image = uploadResponse.data.fileUrl;
    }

    // Create the book
    const createResponse = await axios.post(
      `${ToLink}/createbook`,
      filteredBookDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const bookId = createResponse.data.data.books._id;
    console.log("Book created with ID:", bookId);

    // Invite collaborators
    if (collaborators && collaborators.length > 0) {
      const collabPayload = { emails: collaborators, bookid: bookId };
      await axios.post(`${ToLink}/invitecollaborators`, collabPayload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Collaborator invites sent.");
    }

    // Invite co-authors
    if (coAuthors && coAuthors.length > 0) {
      const coAuthorPayload = { emails: coAuthors, bookid: bookId };
      await axios.post(`${ToLink}/invitecoauthor`, coAuthorPayload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Co-Author invites sent.");
    }

    // Invite reviewers
    if (reviewers && reviewers.length > 0) {
      const reviewerPayload = { emails: reviewers, bookid: bookId };
      await axios.post(`${ToLink}/invitereviewer`, reviewerPayload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Reviewer invites sent.");
    }

    // Return the created book ID
    return bookId;

  } catch (error) {
    console.error("Error during book creation or invitation sending:", error);
    return null;
  }
};


export const accept = async (invitelink, accessToken,route) => {
  try {
    console.log(`${ToLink}/${route}`);
    console.log(invitelink);
    const response = await axios.post(
      `${ToLink}/${route}`,
      { InviteLink : invitelink},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      console.log("Collaboration accepted successfully:", response.data);
      return true; 
    } else {
      console.error("Failed to accept collaboration:", response.data);
      return false; 
    }
  } catch (error) {
    console.error("Error occurred while accepting invite:", error.message);
    return false;
  }
};

export const remove = async (payload, accessToken,route) => {
  try {
    if (!payload || !payload.mailId || !payload.bookid) {
      console.error("Invalid payload: Missing required fields");
      return false;
    }

    const response = await axios.post(
      `${ToLink}/${route}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

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

export const decline= async (payload, accessToken,route) => {
  console.log("dsf")
  try {
    if (!payload || !payload.InviteLink) {
      console.error("Invalid payload: Missing required fields");
      return false;
    }

    const response = await axios.post(
      `${ToLink}/${route}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
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

export const getbookinfo = async (InviteLink) => {
  try {
    if(!InviteLink){
      console.error("Invalid payload: Missing required fields");
      return false;
    }
    const response = await axios.post(
      `${ToLink}/getbookinfoytoken`,
      { InviteLink : InviteLink}
    );
    if (response.status === 200) {
      return response.data.booktitle;
    } else {
      return false;
    }
  } 
  catch (error) {
    return false;
  }
}