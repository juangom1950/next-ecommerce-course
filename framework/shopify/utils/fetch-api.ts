import {
  ApiFetcherOptions,
  ApiFetcherResults
} from "@common/types/api"
import { API_URL, STOREFRONT_TOKEN } from "@framework/const"


// Video: "Specify Fetcher Return Type" 4:30min
const fetchApi = async <T>({
  query,
  variables }: ApiFetcherOptions
): Promise<ApiFetcherResults<T>> => {
  //const API_URL_TEST = "http://localhost:4000/graphql"
  //const res = await fetch(API_URL_TEST!, {
  const res = await fetch(API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN!
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
  // This is error handling
  const { data, errors} = await res.json()
  //console.log("API_URL: ", API_URL)
  // Video: "Move fetch API" 6:20min
  // ?? is checking if left hand expression is null or undefined -> if it is go with right expression
  // || is checking if left hand expression is null, undefined, "", 0, false
  // ex: const test = null || "Hello World" result would be "Hello World"
  if (errors) {
    throw new Error(errors[0].message ?? errors.message)
  }

  return { data }
}

export default fetchApi
