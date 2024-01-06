import { Post } from "@/types/post.types";
import { DialogProps } from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletePost } from "@/hooks/post.hooks";
import LoadingButton from "@/shared/others/LoadingButton";
import { useToast } from "../ui/use-toast";

interface Prop extends DialogProps {
  post: Post;
}

const DeletePostDialog = ({ post, onOpenChange, ...props }: Prop) => {
  const delMutation = useDeletePost();
  const { toast } = useToast();

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to delete the post?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <LoadingButton
            disabled={delMutation.isLoading}
            variant={"outline"}
            onClick={() => handleOpenChange?.(false)}
            className="bg-white hover:bg-gray-50 w-fit py-[10px]"
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={delMutation.isLoading}
            onClick={onDelete}
            className="w-fit py-[10px] !text-[12px]"
          >
            Continue
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePostDialog;
