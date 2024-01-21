import { Post } from "@/types/post.types";
import { DialogProps } from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletePost } from "@/hooks/query/post.hooks";
import LoadingButton from "@/shared/others/LoadingButton";
import { useToast } from "../ui/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Prop extends DialogProps {
  post: Post;
}

const DeletePostDialog = ({ post, onOpenChange, ...props }: Prop) => {
  const delMutation = useDeletePost();
  const { toast } = useToast();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  const handleOpenChange = delMutation.isLoading ? undefined : onOpenChange;

  const onDelete = () => {
    delMutation.mutateAsync(post, {
      onSuccess: () => {
        toast({
          title: "Succesfully delete the post 🎉🎉",
        });
      },
    });
  };

  return (
    <AlertDialog {...props}>
      <AlertDialogContent className={`${isDarkMode ? "dark " : ""} bg-white`}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            Are you absolutely sure to delete the post?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex sm:justify-end justify-center space-x-[10px]">
          <LoadingButton
            disabled={delMutation.isLoading}
            variant={"outline"}
            onClick={() => handleOpenChange?.(false)}
            className="bg-white hover:bg-opacity-90 w-fit py-[10px] text-[15px]"
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={delMutation.isLoading}
            onClick={onDelete}
            className="w-fit py-[10px] !text-[15px]"
          >
            Continue
          </LoadingButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePostDialog;
