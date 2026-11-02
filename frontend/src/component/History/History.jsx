import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Skeleton from "@mui/material/Skeleton";
import Swal from "sweetalert2";

import styles from "./History.module.css";
import WithAuthHOC from "../../utils/HOC/withAuthHOC";
import axios from "../../utils/axios";
import { AuthContext } from "../../utils/AuthContext";

const History = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  const { userInfo, authLoading } = useContext(AuthContext);

  // Hide a resume from the user's history.
  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "This resume will be removed from your history.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await axios.patch(`/api/resume/hide-history/${id}`);

      setData((prev) => prev.filter((item) => item._id !== id));

      Swal.fire("Removed!", "Resume removed from history.", "success");
    } catch (err) {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Unable to remove resume.",
        "error"
      );
    }
  };

  // Fetch resumes only after Firebase authentication is restored.
  useEffect(() => {
    if (authLoading || !userInfo?._id) return;

    const fetchUserData = async () => {
      setLoader(true);

      try {
        const response = await axios.get(
          `/api/resume/get/${userInfo._id}`
        );

        setData(
          Array.isArray(response.data.resumes)
            ? response.data.resumes
            : []
        );
      } catch (err) {
        console.error("History Fetch Error:", err);

        Swal.fire(
          "Error!",
          "Something went wrong while fetching your history.",
          "error"
        );
      } finally {
        setLoader(false);
      }
    };

    fetchUserData();
  }, [authLoading, userInfo?._id]);

  return (
    <div className={styles.History}>
      <div className={styles.HistoryCardBlock}>
        {loader && (
          <>
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: "20px" }}
              width={266}
              height={200}
            />
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: "20px" }}
              width={266}
              height={200}
            />
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: "20px" }}
              width={266}
              height={200}
            />
            <Skeleton
              variant="rectangular"
              sx={{ borderRadius: "20px" }}
              width={266}
              height={200}
            />
          </>
        )}

        {!loader && data.length === 0 && !authLoading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📄</div>
            <h2>Your History is Empty</h2>
            <p>
              You haven't analyzed any resumes yet. Upload your first resume
              and let AI do the magic!
            </p>
            <button onClick={() => navigate("/dashboard")}>
              Analyze Resume
            </button>
          </div>
        )}

        {data.map((item) => {
          const resumeName = item.resume_name
            ? item.resume_name.replace(/\.pdf$/i, "")
            : "Resume name unavailable";

          return (
            <div key={item._id} className={styles.HistoryCard}>
              <div className={styles.cardPercentage}>{item.score}%</div>

              <p>
                Resume Name:{" "}
                {resumeName.charAt(0).toUpperCase() + resumeName.slice(1)}
              </p>

              <p
                style={{
                  display: expandedFeedback[item._id]
                    ? "block"
                    : "-webkit-box",
                  WebkitLineClamp: expandedFeedback[item._id] ? "unset" : 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: "1.5",
                }}
              >
                {item.feedback}
              </p>

              {item.feedback?.length > 250 && (
                <button
                  onClick={() =>
                    setExpandedFeedback((prev) => ({
                      ...prev,
                      [item._id]: !prev[item._id],
                    }))
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#6366f1",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {expandedFeedback[item._id] ? "Read Less" : "Read More"}
                </button>
              )}

              <p>
                Dated:{" "}
                {item.createdAt
                  ? item.createdAt.slice(0, 10)
                  : "Date unavailable"}
              </p>

              <button
                className={styles.DeleteBtn}
                onClick={() => handleDelete(item._id)}
              >
                <MdDelete />
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WithAuthHOC(History);