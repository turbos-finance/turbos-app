import { toast, ToastContent, ToastOptions } from "react-toastify";

export const Toast = {
    success: (content: ToastContent, opts?: ToastOptions) => {
        toast.dismiss();
        toast.success(content, {
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
        });
    },
    error: (content: ToastContent, opts?: ToastOptions) => {
        toast.dismiss();
        toast.error(content, {
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'dark'
        });
    },
};
