import React, { useState, useEffect } from "react";
import styles from "./Admin.module.css";
import Skeleton from "@mui/material/Skeleton";
import WithAuthHOC from "../../utils/HOC/withAuthHOC";
import axios from "../../utils/axios";
import Swal from "sweetalert2";

const Admin = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  // Fetch all resumes visible to the admin.
  useEffect(() => {
    const fetchAllData = async () => {
      setLoader(true);

      try {
        const results = await axios.get("/api/resume/get");
        setData(results.data.resumes || []);
      } catch (err) {
        console.error("Admin Resume Fetch Error:", err);
        Swal.fire("Error", "Unable to fetch resumes.", "error");
      } finally {
        setLoader(false);
      }
    };

    fetchAllData();
  }, []);

  // Hide a resume from the admin dashboard without deleting it.
  const handleHideFromAdmin = async (id) => {
    const confirmation = await Swal.fire({
      title: "Remove from Admin?",
      text: "This resume will remain visible in the user's History.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Remove",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await axios.patch(`/api/resume/hide-admin/${id}`);

      setData((prev) => prev.filter((item) => item._id !== id));

      Swal.fire("Removed!", "Resume removed from Admin dashboard.", "success");
    } catch (err) {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Unable to remove resume.",
        "error",
      );
    }
  };

  // Permanently delete a resume from the database.
  const handlePermanentDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Permanently Delete?",
      text: "This resume will be deleted from both Admin and user's History. This action cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete Permanently",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await axios.delete(`/api/resume/${id}`);

      setData((prev) => prev.filter((item) => item._id !== id));

      Swal.fire("Deleted!", "Resume permanently deleted.", "success");
    } catch (err) {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Unable to delete resume.",
        "error",
      );
    }
  };

  return (
    <div className={styles.Admin}>
      <div className={styles.AdminBlock}>
        {loader &&
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              sx={{ borderRadius: "20px" }}
              width="100%"
              height={400}
            />
          ))}

        {!loader && data.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📂</div>
            <h2>No Resumes Yet!</h2>
            <p>
              No resumes have been uploaded yet. Once users upload their
              resumes, they will appear here.
            </p>
          </div>
        )}

        {data.map((item) => (
          <div key={item._id} className={styles.AdminCard}>
            <div className={styles.userDetails}>
              <h2>{item?.user?.name || "Unknown User"}</h2>

              <p className={styles.userEmail}>
                {item?.user?.email || "Email unavailable"}
              </p>

              <div className={styles.resumeDetails}>
                <h4>Resume Name</h4>
                <p>
                  {item?.resume_name
                    ? item.resume_name.replace(/\.pdf$/i, "")
                    : "Resume name unavailable"}
                </p>
              </div>
            </div>

            <div className={styles.scoreSection}>
              <h3>Score: {item.score}%</h3>
            </div>

            <div className={styles.feedbackSection}>
              <h4>AI Feedback</h4>

              <p
                className={
                  expandedFeedback[item._id]
                    ? styles.fullFeedback
                    : styles.shortFeedback
                }
              >
                {item.feedback}
              </p>

              {item.feedback?.length > 250 && (
                <button
                  className={styles.readMoreBtn}
                  onClick={() =>
                    setExpandedFeedback((prev) => ({
                      ...prev,
                      [item._id]: !prev[item._id],
                    }))
                  }
                >
                  {expandedFeedback[item._id] ? "Read Less" : "Read More"}
                </button>
              )}
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.hideBtn}
                onClick={() => handleHideFromAdmin(item._id)}
              >
                Remove from Admin
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => handlePermanentDelete(item._id)}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithAuthHOC(Admin);
