import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardActionArea,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Popover,
  CardContent,
  CardActions,
  Rating,
  Snackbar,
  SnackbarContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  DeletePost,
  GetAllPost,
  UpdatePost,
} from "../../services/ApiServices/PostService";
import { GetUserInfo } from "../../services/ApiServices/UserService";
import { GetPostRatings, RatePost, GetUserRating } from "../../services/ApiServices/PostRatingService";
import moment from "moment";
import { GetAllFeedbackByTutorId } from "../../services/ApiServices/FeedbackService";

export function PostPage({ id }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState({});
  const [tutorProfile, setTutorProfile] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();
  const [userHasRated, setUserHasRated] = useState(false);
  const [userRatings, setUserRatings] = useState({});
  const [showRatingSnackbar, setShowRatingSnackbar] = useState(false);

  const fetchPosts = async () => {
    try {
      // Lấy danh sách bài viết và thông tin người dùng
      const data = await GetAllPost();
      const activePosts = data.filter((post) => post.status === "ACTIVE");
      activePosts.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setPosts(activePosts);

      const userPromises = activePosts.map((post) => GetUserInfo(post.userId));
      const usersData = await Promise.all(userPromises);
      const usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
      setUsers(usersMap);

      // Lấy danh sách đánh giá cho từng bài viết
      const ratingPromises = activePosts.map((post) => GetPostRatings(post.id));
      const ratingsData = await Promise.all(ratingPromises);
      const ratingsMap = activePosts.reduce((acc, post, index) => {
        acc[post.id] = ratingsData[index].averageRating || 0;
        return acc;
      }, {});
      setRatings(ratingsMap);

      // Lấy số sao mà người dùng đã đánh giá cho từng bài viết
      const userRatingPromises = activePosts.map((post) =>
        GetUserRating(post.id, id).then((userRating) => ({
          postId: post.id,
          rating: userRating.rating || 0,
        }))
      );
      const userRatingsData = await Promise.all(userRatingPromises);
      const userRatingsMap = userRatingsData.reduce((acc, rating) => {
        acc[rating.postId] = rating.rating;
        return acc;
      }, {});
      setUserRatings(userRatingsMap);

      // Kiểm tra xem người dùng có đã đánh giá bài viết hay chưa
      const userHasRatedPromises = activePosts.map((post) =>
        GetPostRatings(post.id).then((postRatings) =>
          postRatings.some((rating) => rating.userId === id)
        )
      );
      const userRatings = await Promise.all(userHasRatedPromises);
      const userHasRatedMap = activePosts.reduce((acc, post, index) => {
        acc[post.id] = userRatings[index];
        return acc;
      }, {});
      setUserHasRated(userHasRatedMap);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
          "An error occurred. Please try again later."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleUserClick = async (userId) => {
    const user = users[userId];
    if (user) {
      setTutorProfile(user);
      const feedbackResponse = await GetAllFeedbackByTutorId(userId);
      setFeedbackList(feedbackResponse);
      setProfileDialogOpen(true);
    }
  };

  const handleCloseProfileDialog = () => {
    setProfileDialogOpen(false);
    setTutorProfile(null);
  };

  const handlePopoverOpen = (event, postId, userId) => {
    if (id && userId == id) {
      console.log("Popover opened for postId:", postId);
      setPopoverAnchorEl(event.currentTarget);
      setCurrentPostId(postId);
    }
  };

  const openPopover = Boolean(popoverAnchorEl);

  const handlePopoverClose = () => {
    console.log("Popover closed");
    setPopoverAnchorEl(null);
    setCurrentPostId(null);
  };

  const handleUpdatePost = (postId, userId) => {
    if (id && userId === id) {
      navigate(`/update-post/${postId}`);
    }
  };

  const handleDeleteButtonClick = (postId, userId) => {
    if (id && userId == id) {
      setPostIdToDelete(postId);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await DeletePost(postIdToDelete);
      setPopoverAnchorEl(null);
      console.log(`Post with ID ${postIdToDelete} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeleteDialogOpen(false);
      fetchPosts();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostIdToDelete(null);
  };

  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  const handleRatingChange = async (postId, newValue) => {
    try {
      const postRatings = await GetPostRatings(postId);
      const userHasRated = postRatings.some((rating) => rating.userId === id);
  
      if (userHasRated) {
        
        return;
      }
  
      // Tiếp tục xử lý rating nếu người dùng chưa đánh giá
      await RatePost({
        postId,
        userId: id,
        status: "Active",
        rating: newValue,
      });
  
      // Cập nhật state với ratings mới
      setUserRatings((prev) => ({
        ...prev,
        [postId]: newValue,
      }));
  
      setUserHasRated((prev) => ({
        ...prev,
        [postId]: true,
      }));
  
      fetchPosts(); 
    } catch (error) {
      setShowRatingSnackbar(true); 
    }
  };
    

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h6">No Posts</Typography>
      </Box>
    );
  }

  return (
    <Box p={2} maxWidth="2000px" mx="auto">
      <Typography
        variant="h4"
        gutterBottom
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#5c6bc0",
        }}
      >
        Newsfeed
      </Typography>
      {posts.map((post) => {
        let imageUrls = [];
        try {
          imageUrls = JSON.parse(post.imageUrl);
        } catch (error) {
          imageUrls = [post.imageUrl];
        }

        return (
          <Box key={post.id} mb={3} mx="auto" maxWidth={600}>
            <Card
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={users[post.userId]?.avatar}
                      alt={users[post.userId]?.userName}
                      sx={{ width: 56, height: 56, border: "2px solid #5c6bc0" }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        marginLeft: 1,
                        fontSize: "17px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() => handleUserClick(post.userId)}
                    >
                      {users[post.userId]?.userName}
                    </Typography>
                  </Box>

                  {id && post.userId == id && (
                    <Button
                      style={{
                        fontSize: "20px",
                        color: "#5c6bc0",
                        fontWeight: "bold",
                      }}
                      onClick={(event) => {
                        console.log("Popover button clicked");
                        handlePopoverOpen(event, post.id, post.userId);
                      }}
                    >
                      ...
                    </Button>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                  {new Date(post.createdDate).toLocaleDateString()}
                </Typography>
                <Typography variant="h5" component="div" sx={{ p: 1 }}>
                  {post.title}
                </Typography>
                <Typography variant="body1" sx={{ p: 1, whiteSpace: "pre-line" }} dangerouslySetInnerHTML={createMarkup(post.description)} />
                <Box display="flex" alignItems="center" sx={{ p: 1 }}>
                  <Typography variant="body2" sx={{ marginRight: 1 }}>
                    Your Rating:
                  </Typography>
                  <Rating
                    name={`rating-${post.id}`}
                    value={userRatings[post.id] || 0}
                    precision={1}
                    disabled={userHasRated[post.id]}
                    onChange={(event, newValue) => handleRatingChange(post.id, newValue)}
                  />

                </Box>
              </CardContent>
              {imageUrls.map((url, index) => (
                <CardActionArea
                  key={index}
                  onClick={() => navigate(`/posts/${post.id}`)}
                  sx={{ flexGrow: 1 }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={url}
                    alt={post.title}
                    sx={{ objectFit: "cover", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                  />
                </CardActionArea>
              ))}
            </Card>
          </Box>
        );
      })}
      <Snackbar
        open={showRatingSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowRatingSnackbar(false)}
      >
        <SnackbarContent
          sx={{ backgroundColor: "#f44336" }}
          message="You have already rated for this post!"
        />
      </Snackbar>
      <Popover
        open={openPopover}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box p={2}>
          <Button
            variant="text"
            onClick={() => {
              handleUpdatePost(currentPostId, id);
            }}
          >
            Update
          </Button>
          <Button
            variant="text"
            onClick={() => {
              handleDeleteButtonClick(currentPostId, id);
            }}
          >
            Delete
          </Button>
        </Box>
      </Popover>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this post?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Yes
          </Button>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={profileDialogOpen}
        onClose={handleCloseProfileDialog}
        aria-labelledby="profile-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle variant="h4" id="profile-dialog-title">
          Tutor Profile
        </DialogTitle>
        <DialogContent>
          {tutorProfile && (
            <>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={tutorProfile.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    marginRight: 2,
                  }}
                />
              </Box>
              <div>
                <Typography>
                  <strong>Name: </strong>
                  {tutorProfile.userName}
                </Typography>
                <Typography>
                  <strong>Email: </strong>
                  {tutorProfile.email}
                </Typography>
                <Typography>
                  <strong>Phone Number: </strong>
                  {tutorProfile.phoneNumber}
                </Typography>
                <Typography>
                  <strong>Address: </strong>
                  {tutorProfile.address}
                </Typography>
                <Typography>
                  <strong>Gender: </strong>
                  {tutorProfile.gender}
                </Typography>
                <Typography>
                  <strong>Credentials:</strong>
                </Typography>
                {tutorProfile.credentials &&
                  tutorProfile.credentials.map((credential, index) => (
                    <div key={index}>
                      <Typography className="block" variant="body1" component="p">
                        - {credential.name}:
                      </Typography>
                      <img
                        src={credential.image}
                        alt={`Credential ${index + 1}`}
                        style={{
                          display: "flex",
                          maxWidth: "60%",
                          margin: "10px auto",
                        }}
                      />
                      <br />
                    </div>
                  ))}
                  <Typography variant="h6" mt={2}>
                <strong>Feedback</strong>
              </Typography>
              {feedbackList.length > 0 ? (
                <TableContainer className="mt-2" component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Rating (Star)</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feedbackList.map((feedback) => (
                        <TableRow key={feedback.id}>
                          <TableCell>{feedback.content}</TableCell>
                          <TableCell>{feedback.subjectName}</TableCell>
                          <TableCell>{feedback.levelName}</TableCell>
                          <TableCell>{feedback.rating}</TableCell>
                          <TableCell>{moment(feedback.createdDate).format("DD-MM-YYYY")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No feedback available</Typography>
              )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}