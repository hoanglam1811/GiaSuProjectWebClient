import axios from "axios";
import getEndpoint from "../getEndpoint";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

export async function RatePost(ratingDTO) {
  const response = await axios.post(
    `${getEndpoint()}/api/PostRating/Rate`,
    ratingDTO,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function GetPostRatings(postId) {
  const response = await axios.get(
    `${getEndpoint()}/api/PostRating/GetRatings?postId=${postId}`,
    ngrokSkipWarning,
  );
  return response.data;
}

export async function GetUserRating(postId, userId) {
    const response = await axios.get(
      `${getEndpoint()}/api/PostRating/GetUserRating?postId=${postId}&userId=${userId}`,
      ngrokSkipWarning
    );
    return response.data;
  }

  export async function GetRatingsByUser(userId) {
    const response = await axios.get(
      `${getEndpoint()}/api/PostRating/GetRatingsByUser?userId=${userId}`,
      ngrokSkipWarning
    );
    return response.data;
  }

  