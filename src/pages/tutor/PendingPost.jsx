import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { TableVirtuoso } from "react-virtuoso";
import { GetUserInfo } from "../../services/ApiServices/UserService";
import {
  GetAllPost,
  GetPostById,
} from "../../services/ApiServices/PostService";

export function PendingPost({ userId }) {
  const [posts, setPosts] = useState([]);
  const [selectedPostDetails, setSelectedPostDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await GetAllPost();
      const pendingPosts = data.filter(
        (post) => post.status === "PENDING" && post.userId == userId,
      );
      const postsWithUserInfo = await Promise.all(
        pendingPosts.map(async (post) => {
          const userInfo = await GetUserInfo(post.userId);
          return {
            ...post,
            userName: userInfo.userName,
            email: userInfo.email,
          };
        }),
      );
      console.log(postsWithUserInfo);
      setPosts(postsWithUserInfo);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later.",
      );
    }
  };

  const handleViewPostDetails = async (postId) => {
    try {
      const post = await GetPostById(postId);
      const userInfo = await GetUserInfo(post.userId);
      setSelectedPostDetails({
        ...post,
        userName: userInfo.userName,
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later.",
      );
    }
  };

  const handleOpenImageModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setOpenImageModal(true);
  };

  const columns = [
    { width: 100, label: "ID", dataKey: "id" },
    { width: 150, label: "User Name", dataKey: "userName" },
    { width: 200, label: "Title", dataKey: "title" },
    { width: 300, label: "Description", dataKey: "description" },
    { width: 100, label: "Status", dataKey: "status" },
    { width: 100, label: "Image", dataKey: "imageUrl" },
  ];

  const rowContent = (_index, row) => (
    <>
      {columns.map((column) =>
        column.dataKey !== "actions" ? (
          <TableCell key={column.dataKey} align="left">
            {column.dataKey === "imageUrl" && row[column.dataKey] ? (
              <img
                src={row[column.dataKey]}
                alt="Post"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => handleOpenImageModal(row[column.dataKey])}
              />
            ) : (
              row[column.dataKey]
            )}
          </TableCell>
        ) : null,
      )}
    </>
  );

  return (
    <>
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 1200,
          width: "100%",
          mt: 4,
          mx: "auto",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#5c6bc0",
          }}
        >
          Post Requests
        </Typography>
        <Paper style={{ height: 400, width: "100%" }}>
          <TableVirtuoso
            data={posts}
            components={{
              Scroller: TableContainer,
              Table: (props) => (
                <Table {...props} sx={{ borderCollapse: "separate" }} />
              ),
              TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
              TableBody: React.forwardRef((props, ref) => (
                <TableBody {...props} ref={ref} />
              )),
            }}
            fixedHeaderContent={() => (
              <TableRow style={{ background: "white" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.dataKey}
                    align="left"
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            )}
            itemContent={rowContent}
          />
        </Paper>
      </Box>

      <Dialog
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={currentImage}
              alt="Full size"
              style={{ maxWidth: "350px", maxHeight: "100%" }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PendingPost;
