import { UpdateFavorite } from "@/backend/backend";
import { Heart, HeartCrack, HeartCrackIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";

export default function FavoriteSend({
  favorite = false,
  id,
}: {
  favorite?: boolean;
  id: string;
}) {
  const [isFavorite, setIsFavorite] = React.useState(favorite);
  function handleFavorite() {
    console.log("Toggling favorite for ID:", id, "Current state:", isFavorite);
    UpdateFavorite(id, !isFavorite)
      .then((res) => {
        if (res.error) {
          console.error("Error updating favorite:", res.error);
          toast.error(res.error ?? "Failed to update favorite");
        } else {
          console.log("Favorite updated successfully");
          toast.success("Favorite updated successfully");
          setIsFavorite(!isFavorite);
        }
      })
      .catch((err) => {
        console.error("Error updating favorite:", err);
        toast.error("Failed to update favorite");
      });
  }
  return (
    <>
      <div className="cursor-pointer" onClick={handleFavorite}>
        {isFavorite ? (
          <Image src={"/heart.png"} height={28} width={28} alt="Heart" />
        ) : (
          <Heart />
        )}
      </div>
    </>
  );
}
