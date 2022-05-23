/* eslint-disable import/no-anonymous-default-export */

import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { COLLECTION_DATA } from ".";
import { NO_SESSION } from "../../../utils/types";

const secret = process.env.NEXTAUTH_SECRET;


const UNAUTHORIZED = {
  error: "Unauthorized",
  message: "You may only update your own collections' metadata",
};

const BAD_REQUEST = {
  error: "Bad Request",
  message: "Missing body",
};

const RESOURCE_NOT_FOUND = {
  error: "Resource Not Found",
  message: "No collection exists for the ID",
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req, secret }); // Fetch JWT

  if (token == null) {
    res.status(401).json(NO_SESSION);
    return;
  }

  const collectionId = req.query.id as string;
  const principal = (req.query.id as string).split(".")[0];
  const index = COLLECTION_DATA.findIndex((col) => collectionId == col.id);

  if (index < 0) {
    res.status(404).json(RESOURCE_NOT_FOUND);
    return;
  }

  if (req.method == "GET") {
    res.status(200).json({ data: COLLECTION_DATA[index] });
  } else if (req.method == "PUT") {
    // Prevent updates unless by contract owning principal
    if (token?.sub != principal) {
      res.status(401).json(UNAUTHORIZED);
      return;
    }

    const details = req?.body;
    if (details == null) {
      res.status(400).json(BAD_REQUEST);
    } else {
      const prepared = COLLECTION_DATA[index];
      prepared.description = details.description;

      COLLECTION_DATA[index] = prepared;

      res.status(200).json({ data: prepared });
    }
  } else {
    res.status(405);
  }
};
