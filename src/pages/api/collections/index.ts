/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NO_SESSION } from "../../../utils/types";

export interface CollectionDetails {
  id: string;
  principal: string;
  contractName: string;
  description: string;
}

export let COLLECTION_DATA: CollectionDetails[] = [
  {
    id: "SP1MB4Q520CK2K5PD31NPF0K93B5S0JMXS0MCF3PC.foos-bars",
    principal: "SP1MB4Q520CK2K5PD31NPF0K93B5S0JMXS0MCF3PC",
    contractName: "foos-bars",
    description: "",
  },
  {
    id: "SP1MB4Q520CK2K5PD31NPF0K93B5S0JMXS0MCF3PC.potato-starch",
    principal: "SP1MB4Q520CK2K5PD31NPF0K93B5S0JMXS0MCF3PC",
    contractName: "potato-starch",
    description: "",
  },
  {
    id: "SP1HCA0BF4PX3G7064MA5JW0Q8Q8R6KYMG4DWQAZN.not-mine",
    principal: "SP1HCA0BF4PX3G7064MA5JW0Q8Q8R6KYMG4DWQAZN",
    contractName: "not-mine",
    description: "",
  },
];

const secret = process.env.NEXTAUTH_SECRET;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req, secret }); // Fetch JWT

  if (token == null) {
    res.status(401).json(NO_SESSION);
    return;
  }

  res.status(200).json({ data: COLLECTION_DATA });
};
