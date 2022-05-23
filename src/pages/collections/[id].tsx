import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { CollectionDetails } from "../api/collections";

interface PageData {
  data: CollectionDetails
}
const CollectionPage: NextPage = () => {

  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, mutate } = useCollection(id as string);
  const [description, setDescription] = useState<string | null>(null);


  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No collection data</p>

  const fetched = data as PageData;
  const collection = fetched.data;

  return (
    <>
      <Link href='/collections' ><button>Back</button></Link>
      <p>Collection ID: {collection.id}</p>
      <p>Owner: {collection.principal}</p>
      <p>Contract Name: {collection.contractName}</p>
      <p>Description: {collection.description}</p>
      <input
        type="text"
        id="description"
        name="description"
        onChange={e => setDescription(e.target.value)}
      />

      <button onClick={async () => {

        const newDescription = description;
        const response = await fetch(`/api/collections/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 'description': newDescription }),
        });

        const body = await response.json();

        if (!response.ok) {
          window.alert("Error occurred: " + body.error + ": " + body.message);
        } else {
          mutate({ ...data, description: newDescription })
        }
      }}>Update Description</button>

    </>
  )
};


export default CollectionPage;
