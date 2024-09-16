import axios from "axios";
// import Swal from "sweetalert2";

//const API_URL = "http://192.168.1.18/Project/webservice.php";
const API_URL= "https://mysoftway.com/eventreg/webservice.php";

// for signup
export const ApiService = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}?action=signin`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// for login 
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}?action=login`, loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


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
    return response.data.fileUrl;
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
    return response.data.fileUrl;
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
    return response.data.fileUrl;
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
// export const fetchEvents = async () => {
//   try {
//     const response = await axios.get(`${API_URL}?action = getEvent`);

//     console.log( "You Can See Response :",response);
//     console.log("You can see Response Data:",response.data);
//     return response.data; // Adjust according to the actual response structure
//   } catch (error) {
//     throw error;
//   }
// };
