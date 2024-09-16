import axios from "axios";
// import Swal from "sweetalert2";
import { useEffect } from "react";
const API_URL = "https://mysoftway.com/eventreg/webservice.php";

// Upload Thumbnail
export const uploadThumbnail = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_URL}?action=insertimg`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.imgurl;
  } catch (error) {
    // Swal.fire({
    //   icon: "error",
    //   title: "Upload Failed",
    //   text: "Failed to upload thumbnail.",
    // });
    console.error("Error uploading thumbnail:", error);

    throw error;
  }
};
// Upload Event Attachment
export const uploadEventAttachment = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_URL}?action=insertimg`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.imgurl;
  } catch (error) {
    // Swal.fire({ icon: "error",
    //   title: "Upload Failed",
    //   text: "Failed to upload event attachment.",
    // });
    console.error("Error uploading event attachment:", error);
    throw error;
  }
};
// Upload Event Banner
export const uploadEventBanner = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_URL}?action=insertimg`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.result == "1") {
      return response.data.imgurl;
    }
  } catch (error) {
    // Swal.fire({
    //   icon: "error",
    //   title: "Upload Failed",
    //   text: "Failed to upload event banner.",
    // });
    console.error("Error uploading event banner:", error);

    throw error;
  }
};
export const getDataApi = async () => {
  try {
    const response = await axios.get(`${API_URL}?action=getEvent`);

    if (response.status < 200 || response.status >= 300) {
      console.log("Network response was not ok");
      return null;
    }

    return response.data; // Return the data to be used by the calling function
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null or handle the error as needed
  }
};
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_URL}?action=insertimg`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.imgurl;
  } catch (error) {
    // Swal.fire({ icon: "error",
    //   title: "Upload Failed",
    //   text: "Failed to upload event attachment.",
    // });
    console.error("Error uploading event attachment:", error);
    throw error;
  }
};

export const viewRegistartionUserApi = async (eventId) => {
  try {
    const response = await axios.post(
      `${API_URL}?action=getRegistrationByEventId`,
      { sEventId: eventId } // Correctly send eventId as sEventId
    );

    if (response.status < 200 || response.status >= 300) {
      console.log("Network response was not ok");
      return null;
    }

    return response.data; // Return the data to be used by the calling function
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null or handle the error as needed
  }
};

export const getEventIdByTitle = async (eventId) => {
  try {
    const response = await axios.post(
      `${API_URL}?action=getEventByEventId`,
      { sEventId: eventId },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status < 200 || response.status >= 300) {
      console.log("Network response was not ok");
      return null;
    }

    return response.data; // Return the data to be used by the calling function
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null or handle the error as needed
  }
};
