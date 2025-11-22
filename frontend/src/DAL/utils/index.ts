import { env } from "@/env";
import createClient from "openapi-fetch";
import { paths } from "../api-types";

export const api = createClient<paths>({
  baseUrl: env.NEXT_PUBLIC_BACKEND_BASE_URL,
  credentials: "include",
});

// const textChunk = "Hello, ";
// const binaryChunk = new Uint8Array([77, 121, 32, 76, 111, 118, 101]); // ASCII for "My Love"
// const anotherBlob = new Blob(["World!"]);

// const myBlob = new Blob([textChunk, binaryChunk, anotherBlob], {
//   type: "text/plain",
// });

// // const image = await fetch("https://example.com/image.png");
// // const bytes = await image.bytes();
// // new File([bytes], 'image.png')

// const something = await api.POST("/api/product", {
//   body: {
//     categorySlug: "dfas",
//     name: "fdaksl",
//     price: 23910,
//     slug: "safdklj",
//     productImages: [await anotherBlob.text()],
//   },
// });
