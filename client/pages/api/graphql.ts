import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { promisify } from "util";
import request from "request";

export default withApiAuthRequired(async function graphQL(req, res) {
  try {
    const session = getSession(req, res);
    const headers = {
      Authorization: `Bearer ${session?.idToken}`,
      'Content-Type': 'application/json'
    };
    const asyncReqPost = promisify(request.post);
    const graphQLApiResponse = await asyncReqPost({
      url: `${process.env.API_URL}`,
      headers,
      json: req.body,
      timeout: 5000,
      gzip: true
    });
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(graphQLApiResponse.body));
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
});
