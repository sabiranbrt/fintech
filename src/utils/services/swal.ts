/* eslint-disable @typescript-eslint/no-unused-expressions */
import Swal from "sweetalert2";
// import { Messages } from "../../constants/locales/messages";
const Messages = {
  noResp: "Something went wrong!",
  confirmProceed: "Do you wish to proceed?",
  ensureDateFormat: "Please ensure the date is in mm-dd-yyyy format.",
};

export const ShowSwalMsg = (icon: TODO, msg:TODO) => {
  return Swal.fire({
    title: getSwalTitle(icon),
    text: msg,
    icon,
  }).then(() => {
    console.log("Reload stopped");
    // window.location.reload(); // Refresh the page after Swal is closed
  });
}

export const getSwalTitle = (val: string) => {
  switch (val) {
    case "error":
      return "Error!";
    case "warning":
      return "Warning!";
    case "success":
      return "Success!";
    case "info":
      return "Info!";
    case "question":
      return "Confirmation";
    default:
      return "";
  }
}

export const ShowSwalWithResult = (icon:TODO, msg:TODO) => {
  return Swal.fire({
    title: getSwalTitle(icon),
    text: msg,
    icon,
    allowOutsideClick: false,
    showDenyButton: true,
    denyButtonText: "No",
  });
}

export const CustomSwal = (icon:TODO, msg:TODO, subMsg = "") => {
  Swal.fire({
    title: msg,
    icon,
    html: `<div style="display: flex; flex-direction: row; justify-content: flex-end; font-size: 10px"> ${subMsg}</div>`,
  });
}

export const htmlSwal = (resp:TODO) => {
  return Swal.fire({
    title: "Error!",
    icon: "error",
    html: `<div style="display: flex; flex-direction: column; justify-content: center;">${
      resp?.responseMessage ?? Messages.noResp
    }<div style="display: flex; flex-direction: row; justify-content: flex-end; font-size: 8px; margin-top: 15px;">${
      resp?.responseFrom ?? ""
    }</div></div>`,
  });
}

export const javaHtmlSwal = (resp: TODO) => {
  return Swal.fire({
    title: "Error!",
    icon: "error",
    html: `<div style="display: flex; flex-direction: column; justify-content: center;">${
      resp?.apiResponseData?.responseMessage
        ? resp?.apiResponseData?.responseMessage
        : resp?.responseMessage ?? Messages.noResp
    }<div style="display: flex; flex-direction: row; justify-content: flex-end; font-size: 8px; margin-top: 15px;">${
      resp?.apiResponseFrom ?? ""
    }</div></div>`,
  });
}

export const AreYouSureSwal = ( title:TODO, fxn:TODO ) => {
  Swal.fire({
    title: title ?? "Confirmation!",
    icon: "question",
    text: "Do you want to proceed?",
    showCancelButton: true,
    confirmButtonText: "Okay",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      fxn && fxn();
    }
  });
}
