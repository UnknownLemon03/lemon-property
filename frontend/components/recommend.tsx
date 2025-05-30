import { Search, Share2 } from "lucide-react";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { clear } from "console";
import { SearchEmail, SendRecommendation } from "@/backend/backend";
import toast from "react-hot-toast";

export default function Recommend({ property_id }: { property_id: string }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const refInput = React.useRef<HTMLInputElement>(null);
  const [recommendations, setRecommendations] = React.useState<string[]>([]);
  let id: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(id);
    id = setTimeout(() => {
      if (searchTerm.length > 0) {
        // Simulate an API call to fetch recommendations
        SearchEmail(searchTerm)
          .then((res) => {
            console.log("Recommendations fetched:", res);
            if (res.success) {
              setRecommendations(res.data);
            } else {
              setRecommendations(["Email not found"]);
            }
          })
          .catch((error) => {
            console.error("Error fetching recommendations:", error);
            toast.error("Failed to fetch recommendations");
            setRecommendations([]);
          });
      } else setRecommendations([]);
    }, 800);
    return () => {
      clearTimeout(id);
    };
  }, [searchTerm]);

  async function handleRecommend(email: string) {
    SendRecommendation(email, property_id)
      .then((res) => {
        console.log("Recommendation sent:", res);
        if (res.success) {
          toast.success("Recommendation sent successfully");
        } else {
          toast.error(res.error || "Failed to send recommendation");
        }
      })
      .catch((error) => {
        console.error("Error sending recommendation:", error);
        toast.error("Failed to send recommendation");
      });
    setSearchTerm("");
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Share2 className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Search the gmail of the user you want to share
            </DialogDescription>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative w-full max-w-md  mx-2">
                <Input
                  type="email"
                  placeholder="Search..."
                  ref={refInput}
                  defaultValue={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {recommendations.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <ul className="divide-y divide-gray-100">
                      {recommendations.map((e, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setSearchTerm("");
                            setRecommendations([]);
                            refInput.current!.value = e;
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button
                    type="submit"
                    onClick={() => {
                      handleRecommend(searchTerm);
                      setRecommendations([]);
                      setSearchTerm("");
                    }}
                  >
                    Share
                  </Button>
                </DialogTrigger>
              </DialogFooter>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
