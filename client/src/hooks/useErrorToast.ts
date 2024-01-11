import { useToast } from "@/components/ui/use-toast";

const useErrorToast = () => {
  const { toast } = useToast();

  const errToast = (error: any, title: string) => {
    toast({
      title,
      description: error.response.data.message,
      variant: "destructive",
    });
  };

  return errToast;
};

export default useErrorToast;
