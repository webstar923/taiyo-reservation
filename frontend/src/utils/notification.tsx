import { toast } from "react-toastify";
import NotificationComponent from "@/app/shared/components/UI/Notification"; // Adjust the path as needed

export const notify = (
  notificationType: "success" | "error" | "warning",
  title: string,
  content: string
) => {
  switch (notificationType) {
    case "success":
      toast.success(
        <NotificationComponent
          notificationType={notificationType}
          title={title}
          content={content}
        />,
        {
          icon: false,
          closeButton: false,
          hideProgressBar: true,
        }
      );
      break;
    case "error":
      toast.error(
        <NotificationComponent
          notificationType={notificationType}
          title={title}
          content={content}
        />,
        {
          icon: false,
          closeButton: false,
          hideProgressBar: true,
        }
      );
      break;
    case "warning":
      toast.warning(
        <NotificationComponent
          notificationType={notificationType}
          title={title}
          content={content}
        />,
        {
          icon: false,
          closeButton: false,
          hideProgressBar: true,
        }
      );
      break;
    default:
      break;
  }
};
