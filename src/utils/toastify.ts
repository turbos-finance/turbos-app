import { toast, ToastContent, ToastOptions } from "react-toastify";

export const Toast = {
    success: (content: ToastContent, opts?: ToastOptions) => {
        toast.dismiss();
        toast(content, {
            theme: "light",
        });
    },
    error: (content: ToastContent, opts?: ToastOptions) => {
        toast.dismiss();
        toast(content, {
            theme: 'dark'
        });
    },
};
