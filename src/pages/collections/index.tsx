import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCollections } from "../../hooks/useCollections";
import { CollectionDetails } from "../api/collections";


interface PageData {
  data: CollectionDetails[]
}
const CollectionsPage: NextPage = () => {

  const { data, isLoading } = useCollections();

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  const fetched = data as PageData;
  return (
    <>
      {
        fetched.data.map((col) => {
          return (
            <>
              <p>{col.id}</p>
              <Link href={`/collections/${col.id}`}>
                <button> Go </button>
              </Link>
            </>
          );
        })}
    </>
  )
};

export default CollectionsPage;