import { useState, useContext } from "react";
import styles from "./Dashboard.module.css";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import Skeleton from "@mui/material/Skeleton";
import WithAuthHOC from "../../utils/HOC/withAuthHOC";
import axios from "../../utils/axios";
import { AuthContext } from "../../utils/AuthContext.js";
import { FaUserCircle } from "react-icons/fa";

const Dashboard = () => {
  const [uploadFiletext, setuploadFileText] = useState("Upload your resume");
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showFullFeedback, setShowFullFeedback] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { userInfo } = useContext(AuthContext);

  const handleOnChangeFile = (e) => {
    const file = e.target.files?.[0];

    // Ignore the change if the file picker is cancelled.
    if (!file) return;

    setResumeFile(file);
    setuploadFileText(file.name);
    setError("");
  };

  const handleUpload = async () => {
    setResult(null);
    setShowFullFeedback(false);
    setError("");

    if (!jobDesc.trim() || !resumeFile) {
      setError("Please enter Job Description and upload your resume.");
      return;
    }

    // Prepare resume and job description for the backend API.
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_desc", jobDesc);
    formData.append("user", userInfo._id);

    setLoading(true);

    try {
      const response = await axios.post("/api/resume/addResume", formData);
      setResult(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Retry loading the profile image after a temporary failure.
  const handleImageError = () => {
    setImageError(true);

    setTimeout(() => {
      setImageError(false);
    }, 20000);
  };

  return (
    <div className={styles.Dashboard}>
      {" "}
      <div className={styles.DashboardLeft}>
        {" "}
        <div className={styles.DashboardHeader}>
          {" "}
          <div className={styles.DashboardHeaderTitle}>
            Smart Resume Screening{" "}
          </div>{" "}
          <div className={styles.DashboardHeaderLargeTitle}>
            Resume Match Score{" "}
          </div>{" "}
        </div>
        <div className={styles.alertInfo}>
          <div>🔔 Important Instruction</div>
          <div className={styles.dashboardInstruction}>
            <div>
              📄 Please paste the complete job description in the "Job
              Description" field before submitting.
            </div>
            <div>🧷 Only PDF format (.pdf) resumes are accepted.</div>
          </div>
        </div>
        <div className={styles.DashboardUploadResume}>
          <div className={styles.DashboardResumeBlock}>{uploadFiletext}</div>

          <div className={styles.DashboardInputFeild}>
            <label htmlFor="inputFeild" className={styles.analyzeAIBtn}>
              Upload Resume
            </label>

            <input
              type="file"
              accept=".pdf"
              id="inputFeild"
              onChange={handleOnChangeFile}
            />
          </div>
        </div>
        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
        <div className={styles.jobDesc}>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className={styles.textArea}
            placeholder="Paste Your Job Description"
            rows={10}
            cols={50}
          />

          <button
            className={styles.AnalyzeBtn}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </button>
        </div>
      </div>
      <div className={styles.DashboardRight}>
        <div className={styles.DashboardRightTopCard}>
          <div>Analyze with AI</div>

          {userInfo?.photoUrl && !imageError ? (
            <img
              className={styles.profileImg}
              src={userInfo.photoUrl.replace(/=s\d+-c$/, "=s256-c")}
              alt="Profile"
              onError={handleImageError}
            />
          ) : (
            <FaUserCircle className={styles.defaultProfileIcon} />
          )}

          <h2>{userInfo?.name}</h2>
        </div>

        {result && (
          <div className={styles.DashboardRightTopCard}>
            <div>Result</div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
              }}
            >
              <h1>{result?.score}%</h1>
              <CreditScoreIcon sx={{ fontSize: 24 }} />
            </div>

            <div className={styles.feedback}>
              <h3>Feedback</h3>

              <p
                style={{
                  display: showFullFeedback ? "block" : "-webkit-box",
                  WebkitLineClamp: showFullFeedback ? "unset" : 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: "1.5",
                }}
              >
                {result?.feedback}
              </p>

              {result?.feedback?.length > 250 && (
                <button
                  onClick={() => setShowFullFeedback(!showFullFeedback)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#6366f1",
                    cursor: "pointer",
                    fontWeight: "600",
                    marginTop: "8px",
                  }}
                >
                  {showFullFeedback ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          </div>
        )}

        {loading && (
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: "20px" }}
            width={280}
            height={280}
          />
        )}
      </div>
    </div>
  );
};

export default WithAuthHOC(Dashboard);
