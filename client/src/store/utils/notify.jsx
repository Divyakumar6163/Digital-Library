import { toast } from "react-toastify";

 const notify = (message, style) => toast(message, { theme: "light", ...style });

 export { notify} ;