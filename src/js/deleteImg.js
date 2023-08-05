import { storage } from "../lib/firebase";

export default async function deleteImg(imageUrl) {
  if (imageUrl !== "") {
    const imageRef = storage.refFromURL(imageUrl);
    try {
      await imageRef.delete();
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
}
